import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SamNews.module.css";

interface Noticia {
  titulo?: string;
  mensagem?: string;
  autor?: string;
  dataPublicacao?: string;
  imagem?: string | null;
}

export default function SamNewsRH() {
  const navigate                    = useNavigate();
  const [noticias, setNoticias]     = useState<Noticia[]>([]);
  const [erro, setErro]             = useState(false);
  const [loading, setLoading]       = useState(true);

  const carregar = () => {
    fetch(`/data/noticias.json?v=${Date.now()}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => { setNoticias(data); setLoading(false); })
      .catch(() => { setErro(true); setLoading(false); });
  };

  useEffect(() => { carregar(); }, []);

  const excluir = async (index: number) => {
    if (!window.confirm("Tem certeza que deseja excluir esta notícia?")) return;

    try {
      const resp = await fetch("/pages/SamNews/delete-noticia.php", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index }),
      });

      const data = await resp.json();

      if (data.sucesso) {
        // Atualiza estado local sem precisar de novo fetch
        setNoticias((prev) => prev.filter((_, i) => i !== index));
      } else {
        alert("Erro ao excluir: " + data.erro);
      }
    } catch {
      alert("Erro de conexão ao excluir.");
    }
  };

  return (
    <main className={styles.main}>
      <h1 className={styles.titulo}>Notícias do Hospital</h1>

      <button
        className={styles.btnEditar}
        onClick={() => navigate("/noticias/editar")}
      >
        <i className="fa-solid fa-pen-to-square" /> Publicar Notícia
      </button>

      {loading && <p className={styles.loading}>Carregando notícias...</p>}
      {erro    && <p className={styles.erro}>Não foi possível carregar as notícias.</p>}

      <div className={styles.lista}>
        {noticias.map((n, i) => (
          <NoticiaCardRH
            key={i}
            noticia={n}
            index={i}
            onExcluir={excluir}
          />
        ))}
      </div>
    </main>
  );
}

// ─── Card com botão excluir ───────────────────────────────────────────────────

function NoticiaCardRH({
  noticia: n,
  index,
  onExcluir,
}: {
  noticia: Noticia;
  index: number;
  onExcluir: (i: number) => void;
}) {
  const dataFmt = n.dataPublicacao
    ? new Date(n.dataPublicacao).toLocaleString("pt-BR")
    : "Data não informada";

  const temImagem = !!n.imagem;

  return (
    <article
      className={`${styles.card} ${temImagem ? styles.cardComImagem : styles.cardSemImagem}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {temImagem ? (
        <div className={styles.cardLayout}>
          <div className={styles.imagemWrapper}>
            <img
              src={n.imagem!}
              alt={n.titulo ?? "Imagem da notícia"}
              className={styles.imagem}
            />
          </div>
          <div className={styles.cardConteudo}>
            <h2 className={styles.cardTitulo}>{n.titulo ?? "Sem título"}</h2>
            <small className={styles.cardData}>Publicado em: {dataFmt}</small>
            <div
              className={styles.cardTexto}
              dangerouslySetInnerHTML={{ __html: n.mensagem ?? "" }}
            />
            <button
              className={styles.btnExcluir}
              onClick={() => onExcluir(index)}
            >
              <i className="fa-solid fa-trash" /> Excluir
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.cardConteudo}>
          <h2 className={styles.cardTitulo}>{n.titulo ?? "Sem título"}</h2>
          <small className={styles.cardData}>Publicado em: {dataFmt}</small>
          <div
            className={styles.cardTexto}
            dangerouslySetInnerHTML={{ __html: n.mensagem ?? "" }}
          />
          <button
            className={styles.btnExcluir}
            onClick={() => onExcluir(index)}
          >
            <i className="fa-solid fa-trash" /> Excluir
          </button>
        </div>
      )}
    </article>
  );
}