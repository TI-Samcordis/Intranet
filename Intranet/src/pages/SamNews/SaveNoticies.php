<?php

header("Content-Type: application/json; charset=utf-8");

$arquivoJson  = __DIR__ . "/noticias.json";
$pastaUploads = __DIR__ . "/public/uploads/";
$maxNoticias  = 3;       // máximo de notícias mantidas no JSON
$maxImagens   = 10;      // máximo de imagens na pasta antes da limpeza
$diasRetencao = 30;      // imagens mais antigas que X dias são removidas
$tiposPermitidos = ["jpg", "jpeg", "png", "webp"];

// ── Cria pasta de uploads se não existir ──────────────────────────────────────
if (!is_dir($pastaUploads)) {
    mkdir($pastaUploads, 0777, true);
}

// ── Recebe dados do formulário ────────────────────────────────────────────────
$titulo   = trim($_POST["titulo"]   ?? "");
$conteudo = trim($_POST["conteudo"] ?? "");

if ($titulo === "" || $conteudo === "") {
    http_response_code(400);
    echo json_encode(["erro" => "Título e conteúdo são obrigatórios."]);
    exit;
}

// Sanitiza HTML — permite apenas tags seguras
$conteudo = strip_tags(
    $conteudo,
    '<b><i><u><ul><ol><li><p><br><strong><em><span>'
);

$imagemPath = null;

// ── Upload da imagem ──────────────────────────────────────────────────────────
if (isset($_FILES["imagem"]) && $_FILES["imagem"]["error"] === UPLOAD_ERR_OK) {

    $extensao = strtolower(pathinfo($_FILES["imagem"]["name"], PATHINFO_EXTENSION));

    if (!in_array($extensao, $tiposPermitidos)) {
        http_response_code(400);
        echo json_encode(["erro" => "Formato de imagem não permitido."]);
        exit;
    }

    // Valida proporção — deve ser imagem vertical (4:5 aprox.)
    [$largura, $altura] = getimagesize($_FILES["imagem"]["tmp_name"]);

    if ($largura >= $altura) {
        http_response_code(400);
        echo json_encode(["erro" => "Apenas imagens verticais são permitidas."]);
        exit;
    }

    $proporcao = $largura / $altura;
    if ($proporcao > 0.8) {
        http_response_code(400);
        echo json_encode(["erro" => "A imagem deve estar no formato vertical 4:5."]);
        exit;
    }

    $nomeUnico = "noticia_" . time() . "_" . bin2hex(random_bytes(4)) . "." . $extensao;
    $destino   = $pastaUploads . $nomeUnico;

    if (!move_uploaded_file($_FILES["imagem"]["tmp_name"], $destino)) {
        http_response_code(500);
        echo json_encode(["erro" => "Falha ao salvar imagem."]);
        exit;
    }

    $imagemPath = "public/uploads/" . $nomeUnico;
}

// ── Lê notícias existentes ────────────────────────────────────────────────────
$noticias = [];
if (file_exists($arquivoJson)) {
    $noticias = json_decode(file_get_contents($arquivoJson), true) ?? [];
}

// ── Nova notícia no início da lista ──────────────────────────────────────────
array_unshift($noticias, [
    "titulo"          => $titulo,
    "mensagem"        => $conteudo,
    "autor"           => "RH",
    "dataPublicacao"  => date("c"),
    "imagem"          => $imagemPath,
]);

// ── Remove notícias excedentes e apaga imagens orphãs ────────────────────────
while (count($noticias) > $maxNoticias) {
    $removida = array_pop($noticias);
    _apagarImagem($removida, $pastaUploads);
}

// ── Salva JSON ────────────────────────────────────────────────────────────────
if (!file_put_contents(
    $arquivoJson,
    json_encode($noticias, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
)) {
    http_response_code(500);
    echo json_encode(["erro" => "Falha ao salvar JSON."]);
    exit;
}

// ── Limpeza periódica da pasta de uploads ─────────────────────────────────────
// Remove imagens que não estão referenciadas no JSON E/OU
// que são mais antigas que $diasRetencao dias.
_limparUploads($pastaUploads, $noticias, $diasRetencao, $maxImagens);

// ── Responde com sucesso ──────────────────────────────────────────────────────
echo json_encode(["status" => "ok"]);
exit;


// =============================================================================
// FUNÇÕES AUXILIARES
// =============================================================================

/**
 * Apaga o arquivo de imagem de uma notícia, se existir.
 */
function _apagarImagem(array $noticia, string $pastaUploads): void
{
    if (empty($noticia["imagem"])) return;

    // O path no JSON é relativo: "public/uploads/noticia_xxx.jpg"
    // Resolve para caminho absoluto a partir do diretório do PHP
    $caminho = __DIR__ . "/" . $noticia["imagem"];

    if (file_exists($caminho)) {
        unlink($caminho);
    }
}

/**
 * Limpeza automática da pasta de uploads:
 * 1. Remove imagens não referenciadas no JSON (órfãs)
 * 2. Remove imagens mais antigas que $diasRetencao dias
 * 3. Se ainda passar de $maxImagens, remove as mais antigas até caber
 */
function _limparUploads(
    string $pastaUploads,
    array  $noticias,
    int    $diasRetencao,
    int    $maxImagens
): void {

    $arquivos = glob($pastaUploads . "noticia_*");
    if (!$arquivos) return;

    // Monta conjunto de imagens referenciadas no JSON
    $referenciadas = [];
    foreach ($noticias as $n) {
        if (!empty($n["imagem"])) {
            $referenciadas[] = basename($n["imagem"]);
        }
    }

    $limite = time() - ($diasRetencao * 86400);
    $restantes = [];

    foreach ($arquivos as $arquivo) {
        $nome = basename($arquivo);

        // Remove imagens órfãs (não estão mais no JSON)
        if (!in_array($nome, $referenciadas)) {
            unlink($arquivo);
            continue;
        }

        // Remove imagens mais velhas que $diasRetencao dias
        if (filemtime($arquivo) < $limite) {
            unlink($arquivo);
            continue;
        }

        $restantes[] = $arquivo;
    }

    // Se ainda sobrar mais que $maxImagens, remove as mais antigas
    if (count($restantes) > $maxImagens) {
        // Ordena por data de modificação (mais antigo primeiro)
        usort($restantes, fn($a, $b) => filemtime($a) - filemtime($b));

        $excesso = count($restantes) - $maxImagens;
        for ($i = 0; $i < $excesso; $i++) {
            if (file_exists($restantes[$i])) {
                unlink($restantes[$i]);
            }
        }
    }
}