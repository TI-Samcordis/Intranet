import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useAuth }  from "../../hooks/useAuth";
 
// ─── Tipos ───────────────────────────────────────────────────────────────────
 
type Role = "ti" | "nutri" | "rh" | "telefonia" | null;
 
// ─── Configuração de links externos (do buttons.js) ───────────────────────────
 
const EXTERNAL: Record<string, string> = {
  hsp:        "http://app.hspsoftware.com.br/",
  email:      "https://outlook.office365.com/mail/",
  cloud:      "https://planner.cloud.microsoft/webui/",
  sharepoint: "https://samcordiscombr.sharepoint.com/sites/Samcordis",
  pfsense:    "http://192.168.0.110/",
  idce:       "http://192.168.0.105/idce/",
  pacs:       "http://192.168.0.105:9001/pacs/public/login",
  rockstor:   "https://192.168.0.70/",
  kaspersky:  "https://192.168.0.136:8080/login#/monitoring/dashboard",
  fme:        "http://192.168.0.194:33052/login/noaccess",
  intelbras:  "https://192.168.0.112:4445/#/home/usuario",
  mvsoul:     "/pages/AcessMv/acessMVSoul.html",
  mvpep:      "/pages/AcessMv/acessMVPep.html",
};
 
const INTERNAL: Record<string, string> = {
  cardapio:   "/cardapio",
  noticias:   "/noticias",
  ramal:      "/ramais",
  editRamal:  "/ramais/editar",
  chamado:    "/chamado",
  teams:      "/teams",
};
 
// ─── Hook de navegação ────────────────────────────────────────────────────────
 
function useNavAction() {
  const navigate = useNavigate();
 
  return (action: string) => {
    if (action in EXTERNAL) {
      window.open(EXTERNAL[action], "_blank");
    } else if (action in INTERNAL) {
      navigate(INTERNAL[action]);
    }
  };
}
 
// ─── Sub-componentes ──────────────────────────────────────────────────────────
 
function NavLink({
  action,
  href,
  children,
  onAction,
}: {
  action: string;
  href?: string;
  children: React.ReactNode;
  onAction: (a: string) => void;
}) {
  return (
    <a
      href={href ?? "#"}
      className={styles.megaLink}
      onClick={(e) => {
        e.preventDefault();
        onAction(action);
      }}
    >
      {children}
    </a>
  );
}
 
// ─── Mega-menu padrão (default / nutri / rh) ──────────────────────────────────
 
function MegaMenuDefault({ onAction }: { onAction: (a: string) => void }) {
  return (
    <div className={styles.dropdownTIContent}>
      <div className={styles.megaDropdown}>
 
        <div className={styles.megaColumn} style={{ marginLeft: "12%" }}>
          <h4>Dúvidas MV</h4>
          <NavLink action="mvsoul" onAction={onAction}>Acessar MvSoul</NavLink>
          <NavLink action="mvpep"  onAction={onAction}>Acessar MvPep</NavLink>
          <NavLink action="chamado" onAction={onAction}>Abrir Chamado | OS</NavLink>
        </div>
 
        <div className={styles.megaColumn}>
          <h4>Ferramentas</h4>
          <NavLink action="hsp"        onAction={onAction}>HSP</NavLink>
          <NavLink action="cloud"      onAction={onAction}>Planner</NavLink>
          <NavLink action="sharepoint" onAction={onAction}>SharePoint</NavLink>
          <NavLink action="email"      onAction={onAction}>Email | Outlook</NavLink>
          <NavLink action="teams"      onAction={onAction}>Teams</NavLink>
          <NavLink action="idce"       onAction={onAction}>iDCE</NavLink>
        </div>
 
        <div className={styles.megaColumn}>
          <h4>Contato</h4>
          <NavLink action="ramal" onAction={onAction}>Ramais</NavLink>
        </div>
 
      </div>
    </div>
  );
}
 
// ─── Mega-menu TI (exclusivo) ─────────────────────────────────────────────────
 
function MegaMenuTI({ onAction }: { onAction: (a: string) => void }) {
  return (
    <div className={styles.dropdownTIContent}>
      <div className={styles.megaDropdown}>
 
        <div className={styles.megaColumn} style={{ marginLeft: "9%" }}>
          <h4>Ferramentas</h4>
          <NavLink action="hsp"       onAction={onAction}>HSP</NavLink>
          <NavLink action="pfsense"   onAction={onAction}>pfSense</NavLink>
          <NavLink action="idce"      onAction={onAction}>iDCE</NavLink>
          <NavLink action="pacs"      onAction={onAction}>PACS</NavLink>
          <NavLink action="rockstor"  onAction={onAction}>Rockstor</NavLink>
          <NavLink action="kaspersky" onAction={onAction}>Kaspersky</NavLink>
          <NavLink action="fme"       onAction={onAction}>Follow Me</NavLink>
          <NavLink action="intelbras" onAction={onAction}>Intelbras</NavLink>
        </div>
 
        <div className={styles.megaColumn}>
          <h4>Microsoft</h4>
          <NavLink action="cloud"      onAction={onAction}>Planner</NavLink>
          <NavLink action="sharepoint" onAction={onAction}>SharePoint</NavLink>
          <NavLink action="email"      onAction={onAction}>Email | Outlook</NavLink>
          <NavLink action="teams"      onAction={onAction}>Teams</NavLink>
        </div>
 
        <div className={styles.megaColumn}>
          <h4>TI</h4>
          <NavLink action="format"              onAction={onAction}>Formatação</NavLink>
          <NavLink action="remoteService"       onAction={onAction}>Atendimento Remoto</NavLink>
          <NavLink action="printerInstallation" onAction={onAction}>Instalação de Impressora</NavLink>
          <NavLink action="proxy"               onAction={onAction}>Configuração de Proxy</NavLink>
          <NavLink action="exchangeOfPcs"       onAction={onAction}>Troca de Máquinas | Backup</NavLink>
        </div>
 
        <div className={styles.megaColumn}>
          <h4>Financeiro</h4>
          <NavLink action="purchaseOrder"   onAction={onAction}>Ordem de Compra</NavLink>
          <NavLink action="serviceEntrance" onAction={onAction}>Entrada de Serviço</NavLink>
          <NavLink action="productEntry"    onAction={onAction}>Entrada de Produto</NavLink>
        </div>
 
        <div className={styles.megaColumn}>
          <h4>Contato</h4>
          <NavLink action="editRamal" onAction={onAction}>Ramais</NavLink>
        </div>
 
      </div>
    </div>
  );
}
 
// ─── Mega-menu TF (telefonia) ─────────────────────────────────────────────────
 
function MegaMenuTF({ onAction }: { onAction: (a: string) => void }) {
  return (
    <div className={styles.dropdownTIContent}>
      <div className={styles.megaDropdown}>
 
        <div className={styles.megaColumn} style={{ marginLeft: "12%" }}>
          <h4>Dúvidas MV</h4>
          <NavLink action="mvsoul"  onAction={onAction}>Acessar MvSoul</NavLink>
          <NavLink action="mvpep"   onAction={onAction}>Acessar MvPep</NavLink>
          <NavLink action="chamado" onAction={onAction}>Abrir Chamado | OS</NavLink>
        </div>
 
        <div className={styles.megaColumn}>
          <h4>Ferramentas</h4>
          <NavLink action="hsp"        onAction={onAction}>HSP</NavLink>
          <NavLink action="cloud"      onAction={onAction}>Planner</NavLink>
          <NavLink action="sharepoint" onAction={onAction}>SharePoint</NavLink>
          <NavLink action="email"      onAction={onAction}>Email | Outlook</NavLink>
          <NavLink action="teams"      onAction={onAction}>Teams</NavLink>
          <NavLink action="idce"       onAction={onAction}>iDCE</NavLink>
        </div>
 
        <div className={styles.megaColumn}>
          <h4>Contato</h4>
          {/* Telefonia vai direto para editar ramais */}
          <NavLink action="editRamal" onAction={onAction}>Ramais</NavLink>
        </div>
 
      </div>
    </div>
  );
}
 
// ─── Componente principal ─────────────────────────────────────────────────────
 
export default function Navbar() {
  const navigate  = useNavigate();
  const onAction  = useNavAction();
  const { role, isLogged, logout } = useAuth();
  const handleLogout = () => { logout(); navigate("/"); };
  const isTI      = role === "ti";
 
  const logoSrc = isTI
    ? "/assets/TISamCordis2.png"
    : "/assets/SamCordis ( logo branca ).png";
 
  const handleHome = () => {
    const routes: Record<string, string> = {
      ti:       "/",
      nutri:    "/",
      rh:       "/",
      telefonia:"/",
    };
    navigate(routes[role ?? ""] ?? "/");
  };
 
  return (
    <nav className={styles.topNav}>
 
      {/* ── ESQUERDA ── */}
      <div className={styles.navLeft}>
        <button className={styles.logoBtn} onClick={handleHome}>
          <img src={logoSrc} alt="Samcordis" />
        </button>
      </div>
 
      {/* ── CENTRO ── */}
      <div className={styles.navCenter}>
 
        {/* Dropdown Nutrição */}
        <div className={styles.dropdown}>
          <button className={styles.navBtn}>Nutrição</button>
          <div className={styles.dropdownContent}>
            <NavLink action="cardapio" onAction={onAction}>Cardápio</NavLink>
          </div>
        </div>
 
        {/* Dropdown TI / mega-menu */}
        <div className={styles.dropdownTI}>
          <button className={`${styles.navBtn} ${styles.navBtnWide}`}>
            {isTI ? <i className="fa-solid fa-book" /> : "T.I."}
          </button>
 
          {isTI      && <MegaMenuTI      onAction={onAction} />}
          {role === "telefonia" && <MegaMenuTF onAction={onAction} />}
          {(!isTI && role !== "telefonia") && <MegaMenuDefault onAction={onAction} />}
        </div>
 
        <button
          className={styles.navBtn}
          onClick={() => onAction("noticias")}
        >
          Notícias
        </button>
 
      </div>
 
      {/* ── DIREITA ── */}
      <div className={styles.navRight}>
        {!isLogged && (
          <button
            className={`${styles.navBtn} ${styles.loginBtn}`}
            onClick={() => navigate("/login")}
          >
            Fazer Login <i className="fa-solid fa-sign-in" />
          </button>
        )}
        {isLogged && (
          <button
            className={`${styles.navBtn} ${styles.loginBtn}`}
            onClick={handleLogout}
          >
            Sair <i className="fa-solid fa-sign-out" />
          </button>
        )}
      </div>
 
    </nav>
  );
}