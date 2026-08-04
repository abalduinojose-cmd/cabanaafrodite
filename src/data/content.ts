import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import type { StaticImageData } from "next/image";

import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import { asset } from "@/lib/asset";
import {
  Award,
  Bath,
  BedDouble,
  Beef,
  CalendarCheck,
  Camera,
  Car,
  ChefHat,
  CookingPot,
  DoorClosed,
  Droplets,
  Flame,
  Instagram,
  KeyRound,
  MapPin,
  Microwave,
  Monitor,
  Moon,
  PersonStanding,
  Phone,
  Projector,
  Refrigerator,
  ShoppingBasket,
  ShowerHead,
  Speaker,
  Telescope,
  Users,
  UtensilsCrossed,
  Wifi,
  Wind,
  Wine,
} from "lucide-react";

import areaExterna from "@/assets/photos/ambiente-area-externa.jpg";
import banheiro from "@/assets/photos/ambiente-banheiro.jpg";
import cozinha from "@/assets/photos/ambiente-cozinha.jpg";
import estarCinema from "@/assets/photos/ambiente-estar-cinema.jpg";
import quarto from "@/assets/photos/ambiente-quarto.jpg";
import salaDeEstar from "@/assets/photos/ambiente-sala-de-estar.jpg";
import salaDeJantar from "@/assets/photos/ambiente-sala-de-jantar.jpg";
import ctaNoite from "@/assets/photos/cta-noite.jpg";
import galeria01 from "@/assets/photos/galeria-01.jpg";
import galeria02 from "@/assets/photos/galeria-02.jpg";
import galeria03 from "@/assets/photos/galeria-03.jpg";
import galeria04 from "@/assets/photos/galeria-04.jpg";
import galeria05 from "@/assets/photos/galeria-05.jpg";
import galeria06 from "@/assets/photos/galeria-06.jpg";
import galeria07 from "@/assets/photos/galeria-07.jpg";
import galeria08 from "@/assets/photos/galeria-08.jpg";
import galeria09 from "@/assets/photos/galeria-09.jpg";
import galeria10 from "@/assets/photos/galeria-10.jpg";
import galeria11 from "@/assets/photos/galeria-11.jpg";
import galeria12 from "@/assets/photos/galeria-12.jpg";
import galeria13 from "@/assets/photos/galeria-13.jpg";
import hero from "@/assets/photos/hero.jpg";
import heroVideo from "@/assets/photos/hero-video.jpg";
import mapaRegiao from "@/assets/photos/mapa-vale-das-videiras.jpg";
import marDeNuvens from "@/assets/photos/mar-de-nuvens.jpg";
import sobreCabana from "@/assets/photos/sobre-cabana.jpg";

/* ==========================================================================
   Fonte única de verdade: nenhuma string visível vive dentro de JSX.
   ========================================================================== */

/* -------------------------------------------------------------------------
   Tipos
   ------------------------------------------------------------------------- */

export type NavLink = {
  readonly label: string;
  readonly href: `#${string}`;
};

export type Stat = {
  readonly value: string;
  readonly label: string;
};

export type Chip = {
  readonly label: string;
  readonly icon: LucideIcon;
};

export type Highlight = {
  readonly title: string;
  readonly description: string;
  readonly icon: LucideIcon;
};

export type Space = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: StaticImageData;
  readonly alt: string;
};

export type Amenity = {
  readonly label: string;
  readonly icon: LucideIcon;
};

export type AmenityGroup = {
  readonly id: string;
  readonly title: string;
  readonly items: readonly Amenity[];
};

export type Review = {
  readonly id: string;
  readonly quote: string;
  readonly author: string;
  readonly date: string;
  /** Caminho já resolvido por `asset()`, então carrega o basePath da prévia. */
  readonly avatar: string;
};

export type RatingRow = {
  readonly label: string;
  readonly value: number;
};

export type NearbyItem = {
  readonly label: string;
  readonly icon: LucideIcon;
};

export type Reel = {
  readonly id: string;
  /** Caminhos já resolvidos por `asset()`. */
  readonly src: string;
  readonly poster: string;
  readonly credito: string;
  readonly legenda: string;
};

/** Aceita ícones do lucide e os glifos de marca desenhados à mão. */
export type IconeComponente = ComponentType<{
  readonly className?: string;
  readonly strokeWidth?: number;
}>;

export type SocialLink = {
  readonly id: string;
  /** Nome acessível: vira aria-label e title, já que o botão é só ícone. */
  readonly label: string;
  readonly href: string;
  readonly icon: IconeComponente;
};

export type Rule = {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
};

export type Photo = {
  readonly image: StaticImageData;
  readonly alt: string;
};

/* -------------------------------------------------------------------------
   Contato e dados do anúncio (raspados do Airbnb em 03/08/2026)
   ------------------------------------------------------------------------- */

export const CONTACT = {
  airbnb: "https://www.airbnb.com.br/rooms/1309401960357292675",
  instagram: "https://www.instagram.com/cabanaafrodite/",
  whatsapp:
    "https://wa.me/5521972887766?text=Ol%C3%A1!%20Vi%20o%20site%20da%20Cabana%20Afrodite%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida.",
  phoneDisplay: "(21) 97288-7766",
  instagramHandle: "@cabanaafrodite",
  region: "Vale das Videiras · Serra do Rio",
  rating: 4.94,
  ratingDisplay: "4,94",
  reviewCount: 136,
} as const;

/** Coordenada aproximada da região, nunca o endereço exato da cabana. */
export const GEO = {
  latitude: -22.4425,
  longitude: -43.1119,
  locality: "Paty do Alferes",
  region: "RJ",
  country: "BR",
  /** Enquadramento usado no mapa incorporado, sem marcador na casa. */
  mapEmbedSrc:
    "https://www.google.com/maps?q=Vale%20das%20Videiras%2C%20Petr%C3%B3polis%20-%20RJ&z=12&output=embed",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=Vale+das+Videiras,+Petr%C3%B3polis+-+RJ",
} as const;

/* -------------------------------------------------------------------------
   Metadados do site
   ------------------------------------------------------------------------- */

export const SITE = {
  /** TODO: trocar pelo domínio definitivo antes de publicar. */
  url: "https://www.cabanaafrodite.com.br",
  name: "Cabana Afrodite",
  scriptName: "Afrodite",
  capsName: "CABANA",
  title: "Cabana Afrodite · Cabana A-Frame com banheira acima das nuvens, na Serra do Rio",
  description:
    "Cabana A-Frame para casais entre Petrópolis e Paty do Alferes. Banheira de hidromassagem com vista para o mar de nuvens, lareira, telescópio e self check-in. Nota 4,94 no Airbnb.",
  ogAlt: "Cabana A-Frame de madeira ao entardecer, com banheira no deck e a serra ao fundo.",
  locale: "pt_BR",
  keywords: [
    "cabana A-Frame",
    "Vale das Videiras",
    "cabana com banheira",
    "mar de nuvens",
    "hospedagem romântica",
    "Petrópolis",
    "Paty do Alferes",
    "Serra do Rio de Janeiro",
  ],
} as const;

/* -------------------------------------------------------------------------
   Rótulos reutilizados
   ------------------------------------------------------------------------- */

/**
 * Para onde os botões de reserva apontam.
 *
 * Com o motor de reservas ligado, tudo desce para o calendário do próprio
 * site, onde o hóspede escolhe as datas e paga. Sem ele (a vitrine estática
 * no GitHub Pages), os mesmos botões continuam levando ao Airbnb, para
 * nunca existir um caminho que termina em nada.
 */
export const RESERVAS_ATIVAS = process.env.NEXT_PUBLIC_RESERVAS_ATIVAS === "1";

/**
 * Modo demonstração da prévia pública: o checkout aparece completo e
 * navegável, mas o pagamento avisa que entra na versão final. Serve para o
 * cliente aprovar a experiência antes de existir backend.
 */
export const RESERVAS_DEMO =
  !RESERVAS_ATIVAS && process.env.NEXT_PUBLIC_RESERVAS_DEMO === "1";

const CHECKOUT_VISIVEL = RESERVAS_ATIVAS || RESERVAS_DEMO;

export const RESERVAR = {
  /** Página dedicada de checkout, aberta em uma aba só dela. */
  href: CHECKOUT_VISIVEL ? "/reserva" : CONTACT.airbnb,
  novaAba: true,
  curto: CHECKOUT_VISIVEL ? "Reservar" : "Reservar no Airbnb",
  longo: CHECKOUT_VISIVEL ? "Ver datas e reservar" : "Verificar disponibilidade",
  final: CHECKOUT_VISIVEL ? "Reservar agora" : "Reservar no Airbnb",
} as const;

export const ACTIONS = {
  bookShort: "Reservar no Airbnb",
  bookLong: "Verificar disponibilidade",
  whatsapp: "Falar no WhatsApp",
} as const;

export const A11Y = {
  skipToContent: "Pular para o conteúdo",
  openMenu: "Abrir menu de navegação",
  closeMenu: "Fechar menu de navegação",
  mainNav: "Navegação principal",
  mobileNav: "Navegação em tela cheia",
  whatsappFloating: "Falar no WhatsApp sobre a Cabana Afrodite",
  spacesScroller: "Galeria dos ambientes da cabana",
  reviewsScroller: "Avaliações dos hóspedes",
  momentsScroller: "Galeria de momentos na cabana",
  scrollPrevious: "Ver anterior",
  scrollNext: "Ver próximo",
  fiveStars: "Nota 5 de 5",
  mapTitle: "Mapa do Vale das Videiras, Serra do Rio de Janeiro",
  heroVideo: "Passeio pela Cabana Afrodite: fachada, deck, fogueira e a vista do vale",
  homeLink: "Cabana Afrodite, ir para o topo",
} as const;

/* -------------------------------------------------------------------------
   Navegação
   ------------------------------------------------------------------------- */

export const NAV: readonly NavLink[] = [
  { label: "A Cabana", href: "#a-cabana" },
  { label: "Ambientes", href: "#ambientes" },
  { label: "Comodidades", href: "#comodidades" },
  { label: "Momentos", href: "#momentos" },
  { label: "Avaliações", href: "#avaliacoes" },
  { label: "Localização", href: "#localizacao" },
  { label: "Datas", href: "#datas" },
] as const;

/* -------------------------------------------------------------------------
   Hero
   ------------------------------------------------------------------------- */

export const HERO = {
  eyebrow: CONTACT.region,
  title: "Onde o tempo desacelera e só resta vocês dois.",
  subtitle:
    "Cabana A-Frame para casais, com banheira de hidromassagem de frente para o vale, lareira e um céu que parece estar ao alcance da mão.",
  /** Fundo em vídeo; a foto abaixo é o pôster e é ela que segura o LCP. */
  video: asset("/videos/hero.mp4"),
  photo: {
    image: heroVideo,
    alt: "Fachada da cabana A-Frame ao fim da tarde, com deck de madeira, banheira e telescópio voltados para o vale.",
  } satisfies Photo,
  seals: [
    `${CONTACT.ratingDisplay} ★ · ${CONTACT.reviewCount} avaliações`,
    "Superhost",
    "Preferido dos hóspedes",
    "Self check-in",
  ],
} as const;

/* -------------------------------------------------------------------------
   Prova social
   ------------------------------------------------------------------------- */

export const SOCIAL_PROOF = {
  stats: [
    { value: CONTACT.ratingDisplay, label: "Avaliação geral" },
    { value: String(CONTACT.reviewCount), label: "Avaliações no Airbnb" },
    { value: "2 anos", label: "Hospedando casais" },
    { value: "Superhost", label: "Anfitriã reconhecida" },
  ] satisfies readonly Stat[],
  badge: "Preferido dos hóspedes: uma das acomodações que mais fazem sucesso no Airbnb.",
} as const;

/* -------------------------------------------------------------------------
   Sobre o espaço
   ------------------------------------------------------------------------- */

export const ABOUT = {
  id: "a-cabana",
  eyebrow: "A Cabana",
  title: "Um refúgio no alto da serra, feito para ficar.",
  poetic: "descanso, romance e momentos inesquecíveis",
  paragraphs: [
    "Madeira, vidro do chão ao teto e privacidade total: a Afrodite foi projetada para colocar o vale dentro da cabana. Da cama, da banheira e da mesa do café, a vista é sempre a serra.",
    "Ideal para casais. Acomoda até 4 pessoas com o sofá-cama da sala.",
  ],
  chips: [
    { label: "4 hóspedes", icon: Users },
    { label: "1 quarto com cama king", icon: DoorClosed },
    { label: "2 camas", icon: BedDouble },
    { label: "1 banheiro", icon: ShowerHead },
  ] satisfies readonly Chip[],
  photo: {
    image: sobreCabana,
    alt: "Banheira branca junto ao vidro da cabana, de frente para o vale dourado ao entardecer.",
  } satisfies Photo,
} as const;

/* -------------------------------------------------------------------------
   Destaques
   ------------------------------------------------------------------------- */

export const HIGHLIGHTS = {
  eyebrow: "Por que reservam a Afrodite",
  items: [
    {
      title: "Banheira de hidromassagem",
      description: "Um dos poucos lugares da região com essa comodidade, de frente para o vale.",
      icon: Bath,
    },
    {
      title: "Self check-in",
      description: "Chegue no seu tempo, com cofre de chaves.",
      icon: KeyRound,
    },
    {
      title: "Superhost",
      description: "Anfitriã experiente, com nota 4,94 em 136 avaliações.",
      icon: Award,
    },
  ] satisfies readonly Highlight[],
} as const;

/* -------------------------------------------------------------------------
   Mar de nuvens (seção poética)
   ------------------------------------------------------------------------- */

export const CLOUDS = {
  poetic: "Tem manhã em que o vale amanhece coberto de nuvens.",
  support: "E a banheira fica acima delas.",
  photo: {
    image: marDeNuvens,
    alt: "Banheira no deck da cabana acima de um mar de nuvens, com o sol nascendo ao fundo.",
  } satisfies Photo,
  mentions: [
    { value: "46", label: "elogios à hospitalidade" },
    { value: "44", label: "elogios à vista" },
    { value: "35", label: "elogios ao conforto" },
  ] satisfies readonly Stat[],
  mentionsNote: "Contagem oficial do Airbnb sobre o que os hóspedes destacam nas avaliações.",
} as const;

/* -------------------------------------------------------------------------
   Os ambientes
   ------------------------------------------------------------------------- */

export const SPACES = {
  id: "ambientes",
  eyebrow: "Os ambientes",
  title: "Cada canto pensado para vocês ficarem.",
  lead: "Sete ambientes que se conectam da lareira ao deck, sem pressa entre um e outro.",
  items: [
    {
      id: "quarto",
      title: "Quarto",
      description: "Cama king de frente para o vidro: a serra é a primeira coisa que vocês veem ao acordar.",
      image: quarto,
      alt: "Vista da cama king através do vidro da cabana, com a banheira e o verde do vale ao fundo.",
    },
    {
      id: "sala-de-estar",
      title: "Sala de estar",
      description: "Lareira a lenha, duas poltronas, mesa de madeira e carrinho bar para um bom vinho.",
      image: salaDeEstar,
      alt: "Poltronas de couro caramelo ao lado da lareira a lenha, com taça de vinho na mesinha.",
    },
    {
      id: "cozinha",
      title: "Cozinha americana",
      description: "Completa: geladeira, cooktop de indução, micro-ondas, air fryer, panelas e taças. Sem forno.",
      image: cozinha,
      alt: "Cozinha americana preta com panelas verdes no cooktop de indução e mesa posta ao fundo.",
    },
    {
      id: "sala-de-jantar",
      title: "Sala de jantar",
      description: "Mesa para 4 pessoas, posta para o jantar a dois.",
      image: salaDeJantar,
      alt: "Mesa de jantar de madeira posta com pratos e taças, sob a estrutura em A da cabana.",
    },
    {
      id: "estar-cinema",
      title: "Estar & cinema",
      description: "Sofá-cama, TV com Netflix, telão com projetor, Alexa, mantas e almofadas.",
      image: estarCinema,
      alt: "Sofá cinza com manta branca e almofadas, encaixado na parede de madeira da cabana.",
    },
    {
      id: "banheiro",
      title: "Banheiro",
      description: "Amplo e moderno, com água quente, espelho generoso e enxoval completo.",
      image: banheiro,
      alt: "Banheiro moderno com bancada branca, espelho orgânico iluminado e parede ripada.",
    },
    {
      id: "area-externa",
      title: "Área externa",
      description: "Banheira, ducha externa, telescópio, deck com vista e cadeiras para o pôr do sol.",
      image: areaExterna,
      alt: "Deck de madeira com banheira branca e telescópio apontado para o vale verde.",
    },
  ] satisfies readonly Space[],
} as const;

/* -------------------------------------------------------------------------
   Comodidades
   ------------------------------------------------------------------------- */

export const AMENITIES = {
  id: "comodidades",
  eyebrow: "Comodidades",
  title: "Tudo o que já está esperando por vocês.",
  groups: [
    {
      id: "lazer",
      title: "Lazer",
      items: [
        { label: "Banheira de hidromassagem", icon: Bath },
        { label: "Telão com projetor", icon: Projector },
        { label: "Telescópio", icon: Telescope },
        { label: "Churrasqueira", icon: Beef },
        { label: "Aparelho de fondue", icon: CookingPot },
        { label: "Lareira", icon: Flame },
        { label: "Tapete de ioga", icon: PersonStanding },
      ],
    },
    {
      id: "cozinha",
      title: "Cozinha",
      items: [
        { label: "Cooktop de indução", icon: ChefHat },
        { label: "Air fryer", icon: Wind },
        { label: "Micro-ondas", icon: Microwave },
        { label: "Geladeira", icon: Refrigerator },
        { label: "Louças e taças completas", icon: Wine },
      ],
    },
    {
      id: "conforto",
      title: "Conforto",
      items: [
        { label: "Wi-Fi", icon: Wifi },
        { label: "Netflix", icon: Monitor },
        { label: "Alexa", icon: Speaker },
        { label: "Água quente", icon: Droplets },
        { label: "Enxoval completo", icon: BedDouble },
        { label: "Mantas", icon: Moon },
      ],
    },
    {
      id: "praticidade",
      title: "Praticidade",
      items: [
        { label: "Self check-in com cofre de chaves", icon: KeyRound },
        { label: "Estacionamento", icon: Car },
        { label: "Câmeras de segurança na área externa", icon: Camera },
      ],
    },
  ] satisfies readonly AmenityGroup[],
  note: "Câmeras apenas no portão de entrada e nos fundos. Interior e frente da cabana são 100% privados.",
} as const;

/* -------------------------------------------------------------------------
   Galeria de momentos
   ------------------------------------------------------------------------- */

export const MOMENTS = {
  id: "momentos",
  eyebrow: "Momentos",
  title: "Para guardar na retina.",
  lead: "Fogueira, vinho, telescópio e um céu que os hóspedes juram estar mais perto.",
  photos: [
    { image: galeria01, alt: "Fogueira acesa no gramado ao pôr do sol, com taças de vinho ao lado." },
    { image: galeria04, alt: "Casal brindando na banheira do deck, com a serra ao fundo." },
    { image: galeria02, alt: "Duas taças de vinho tinto em frente à lareira acesa." },
    { image: galeria10, alt: "Céu dramático de nuvens sobre o deck da cabana." },
    { image: galeria03, alt: "Marshmallows assando na porta da lareira a lenha." },
    { image: galeria06, alt: "Casal sentado em cadeiras com mantas de pele, olhando a serra ao entardecer." },
    { image: galeria07, alt: "Cama decorada com pétalas e balões vermelhos escrevendo te amo." },
    { image: galeria05, alt: "Hóspede ajustando o telescópio no deck ao anoitecer." },
    { image: galeria09, alt: "Caminho de pedras iluminado por luzes baixas durante a noite." },
    { image: galeria08, alt: "Taça de vinho branco refletindo o pôr do sol da serra." },
    { image: galeria11, alt: "Casal abraçado no meio do capim dourado da serra." },
    { image: galeria12, alt: "Banheira branca no deck sob céu azul de dia claro." },
    { image: galeria13, alt: "Fachada triangular da cabana iluminada por dentro ao entardecer." },
  ] satisfies readonly Photo[],
  hint: "Arraste para o lado",
} as const;

/* -------------------------------------------------------------------------
   Reels: quem foi, filmou
   ------------------------------------------------------------------------- */

export const REELS = {
  id: "reels",
  eyebrow: "No Instagram",
  title: "Quem foi, filmou.",
  lead: "Três passagens pela cabana, gravadas por quem esteve aqui. Toque para assistir com som.",
  playLabel: (creditor: string): string => `Assistir ao vídeo de ${creditor}`,
  items: [
    {
      id: "reel-1",
      src: asset("/videos/reel-1.mp4"),
      poster: asset("/videos/reel-1.jpg"),
      credito: "@domini.film",
      legenda: "A serra emoldurada pelo vidro do A-Frame.",
    },
    {
      id: "reel-2",
      src: asset("/videos/reel-2.mp4"),
      poster: asset("/videos/reel-2.jpg"),
      credito: "@cabanaafrodite",
      legenda: "Um refúgio romântico no Rio de Janeiro.",
    },
    {
      id: "reel-3",
      src: asset("/videos/reel-3.mp4"),
      poster: asset("/videos/reel-3.jpg"),
      credito: "@thaynaventura",
      legenda: "Por dentro: lareira, mezanino e madeira.",
    },
  ] satisfies readonly Reel[],
  instagramTitle: "Siga a cabana no Instagram",
  instagramText:
    "Todo dia tem foto nova da serra, do mar de nuvens e dos cantinhos da Afrodite. É por lá também que saem as datas que abrem de última hora.",
  instagramCta: "Seguir",
  instagramHandle: CONTACT.instagramHandle,
  /** Mosaico do topo do cartão: um gostinho do feed. */
  instagramPreview: [
    { image: galeria04, alt: "" },
    { image: galeria01, alt: "" },
    { image: galeria11, alt: "" },
  ] satisfies readonly Photo[],
} as const;

/* -------------------------------------------------------------------------
   Avaliações (reais, raspadas do anúncio em 03/08/2026)
   ------------------------------------------------------------------------- */

export const REVIEWS = {
  id: "avaliacoes",
  eyebrow: "Avaliações",
  title: "Quem foi, quer voltar.",
  summaryTitle: "Preferido dos hóspedes",
  summaryText:
    "A Afrodite está entre as acomodações mais amadas do Airbnb, segundo avaliações, comentários e confiabilidade.",
  ratings: [
    { label: "Limpeza", value: 5.0 },
    { label: "Exatidão do anúncio", value: 5.0 },
    { label: "Comunicação", value: 5.0 },
    { label: "Check-in", value: 4.9 },
    { label: "Custo-benefício", value: 4.9 },
    { label: "Localização", value: 4.8 },
  ] satisfies readonly RatingRow[],
  viaLabel: "via Airbnb",
  items: [
    {
      id: "luciano",
      author: "Luciano Lima",
      date: "agosto de 2026",
      avatar: asset("/avaliacoes/luciano.webp"),
      quote:
        "Ambiente perfeito, eu e minha noiva adoramos a cabana, muito limpa e organizada, ambiente aconchegante e lindo demais, as fotos ficam incríveis! O anfitrião muito solícito e atencioso, nos passou muitas dicas e tirou qualquer dúvida o que fez a estadia ser bem tranquila! Com certeza voltarei!",
    },
    {
      id: "veronica",
      author: "Veronica",
      date: "julho de 2026",
      avatar: asset("/avaliacoes/veronica.webp"),
      quote:
        "Nossa experiência foi excelente! A cabana é muito aconchegante, bem cuidada e oferece uma vista linda, perfeita para relaxar. A localização também é ótima, proporcionando tranquilidade e contato com a natureza. Eu e meu esposo passamos dias muito especiais e saímos com vontade de voltar.",
    },
    {
      id: "isabely",
      author: "Isabely",
      date: "julho de 2026",
      avatar: asset("/avaliacoes/isabely.webp"),
      quote:
        "Sem palavras para esta cabana, é ainda mais lindo pessoalmente, parece que estamos dentro de um filme! Lugar limpo, lindo, aconchegante, tudo projetado pensando nos mínimos detalhes, desde os utensílios. Recomendo e em breve, estarei de volta!",
    },
    {
      id: "tatiana",
      author: "Tatiana",
      date: "julho de 2026",
      avatar: asset("/avaliacoes/tatiana.webp"),
      quote:
        "Um sonho em forma de cabana. Da vista de tirar o fôlego, ao extremo bom gosto na decoração. Uma pena que tivemos pouco tempo na cabana, mas com certeza voltaremos para aproveitar tudo que ela oferece.",
    },
    {
      id: "felipe",
      author: "Felipe Maximino",
      date: "junho de 2026",
      avatar: asset("/avaliacoes/felipe.webp"),
      quote:
        "Fomos no nosso aniversário de casamento e gostamos muito da estadia. O local é um espetáculo e a cabana é muito diferenciada, todos os equipamentos funcionaram muito bem e nos sentimos em casa. Com certeza voltaremos.",
    },
    {
      id: "camila",
      author: "Camila",
      date: "junho de 2026",
      avatar: asset("/avaliacoes/camila.webp"),
      quote:
        "Cabana incrível! Eu e meu noivo estamos completamente apaixonados pelo local. Ficamos apenas um dia, mas foi perfeito. Local exatamente como as fotos! Com certeza voltaremos!! Agradecemos à anfitriã.",
    },
    {
      id: "gabriela",
      author: "Gabriela",
      date: "junho de 2026",
      avatar: asset("/avaliacoes/gabriela.webp"),
      quote:
        "Eu e meu marido passamos dois dias incríveis, com direito a pôr do sol os dois dias e um climinha frio a noite onde acendemos a fogueira do lado de fora e a lareira no interior. Recomendo de olhos fechados para quem procura um local tranquilo, com vista bonita do nascer ao pôr do sol e a noite um céu incrível que parece estar bem pertinho do céu.",
    },
    {
      id: "john",
      author: "John",
      date: "junho de 2026",
      avatar: asset("/avaliacoes/john.webp"),
      quote:
        "Excelente acomodação, anfitrião super atencioso. A cabana é linda, super completa e possui uma vista incrível.",
    },
    {
      id: "milton",
      author: "Milton",
      date: "maio de 2026",
      avatar: asset("/avaliacoes/milton.webp"),
      quote:
        "Super recomendo, muito aconchegante e equipado o chalé, sem falar da vista que é fantástica. Estão de parabéns",
    },
    {
      id: "mayara",
      author: "Mayara",
      date: "abril de 2026",
      avatar: asset("/avaliacoes/mayara.webp"),
      quote:
        "A cabana Afrodite é encantadora! O ambiente externo e interno fazem valer cada segundo do passeio. As fotos são fiéis à realidade e eu super indico a quem quiser viver momentos de paz e beleza, com a certeza de contar com a rapidez e gentileza dos anfitriões.",
    },
    {
      id: "cassio",
      author: "Cassio",
      date: "abril de 2026",
      avatar: asset("/avaliacoes/cassio.webp"),
      quote:
        "Tudo estava conforme descrito no anúncio. Roupa de cama, roupões e toalhas extremamente macios e cheirosos. Na cozinha, utilizamos muitos utensílios e todos em perfeito estado. O local é de uma paz incrível. Eu e minha esposa conseguimos nos desligar, descansar e aproveitar.",
    },
    {
      id: "fernanda",
      author: "Fernanda",
      date: "fevereiro de 2026",
      avatar: asset("/avaliacoes/fernanda.webp"),
      quote:
        "A cabana é incrível e ainda mais linda do que nas fotos! Foi uma experiência muito legal, com certeza voltaremos. O anfitrião respondeu sempre rapidamente e o senhor Valmir, que nos ajudou com a lenha, foi extremamente atencioso e prestativo.",
    },
  ] satisfies readonly Review[],
  cta: `Ler as ${CONTACT.reviewCount} avaliações no Airbnb`,
} as const;

/* -------------------------------------------------------------------------
   Localização
   ------------------------------------------------------------------------- */

export const LOCATION = {
  id: "localizacao",
  eyebrow: "Localização",
  title: "No alto da serra, entre Petrópolis e Paty do Alferes.",
  lead: "Entrada pela BR-040 em direção a Araras e Vale das Videiras. O endereço completo é enviado depois da reserva confirmada.",
  mapCaption: "Vale das Videiras, entre Petrópolis e Araras, Serra do Rio.",
  mapLoad: "Ver o mapa interativo",
  mapAction: "Abrir no Google Maps",
  nearbyTitle: "Nos arredores",
  nearby: [
    { label: "Mercadinhos na entrada do condomínio", icon: ShoppingBasket },
    { label: "Restaurantes a 10 min, no centrinho de Vale das Videiras", icon: UtensilsCrossed },
    { label: "Araras, com mais opções gastronômicas, um pouco mais distante", icon: MapPin },
    { label: "Serviço de entrega de comida por telefone, lista fornecida na chegada", icon: Phone },
  ] satisfies readonly NearbyItem[],
  notice: "Não oferecemos serviços durante a estadia. A cabana é toda de vocês.",
  photo: {
    image: mapaRegiao,
    alt: "Mapa ilustrado da região do Vale das Videiras, na Serra do Rio de Janeiro.",
  } satisfies Photo,
  /** Foto de fundo da seção, bem esmaecida atrás do conteúdo. */
  backdrop: {
    image: hero,
    alt: "",
  } satisfies Photo,
} as const;

/* -------------------------------------------------------------------------
   Boas-vindas e regras
   ------------------------------------------------------------------------- */

export const RULES = {
  id: "boas-vindas",
  eyebrow: "Boas-vindas",
  title: "O combinado antes da chegada.",
  items: [
    {
      id: "acesso",
      question: "Acesso do hóspede",
      answer:
        "Toda a área descrita está disponível. Para usar o platô inferior de estacionamento, avise antes da chegada.",
    },
    {
      id: "cancelamento",
      question: "Cancelamento",
      answer: "Política não reembolsável.",
    },
    {
      id: "alteracao",
      question: "Alteração de data",
      answer: "Uma única troca, até 15 dias antes da estadia.",
    },
    {
      id: "check-in",
      question: "Check-in",
      answer: "Self check-in com cofre de chaves.",
    },
  ] satisfies readonly Rule[],
} as const;

/* -------------------------------------------------------------------------
   Disponibilidade (sincronizada com o calendário do Airbnb)
   ------------------------------------------------------------------------- */

export const AVAILABILITY = {
  id: "datas",
  eyebrow: "Disponibilidade",
  title: "As datas que ainda estão livres.",
  /** Na home: mapa de datas, com o botão levando ao checkout ou ao Airbnb. */
  lead:
    RESERVAS_ATIVAS || RESERVAS_DEMO
      ? "Calendário sincronizado com o Airbnb. Veja o que está livre e reserve direto com a anfitriã, sem intermediário."
      : "Calendário espelhado do Airbnb. A reserva, o preço e o pagamento continuam sendo feitos por lá, com toda a proteção da plataforma.",
  /** Na página /reserva, onde a compra acontece de fato. */
  leadCheckout:
    "Escolha a chegada e a saída no calendário. A data fica bloqueada no seu nome assim que o pagamento for aprovado.",
  legendaLivre: "Livre",
  legendaOcupada: "Ocupada",
  mesAnterior: "Ver mês anterior",
  mesSeguinte: "Ver próximo mês",
  atualizadoPrefixo: "Sincronizado com o Airbnb em",
  cta: RESERVAS_ATIVAS || RESERVAS_DEMO ? "Escolher datas e reservar" : "Ver preços e reservar",
  diasDaSemana: ["D", "S", "T", "Q", "Q", "S", "S"],
  meses: [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ],
} as const;

/* -------------------------------------------------------------------------
   Reserva pelo site (só aparece com NEXT_PUBLIC_RESERVAS_ATIVAS=1)
   ------------------------------------------------------------------------- */

export const RESERVA = {
  escolhaEntrada: "Escolha a data de entrada no calendário",
  escolhaSaida: "Agora escolha a data de saída",
  periodoEscolhido: (entrada: string, saida: string): string => `Chegada ${entrada} · Saída ${saida}`,
  limpar: "Limpar datas",
  chegada: "Chegada",
  saida: "Saída",
  selecione: "Selecionar",
  porNoite: "por noite",
  menosHospedes: "Um hóspede a menos",
  maisHospedes: "Um hóspede a mais",
  semDatas: "Escolha a chegada e a saída no calendário ao lado para ver o valor da estadia.",
  indisponivel:
    "A reserva direta pelo site ainda não está ligada nesta versão. Por enquanto, as datas e o pagamento ficam no Airbnb.",
  irParaAirbnb: "Reservar no Airbnb",
  /** Modo demonstração da prévia pública. */
  demoValores: "Valores de demonstração, ajustados antes de publicar.",
  demoTitulo: "Prévia do site",
  demoTexto:
    "Nesta prévia o pagamento fica desligado. Na versão final, este botão leva direto ao checkout do Mercado Pago e a data é bloqueada na hora. Enquanto isso, a reserva continua pelo Airbnb ou pelo WhatsApp.",
  demoFechar: "Entendi, voltar",
  resumoNoites: (n: number): string => `${n} ${n === 1 ? "noite" : "noites"}`,
  linhaDiarias: "Diárias",
  linhaLimpeza: "Taxa de limpeza",
  linhaTotal: "Total",
  linhaAgora: "Você paga agora",
  campos: {
    nome: "Nome completo",
    email: "E-mail",
    telefone: "WhatsApp",
    hospedes: "Hóspedes",
  },
  enviar: "Ir para o pagamento",
  enviando: "Preparando o pagamento…",
  seguranca: "Pagamento processado pelo Mercado Pago. A cabana fica reservada no seu nome assim que o pagamento é aprovado.",
  erros: {
    datas_ocupadas: "Alguém reservou essas datas agora há pouco. Escolha outras, por favor.",
    minimo_noites: "A estadia mínima é maior que o período escolhido.",
    contato_invalido: "Confira o nome, o e-mail e o WhatsApp.",
    hospedes_invalido: "A cabana acomoda de 1 a 4 hóspedes.",
    generico: "Não consegui abrir o pagamento agora. Tente de novo ou chame no WhatsApp.",
  },
  ocupadaAviso: "Há noites ocupadas nesse intervalo.",
} as const;

/** Página /reserva, aberta em aba própria pelos botões de reserva. */
export const PAGINA_RESERVA = {
  /** O layout já acrescenta "· Cabana Afrodite" pelo template. */
  titulo: "Reservar",
  descricao:
    "Escolha as datas e reserve a Cabana Afrodite direto com a anfitriã, sem intermediário.",
  headline: "Escolha as datas de vocês.",
  apoio: "Reserva direta com a anfitriã. A data fica bloqueada no seu nome assim que o pagamento for aprovado.",
  voltar: "Voltar ao site",
  duvidas: "Dúvidas no WhatsApp",
  selos: {
    nota: `${CONTACT.ratingDisplay} em ${CONTACT.reviewCount} avaliações no Airbnb`,
    pagamento: "Pagamento processado pelo Mercado Pago",
    checkin: "Self check-in com cofre de chaves",
  },
} as const;

/** Checkout de demonstração, ativo só enquanto não há Access Token. */
export const SIMULACAO = {
  selo: "Modo demonstração",
  titulo: "Conferir o fluxo de pagamento",
  explicacao:
    "Nenhuma cobrança é feita e nenhum dado de pagamento é pedido aqui. Esta tela existe para percorrer a reserva de ponta a ponta antes de ligar o Mercado Pago. Escolha um desfecho para seguir.",
  hospede: "Hóspede",
  estadia: "Estadia",
  aPagar: "Valor da reserva",
  aprovar: "Simular pagamento aprovado",
  recusar: "Simular pagamento recusado",
  rodape:
    "Assim que o Access Token do Mercado Pago for configurado, esta tela deixa de existir e o hóspede vai direto para o checkout real.",
} as const;

export const RESERVA_RETORNO = {
  sucesso: {
    titulo: "Reserva recebida!",
    texto:
      "Assim que o Mercado Pago confirmar o pagamento, a data fica bloqueada no seu nome e você recebe a confirmação. Qualquer dúvida, é só chamar no WhatsApp.",
  },
  erro: {
    titulo: "O pagamento não foi concluído.",
    texto:
      "Nada foi cobrado e as datas continuam livres. Você pode tentar de novo ou falar com a gente pelo WhatsApp.",
  },
  falarWhatsapp: "Falar no WhatsApp",
  voltar: "Voltar ao site",
  tentarDeNovo: "Escolher datas de novo",
} as const;

/* -------------------------------------------------------------------------
   CTA final
   ------------------------------------------------------------------------- */

export const FINAL_CTA = {
  title: "A serra está esperando vocês.",
  support: `Dúvidas? Chame no WhatsApp ${CONTACT.phoneDisplay}`,
  photo: {
    image: ctaNoite,
    alt: "A cabana iluminada à noite, brilhando quente no meio da serra escura.",
  } satisfies Photo,
} as const;

/* -------------------------------------------------------------------------
   CTA fixo
   ------------------------------------------------------------------------- */

export const STICKY = {
  seal: `★ ${CONTACT.ratingDisplay} · Superhost`,
  label: RESERVAR.curto,
} as const;

/* -------------------------------------------------------------------------
   Rodapé
   ------------------------------------------------------------------------- */

export const FOOTER = {
  tagline: "Cabana A-Frame para casais no alto da serra, entre Petrópolis e Paty do Alferes.",
  navTitle: "Navegar",
  social: [
    {
      id: "airbnb",
      label: "Reservar no Airbnb",
      href: CONTACT.airbnb,
      icon: CalendarCheck,
    },
    {
      id: "whatsapp",
      label: `WhatsApp ${CONTACT.phoneDisplay}`,
      href: CONTACT.whatsapp,
      icon: IconeWhatsApp,
    },
    {
      id: "instagram",
      label: `Instagram ${CONTACT.instagramHandle}`,
      href: CONTACT.instagram,
      icon: Instagram,
    },
    {
      id: "mapa",
      label: "Ver a região no Google Maps",
      href: GEO.mapLink,
      icon: MapPin,
    },
  ] satisfies readonly SocialLink[],
  regionLabel: CONTACT.region,
  rights: "Todos os direitos reservados.",
} as const;
