<?php
// Caminho do JSON (mesma pasta do arquivo PHP)
$arquivo = "ramais.json";

// Lê o corpo da requisição (JSON enviado pelo fetch)
$dados = file_get_contents("php://input");

if (!$dados) {
    http_response_code(400);
    echo "Nenhum dado recebido.";
    exit;
}

// Decodifica o JSON recebido
$lista = json_decode($dados, true);

// Se der erro ao decodificar
if ($lista === null) {
    http_response_code(400);
    echo "Erro ao processar JSON enviado.";
    exit;
}

// Salva no arquivo JSON com formatação bonita
if (file_put_contents($arquivo, json_encode($lista, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
    echo "Ramais atualizados com sucesso!";
} else {
    http_response_code(500);
    echo "Erro ao salvar o arquivo JSON.";
}
?>
