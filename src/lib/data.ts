import {
  Drill,
  Hammer,
  CircleDot,
  Component,
  Boxes,
  Mountain,
  Warehouse,
  Compass,
  type LucideIcon,
} from "lucide-react";

// ─── Services Data ───
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const services: Service[] = [
  {
    id: "helice-continua",
    title: "Estacas Hélice Contínua Monitorada",
    description:
      "Técnica de alta produtividade com monitoramento eletrônico em tempo real, ideal para obras urbanas com controle de vibração e ruído.",
    icon: Drill,
  },
  {
    id: "escavadas",
    title: "Estacas Escavadas",
    description:
      "Execução de estacas de grande diâmetro para projetos que exigem alta capacidade de carga em solos com camadas resistentes.",
    icon: CircleDot,
  },
  {
    id: "franki",
    title: "Estacas Franki",
    description:
      "Estacas cravadas com base alargada, proporcionando elevada capacidade de carga para estruturas de grande porte.",
    icon: Hammer,
  },
  {
    id: "metalicas",
    title: "Estacas Metálicas",
    description:
      "Perfis de aço cravados para fundações profundas em locais com difícil acesso ou solos com obstruções.",
    icon: Component,
  },
  {
    id: "pre-moldadas",
    title: "Estacas Pré-Moldadas",
    description:
      "Estacas de concreto pré-moldado com alta resistência, fabricadas em usina com rigoroso controle de qualidade.",
    icon: Boxes,
  },
  {
    id: "melhoramento-solo",
    title: "Melhoramentos do Solo",
    description:
      "Técnicas especializadas para aumentar a capacidade de suporte do solo e reduzir recalques em terrenos desafiadores.",
    icon: Mountain,
  },
  {
    id: "pre-fabricadas",
    title: "Estruturas Pré-Fabricadas",
    description:
      "Soluções em estruturas pré-fabricadas de concreto para galpões, edifícios e obras industriais com agilidade e qualidade.",
    icon: Warehouse,
  },
  {
    id: "projetos",
    title: "Projetos de Fundação e Estruturas",
    description:
      "Elaboração de projetos técnicos de engenharia de fundação e estruturas com análise completa do subsolo.",
    icon: Compass,
  },
];

// ─── Stats Data ───
export interface Stat {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
}

export const stats: Stat[] = [
  { value: 1995, suffix: "", label: "Ano de Fundação" },
  { value: 1500, suffix: "", prefix: "+", label: "Obras Executadas" },
  { value: 3.3, suffix: "M", prefix: "+", label: "Metros de Estacas" },
  { value: 250, suffix: "", prefix: "+", label: "Clientes Recorrentes" },
  { value: 26, suffix: "", label: "Equipamentos" },
];

// ─── Integrated Solution Data ───
export interface SolutionStep {
  number: string;
  title: string;
  description: string;
  details: string;
}

export const solutionSteps: SolutionStep[] = [
  {
    number: "01",
    title: "Análise Integrada do Projeto",
    description:
      "A fundação é o primeiro passo de todo grande projeto. A escolha certa da técnica e a respectiva abordagem de execução pode oportunizar ganhos de produtividade e economia.",
    details:
      "A Geoforte oferece seus 30 anos de experiência, em mais de 1500 projetos, a serviço do cliente, realizando uma análise integrada e propondo as melhores soluções e abordagens.",
  },
  {
    number: "02",
    title: "Logística Completa na Execução",
    description:
      "Paradas por falta ou não-conformidade de insumos e equipamentos geram atrasos de cronograma e baixa produtividade.",
    details:
      "A solução integrada da Geoforte compreende toda a etapa de execução da fundação, incluindo logística e fornecimento de insumos (concreto, aço etc), pessoal técnico e equipamentos.",
  },
  {
    number: "03",
    title: "Controle de Qualidade",
    description:
      "A atenção às melhores práticas operacionais e o respeito às normas de segurança são a garantia de um projeto econômico e dentro do cronograma.",
    details:
      "A Geoforte oferece qualidade e credibilidade com um corpo de engenharia qualificado, investimento contínuo em equipamentos e reportes de produtividade diários.",
  },
];

// ─── Projects Data ───
export interface Project {
  title: string;
  location: string;
  type: string;
  image: string;
}

export const projects: Project[] = [
  {
    title: "Shopping Conquista",
    location: "Vitória da Conquista, BA",
    type: "Comercial",
    image: "/images/project-shopping.jpg",
  },
  {
    title: "Centro de Distribuição Correios",
    location: "Simões Filho, BA",
    type: "Industrial / Logístico",
    image: "/images/project-industrial.jpg",
  },
  {
    title: "Parque Shopping",
    location: "Salvador, BA",
    type: "Comercial",
    image: "/images/project-residential.jpg",
  },
];

// ─── Navigation ───
// Links com "/" na frente: funcionam tanto na home (o navegador só rola até
// a âncora, sem recarregar) quanto nas demais páginas (navega para a home e
// já chega na seção certa).
export const navLinks = [
  { href: "/#inicio", label: "Início" },
  { href: "/#servicos", label: "Serviços" },
  { href: "/#solucao", label: "Solução Integrada" },
  { href: "/#projetos", label: "Projetos" },
  { href: "/#empresa", label: "Empresa" },
  { href: "/#historia", label: "Trajetória" },
  { href: "/#contato", label: "Contato" },
];

// ─── Company Info ───
export const companyInfo = {
  name: "Geoforte Fundações",
  fullName: "Geoforte Fundações e Engenharia Ltda",
  slogan: "Qualidade do projeto à execução!",
  phone: "(71) 3341-2918",
  whatsapp: "5571970082005",
  email: "contato@geoforte.com.br",
  address: {
    street: "Av. Luís Viana Filho, 13223",
    complement: "Hangar Business Park, Sala 419",
    neighborhood: "São Cristóvão",
    city: "Salvador",
    state: "BA",
    cep: "41500-300",
  },
  social: {
    linkedin: "https://www.linkedin.com/company/geoforte-fundacoes/home/",
    instagram: "https://www.instagram.com/geoforte.fundacoes/",
    facebook: "https://www.facebook.com/geofortefundacoes/?locale=pt_BR",
  },
  mission:
    "Por meio da melhoria contínua de pessoas, processos e tecnologias, fornecer uma solução completa em fundações, do projeto à execução, colaborando para a eficiência e produtividade de nossos clientes.",
  principles: [
    "A produtividade e satisfação do cliente em primeiro lugar.",
    "Pessoas são a base da excelência.",
    "Investimento contínuo em equipamentos e tecnologia.",
    "Busca pela qualidade total e conformidade dos processos.",
    "Respeito ao meio ambiente e às melhores práticas em segurança.",
  ],
};

// ─── Google Maps ───
export function googleMapsUrl() {
  const a = companyInfo.address;
  const query = `${a.street}, ${a.complement}, ${a.neighborhood}, ${a.city} - ${a.state}, ${a.cep}`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
