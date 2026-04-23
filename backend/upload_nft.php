<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Если это preflight-запрос (OPTIONS), просто выходим
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Папка, где будут лежать картинки
$target_dir = "../public/images/nfts/";

// Создаем папку, если её нет
if (!file_exists($target_dir)) {
    mkdir($target_dir, 0777, true);
}

if (isset($_FILES['nft-image'])) {
    $file = $_FILES['nft-image'];
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    
    // Генерируем уникальное имя файла
    $fileName = uniqid() . "." . $extension;
    $target_file = $target_dir . $fileName;

    if (move_uploaded_file($file['tmp_name'], $target_file)) {
        // Возвращаем успех и имя файла
        echo json_encode(["status" => "success", "url" => $fileName]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to move uploaded file."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "No file uploaded."]);
}
?>