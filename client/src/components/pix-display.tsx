import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PixDisplayProps {
  donationId: number;
  pixCode: string;
  pixQrCode: string;
  expiresAt: string;
  onSuccess: () => void;
  onError: (message: string) => void;
}

interface PaymentStatus {
  status: string;
}

export function PixDisplay({
  donationId,
  pixCode,
  pixQrCode,
  expiresAt,
  onSuccess,
  onError
}: PixDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [qrError, setQrError] = useState(false);
  const { toast } = useToast();

  const { data } = useQuery<PaymentStatus>({
    queryKey: [`/api/donations/${donationId}/status`],
    refetchInterval: 5000
  });

  useEffect(() => {
    if (data?.status === "completed") {
      toast({
        title: "Pagamento confirmado!",
        description: "Obrigado pela sua doação.",
        duration: 5000
      });
      onSuccess();
    }
  }, [data?.status, onSuccess, toast]);

  useEffect(() => {
    const expiry = new Date(expiresAt);
    const interval = setInterval(() => {
      const now = new Date();
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Expirado");
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(diff / 1000 / 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      onError("Falha ao copiar código PIX");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
          <Timer className="h-4 w-4" />
          <span>Expira em: {timeLeft}</span>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg flex justify-center mb-4">
          {!qrError ? (
            <QRCodeSVG 
              value={pixCode} 
              size={200}
              onError={() => setQrError(true)}
              level="M"
            />
          ) : (
            <div className="text-sm text-red-500">
              Erro ao gerar QR Code. Use o código PIX abaixo.
            </div>
          )}
        </div>

        <div className="relative">
          <Input
            value={pixCode}
            readOnly
            className="pr-20 font-mono text-sm"
          />
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-1 top-1"
            onClick={handleCopy}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="text-sm text-gray-500 text-center">
        <p>1. Abra o app do seu banco</p>
        <p>2. Escaneie o QR Code ou copie o código PIX</p>
        <p>3. Confirme o pagamento</p>
      </div>
    </div>
  );
}