from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    Image,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path("/home/bruno/Documentos/Projetos_NARA/SIte_internacional")
OUT = ROOT / "output/pdf/plano_prioridades_pizzaria_internacional.pdf"
LOGO = Path("/home/bruno/Downloads/logo_internacional.jpg")

OUT.parent.mkdir(parents=True, exist_ok=True)

W, H = A4
GREEN = colors.HexColor("#087A45")
GREEN_DARK = colors.HexColor("#075A36")
RED = colors.HexColor("#C72C3B")
CREAM = colors.HexColor("#FBF7F0")
INK = colors.HexColor("#20201E")
MUTED = colors.HexColor("#66635D")
LINE = colors.HexColor("#DED9CF")
PALE_GREEN = colors.HexColor("#E8F3ED")
PALE_RED = colors.HexColor("#F9E9EB")
GOLD = colors.HexColor("#D8A33A")


pdfmetrics.registerFont(TTFont("DejaVu", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DejaVu-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("DejaVuSerif", "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"))
pdfmetrics.registerFont(TTFont("DejaVuSerif-Bold", "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"))


styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name="CoverKicker", fontName="DejaVu-Bold", fontSize=10, leading=14,
    textColor=RED, spaceAfter=8, alignment=TA_CENTER, tracking=1.2,
))
styles.add(ParagraphStyle(
    name="CoverTitle", fontName="DejaVuSerif-Bold", fontSize=28, leading=34,
    textColor=INK, spaceAfter=12, alignment=TA_CENTER,
))
styles.add(ParagraphStyle(
    name="CoverSub", fontName="DejaVu", fontSize=11.5, leading=18,
    textColor=MUTED, alignment=TA_CENTER,
))
styles.add(ParagraphStyle(
    name="H1x", fontName="DejaVuSerif-Bold", fontSize=22, leading=27,
    textColor=INK, spaceAfter=8,
))
styles.add(ParagraphStyle(
    name="H2x", fontName="DejaVu-Bold", fontSize=13, leading=17,
    textColor=GREEN_DARK, spaceBefore=8, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="Bodyx", fontName="DejaVu", fontSize=9.2, leading=14,
    textColor=INK, spaceAfter=5,
))
styles.add(ParagraphStyle(
    name="Smallx", fontName="DejaVu", fontSize=7.8, leading=11.5,
    textColor=MUTED,
))
styles.add(ParagraphStyle(
    name="Bulx", fontName="DejaVu", fontSize=8.8, leading=13,
    textColor=INK, leftIndent=11, firstLineIndent=-7, bulletIndent=1, spaceAfter=3,
))
styles.add(ParagraphStyle(
    name="CardTitle", fontName="DejaVu-Bold", fontSize=10, leading=13,
    textColor=INK, spaceAfter=3,
))
styles.add(ParagraphStyle(
    name="PhaseTag", fontName="DejaVu-Bold", fontSize=8, leading=10,
    textColor=colors.white, alignment=TA_CENTER,
))
styles.add(ParagraphStyle(
    name="TableHead", fontName="DejaVu-Bold", fontSize=7.8, leading=10,
    textColor=colors.white,
))
styles.add(ParagraphStyle(
    name="TableCell", fontName="DejaVu", fontSize=7.4, leading=10.5,
    textColor=INK,
))
styles.add(ParagraphStyle(
    name="Quote", fontName="DejaVuSerif", fontSize=12, leading=18,
    textColor=GREEN_DARK, alignment=TA_CENTER,
))
styles.add(ParagraphStyle(
    name="Callout", fontName="DejaVu-Bold", fontSize=9.2, leading=13,
    textColor=colors.white,
))


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(CREAM)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setFillColor(GREEN)
    canvas.rect(0, H - 3 * mm, 42 * mm, 3 * mm, fill=1, stroke=0)
    canvas.setFillColor(RED)
    canvas.rect(W - 24 * mm, H - 3 * mm, 24 * mm, 3 * mm, fill=1, stroke=0)
    canvas.setStrokeColor(LINE)
    canvas.setLineWidth(0.5)
    canvas.line(18 * mm, 14 * mm, W - 18 * mm, 14 * mm)
    canvas.setFont("DejaVu", 7.5)
    canvas.setFillColor(MUTED)
    canvas.drawString(18 * mm, 9 * mm, "Internacional Pizzaria & Trattoria | Plano de prioridades")
    canvas.drawRightString(W - 18 * mm, 9 * mm, f"{doc.page}")
    canvas.restoreState()


def cover_bg(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(CREAM)
    canvas.rect(0, 0, W, H, fill=1, stroke=0)
    canvas.setFillColor(GREEN)
    canvas.circle(-12 * mm, H - 10 * mm, 55 * mm, fill=1, stroke=0)
    canvas.setFillColor(RED)
    canvas.circle(W + 12 * mm, 10 * mm, 50 * mm, fill=1, stroke=0)
    canvas.setFillColor(GOLD)
    canvas.rect(0, 0, W, 4 * mm, fill=1, stroke=0)
    canvas.restoreState()


doc = BaseDocTemplate(
    str(OUT), pagesize=A4,
    leftMargin=18 * mm, rightMargin=18 * mm,
    topMargin=18 * mm, bottomMargin=19 * mm,
    title="Plano de Prioridades - Internacional Pizzaria",
    author="Diagnóstico técnico e operacional",
    subject="Roadmap de evolução do site para operação comercial",
)

cover_frame = Frame(18 * mm, 18 * mm, W - 36 * mm, H - 36 * mm, id="cover", showBoundary=0)
body_frame = Frame(18 * mm, 19 * mm, W - 36 * mm, H - 37 * mm, id="body", showBoundary=0)
doc.addPageTemplates([
    PageTemplate(id="Cover", frames=[cover_frame], onPage=cover_bg),
    PageTemplate(id="Body", frames=[body_frame], onPage=footer),
])


def p(text, style="Bodyx"):
    return Paragraph(text, styles[style])


def bullet(text):
    return Paragraph(f"• {text}", styles["Bulx"])


def phase_header(code, title, subtitle, color=GREEN):
    tag = Table([[p(code, "PhaseTag")]], colWidths=[25 * mm], rowHeights=[8 * mm])
    tag.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), color),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("BOX", (0, 0), (-1, -1), 0, color),
    ]))
    return [tag, Spacer(1, 4 * mm), p(title, "H1x"), p(subtitle, "Bodyx"), Spacer(1, 2 * mm)]


def priority_card(title, why, actions, result, level="CRÍTICA"):
    level_color = RED if level == "CRÍTICA" else GREEN if level == "ALTA" else GOLD
    data = [[
        p(title, "CardTitle"),
        Table([[p(level, "PhaseTag")]], colWidths=[20 * mm], rowHeights=[6 * mm], style=TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), level_color),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ])),
    ], [
        p(f"<b>Por quê:</b> {why}", "Smallx"), "",
    ], [
        p("<b>Ações:</b> " + actions, "Smallx"), "",
    ], [
        p(f"<b>Resultado esperado:</b> {result}", "Smallx"), "",
    ]]
    tbl = Table(data, colWidths=[142 * mm, 27 * mm], hAlign="LEFT")
    tbl.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.7, LINE),
        ("SPAN", (0, 1), (1, 1)),
        ("SPAN", (0, 2), (1, 2)),
        ("SPAN", (0, 3), (1, 3)),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    return KeepTogether([tbl, Spacer(1, 3 * mm)])


story = []

# Cover
story.append(Spacer(1, 25 * mm))
if LOGO.exists():
    logo = Image(str(LOGO), width=37 * mm, height=37 * mm)
    logo.hAlign = "CENTER"
    story.append(logo)
story.append(Spacer(1, 10 * mm))
story.append(p("PLANO DE EVOLUÇÃO COMERCIAL", "CoverKicker"))
story.append(p("Internacional Pizzaria<br/>& Trattoria", "CoverTitle"))
story.append(p("Prioridades organizadas por etapas para transformar a landing page atual em uma experiência de pedidos segura, operável e vendável.", "CoverSub"))
story.append(Spacer(1, 18 * mm))
cover_table = Table([
    [p("FOCO", "Smallx"), p("ESCOPO", "Smallx"), p("DECISÃO-CHAVE", "Smallx")],
    [p("Conversão + operação", "CardTitle"), p("3 unidades", "CardTitle"), p("Pagamento externo", "CardTitle")],
], colWidths=[56 * mm, 50 * mm, 63 * mm])
cover_table.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), PALE_GREEN),
    ("BACKGROUND", (0, 1), (-1, 1), colors.white),
    ("BOX", (0, 0), (-1, -1), 0.7, LINE),
    ("INNERGRID", (0, 0), (-1, -1), 0.4, LINE),
    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("TOPPADDING", (0, 0), (-1, -1), 7),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
]))
story.append(cover_table)
story.append(Spacer(1, 28 * mm))
story.append(p("Diagnóstico técnico, operacional e comercial", "CoverSub"))
story.append(p("15 de outubro de 2026", "CoverSub"))
story.append(NextPageTemplate("Body"))
story.append(PageBreak())

# Executive summary
story.extend(phase_header("VISÃO GERAL", "Onde o projeto está hoje", "A interface já comunica bem a marca, mas a operação de pedidos ainda é demonstrativa."))
story.append(p("<b>Diagnóstico:</b> o site atual é uma vitrine visual forte, responsiva e moderna. A seleção de unidade, pizza, tamanho e quantidade funciona apenas no estado local do navegador. Não há sacola real, persistência, validação operacional, painel administrativo ou integração com um canal externo de pedidos e pagamento."))
story.append(Spacer(1, 2 * mm))

summary = Table([
    [p("ÁREA", "TableHead"), p("ESTADO ATUAL", "TableHead"), p("META COMERCIAL", "TableHead")],
    [p("Apresentação", "TableCell"), p("Visual consistente e responsivo", "TableCell"), p("Preservar e reforçar a marca", "TableCell")],
    [p("Unidades", "TableCell"), p("Mudam imagem e endereço", "TableCell"), p("Controlar cardápio, horário e canal de pedido", "TableCell")],
    [p("Sacola", "TableCell"), p("Apenas um contador", "TableCell"), p("Itens, quantidades, observações e resumo", "TableCell")],
    [p("Pagamento", "TableCell"), p("Inexistente", "TableCell"), p("100% em ferramenta externa", "TableCell")],
    [p("Gestão", "TableCell"), p("Dados fixos no código", "TableCell"), p("Atualização sem depender de novo código", "TableCell")],
    [p("Qualidade", "TableCell"), p("Sem testes e monitoramento", "TableCell"), p("Fluxos críticos testados e observáveis", "TableCell")],
], colWidths=[37 * mm, 64 * mm, 68 * mm])
summary.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), GREEN_DARK),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, CREAM]),
    ("GRID", (0, 0), (-1, -1), 0.45, LINE),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING", (0, 0), (-1, -1), 6),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
]))
story.append(summary)
story.append(Spacer(1, 5 * mm))
story.append(p("Princípio da solução", "H2x"))
story.append(p("O site não deve processar cartão ou PIX. Ele deve levar o cliente ao canal externo correto da unidade, ou montar um pedido e transferi-lo por integração oficial. Se não houver API, o WhatsApp pode ser usado como fallback estruturado, sempre com status de pedido aguardando confirmação."))
story.append(Spacer(1, 3 * mm))
story.append(p("“O objetivo não é construir um sistema financeiro; é eliminar atrito entre a escolha da pizza e o pedido confirmado.”", "Quote"))
story.append(PageBreak())

# Phase 0
story.extend(phase_header("ETAPA 0 · P0", "Descoberta e validação operacional", "Resolver as decisões que alteram todo o produto antes de desenvolver novos fluxos.", RED))
story.append(priority_card(
    "Confirmar as três unidades",
    "Há divergência entre Holandeses e Cohafuma nas informações fornecidas.",
    "Confirmar nome oficial, endereço, telefone, WhatsApp, Google Maps, horários, retirada/entrega e responsável por cada loja.",
    "Cadastro oficial e único para as três unidades."
))
story.append(priority_card(
    "Definir o canal externo de pedidos e pagamento",
    "A arquitetura muda conforme a ferramenta aceite apenas links, carrinho pré-preenchido, API ou webhook.",
    "Escolher o fornecedor; levantar links por unidade; validar custos, suporte, integração e estados de pedido.",
    "Fluxo de saída e confirmação tecnicamente definido."
))
story.append(priority_card(
    "Validar cardápio e regras comerciais",
    "Os preços e tamanhos atuais são demonstrativos e calculados por multiplicadores.",
    "Obter preços reais por tamanho/unidade, adicionais, bordas, meio a meio, pedido mínimo, taxas, disponibilidade e alergênicos.",
    "Matriz de produtos aprovada pela operação."
))
story.append(priority_card(
    "Definir o posicionamento da primeira versão",
    "Vitrine com redirecionamento e plataforma integrada têm custos e responsabilidades diferentes.",
    "Escolher entre MVP de vitrine + link externo ou sacola própria + integração oficial.",
    "Escopo comercial transparente, sem prometer um checkout inexistente."
))
story.append(p("Critério de saída da etapa", "H2x"))
for t in [
    "Todas as unidades e seus canais foram confirmados por escrito.",
    "A ferramenta externa e o fluxo de pagamento foram aprovados.",
    "Cardápio, preços e regras de atendimento têm uma fonte oficial.",
    "O MVP tem escopo, prazo, responsável e critério de aceite.",
]:
    story.append(bullet(t))
story.append(PageBreak())

# Phase 1
story.extend(phase_header("ETAPA 1 · P0/P1", "MVP pronto para vender", "Entregar um site que converte clientes sem interferir no processamento do pagamento."))
story.append(priority_card(
    "Cardápio condicionado à unidade",
    "Renascença vende somente pizza dobrada; Cohama e Cohafuma oferecem as duas categorias.",
    "Filtrar produtos, tamanhos, preços e disponibilidade pela loja selecionada; impedir combinações inválidas.",
    "O cliente só vê e pede o que a unidade realmente produz."
))
story.append(priority_card(
    "Sacola real e resumo do pedido",
    "O contador atual não registra itens nem permite conferência.",
    "Adicionar itens, editar quantidade, remover, incluir observação, calcular subtotal e vincular tudo a uma unidade.",
    "Resumo confiável antes do redirecionamento externo."
))
story.append(priority_card(
    "Entrega, retirada e área atendida",
    "A loja precisa saber como e onde atender o pedido.",
    "Coletar modalidade, bairro/CEP quando necessário, taxa, pedido mínimo, estimativa e endereço da retirada.",
    "Pedido operacionalmente viável antes de sair do site.", "ALTA"
))
story.append(priority_card(
    "Encaminhamento externo seguro",
    "O site não deve armazenar credenciais de cartão ou considerar um simples retorno como pagamento aprovado.",
    "Redirecionar para o link da unidade ou usar API oficial; tratar cancelamento, falha e pendência; usar WhatsApp como fallback.",
    "Pagamento integralmente fora do sistema, com expectativa clara para o cliente."
))
story.append(priority_card(
    "Informação essencial e confiança",
    "Cliente precisa confirmar que a loja está aberta e saber como pedir ajuda.",
    "Mostrar horários, telefone, WhatsApp, mapa, prazo estimado, políticas básicas, empresa responsável e alergênicos.",
    "Menos abandono e menos chamadas por dúvida.", "ALTA"
))
story.append(PageBreak())

# Phase 2
story.extend(phase_header("ETAPA 2 · P1", "Operação profissional", "Reduzir dependência técnica e dar controle diário à equipe da pizzaria."))
story.append(priority_card(
    "Painel administrativo simples",
    "Hoje qualquer alteração exige editar código e publicar novamente.",
    "Permitir atualizar preço, descrição, imagem, horário, contato, disponibilidade e destaque por unidade.",
    "A operação mantém o cardápio sem acionar o desenvolvedor.", "ALTA"
))
story.append(priority_card(
    "Disponibilidade e ruptura",
    "Restaurantes precisam retirar rapidamente itens esgotados e fechar pedidos fora do horário.",
    "Criar estados aberto/fechado, produto esgotado, pausa temporária e horário especial.",
    "Menos cancelamentos por produto ou loja indisponível.", "ALTA"
))
story.append(priority_card(
    "Registro e rastreabilidade do pedido",
    "Quando houver integração, é necessário investigar falhas sem armazenar dados financeiros.",
    "Salvar identificador, unidade, itens, valor, canal externo, data e estado; limitar dados pessoais e definir retenção.",
    "Suporte consegue localizar e explicar cada ocorrência.", "ALTA"
))
story.append(priority_card(
    "Integração e confirmação",
    "O status externo pode mudar após o cliente sair do site.",
    "Validar assinatura de webhook, tornar eventos idempotentes e mapear pendente, confirmado, cancelado e falhou.",
    "Estado consistente sem pagamento duplicado ou confirmação falsa.", "ALTA"
))
story.append(priority_card(
    "Observabilidade e atendimento",
    "Falhas silenciosas custam pedidos e reputação.",
    "Adicionar monitoramento de erro, saúde da integração, logs sem dados sensíveis e procedimento de contingência.",
    "Problemas detectados e tratados com rapidez.", "ALTA"
))
story.append(PageBreak())

# Phase 3
story.extend(phase_header("ETAPA 3 · P2", "Crescimento e gestão", "Transformar o site em canal mensurável de aquisição e recompra.", GOLD))
growth_data = [
    ("Métricas do funil", "Medir unidade selecionada, produto visto, sacola iniciada e saída para o canal externo."),
    ("SEO local", "Criar presença indexável por unidade, dados estruturados, sitemap, mapa e informações consistentes."),
    ("Promoções", "Gerenciar destaques e campanhas; cupons devem ser validados pela ferramenta externa."),
    ("Fidelidade", "Integrar somente com consentimento e regras claras; evitar banco paralelo desnecessário."),
    ("Relatórios", "Comparar cliques, conversão, produtos e horários por unidade sem misturar pagamento interno."),
    ("Experimentos", "Testar chamadas, ordem do cardápio e promoções com métricas e janela de avaliação."),
]
rows = [[p("INICIATIVA", "TableHead"), p("OBJETIVO", "TableHead"), p("PRIORIDADE", "TableHead")]]
for name, desc in growth_data:
    rows.append([p(name, "TableCell"), p(desc, "TableCell"), p("MÉDIA", "TableCell")])
growth = Table(rows, colWidths=[36 * mm, 108 * mm, 25 * mm], repeatRows=1)
growth.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), GREEN_DARK),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, CREAM]),
    ("GRID", (0, 0), (-1, -1), 0.45, LINE),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING", (0, 0), (-1, -1), 7),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
]))
story.append(growth)
story.append(Spacer(1, 6 * mm))
story.append(p("Indicadores sugeridos", "H2x"))
for t in [
    "Conversão de visita em clique para pedido externo.",
    "Conversão por unidade, dispositivo, produto e horário.",
    "Taxa de abandono após iniciar a sacola.",
    "Erros de integração e tempo médio de recuperação.",
    "Produtos visualizados versus produtos encaminhados ao pedido.",
]:
    story.append(bullet(t))
story.append(Spacer(1, 5 * mm))
story.append(p("Regra de gestão", "H2x"))
story.append(p("Somente iniciar esta etapa depois que o fluxo básico estiver estável. Campanha sobre uma operação inconsistente aumenta reclamação, não receita."))
story.append(PageBreak())

# Cross-cutting
story.extend(phase_header("TRANSVERSAL", "Pontos de atenção em todas as etapas", "Requisitos que não devem ficar para o final."))
risks = [
    ("LGPD e privacidade", "Coletar somente o necessário; definir retenção; separar consentimento promocional; nunca registrar cartão, senha ou credenciais PIX."),
    ("Segurança", "Validar dados no servidor quando houver backend; proteger painel; limitar tentativas; guardar segredos fora do código; verificar webhooks."),
    ("Performance", "A pasta de imagens tem cerca de 40 MB. Converter para WebP/AVIF, dimensionar, carregar sob demanda e medir em celular."),
    ("Acessibilidade", "Manter navegação por teclado, foco visível, contraste, rótulos e redução de movimento; testar leitor de tela nos fluxos críticos."),
    ("Qualidade", "Criar testes para regras de unidade, preços, sacola, horários e integração; incluir lint, build e testes no processo de entrega."),
    ("Manutenibilidade", "Separar a página monolítica em domínio, dados e componentes; remover a dependência acidental chamada ‘22’; fixar versão do Node."),
    ("Conteúdo e direitos", "Confirmar autorização sobre logo, fotografias, textos e imagens; registrar quem aprova alterações de cardápio."),
    ("Continuidade", "Definir backup, exportação, propriedade das contas, contingência de WhatsApp e procedimento quando o fornecedor externo cair."),
]
for title, desc in risks:
    box = Table([[p(title, "CardTitle"), p(desc, "Smallx")]], colWidths=[43 * mm, 126 * mm])
    box.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), PALE_GREEN),
        ("BACKGROUND", (1, 0), (1, 0), colors.white),
        ("BOX", (0, 0), (-1, -1), 0.5, LINE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 7),
        ("RIGHTPADDING", (0, 0), (-1, -1), 7),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(box)
    story.append(Spacer(1, 2 * mm))
story.append(PageBreak())

# Roadmap and acceptance
story.extend(phase_header("ROADMAP", "Sequência recomendada e critérios de aceite", "Prazos dependem das respostas da pizzaria e das capacidades da ferramenta externa."))
roadmap_rows = [
    [p("ORDEM", "TableHead"), p("ETAPA", "TableHead"), p("ENTREGA PRINCIPAL", "TableHead"), p("DEPENDÊNCIA", "TableHead")],
    [p("1", "TableCell"), p("Descoberta", "TableCell"), p("Cadastro oficial, matriz do cardápio e ferramenta escolhida", "TableCell"), p("Decisões do negócio", "TableCell")],
    [p("2", "TableCell"), p("MVP", "TableCell"), p("Cardápio por unidade, sacola e saída externa", "TableCell"), p("Links/API confirmados", "TableCell")],
    [p("3", "TableCell"), p("Operação", "TableCell"), p("Admin, disponibilidade, registros e monitoramento", "TableCell"), p("Processo interno definido", "TableCell")],
    [p("4", "TableCell"), p("Crescimento", "TableCell"), p("SEO, métricas, campanhas e relatórios", "TableCell"), p("Fluxo estável", "TableCell")],
]
roadmap = Table(roadmap_rows, colWidths=[17 * mm, 34 * mm, 76 * mm, 42 * mm])
roadmap.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), GREEN_DARK),
    ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, CREAM]),
    ("GRID", (0, 0), (-1, -1), 0.45, LINE),
    ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ("ALIGN", (0, 1), (0, -1), "CENTER"),
    ("LEFTPADDING", (0, 0), (-1, -1), 6),
    ("RIGHTPADDING", (0, 0), (-1, -1), 6),
    ("TOPPADDING", (0, 0), (-1, -1), 7),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
]))
story.append(roadmap)
story.append(Spacer(1, 6 * mm))
story.append(p("Checklist para considerar o MVP pronto", "H2x"))
checks = [
    "A unidade escolhida controla catálogo, preço, horário e destino do pedido.",
    "Renascença não permite pizza tradicional; as demais seguem a matriz aprovada.",
    "A sacola mostra itens, quantidade, observação e total sem divergência.",
    "Entrega/retirada e regras de atendimento são validadas antes da saída.",
    "O cliente é encaminhado ao canal externo correto, inclusive em celular.",
    "Falha ou cancelamento não aparece como pagamento confirmado.",
    "Contatos, horários, mapas e políticas foram aprovados pela pizzaria.",
    "Desempenho, acessibilidade, lint, build e testes críticos foram verificados.",
    "Domínio, hospedagem, fornecedor externo e responsáveis estão documentados.",
]
for t in checks:
    story.append(bullet(f"□ {t}"))
story.append(Spacer(1, 5 * mm))
story.append(p("Modelo comercial recomendado", "H2x"))
story.append(p("Vender a primeira entrega como <b>site institucional e cardápio digital integrado ao canal externo de pedidos</b>. Painel administrativo, integração avançada, relatórios e evolução contínua podem compor uma segunda entrega ou contrato mensal de manutenção."))
story.append(Spacer(1, 4 * mm))
note = Table([[p("Próxima decisão", "Callout"), p("Confirmar a terceira unidade e escolher a ferramenta externa de pedidos/pagamento. Essas duas respostas destravam todo o planejamento técnico.", "Bodyx")]], colWidths=[40 * mm, 129 * mm])
note.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (0, 0), RED),
    ("TEXTCOLOR", (0, 0), (0, 0), colors.white),
    ("BACKGROUND", (1, 0), (1, 0), PALE_RED),
    ("BOX", (0, 0), (-1, -1), 0.7, RED),
    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("LEFTPADDING", (0, 0), (-1, -1), 8),
    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
    ("TOPPADDING", (0, 0), (-1, -1), 8),
    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
]))
story.append(note)

doc.build(story)
print(OUT)
