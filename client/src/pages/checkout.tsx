import { useLocation } from "wouter";
import { CheckoutForm } from "@/components/checkout-form";
import { PixDisplay } from "@/components/pix-display";
import { useToast } from "@/hooks/use-toast";
import Facebook from "@/components/Facebook";
import { useState } from "react";

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

      {/* Banner Message */}
      <div className="bg-blue-50 border-y border-blue-100">
        <div className="max-w-3xl mx-auto py-3 px-4 text-center">
          <p className="text-blue-800 font-medium text-sm">
            Você foi um escolhido(a) de Deus para ajudar na missão de cuidar desta Família
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto bg-white min-h-screen p-6">
        {/* Formulário ou PIX */}
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

        {/* Footer com informações legais */}
        <footer className="mt-8 pt-6 border-t">
          <p className="text-center text-xs text-gray-500 mt-4">
            © 2024 Vakinha Online - CNPJ 22.831.673/0001-26
          </p>
        </footer>
      </div>
    </div>
  );
}