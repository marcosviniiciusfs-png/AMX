import { Clock, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contato" className="bg-[hsl(var(--header-footer))] border-t-4 border-brand-blue text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex flex-col items-center md:items-start gap-2 mb-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-xl border border-brand-blue/50 bg-white text-3xl font-black text-brand-blue shadow-sm">
                AMX
              </div>
            </div>
            <p className="max-w-xs text-center text-sm text-white/80 md:text-left">
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
                  <p className="text-white/90">Use o simulador para solicitar contato.</p>
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
                  <p className="text-white/90">
                    Os dados enviados passam por avaliação para montagem da simulação.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-blue/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/90 text-sm">
              © 2026 AMX. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <button className="text-white/90 hover:text-white transition-colors">
                Política de Privacidade
              </button>
              <button className="text-white/90 hover:text-white transition-colors">
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
