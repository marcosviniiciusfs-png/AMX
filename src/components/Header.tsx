import { useState } from "react";
import { Menu, X } from "lucide-react";
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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/10 bg-background/95 shadow-sm backdrop-blur">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center" aria-label="AMX Representações">
          <img
            src={amxLogo}
            alt="AMX Representações"
            className="h-10 w-auto object-contain md:h-12"
          />
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => scrollToSection("simulador")}
            className="text-foreground transition-colors hover:text-foreground/60"
          >
            Simulador
          </button>
          <button
            onClick={() => scrollToSection("beneficios")}
            className="text-foreground transition-colors hover:text-foreground/60"
          >
            Benefícios
          </button>
          <button
            onClick={() => scrollToSection("clientes")}
            className="text-foreground transition-colors hover:text-foreground/60"
          >
            Clientes
          </button>
          <button
            onClick={() => scrollToSection("contato")}
            className="text-foreground transition-colors hover:text-foreground/60"
          >
            Contato
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:bg-black/10 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-black/10 bg-background md:hidden">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <button
              onClick={() => scrollToSection("simulador")}
              className="py-2 text-left text-foreground transition-colors hover:text-foreground/60"
            >
              Simulador
            </button>
            <button
              onClick={() => scrollToSection("beneficios")}
              className="py-2 text-left text-foreground transition-colors hover:text-foreground/60"
            >
              Benefícios
            </button>
            <button
              onClick={() => scrollToSection("clientes")}
              className="py-2 text-left text-foreground transition-colors hover:text-foreground/60"
            >
              Clientes
            </button>
            <button
              onClick={() => scrollToSection("contato")}
              className="py-2 text-left text-foreground transition-colors hover:text-foreground/60"
            >
              Contato
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
