import { useLocation } from "wouter";
import { CheckoutForm } from "@/components/checkout-form";
import { PixDisplay } from "@/components/pix-display";
import { useToast } from "@/hooks/use-toast";
import { Heart, Shield, Lock, CheckCircle2, Clock } from "lucide-react";
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
        {/* Cabeçalho */}
        <div className="space-y-2 pb-2">
          <div className="flex items-center justify-center">
            <Heart className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <h1 className="text-center text-xl font-bold text-gray-900">
            {step === "form" 
              ? "Sua doação transformará vidas" 
              : "Transforme Esperança em Realidade"}
          </h1>
          <p className="text-center text-sm text-gray-600">
            {step === "form"
              ? `${formatCurrency(amount)} podem garantir ${amount >= 300 
                  ? "2 semanas de alimentação" 
                  : amount >= 100 
                    ? "uma semana de refeições" 
                    : "refeições nutritivas"} para eles.`
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