import { MessageCircle, DollarSign, FileText } from "lucide-react";
import itauLogo from "@/assets/bancos/itau.png";
import bradescoLogo from "@/assets/bancos/bradesco.png";
import caixaLogo from "@/assets/bancos/caixa.png";
import santanderLogo from "@/assets/bancos/santander.png";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: MessageCircle,
      title: "Receba direto no WhatsApp",
      description: "Sua simulação de crédito é analisada para retorno pelo WhatsApp com as informações necessárias."
    },
    {
      icon: DollarSign,
      title: "Parcelas que cabem no seu bolso",
      description: "Encontramos as melhores condições de financiamento com parcelas que se adequam ao seu orçamento."
    },
    {
      icon: FileText,
      title: "Simulação sem compromisso",
      description: "Faça quantas simulações quiser, totalmente grátis e sem consulta ao SPC ou Serasa."
    }
  ];
  const partnerBanks = [
    { name: "Itaú", logo: itauLogo },
    { name: "Bradesco", logo: bradescoLogo },
    { name: "Caixa", logo: caixaLogo },
    { name: "Santander", logo: santanderLogo },
  ];

  return (
    <section id="beneficios" className="bg-secondary/30 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Por que escolher a AMX?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Oferecemos as melhores condições do mercado com total transparência e agilidade.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="animate-fade-in rounded-xl border border-black/10 bg-card p-8 shadow-md transition-all hover:-translate-y-1 hover:border-black/40 hover:shadow-xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                <benefit.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 text-center">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-3">
              Bancos parceiros para financiamento
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trabalhamos com instituições reconhecidas para ampliar suas possibilidades de crédito e encontrar condições adequadas ao seu plano.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {partnerBanks.map((bank) => (
              <div
                key={bank.name}
                className="min-h-[150px] rounded-lg border border-black/10 bg-background p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-black/40 hover:shadow-lg"
              >
                <div className="mx-auto mb-4 flex h-20 w-full items-center justify-center rounded-lg border border-black/10 bg-white px-4 py-3">
                  <img
                    src={bank.logo}
                    alt={`Logo ${bank.name}`}
                    className="h-full max-h-16 w-full object-contain"
                  />
                </div>
                <p className="text-center text-lg font-semibold text-foreground">
                  {bank.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
