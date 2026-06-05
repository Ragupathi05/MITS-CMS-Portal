<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

$department = $_GET['department'] ?? '';

try {
    if ($department) {
        $stmt = $pdo->prepare(
            "SELECT id, faculty_name AS name, username AS email, designation, department, profile_status
             FROM faculty_login WHERE department = ? ORDER BY designation, faculty_name"
        );
        $stmt->execute([$department]);
    } else {
        $stmt = $pdo->query(
            "SELECT id, faculty_name AS name, username AS email, designation, department, profile_status
             FROM faculty_login ORDER BY department, designation, faculty_name"
        );
    }

    $faculty = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Attach avatar URL instead of raw blob
    foreach ($faculty as &$f) {
        $f['_id']    = $f['id'];
        $f['avatar'] = null; // loaded on demand via get_avatar.php
    }
    unset($f);

    echo json_encode(['success' => true, 'faculty' => $faculty]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'DB error: ' . $e->getMessage()]);
}
?>
