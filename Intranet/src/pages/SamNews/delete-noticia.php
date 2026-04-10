<?php

header("Content-Type: application/json");

$arquivoJson = "noticias.json";

// Recebe o índice enviado pelo fetch
$dados = json_decode(file_get_contents("php://input"), true);

if (!isset($dados["index"])) {
    echo json_encode(["sucesso" => false, "erro" => "Índice não informado"]);
    exit;
}

$index = $dados["index"];

// Verifica se o JSON existe
if (!file_exists($arquivoJson)) {
    echo json_encode(["sucesso" => false, "erro" => "Arquivo não encontrado"]);
    exit;
}

$noticias = json_decode(file_get_contents($arquivoJson), true);

if (!isset($noticias[$index])) {
    echo json_encode(["sucesso" => false, "erro" => "Notícia inválida"]);
    exit;
}

// 🔥 Remove imagem se existir
if (!empty($noticias[$index]["imagem"])) {

    $caminhoImagem = $noticias[$index]["imagem"];

    if (file_exists($caminhoImagem)) {
        unlink($caminhoImagem);
    }
}

// Remove a notícia
array_splice($noticias, $index, 1);

// Salva novamente o JSON
file_put_contents($arquivoJson, json_encode($noticias, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

echo json_encode(["sucesso" => true]);

exit;