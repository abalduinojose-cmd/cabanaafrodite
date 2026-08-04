# Cabana Afrodite

Landing page de página única para a Cabana Afrodite, cabana A-Frame de aluguel por temporada no alto da serra, entre Petrópolis e Paty do Alferes (entrada pelo Vale das Videiras).

Objetivo, em ordem: levar o visitante à reserva no Airbnb, capturar contato pelo WhatsApp e vender o clima do refúgio antes da diária.

## Identidade

- **Paleta** (pedida pelo cliente): branco `#FFFFFF` / creme `#FAF7F2`, preto quente `#17110B` e marrom café quente `#7A5236` (com `#9C6B44` no topo dos gradientes e `#573A25` no hover). Acento `latte #CFAA80` sobre fundos escuros.
- **Logo**: recriado em SVG fiel à arte enviada (A geométrico cortado pela assinatura "Afrodite" em script, "CABANA" espaçado abaixo). Preto e branco saem do mesmo componente via `currentColor` — [Logo.tsx](src/components/ui/Logo.tsx), versões `LogoAfrodite` (vertical) e `LogoLinha` (navbar/rodapé).
- **Tipografia**: Bricolage Grotesque (títulos), Inter (corpo), Allura (script do logo), Instrument Serif itálico (frases poéticas e "CABANA" do logo).
- **Layout**: linguagem do projeto Icarus — pílulas com seta em círculo, cartões com sombra suave, trilhos arrastáveis, silhueta de serra com A-Frame como divisor, CTA fixo em pílula clara com selo "★ 4,94 · Superhost".

## Stack

Next.js 15 (App Router, RSC por padrão), TypeScript `strict`, Tailwind CSS v4 (`@theme` em [globals.css](src/app/globals.css)), Motion nas entradas, `next/image`, `next/font`, `lucide-react`. Sem biblioteca de UI.

## Como rodar

```bash
npm install
```

```bash
npm run dev
```

Sobe em http://localhost:5210. `npm run build` e `npm run typecheck` completam o trio.

## Conteúdo real (raspado do anúncio em 03/08/2026)

- **4,94 ★ · 136 avaliações**, Superhost, Preferido dos hóspedes.
- **12 avaliações reais** com nome, mês e **foto de perfil de quem avaliou** (baixadas para `public/avaliacoes/`, nunca hotlink). Textos verbatim, cortes só em fim de frase. Fonte única: [content.ts](src/data/content.ts).
- **Notas por categoria** exibidas na seção de avaliações: Limpeza 5,0 · Exatidão 5,0 · Comunicação 5,0 · Check-in 4,9 · Custo-benefício 4,9 · Localização 4,8.
- **Menções oficiais** ("o que os hóspedes destacam"): 46 hospitalidade, 44 vista, 35 conforto — usadas na seção do mar de nuvens.
- **102 fotos do anúncio** baixadas para `img/airbnb/` (a01..a102, contact sheets em `src-assets/airbnb-sheet-*.jpg` para curadoria).

### Scripts de assets

| Comando | O que faz |
|---|---|
| `npm run airbnb` | Baixa avatares dos hóspedes e as 102 fotos do anúncio (manifesto em `src-assets/airbnb.json`) |
| `npm run fotos` | Copia a curadoria (Instagram `img/` + Airbnb `img/airbnb/`) para `src/assets/photos/` com nomes semânticos e gera o `public/og.jpg` |
| `npm run sheets` | Gera contact sheets numerados de `img/` para mapear fotos |
| `npm run placeholders` | Regenera o único placeholder restante (mapa estilizado da região) |
| `npm run logo` | Extrai o logo oficial de `src-assets/logo-original.png` para `public/logo/` com fundo transparente |
| `npm run video` | Comprime os reels de `src-assets/videos/` e extrai os posters para `public/videos/` |

Para trocar uma foto do site: edite o mapa em [scripts/fotos.mjs](scripts/fotos.mjs) e rode `npm run fotos`. O `alt` correspondente vive em `content.ts`.

## Logo

A arte enviada pelo cliente virou uma **máscara PNG transparente** (`public/logo/afrodite.png` e `afrodite-marca.png`, geradas por `npm run logo`). O componente usa `mask-image` + `background-color: currentColor`, então o mesmo arquivo pinta de preto, branco ou creme só herdando a cor do contexto: não existe versão por cor nem troca de arquivo quando o header fica sólido. `LogoAfrodite` é a marca completa (rodapé e CTA final) e `LogoMarca` é a reduzida, sem o "CABANA", usada na navbar.

## Vídeos

### Hero

O fundo do hero é um walkthrough da cabana (`public/videos/hero.mp4`), mudo, em loop e sem controles. O arquivo de origem já é H.264 720p com bitrate cheio, então `npm run video` **não reencoda**: copia o vídeo bit a bit, tira a trilha de áudio e move o índice para o começo do arquivo. A qualidade é a do original e o peso cai para 2,5 MB.

Um arquivo só serve desktop e mobile: em vez de recortar um 9:16 pequeno e borrado, o vídeo inteiro é usado com `object-cover` e o enquadramento muda por `object-position` (62% no retrato, centro no paisagem), o que preserva a resolução cheia nas duas telas.

O LCP continua sendo imagem: o primeiro quadro do vídeo vira `src/assets/photos/hero-video.jpg`, entra como `next/image` com `priority`, e o `<video>` (com `preload="none"`) só aparece por cima, com fade, quando o navegador avisa que dá para tocar. Se o autoplay for bloqueado, a foto fica e nada quebra.

### Reels

A seção "Quem foi, filmou" traz três reels reais (@domini.film, @cabanaafrodite, @thaynaventura) mais o convite para seguir o Instagram. **Nada roda sozinho**: o `<video>` entra com `preload="none"` e só busca bytes quando o hóspede toca no play; antes disso o que aparece é o poster, uma imagem comum e otimizada. Ao dar play, os controles nativos aparecem e o som toca. Os arquivos originais estão em `src-assets/videos/` e a versão web (720p, ~1 a 7 MB) em `public/videos/`.

## Seções

Hero (drone do anúncio, `a81.jpg`, mesma foto no desktop e no mobile: como é horizontal, o retrato usa `object-position: 72%` para o corte cair na cabana e não no morro) → faixa de prova social (noite) → silhueta da serra → A Cabana → destaques → **mar de nuvens** (full-bleed poético com as menções reais) → ambientes (trilho com 7 cards: quarto, sala, cozinha, jantar, estar & cinema, banheiro, área externa) → comodidades (noite) → momentos (filmstrip de fotos) → **reels + Instagram** (noite) → avaliações (resumo com louros + barras + carrossel com avatares reais) → localização (foto da cabana esmaecida ao fundo + mapa em fachada, sem endereço exato) → boas-vindas (acordeão nativo) → CTA final noturno com o logo → rodapé.

## Antes de publicar

1. **Domínio**: `SITE.url` está com placeholder `https://www.cabanaafrodite.com.br`. Corrija em `content.ts` antes do deploy (alimenta canonical, OG e JSON-LD).
2. **WhatsApp**: confirme que `(21) 97288-7766` recebe mensagem.
3. **Avaliações**: são reais e datadas; vale renovar de tempos em tempos rodando de novo a coleta.
4. **Analytics**: `src/lib/analytics.ts` só empilha eventos em `window.dataLayer` (`reserve_click`, `contact_click` com `location`). Instale GTM/GA4/Pixel para consumir; sem script, o site funciona igual.

## Transições entre seções

Tudo em CSS scroll-driven (`animation-timeline`), sem JavaScript e sem custo de bundle. Onde o navegador não suporta, a foto simplesmente fica parada.

- **Parallax do hero** (`.deriva-hero`): a foto desce 5% enquanto a primeira tela sobe, com `scroll(root block)`.
- **Parallax das fotos full-bleed** (`.deriva-foto`, mar de nuvens e CTA final): a imagem deriva de -4% a 4% enquanto cruza a tela, com `view()`. O `scale(1.12)` cobre a folga, então nunca aparece borda.
- **Cortina** (`.cortina`): a foto de "A Cabana" abre de baixo para cima ao entrar em cena.
- **Pontes de gradiente** (`.ponte-topo-creme`, `.ponte-base-branco`, `.ponte-base-noite`): a cor da seção vizinha vaza por cima da foto e some, então não existe corte visível entre uma seção de cor e uma foto full-bleed.
- **Silhueta da serra**: divisor em SVG com a cabana A-Frame no alto do morro, usado nas três viradas para o escuro.

Tudo isso vive dentro de `@media (prefers-reduced-motion: no-preference)`. **Este computador está com "Efeitos de animação" desligado no Windows**, então o parallax não aparece nele por escolha do sistema; para ver, ligue em Configurações → Acessibilidade → Efeitos visuais.

## Notas de implementação

- **LCP**: hero é Server Component puro com entrada em CSS (`rise`); Motion só abaixo da dobra, `viewport={{ once: true }}`.
- **Movimento reduzido**: o transform do Motion é anulado via CSS (`[data-reveal]`), sobrando o fade; HTML de servidor e cliente idênticos (`MotionConfig reducedMotion="never"`).
- **Sem JavaScript**: `@media (scripting: none)` devolve a opacidade das seções.
- **Trilhos**: [Trilho.tsx](src/components/ui/Trilho.tsx) — arrasto com mouse, snap no toque, setas que desabilitam nas pontas. O `ul` é `relative` de propósito: um `sr-only` (absolute) dentro de carrossel ancoraria na seção e esticaria o scroll da página inteira (bug real, corrigido em Stars com `aria-label`).
- **Menu mobile** vive fora do `<header>`: `backdrop-blur` cria bloco de contenção e colapsaria um filho `fixed`.
- **Mapa**: iframe do Google só depois do clique; zero requisição de terceiros no carregamento.
- **Indicador do Next**: `devIndicators: false` no `next.config.ts` derruba o indicador de rota, mas não o selo de issues; o portal do overlay é escondido no `globals.css` (`nextjs-portal { display: none }`). Só existe em dev, e os erros seguem aparecendo no terminal e no console.
- **JSON-LD** `LodgingBusiness` montado do `content.ts`, geo aproximado (nunca o endereço da casa), `sameAs` Instagram + Airbnb.
