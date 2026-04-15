import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./KitchenMenu.module.css";

type Refeicao = "almoco" | "jantar";

interface DiaCardapio {
  data: string;
  almoco: string;
  jantar: string;
}

interface Cardapio {
  [dia: string]: DiaCardapio;
}

const DIAS_SEMANA = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];
const DIAS_KEY    = ["domingo", "segunda", "terca", "quarta", "quinta", "sexta", "sabado"];

export default function KitchenMenuNutri() {
  const navigate                  = useNavigate();
  const [refeicao, setRefeicao]   = useState<Refeicao>("almoco");
  const [cardapio, setCardapio]   = useState<Cardapio | null>(null);
  const [erro, setErro]           = useState(false);
  const hojeIndex                 = new Date().getDay();

  const isNoite = refeicao === "jantar";

  useEffect(() => {
    fetch(`/data/cardapio.json?v=${Date.now()}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setCardapio)
      .catch(() => setErro(true));
  }, []);

  return (
    <main className={`${styles.main} ${isNoite ? styles.noite : ""}`}>

      {/* Sol → almoço | Lua → jantar + efeito noite */}
      <div className={styles.toggleRefeicao}>
        <button
          className={`${styles.toggleBtn} ${refeicao === "almoco" ? styles.ativo : ""}`}
          onClick={() => setRefeicao("almoco")}
          title="Almoço"
        >
          <i className="fa-solid fa-sun" />
        </button>
        <button
          className={`${styles.toggleBtn} ${refeicao === "jantar" ? styles.ativo : ""}`}
          onClick={() => setRefeicao("jantar")}
          title="Jantar"
        >
          <i className="fa-solid fa-moon" />
        </button>
      </div>

      <p className={styles.labelRefeicao}>
        {refeicao === "almoco" ? "☀️ Cardápio do Almoço" : "🌙 Cardápio do Jantar"}
      </p>

      {/* Botão exclusivo da view de Nutri/TI */}
      <button
        className={styles.btnEdit}
        onClick={() => navigate("/cardapio/editar")}
      >
        <i className="fa-solid fa-pen-to-square" /> Editar Cardápio
      </button>

      {erro && <p className={styles.erro}>Não foi possível carregar o cardápio.</p>}

      {cardapio && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Dia</th>
                <th>Data</th>
                <th>Cardápio</th>
              </tr>
            </thead>
            <tbody>
              {DIAS_KEY.map((diaKey, i) => (
                <tr key={diaKey} className={i === hojeIndex ? styles.hoje : ""}>
                  <td>{DIAS_SEMANA[i]}</td>
                  <td>{cardapio[diaKey]?.data ?? "-"}</td>
                  <td>{cardapio[diaKey]?.[refeicao] ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </main>
  );
}