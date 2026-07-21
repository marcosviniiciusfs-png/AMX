import { useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";

const ThankYou = () => {
  const canShowThankYou =
    typeof window !== "undefined" &&
    sessionStorage.getItem("lead_submission_success") === "true";

  useEffect(() => {
    if (!canShowThankYou) return;

    try {
      sessionStorage.removeItem("lead_submission_success");
    } catch {
      // Ignore storage errors.
    }
  }, [canShowThankYou]);

  if (!canShowThankYou) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-black/10 p-6">
            <CheckCircle className="h-16 w-16 text-black" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Obrigado!
          </h1>
          <p className="text-lg text-muted-foreground">
            Sua solicitacao foi enviada com sucesso! Em breve entraremos em contato via WhatsApp.
          </p>
        </div>

        <div className="pt-4">
          <Link to="/">
            <Button className="bg-black text-white hover:bg-black/80">
              Voltar para o inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
