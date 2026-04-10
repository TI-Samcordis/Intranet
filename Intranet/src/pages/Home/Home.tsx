import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import styles from "./Home.module.css";

// ─── Tipos ───────────────────────────────────────────────────────────────────

type Role = "ti" | "nutri" | "rh" | "telefonia" | null;

interface Noticia {
  titulo?: string;
  dataPublicacao?: string;
  imagem?: string;
  mensagem?: string;
}

interface ToolItem {
  id: string;
  alt: string;
  src: string;
  href: string;
  external: boolean;
}

// ─── Configuração por role ────────────────────────────────────────────────────

const ROLE_CONFIG: Record<
  string,
  { title: string; typewriterText: string; logo: string; logoClass: string; bgClass: string }
> = {
  ti: {
    title: "Início | TI",
    typewriterText: "SEJA BEM-VINDO, PROFISSIONAL DA TI!",
    logo: "/assets/TISamCordis2.png",
    logoClass: "intro-imageTI",
    bgClass: "bg-ti",
  },
  nutri: {
    title: "Início | Nutrição",
    typewriterText:
      "SEJA BEM-VINDO AO PORTAL INTERNO DO HOSPITAL SAMCORDIS. PROFISSIONAL DA NUTRIÇÃO!",
    logo: "/assets/samcordis.png",
    logoClass: "index-image",
    bgClass: "bg-default",
  },
  rh: {
    title: "Início | RH",
    typewriterText:
      "SEJA BEM-VINDO AO PORTAL INTERNO DO HOSPITAL SAMCORDIS. PROFISSIONAL DE RH | PSICOLOGIA!",
    logo: "/assets/samcordis.png",
    logoClass: "index-image",
    bgClass: "bg-default",
  },
  telefonia: {
    title: "Início | Telefonia",
    typewriterText:
      "SEJA BEM-VINDO AO PORTAL INTERNO DO HOSPITAL SAMCORDIS. TELEFONIA!",
    logo: "/assets/samcordis.png",
    logoClass: "index-image",
    bgClass: "bg-default",
  },
  default: {
    title: "Início",
    typewriterText: "SEJA BEM-VINDO AO PORTAL INTERNO DO HOSPITAL SAMCORDIS.",
    logo: "/assets/samcordis.png",
    logoClass: "index-image",
    bgClass: "bg-default",
  },
};

// ─── Ferramentas (mesmas para todos os roles) ─────────────────────────────────

const TOOLS: ToolItem[] = [
  {
    id: "hsp",
    alt: "HSP_LOGO",
    src: "/assets/LOGOS/HSP_LOGO-removebg.png",
    href: "http://app.hspsoftware.com.br/",
    external: true,
  },
  {
    id: "email",
    alt: "EMAIL_LOGO",
    src: "/assets/LOGOS/EMAIL_LOGO-removebg.png",
    href: "https://outlook.office365.com/mail/",
    external: true,
  },
  {
    id: "cloud",
    alt: "PLANNER_LOGO",
    src: "/assets/LOGOS/PLANNER_LOGO-removebg.png",
    href: "https://planner.cloud.microsoft/webui/",
    external: true,
  },
  {
    id: "sharepoint",
    alt: "SHAREPOINT_LOGO",
    src: "/assets/LOGOS/SHAREPOINT_LOGO-removebg.png",
    href: "https://samcordiscombr.sharepoint.com/sites/Samcordis",
    external: true,
  },
  {
    id: "teams",
    alt: "TEAMS_LOGO",
    src: "/assets/LOGOS/TEAMS_LOGO-removebg.png",
    href: "/teams",
    external: false,
  },
];

// ─── Hook: efeito typewriter (binário → texto, apenas para TI) ────────────────

function useTypewriter(text: string, isTI: boolean) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!text) return;
    setDisplay("");

    if (isTI) {
      // Fase 1: digita binário
      let binary = "";
      let i = 0;
      const typeBinary = setInterval(() => {
        binary += Math.random() > 0.5 ? "1" : "0";
        setDisplay(binary);
        i++;
        if (i >= text.length) {
          clearInterval(typeBinary);
          // Fase 2: transforma em texto
          let j = 0;
          const transform = setInterval(() => {
            setDisplay(text.substring(0, j + 1) + binary.substring(j + 1));
            j++;
            if (j >= text.length) clearInterval(transform);
          }, 40);
        }
      }, 35);
      return () => clearInterval(typeBinary);
    } else {
      // Typewriter simples
      let idx = 0;
      const timer = setInterval(() => {
        setDisplay(text.substring(0, idx + 1));
        idx++;
        if (idx >= text.length) clearInterval(timer);
      }, 30);
      return () => clearInterval(timer);
    }
  }, [text, isTI]);

  return display;
}

// ─── Hook: busca a última notícia ─────────────────────────────────────────────

function useLatestNoticia() {
  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    fetch(`/pages/SamNews/noticias.json?v=${Date.now()}`)
      .then((r) => {
        if (!r.ok) throw new Error("Erro ao buscar notícias");
        return r.json();
      })
      .then((lista: Noticia[]) => {
        if (lista.length > 0) setNoticia(lista[0]);
      })
      .catch(() => setErro(true));
  }, []);

  return { noticia, erro };
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Home() {
  const navigate = useNavigate();
  const role = (localStorage.getItem("nivel") as Role) ?? "default";
  const config = ROLE_CONFIG[role ?? "default"] ?? ROLE_CONFIG.default;
  const isTI = role === "ti";

  const typewriterText = useTypewriter(config.typewriterText, isTI);
  const { noticia, erro } = useLatestNoticia();

  // Atualiza o <title> da aba conforme o role
  useEffect(() => {
    document.title = config.title;
  }, [config.title]);

  const handleToolClick = (tool: ToolItem) => {
    if (tool.external) {
      window.open(tool.href, "_blank");
    } else {
      navigate(tool.href);
    }
  };

  const dataFmt = noticia?.dataPublicacao
    ? new Date(noticia.dataPublicacao).toLocaleString("pt-BR")
    : "Data não informada";

  return (
    <>
      <style>{`
        .bg-ti {
          background-image: url("/assets/FundoTI2.png");
          background-size: cover;
          background-position: center;
        }
        .typewriter-ti {
          color: #fff;
        }
        .tool-btn {
          border: none;
          background: transparent;
          cursor: pointer;
          padding: 0;
          transition: transform 0.2s;
        }
        .tool-btn:hover {
          transform: scale(1.08);
        }
        .noticia-btn {
          border: none;
          padding: 10px 20px;
          background: #1e4080;
          color: #fff;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 10px;
          transition: background 0.2s;
        }
        .noticia-btn:hover {
          background: #2a58a3;
        }
      `}</style>

      <main
        className={config.bgClass}
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        {/* ── FIRST SECTION ── */}
        <section className={styles.firstSection} style={{ display: "flex" }}>
          <div className="first-container">
            <div className="image-container">
              <a href="/">
                <img
                  src={config.logo}
                  alt="Logo Samcordis"
                  className={config.logoClass}
                />
              </a>
            </div>
            <p
              className={` ${styles.intro} intro${isTI ? " typewriter-ti" : ""}`}
              aria-live="polite"
            >
              {typewriterText}
            </p>
          </div>

          {/* ── Notícia ── */}
          <div className="noticia">
            {erro && (
              <p style={{ color: "#888", display: "flex", justifyContent: "center" }}>
                Não há notícias.
              </p>
            )}
            {noticia && (
              <article className="noticia-card">
                <h2>{noticia.titulo ?? "Sem título"}</h2>
                <small style={{ color: "#555" }}>Publicado em: {dataFmt}</small>
                {noticia.imagem && (
                  <img
                    src={`/pages/SamNews/${noticia.imagem}`}
                    className="imagem-noticia"
                    alt={noticia.titulo ?? "Imagem da notícia"}
                  />
                )}
                <div
                  className="noticia-texto"
                  dangerouslySetInnerHTML={{ __html: noticia.mensagem ?? "" }}
                />
                <button
                  className="noticia-btn"
                  onClick={() => navigate("/noticias")}
                >
                  Ver notícia
                </button>
              </article>
            )}
          </div>
        </section>

        {/* ── SECOND SECTION — Ferramentas ── */}
        <section className="second-section">
          <div className="second-container">
            {/* <div className="tools">
              <h1 className="tool-title">
                Ferramentas <i className="fa-solid fa-gear" />
              </h1>
              <div className="toolbox">
                {TOOLS.map((tool) => (
                  <div key={tool.id} className="minB">
                    <button
                      className="tool-btn"
                      onClick={() => handleToolClick(tool)}
                      title={tool.alt}
                    >
                      <img
                        src={tool.src}
                        alt={tool.alt}
                        className="index-image2"
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </section>        
      </main>
    </>
  );
}
