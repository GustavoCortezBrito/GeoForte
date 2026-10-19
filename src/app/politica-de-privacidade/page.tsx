import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "@/components/legal/LegalPage";
import { companyInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description:
    "Como a Geoforte Fundações coleta, usa e protege os dados pessoais enviados pelo site, em conformidade com a LGPD.",
  alternates: { canonical: "/politica-de-privacidade" },
};

export default function PoliticaDePrivacidadePage() {
  return (
    <LegalPage
      eyebrow="Documento legal"
      title="Política de Privacidade"
      updatedAt="19 de outubro de 2026"
      intro="Esta Política explica quais dados pessoais a Geoforte Fundações e Engenharia Ltda coleta através deste site, para que finalidade, com quem os compartilha e quais direitos você tem sobre eles, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD)."
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
            e-mail, telefone/WhatsApp, tipo de empreendimento e os detalhes do
            projeto que você opte por informar. Os campos de nome, empresa,
            e-mail e telefone são necessários para que possamos responder.
          </li>
          <li>
            <strong>Atendimento via WhatsApp:</strong> número de telefone e o
            conteúdo das mensagens trocadas com nossa equipe.
          </li>
          <li>
            <strong>Navegação:</strong> dados técnicos gerados automaticamente
            quando você acessa o site, como endereço IP, tipo de navegador e
            dispositivo, data e hora do acesso e páginas visitadas. Eles ficam
            nos registros (logs) do provedor de hospedagem e servem para a
            segurança e o funcionamento do site.
          </li>
          <li>
            <strong>Preferência de tema:</strong> se você escolher o tema escuro,
            essa escolha é guardada no próprio navegador (armazenamento local),
            apenas para lembrá-la na próxima visita. Não é um dado pessoal e não
            é enviada a nós.
          </li>
        </ul>
        <p>
          Não pedimos dados pessoais sensíveis. Pedimos que você também não os
          inclua no campo livre do formulário. A leitura do blog não exige
          cadastro nem coleta dados além dos de navegação descritos acima.
        </p>
      </section>

      <section>
        <h2>3. Para que usamos seus dados</h2>
        <p>Os dados coletados são usados para:</p>
        <ul>
          <li>Responder à sua solicitação de diagnóstico técnico e dar retorno sobre o seu projeto;</li>
          <li>Manter contato comercial e técnico durante a avaliação da sua obra;</li>
          <li>Proteger o site contra spam, abuso e uso automatizado indevido;</li>
          <li>Cumprir obrigações legais e regulatórias aplicáveis;</li>
          <li>Melhorar a segurança, a estabilidade e a experiência de navegação no site.</li>
        </ul>
        <p>
          Não usamos seus dados para decisões automatizadas que produzam efeitos
          sobre você, nem para perfilamento publicitário.
        </p>
      </section>

      <section>
        <h2>4. Base legal</h2>
        <p>
          O tratamento dos seus dados pessoais se fundamenta, conforme o art. 7º
          da LGPD, no <strong>consentimento</strong> dado ao preencher e enviar o
          formulário de contato, na execução de <strong>procedimentos
          preliminares</strong> a um eventual contrato de prestação de serviços, e
          no <strong>legítimo interesse</strong> da Geoforte em responder a
          solicitações comerciais recebidas por seus canais oficiais e em manter a
          segurança do site.
        </p>
      </section>

      <section>
        <h2>5. Como o formulário funciona</h2>
        <p>
          Ao enviar o formulário de diagnóstico técnico, as informações são
          transmitidas ao servidor do site e encaminhadas por <strong>e-mail</strong>{" "}
          à equipe da Geoforte. O site <strong>não mantém um banco de dados</strong>{" "}
          próprio com essas informações: elas ficam na caixa de e-mail que recebe
          as solicitações e, depois, nos registros de atendimento da empresa.
        </p>
        <p>
          Para limitar abusos, o servidor conta temporariamente as tentativas de
          envio por endereço IP, em memória, sem formar um histórico, e o
          formulário tem um campo oculto que só robôs preenchem.
        </p>
      </section>

      <section>
        <h2>6. Com quem compartilhamos seus dados</h2>
        <p>
          Não vendemos nem alugamos seus dados pessoais a terceiros. Podemos
          compartilhar informações estritamente necessárias com:
        </p>
        <ul>
          <li>
            <strong>Hospedagem do site</strong> (Vercel), que publica o site e
            mantém os registros técnicos de acesso;
          </li>
          <li>
            <strong>Serviço de envio de e-mail</strong> (Resend), que entrega à
            Geoforte as solicitações feitas pelo formulário;
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
        <p>
          Esses prestadores atuam como operadores, tratando os dados apenas para
          viabilizar o serviço contratado pela Geoforte.
        </p>
      </section>

      <section>
        <h2>7. Transferência internacional de dados</h2>
        <p>
          Alguns desses prestadores têm infraestrutura fora do Brasil, em
          especial nos Estados Unidos. Nesses casos, os dados podem ser
          processados no exterior, e adotamos prestadores que mantêm medidas de
          segurança e compromissos contratuais de proteção de dados compatíveis
          com a LGPD (art. 33).
        </p>
      </section>

      <section>
        <h2>8. Por quanto tempo guardamos seus dados</h2>
        <p>
          Mantemos os dados do formulário de contato pelo tempo necessário para
          concluir o atendimento e, quando há relação comercial subsequente, pelo
          prazo exigido pela legislação civil e fiscal aplicável. Os registros
          técnicos de acesso são mantidos pelo provedor de hospedagem por prazo
          limitado. Findo o prazo de cada finalidade, os dados são eliminados ou
          anonimizados.
        </p>
      </section>

      <section>
        <h2>9. Cookies e tecnologias semelhantes</h2>
        <p>
          Este site <strong>não utiliza cookies de análise de audiência nem de
          publicidade</strong>. O único dado guardado no seu navegador é a
          preferência de tema (claro ou escuro), descrita na seção 2, que é
          estritamente funcional. Se vierem a ser adotadas ferramentas de
          análise ou publicidade, esta Política será atualizada antes disso, com
          as opções de gerenciamento disponíveis a você.
        </p>
      </section>

      <section>
        <h2>10. Seus direitos como titular dos dados</h2>
        <p>Nos termos do art. 18 da LGPD, você tem direito a:</p>
        <ul>
          <li>Confirmar a existência de tratamento dos seus dados;</li>
          <li>Acessar os dados que temos sobre você;</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
          <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade;</li>
          <li>Solicitar a portabilidade dos seus dados a outro fornecedor;</li>
          <li>Solicitar a eliminação dos dados tratados com base no seu consentimento;</li>
          <li>Revogar o consentimento dado, a qualquer momento;</li>
          <li>Obter informações sobre com quem compartilhamos seus dados;</li>
          <li>Peticionar à Autoridade Nacional de Proteção de Dados (ANPD).</li>
        </ul>
        <p>Para exercer qualquer desses direitos, utilize os contatos da seção 12.</p>
      </section>

      <section>
        <h2>11. Segurança da informação</h2>
        <p>
          Adotamos medidas técnicas e administrativas razoáveis para proteger
          seus dados pessoais contra acessos não autorizados, perda, alteração
          ou divulgação indevida, incluindo conexão criptografada (HTTPS) e
          validação dos dados recebidos no servidor. Ainda assim, nenhum sistema
          é inteiramente imune a incidentes — caso um deles ocorra e afete seus
          dados, você será comunicado conforme exigido pela LGPD.
        </p>
      </section>

      <section>
        <h2>12. Como falar com a gente sobre privacidade</h2>
        <p>
          Solicitações relacionadas aos seus dados pessoais, inclusive ao nosso
          encarregado pelo tratamento de dados, podem ser enviadas para{" "}
          <a href={`mailto:${companyInfo.email}`}>{companyInfo.email}</a> ou pelo
          telefone {companyInfo.phone}. Responderemos dentro do prazo previsto na
          legislação aplicável.
        </p>
      </section>

      <section>
        <h2>13. Crianças e adolescentes</h2>
        <p>
          Este site é voltado a profissionais e empresas do setor da construção e
          não se destina a menores de 18 anos. Não coletamos intencionalmente
          dados de crianças e adolescentes.
        </p>
      </section>

      <section>
        <h2>14. Alterações desta política</h2>
        <p>
          Esta Política de Privacidade pode ser atualizada periodicamente para
          refletir mudanças no site ou na legislação. A data no topo desta página
          indica a versão vigente. Veja também os{" "}
          <Link href="/termos-de-uso">Termos de Uso</Link>.
        </p>
      </section>
    </LegalPage>
  );
}
