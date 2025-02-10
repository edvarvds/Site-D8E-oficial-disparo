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
  amount: number;
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
  onError,
  amount
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
      window.location.href = `/thank-you?amount=${amount}`;
      onSuccess();
    }
  }, [data?.status, onSuccess, toast, amount]);

  useEffect(() => {
    const now = new Date();
    const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);

    const interval = setInterval(() => {
      const currentTime = new Date();
      const diff = tenMinutesFromNow.getTime() - currentTime.getTime();

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
  }, []);

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
    <div className="space-y-4">
      {/* Timer */}
      <div className="flex items-center justify-center gap-2 text-sm font-medium bg-yellow-50 text-yellow-800 px-4 py-2 rounded">
        <Timer className="h-4 w-4" />
        <span>Tempo restante: {timeLeft}</span>
      </div>

      {/* QR Code Section */}
      <div className="bg-gray-50 p-6 rounded-lg flex flex-col items-center">
        <div className="mb-3 text-center">
          <Heart className="h-6 w-6 text-red-500 mb-2 mx-auto" />
          <p className="text-sm text-gray-600">
            Escaneie o QR Code ou use o código PIX abaixo
          </p>
        </div>

        {!qrError ? (
          <QRCodeSVG
            value={pixCode}
            size={200}
            onError={() => setQrError(true)}
            level="M"
            className="border-8 border-white shadow-lg rounded-lg mb-4"
          />
        ) : (
          <div className="text-sm text-red-500 bg-red-50 p-4 rounded-lg">
            Erro ao gerar QR Code. Use o código PIX abaixo.
          </div>
        )}
      </div>

      {/* PIX Code Section */}
      <div className="bg-white border rounded-lg p-4">
        <div className="mb-2">
          <label className="text-sm font-medium text-gray-700">
            Código PIX
          </label>
        </div>
        <div className="space-y-2">
          <Input
            value={pixCode}
            readOnly
            className="font-mono text-sm bg-gray-50 cursor-text"
          />
          <Button
            onClick={handleCopy}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="lg"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-5 w-5 mr-2" />
                Copiar Código PIX
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2 text-sm">Como doar:</h3>
        <ol className="text-sm text-green-700 space-y-2">
          <li className="flex items-start gap-2">
            <span className="font-bold">1.</span>
            <span>Abra o app do seu banco</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">2.</span>
            <span>Escolha a opção "PIX" e selecione "Copia e Cola"</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold">3.</span>
            <span>Cole o código PIX que você copiou e confirme a doação</span>
          </li>
        </ol>
      </div>

      <div className="text-center text-xs text-gray-500">
        <p>Acompanhando status da sua doação...</p>
        <p className="text-[10px] mt-0.5">Não feche esta janela até a confirmação</p>
      </div>
    </div>
  );
}