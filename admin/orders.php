<?php
session_start();
require_once '../config/database.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

$conn = getConnection();

// Get order ID if viewing specific order
$orderId = isset($_GET['id']) ? $_GET['id'] : null;
$statusFilter = isset($_GET['status']) ? $_GET['status'] : '';

// Get specific order details
if ($orderId) {
    try {
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
        
        if (!$order) {
            header('Location: orders.php');
            exit();
        }
        
        // Get order items
        $sql = "SELECT oi.*, m.name as menu_name, m.image as menu_image
                FROM order_items oi
                LEFT JOIN menu_items m ON oi.menu_item_id = m.id
                WHERE oi.order_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$orderId]);
        $orderItems = $stmt->fetchAll();
        
    } catch (PDOException $e) {
        $error = 'Database error: ' . $e->getMessage();
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $orderId ? 'Detail Pesanan' : 'Manajemen Pesanan'; ?> - Admin Panel</title>
    <link rel="stylesheet" href="assets/css/admin.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div class="admin-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="sidebar-header">
                <i class="fas fa-coffee"></i>
                <h2>Warkop Admin</h2>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li>
                        <a href="index.php">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li class="active">
                        <a href="orders.php">
                            <i class="fas fa-shopping-cart"></i>
                            <span>Pesanan</span>
                        </a>
                    </li>
                    <li>
                        <a href="menu.php">
                            <i class="fas fa-utensils"></i>
                            <span>Menu</span>
                        </a>
                    </li>
                    <li>
                        <a href="gallery.php">
                            <i class="fas fa-images"></i>
                            <span>Galeri</span>
                        </a>
                    </li>
                    <li>
                        <a href="settings.php">
                            <i class="fas fa-cog"></i>
                            <span>Pengaturan</span>
                        </a>
                    </li>
                    <li>
                        <a href="users.php">
                            <i class="fas fa-users"></i>
                            <span>Pengguna</span>
                        </a>
                    </li>
                    <li>
                        <a href="logout.php">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Keluar</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Header -->
            <header class="admin-header">
                <div class="header-left">
                    <h1><?php echo $orderId ? 'Detail Pesanan #' . $order['order_number'] : 'Manajemen Pesanan'; ?></h1>
                    <p><?php echo $orderId ? 'Lihat detail pesanan pelanggan' : 'Kelola semua pesanan pelanggan'; ?></p>
                </div>
                <div class="header-right">
                    <div class="user-info">
                        <span>Selamat datang, <?php echo htmlspecialchars($_SESSION['username']); ?></span>
                        <a href="logout.php" class="logout-btn">
                            <i class="fas fa-sign-out-alt"></i>
                            Keluar
                        </a>
                    </div>
                </div>
            </header>

            <?php if ($orderId && isset($order)): ?>
                <!-- Order Detail View -->
                <div class="content-section">
                    <div class="section-header">
                        <h2>Informasi Pesanan</h2>
                        <div>
                            <button class="btn btn-secondary" onclick="window.history.back()">
                                <i class="fas fa-arrow-left"></i>
                                Kembali
                            </button>
                            <button class="btn btn-primary" onclick="printOrder()">
                                <i class="fas fa-print"></i>
                                Cetak
                            </button>
                        </div>
                    </div>

                    <div class="order-detail-grid">
                        <div class="order-info">
                            <h3>Data Pelanggan</h3>
                            <div class="info-item">
                                <strong>Nama:</strong> <?php echo htmlspecialchars($order['customer_name']); ?>
                            </div>
                            <div class="info-item">
                                <strong>Telepon:</strong> <?php echo htmlspecialchars($order['customer_phone']); ?>
                            </div>
                            <div class="info-item">
                                <strong>Alamat:</strong> <?php echo htmlspecialchars($order['customer_address']); ?>
                            </div>
                            <?php if ($order['customer_notes']): ?>
                                <div class="info-item">
                                    <strong>Catatan:</strong> <?php echo htmlspecialchars($order['customer_notes']); ?>
                                </div>
                            <?php endif; ?>
                        </div>

                        <div class="order-status">
                            <h3>Status Pesanan</h3>
                            <div class="status-controls">
                                <select id="orderStatus" onchange="updateOrderStatus(<?php echo $orderId; ?>, this.value)">
                                    <option value="pending" <?php echo $order['status'] === 'pending' ? 'selected' : ''; ?>>Pending</option>
                                    <option value="confirmed" <?php echo $order['status'] === 'confirmed' ? 'selected' : ''; ?>>Dikonfirmasi</option>
                                    <option value="preparing" <?php echo $order['status'] === 'preparing' ? 'selected' : ''; ?>>Disiapkan</option>
                                    <option value="ready" <?php echo $order['status'] === 'ready' ? 'selected' : ''; ?>>Siap</option>
                                    <option value="delivered" <?php echo $order['status'] === 'delivered' ? 'selected' : ''; ?>>Dikirim</option>
                                    <option value="cancelled" <?php echo $order['status'] === 'cancelled' ? 'selected' : ''; ?>>Dibatalkan</option>
                                </select>
                            </div>
                            <div class="status-info">
                                <div class="info-item">
                                    <strong>Status Pembayaran:</strong> 
                                    <span class="status-badge status-<?php echo $order['payment_status']; ?>">
                                        <?php echo ucfirst($order['payment_status']); ?>
                                    </span>
                                </div>
                                <div class="info-item">
                                    <strong>Metode Pembayaran:</strong> <?php echo ucfirst($order['payment_method']); ?>
                                </div>
                                <div class="info-item">
                                    <strong>Tanggal Pesanan:</strong> <?php echo date('d/m/Y H:i', strtotime($order['created_at'])); ?>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="order-items">
                        <h3>Item Pesanan</h3>
                        <div class="table-container">
                            <table class="data-table">
                                <thead>
                                    <tr>
                                        <th>Menu</th>
                                        <th>Harga</th>
                                        <th>Jumlah</th>
                                        <th>Subtotal</th>
                                        <th>Catatan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php foreach ($orderItems as $item): ?>
                                        <tr>
                                            <td>
                                                <div class="menu-item-info">
                                                    <?php if ($item['menu_image']): ?>
                                                        <img src="../<?php echo $item['menu_image']; ?>" alt="<?php echo $item['menu_name']; ?>" class="menu-thumbnail">
                                                    <?php endif; ?>
                                                    <span><?php echo $item['menu_name']; ?></span>
                                                </div>
                                            </td>
                                            <td>Rp <?php echo number_format($item['price']); ?></td>
                                            <td><?php echo $item['quantity']; ?></td>
                                            <td>Rp <?php echo number_format($item['subtotal']); ?></td>
                                            <td><?php echo $item['notes'] ? htmlspecialchars($item['notes']) : '-'; ?></td>
                                        </tr>
                                    <?php endforeach; ?>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="3" class="text-right"><strong>Total:</strong></td>
                                        <td colspan="2"><strong>Rp <?php echo number_format($order['total_amount']); ?></strong></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>

            <?php else: ?>
                <!-- Orders List View -->
                <div class="content-section">
                    <div class="section-header">
                        <h2>Daftar Pesanan</h2>
                        <div class="search-filter">
                            <select id="statusFilter" onchange="filterOrders()">
                                <option value="">Semua Status</option>
                                <option value="pending" <?php echo $statusFilter === 'pending' ? 'selected' : ''; ?>>Pending</option>
                                <option value="confirmed" <?php echo $statusFilter === 'confirmed' ? 'selected' : ''; ?>>Dikonfirmasi</option>
                                <option value="preparing" <?php echo $statusFilter === 'preparing' ? 'selected' : ''; ?>>Disiapkan</option>
                                <option value="ready" <?php echo $statusFilter === 'ready' ? 'selected' : ''; ?>>Siap</option>
                                <option value="delivered" <?php echo $statusFilter === 'delivered' ? 'selected' : ''; ?>>Dikirim</option>
                                <option value="cancelled" <?php echo $statusFilter === 'cancelled' ? 'selected' : ''; ?>>Dibatalkan</option>
                            </select>
                            <input type="text" id="searchInput" placeholder="Cari pesanan..." onkeyup="searchOrders()">
                        </div>
                    </div>

                    <div class="table-container">
                        <table class="data-table" id="ordersTable">
                            <thead>
                                <tr>
                                    <th>No. Pesanan</th>
                                    <th>Pelanggan</th>
                                    <th>Item</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Tanggal</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody id="ordersTableBody">
                                <!-- Orders will be loaded here -->
                            </tbody>
                        </table>
                    </div>

                    <div class="pagination-container">
                        <!-- Pagination will be loaded here -->
                    </div>
                </div>
            <?php endif; ?>
        </main>
    </div>

    <script src="assets/js/admin.js"></script>
    <script>
        // Load orders on page load
        document.addEventListener('DOMContentLoaded', function() {
            if (!<?php echo $orderId ? 'true' : 'false'; ?>) {
                loadOrders();
            }
        });

        function loadOrders(page = 1) {
            const status = document.getElementById('statusFilter').value;
            const search = document.getElementById('searchInput').value;
            
            let url = '../api/orders.php?limit=10&offset=' + ((page - 1) * 10);
            if (status) url += '&status=' + status;
            if (search) url += '&search=' + encodeURIComponent(search);
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        displayOrders(data.data);
                        if (data.pagination) {
                            renderPagination(data.pagination, 'loadOrders');
                        }
                    }
                })
                .catch(error => {
                    console.error('Error loading orders:', error);
                });
        }

        function displayOrders(orders) {
            const tbody = document.getElementById('ordersTableBody');
            tbody.innerHTML = '';

            if (orders.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center">Tidak ada pesanan</td></tr>';
                return;
            }

            orders.forEach(order => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${order.order_number}</td>
                    <td>${order.customer_name}</td>
                    <td>${order.items_summary || '-'}</td>
                    <td>Rp ${parseInt(order.total_amount).toLocaleString()}</td>
                    <td>${getStatusBadge(order.status)}</td>
                    <td>${formatDate(order.created_at)}</td>
                    <td>
                        <a href="orders.php?id=${order.id}" class="btn btn-sm btn-primary">Detail</a>
                        <button class="btn btn-sm btn-danger" onclick="deleteOrder(${order.id})">Hapus</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }

        function filterOrders() {
            loadOrders(1);
        }

        function searchOrders() {
            loadOrders(1);
        }

        function updateOrderStatus(orderId, status) {
            fetch('../api/orders.php?id=' + orderId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: status })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Status pesanan berhasil diupdate!', 'success');
                } else {
                    showNotification('Gagal mengupdate status pesanan!', 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showNotification('Terjadi kesalahan!', 'error');
            });
        }

        function deleteOrder(orderId) {
            if (confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
                fetch('../api/orders.php?id=' + orderId, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        showNotification('Pesanan berhasil dihapus!', 'success');
                        loadOrders();
                    } else {
                        showNotification('Gagal menghapus pesanan!', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showNotification('Terjadi kesalahan!', 'error');
                });
            }
        }

        function printOrder() {
            window.print();
        }

        // Auto refresh orders every 30 seconds
        if (!<?php echo $orderId ? 'true' : 'false'; ?>) {
            setInterval(() => {
                loadOrders();
            }, 30000);
        }
    </script>

    <style>
        .order-detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            margin-bottom: 2rem;
        }

        .order-info, .order-status {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 10px;
        }

        .info-item {
            margin-bottom: 1rem;
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #eee;
        }

        .status-controls {
            margin-bottom: 1rem;
        }

        .status-controls select {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 5px;
        }

        .menu-item-info {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .menu-thumbnail {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 5px;
        }

        .text-right {
            text-align: right;
        }

        @media print {
            .sidebar, .admin-header, .section-header button {
                display: none !important;
            }
            
            .main-content {
                margin-left: 0 !important;
                padding: 0 !important;
            }
        }
    </style>
</body>
</html> 