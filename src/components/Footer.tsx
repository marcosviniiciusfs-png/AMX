import { Clock, MessageCircle } from "lucide-react";
import amxLogo from "@/assets/logo-amx.png";

const Footer = () => {
  return (
    <footer id="contato" className="border-t-4 border-black bg-background text-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex flex-col items-center md:items-start gap-2 mb-4">
              <img
                src={amxLogo}
                alt="AMX Representações"
                className="h-12 w-auto object-contain md:h-14"
              />
            </div>
            <p className="max-w-xs text-center text-sm text-foreground/70 md:text-left">
              Simulação de crédito para imóveis, veículos, motos, caminhões e maquinário.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Atendimento</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Retorno pelo WhatsApp</p>
                  <p className="text-foreground/70">Use o simulador para solicitar contato.</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Próximos passos</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Análise do cadastro</p>
                  <p className="text-foreground/70">
                    Os dados enviados passam por avaliação para montagem da simulação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-black/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-foreground/70">
              © 2026 AMX. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <button className="text-foreground/70 transition-colors hover:text-foreground">
                Política de Privacidade
              </button>
              <button className="text-foreground/70 transition-colors hover:text-foreground">
                Termos de Uso
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
