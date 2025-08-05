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
        getMenu();
        break;
    case 'POST':
        createMenuItem();
        break;
    case 'PUT':
        updateMenuItem();
        break;
    case 'DELETE':
        deleteMenuItem();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

function getMenu() {
    global $conn;
    
    try {
        $category = isset($_GET['category']) ? $_GET['category'] : null;
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if ($id) {
            // Get specific menu item
            $sql = "SELECT m.*, c.name as category_name 
                    FROM menu_items m 
                    LEFT JOIN menu_categories c ON m.category_id = c.id 
                    WHERE m.id = ? AND m.is_available = 1";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$id]);
            $result = $stmt->fetch();
            
            if ($result) {
                echo json_encode(['success' => true, 'data' => $result]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Menu item not found']);
            }
        } else {
            // Get all menu items
            $sql = "SELECT m.*, c.name as category_name 
                    FROM menu_items m 
                    LEFT JOIN menu_categories c ON m.category_id = c.id 
                    WHERE m.is_available = 1";
            $params = [];
            
            if ($category && $category !== 'all') {
                $sql .= " AND c.name = ?";
                $params[] = $category;
            }
            
            $sql .= " ORDER BY c.name, m.name";
            
            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
            $results = $stmt->fetchAll();
            
            echo json_encode(['success' => true, 'data' => $results]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function createMenuItem() {
    global $conn;
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['name']) || !isset($input['price']) || !isset($input['category_id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields']);
            return;
        }
        
        $sql = "INSERT INTO menu_items (name, description, price, category_id, image) 
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            $input['name'],
            $input['description'] ?? '',
            $input['price'],
            $input['category_id'],
            $input['image'] ?? null
        ]);
        
        $id = $conn->lastInsertId();
        
        // Get the created item
        $sql = "SELECT m.*, c.name as category_name 
                FROM menu_items m 
                LEFT JOIN menu_categories c ON m.category_id = c.id 
                WHERE m.id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        $result = $stmt->fetch();
        
        echo json_encode(['success' => true, 'data' => $result, 'message' => 'Menu item created successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function updateMenuItem() {
    global $conn;
    
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Menu item ID is required']);
            return;
        }
        
        // Check if item exists
        $sql = "SELECT id FROM menu_items WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Menu item not found']);
            return;
        }
        
        // Update item
        $sql = "UPDATE menu_items SET 
                name = ?, 
                description = ?, 
                price = ?, 
                category_id = ?, 
                image = ?, 
                is_available = ?,
                updated_at = CURRENT_TIMESTAMP 
                WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            $input['name'] ?? '',
            $input['description'] ?? '',
            $input['price'] ?? 0,
            $input['category_id'] ?? null,
            $input['image'] ?? null,
            $input['is_available'] ?? 1,
            $id
        ]);
        
        // Get updated item
        $sql = "SELECT m.*, c.name as category_name 
                FROM menu_items m 
                LEFT JOIN menu_categories c ON m.category_id = c.id 
                WHERE m.id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        $result = $stmt->fetch();
        
        echo json_encode(['success' => true, 'data' => $result, 'message' => 'Menu item updated successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}

function deleteMenuItem() {
    global $conn;
    
    try {
        $id = isset($_GET['id']) ? $_GET['id'] : null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Menu item ID is required']);
            return;
        }
        
        // Check if item exists
        $sql = "SELECT id FROM menu_items WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        if (!$stmt->fetch()) {
            http_response_code(404);
            echo json_encode(['error' => 'Menu item not found']);
            return;
        }
        
        // Soft delete (set is_available to false)
        $sql = "UPDATE menu_items SET is_available = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$id]);
        
        echo json_encode(['success' => true, 'message' => 'Menu item deleted successfully']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?> 