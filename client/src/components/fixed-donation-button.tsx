import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DonationModal } from "./donation-modal";
import { Heart } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";

export function FixedDonationButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);

  const amounts = [30, 50, 100, 200, 300, 500];

  const openDonationModal = (amount: number) => {
    setSelectedAmount(amount);
    setIsModalOpen(true);
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
        {selectedAmount > 0 ? (
          <DonationModal amount={selectedAmount} onClose={() => setIsModalOpen(false)} />
        ) : (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6">
              <div className="text-center">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-4 animate-pulse" />
                <h3 className="text-lg font-semibold mb-2">
                  Escolha o Valor da Sua Doação
                </h3>
                <p className="text-sm text-gray-600">
                  Sua generosidade alimentará famílias necessitadas
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {amounts.map((amount) => (
                  <Button
                    key={amount}
                    onClick={() => openDonationModal(amount)}
                    variant="outline"
                    className="p-4 h-auto flex flex-col hover:bg-green-50 hover:border-green-500 transition-colors"
                  >
                    <span className="text-lg font-semibold text-green-600">
                      R$ {amount}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      {amount >= 300 
                        ? "2 semanas de refeições"
                        : amount >= 100 
                          ? "1 semana de refeições"
                          : "Refeições nutritivas"}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
