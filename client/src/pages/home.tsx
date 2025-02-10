import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { DonationModal } from "@/components/donation-modal";

export default function Home() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDonate = (amount: number) => {
    setSelectedAmount(amount);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center p-4 border-b">
          <div className="flex items-center">
            <img alt="Vakinha Online Logo" className="h-8" src="https://www.vaquinhaonline.com.br/wp-content/uploads/2023/12/cropped-logotipo-vakinha-online.png"/>
          </div>
          <div className="flex items-center">
            <button className="text-gray-600 mr-4">
              <i className="fas fa-search"></i>
            </button>
            <button className="text-gray-600">
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4">
          <h1 className="text-3xl font-bold mb-4 text-red-600 leading-tight">
            URGENTE: Pai Desesperado Luta Contra o Tempo para Alimentar seus Filhos - Sua Ajuda Pode Salvar Vidas Hoje!
          </h1>

          <p className="text-lg text-gray-800 mb-6 font-semibold italic">
            "Eu daria minha vida por eles, mas neste momento, nem isso é suficiente para encher seus estômagos vazios." - Francivaldo, pai de 4 crianças
          </p>

          <div className="relative mb-6">
            <img
              alt="Francivaldo, um pai de aparência cansada e preocupada, abraçando seus quatro filhos pequenos que parecem magros e famintos"
              className="w-full rounded-lg shadow-lg"
              src="https://i.postimg.cc/HLPbwDPf/foto-da-familia.png"
            />
            <button className="absolute top-2 right-2 text-white bg-red-600 rounded-full p-2 transition duration-300 hover:bg-red-700">
              <i className="far fa-heart"></i>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Progresso: <span className="text-green-600">27%</span>
              </span>
              <span className="text-sm font-semibold text-gray-700">
                Meta: <span className="text-green-600">R$ 11.500,00</span>
              </span>
            </div>
            <div className="relative bg-gray-200 h-4 rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-green-600" style={{ width: "27%" }}></div>
              <span className="absolute top-0 left-2 text-xs font-semibold text-white h-full flex items-center">
                R$ 3.105,00
              </span>
            </div>
          </div>

          {/* Donation Buttons */}
          <p className="text-lg mb-4 font-bold text-red-600 text-center">
            Escolha Seu Nível de Impacto - Cada Doação é Um Milagre!
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[30, 40, 50, 70, 100, 150, 200, 300, 500, 750, 950].map((amount) => (
              <button
                key={amount}
                onClick={() => handleDonate(amount)}
                className="bg-green-500 text-white py-3 rounded-lg text-lg font-bold hover:bg-green-600 transition duration-300 transform hover:scale-105 text-center"
              >
                R$ {amount.toFixed(2)}
              </button>
            ))}
          </div>
        </main>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DonationModal 
          amount={selectedAmount || 0}
          onClose={() => setIsModalOpen(false)}
        />
      </Dialog>
    </>
  );
}