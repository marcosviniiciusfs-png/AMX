import { type InputHTMLAttributes, useState } from "react";
import { Calculator, ChevronLeft, ChevronRight, Clock3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import InputMask from "react-input-mask";
import { trackLead } from "@/services/metaConversions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SimulatorData {
  propertyType: string;
  limitedConditionsInterest: string;
  acquisitionTime: string;
  creditAmount: string;
  hasDownPayment: string;
  downPaymentAmount: string;
  monthlyPayment: string;
  city: string;
  fullName: string;
  whatsapp: string;
}

const emptyFormData: SimulatorData = {
  propertyType: "",
  limitedConditionsInterest: "",
  acquisitionTime: "",
  creditAmount: "",
  hasDownPayment: "",
  downPaymentAmount: "",
  monthlyPayment: "",
  city: "",
  fullName: "",
  whatsapp: "",
};

const Simulator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<SimulatorData>(emptyFormData);

  const totalSteps = 9;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    const amount = Number(numbers) / 100;
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  const handleCurrencyChange = (field: keyof SimulatorData, value: string) => {
    const formatted = formatCurrency(value);
    setFormData({ ...formData, [field]: formatted });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.propertyType !== "";
      case 1:
        return formData.limitedConditionsInterest !== "";
      case 2:
        return formData.acquisitionTime !== "";
      case 3:
        return formData.creditAmount !== "";
      case 4:
        if (formData.hasDownPayment === "Sim") {
          return formData.downPaymentAmount !== "";
        }
        return formData.hasDownPayment !== "";
      case 5:
        return formData.monthlyPayment !== "";
      case 6:
        return formData.city.trim() !== "";
      case 7:
        return formData.fullName.trim() !== "";
      case 8:
        return formData.whatsapp.replace(/\D/g, "").length === 11;
      default:
        return false;
    }
  };

  const validateFormData = () => {
    if (!formData.propertyType) return "Selecione o plano que deseja avaliar.";
    if (!formData.limitedConditionsInterest) return "Informe se quer prioridade em campanhas ativas.";
    if (!formData.acquisitionTime) return "Selecione a janela de tempo.";
    if (!formData.creditAmount) return "Informe o valor de crédito.";
    if (!formData.hasDownPayment) return "Informe se pretende usar entrada ou lance.";
    if (formData.hasDownPayment === "Sim" && !formData.downPaymentAmount) {
      return "Informe o valor reservado para entrada ou lance.";
    }
    if (!formData.monthlyPayment) return "Informe a parcela mensal desejada.";
    if (!formData.city.trim()) return "Informe a cidade.";
    if (!formData.fullName.trim()) return "Informe seu nome.";
    if (formData.whatsapp.replace(/\D/g, "").length !== 11) {
      return "Informe um WhatsApp válido.";
    }

    return null;
  };

  const handleNext = () => {
    if (currentStep === 4 && formData.hasDownPayment === "Não") {
      setFormData({ ...formData, downPaymentAmount: "" });
    }
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const validationError = validateFormData();
    if (validationError) {
      setIsSubmitting(false);
      toast({
        title: "Dados incompletos",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    const downPaymentValue = formData.hasDownPayment === "Sim" ? formData.downPaymentAmount : "Não tem";
    const leadData = {
      fullName: formData.fullName.trim(),
      whatsapp: formData.whatsapp,
      creditAmount: formData.creditAmount,
      limitedConditionsInterest: formData.limitedConditionsInterest,
      hasDownPayment: formData.hasDownPayment,
      downPaymentAmount: downPaymentValue,
      monthlyPayment: formData.monthlyPayment,
      city: formData.city.trim(),
      acquisitionTime: formData.acquisitionTime,
      propertyType: formData.propertyType,
    };

    try {
      await trackLead(leadData);

      toast({
        title: "Análise enviada",
        description: "Recebemos seus dados e a AMX entrará em contato em breve.",
      });

      setFormData(emptyFormData);
      setCurrentStep(0);
      try {
        sessionStorage.setItem("lead_submission_success", "true");
      } catch {
        // Ignore storage errors; navigation still follows the successful request.
      }
      navigate("/obrigado", { replace: true });
    } catch (error) {
      console.error("Erro ao enviar:", error);
      setIsSubmitting(false);
      toast({
        title: "Erro ao enviar análise",
        description: error instanceof Error ? error.message : "Por favor, tente novamente.",
        variant: "destructive",
      });
      return;
    }
  };

  const optionButtonClass = (selected: boolean) =>
    `min-h-14 border px-4 py-3 text-base font-semibold transition-all ${
      selected
        ? "border-black bg-black text-white"
        : "border-black/20 bg-white text-black hover:border-black"
    }`;

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-5">
            <Label htmlFor="propertyType" className="block text-2xl font-bold text-black">
              Qual plano você quer tirar do papel?
            </Label>
            <Select
              value={formData.propertyType}
              onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
            >
              <SelectTrigger id="propertyType" className="h-14 rounded-none border-black/20 text-base">
                <SelectValue placeholder="Escolha o tipo de plano" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Casa ou apartamento">Casa ou apartamento</SelectItem>
                <SelectItem value="Carro">Carro</SelectItem>
                <SelectItem value="Moto">Moto</SelectItem>
                <SelectItem value="Caminhão">Caminhão</SelectItem>
                <SelectItem value="Maquinário">Maquinário</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 1:
        return (
          <div className="space-y-5">
            <Label className="block text-2xl font-bold text-black">
              Se houver uma campanha ativa, você quer prioridade no retorno?
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, limitedConditionsInterest: "Sim" })}
                className={optionButtonClass(formData.limitedConditionsInterest === "Sim")}
              >
                Sim, quero
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, limitedConditionsInterest: "Não" })}
                className={optionButtonClass(formData.limitedConditionsInterest === "Não")}
              >
                Agora não
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <Label className="block text-2xl font-bold text-black">
              Em qual janela de tempo você gostaria de avançar?
            </Label>
            <Select
              value={formData.acquisitionTime}
              onValueChange={(value) => setFormData({ ...formData, acquisitionTime: value })}
            >
              <SelectTrigger className="h-14 rounded-none border-black/20 text-base">
                <SelectValue placeholder="Escolha uma previsão" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="Até 60 dias">Até 60 dias</SelectItem>
                <SelectItem value="Entre 3 e 4 meses">Entre 3 e 4 meses</SelectItem>
                <SelectItem value="Entre 5 e 6 meses">Entre 5 e 6 meses</SelectItem>
                <SelectItem value="Sem pressa definida">Sem pressa definida</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <Label htmlFor="creditAmount" className="block text-2xl font-bold text-black">
              Qual faixa de crédito quer estudar?
            </Label>
            <Input
              id="creditAmount"
              value={formData.creditAmount}
              onChange={(e) => handleCurrencyChange("creditAmount", e.target.value)}
              placeholder="R$ 0,00"
              className="h-14 rounded-none border-black/20 text-center text-lg"
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <Label className="block text-2xl font-bold text-black">
              Pretende usar entrada ou lance?
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasDownPayment: "Sim" })}
                className={optionButtonClass(formData.hasDownPayment === "Sim")}
              >
                Sim
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, hasDownPayment: "Não" })}
                className={optionButtonClass(formData.hasDownPayment === "Não")}
              >
                Não
              </button>
            </div>

            {formData.hasDownPayment === "Sim" && (
              <div className="space-y-3 pt-3">
                <Label htmlFor="downPayment" className="text-sm font-semibold uppercase tracking-wide text-black/50">
                  Qual valor você considera reservar?
                </Label>
                <Input
                  id="downPayment"
                  value={formData.downPaymentAmount}
                  onChange={(e) => handleCurrencyChange("downPaymentAmount", e.target.value)}
                  placeholder="R$ 0,00"
                  className="h-14 rounded-none border-black/20 text-center text-lg"
                />
              </div>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-5">
            <Label htmlFor="monthlyPayment" className="block text-2xl font-bold text-black">
              Qual parcela mensal não aperta o orçamento?
            </Label>
            <Input
              id="monthlyPayment"
              value={formData.monthlyPayment}
              onChange={(e) => handleCurrencyChange("monthlyPayment", e.target.value)}
              placeholder="R$ 0,00"
              className="h-14 rounded-none border-black/20 text-center text-lg"
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-5">
            <Label htmlFor="city" className="block text-2xl font-bold text-black">
              Cidade para atendimento
            </Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="Ex.: Manaus"
              className="h-14 rounded-none border-black/20 text-center text-lg"
            />
          </div>
        );

      case 7:
        return (
          <div className="space-y-5">
            <Label htmlFor="fullName" className="block text-2xl font-bold text-black">
              Nome para cadastro da simulação
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Digite seu nome"
              className="h-14 rounded-none border-black/20 text-center text-lg"
            />
          </div>
        );

      case 8:
        return (
          <div className="space-y-5">
            <Label htmlFor="whatsapp" className="block text-2xl font-bold text-black">
              WhatsApp para retorno da AMX
            </Label>
            <InputMask
              mask="(99) 99999-9999"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
            >
              {(inputProps: InputHTMLAttributes<HTMLInputElement>) => (
                <Input
                  {...inputProps}
                  id="whatsapp"
                  placeholder="(00) 00000-0000"
                  className="h-14 rounded-none border-black/20 text-center text-lg"
                />
              )}
            </InputMask>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section id="simulador" className="border-y border-black bg-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-stretch">
          <aside className="bg-black p-8 text-white md:p-10">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-white/50">
              Análise AMX
            </p>
            <h2 className="text-3xl font-bold leading-tight md:text-5xl">
              Responda com calma. A AMX organiza o cenário depois.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/70">
              As perguntas foram pensadas para entender objetivo, valor, prazo e conforto de parcela antes do contato comercial.
            </p>
            <div className="mt-8 space-y-5 border-t border-white/20 pt-7">
              <div className="flex gap-3">
                <Calculator className="mt-1 h-5 w-5 flex-shrink-0" />
                <p className="text-sm leading-relaxed text-white/75">
                  Crédito e parcela entram juntos na avaliação.
                </p>
              </div>
              <div className="flex gap-3">
                <Clock3 className="mt-1 h-5 w-5 flex-shrink-0" />
                <p className="text-sm leading-relaxed text-white/75">
                  O prazo desejado ajuda a priorizar as alternativas.
                </p>
              </div>
            </div>
          </aside>

          <div className="border border-black bg-white p-6 shadow-[12px_12px_0_0_rgba(0,0,0,1)] md:p-8">
            <div className="mb-8 space-y-3">
              <div className="flex items-center justify-between text-sm font-semibold uppercase tracking-wide text-black/50">
                <span>Etapa {currentStep + 1}</span>
                <span>{currentStep + 1}/{totalSteps}</span>
              </div>
              <Progress value={progress} className="h-2 rounded-none" />
            </div>

            <div className="min-h-[260px]">{renderStep()}</div>

            <div className="flex justify-between gap-4 border-t border-black/10 pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="h-12 rounded-none border-black/20 px-5"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>

              {currentStep < totalSteps - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="h-12 rounded-none bg-black px-5 text-white hover:bg-black/80"
                >
                  Continuar
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleFinish}
                  disabled={!canProceed() || isSubmitting}
                  className="h-12 rounded-none bg-black px-5 text-white hover:bg-black/80"
                >
                  {isSubmitting ? "Enviando..." : "Enviar para análise"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Simulator;
