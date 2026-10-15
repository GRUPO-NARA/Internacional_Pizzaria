"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "./admin.module.css";
import {
  ADMIN_CATALOG,
  CatalogSettings,
  clearErrors,
  defaultSettings,
  loadCredentialHashes,
  loadErrors,
  loadOrders,
  loadSettings,
  saveCredentialHashes,
  saveOrders,
  saveSettings,
  sha256,
  STATUS_LABELS,
  StoredOrder,
  UNIT_DIRECTORY,
  UnitId,
} from "../mvp-store";

type Tab = "catalog" | "orders" | "errors" | "security";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<Tab>("catalog");
  const [settings, setSettings] = useState<CatalogSettings>(defaultSettings());
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [errors, setErrors] = useState<ReturnType<typeof loadErrors>>([]);
  const [newUser, setNewUser] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [securityMessage, setSecurityMessage] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAuthenticated(window.sessionStorage.getItem("internacional-admin-session") === "active");
      setSettings(loadSettings());
      setOrders(loadOrders());
      setErrors(loadErrors());
    });
    return () => window.clearTimeout(timer);
  }, []);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    const credentials = loadCredentialHashes();
    if (await sha256(user) === credentials.userHash && await sha256(password) === credentials.passwordHash) {
      window.sessionStorage.setItem("internacional-admin-session", "active");
      setAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Usuário ou senha inválidos.");
    }
  };

  const commitSettings = (next: CatalogSettings) => {
    setSettings(next);
    saveSettings(next);
  };

  const updateOrderStatus = (id: string, status: StoredOrder["status"]) => {
    const next = orders.map((order) => order.id === id
      ? { ...order, status, statusHistory: [...order.statusHistory, { status, at: new Date().toISOString() }] }
      : order);
    setOrders(next);
    saveOrders(next);
  };

  const removeOrder = (id: string) => {
    const next = orders.filter((order) => order.id !== id);
    setOrders(next);
    saveOrders(next);
  };

  const clearOrderHistory = () => {
    setOrders([]);
    saveOrders([]);
  };

  const changeCredentials = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newUser.length < 4 || newPassword.length < 10) {
      setSecurityMessage("Use um usuário com 4+ caracteres e uma senha com pelo menos 10 caracteres.");
      return;
    }
    saveCredentialHashes(await sha256(newUser), await sha256(newPassword));
    setNewUser("");
    setNewPassword("");
    setSecurityMessage("Credenciais locais atualizadas neste navegador.");
  };

  if (!authenticated) {
    return <main className={styles.page}>
      <form className={styles.login} onSubmit={login}>
        <span>ACESSO GERENCIAL · MVP LOCAL</span>
        <h1>Painel Internacional</h1>
        <p>Gerencie disponibilidade, preços fictícios e pedidos armazenados neste navegador.</p>
        <label className={styles.field}>Usuário<input value={user} onChange={(event) => setUser(event.target.value)} autoComplete="username" /></label>
        <label className={styles.field}>Senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></label>
        {loginError && <p className={styles.error}>{loginError}</p>}
        <button className={styles.primary} type="submit">Entrar</button>
        <div className={styles.warning}><b>Atenção:</b> este acesso é demonstrativo e local. Não há token no navegador, mas uma aplicação sem servidor não oferece segurança adequada para produção. Troque a senha padrão após entrar.</div>
      </form>
    </main>;
  }

  return <main className={styles.page}><div className={styles.shell}>
    <header className={styles.header}>
      <div><span>GESTÃO LOCAL</span><h1>Painel da pizzaria</h1><p>Alterações válidas somente neste navegador.</p></div>
      <div className={styles.headerActions}><Link href="/">Ver site</Link><button onClick={() => { sessionStorage.removeItem("internacional-admin-session"); setAuthenticated(false); }}>Sair</button></div>
    </header>

    <nav className={styles.tabs} aria-label="Seções do painel">
      {(["catalog", "orders", "errors", "security"] as Tab[]).map((item) => <button key={item} className={tab === item ? styles.active : ""} onClick={() => setTab(item)}>{({ catalog: "Cardápio", orders: "Pedidos", errors: "Erros", security: "Segurança" })[item]}</button>)}
    </nav>

    {tab === "catalog" && <section className={styles.panel}>
      <h2>Cardápio e disponibilidade</h2><p className={styles.muted}>Controle abertura, preço-base e disponibilidade por unidade.</p>
      <div className={styles.settingsRow}>
        <label className={styles.field}>Taxa única de entrega (R$)<input type="number" min="0" step="0.5" value={settings.deliveryFee} onChange={(event) => commitSettings({ ...settings, deliveryFee: Number(event.target.value) })} /></label>
        {(Object.keys(UNIT_DIRECTORY) as UnitId[]).map((unitId) => <div className={styles.unitCard} key={unitId}><label>{UNIT_DIRECTORY[unitId].name}<input type="checkbox" checked={settings.unitOpen[unitId]} onChange={(event) => commitSettings({ ...settings, unitOpen: { ...settings.unitOpen, [unitId]: event.target.checked } })} /></label></div>)}
      </div>
      <div className={styles.catalog}>
        {ADMIN_CATALOG.map(([id, name, kind]) => <div className={styles.product} key={id}>
          <div><strong>{name}</strong><small>{kind}</small></div>
          <label className={styles.field}>Preço-base<input type="number" min="0" step="1" value={settings.prices[id]} onChange={(event) => commitSettings({ ...settings, prices: { ...settings.prices, [id]: Number(event.target.value) } })} /></label>
          {(Object.keys(UNIT_DIRECTORY) as UnitId[]).map((unitId) => <label className={styles.toggle} key={unitId}><input type="checkbox" checked={settings.availability[unitId][id] !== false} onChange={(event) => commitSettings({ ...settings, availability: { ...settings.availability, [unitId]: { ...settings.availability[unitId], [id]: event.target.checked } } })} />{UNIT_DIRECTORY[unitId].name}</label>)}
        </div>)}
      </div>
    </section>}

    {tab === "orders" && <section className={styles.panel}>
      <h2>Pedidos</h2><p className={styles.muted}>Os estados após o encaminhamento ao WhatsApp são atualizados manualmente.</p>
      {orders.length > 0 && <button className={`${styles.secondaryButton} ${styles.danger}`} onClick={clearOrderHistory}>Excluir todos os registros locais</button>}
      <div className={styles.orderList}>{orders.length === 0 ? <div className={styles.empty}>Nenhum pedido registrado neste navegador.</div> : orders.map((order) => <article className={styles.order} key={order.id}>
        <div className={styles.orderHead}><div><strong>{order.id}</strong><div className={styles.orderMeta}>{UNIT_DIRECTORY[order.unitId].name} · {new Date(order.createdAt).toLocaleString("pt-BR")}</div></div><div className={styles.orderActions}><select value={order.status} onChange={(event) => updateOrderStatus(order.id, event.target.value as StoredOrder["status"])}>{Object.entries(STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><button className={styles.danger} onClick={() => removeOrder(order.id)}>Excluir dados</button></div></div>
        <pre>{order.message}</pre>
      </article>)}</div>
    </section>}

    {tab === "errors" && <section className={styles.panel}>
      <h2>Monitoramento local de erros</h2><p className={styles.muted}>Erros de interface ficam registrados somente neste dispositivo.</p>
      <div className={styles.orderList}>{errors.length === 0 ? <div className={styles.empty}>Nenhum erro registrado.</div> : errors.map((error) => <article className={styles.order} key={error.id}><strong>{error.message}</strong><div className={styles.orderMeta}>{error.source} · {new Date(error.at).toLocaleString("pt-BR")}</div></article>)}</div>
      {errors.length > 0 && <button className={`${styles.secondaryButton} ${styles.danger}`} onClick={() => { clearErrors(); setErrors([]); }}>Limpar erros</button>}
    </section>}

    {tab === "security" && <section className={styles.panel}>
      <h2>Segurança do MVP</h2><p className={styles.muted}>Não usamos token ou segredo de servidor. A sessão existe apenas nesta aba e as credenciais são salvas como hashes no navegador.</p>
      <div className={styles.warning}>Este modelo impede exposição de tokens inexistentes, mas não protege contra alguém com acesso ao dispositivo ou ao código. Antes de produção, migre autenticação e pedidos para um servidor.</div>
      <form className={styles.securityGrid} onSubmit={changeCredentials}>
        <label className={styles.field}>Novo usuário<input value={newUser} onChange={(event) => setNewUser(event.target.value)} autoComplete="off" /></label>
        <label className={styles.field}>Nova senha<input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} autoComplete="new-password" /></label>
        <button className={styles.primary}>Atualizar credenciais locais</button>
      </form>
      {securityMessage && <p>{securityMessage}</p>}
    </section>}
  </div></main>;
}
