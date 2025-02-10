import { useLocation } from "wouter";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckoutForm } from "@/components/checkout-form";
import { PixDisplay } from "@/components/pix-display";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      {/* Adiciona o evento InitiateCheckout quando a página é carregada */}
      <Facebook 
        event="InitiateCheckout"
        params={{
          content_category: "donation",
          value: amount,
          currency: "BRL"
        }}
      />

      <div className="max-w-md mx-auto bg-white min-h-screen p-6">
        <DialogHeader className="space-y-2 pb-2">
          <div className="flex items-center justify-center">
            <Heart className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <DialogTitle className="text-center text-lg">
            {step === "form" 
              ? "Sua Doação Vai Mudar Vidas" 
              : "Transforme Esperança em Realidade"}
          </DialogTitle>
          <p className="text-center text-sm text-gray-600">
            {step === "form"
              ? `${formatCurrency(amount)} podem garantir ${amount >= 300 
                  ? "2 semanas de alimentação" 
                  : amount >= 100 
                    ? "uma semana de refeições" 
                    : "refeições nutritivas"} para a família.`
              : "Estamos quase lá! Complete sua doação para ajudar imediatamente."}
          </p>
        </DialogHeader>

        <div className="bg-green-50 p-2 rounded-lg text-xs text-green-800 text-center mt-4">
          100% do valor será destinado para alimentação da família.
        </div>

        <div className="py-4">
          {step === "form" ? (
            <CheckoutForm
              amount={amount}
              onSuccess={handlePaymentCreated}
              onError={handleError}
            />
          ) : (
            paymentDetails && (
              <PixDisplay
                donationId={paymentDetails.donationId}
                pixCode={paymentDetails.pixCode}
                pixQrCode={paymentDetails.pixQrCode}
                expiresAt={paymentDetails.expiresAt}
                onSuccess={() => navigate(`/thank-you?amount=${amount}`)}
                onError={handleError}
                amount={amount}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
