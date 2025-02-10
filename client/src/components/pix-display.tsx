import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, Timer, Heart } from "lucide-react";
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
        title: "Que gesto incrível! 💚",
        description: "Sua doação foi confirmada. Obrigado por ajudar esta família!",
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
      toast({
        title: "Código PIX copiado!",
        description: "Cole o código no seu aplicativo do banco para fazer a doação.",
      });
    } catch (err) {
      onError("Não foi possível copiar o código PIX. Por favor, tente copiar manualmente.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-medium bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg mb-4">
          <Timer className="h-4 w-4" />
          <span>Tempo restante para doar: {timeLeft}</span>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center mb-4">
          <div className="mb-4">
            <Heart className="h-6 w-6 text-red-500 mb-2" />
            <p className="text-sm text-gray-600 mb-4">
              Escaneie o QR Code ou copie o código PIX
            </p>
          </div>

          {!qrError ? (
            <QRCodeSVG 
              value={pixCode} 
              size={200}
              onError={() => setQrError(true)}
              level="M"
              className="border-8 border-white shadow-lg rounded-lg"
            />
          ) : (
            <div className="text-sm text-red-500 bg-red-50 p-4 rounded-lg">
              Erro ao gerar QR Code. Use o código PIX abaixo.
            </div>
          )}
        </div>

        <div className="relative">
          <Input
            value={pixCode}
            readOnly
            className="pr-20 font-mono text-sm bg-gray-50"
          />
          <Button
            size="sm"
            variant="ghost"
            className="absolute right-1 top-1 hover:bg-green-50"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4 text-gray-600" />
            )}
          </Button>
        </div>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">Como doar:</h3>
        <ol className="text-sm text-green-700 space-y-2">
          <li className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            <span>Abra o app do seu banco</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            <span>Escaneie o QR Code ou copie o código PIX</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            <span>Confirme os dados e finalize a doação</span>
          </li>
        </ol>
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>Acompanhando automaticamente o status da sua doação...</p>
        <p className="text-xs mt-1">Não feche esta janela até a confirmação</p>
      </div>
    </div>
  );
}