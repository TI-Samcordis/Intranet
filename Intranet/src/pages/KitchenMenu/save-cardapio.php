<?php
header("Content-Type: application/json; charset=utf-8");

// Recebe corpo JSON
$json = file_get_contents("php://input");
$data = json_decode($json, true);

if ($data === null) {
    http_response_code(400);
    echo json_encode(["erro" => "JSON inválido"]);
    exit;
}

// Caminho do arquivo JSON na mesma pasta do PHP
$arquivo = "cardapio.json";

// Salva os dados
if (file_put_contents($arquivo, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo json_encode(["status" => "ok"]);
} else {
    http_response_code(500);
    echo json_encode(["erro" => "Falha ao salvar o arquivo JSON"]);
}
