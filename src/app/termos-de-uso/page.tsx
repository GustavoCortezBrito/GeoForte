import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal/LegalPage";
import { companyInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description:
    "Termos de uso do site da Geoforte Fundações: condições de navegação, conteúdo do blog, propriedade intelectual e solicitação de diagnóstico técnico.",
  alternates: { canonical: "/termos-de-uso" },
};

export default function TermosDeUsoPage() {
  return (
    <LegalPage
      eyebrow="Documento legal"
      title="Termos de Uso"
      updatedAt="19 de outubro de 2026"
      intro="Estes Termos de Uso regem o acesso e a navegação no site da Geoforte Fundações e Engenharia Ltda. Ao utilizar este site, você concorda com as condições descritas abaixo."
    >
      <section>
        <h2>1. Aceitação dos termos</h2>
        <p>
          O acesso e a navegação neste site implicam a aceitação integral destes
          Termos de Uso. Caso não concorde com qualquer disposição aqui prevista,
          recomendamos que interrompa o uso do site e entre em contato diretamente
          pelos canais indicados na seção 14.
        </p>
      </section>

      <section>
        <h2>2. Quem somos</h2>
        <p>
          Este site é mantido pela <strong>{companyInfo.fullName}</strong>, empresa
          especializada em fundações profundas, com sede em{" "}
          {companyInfo.address.city} – {companyInfo.address.state}, atuando em todo
          o território nacional há mais de 30 anos.
        </p>
      </section>

      <section>
        <h2>3. Uso do site</h2>
        <p>
          O conteúdo publicado tem caráter institucional e informativo: apresenta
          serviços, projetos de referência, trajetória da empresa, artigos do blog
          e canais de contato. Você concorda em utilizar o site apenas para
          finalidades lícitas e em não:
        </p>
        <ul>
          <li>Tentar obter acesso não autorizado a sistemas ou dados da Geoforte;</li>
          <li>Reproduzir, copiar ou redistribuir o conteúdo do site sem autorização prévia;</li>
          <li>Utilizar o site para envio de spam, phishing ou qualquer prática fraudulenta;</li>
          <li>Interferir no funcionamento normal do site por meio de scripts, bots, coleta automatizada em massa ou ataques automatizados.</li>
        </ul>
      </section>

      <section>
        <h2>4. Blog e conteúdo técnico</h2>
        <p>
          Os artigos do blog têm finalidade <strong>educativa e informativa</strong>.
          Eles explicam conceitos e práticas de fundações em linguagem geral e
          citam normas técnicas da ABNT apenas como referência.
        </p>
        <p>
          Esse conteúdo <strong>não constitui projeto, laudo, parecer técnico,
          orçamento nem recomendação para um caso concreto</strong>, e não
          substitui a análise de um engenheiro habilitado, que considera a
          sondagem, as cargas, o entorno e as demais condições específicas de cada
          obra. Decisões de projeto e de execução devem ser tomadas com base em
          estudo técnico próprio e na versão vigente das normas aplicáveis.
        </p>
        <p>
          Você pode compartilhar links para os artigos e citar trechos curtos,
          desde que indique a fonte e o endereço do artigo original.
        </p>
      </section>

      <section>
        <h2>5. Propriedade intelectual</h2>
        <p>
          A marca Geoforte, seu símbolo, logotipo, paleta de cores, tipografia e
          demais elementos da identidade visual — descritos em detalhe na{" "}
          <Link href="/marca">página de identidade visual</Link> — são de
          titularidade da Geoforte Fundações e Engenharia Ltda. Textos, artigos,
          fotografias e demais conteúdos deste site não podem ser reproduzidos,
          distribuídos ou utilizados comercialmente sem autorização expressa e
          por escrito.
        </p>
      </section>

      <section>
        <h2>6. Imagens e vídeos ilustrativos</h2>
        <p>
          Algumas imagens e vídeos deste site são <strong>ilustrativos</strong> e
          foram geradas ou editadas com recursos de inteligência artificial. Elas
          servem para ambientar o conteúdo e <strong>não representam obras,
          equipamentos, equipes ou clientes específicos</strong> da Geoforte.
          Fotografias de projetos reais, quando identificadas como tal, são
          indicadas como projetos de referência.
        </p>
      </section>

      <section>
        <h2>7. Diagnóstico técnico e canais de atendimento</h2>
        <p>
          O formulário de contato e o atendimento via WhatsApp servem para
          iniciar uma conversa técnica sobre o seu projeto. O envio de dados
          através desses canais <strong>não constitui</strong> proposta comercial,
          orçamento vinculante ou contrato de prestação de serviços — esses
          instrumentos são formalizados separadamente, após a análise técnica da
          equipe de engenharia.
        </p>
        <p>
          Ao usar o formulário, você declara que as informações fornecidas são
          verdadeiras e que tem o direito de compartilhá-las. Para proteger o
          site, podemos limitar ou bloquear envios repetidos ou automatizados. O
          tratamento dos dados enviados está descrito na{" "}
          <Link href="/politica-de-privacidade">Política de Privacidade</Link>.
        </p>
      </section>

      <section>
        <h2>8. Links e serviços de terceiros</h2>
        <p>
          Este site contém links para serviços de terceiros, como WhatsApp,
          LinkedIn, Instagram e Facebook. A Geoforte não se responsabiliza pelo
          conteúdo, pelas políticas de privacidade ou pela disponibilidade desses
          serviços externos, que são regidos por seus próprios termos.
        </p>
      </section>

      <section>
        <h2>9. Disponibilidade e isenção de responsabilidade</h2>
        <p>
          Empregamos esforços razoáveis para manter o site disponível e as
          informações atualizadas e precisas, mas não garantimos a ausência de
          erros, interrupções ou imprecisões pontuais, nem o funcionamento
          ininterrupto. As informações técnicas apresentadas têm caráter geral e
          não substituem a análise de engenharia específica para cada projeto.
        </p>
      </section>

      <section>
        <h2>10. Contratos de prestação de serviço</h2>
        <p>
          A execução de serviços de fundação, projetos e demais soluções técnicas
          oferecidas pela Geoforte é regida por contratos específicos, negociados
          diretamente com cada cliente, que prevalecem sobre estes Termos de Uso
          em caso de conflito quanto ao objeto contratado.
        </p>
      </section>

      <section>
        <h2>11. Privacidade</h2>
        <p>
          O tratamento de dados pessoais feito por meio deste site segue a nossa{" "}
          <Link href="/politica-de-privacidade">Política de Privacidade</Link>,
          que integra estes Termos.
        </p>
      </section>

      <section>
        <h2>12. Alterações destes termos</h2>
        <p>
          Estes Termos de Uso podem ser atualizados periodicamente para refletir
          mudanças legais, operacionais ou no próprio site. A data no topo desta
          página indica a versão vigente, e o uso continuado do site após a
          atualização indica que você a aceita.
        </p>
      </section>

      <section>
        <h2>13. Legislação aplicável e foro</h2>
        <p>
          Estes Termos são regidos pelas leis da República Federativa do Brasil.
          Fica eleito o foro da comarca de {companyInfo.address.city},{" "}
          {companyInfo.address.state}, para dirimir eventuais controvérsias, com
          renúncia a qualquer outro, por mais privilegiado que seja, ressalvados
          os direitos do consumidor e as hipóteses de foro obrigatório previstas
          em lei.
        </p>
      </section>

      <section>
        <h2>14. Contato</h2>
        <p>
          Dúvidas sobre estes Termos de Uso podem ser encaminhadas para{" "}
          <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a> ou pelo
          telefone {companyInfo.phone}.
        </p>
      </section>
    </LegalPage>
  );
}
