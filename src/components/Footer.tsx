import { Instagram, MapPin, MessageCircle } from "lucide-react";
import amxLogo from "@/assets/logo-amx.png";

const whatsappUrl = "https://wa.me/5592994293489";
const instagramUrl = "https://www.instagram.com/amxrepresentacoesefinancas/";

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
              AMX Representações e Finanças. Simulação de crédito com atendimento em Manaus, Amazonas.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Fale conosco</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                  >
                    (92) 99429-3489
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Instagram className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Instagram</p>
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/70 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                    aria-label="Instagram da AMX Representações e Finanças"
                  >
                    @amxrepresentacoesefinancas
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Localização</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Manaus - AM</p>
                  <p className="text-foreground/70">
                    Av. Mário Ypiranga, nº 2535<br />
                    Bairro Flores<br />
                    CEP 69058-775
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
