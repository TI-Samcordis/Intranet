import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./KitchenMenu.module.css";

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface DiaCardapio {
  data: string;
  almoco: string;
  jantar: string;
}

interface Cardapio {
  [dia: string]: DiaCardapio;
}

// ─── Helpers de data ──────────────────────────────────────────────────────────

// "12-04-2026" → "2026-04-12" (para o input type="date")
function brParaISO(dataBR: string): string {
  if (!dataBR) return "";
  const [dia, mes, ano] = dataBR.split("-");
  return `${ano}-${mes}-${dia}`;
}

// "2026-04-12" → "12-04-2026" (para salvar no JSON)
function isoParaBR(dataISO: string): string {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}-${mes}-${ano}`;
}

// ─── Constantes ───────────────────────────────────────────────────────────────

const DIAS = [
  { key: "domingo", label: "Domingo" },
  { key: "segunda", label: "Segunda" },
  { key: "terca",   label: "Terça"   },
  { key: "quarta",  label: "Quarta"  },
  { key: "quinta",  label: "Quinta"  },
  { key: "sexta",   label: "Sexta"   },
  { key: "sabado",  label: "Sábado"  },
];


// ─── Estado inicial vazio ─────────────────────────────────────────────────────

function estadoVazio(): Cardapio {
  return Object.fromEntries(
    DIAS.map((d) => [d.key, { data: "", almoco: "", jantar: "" }])
  );
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function EditCardapio() {
  const navigate                    = useNavigate();
  const [cardapio, setCardapio]     = useState<Cardapio>(estadoVazio);
  const [salvando, setSalvando]     = useState(false);
  const [mensagem, setMensagem]     = useState<"ok" | "erro" | null>(null);
  const hojeIndex                   = new Date().getDay();

  // ── Carrega o JSON atual ao montar ──
  useEffect(() => {
    fetch(`/data/cardapio.json?v=${Date.now()}`)
      .then((r) => r.json())
      .then((data: Cardapio) => {
        // Converte datas BR→ISO para o input type="date"
        const convertido = Object.fromEntries(
          Object.entries(data).map(([dia, val]) => [
            dia,
            { ...val, data: brParaISO(val.data) },
          ])
        );
        setCardapio(convertido);
      })
      .catch(() => setMensagem("erro"));
  }, []);

  // ── Atualiza campo individual ──
  const handleChange = (
    dia: string,
    campo: keyof DiaCardapio,
    valor: string
  ) => {
    setCardapio((prev) => ({
      ...prev,
      [dia]: { ...prev[dia], [campo]: valor },
    }));
  };

  // ── Salva via POST para o PHP (mantido) ──
  const salvar = async () => {
    setSalvando(true);
    setMensagem(null);

    // Converte datas ISO→BR antes de enviar
    const payload = Object.fromEntries(
      Object.entries(cardapio).map(([dia, val]) => [
        dia,
        { ...val, data: isoParaBR(val.data) },
      ])
    );

    try {
      const resp = await fetch("/pages/KitchenMenu/save-cardapio.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) throw new Error();
      setMensagem("ok");
      setTimeout(() => setMensagem(null), 3000);
    } catch {
      setMensagem("erro");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <main className={styles.mainEdit}>

      <h1 className={styles.editTitle}>
        <i className="fa-solid fa-utensils" /> Editar Cardápio
      </h1>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Dia</th>
              <th>Data</th>
              <th>Almoço</th>
              <th>Jantar</th>
            </tr>
          </thead>
          <tbody>
            {DIAS.map(({ key, label }, i) => (
              <tr
                key={key}
                className={i === hojeIndex ? styles.hoje : ""}
              >
                <td>{label}</td>
                <td>
                  <input
                    type="date"
                    className={styles.inputData}
                    value={cardapio[key]?.data ?? ""}
                    onChange={(e) => handleChange(key, "data", e.target.value)}
                  />
                </td>
                <td>
                  <textarea
                    className={styles.textarea}
                    value={cardapio[key]?.almoco ?? ""}
                    onChange={(e) => handleChange(key, "almoco", e.target.value)}
                  />
                </td>
                <td>
                  <textarea
                    className={styles.textarea}
                    value={cardapio[key]?.jantar ?? ""}
                    onChange={(e) => handleChange(key, "jantar", e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Feedback ── */}
      {mensagem === "ok" && (
        <p className={styles.feedbackOk}>
          <i className="fa-solid fa-check" /> Cardápio salvo com sucesso!
        </p>
      )}
      {mensagem === "erro" && (
        <p className={styles.feedbackErro}>
          <i className="fa-solid fa-triangle-exclamation" /> Erro ao salvar. Tente novamente.
        </p>
      )}

      {/* ── Ações ── */}
      <div className={styles.acoes}>
        <button
          className={styles.btnSalvar}
          onClick={salvar}
          disabled={salvando}
        >
          <i className="fa-solid fa-save" />
          {salvando ? " Salvando..." : " Salvar"}
        </button>
        <button
          className={styles.btnVoltar}
          onClick={() => navigate("/cardapio")}
        >
          <i className="fa-solid fa-utensils" /> Cardápio
        </button>
      </div>

    </main>
  );
}