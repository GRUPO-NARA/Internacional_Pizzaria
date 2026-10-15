import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { UNIT_DIRECTORY, UnitId } from "../../mvp-store";
import styles from "./unit.module.css";

const slugs = Object.keys(UNIT_DIRECTORY) as UnitId[];

export function generateStaticParams() {
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const unit = UNIT_DIRECTORY[slug as UnitId];
  if (!unit) return {};
  return {
    title: `Internacional ${unit.name} | Pizzaria em São Luís`,
    description: `Conheça a unidade Internacional ${unit.name}, consulte o endereço e monte seu pedido de pizza artesanal em São Luís.`,
    alternates: { canonical: `/unidades/${slug}` },
    openGraph: {
      title: `Internacional ${unit.name}`,
      description: `Pizza artesanal na unidade ${unit.name}, em São Luís - MA.`,
      type: "website",
    },
  };
}

export default async function UnitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const unit = UNIT_DIRECTORY[slug as UnitId];
  if (!unit) notFound();
  const isFoldedOnly = slug === "renascenca";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: `Internacional Pizzaria - ${unit.name}`,
    address: { "@type": "PostalAddress", streetAddress: unit.address, addressLocality: "São Luís", addressRegion: "MA", addressCountry: "BR" },
    servesCuisine: "Pizza italiana",
    telephone: unit.phone ? `+${unit.phone}` : undefined,
    hasMap: unit.mapUrl,
  };

  return <main className={styles.page}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <nav className={styles.nav}><Link href="/">← Internacional</Link><Link href="/#cardapio">Ver cardápio</Link></nav>
    <section className={styles.hero}>
      <div><span className={styles.tag}>Unidade em São Luís</span><h1>Internacional<br />{unit.name}</h1><p>{isFoldedOnly ? "A unidade especializada em nossa pizza dobrada artesanal." : "Pizzas tradicionais e dobradas, preparadas com ingredientes frescos e o jeito Internacional."}</p></div>
      <aside className={styles.card}><h2>Visite a unidade</h2><p>{unit.address}</p><p>Horários a confirmar com a unidade.</p><a href={unit.mapUrl} target="_blank" rel="noopener noreferrer">Abrir no Google Maps</a></aside>
    </section>
    <section className={styles.facts}><div><span>Cardápio</span>{isFoldedOnly ? "Pizza dobrada" : "Tradicional e dobrada"}</div><div><span>Pedidos</span>{unit.phone ? "Disponível pelo WhatsApp" : "Canal em configuração"}</div><div><span>Atendimento</span>Entrega e retirada</div></section>
  </main>;
}
