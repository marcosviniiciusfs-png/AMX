import { ArrowRight, MapPin, MessagesSquare, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroConsultoria from "@/assets/hero-amx-consultoria.png";

interface HeroSectionProps {
  onSimulateClick: () => void;
}

const HeroSection = ({ onSimulateClick }: HeroSectionProps) => {
  const highlights = [
    "Atendimento humano",
    "Condições em parceria",
    "Retorno pelo WhatsApp",
  ];

  return (
    <section
      id="inicio"
      className="relative isolate min-h-[680px] overflow-hidden border-b border-black/10 bg-white pt-24 md:min-h-[720px]"
    >
      <img
        src={heroConsultoria}
        alt="Consultora AMX apresentando uma análise de crédito para cliente em Manaus"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/20" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white to-transparent" />

      <div className="container relative z-10 mx-auto flex min-h-[calc(680px-6rem)] items-center px-4 py-16 md:min-h-[calc(720px-6rem)]">
        <div className="max-w-2xl animate-fade-in">
          <p className="mb-5 inline-flex items-center gap-2 border border-black/20 bg-white/80 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-black backdrop-blur">
            <MapPin className="h-4 w-4" />
            Manaus, Amazonas
          </p>

          <h1 className="text-4xl font-bold leading-tight text-black md:text-6xl lg:text-7xl">
            Simulação AMX para crédito planejado
          </h1>

          <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-black/70 md:text-xl">
            Uma análise direta para quem quer organizar o próximo bem com clareza, sem atendimento genérico e com retorno próximo pelo WhatsApp.
          </p>

          <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {highlights.map((highlight) => (
              <div key={highlight} className="border-l-2 border-black pl-4">
                <ShieldCheck className="mb-3 h-5 w-5 text-black" />
                <p className="text-sm font-semibold uppercase tracking-wide text-black">
                  {highlight}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={onSimulateClick}
              size="lg"
              className="h-14 rounded-none bg-black px-7 text-base font-semibold text-white shadow-xl shadow-black/20 transition-all hover:bg-black/80"
            >
              Iniciar minha análise
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <a
              href="https://wa.me/5592994293489"
              className="inline-flex h-14 items-center justify-center gap-2 border border-black bg-white/80 px-7 text-base font-semibold text-black backdrop-blur transition-colors hover:bg-black hover:text-white"
            >
              <MessagesSquare className="h-5 w-5" />
              WhatsApp AMX
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
