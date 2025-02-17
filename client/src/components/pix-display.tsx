import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, Timer, Heart, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

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
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-green-600">Pix Gerado</span>
          <span className="text-gray-400">→</span>
          <span className={data?.status === "completed" ? "font-medium text-green-600" : "text-gray-500"}>
            Confirmação
          </span>
        </div>
        <Progress value={data?.status === "completed" ? 100 : 50} className="h-2" />
      </div>

      {/* Timer com estilo melhorado */}
      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Tempo para completar</span>
          </div>
          <span className="text-lg font-bold text-yellow-800">{timeLeft}</span>
        </div>
      </div>

      {/* QR Code Section com design melhorado */}
      <div className="bg-white border rounded-lg p-6">
        <div className="text-center space-y-3 mb-6">
          <Heart className="h-8 w-8 text-red-500 mx-auto animate-pulse" />
          <div>
            <h3 className="font-semibold text-gray-900">Faça sua doação via PIX</h3>
            <p className="text-sm text-gray-600 mt-1">
              Escaneie o QR Code ou use o código PIX
            </p>
          </div>
        </div>

        {!qrError ? (
          <div className="flex justify-center mb-6">
            <div className="bg-white p-3 rounded-xl shadow-lg">
              <QRCodeSVG
                value={pixCode}
                size={200}
                onError={() => setQrError(true)}
                level="M"
                className="rounded-lg"
              />
            </div>
          </div>
        ) : (
          <div className="text-sm text-red-500 bg-red-50 p-4 rounded-lg mb-6">
            Erro ao gerar QR Code. Use o código PIX abaixo.
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Código PIX
            </label>
            <div className="relative">
              <Input
                value={pixCode}
                readOnly
                className="font-mono text-sm bg-gray-50 pr-24"
              />
              <Button
                onClick={handleCopy}
                className="absolute right-1 top-1 bottom-1 bg-green-600 hover:bg-green-700 text-white px-3"
                size="sm"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções com design melhorado */}
      <div className="bg-green-50 rounded-lg p-6">
        <h3 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Como completar sua doação
        </h3>
        <ol className="space-y-4">
          {[
            "Abra o app do seu banco",
            "Escolha a opção PIX",
            "Selecione Copia e Cola ou QR Code",
            "Cole o código ou escaneie o QR Code"
          ].map((step, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 text-green-800 font-semibold flex items-center justify-center text-sm">
                {index + 1}
              </span>
              <span className="text-green-800">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="text-center space-y-1 pt-4">
        <p className="text-sm font-medium text-gray-700">
          Acompanhando status da sua doação...
        </p>
        <p className="text-xs text-gray-500">
          Não feche esta janela até a confirmação
        </p>
      </div>
    </div>
  );
}