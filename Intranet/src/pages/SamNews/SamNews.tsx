import { useState, useEffect } from "react";
import styles from "./SamNews.module.css";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Noticia {
  titulo?: string;
  mensagem?: string;
  autor?: string;
  dataPublicacao?: string;
  imagem?: string | null;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function SamNews() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [erro, setErro]         = useState(false);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch(`/data/noticias.json?v=${Date.now()}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then((data) => { setNoticias(data); setLoading(false); })
      .catch(() => { setErro(true); setLoading(false); });
  }, []);

  return (
    <main className={styles.main}>
      <h1 className={styles.titulo} aria-live="polite">
        Notícias do Hospital
      </h1>

      {loading && <p className={styles.loading}>Carregando notícias...</p>}
      {erro    && <p className={styles.erro}>Não foi possível carregar as notícias.</p>}

      <div className={styles.lista}>
        {noticias.map((n, i) => (
          <NoticiaCard key={i} noticia={n} index={i} />
        ))}
      </div>
    </main>
  );
}

// ─── Card individual ──────────────────────────────────────────────────────────

function NoticiaCard({ noticia: n, index }: { noticia: Noticia; index: number }) {
  const dataFmt = n.dataPublicacao
    ? new Date(n.dataPublicacao).toLocaleString("pt-BR")
    : "Data não informada";

  const temImagem = !!n.imagem;

  return (
    <article
      className={`${styles.card} ${temImagem ? styles.cardComImagem : styles.cardSemImagem}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Layout COM imagem — imagem à esquerda, texto à direita */}
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
          </div>
        </div>
      ) : (
        /* Layout SEM imagem — texto centralizado */
        <div className={styles.cardConteudo}>
          <h2 className={styles.cardTitulo}>{n.titulo ?? "Sem título"}</h2>
          <small className={styles.cardData}>Publicado em: {dataFmt}</small>
          <div
            className={styles.cardTexto}
            dangerouslySetInnerHTML={{ __html: n.mensagem ?? "" }}
          />
        </div>
      )}
    </article>
  );
}