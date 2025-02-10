import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckoutForm } from "./checkout-form";
import { PixDisplay } from "./pix-display";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";

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
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <div className="flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-red-500 animate-pulse" />
        </div>
        <DialogTitle className="text-center text-xl">
          {step === "form" 
            ? "Sua Doação Vai Mudar Vidas" 
            : "Transforme Esperança em Realidade"}
        </DialogTitle>
        <p className="text-center text-gray-600 mt-2">
          {step === "form"
            ? `R$ ${amount.toFixed(2)} podem garantir ${amount >= 300 
                ? "2 semanas de alimentação" 
                : amount >= 100 
                  ? "uma semana de refeições" 
                  : "refeições nutritivas"} para a família.`
            : "Estamos quase lá! Complete sua doação para ajudar imediatamente."}
        </p>
      </DialogHeader>

      <div className="bg-green-50 p-4 rounded-lg mb-4">
        <p className="text-sm text-green-800 text-center">
          100% do valor será destinado para alimentação da família.
        </p>
      </div>

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
          />
        )
      )}
    </DialogContent>
  );
}