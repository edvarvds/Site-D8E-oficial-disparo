import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Clock, ShieldAlert } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLocation } from "wouter";

export function FixedDonationButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_, navigate] = useLocation();

  const amounts = [30, 40, 50, 70, 100, 150, 200, 300, 500, 750, 950];

  const handleDonationAmount = (amount: number) => {
    navigate(`/checkout?amount=${amount}`);
    setIsModalOpen(false);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).replace('R$', 'R$ ');
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-50">
        <div className="max-w-md mx-auto">
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-6"
          >
            <Heart className="w-5 h-5 mr-2 animate-pulse" />
            Doar agora
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-white rounded-lg max-w-2xl w-full p-6">
          {/* Header com mensagem de urgência */}
          <div className="text-center space-y-3 mb-4">
            <div className="flex justify-center">
              <Heart className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold text-red-600">
              Ajuda Urgente para Família em Necessidade
            </h3>
          </div>

          {/* Informação de urgência mais compacta */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-red-50 p-2 rounded-lg border border-red-100">
              <div className="flex items-center gap-2 text-red-700">
                <Clock className="h-4 w-4" />
                <p className="text-xs font-medium">Situação Crítica</p>
              </div>
            </div>
            <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-100">
              <div className="flex items-center gap-2 text-yellow-700">
                <ShieldAlert className="h-4 w-4" />
                <p className="text-xs font-medium">4 crianças precisam de ajuda</p>
              </div>
            </div>
          </div>

          {/* Grid de valores de doação */}
          <div className="grid grid-cols-3 gap-2">
            {amounts.map((amount) => (
              <Button
                key={amount}
                onClick={() => handleDonationAmount(amount)}
                className={`
                  ${amount === 100 
                    ? 'bg-green-600 hover:bg-green-700 relative' 
                    : 'bg-green-500 hover:bg-green-600'} 
                  text-white py-3 rounded-lg font-bold transition duration-300 transform hover:scale-105 flex flex-col h-auto
                `}
              >
                {amount === 100 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-800 text-[10px] px-2 py-0.5 rounded-full font-medium">
                    Mais usado
                  </span>
                )}
                <span className="text-lg">{formatCurrency(amount)}</span>
                <span className="text-[10px] mt-0.5 font-normal opacity-90">
                  {amount >= 300 
                    ? "2 semanas de refeições"
                    : amount >= 100 
                      ? "1 semana de refeições"
                      : "Refeições nutritivas"}
                </span>
              </Button>
            ))}
          </div>

          {/* Mensagem de incentivo */}
          <p className="text-center text-xs text-gray-600 mt-4">
            Sua doação trará esperança para uma família em necessidade.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}