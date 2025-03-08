import { useLocation } from "wouter";
import { CheckoutForm } from "@/components/checkout-form";
import { PixDisplay } from "@/components/pix-display";
import { useToast } from "@/hooks/use-toast";
import { Heart, Shield, Lock, CheckCircle2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import Facebook from "@/components/Facebook";
import { Checkbox } from "@/components/ui/checkbox";

type CheckoutStep = "form" | "pix";

interface PaymentDetails {
  donationId: number;
  pixCode: string;
  pixQrCode: string;
  expiresAt: string;
}

const formatCurrency = (value: number) => {
  // Valor em reais para exibição
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
  const [turbineChecked, setTurbineChecked] = useState(false);

  // Pegar o valor da URL
  const searchParams = new URLSearchParams(window.location.search);
  const baseAmount = Number(searchParams.get("amount") || 0);

  // Calculate total value with turbine
  const calculateAmount = (base: number, turbine: boolean): number => {
    // Garantir que o valor está com precisão de 2 casas decimais
    return Number((turbine ? base + 14.99 : base).toFixed(2));
  };

  // Recalculate amount when turbineChecked changes - usando useEffect para garantir a atualização correta
  const [amount, setAmount] = useState(calculateAmount(baseAmount, turbineChecked));
  
  // Atualiza o valor quando turbineChecked mudar
  useEffect(() => {
    const newAmount = calculateAmount(baseAmount, turbineChecked);
    console.log("Turbine checked:", turbineChecked, "Base amount:", baseAmount, "New amount:", newAmount);
    setAmount(newAmount);
  }, [turbineChecked, baseAmount]);

  // If no value, redirect to home
  if (baseAmount === 0) {
    navigate("/");
    return null;
  }
  
  // Função para formatar centavos para exibição na tela
  const formatAmountForDisplay = (amountInReais: number) => {
    return formatCurrency(amountInReais);
  };

  // Log quando checkbox muda
  useEffect(() => {
    console.log("===== Estado da Checkbox =====");
    console.log("Checkbox turbine checked:", turbineChecked);
  }, [turbineChecked]);

  // Log quando amount muda
  useEffect(() => {
    console.log("===== Estado do Amount =====");
    console.log("Valor atual:", amount);
    console.log("Valor base:", baseAmount);
    console.log("Turbine ativo:", turbineChecked);
  }, [amount]);

  const handlePaymentCreated = (details: PaymentDetails) => {
    console.log("Pagamento criado com valor:", amount);
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

  // Adicionar logs imediatos para debug
  console.log("====== CHECKOUT RENDER ======");
  console.log("Estado atual do turbineChecked:", turbineChecked);
  console.log("Valor base:", baseAmount);
  console.log("Valor total calculado:", amount);
  console.log("============================");
  
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

      {/* Header com Logo */}
      <header className="border-b bg-white shadow-sm">
        <div className="max-w-md mx-auto p-4">
          <img 
            src="https://www.vaquinhaonline.com.br/wp-content/uploads/2023/12/cropped-logotipo-vakinha-online.png" 
            alt="Vakinha Online" 
            className="h-8"
          />
        </div>
      </header>

      {step === "form" ? (
        <>
          {/* Banner Message */}
          <div className="bg-blue-50 border-y border-blue-100">
            <div className="max-w-3xl mx-auto py-3 px-4 text-center">
              <p className="text-blue-800 font-medium text-sm">
                Você foi um escolhido(a) de Deus para ajudar na missão de cuidar desta Família
              </p>
            </div>
          </div>

          <div className="max-w-md mx-auto bg-white p-4">
            {/* Resumo da Doação */}
            <div className="bg-white rounded-lg shadow-md border border-red-100 p-3">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="relative shrink-0">
                  <img
                    src="https://i.postimg.cc/HLPbwDPf/foto-da-familia.png"
                    alt="Família beneficiária"
                    className="w-full h-48 sm:w-52 sm:h-52 object-cover rounded-lg"
                  />
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full animate-pulse">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-bold text-red-600 text-sm sm:text-base">Sua Doação Salvará Vidas</h2>
                    <Clock className="w-4 h-4 text-yellow-500 shrink-0" />
                  </div>
                  <div className="mt-1 space-y-1.5">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-xl sm:text-2xl font-bold text-green-600 shrink-0">{formatCurrency(amount)}</span>
                      <span className="text-xs sm:text-sm text-gray-500">podem mudar tudo</span>
                    </div>
                    <div className="bg-yellow-50 rounded-md p-2">
                      <p className="text-xs sm:text-sm font-medium text-yellow-800">
                        Família de Francivaldo:
                        <span className="font-normal"> 4 crianças aguardam sua ajuda</span>
                      </p>
                      <p className="text-xs sm:text-sm font-medium text-green-700 mt-1">
                        {amount >= 300 
                          ? "💚 2 semanas de esperança e alimento" 
                          : amount >= 100 
                            ? "💚 7 dias de refeições garantidas"
                            : "💚 Refeições nutritivas para as crianças"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Opção de Turbinar */}
            <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="turbine" 
                  checked={turbineChecked}
                  onCheckedChange={(checked) => {
                    console.log("%c CHECKBOX MUDOU ", "background: #ff0000; color: white; font-size: 20px");
                    console.log("Valor anterior:", turbineChecked);
                    console.log("Novo valor:", checked);
                    console.log("Valor base:", baseAmount);
                    console.log("Valor atual:", amount);
                    
                    // Atualizar o estado
                    setTurbineChecked(checked as boolean);
                  }}
                  className="mt-1"
                />
                <div>
                  <label 
                    htmlFor="turbine" 
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    onClick={() => {
                      console.log("%c LABEL CLICADO ", "background: #00ff00; color: black; font-size: 16px");
                      console.log("Estado atual da checkbox:", turbineChecked);
                    }}
                  >
                    Turbinar doação por +{formatCurrency(14.99)}
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    Esta vaquinha ganha destaque e você ainda ajuda a garantir medicamentos e cuidados de saúde para o Sr. Francivaldo e sua Familia.
                  </p>
                </div>
              </div>
            </div>

            <div className="py-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Shield className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-blue-700">
                      Seus dados estão protegidos com criptografia de ponta a ponta.
                    </p>
                  </div>
                </div>
              </div>
              <CheckoutForm
                amount={amount}
                onSuccess={handlePaymentCreated}
                onError={handleError}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="max-w-md mx-auto bg-white p-4">
          {paymentDetails && (
            <>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-r mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-xs text-yellow-800">
                      O código PIX expira em 10 minutos.
                    </p>
                  </div>
                </div>
              </div>
              <PixDisplay
                donationId={paymentDetails.donationId}
                pixCode={paymentDetails.pixCode}
                pixQrCode={paymentDetails.pixQrCode}
                expiresAt={paymentDetails.expiresAt}
                onSuccess={() => navigate(`/thank-you?amount=${amount}`)}
                onError={handleError}
                amount={amount}
              />
            </>
          )}
        </div>
      )}

      {/* Footer com Selos */}
      <footer className="mt-4 pt-4 border-t">
        <p className="text-center text-xs text-gray-500">
          © 2024 Vakinha Online - CNPJ 22.831.673/0001-26
        </p>
      </footer>
    </div>
  );
}