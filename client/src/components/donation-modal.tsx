import { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckoutForm } from "./checkout-form";
import { PixDisplay } from "./pix-display";
import { useToast } from "@/hooks/use-toast";

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
        <DialogTitle>
          {step === "form" ? "Dados para Doação" : "Pagamento PIX"}
        </DialogTitle>
      </DialogHeader>

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
