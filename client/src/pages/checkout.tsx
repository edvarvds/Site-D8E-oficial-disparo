import { useLocation } from "wouter";
import { CheckoutForm } from "@/components/checkout-form";
import { PixDisplay } from "@/components/pix-display";
import { useToast } from "@/hooks/use-toast";
import { Heart, Shield, Lock, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";
import Facebook from "@/components/Facebook";

type CheckoutStep = "form" | "pix";

interface PaymentDetails {
  donationId: number;
  pixCode: string;
  pixQrCode: string;
  expiresAt: string;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).replace('R$', 'R$ ');
};

export default function Checkout() {
  const [step, setStep] = useState<CheckoutStep>("form");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  // Pegar o valor da URL
  const searchParams = new URLSearchParams(window.location.search);
  const amount = Number(searchParams.get("amount") || 0);

  // Se não tiver valor, redirecionar para home
  if (amount === 0) {
    navigate("/");
    return null;
  }

  const handlePaymentCreated = (details: PaymentDetails) => {
    setPaymentDetails(details);
    setStep("pix");
  };

  const handleError = (message: string) => {
    toast({
      title: "Erro",
      description: message,
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Facebook 
        event="InitiateCheckout"
        params={{
          content_category: "donation",
          value: amount,
          currency: "BRL"
        }}
      />

      {/* Header com Logo */}
      <header className="border-b bg-white shadow-sm">
        <div className="max-w-md mx-auto p-4">
          <img 
            src="https://www.vaquinhaonline.com.br/wp-content/uploads/2023/12/cropped-logotipo-vakinha-online.png" 
            alt="Vakinha Online" 
            className="h-8"
          />
        </div>
      </header>

      <div className="max-w-md mx-auto bg-white min-h-screen p-6">
        {/* Progresso do Checkout */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200">
            <div className={`h-full bg-green-600 transition-all duration-500 ${step === "form" ? "w-1/2" : "w-full"}`} />
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
              1
            </div>
            <span className="text-xs mt-1 font-medium">Dados</span>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step === "pix" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500"}`}>
              2
            </div>
            <span className="text-xs mt-1 font-medium">Pagamento</span>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-sm">
              3
            </div>
            <span className="text-xs mt-1 font-medium">Confirmação</span>
          </div>
        </div>

        {/* Cabeçalho */}
        <div className="space-y-2 pb-2">
          <div className="flex items-center justify-center">
            <Heart className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <h1 className="text-center text-xl font-bold text-gray-900">
            {step === "form" 
              ? "Sua Doação Vai Mudar Vidas" 
              : "Transforme Esperança em Realidade"}
          </h1>
          <p className="text-center text-sm text-gray-600">
            {step === "form"
              ? `${formatCurrency(amount)} podem garantir ${amount >= 300 
                  ? "2 semanas de alimentação" 
                  : amount >= 100 
                    ? "uma semana de refeições" 
                    : "refeições nutritivas"} para a família.`
              : "Estamos quase lá! Complete sua doação para ajudar imediatamente."}
          </p>
        </div>

        {/* Selos de Segurança */}
        <div className="grid grid-cols-3 gap-4 py-4 mb-6 border-y">
          <div className="flex flex-col items-center text-center">
            <Shield className="h-6 w-6 text-green-600 mb-1" />
            <span className="text-xs font-medium text-gray-700">Doação Segura</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <Lock className="h-6 w-6 text-green-600 mb-1" />
            <span className="text-xs font-medium text-gray-700">Dados Protegidos</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="h-6 w-6 text-green-600 mb-1" />
            <span className="text-xs font-medium text-gray-700">Site Verificado</span>
          </div>
        </div>

        {/* Benefícios */}
        <div className="space-y-3 mb-6">
          <h2 className="text-sm font-semibold text-gray-900">Por que doar com a Vakinha Online?</h2>
          <div className="space-y-2">
            {[
              "Plataforma líder em doações sociais no Brasil",
              "Mais de 1 milhão de doadores confiam em nós",
              "100% do valor é destinado para a causa",
              "Processo transparente e seguro"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="text-xs text-gray-600">{benefit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Formulário ou PIX */}
        <div className="py-4">
          {step === "form" ? (
            <>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-blue-700">
                      Seus dados estão protegidos com criptografia de ponta a ponta.
                      Não compartilhamos informações sensíveis.
                    </p>
                  </div>
                </div>
              </div>
              <CheckoutForm
                amount={amount}
                onSuccess={handlePaymentCreated}
                onError={handleError}
              />
            </>
          ) : (
            paymentDetails && (
              <>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-yellow-800">
                        O código PIX tem validade de 10 minutos. Após este período,
                        você precisará gerar um novo código.
                      </p>
                    </div>
                  </div>
                </div>
                <PixDisplay
                  donationId={paymentDetails.donationId}
                  pixCode={paymentDetails.pixCode}
                  pixQrCode={paymentDetails.pixQrCode}
                  expiresAt={paymentDetails.expiresAt}
                  onSuccess={() => navigate(`/thank-you?amount=${amount}`)}
                  onError={handleError}
                  amount={amount}
                />
              </>
            )
          )}
        </div>

        {/* Footer com Selos */}
        <footer className="mt-8 pt-6 border-t">
          <div className="flex justify-center space-x-4">
          </div>
          <p className="text-center text-xs text-gray-500 mt-4">
            © 2024 Vakinha Online - CNPJ 22.831.673/0001-26
          </p>
        </footer>
      </div>
    </div>
  );
}