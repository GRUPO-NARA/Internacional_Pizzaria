export type UnitId = "renascenca" | "cohama" | "cohafuma";
export type PizzaKind = "tradicional" | "dobrada";
export type PaymentMethod = "debito" | "credito" | "pix" | "dinheiro";
export type Fulfillment = "delivery" | "pickup";
export type OrderStatus =
  | "novo"
  | "encaminhado"
  | "confirmado"
  | "em_preparo"
  | "pronto"
  | "saiu_entrega"
  | "concluido"
  | "cancelado";

export const STATUS_LABELS: Record<OrderStatus, string> = {
  novo: "Novo",
  encaminhado: "Encaminhado ao WhatsApp",
  confirmado: "Confirmado",
  em_preparo: "Em preparo",
  pronto: "Pronto para retirada",
  saiu_entrega: "Saiu para entrega",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export const UNIT_DIRECTORY = {
  renascenca: {
    name: "Renascença",
    phone: null,
    address: "Av. Coronel Colares Moreira, 400 — Bloco D1, Loja 5, Jardim Renascença, São Luís - MA, 65075-441",
    mapUrl: "https://www.google.com/maps?vet=10CAAQoqAOahcKEwj47N-69byXAxUAAAAAHQAAAAAQEg..i&channel=entpr&client=firefox-b-e&udm&fvr=1&pvq=Cg0vZy8xMWc5cTJmcjFuIhwKFnBpenphcmlhIGludGVybmFjaW9uYWwQAhgD&lqi=ChZwaXp6YXJpYSBpbnRlcm5hY2lvbmFsSLS4m-GmroCACFogEAAQARgAGAEiFnBpenphcmlhIGludGVybmFjaW9uYWySARBwaXp6YV9yZXN0YXVyYW50mgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVVIyYlRaSU5UaEJSUkFC-gEECAAQKw&cs=1&um=1&ie=UTF-8&fb=1&gl=br&sa=X&geocode=KWOijgUtjPYHMZZp4ylbfsKZ&daddr=_Av.+Coronel+Colares+Moreira,+400+-+Bl+D1+Loja+5+-+Jardim+Renascen%C3%A7a,+S%C3%A3o+Lu%C3%ADs+-+MA,+65075-441",
  },
  cohama: {
    name: "Cohama",
    phone: "5598988097080",
    address: "Av. Brasil, 2 — Vila Vicente Fialho, São Luís - MA, 65070-130",
    mapUrl: "https://www.google.com/maps/dir//Pizzaria+Prime+Internacional,+Ao+lado+do+Emp%C3%B3rio+Fribal+-+Av.+Brasil,+2+-+Vila+Vicente+Fialho,+S%C3%A3o+Lu%C3%ADs+-+MA,+65070-130/@-2.588672,-44.2138624,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x7f68e986cffcbe3:0x7bdf40f710ccaa91!2m2!1d-44.2423113!2d-2.5091794?hl=pt-BR&authuser=1&entry=ttu&g_ep=EgoyMDI2MTAxMi4wIKXMDSoASAFQAw%3D%3D",
  },
  cohafuma: {
    name: "Cohafuma",
    phone: null,
    address: "Av. Jerônimo de Albuquerque, 2000 — Cohafuma, São Luís - MA, 65070-650",
    mapUrl: "https://www.google.com/maps/dir//Pizzaria+Internacional,+Av.+Jer%C3%B4nimo+de+Albuquerque,+2000+-+Cohafuma,+S%C3%A3o+Lu%C3%ADs+-+MA,+65070-650/@-2.588672,-44.2138624,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x7f68e0c234913d3:0x8ccede9414294f17!2m2!1d-44.2626244!2d-2.5127726?entry=ttu&g_ep=EgoyMDI2MTAxMi4wIKXMDSoASAFQAw%3D%3D",
  },
} satisfies Record<UnitId, { name: string; phone: string | null; address: string; mapUrl: string }>;

export const ADMIN_CATALOG = [
  ["pepperoni-roma", "Pepperoni Roma", "tradicional", 60],
  ["margherita-vera", "Margherita Vera", "tradicional", 52],
  ["burrata-di-parma", "Burrata di Parma", "tradicional", 68],
  ["portuguesa-tradicional", "Portuguesa Tradicional", "tradicional", 50],
  ["portuguesa-dobrada", "Portuguesa Dobrada", "dobrada", 18],
  ["calabresa-tradicional", "Calabresa Tradicional", "tradicional", 50],
  ["calabresa-dobrada", "Calabresa Dobrada", "dobrada", 18],
  ["frango-catupiry", "Frango com Catupiry", "tradicional", 50],
  ["frango-catupiry-dobrada", "Frango com Catupiry Dobrada", "dobrada", 18],
  ["carne-seca-queijo", "Carne Seca com Queijo", "tradicional", 50],
  ["carne-seca-queijo-dobrada", "Carne Seca com Queijo Dobrada", "dobrada", 18],
] as const;

export type CatalogSettings = {
  deliveryFee: number;
  unitOpen: Record<UnitId, boolean>;
  availability: Record<UnitId, Record<string, boolean>>;
  prices: Record<string, number>;
};

export type StoredOrder = {
  id: string;
  createdAt: string;
  unitId: UnitId;
  customerName: string;
  customerPhone: string;
  fulfillment: Fulfillment;
  address: string;
  paymentLabel: string;
  total: number;
  message: string;
  status: OrderStatus;
  statusHistory: Array<{ status: OrderStatus; at: string }>;
};

export type ErrorLog = {
  id: string;
  at: string;
  message: string;
  source: string;
};

const SETTINGS_KEY = "internacional-catalog-settings";
const ORDERS_KEY = "internacional-orders";
const ERRORS_KEY = "internacional-errors";
const CREDENTIALS_KEY = "internacional-admin-credentials";

export const DEFAULT_ADMIN_HASHES = {
  userHash: "8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918",
  passwordHash: "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9",
};

export const defaultSettings = (): CatalogSettings => ({
  deliveryFee: 8,
  unitOpen: { renascenca: true, cohama: true, cohafuma: true },
  availability: { renascenca: {}, cohama: {}, cohafuma: {} },
  prices: Object.fromEntries(ADMIN_CATALOG.map(([id, , , price]) => [id, price])),
});

export function loadSettings(): CatalogSettings {
  if (typeof window === "undefined") return defaultSettings();
  try {
    const saved = JSON.parse(window.localStorage.getItem(SETTINGS_KEY) ?? "null");
    return saved ? { ...defaultSettings(), ...saved } : defaultSettings();
  } catch {
    return defaultSettings();
  }
}

export function saveSettings(settings: CatalogSettings) {
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event("internacional-settings"));
}

export function loadOrders(): StoredOrder[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(ORDERS_KEY) ?? "[]"); } catch { return []; }
}

export function saveOrder(order: StoredOrder) {
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...loadOrders()].slice(0, 200)));
}

export function saveOrders(orders: StoredOrder[]) {
  window.localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function loadErrors(): ErrorLog[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(window.localStorage.getItem(ERRORS_KEY) ?? "[]"); } catch { return []; }
}

export function logClientError(message: string, source = "interface") {
  if (typeof window === "undefined") return;
  const entry: ErrorLog = { id: crypto.randomUUID(), at: new Date().toISOString(), message: message.slice(0, 500), source };
  window.localStorage.setItem(ERRORS_KEY, JSON.stringify([entry, ...loadErrors()].slice(0, 100)));
}

export function clearErrors() {
  window.localStorage.setItem(ERRORS_KEY, "[]");
}

export function loadCredentialHashes() {
  if (typeof window === "undefined") return DEFAULT_ADMIN_HASHES;
  try { return JSON.parse(window.localStorage.getItem(CREDENTIALS_KEY) ?? "null") ?? DEFAULT_ADMIN_HASHES; } catch { return DEFAULT_ADMIN_HASHES; }
}

export function saveCredentialHashes(userHash: string, passwordHash: string) {
  window.localStorage.setItem(CREDENTIALS_KEY, JSON.stringify({ userHash, passwordHash }));
}

export async function sha256(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function createOrderId() {
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(2, 14);
  return `INT-${stamp}-${Math.floor(100 + Math.random() * 900)}`;
}

export function recommendUnit(neighborhood: string): UnitId | null {
  const value = neighborhood.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (!value.trim()) return null;
  if (/renascenca|jaracaty|ponta d.areia|sao francisco/.test(value)) return "renascenca";
  if (/cohafuma|calhau|olho d.agua|ponta do farol/.test(value)) return "cohafuma";
  if (/cohama|vinhais|turu|angelim|vicente fialho|cohajap/.test(value)) return "cohama";
  return null;
}
