import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBanner from "@/assets/hero-banner.png";

interface HeroSectionProps {
  onSimulateClick: () => void;
}

const HeroSection = ({ onSimulateClick }: HeroSectionProps) => {
  const benefits = [
    "100% Gratuito",
    "Sem consulta ao SPC",
    "Resultado no WhatsApp",
    "Lojas em parceria"
  ];

  return (
    <section id="inicio" className="border-b border-black/10 bg-background pb-16 pt-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
              Simule com a AMX o crédito ideal para o seu próximo plano
            </h1>
            
            <p className="text-lg text-muted-foreground font-medium">
              Atendimento em Manaus, Amazonas, com retorno pelo WhatsApp.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-black shadow-sm">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="text-foreground">{benefit}</span>
                </div>
              ))}
            </div>

            <Button 
              onClick={onSimulateClick}
              size="lg"
              className="rounded-lg bg-black px-8 py-6 text-lg font-semibold text-white shadow-lg shadow-black/20 transition-all hover:bg-black/80 hover:shadow-xl"
            >
              Simular crédito agora
            </Button>
          </div>

          <div className="relative animate-scale-in">
            <img 
              src={heroBanner} 
              alt="Imóveis e Veículos" 
              className="h-auto w-full rounded-2xl border border-black/10 shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
