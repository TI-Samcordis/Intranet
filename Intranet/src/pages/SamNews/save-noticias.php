<?php

$arquivoJson = "noticias.json";
$pastaUploads = "public/uploads/";
$tiposPermitidos = ["jpg", "jpeg", "png", "webp"];

// Criar pasta se não existir
if (!is_dir($pastaUploads)) {
    mkdir($pastaUploads, 0777, true);
}

// Dados do formulário
$titulo = $_POST["titulo"] ?? "";
$conteudo = $_POST["conteudo"] ?? "";
$conteudo = strip_tags($conteudo, '<b><i><u><ul><ol><li><p><br><strong><em>');

$imagemPath = null;

# 🔥 Upload da imagem
if (isset($_FILES["imagem"]) && $_FILES["imagem"]["error"] == 0) {

    $extensao = strtolower(pathinfo($_FILES["imagem"]["name"], PATHINFO_EXTENSION));

    # Verifica formato permitido
    if (!in_array($extensao, $tiposPermitidos)) {
        die("Formato de imagem não permitido.");
    }

    # Pega largura e altura
    list($largura, $altura) = getimagesize($_FILES["imagem"]["tmp_name"]);

    # Verifica se é vertical
    if ($largura >= $altura) {
        die("Apenas imagens verticais são permitidas.");
    }

    # Verifica proporção aproximada 4:5
    $proporcao = $largura / $altura;
    if ($proporcao > 0.8) {
        die("Imagem deve ser no formato vertical 4:5.");
    }

    # Nome único
    $nomeUnico = "noticia_" . time() . "." . $extensao;
    $destino = $pastaUploads . $nomeUnico;

    move_uploaded_file($_FILES["imagem"]["tmp_name"], $destino);

    $imagemPath = "public/uploads/" . $nomeUnico;
}

# 🔥 Lê notícias existentes
$noticias = [];

if (file_exists($arquivoJson)) {
    $json = file_get_contents($arquivoJson);
    $noticias = json_decode($json, true) ?? [];
}

# 🔥 Nova notícia
$novaNoticia = [
    "titulo" => $titulo,
    "mensagem" => $conteudo,
    "autor" => "RH",
    "dataPublicacao" => date("c"),
    "imagem" => $imagemPath
];

# Coloca no início
array_unshift($noticias, $novaNoticia);

# 🔥 Mantém apenas 3 notícias
if (count($noticias) > 3) {

    $removida = array_pop($noticias);

    # Apaga imagem da notícia removida
    if (!empty($removida["imagem"])) {

        $caminhoImagem = $removida["imagem"];

        if (file_exists($caminhoImagem)) {
            unlink($caminhoImagem);
        }
    }
}

# Salva JSON novamente
file_put_contents($arquivoJson, json_encode($noticias, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

# Redireciona
header("Location: ver-noticias.html");
exit;

?>