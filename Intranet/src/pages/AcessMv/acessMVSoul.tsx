import { useEffect, useState } from "react";
import styles from "./AcessMV.module.css";

// ─── Hook: typewriter simples ─────────────────────────────────────────────────

function useTypewriter(text: string) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!text) return;
    setDisplay("");
    let idx = 0;
    const timer = setInterval(() => {
      setDisplay(text.substring(0, idx + 1));
      idx++;
      if (idx >= text.length) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [text]);

  return display;
}

// ─── Hook: copiar texto para clipboard ───────────────────────────────────────

function useCopiar() {
  const [copiado, setCopiado] = useState(false);

  const copiar = async (texto: string) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch {
      // Fallback para navegadores sem suporte à Clipboard API
      const ta = document.createElement("textarea");
      ta.value = texto;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    }
  };

  return { copiado, copiar };
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function AcessMVSoul() {
  const titulo              = useTypewriter("Como acessar o MVSoul.");
  const { copiado, copiar } = useCopiar();
  const linkTexto           = "192.168.0.10/mv";
  const linkHref            = "http://192.168.0.10/mvautenticador-cas/login?t=1764946792293";

  // Aviso exibido uma única vez ao montar o componente
  useEffect(() => {
    alert("NÃO USE O CENT BROWSER PARA NAVEGAR NA INTERNET!");
  }, []);

  return (
    <div className={styles.content}>
      <main className={styles.main}>

        {/* ── FIRST SECTION ── */}
        <section className={styles.firstSection}>
          <div className="first-container">
            <p className={styles.intro} aria-live="polite">{titulo}</p>
          </div>
          <div className="image-container">
            <img
              src="/assets/AcessMV/capa-mv.png"
              alt="Capa MV Soul"
              className={styles.logoMv}
            />
          </div>
        </section>

        {/* ── AVISO ── */}
        <div className="desc">
          <h2>Leia antes de acessar/instalar o <b>MV</b></h2>
          <p>Só é possível acessar o MV via Cent Browser!</p><br />
          <p>Deixe <b>somente</b> o navegador do Cent Browser aberto.</p><br />
          <p>
            É aconselhável abrir esta tela da intranet no CentBrowser{" "}
            e seguir o passo a passo lá, <b>irá facilitar o processo.</b>
          </p><br />
          <p>
            Não utilize o Cent Browser para navegar na internet,{" "}
            <b>utilize somente para acessar o MV e a Intranet!</b>{" "}
            Acesse a internet via Google ou Edge.
          </p><br />
          <p>
            Caso seja o primeiro acesso, será necessário a instalação do LAS que é{" "}
            simples e <b>VOCÊ</b> mesmo poderá fazer! Só seguir o passo a passo abaixo...
          </p>
        </div>

        {/* ── PASSO 1 ── */}
        <section className="steps">
          <h2>Passo 1</h2>
          <p>Abra o CentBrowser</p>
        </section>
        <div className="image-container">
          <img src="/assets/AcessMV/mv1.png" alt="Passo 1 - CentBrowser" className="p5f-image" />
        </div>

        {/* ── PASSO 2 ── */}
        <section className="steps">
          <h2>Passo 2</h2>
          <p>Com o Cent Browser aberto, abra este link</p>
        </section>

        <div className={styles.copyContainer}>
          <h2>Link do MV Soul:</h2>
          <span>
            <a href={linkHref} target="_blank" rel="noreferrer">
              <u>{linkTexto}</u>
            </a>
          </span>
          <button
            className={styles.copyBtn}
            onClick={() => copiar(linkHref)}
            title="Copiar link"
          >
            📋
          </button>
          {copiado && (
            <span className={styles.copiado}>Copiado!</span>
          )}
        </div>

        <div className="image-container" style={{ marginTop: "1%" }}>
          <img src="/assets/AcessMV/mv2.png" alt="Passo 2 - Link MV" className="p5f-image" />
        </div>

        {/* ── PASSO 3 ── */}
        <section className="steps">
          <h2>Passo 3</h2>
          <p>Agora basta colocar seu usuário e senha.</p>
        </section>
        <div className="image-container">
          <img src="/assets/AcessMV/mv4.png" alt="Passo 3 - Login" className="p5f-image" />
        </div>

        {/* ── PASSO 4 ── */}
        <section className="steps">
          <h2>Passo 4</h2>
          <p>
            Após efetuar login, se for sua primeira vez, o navegador citará erro de{" "}
            "Não conseguimos encontrar o LAS",{" "}
            <b>pois o LAS não está instalado.</b>
          </p>
        </section>
        <div style={{ display: "flex" }}>
          <div className="image-container">
            <img src="/assets/AcessMV/las1.jpeg" alt="Erro LAS 1" className="p5f-image" />
          </div>
          <div className="image-container">
            <img src="/assets/AcessMV/las2.jpeg" alt="Erro LAS 2" className="p5f-image" />
          </div>
        </div>

        {/* ── PASSO 5 ── */}
        <section className="steps">
          <h2>Passo 5</h2>
          <p>Se aparecer esta tela, clique em <b>download</b></p>
        </section>
        <div className="image-container">
          <img src="/assets/AcessMV/LASDOWNLOAD.png" alt="Download LAS" className="p5f-image" />
        </div>

        {/* ── PASSO 6 ── */}
        <section className="steps">
          <h2>Passo 6</h2>
          <p>Após clicar em <b>download</b>, abrirá esta tela:</p>
        </section>
        <div className="image-container">
          <img src="/assets/AcessMV/las3.png" alt="Instalador LAS" className="p5f-image" />
        </div>

        <section className="steps">
          <p>Só clicar em <b>abrir</b> e assim, prosseguirá para a próxima tela:</p>
        </section>
        <div className="image-container">
          <img src="/assets/AcessMV/las5.jpeg" alt="LAS passo 5" className="p5f-image" />
        </div>

        <section className="steps">
          <p>
            Nesta tela do Windows clique em <b>executar</b>{" "}
            (esta tela pode demorar um pouco para aparecer, depende do computador)
          </p>
        </section>
        <div className="image-container">
          <img src="/assets/AcessMV/las6.jpeg" alt="LAS executar" className="p5f-image" />
        </div>

        <section className="steps">
          <p>
            O Windows abrirá o instalador... agora só clicar em <b>avançar</b> e o LAS será
            instalado. Ao voltar para o MV ele será inicializado normalmente.
          </p>
        </section>
        <div className="image-container">
          <img src="/assets/AcessMV/las7.jpeg" alt="LAS avançar" className="p5f-image" />
        </div>

        {/* ── OBSERVAÇÃO ── */}
        <section className="steps">
          <h2>OBSERVAÇÃO!!</h2>
          <p>Caso apareça este erro na tela:</p>
        </section>
        <div style={{ display: "flex" }}>
          <div className="image-container">
            <img src="/assets/AcessMV/las8.jpeg" alt="Erro processos 1" className="p5f-image" />
          </div>
          <div className="image-container">
            <img src="/assets/AcessMV/las9.jpeg" alt="Erro processos 2" className="p5f-image" />
          </div>
        </div>
        <section className="steps">
          <p>
            Só clicar em "fechar processos" e depois em "terminar processos"...
            (Este problema ocorre quando há outro navegador além do Cent Browser aberto)
          </p>
        </section>

        {/* ── PASSO 7 ── */}
        <section className="steps">
          <h2>Passo 7</h2>
          <p>Clique em <b>Continuar</b>!</p>
        </section>
        <div className="image-container">
          <img src="/assets/AcessMV/las10.png" alt="Continuar" className="p5f-image" />
        </div>

        {/* ── EXTRA ── */}
        <section className="steps">
          <h2>Extra!</h2>
          <p>Adicione o MV aos favoritos na barra de favoritos do Cent Browser para facilitar o acesso.</p>
        </section>
        <div className="image-container">
          <img
            src="/assets/AcessMV/las11.jpeg"
            alt="Favoritos"
            className="p5f-image"
            style={{ marginBottom: "5%" }}
          />
        </div>

      </main>
    </div>
  );
}