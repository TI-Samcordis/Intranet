import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SamNews.module.css";

// ─── Comandos de formatação do editor ─────────────────────────────────────────

const TOOLBAR = [
  { cmd: "bold",                label: <b>B</b>         },
  { cmd: "italic",              label: <i>I</i>         },
  { cmd: "underline",           label: <u>U</u>         },
  { cmd: "insertUnorderedList", label: "• Lista"        },
  { cmd: "insertOrderedList",   label: "1. Lista"       },
  { cmd: "justifyLeft",         label: "Esq"            },
  { cmd: "justifyCenter",       label: "Centro"         },
  { cmd: "justifyRight",        label: "Dir"            },
] as const;

// ─── Componente ───────────────────────────────────────────────────────────────

export default function EditNoticias() {
  const navigate                      = useNavigate();
  const editorRef                     = useRef<HTMLDivElement>(null);
  const [titulo, setTitulo]           = useState("");
  const [imagem, setImagem]           = useState<File | null>(null);
  const [preview, setPreview]         = useState<string | null>(null);
  const [enviando, setEnviando]       = useState(false);
  const [feedback, setFeedback]       = useState<"ok" | "erro" | null>(null);
  const [erroImagem, setErroImagem]   = useState<string | null>(null);

  // Limpa preview ao desmontar
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  // ── Formatação do editor ──
  const format = (cmd: string) => {
    document.execCommand(cmd, false, undefined);
    editorRef.current?.focus();
  };

  // ── Validação e preview da imagem ──
  const handleImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErroImagem(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      // Valida que é vertical (proporção ~4:5)
      if (img.width >= img.height) {
        setErroImagem("Apenas imagens verticais são permitidas.");
        URL.revokeObjectURL(url);
        return;
      }
      const proporcao = img.width / img.height;
      if (proporcao > 0.8) {
        setErroImagem("A imagem deve estar no formato vertical 4:5.");
        URL.revokeObjectURL(url);
        return;
      }
      setImagem(file);
      setPreview(url);
    };

    img.src = url;
  };

  // ── Envio via FormData para o PHP ──
  const publicar = async () => {
    if (!titulo.trim()) { alert("Informe o título da notícia."); return; }
    const conteudo = editorRef.current?.innerHTML ?? "";
    if (!conteudo.trim() || conteudo === "<br>") {
      alert("O conteúdo da notícia não pode estar vazio.");
      return;
    }

    setEnviando(true);
    setFeedback(null);

    const form = new FormData();
    form.append("titulo", titulo);
    form.append("conteudo", conteudo);
    if (imagem) form.append("imagem", imagem);

    try {
      const resp = await fetch("/pages/SamNews/save-noticias.php", {
        method: "POST",
        body: form,
      });

      // O PHP redireciona com header Location — resp.redirected = true
      if (resp.ok || resp.redirected) {
        setFeedback("ok");
        setTitulo("");
        if (editorRef.current) editorRef.current.innerHTML = "";
        setImagem(null);
        setPreview(null);
        setTimeout(() => navigate("/noticias"), 1500);
      } else {
        throw new Error();
      }
    } catch {
      setFeedback("erro");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className={styles.mainEdit}>
      <div className={styles.editCard}>

        <h1 className={styles.editTitulo}>
          <i className="fa-solid fa-newspaper" /> Publicar Notícia
        </h1>

        {/* ── Título ── */}
        <input
          type="text"
          className={styles.inputTitulo}
          placeholder="Título da notícia"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        {/* ── Toolbar ── */}
        <div className={styles.toolbar}>
          {TOOLBAR.map(({ cmd, label }) => (
            <button
              key={cmd}
              type="button"
              className={styles.toolbarBtn}
              onMouseDown={(e) => { e.preventDefault(); format(cmd); }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Editor ── */}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          className={styles.editor}
          data-placeholder="Escreva o conteúdo da notícia aqui..."
        />

        {/* ── Upload de imagem ── */}
        <label className={styles.labelImagem}>
          <i className="fa-solid fa-image" /> Anexar imagem (vertical, proporção 4:5)
          <input
            type="file"
            accept="image/*"
            className={styles.inputFile}
            onChange={handleImagem}
          />
        </label>

        {erroImagem && <p className={styles.erroImagem}>{erroImagem}</p>}

        {preview && (
          <div className={styles.previewWrapper}>
            <img src={preview} alt="Pré-visualização" className={styles.previewImg} />
            <button
              className={styles.btnRemoverImg}
              onClick={() => { setImagem(null); setPreview(null); }}
            >
              <i className="fa-solid fa-xmark" /> Remover imagem
            </button>
          </div>
        )}

        {/* ── Feedback ── */}
        {feedback === "ok" && (
          <p className={styles.feedbackOk}>
            <i className="fa-solid fa-check" /> Notícia publicada! Redirecionando...
          </p>
        )}
        {feedback === "erro" && (
          <p className={styles.feedbackErro}>
            <i className="fa-solid fa-triangle-exclamation" /> Erro ao publicar. Tente novamente.
          </p>
        )}

        {/* ── Ações ── */}
        <div className={styles.acoes}>
          <button
            className={styles.btnPublicar}
            onClick={publicar}
            disabled={enviando}
          >
            <i className="fa-solid fa-save" />
            {enviando ? " Publicando..." : " Publicar"}
          </button>
          <button
            className={styles.btnVoltar}
            onClick={() => navigate("/noticias")}
          >
            <i className="fa-solid fa-newspaper" /> Ver Notícias
          </button>
        </div>

      </div>
    </main>
  );
}