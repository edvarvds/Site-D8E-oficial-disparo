import { useLocation } from "wouter";
import { Share2, Heart, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function ThankYou() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const donationAmount = Number(searchParams.get("amount") || 0);

  // Valores fixos da campanha (podem ser dinâmicos via API no futuro)
  const previousTotal = 3105;
  const goal = 11500;
  const newTotal = previousTotal + donationAmount;
  const percentageComplete = Math.min((newTotal / goal) * 100, 100);

  const handleShare = () => {
    const message = encodeURIComponent(
      "Acabei de ajudar uma família que precisa muito de apoio. Cada centavo faz diferença nessa corrente do bem. Doe também: "
    );
    const url = encodeURIComponent(window.location.origin);
    window.open(`https://wa.me/?text=${message}${url}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen p-6">
        {/* Header com ícone de coração */}
        <div className="text-center mb-8">
          <div className="inline-block p-3 bg-red-100 rounded-full mb-4">
            <Heart className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Que Gesto Incrível! 💚
          </h1>
          <p className="text-gray-600">
            Sua doação de R$ {donationAmount.toFixed(2)} já está fazendo a diferença
          </p>
        </div>

        {/* Barra de Progresso */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso da campanha</span>
            <span>Meta: R$ {goal.toLocaleString('pt-BR')}</span>
          </div>
          <Progress value={percentageComplete} className="h-4 mb-2" />
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium text-gray-900">
              R$ {newTotal.toLocaleString('pt-BR')}
            </div>
            <div className="text-sm font-medium text-green-600">
              {percentageComplete.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Cards de Impacto */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-green-50 p-4 rounded-lg">
            <Calendar className="h-5 w-5 text-green-600 mb-2" />
            <h3 className="font-semibold text-green-800 text-sm mb-1">
              Tempo de Ajuda
            </h3>
            <p className="text-green-700 text-xs">
              {donationAmount >= 300 
                ? "2 semanas de alimentação" 
                : donationAmount >= 100 
                  ? "1 semana de refeições" 
                  : "Dias de refeições nutritivas"}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <Package className="h-5 w-5 text-blue-600 mb-2" />
            <h3 className="font-semibold text-blue-800 text-sm mb-1">
              Sua Doação Fornece
            </h3>
            <p className="text-blue-700 text-xs">
              Alimentos básicos e nutritivos para toda a família
            </p>
          </div>
        </div>

        {/* Chamada para Ação */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">
            A luta continua! 🙏
          </h3>
          <p className="text-sm text-yellow-700 mb-4">
            Sua ajuda foi fundamental, mas ainda precisamos alcançar mais pessoas.
            Compartilhe essa causa e multiplique o bem!
          </p>
          <Button
            onClick={handleShare}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar no WhatsApp
          </Button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-500 mt-8">
          100% do valor será destinado para alimentação da família.
          Sua doação faz a diferença!
        </p>
      </div>
    </div>
  );
}