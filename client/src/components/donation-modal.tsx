import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckoutForm } from "./checkout-form";
import { PixDisplay } from "./pix-display";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";
import Facebook from "./Facebook";

interface DonationModalProps {
  amount: number;
  onClose: () => void;
}

type ModalStep = "form" | "pix";

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

export function DonationModal({ amount, onClose }: DonationModalProps) {
  const [step, setStep] = useState<ModalStep>("form");
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const { toast } = useToast();

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
    <DialogContent className="bg-white rounded-lg max-w-md mx-auto p-4 overflow-y-auto max-h-[90vh] sm:max-h-[600px]">
      {/* Adiciona o evento InitiateCheckout quando o modal é aberto */}
      <Facebook 
        event="InitiateCheckout"
        params={{
          content_category: "donation",
          value: amount,
          currency: "BRL"
        }}
      />
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

      <div className="bg-green-50 p-2 rounded-lg text-xs text-green-800 text-center">
        100% do valor será destinado para alimentação da família.
      </div>

      <div className="py-2">
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
              onSuccess={onClose}
              onError={handleError}
              amount={amount}
            />
          )
        )}
      </div>
    </DialogContent>
  );
}