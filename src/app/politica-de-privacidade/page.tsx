import type { Metadata } from "next";
import LegalPage from "@/components/legal/LegalPage";
import { companyInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a Geoforte Fundações coleta, usa e protege os dados pessoais enviados pelo site, em conformidade com a LGPD.",
};

export default function PoliticaDePrivacidadePage() {
  return (
    <LegalPage
      eyebrow="Documento legal"
      title="Política de Privacidade"
      updatedAt="18 de setembro de 2026"
      intro="Esta Política explica quais dados pessoais a Geoforte Fundações e Engenharia Ltda coleta através deste site, para que finalidade, e quais direitos você tem sobre eles, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD)."
    >
      <section>
        <h2>1. Quem é o controlador dos dados</h2>
        <p>
          A <strong>{companyInfo.fullName}</strong>, com sede em{" "}
          {companyInfo.address.street}, {companyInfo.address.complement},{" "}
          {companyInfo.address.neighborhood}, {companyInfo.address.city} –{" "}
          {companyInfo.address.state}, é a controladora dos dados pessoais
          tratados através deste site.
        </p>
      </section>

      <section>
        <h2>2. Quais dados coletamos</h2>
        <p>Coletamos dados pessoais nas seguintes situações:</p>
        <ul>
          <li>
            <strong>Formulário de diagnóstico técnico:</strong> nome, empresa,
            e-mail, telefone/WhatsApp, tipo de empreendimento e detalhes do
            projeto que você opte por informar.
          </li>
          <li>
            <strong>Atendimento via WhatsApp:</strong> número de telefone e o
            conteúdo das mensagens trocadas com nossa equipe.
          </li>
          <li>
            <strong>Navegação:</strong> dados técnicos coletados automaticamente,
            como endereço IP, tipo de navegador e dispositivo, e páginas
            visitadas, para fins de segurança e melhoria do site.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Para que usamos seus dados</h2>
        <p>Os dados coletados são usados para:</p>
        <ul>
          <li>Responder à sua solicitação de diagnóstico técnico e dar retorno sobre o seu projeto;</li>
          <li>Manter contato comercial e técnico durante a avaliação da sua obra;</li>
          <li>Cumprir obrigações legais e regulatórias aplicáveis;</li>
          <li>Melhorar a segurança, a estabilidade e a experiência de navegação no site.</li>
        </ul>
      </section>

      <section>
        <h2>4. Base legal</h2>
        <p>
          O tratamento dos seus dados pessoais se fundamenta, conforme o art. 7º
          da LGPD, no <strong>consentimento</strong> dado ao preencher e enviar o
          formulário de contato, na execução de <strong>procedimentos
          preliminares</strong> a um eventual contrato de prestação de serviços, e
          no <strong>legítimo interesse</strong> da Geoforte em responder a
          solicitações comerciais recebidas por seus canais oficiais.
        </p>
      </section>

      <section>
        <h2>5. Com quem compartilhamos seus dados</h2>
        <p>
          Não vendemos nem alugamos seus dados pessoais a terceiros. Podemos
          compartilhar informações estritamente necessárias com:
        </p>
        <ul>
          <li>
            Provedores de infraestrutura, hospedagem e e-mail que operam o site e
            recebem as solicitações do formulário;
          </li>
          <li>
            A plataforma WhatsApp/Meta, quando você opta por nos contatar por
            esse canal — sujeita à política de privacidade própria da Meta;
          </li>
          <li>
            Autoridades públicas, quando exigido por lei, ordem judicial ou
            requisição regulatória.
          </li>
        </ul>
      </section>

      <section>
        <h2>6. Por quanto tempo guardamos seus dados</h2>
        <p>
          Mantemos os dados do formulário de contato pelo tempo necessário para
          concluir o atendimento e, quando há relação comercial subsequente, pelo
          prazo exigido pela legislação civil e fiscal aplicável. Findo esse
          prazo, os dados são eliminados ou anonimizados.
        </p>
      </section>

      <section>
        <h2>7. Cookies e tecnologias semelhantes</h2>
        <p>
          Este site pode utilizar cookies estritamente necessários ao seu
          funcionamento. Caso venhamos a adotar cookies de análise de audiência
          ou publicidade no futuro, esta Política será atualizada para detalhar
          essas tecnologias e as opções de gerenciamento disponíveis a você.
        </p>
      </section>

      <section>
        <h2>8. Seus direitos como titular dos dados</h2>
        <p>Nos termos do art. 18 da LGPD, você tem direito a:</p>
        <ul>
          <li>Confirmar a existência de tratamento dos seus dados;</li>
          <li>Acessar os dados que temos sobre você;</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
          <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários;</li>
          <li>Solicitar a portabilidade dos seus dados a outro fornecedor;</li>
          <li>Revogar o consentimento dado, a qualquer momento;</li>
          <li>Obter informações sobre com quem compartilhamos seus dados.</li>
        </ul>
        <p>Para exercer qualquer desses direitos, utilize os contatos da seção 10.</p>
      </section>

      <section>
        <h2>9. Segurança da informação</h2>
        <p>
          Adotamos medidas técnicas e administrativas razoáveis para proteger
          seus dados pessoais contra acessos não autorizados, perda, alteração
          ou divulgação indevida. Ainda assim, nenhum sistema é inteiramente
          imune a incidentes — caso um deles ocorra e afete seus dados, você será
          comunicado conforme exigido pela LGPD.
        </p>
      </section>

      <section>
        <h2>10. Como falar com a gente sobre privacidade</h2>
        <p>
          Solicitações relacionadas aos seus dados pessoais podem ser enviadas
          para <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a> ou
          pelo telefone {companyInfo.phone}. Responderemos dentro de um prazo
          razoável, conforme previsto na legislação aplicável.
        </p>
      </section>

      <section>
        <h2>11. Alterações desta política</h2>
        <p>
          Esta Política de Privacidade pode ser atualizada periodicamente. A data
          no topo desta página indica a versão vigente; recomendamos revisitá-la
          de tempos em tempos.
        </p>
      </section>
    </LegalPage>
  );
}
