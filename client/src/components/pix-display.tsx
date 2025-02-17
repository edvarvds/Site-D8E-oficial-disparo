import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { QRCodeSVG } from "qrcode.react";
import { Check, Copy, Timer, Heart, QrCode, Smartphone, ArrowRight } from "lucide-react";
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
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const { data } = useQuery<PaymentStatus>({
    queryKey: [`/api/donations/${donationId}/status`],
    refetchInterval: 5000
  });

  useEffect(() => {
    if (data?.status === "completed") {
      setProgress(100);
      toast({
        title: "Que gesto incrível! 💚",
        description: "Sua doação foi confirmada. Obrigado por ajudar esta família!",
        duration: 5000
      });
      window.location.href = `/thank-you?amount=${amount}`;
      onSuccess();
    } else if (data?.status === "pending") {
      setProgress(25);
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
      setProgress(prev => Math.min(prev + 25, 75));
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
      {/* Progress Steps */}
      <div className="space-y-2">
        <Progress value={progress} className="h-2 w-full" />
        <div className="grid grid-cols-3 gap-1 text-xs text-gray-500">
          <div className={`text-center ${progress >= 25 ? 'text-green-600 font-medium' : ''}`}>
            Código Gerado
          </div>
          <div className={`text-center ${progress >= 75 ? 'text-green-600 font-medium' : ''}`}>
            Código Copiado
          </div>
          <div className={`text-center ${progress === 100 ? 'text-green-600 font-medium' : ''}`}>
            Pagamento Confirmado
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center justify-center gap-2 text-sm font-medium bg-yellow-50 text-yellow-800 px-4 py-2 rounded">
        <Timer className="h-4 w-4" />
        <span>Tempo restante: {timeLeft}</span>
      </div>

      {/* Steps Progress */}
      <div className="space-y-4">
        {/* Step 1 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <QrCode className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">1. Escaneie o QR Code</h3>
              <p className="text-xs text-gray-500 mt-1">
                Abra o app do seu banco e escaneie o código abaixo
              </p>

              {!qrError ? (
                <div className="mt-3 flex justify-center">
                  <QRCodeSVG
                    value={pixCode}
                    size={200}
                    onError={() => setQrError(true)}
                    level="M"
                    className="border-8 border-white shadow-lg rounded-lg"
                  />
                </div>
              ) : (
                <div className="text-sm text-red-500 bg-red-50 p-4 rounded-lg mt-3">
                  Erro ao gerar QR Code. Use o código PIX abaixo.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Smartphone className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">2. Ou copie o código PIX</h3>
              <p className="text-xs text-gray-500 mt-1">
                Cole o código no seu aplicativo bancário
              </p>

              <div className="mt-3 space-y-2">
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
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-start space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <ArrowRight className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">3. Complete a doação</h3>
              <p className="text-xs text-gray-500 mt-1">
                Confirme o pagamento no seu aplicativo bancário
              </p>

              <div className="mt-3 text-center">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Heart className="h-4 w-4 text-red-500" />
                  Aguardando sua confirmação...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500">
        <p>Acompanhando status da sua doação...</p>
        <p className="text-[10px] mt-0.5">Não feche esta janela até a confirmação</p>
      </div>
    </div>
  );
}