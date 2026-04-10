import { useAuth } from "../hooks/useAuth";

const Footer = () => {

  const { role } = useAuth();
    
  return (
    <div>
        {/* ── FOOTER ── */}
        <footer className="footer" style={{ marginTop: "auto" }}>
          <div className="footer-container">
            <div className="footer-logo">
              <a href="/">
                <img
                  src="/assets/SamCordis ( logo branca ).png"
                  alt="Hospital Samcordis"
                />
              </a>
            </div>

            <div className="footer-info">
              <div className="footer-item">
                <h4>Responsável pelo site</h4>
                <p>
                  Tecnologia da Informação (TI)
                  <br />
                  <b>Ramal 2257</b>
                </p>
              </div>
              <div className="footer-item">
                <h4>Responsável pelo Cardápio</h4>
                <p>
                  Setor de Nutrição
                  <br />
                  <b>Ramal 2220</b>
                </p>
              </div>
              <div className="footer-item">
                <h4>Responsável pelas Notícias</h4>
                <p>
                  Recursos Humanos (RH)
                  <br />
                  <b>Ramal 2262</b>
                </p>
              </div>
              {role === "telefonia" && (
                <div className="footer-item">
                  <h4>Responsável pela lista de ramais</h4>
                  <p>
                    Telefonia
                    <br />
                    <b>Ramal 2262</b>
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="footer-right">
            <p>© 2025 - 2026 | Todos os direitos reservados a equipe da TI</p>
          </div>
        </footer>
    </div>
  )
}

export default Footer