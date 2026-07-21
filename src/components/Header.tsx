import { useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import amxLogo from "@/assets/logo-amx.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const links = [
    { label: "Como funciona", target: "beneficios" },
    { label: "Simulação", target: "simulador" },
    { label: "Clientes", target: "clientes" },
    { label: "Contato", target: "contato" },
  ];

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-black/10 bg-white/95 shadow-sm backdrop-blur">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={() => scrollToSection("inicio")}
          className="flex items-center"
          aria-label="Ir para o início"
        >
          <img
            src={amxLogo}
            alt="AMX Representações"
            className="h-10 w-auto object-contain md:h-12"
          />
        </button>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <button
              key={link.target}
              onClick={() => scrollToSection(link.target)}
              className="text-sm font-medium uppercase tracking-wide text-black transition-colors hover:text-black/60"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <a
          href="https://wa.me/5592994293489"
          className="hidden h-10 items-center gap-2 border border-black bg-black px-4 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-black md:inline-flex"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>

        <Button
          variant="ghost"
          size="icon"
          className="text-black hover:bg-black/10 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-black/10 bg-white md:hidden">
          <nav className="container mx-auto flex flex-col gap-1 px-4 py-4">
            {links.map((link) => (
              <button
                key={link.target}
                onClick={() => scrollToSection(link.target)}
                className="py-3 text-left text-sm font-semibold uppercase tracking-wide text-black transition-colors hover:text-black/60"
              >
                {link.label}
              </button>
            ))}
            <a
              href="https://wa.me/5592994293489"
              className="mt-3 inline-flex h-11 items-center justify-center gap-2 border border-black bg-black px-4 text-sm font-semibold text-white"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
