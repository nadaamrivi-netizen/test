<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';

$method = $_SERVER['REQUEST_METHOD'];
$conn = getConnection();

switch ($method) {
    case 'GET':
        getOrders();
        break;
    case 'POST':
        createOrder();
        break;
    case 'PUT':
        updateOrder();
        break;
    case 'DELETE':
        deleteOrder();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getOrders() {
    global $conn;
    
    try {
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        $status = isset($_GET['status']) ? $_GET['status'] : null;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
        $offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
        
        if ($id) {
            // Get specific order with items
            $sql = "SELECT o.*, 
                           GROUP_CONCAT(CONCAT(oi.quantity, 'x ', m.name) SEPARATOR ', ') as items_summary
                    FROM orders o
                    LEFT JOIN order_items oi ON o.id = oi.order_id
                    LEFT JOIN menu_items m ON oi.menu_item_id = m.id
                    WHERE o.id = ?
                    GROUP BY o.id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$id]);
            $order = $stmt->fetch();
            
            if (!$order) {
                http_response_code(404);
                echo json_encode(['error' => 'Order not found']);
                return;
            }
            
            // Get order items
            $sql = "SELECT oi.*, m.name as menu_name, m.image as menu_image
                    FROM order_items oi
                    LEFT JOIN menu_items m ON oi.menu_item_id = m.id
                    WHERE oi.order_id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$id]);
            $items = $stmt->fetchAll();
            
            $order['items'] = $items;
            
            echo json_encode(['success' => true, 'data' => $order]);
        } else {
            // Get all orders
            $sql = "SELECT o.*, 
                           GROUP_CONCAT(CONCAT(oi.quantity, 'x ', m.name) SEPARATOR ', ') as items_summary
                    FROM orders o
                    LEFT JOIN order_items oi ON o.id = oi.order_id
                    LEFT JOIN menu_items m ON oi.menu_item_id = m.id";
            $params = [];
            
            if ($status) {
                $sql .= " WHERE o.status = ?";
                $params[] = $status;
            }
            
            $sql .= " GROUP BY o.id ORDER BY o.created_at DESC LIMIT ? OFFSET ?";
            $params[] = $limit;
            $params[] = $offset;
            
            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
            $orders = $stmt->fetchAll();
            
            // Get total count
            $countSql = "SELECT COUNT(*) FROM orders";
            if ($status) {
                $countSql .= " WHERE status = ?";
                $countStmt = $conn->prepare($countSql);
                $countStmt->execute([$status]);
            } else {
                $countStmt = $conn->prepare($countSql);
                $countStmt->execute();
            }
            $total = $countStmt->fetchColumn();
            
            echo json_encode([
                'success' => true, 
                'data' => $orders,
                'pagination' => [
                    'total' => $total,
                    'limit' => $limit,
                    'offset' => $offset,
                    'pages' => ceil($total / $limit)
                ]
            ]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function createOrder() {
    global $conn;
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['customer']) || !isset($input['items']) || empty($input['items'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Customer data and items are required']);
            return;
        }
        
        $customer = $input['customer'];
        $items = $input['items'];
        
        // Validate customer data
        if (!isset($customer['name']) || !isset($customer['phone']) || !isset($customer['address'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Customer name, phone, and address are required']);
            return;
        }
        
        // Calculate total
        $total = 0;
        foreach ($items as $item) {
            if (!isset($item['id']) || !isset($item['quantity']) || !isset($item['price'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Invalid item data']);
                return;
            }
            $total += $item['price'] * $item['quantity'];
        }
        
        // Add delivery fee if applicable
        $deliveryFee = getSetting('delivery_fee', 0);
        $minimumOrder = getSetting('minimum_order', 0);
        
        if ($total < $minimumOrder) {
            $total += $deliveryFee;
        }
        
        $conn->beginTransaction();
        
        try {
            // Create order
            $orderNumber = generateOrderNumber();
            $sql = "INSERT INTO orders (order_number, customer_name, customer_phone, customer_address, 
                                       customer_notes, total_amount, payment_method) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                $orderNumber,
                $customer['name'],
                $customer['phone'],
                $customer['address'],
                $customer['notes'] ?? '',
                $total,
                $input['payment_method'] ?? 'cash'
            ]);
            
            $orderId = $conn->lastInsertId();
            
            // Create order items
            $sql = "INSERT INTO order_items (order_id, menu_item_id, quantity, price, subtotal, notes) 
                    VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $conn->prepare($sql);
            
            foreach ($items as $item) {
                $subtotal = $item['price'] * $item['quantity'];
                $stmt->execute([
                    $orderId,
                    $item['id'],
                    $item['quantity'],
                    $item['price'],
                    $subtotal,
                    $item['notes'] ?? ''
                ]);
            }
            
            $conn->commit();
            
            // Get created order
            $sql = "SELECT o.*, 
                           GROUP_CONCAT(CONCAT(oi.quantity, 'x ', m.name) SEPARATOR ', ') as items_summary
                    FROM orders o
                    LEFT JOIN order_items oi ON o.id = oi.order_id
                    LEFT JOIN menu_items m ON oi.menu_item_id = m.id
                    WHERE o.id = ?
                    GROUP BY o.id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$orderId]);
            $order = $stmt->fetch();
            
            echo json_encode([
                'success' => true, 
                'data' => $order, 
                'message' => 'Order created successfully'
            ]);
            
        } catch (Exception $e) {
            $conn->rollback();
            throw $e;
        }
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function updateOrder() {
    global $conn;
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Order ID is required']);
            return;
        }
        
        // Check if order exists
        $sql = "SELECT id FROM orders WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Order not found']);
            return;
        }
        
        // Update order
        $updateFields = [];
        $params = [];
        
        if (isset($input['status'])) {
            $updateFields[] = 'status = ?';
            $params[] = $input['status'];
        }
        
        if (isset($input['payment_status'])) {
            $updateFields[] = 'payment_status = ?';
            $params[] = $input['payment_status'];
        }
        
        if (isset($input['payment_method'])) {
            $updateFields[] = 'payment_method = ?';
            $params[] = $input['payment_method'];
        }
        
        if (isset($input['customer_name'])) {
            $updateFields[] = 'customer_name = ?';
            $params[] = $input['customer_name'];
        }
        
        if (isset($input['customer_phone'])) {
            $updateFields[] = 'customer_phone = ?';
            $params[] = $input['customer_phone'];
        }
        
        if (isset($input['customer_address'])) {
            $updateFields[] = 'customer_address = ?';
            $params[] = $input['customer_address'];
        }
        
        if (isset($input['customer_notes'])) {
            $updateFields[] = 'customer_notes = ?';
            $params[] = $input['customer_notes'];
        }
        
        if (empty($updateFields)) {
            http_response_code(400);
            echo json_encode(['error' => 'No fields to update']);
            return;
        }
        
        $updateFields[] = 'updated_at = CURRENT_TIMESTAMP';
        $params[] = $id;
        
        $sql = "UPDATE orders SET " . implode(', ', $updateFields) . " WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        
        // Get updated order
        $sql = "SELECT o.*, 
                       GROUP_CONCAT(CONCAT(oi.quantity, 'x ', m.name) SEPARATOR ', ') as items_summary
                FROM orders o
                LEFT JOIN order_items oi ON o.id = oi.order_id
                LEFT JOIN menu_items m ON oi.menu_item_id = m.id
                WHERE o.id = ?
                GROUP BY o.id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        $order = $stmt->fetch();
        
        echo json_encode([
            'success' => true, 
            'data' => $order, 
            'message' => 'Order updated successfully'
        ]);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function deleteOrder() {
    global $conn;
    
    try {
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Order ID is required']);
            return;
        }
        
        // Check if order exists
        $sql = "SELECT id FROM orders WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Order not found']);
            return;
        }
        
        // Delete order (cascade will delete order items)
        $sql = "DELETE FROM orders WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        
        echo json_encode(['success' => true, 'message' => 'Order deleted successfully']);
        
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?> 