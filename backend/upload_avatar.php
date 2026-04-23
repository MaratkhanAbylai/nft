<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$host = "localhost";
$user = "root";
$pass = "";
$dbname = "nft_service";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $targetDir = "../public/images/"; 
    
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    if (isset($_FILES['avatar']) && isset($_POST['login'])) {
        $login = $_POST['login'];
        $username = $_POST['username'] ?? '';
        $bio = $_POST['bio'] ?? '';
        
        $fileExtension = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
        $fileName = "avatar_" . $login . "_" . time() . "." . $fileExtension;
        $targetFile = $targetDir . $fileName;

        if (move_uploaded_file($_FILES['avatar']['tmp_name'], $targetFile)) {
            // Сохраняем в базу только имя файла
            $sql = "INSERT INTO profiles (login, username, bio, avatar_url) 
                    VALUES ('$login', '$username', '$bio', '$fileName') 
                    ON DUPLICATE KEY UPDATE 
                    username='$username', bio='$bio', avatar_url='$fileName'";

            if ($conn->query($sql) === TRUE) {
                echo json_encode([
                    "status" => "success",
                    "url" => $fileName // Возвращаем только имя
                ]);
            } else {
                echo json_encode(["status" => "error", "message" => $conn->error]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Move file failed"]);
        }
    }
}
$conn->close();
?>