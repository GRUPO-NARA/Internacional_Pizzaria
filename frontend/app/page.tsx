"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  Banknote,
  Bike,
  Check,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Clock3,
  CreditCard,
  Eye,
  MapPin,
  MessageCircle,
  Minus,
  Navigation,
  Pizza,
  Plus,
  QrCode,
  Sandwich,
  ShoppingBag,
  Sparkles,
  Store,
  Split,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  CatalogSettings,
  createOrderId,
  defaultSettings,
  Fulfillment,
  loadSettings,
  logClientError,
  PaymentMethod,
  PizzaKind,
  recommendUnit,
  saveOrder,
  UNIT_DIRECTORY,
  UnitId,
} from "./mvp-store";

type CartItem = {
  key: string;
  pizzaId: string;
  name: string;
  image: string;
  size: string;
  quantity: number;
  unitPrice: number;
  unitId: UnitId;
  secondPizzaId?: string;
  secondPizzaName?: string;
  addonsFirst: string[];
  addonsSecond: string[];
};

type AddressForm = {
  cep: string;
  street: string;
  number: string;
  noNumber: boolean;
  neighborhood: string;
  complement: string;
  reference: string;
  city: string;
  state: string;
};

const addonOptions = [
  { id: "extra-queijo", label: "Queijo extra", price: 5 },
  { id: "bacon", label: "Bacon", price: 7 },
  { id: "catupiry", label: "Catupiry", price: 6 },
];

const pizzas = [
  {
    id: "pepperoni-roma",
    name: "Pepperoni Roma",
    kind: "tradicional" as PizzaKind,
    note: "A pizza do mês",
    description:
      "Mozzarella, pepperoni artesanal, pimentões assados, azeitonas e molho da casa.",
    price: 60,
    image: "/images/pizza-pepperoni.png",
  },
  {
    id: "margherita-vera",
    name: "Margherita Vera",
    kind: "tradicional" as PizzaKind,
    note: "A clássica",
    description:
      "Tomate San Marzano, fior di latte, manjericão fresco e azeite extravirgem.",
    price: 52,
    image: "/images/pizza-margherita.png",
  },
  {
    id: "burrata-di-parma",
    name: "Burrata di Parma",
    kind: "tradicional" as PizzaKind,
    note: "Edição especial",
    description:
      "Burrata cremosa, presunto cru, rúcula, tomates-cereja e azeite aromático.",
    price: 68,
    image: "/images/pizza-burrata.png",
  },
  {
    id: "portuguesa-tradicional",
    name: "Portuguesa Tradicional",
    kind: "tradicional" as PizzaKind,
    note: "Sabor clássico",
    description:
      "Mozzarella, presunto, ovos, cebola, pimentão, azeitonas e orégano.",
    price: 50,
    image: "/images/pizza-portuguesa.png",
  },
  {
    id: "portuguesa-dobrada",
    name: "Portuguesa Dobrada",
    kind: "dobrada" as PizzaKind,
    note: "Pizza dobrada",
    description:
      "Massa artesanal dobrada com mozzarella, presunto, ovos, cebola, pimentão e azeitonas.",
    price: 18,
    image: "/images/pizza-portuguesa-dobrada.png",
  },
  {
    id: "calabresa-tradicional",
    name: "Calabresa Tradicional",
    kind: "tradicional" as PizzaKind,
    note: "Sabor clássico",
    description:
      "Mozzarella, calabresa dourada, cebola, azeitonas e orégano.",
    price: 50,
    image: "/images/pizza-calabresa.png",
  },
  {
    id: "calabresa-dobrada",
    name: "Calabresa Dobrada",
    kind: "dobrada" as PizzaKind,
    note: "Pizza dobrada",
    description:
      "Massa artesanal dobrada com mozzarella, calabresa dourada, cebola e orégano.",
    price: 18,
    image: "/images/pizza-calabresa-dobrada.png",
  },
  {
    id: "frango-catupiry",
    name: "Frango com Catupiry",
    kind: "tradicional" as PizzaKind,
    note: "Sabor tradicional",
    description:
      "Mozzarella, frango temperado e desfiado, Catupiry cremoso e orégano.",
    price: 50,
    image: "/images/pizza-frango-catupiry.png",
  },
  {
    id: "frango-catupiry-dobrada",
    name: "Frango com Catupiry Dobrada",
    kind: "dobrada" as PizzaKind,
    note: "Pizza dobrada",
    description:
      "Massa artesanal dobrada com frango temperado, mozzarella e Catupiry cremoso.",
    price: 18,
    image: "/images/pizza-frango-catupiry-dobrada.png",
  },
  {
    id: "carne-seca-queijo",
    name: "Carne Seca com Queijo",
    kind: "tradicional" as PizzaKind,
    note: "Sabor tradicional",
    description:
      "Mozzarella, carne seca desfiada, cebola e orégano sobre molho da casa.",
    price: 50,
    image: "/images/pizza-carne-seca-queijo.png",
  },
  {
    id: "carne-seca-queijo-dobrada",
    name: "Carne Seca com Queijo Dobrada",
    kind: "dobrada" as PizzaKind,
    note: "Pizza dobrada",
    description:
      "Massa artesanal dobrada com carne seca desfiada, mozzarella e cebola.",
    price: 18,
    image: "/images/pizza-carne-seca-queijo-dobrada.png",
  },
];

const sizes = [
  { id: "P", multiplier: 0.82 },
  { id: "M", multiplier: 1 },
  { id: "G", multiplier: 1.28 },
];
const foldedSizes = [{ id: "Único", multiplier: 1 }];

const units = [
  {
    id: "renascenca" as UnitId,
    name: "Renascença",
    address: UNIT_DIRECTORY.renascenca.address,
    mapUrl: UNIT_DIRECTORY.renascenca.mapUrl,
    offering: "Exclusiva em pizza dobrada",
    image: "/images/pizza-dobrada.png",
    splitImage: null,
    icon: Sandwich,
    hours: "Horários a confirmar com a unidade",
    acceptedKinds: ["dobrada"] as PizzaKind[],
  },
  {
    id: "cohama" as UnitId,
    name: "Cohama",
    address: UNIT_DIRECTORY.cohama.address,
    mapUrl: UNIT_DIRECTORY.cohama.mapUrl,
    offering: "Pizza tradicional e pizza dobrada",
    image: "/images/pizza-meio-a-meio.png",
    splitImage: "/images/pizza-dobrada.png",
    icon: Pizza,
    hours: "Horários a confirmar com a unidade",
    acceptedKinds: ["tradicional", "dobrada"] as PizzaKind[],
  },
  {
    id: "cohafuma" as UnitId,
    name: "Cohafuma",
    address: UNIT_DIRECTORY.cohafuma.address,
    mapUrl: UNIT_DIRECTORY.cohafuma.mapUrl,
    offering: "Pizza tradicional e pizza dobrada",
    image: "/images/pizza-meio-a-meio.png",
    splitImage: "/images/pizza-dobrada.png",
    icon: Store,
    hours: "Horários a confirmar com a unidade",
    acceptedKinds: ["tradicional", "dobrada"] as PizzaKind[],
  },
];

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function Home() {
  const [active, setActive] = useState("pepperoni-roma");
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [settings, setSettings] = useState<CatalogSettings>(defaultSettings());
  const [halfAndHalf, setHalfAndHalf] = useState(false);
  const [secondPizzaId, setSecondPizzaId] = useState("margherita-vera");
  const [addonsFirst, setAddonsFirst] = useState<string[]>([]);
  const [addonsSecond, setAddonsSecond] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState<AddressForm>({ cep: "", street: "", number: "", noNumber: false, neighborhood: "", complement: "", reference: "", city: "São Luís", state: "MA" });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [needsChange, setNeedsChange] = useState(false);
  const [changeFor, setChangeFor] = useState("");
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [orderNote, setOrderNote] = useState("");
  const [feedback, setFeedback] = useState("");
  const [draftId, setDraftId] = useState("");
  const [draftCreatedAt, setDraftCreatedAt] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(1);
  const menuCarouselRef = useRef<HTMLDivElement>(null);

  const currentUnit = units[selectedUnit];
  const eligiblePizzas = useMemo(
    () => pizzas.filter((item) => currentUnit.acceptedKinds.includes(item.kind)),
    [currentUnit],
  );
  const availablePizzas = useMemo(
    () => eligiblePizzas.filter((item) => settings.availability[currentUnit.id][item.id] !== false),
    [currentUnit.id, eligiblePizzas, settings.availability],
  );
  const pizza = availablePizzas.find((item) => item.id === active) ?? availablePizzas[0] ?? eligiblePizzas[0];
  const pizzaAvailable = availablePizzas.some((item) => item.id === pizza.id);
  const traditionalPizzas = availablePizzas.filter((item) => item.kind === "tradicional");
  const secondPizza = traditionalPizzas.find((item) => item.id === secondPizzaId && item.id !== pizza.id)
    ?? traditionalPizzas.find((item) => item.id !== pizza.id);
  const availableSizes = pizza.kind === "dobrada" ? foldedSizes : sizes;
  const effectiveSize = pizza.kind === "dobrada" ? "Único" : size;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const orderTotal = cartTotal + (fulfillment === "delivery" ? settings.deliveryFee : 0);
  const cartUnit = units.find((unit) => unit.id === cart[0]?.unitId);
  const recommendedUnit = recommendUnit(address.neighborhood);
  const selectedMultiplier = availableSizes.find((item) => item.id === effectiveSize)?.multiplier ?? 1;
  const addonPrice = (ids: string[]) => ids.reduce((sum, id) => sum + (addonOptions.find((addon) => addon.id === id)?.price ?? 0), 0);
  const unitPrice = useMemo(
    () => {
      const firstPrice = settings.prices[pizza.id] ?? pizza.price;
      const base = halfAndHalf && secondPizza
        ? (firstPrice + (settings.prices[secondPizza.id] ?? secondPizza.price)) / 2
        : firstPrice;
      const additions = halfAndHalf
        ? (addonPrice(addonsFirst) + addonPrice(addonsSecond)) / 2
        : addonPrice(addonsFirst);
      return Math.round((base * selectedMultiplier + additions) * 100) / 100;
    },
    [addonsFirst, addonsSecond, halfAndHalf, pizza, secondPizza, selectedMultiplier, settings.prices],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const savedCart = window.localStorage.getItem("internacional-cart");
      if (savedCart) {
        try {
          const parsed = JSON.parse(savedCart) as CartItem[];
          if (Array.isArray(parsed)) setCart(parsed.map((item) => ({ ...item, addonsFirst: item.addonsFirst ?? [], addonsSecond: item.addonsSecond ?? [] })));
        } catch {
          window.localStorage.removeItem("internacional-cart");
        }
      }
      setSettings(loadSettings());
    });

    const reloadSettings = () => setSettings(loadSettings());
    const captureError = (event: ErrorEvent) => logClientError(event.message, event.filename || "window");
    const captureRejection = (event: PromiseRejectionEvent) => logClientError(String(event.reason), "promise");
    window.addEventListener("internacional-settings", reloadSettings);
    window.addEventListener("storage", reloadSettings);
    window.addEventListener("error", captureError);
    window.addEventListener("unhandledrejection", captureRejection);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("internacional-settings", reloadSettings);
      window.removeEventListener("storage", reloadSettings);
      window.removeEventListener("error", captureError);
      window.removeEventListener("unhandledrejection", captureRejection);
    };
  }, []);

  const commitCart = (nextCart: CartItem[]) => {
    setCart(nextCart);
    window.localStorage.setItem("internacional-cart", JSON.stringify(nextCart));
  };

  const selectPizza = (pizzaId: string) => {
    const nextPizza = pizzas.find((item) => item.id === pizzaId);
    setActive(pizzaId);
    setSize(nextPizza?.kind === "dobrada" ? "Único" : "M");
    setHalfAndHalf(false);
    setAddonsFirst([]);
    setAddonsSecond([]);
    setQuantity(1);
    document.querySelector("#destaque")?.scrollIntoView({ behavior: "smooth" });
  };

  const selectUnit = (index: number) => {
    const nextUnit = units[index];
    if (cart.length > 0 && cart[0].unitId !== nextUnit.id) {
      setFeedback(`Sua sacola pertence à unidade ${cartUnit?.name}. Esvazie-a antes de mudar de unidade.`);
      setCartOpen(true);
      return;
    }

    setSelectedUnit(index);
    const nextAvailable = pizzas.filter((item) => nextUnit.acceptedKinds.includes(item.kind) && settings.availability[nextUnit.id][item.id] !== false);
    const nextFallback = nextAvailable[0] ?? pizzas.find((item) => nextUnit.acceptedKinds.includes(item.kind));
    if (nextFallback && !nextAvailable.some((item) => item.id === active)) {
      setActive(nextFallback.id);
      setSize(nextFallback.kind === "dobrada" ? "Único" : "M");
    }
    setHalfAndHalf(false);
    setFeedback("");
  };

  const addToCart = () => {
    if (!pizzaAvailable) {
      setFeedback("Nenhum produto está disponível nesta unidade no momento.");
      return;
    }
    if (!settings.unitOpen[currentUnit.id]) {
      setFeedback(`A unidade ${currentUnit.name} está temporariamente fechada para pedidos.`);
      return;
    }
    if (halfAndHalf && !secondPizza) {
      setFeedback("Escolha dois sabores tradicionais diferentes para montar a pizza meio a meio.");
      return;
    }
    const secondKey = halfAndHalf ? secondPizza?.id : "inteira";
    const key = `${currentUnit.id}-${pizza.id}-${secondKey}-${effectiveSize}-${addonsFirst.join(".")}-${addonsSecond.join(".")}`;
    const existing = cart.find((item) => item.key === key);
    const nextCart = existing
      ? cart.map((item) => item.key === key
        ? { ...item, quantity: Math.min(99, item.quantity + quantity) }
        : item)
      : [...cart, {
        key,
        pizzaId: pizza.id,
        name: pizza.name,
        image: pizza.image,
        size: effectiveSize,
        quantity,
        unitPrice,
        unitId: currentUnit.id,
        secondPizzaId: halfAndHalf ? secondPizza?.id : undefined,
        secondPizzaName: halfAndHalf ? secondPizza?.name : undefined,
        addonsFirst,
        addonsSecond: halfAndHalf ? addonsSecond : [],
      }];
    commitCart(nextCart);
    if (!draftId) {
      setDraftId(createOrderId());
      setDraftCreatedAt(new Date().toISOString());
    }
    setFeedback(`${quantity} ${quantity === 1 ? "item adicionado" : "itens adicionados"} à sacola.`);
    setCartOpen(true);
  };

  const changeCartQuantity = (key: string, delta: number) => {
    commitCart(cart
      .map((item) => item.key === key ? { ...item, quantity: item.quantity + delta } : item)
      .filter((item) => item.quantity > 0));
  };

  const clearCart = () => {
    commitCart([]);
    setFeedback("Sacola esvaziada. Agora você pode escolher outra unidade.");
    setDraftId("");
    setDraftCreatedAt("");
  };

  const paymentLabel = paymentMethod === "debito" ? "Cartão de débito" : paymentMethod === "credito" ? "Cartão de crédito" : paymentMethod === "pix" ? "PIX (dados enviados pela unidade)" : needsChange && changeFor ? `Dinheiro — troco para ${money.format(Number(changeFor))}` : "Dinheiro — não precisa de troco";
  const fullAddress = fulfillment === "delivery" ? `${address.street}, ${address.noNumber ? "sem número" : address.number} — ${address.neighborhood}${address.complement ? `, ${address.complement}` : ""}${address.reference ? ` — referência: ${address.reference}` : ""}, ${address.city} - ${address.state}, CEP ${address.cep}` : cartUnit?.address ?? "";
  const orderSummary = useMemo(() => {
    const lines = cart.flatMap((item) => {
      const flavors = item.secondPizzaName ? [`   • 1/2 ${item.name}`, `   • 1/2 ${item.secondPizzaName}`] : [];
      const additions = [
        item.addonsFirst.length ? `   Adicionais${item.secondPizzaName ? " no lado 1" : ""}: ${item.addonsFirst.map((id) => addonOptions.find((addon) => addon.id === id)?.label).join(", ")}` : "",
        item.addonsSecond.length ? `   Adicionais no lado 2: ${item.addonsSecond.map((id) => addonOptions.find((addon) => addon.id === id)?.label).join(", ")}` : "",
      ].filter(Boolean);
      return [`${item.quantity}x ${item.secondPizzaName ? "Pizza meio a meio" : item.name} (${item.size})`, ...flavors, ...additions, `   Valor: ${money.format(item.unitPrice * item.quantity)}`];
    });
    const created = draftCreatedAt ? new Date(draftCreatedAt) : new Date();
    return [
      "🍕 *NOVO PEDIDO — INTERNACIONAL*",
      `Pedido: *#${draftId || "PRÉVIA"}*`,
      `Data: ${created.toLocaleDateString("pt-BR")} às ${created.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`,
      `Unidade: ${cartUnit?.name ?? currentUnit.name}`,
      "",
      "👤 *CLIENTE*",
      `Nome: ${customerName || "—"}`,
      `Telefone: ${customerPhone || "—"}`,
      `Modalidade: ${fulfillment === "delivery" ? "Entrega" : "Retirada"}`,
      "",
      "🧾 *PEDIDO*",
      ...lines,
      "",
      fulfillment === "delivery" ? "📍 *ENTREGA*" : "📍 *RETIRADA*",
      fullAddress || "—",
      recommendedUnit ? `Unidade sugerida pelo bairro: ${UNIT_DIRECTORY[recommendedUnit].name}` : "Unidade sugerida: confirmar com atendimento",
      "",
      "💳 *PAGAMENTO*",
      paymentLabel,
      orderNote ? `\n📝 *OBSERVAÇÕES*\n${orderNote}` : "",
      "",
      `Subtotal: ${money.format(cartTotal)}`,
      fulfillment === "delivery" ? `Taxa única de entrega: ${money.format(settings.deliveryFee)}` : "",
      `*TOTAL: ${money.format(orderTotal)}*`,
      "",
      "⚠️ Pedido sujeito à confirmação da pizzaria pelo WhatsApp.",
    ].filter(Boolean).join("\n");
  }, [cart, cartTotal, cartUnit, currentUnit.name, customerName, customerPhone, draftCreatedAt, draftId, fulfillment, fullAddress, orderNote, orderTotal, paymentLabel, recommendedUnit, settings.deliveryFee]);

  const deliveryComplete = fulfillment === "pickup" || Boolean(address.cep.trim() && address.street.trim() && (address.noNumber || address.number.trim()) && address.neighborhood.trim());
  const paymentComplete = paymentMethod !== "dinheiro" || !needsChange || Number(changeFor) > orderTotal;
  const canContinue = Boolean(cart.length && customerName.trim().length >= 2 && customerPhone.replace(/\D/g, "").length >= 10 && deliveryComplete && paymentComplete && lgpdConsent);

  const copyOrderSummary = async () => {
    try {
      await navigator.clipboard.writeText(orderSummary);
      setFeedback("Resumo copiado. Você já pode enviá-lo ao atendimento.");
    } catch {
      setFeedback("Não foi possível copiar automaticamente. Revise o resumo antes de continuar.");
    }
  };

  const continueToExternalOrder = () => {
    if (!canContinue) {
      setFeedback("Revise os dados obrigatórios, pagamento, endereço e consentimento antes de continuar.");
      return;
    }
    if (!cartUnit) return;
    const phone = UNIT_DIRECTORY[cartUnit.id].phone;
    if (!phone) {
      setFeedback(`O WhatsApp da unidade ${cartUnit.name} ainda não foi configurado. O resumo pode ser copiado sem perder o pedido.`);
      return;
    }
    const id = draftId || createOrderId();
    const createdAt = draftCreatedAt || new Date().toISOString();
    saveOrder({ id, createdAt, unitId: cartUnit.id, customerName, customerPhone, fulfillment, address: fullAddress, paymentLabel, total: orderTotal, message: orderSummary.replace("#PRÉVIA", `#${id}`), status: "encaminhado", statusHistory: [{ status: "encaminhado", at: new Date().toISOString() }] });
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(orderSummary.replace("#PRÉVIA", `#${id}`))}`, "_blank", "noopener,noreferrer");
  };

  const scrollMenu = (direction: -1 | 1) => {
    const carousel = menuCarouselRef.current;
    if (!carousel) return;

    carousel.scrollBy({
      left: direction * Math.min(carousel.clientWidth * 0.82, 430),
      behavior: "smooth",
    });
  };

  return (
    <main>
      <header className="site-header">
        <a href="#inicio" className="brand" aria-label="Internacional Pizzaria">
          <Image
            src="/images/logo-internacional-transparent.png"
            alt="Internacional Pizzaria & Trattoria"
            width={140}
            height={140}
            priority
          />
        </a>

        <nav className={menuOpen ? "nav-links is-open" : "nav-links"}>
          <a href="#destaque" onClick={() => setMenuOpen(false)}>Destaque</a>
          <a href="#cardapio" onClick={() => setMenuOpen(false)}>Cardápio</a>
          <a href="#historia" onClick={() => setMenuOpen(false)}>Nossa casa</a>
        </nav>

        <div className="header-actions">
          <button
            className="bag-button"
            aria-label={`${cartCount} itens na sacola`}
            onClick={() => setCartOpen(true)}
          >
            <ShoppingBag size={20} strokeWidth={1.8} />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
          <button
            className="menu-button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            {menuOpen ? <X size={22} /> : <span aria-hidden="true"><i /><i /></span>}
          </button>
        </div>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-glow" />
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
          className="eyebrow"
        >
          Pizza italiana, alma brasileira
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
        >
          Uma viagem à Itália<br />em cada fatia.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-copy"
        >
          Fermentação lenta, ingredientes honestos e receitas que respeitam o tempo.
        </motion.p>
        <motion.a
          href="#destaque"
          className="primary-link"
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.97 }}
        >
          Escolher minha pizza
        </motion.a>

        <motion.div
          className="unit-wheel"
          initial={{ opacity: 0, scale: 0.82, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.15 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentUnit.id}
              className={currentUnit.splitImage ? "hero-pizza is-split" : "hero-pizza"}
              initial={{ opacity: 0, scale: 0.88, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={currentUnit.image}
                alt={currentUnit.splitImage
                  ? `Metade pizza tradicional da unidade ${currentUnit.name}`
                  : `Pizza dobrada da unidade ${currentUnit.name}`}
                width={1254}
                height={1254}
                priority
                className={currentUnit.splitImage ? "hero-pizza-base is-half" : "hero-pizza-base"}
              />
              {currentUnit.splitImage && (
                <Image
                  src={currentUnit.splitImage}
                  alt={`Metade pizza dobrada da unidade ${currentUnit.name}`}
                  width={1254}
                  height={1254}
                  priority
                  className="hero-pizza-folded"
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="pizza-sectors" aria-label="Escolha uma das três unidades">
            {units.map((unit, index) => (
              <button
                key={unit.id}
                className={`pizza-sector sector-${index + 1}`}
                aria-label={`Selecionar unidade ${unit.name}`}
                aria-pressed={selectedUnit === index}
                onClick={() => selectUnit(index)}
              />
            ))}
          </div>
          <div className="sector-lines" aria-hidden="true" />
        </motion.div>

        <div className="unit-selectors" role="group" aria-label="Unidades Internacional">
          {units.map((unit, index) => {
            const Icon = unit.icon;
            const isActive = selectedUnit === index;
            return (
              <motion.button
                key={unit.id}
                className={isActive ? "unit-chip active" : "unit-chip"}
                onClick={() => selectUnit(index)}
                aria-pressed={isActive}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                <span><Icon size={19} strokeWidth={1.8} /></span>
                {unit.name}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentUnit.id}
            className="unit-location"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <MapPin size={20} />
            <div>
              <strong>{currentUnit.name}</strong>
              <span>{currentUnit.address}</span>
              <small>{currentUnit.offering}</small>
              <span className="unit-hours"><Clock3 size={14} /> {currentUnit.hours}</span>
              <motion.a
                className="location-map-link"
                href={currentUnit.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir o endereço da unidade ${currentUnit.name} no Google Maps`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Navigation size={15} aria-hidden="true" />
                Ver no Google Maps
              </motion.a>
              <a className="unit-page-link" href={`/unidades/${currentUnit.id}`}>Conhecer esta unidade</a>
            </div>
          </motion.div>
        </AnimatePresence>
        <span className="ingredient ingredient-one">basilico</span>
        <span className="ingredient ingredient-two">pomodoro</span>
      </section>

      <section className="featured" id="destaque">
        <div className="section-heading">
          <span>{pizza.note}</span>
          <h2>{pizza.name}</h2>
          <p>Selecione o tamanho, ajuste a quantidade e monte o seu pedido.</p>
        </div>

        <div className="product-stage">
          <aside className="product-info">
            <div>
              <span className="micro-label">Ingredientes</span>
              <p>{pizza.description}</p>
            </div>
            <div className="servings">
              <span className="micro-label">Quantidade</span>
              <div>
                <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Diminuir quantidade">
                  <Minus size={17} />
                </button>
                <strong>{String(quantity).padStart(2, "0")}</strong>
                <button onClick={() => setQuantity((value) => Math.min(9, value + 1))} aria-label="Aumentar quantidade">
                  <Plus size={17} />
                </button>
              </div>
            </div>
          </aside>

          <div className="product-center">
            <div className="size-picker" aria-label="Escolha o tamanho">
              {availableSizes.map((item) => (
                <button
                  key={item.id}
                  className={effectiveSize === item.id ? "active" : ""}
                  onClick={() => setSize(item.id)}
                  aria-pressed={effectiveSize === item.id}
                >
                  {item.id}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={pizza.image}
                className="featured-image"
                initial={{ opacity: 0, scale: 0.78, rotate: -7 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.86, rotate: 6 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ rotate: 2, scale: 1.025 }}
              >
                <Image src={pizza.image} alt={pizza.name} width={1254} height={1254} />
              </motion.div>
            </AnimatePresence>
          </div>

          <aside className="product-order">
            <span className="micro-label">Total</span>
            <strong>{money.format(unitPrice * quantity)}</strong>
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={addToCart}
              disabled={!settings.unitOpen[currentUnit.id] || !pizzaAvailable}
            >
              <ShoppingBag size={18} /> {!settings.unitOpen[currentUnit.id] ? "Unidade fechada" : pizzaAvailable ? "Adicionar à sacola" : "Cardápio indisponível"}
            </motion.button>
            <small>{cartCount > 0 ? `${cartCount} ${cartCount === 1 ? "item na sacola" : "itens na sacola"}` : `Pedido para ${currentUnit.name}`}</small>
          </aside>
        </div>

        <div className="pizza-builder">
          <div className="builder-heading">
            <div><span className="micro-label">Personalização</span><h3>Monte do seu jeito</h3></div>
            {pizza.kind === "tradicional" && currentUnit.id !== "renascenca" && <button className={halfAndHalf ? "builder-mode active" : "builder-mode"} onClick={() => { setHalfAndHalf((value) => !value); setAddonsSecond([]); }}><Split size={18} /> {halfAndHalf ? "Meio a meio ativo" : "Fazer meio a meio"}</button>}
          </div>
          {halfAndHalf && secondPizza && <label className="builder-select"><span>Segundo sabor</span><select value={secondPizza.id} onChange={(event) => setSecondPizzaId(event.target.value)}>{traditionalPizzas.filter((item) => item.id !== pizza.id).map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select><small>O valor é a média dos dois sabores. Sabores repetidos devem ser pedidos como pizza inteira.</small></label>}
          <div className={halfAndHalf ? "addon-columns is-half" : "addon-columns"}>
            <fieldset><legend>{halfAndHalf ? `Adicionais — 1/2 ${pizza.name}` : "Adicionais da pizza"}</legend>{addonOptions.map((addon) => <label key={addon.id}><input type="checkbox" checked={addonsFirst.includes(addon.id)} onChange={(event) => setAddonsFirst((items) => event.target.checked ? [...items, addon.id] : items.filter((id) => id !== addon.id))} /> <span>{addon.label}</span><em>+ {money.format(addon.price)}</em></label>)}</fieldset>
            {halfAndHalf && <fieldset><legend>Adicionais — 1/2 {secondPizza.name}</legend>{addonOptions.map((addon) => <label key={addon.id}><input type="checkbox" checked={addonsSecond.includes(addon.id)} onChange={(event) => setAddonsSecond((items) => event.target.checked ? [...items, addon.id] : items.filter((id) => id !== addon.id))} /> <span>{addon.label}</span><em>+ {money.format(addon.price)}</em></label>)}</fieldset>}
          </div>
        </div>
      </section>

      <section className="menu-section" id="cardapio">
        <div className="section-title-row">
          <div>
            <span className="eyebrow">Favoritas da casa</span>
            <h2>Sapori senza confini.<br />Una passione.</h2>
          </div>
          <p>{availablePizzas.length} receitas disponíveis na unidade {currentUnit.name}. O cardápio muda conforme a operação de cada loja.</p>
        </div>

        <div className="pizza-carousel-shell">
          <motion.button
            className="carousel-control carousel-previous"
            type="button"
            aria-label="Ver sabores anteriores"
            aria-controls="pizza-carousel"
            onClick={() => scrollMenu(-1)}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.94 }}
          >
            <ChevronLeft size={24} aria-hidden="true" />
          </motion.button>

          <div
            className="pizza-carousel"
            id="pizza-carousel"
            ref={menuCarouselRef}
            aria-label="Carrossel de pizzas favoritas da casa"
          >
            {availablePizzas.length === 0 && <div className="menu-empty">O cardápio desta unidade está temporariamente indisponível.</div>}
            {availablePizzas.map((item) => (
              <motion.article
                key={item.id}
                className="pizza-card"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.42 }}
                onClick={() => selectPizza(item.id)}
              >
                <div className="card-image">
                  <Image src={item.image} alt={item.name} width={1254} height={1254} />
                </div>
                <div className="card-labels">
                  <span>{item.note}</span>
                  <em>{item.kind}</em>
                </div>
                <h3>{item.name}</h3>
                <div className="card-bottom">
                  <p>{item.description}</p>
                  <strong>{money.format(settings.prices[item.id] ?? item.price)}</strong>
                </div>
                <button type="button" aria-label={`Escolher ${item.name}`}>Escolher</button>
              </motion.article>
            ))}
          </div>

          <motion.button
            className="carousel-control carousel-next"
            type="button"
            aria-label="Ver próximos sabores"
            aria-controls="pizza-carousel"
            onClick={() => scrollMenu(1)}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.94 }}
          >
            <ChevronRight size={24} aria-hidden="true" />
          </motion.button>
        </div>
      </section>

      <section className="story" id="historia">
        <motion.div
          className="story-mark"
          initial={{ rotate: -8, opacity: 0 }}
          whileInView={{ rotate: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          <Sparkles size={30} />
          <span>dal forno<br />alla tavola</span>
        </motion.div>
        <div>
          <span className="eyebrow">O nosso jeito</span>
          <h2>Tradição que atravessa fronteiras.</h2>
          <p>
            A Internacional nasceu para aproximar pessoas em volta da mesa. Nossa cozinha combina o rigor da tradição italiana com ingredientes frescos e o calor de uma boa trattoria.
          </p>
          <a href="#cardapio">Conhecer os sabores</a>
        </div>
      </section>

      <AnimatePresence>
        {cartOpen && (
          <motion.div
            className="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          >
            <motion.aside
              className="cart-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-title"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="cart-header">
                <div>
                  <span className="micro-label">Seu pedido</span>
                  <h2 id="cart-title">Sacola {cartUnit ? `— ${cartUnit.name}` : ""}</h2>
                </div>
                <button className="cart-close" onClick={() => setCartOpen(false)} aria-label="Fechar sacola">
                  <X size={22} />
                </button>
              </div>

              {feedback && (
                <div className="cart-feedback" role="status">
                  <Check size={17} /> <span>{feedback}</span>
                </div>
              )}

              {cart.length === 0 ? (
                <div className="empty-cart">
                  <ShoppingBag size={36} />
                  <h3>Sua sacola está vazia</h3>
                  <p>Escolha uma unidade e adicione as pizzas disponíveis nela.</p>
                  <button onClick={() => setCartOpen(false)}>Voltar ao cardápio</button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map((item) => (
                      <article className="cart-item" key={item.key}>
                        <Image src={item.image} alt="" width={78} height={78} />
                        <div className="cart-item-copy">
                          <strong>{item.secondPizzaName ? `${item.name} + ${item.secondPizzaName}` : item.name}</strong>
                          <span>Tamanho {item.size} · {money.format(item.unitPrice)} cada</span>
                          {(item.addonsFirst.length > 0 || item.addonsSecond.length > 0) && <small>Com adicionais personalizados</small>}
                          <div className="cart-item-actions">
                            <button onClick={() => changeCartQuantity(item.key, -1)} aria-label={`Diminuir ${item.name}`}><Minus size={14} /></button>
                            <b>{item.quantity}</b>
                            <button onClick={() => changeCartQuantity(item.key, 1)} aria-label={`Aumentar ${item.name}`}><Plus size={14} /></button>
                            <button className="remove-item" onClick={() => commitCart(cart.filter((candidate) => candidate.key !== item.key))} aria-label={`Remover ${item.name}`}><Trash2 size={15} /></button>
                          </div>
                        </div>
                        <strong>{money.format(item.unitPrice * item.quantity)}</strong>
                      </article>
                    ))}
                  </div>

                  <div className="fulfillment-block">
                    <span className="micro-label">Dados do cliente</span>
                    <div className="cart-grid two-columns">
                      <label className="cart-field"><span>Nome completo *</span><input value={customerName} onChange={(event) => setCustomerName(event.target.value)} placeholder="Quem está fazendo o pedido?" autoComplete="name" /></label>
                      <label className="cart-field"><span>Telefone *</span><input value={customerPhone} onChange={(event) => setCustomerPhone(event.target.value)} placeholder="(98) 99999-9999" inputMode="tel" autoComplete="tel" /></label>
                    </div>
                    <span className="micro-label">Como você quer receber?</span>
                    <div className="fulfillment-options">
                      <button className={fulfillment === "pickup" ? "active" : ""} onClick={() => setFulfillment("pickup")}>
                        <Store size={18} /> Retirada
                      </button>
                      <button className={fulfillment === "delivery" ? "active" : ""} onClick={() => setFulfillment("delivery")}>
                        <Bike size={18} /> Entrega
                      </button>
                    </div>
                    {fulfillment === "pickup" ? (
                      <p className="pickup-address"><MapPin size={15} /> {cartUnit?.address}</p>
                    ) : (
                      <div className="address-fields">
                        <div className="cart-grid two-columns">
                          <label className="cart-field"><span>CEP *</span><input value={address.cep} onChange={(event) => setAddress({ ...address, cep: event.target.value })} placeholder="65000-000" inputMode="numeric" autoComplete="postal-code" /></label>
                          <label className="cart-field"><span>Bairro *</span><input value={address.neighborhood} onChange={(event) => setAddress({ ...address, neighborhood: event.target.value })} placeholder="Seu bairro" autoComplete="address-level3" /></label>
                        </div>
                        <label className="cart-field"><span>Rua ou avenida *</span><input value={address.street} onChange={(event) => setAddress({ ...address, street: event.target.value })} placeholder="Nome da rua" autoComplete="street-address" /></label>
                        <div className="cart-grid two-columns">
                          <label className="cart-field"><span>Número *</span><input value={address.number} disabled={address.noNumber} onChange={(event) => setAddress({ ...address, number: event.target.value })} placeholder="123" /></label>
                          <label className="check-field"><input type="checkbox" checked={address.noNumber} onChange={(event) => setAddress({ ...address, noNumber: event.target.checked, number: "" })} /> Endereço sem número</label>
                        </div>
                        <div className="cart-grid two-columns">
                          <label className="cart-field"><span>Complemento</span><input value={address.complement} onChange={(event) => setAddress({ ...address, complement: event.target.value })} placeholder="Apto, bloco..." /></label>
                          <label className="cart-field"><span>Referência</span><input value={address.reference} onChange={(event) => setAddress({ ...address, reference: event.target.value })} placeholder="Próximo a..." /></label>
                        </div>
                        <div className="unit-recommendation"><Navigation size={16} /> {recommendedUnit ? <>Pelo bairro informado, a unidade mais adequada é <b>{UNIT_DIRECTORY[recommendedUnit].name}</b>. O atendimento confirmará a rota.</> : <>Informe o bairro para receber uma sugestão automática de unidade.</>}</div>
                      </div>
                    )}

                    <span className="micro-label">Forma de pagamento</span>
                    <div className="payment-options">
                      <button className={paymentMethod === "debito" ? "active" : ""} onClick={() => setPaymentMethod("debito")}><CreditCard size={17} /> Débito</button>
                      <button className={paymentMethod === "credito" ? "active" : ""} onClick={() => setPaymentMethod("credito")}><CreditCard size={17} /> Crédito</button>
                      <button className={paymentMethod === "pix" ? "active" : ""} onClick={() => setPaymentMethod("pix")}><QrCode size={17} /> PIX</button>
                      <button className={paymentMethod === "dinheiro" ? "active" : ""} onClick={() => setPaymentMethod("dinheiro")}><Banknote size={17} /> Dinheiro</button>
                    </div>
                    {paymentMethod === "dinheiro" && <div className="cash-change"><label className="check-field"><input type="checkbox" checked={needsChange} onChange={(event) => setNeedsChange(event.target.checked)} /> Preciso de troco</label>{needsChange && <label className="cart-field"><span>Troco para *</span><input type="number" min={orderTotal + 1} value={changeFor} onChange={(event) => setChangeFor(event.target.value)} placeholder="Valor entregue" /></label>}</div>}
                    <label className="cart-field">
                      <span>Observações</span>
                      <textarea value={orderNote} onChange={(event) => setOrderNote(event.target.value)} placeholder="Ex.: retirar cebola, ponto da massa..." rows={3} />
                    </label>
                    <label className="lgpd-consent"><input type="checkbox" checked={lgpdConsent} onChange={(event) => setLgpdConsent(event.target.checked)} /><span>Autorizo o uso dos meus dados somente para preparar, entregar e atender este pedido. Neste MVP, os dados ficam armazenados apenas neste navegador. *</span></label>
                  </div>

                  <div className="cart-summary">
                    <div><span>Subtotal</span><span>{money.format(cartTotal)}</span></div>
                    {fulfillment === "delivery" && <div><span>Taxa única de entrega</span><span>{money.format(settings.deliveryFee)}</span></div>}
                    <div className="grand-total"><span>Total</span><strong>{money.format(orderTotal)}</strong></div>
                    <small>Valores fictícios para validação do MVP.</small>
                  </div>

                  <details className="message-preview" open>
                    <summary><Eye size={17} /> Prévia da mensagem para o WhatsApp</summary>
                    <pre>{orderSummary}</pre>
                  </details>

                  <div className="cart-footer-actions">
                    <button className="copy-order" onClick={copyOrderSummary}><Clipboard size={17} /> Copiar resumo</button>
                    <button className="external-order" onClick={continueToExternalOrder} disabled={!canContinue}>
                      <MessageCircle size={18} /> Continuar no WhatsApp
                    </button>
                    <button className="clear-cart" onClick={clearCart}>Esvaziar sacola</button>
                  </div>

                  <p className="external-disclaimer">Você não fará o pagamento neste site. O pedido e o pagamento serão confirmados no canal externo oficial da unidade.</p>
                </>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <footer>
        <Image src="/images/logo-internacional-transparent.png" alt="Internacional Pizzaria & Trattoria" width={150} height={150} />
        <p>Feita à mão. Servida com afeto.</p>
        <div>
          <a href="/admin">Acesso gerencial</a>
          <a href="#inicio">Voltar ao topo</a>
          <span>© 2026 Internacional</span>
        </div>
      </footer>
    </main>
  );
}
