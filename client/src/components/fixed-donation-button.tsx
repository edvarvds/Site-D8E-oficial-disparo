import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Clock, ShieldAlert } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useLocation } from "wouter";

export function FixedDonationButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [_, navigate] = useLocation();

  const amounts = [30, 50, 100, 200, 300, 500];

  const handleDonationAmount = (amount: number) => {
    navigate(`/checkout?amount=${amount}`);
    setIsModalOpen(false);
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
          <div className="text-center space-y-4 mb-6">
            <div className="flex justify-center">
              <Heart className="w-10 h-10 text-red-500 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-red-600 leading-tight">
              URGENTE: Sua Ajuda é Necessária Agora!
            </h3>
            <p className="text-gray-700 text-sm max-w-md mx-auto">
              A fome não espera. Neste momento, crianças estão indo dormir com fome.
              Sua doação hoje pode mudar o destino desta família imediatamente.
            </p>
          </div>

          {/* Alertas de urgência */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-red-50 p-3 rounded-lg border border-red-100">
              <div className="flex items-center gap-2 text-red-700">
                <Clock className="h-5 w-5" />
                <p className="text-sm font-medium">Situação Crítica</p>
              </div>
              <p className="text-xs text-red-600 mt-1">
                A geladeira está vazia há semanas
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              <div className="flex items-center gap-2 text-yellow-700">
                <ShieldAlert className="h-5 w-5" />
                <p className="text-sm font-medium">Ação Imediata</p>
              </div>
              <p className="text-xs text-yellow-600 mt-1">
                4 crianças precisam de alimentos
              </p>
            </div>
          </div>

          {/* Grid de valores de doação */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {amounts.map((amount) => (
              <Button
                key={amount}
                onClick={() => handleDonationAmount(amount)}
                className="bg-green-500 text-white py-4 rounded-lg text-lg font-bold hover:bg-green-600 transition duration-300 transform hover:scale-105 flex flex-col h-auto"
              >
                <span className="text-xl">R$ {amount}</span>
                <span className="text-xs mt-1 font-normal">
                  {amount >= 300 
                    ? "2 semanas de refeições"
                    : amount >= 100 
                      ? "1 semana de refeições"
                      : "Refeições nutritivas"}
                </span>
              </Button>
            ))}
          </div>

          {/* Mensagem motivacional */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 italic">
              "Cada minuto de espera é um momento de fome para estas crianças.
              Sua doação agora é a esperança que eles precisam."
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}