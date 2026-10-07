"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
  MapPin,
  Minus,
  Navigation,
  Pizza,
  Plus,
  Sandwich,
  ShoppingBag,
  Sparkles,
  Store,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

const pizzas = [
  {
    name: "Pepperoni Roma",
    note: "A pizza do mês",
    description:
      "Mozzarella, pepperoni artesanal, pimentões assados, azeitonas e molho da casa.",
    price: 60,
    image: "/images/pizza-pepperoni.png",
  },
  {
    name: "Margherita Vera",
    note: "A clássica",
    description:
      "Tomate San Marzano, fior di latte, manjericão fresco e azeite extravirgem.",
    price: 52,
    image: "/images/pizza-margherita.png",
  },
  {
    name: "Burrata di Parma",
    note: "Edição especial",
    description:
      "Burrata cremosa, presunto cru, rúcula, tomates-cereja e azeite aromático.",
    price: 68,
    image: "/images/pizza-burrata.png",
  },
];

const sizes = [
  { id: "P", multiplier: 0.82 },
  { id: "M", multiplier: 1 },
  { id: "G", multiplier: 1.28 },
];

const units = [
  {
    id: "renascenca",
    name: "Renascença",
    address:
      "Av. Colares Moreira, 400 — Bloco D1, Loja 5, Jardim Renascença",
    offering: "Exclusiva em pizza dobrada",
    image: "/images/pizza-dobrada.png",
    icon: Sandwich,
  },
  {
    id: "cohama",
    name: "Cohama",
    address: "Av. Daniel de La Touche, 10 — Cohama",
    offering: "Pizza tradicional e pizza dobrada",
    image: "/images/pizza-meio-a-meio.png",
    icon: Pizza,
  },
  {
    id: "cohafuma",
    name: "Cohafuma",
    address: "Av. Jerônimo de Albuquerque, 2000, Loja 5 — Cohafuma",
    offering: "Pizza tradicional e pizza dobrada",
    image: "/images/pizza-meio-a-meio.png",
    icon: Store,
  },
];

const money = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const googleMapsUrl = (address: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${address}, São Luís - MA`,
  )}`;

export default function Home() {
  const [active, setActive] = useState(0);
  const [size, setSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [cart, setCart] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState(1);

  const pizza = pizzas[active];
  const currentUnit = units[selectedUnit];
  const unitPrice = useMemo(
    () =>
      Math.round(
        pizza.price * (sizes.find((item) => item.id === size)?.multiplier ?? 1),
      ),
    [pizza, size],
  );

  const selectPizza = (index: number) => {
    setActive(index);
    setSize("M");
    document.querySelector("#destaque")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main>
      <header className="site-header">
        <a href="#inicio" className="brand" aria-label="Internacional Pizzaria">
          <Image
            src="/images/logo-internacional.jpg"
            alt="Internacional Pizzaria & Trattoria"
            width={96}
            height={96}
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
            aria-label={`${cart} itens na sacola`}
            onClick={() => document.querySelector("#destaque")?.scrollIntoView({ behavior: "smooth" })}
          >
            <ShoppingBag size={20} strokeWidth={1.8} />
            {cart > 0 && <span>{cart}</span>}
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
              className="hero-pizza"
              initial={{ opacity: 0, scale: 0.88, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotate: 5 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={currentUnit.image}
                alt={`Opções de pizza da unidade ${currentUnit.name}`}
                width={1254}
                height={1254}
                priority
              />
            </motion.div>
          </AnimatePresence>

          <div className="pizza-sectors" aria-label="Escolha uma das três unidades">
            {units.map((unit, index) => (
              <button
                key={unit.id}
                className={`pizza-sector sector-${index + 1}`}
                aria-label={`Selecionar unidade ${unit.name}`}
                aria-pressed={selectedUnit === index}
                onClick={() => setSelectedUnit(index)}
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
                onClick={() => setSelectedUnit(index)}
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
              <motion.a
                className="location-map-link"
                href={googleMapsUrl(currentUnit.address)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir o endereço da unidade ${currentUnit.name} no Google Maps`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                <Navigation size={15} aria-hidden="true" />
                Ver no Google Maps
              </motion.a>
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
              {sizes.map((item) => (
                <button
                  key={item.id}
                  className={size === item.id ? "active" : ""}
                  onClick={() => setSize(item.id)}
                  aria-pressed={size === item.id}
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
              onClick={() => setCart((value) => value + quantity)}
            >
              <ShoppingBag size={18} /> Adicionar à sacola
            </motion.button>
            <small>{cart > 0 ? `${cart} ${cart === 1 ? "item reservado" : "itens reservados"}` : "Pedido demonstrativo"}</small>
          </aside>
        </div>
      </section>

      <section className="menu-section" id="cardapio">
        <div className="section-title-row">
          <div>
            <span className="eyebrow">Favoritas da casa</span>
            <h2>Tre sapori.<br />Una passione.</h2>
          </div>
          <p>Três receitas, uma mesma massa leve: 48 horas de fermentação para uma borda aerada e crocante.</p>
        </div>

        <div className="pizza-grid">
          {pizzas.map((item, index) => (
            <motion.article
              key={item.name}
              className="pizza-card"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ delay: index * 0.08 }}
              onClick={() => selectPizza(index)}
            >
              <div className="card-image">
                <Image src={item.image} alt={item.name} width={1254} height={1254} />
              </div>
              <span>{item.note}</span>
              <h3>{item.name}</h3>
              <div className="card-bottom">
                <p>{item.description}</p>
                <strong>{money.format(item.price)}</strong>
              </div>
              <button aria-label={`Escolher ${item.name}`}>Escolher</button>
            </motion.article>
          ))}
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

      <footer>
        <Image src="/images/logo-internacional.jpg" alt="Internacional Pizzaria & Trattoria" width={110} height={110} />
        <p>Feita à mão. Servida com afeto.</p>
        <div>
          <a href="#inicio">Voltar ao topo</a>
          <span>© 2026 Internacional</span>
        </div>
      </footer>
    </main>
  );
}
