import { BadgeCheck, ClipboardList, HandCoins, PhoneCall } from "lucide-react";
import itauLogo from "@/assets/bancos/itau.png";
import bradescoLogo from "@/assets/bancos/bradesco.png";
import caixaLogo from "@/assets/bancos/caixa.png";
import santanderLogo from "@/assets/bancos/santander.png";

const BenefitsSection = () => {
  const steps = [
    {
      icon: ClipboardList,
      title: "Você conta o objetivo",
      description:
        "A AMX entende se o foco é imóvel, veículo, moto, caminhão ou maquinário antes de sugerir qualquer direção.",
    },
    {
      icon: HandCoins,
      title: "O plano é filtrado pelo orçamento",
      description:
        "Valor de crédito, parcela desejada e possibilidade de entrada entram na análise para reduzir tentativa no escuro.",
    },
    {
      icon: BadgeCheck,
      title: "As alternativas são organizadas",
      description:
        "A equipe cruza o perfil com instituições parceiras e prepara um retorno mais objetivo para a sua realidade.",
    },
    {
      icon: PhoneCall,
      title: "O retorno chega no WhatsApp",
      description:
        "Depois da simulação, o contato segue pelo canal mais rápido para ajustar os próximos passos com você.",
    },
  ];

  const partnerBanks = [
    { name: "Itaú", logo: itauLogo },
    { name: "Bradesco", logo: bradescoLogo },
    { name: "Caixa", logo: caixaLogo },
    { name: "Santander", logo: santanderLogo },
  ];

  return (
    <section id="beneficios" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-black/50">
              Como a AMX trabalha
            </p>
            <h2 className="max-w-xl text-3xl font-bold leading-tight text-black md:text-5xl">
              Uma análise de crédito com atendimento local, não resposta automática.
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-black/60">
              A proposta é transformar os dados do simulador em uma conversa clara sobre possibilidades, prazo e parcela.
            </p>
          </div>

          <div className="border-y border-black">
            {steps.map((step, index) => (
              <article
                key={step.title}
                className="grid gap-4 border-b border-black/10 py-7 last:border-b-0 sm:grid-cols-[64px_1fr]"
              >
                <div className="flex h-14 w-14 items-center justify-center border border-black bg-white">
                  <step.icon className="h-7 w-7 text-black" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-black/40">
                    Etapa {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-2xl font-bold text-black">{step.title}</h3>
                  <p className="mt-2 text-base leading-relaxed text-black/60">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-16 border-t border-black/10 pt-10">
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-black/50">
                Rede de apoio
              </p>
              <h3 className="text-3xl font-bold text-black">
                Instituições parceiras para ampliar as possibilidades.
              </h3>
            </div>
            <p className="text-base leading-relaxed text-black/60">
              A AMX não prende sua análise em uma única alternativa. O simulador ajuda a organizar o cenário para buscar uma condição compatível com o seu plano.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {partnerBanks.map((bank) => (
              <article
                key={bank.name}
                className="flex min-h-[132px] flex-col justify-between border border-black/10 bg-white p-4 transition-colors hover:border-black"
              >
                <div className="flex h-16 items-center justify-center">
                  <img
                    src={bank.logo}
                    alt={`Logo ${bank.name}`}
                    className="max-h-12 w-full object-contain"
                  />
                </div>
                <p className="border-t border-black/10 pt-3 text-center text-sm font-bold uppercase tracking-wide text-black">
                  {bank.name}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
