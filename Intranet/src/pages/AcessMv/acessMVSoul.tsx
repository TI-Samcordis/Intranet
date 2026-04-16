import React, { useEffect, useRef, useState } from 'react'

interface AcessMVSoulProps {
    texto: string;
}

const acessMVSoul = () => {

    function CopiarTexto() {
        const [mensagemVisivel, setMensagemVisivel] = useState(false);
        const textoRef = useRef<HTMLElement>(null);

        const copiarTexto = async () => {
            try {
            const texto = textoRef.current?.innerText;

            if (texto) {
              await navigator.clipboard.writeText(texto);
            }

            setMensagemVisivel(true);

            setTimeout(() => {
                setMensagemVisivel(false);
            }, 1500);
            } catch (err) {
            console.error("Erro ao copiar:", err);
            }
    };

        alert("NÃO USE O CENT BROWSER PARA NAVEGAR NA INTERNET!");

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
        
  return (
    <>
        <div className="content">

        {/* Conteúdo da página  */}
        <main style={{ display: 'flex', flexDirection: 'column' }}>

            {/* FIRST SECTION */}
            <section className="first-section">
                <div className="first-container">
                    <p className="intro" id="typewriter"></p>
                </div>
                <div className="image-container">
                    <img src="/assets/AcessMV/capa-mv.png" alt="exemplo de tela" className="logoMv" />
                </div>
            </section>

            <div className="desc">
                <h2>Leia antes de acessar/instalar o <b>MV</b></h2>
                <p>Só é possivel acessar o MV via Cent Browser!</p>
                <br />
                <p>Deixe <b>somente</b> o navegador do Cent Browser aberto.</p>
                <br />
                <p>É aconselhavel abrir esta tela da intranet no CentBrowser <br/> e seguir o passo a passo lá, <b>irá
                        facilitar o processo.</b></p>
                <br />
                <p>Não utilize o Cent Browser para navegar na internet, <br/><b>utilize somente para acessar o MV e a
                        Intranet!</b> acesse a internet via google ou edge.</p>
                <br />
                <p>Caso seja o primeiro acesso, será necessário a instalação do LAS que é <br/>simples e <b>VOCÊ</b> mesmo
                    poderá fazer! só seguir o passo a passo logo abaixo...</p>
            </div>


            <section className="steps">
                <h2>Passo 1</h2>
                <p>Abra o CentBrowser</p>
            </section>

            <div className="image-container">
                <img src="/assets/AcessMV/mv1.png" alt="exemplo de tela" className="p5f-image" />
            </div>

            <section className="steps">
                <h2>Passo 2</h2>
                <p>Com o Cent Browser aberto, abra este link</p>
            </section>

            <div className="copy-container" style={{ marginLeft: '3%' }}>
                <h2>Link do MV Soul:</h2>
                <span id="meuLink" style={{ cursor: 'text' }}>
                    <a href="http://192.168.0.10/mvautenticador-cas/login?t=1764946792293" ><u ref={textoRef}>192.168.0.10/mv</u></a>
                </span>
                <button className="copy-btn" onClick={copiarTexto}>📋</button>
            </div>

            
            {mensagemVisivel && (
                <span style={{ marginLeft: "10px", color: "green" }}>
                Copiado!
                </span>
            )}

            <div className="image-container" style={{ marginTop: '1%' }}>
                <img src="/assets/AcessMV/mv2.png" alt="exemplo de tela" className="p5f-image" />
            </div>

            <section className="steps">
                <h2>Passo 3</h2>
                <p>Agora basta colocar seu usuário e senha.</p>
            </section>

            <div className="image-container">
                <img src="/assets/AcessMV/mv4.png" alt="exemplo de tela" className="p5f-image" />
            </div>

            <section className="steps">
                <h2>Passo 4</h2>
                <p>Após efetuar login, se for sua primeira vez, o navegador citará erro de "Não conseguimos encontral o
                    LAS", <b>pois o LAS não está instalado.</b></p>
            </section>

            <div style={{display: 'flex'}}>
                <div className="image-container">
                    <img src="/assets/AcessMV/las1.jpeg" alt="exemplo de tela" className="p5f-image" />
                </div>
                <div className="image-container">
                    <img src="/assets/AcessMV/las2.jpeg" alt="exemplo de tela" className="p5f-image" />
                </div>
            </div>

            <section className="steps">
                <h2>Passo 5</h2>
                <p>Se aparecer esta tela, clique em <b>download</b></p>
            </section>

            <div className="image-container">
                <img src="/assets/AcessMV/LASDOWNLOAD.png" alt="exemplo de tela" className="p5f-image" />
            </div>

            <section className="steps">
                <h2>Passo 6</h2>
                <p>Após clicar em <b>download</b>, abrirá esta tela:</p>
            </section>

            <div className="image-container">
                <img src="/assets/AcessMV/las3.png" alt="exemplo de tela" className="p5f-image" />
            </div>

            <section className="steps">
                <p>Só clicar em <b>abrir</b> e assim, prosseguirá para a próxima tela:</p>
            </section>

            <div className="image-container">
                <img src="/assets/AcessMV/las5.jpeg" alt="exemplo de tela" className="p5f-image" />
            </div>

            <section className="steps">
                <p>Nesta tela do Windows clique em <b>executar</b> ( esta tela pode
                    demorar um pouco para aparecer, depende do computador )</p>
            </section>


            <div className="image-container">
                <img src="/assets/AcessMV/las6.jpeg" alt="exemplo de tela" className="p5f-image" />
            </div>

            <section className="steps">
                <p>O windows abrirá o instalador... agora só clicar em <b>avançar</b> e o LAS será instalado, ao voltar
                    para o MV ele será inicializado normalmente.</p>
            </section>
            <div className="image-container">
                <img src="/assets/AcessMV/las7.jpeg" alt="exemplo de tela" className="p5f-image" />
            </div>

            <section className="steps">
                <h2>OBSERVAÇÃO!!</h2>
                <p>Caso apareça este erro na tela:</p>
            </section>
            <div className="image-container" style={{ display: 'flex' }}>
                <div className="image-container">
                    <img src="/assets/AcessMV/las8.jpeg" alt="exemplo de tela" className="p5f-image" />
                </div>
                <div className="image-container">
                    <img src="/assets/AcessMV/las9.jpeg" alt="exemplo de tela" className="p5f-image" />
                </div>
            </div>
            <section className="steps">
                <p>Só clicar em "fechar processos" e depois em "terminar processos"...
                    (Este problema ocorre quando há um outro navegador além do cent browser aberto)
                </p>
            </section>

            <section className="steps">
                <h2>Passo 7</h2>
                <p>Clique em <b>Continuar</b>!
                </p>
            </section>
            <div className="image-container">
                <img src="/assets/AcessMV/las10.png" alt="exemplo de tela" className="p5f-image" />
            </div>

            <section className="steps">
                <h2>Extra!</h2>
                <p>Adicione o MV aos favoritos na barra de favoritos do Cent Browser para facilitar o acesso.</p>
            </section>
            <div className="image-container">
                <img src="/assets/AcessMV/las11.jpeg" alt="exemplo de tela" className="p5f-image"
                    style={{ marginBottom: '5%' }} />
            </div>

        </main>
        </div>
    </>
  )
}
}

export default acessMVSoul;