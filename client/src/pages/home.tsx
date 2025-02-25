import { useState } from "react";
import { useLocation } from "wouter";
import { Dialog } from "@/components/ui/dialog";
import { DonationModal } from "@/components/donation-modal";
import { FixedDonationButton } from "@/components/fixed-donation-button";
import { Play } from "lucide-react";
import { useRef, useEffect } from "react";

export default function Home() {
  const [_, navigate] = useLocation();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleDonate = (amount: number) => {
    navigate(`/checkout?amount=${amount}`);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).replace('R$', 'R$ ');
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log("Auto-play was prevented:", error);
      });
    }

    // Esconde os controles após 3 segundos do início
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleVideoClick = () => {
    setShowControls(true);
    // Esconde os controles após 3 segundos
    setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.play(); // Reinicia o vídeo automaticamente
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header com Logo */}
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

          {/* Video Container com Botão Play */}
          <div 
            className="relative mb-6 group cursor-pointer" 
            onClick={() => {
              togglePlay();
              handleVideoClick();
            }}
          >
            <video
              ref={videoRef}
              className="w-full rounded-lg shadow-lg"
              playsInline
              controls={showControls}
              muted={false}
              loop
              onEnded={handleVideoEnded}
            >
              <source src="/Video Do3 02.mp4" type="video/mp4" />
              <source src="/Video Do3 02.mp4?quality=720p" type="video/mp4" />
              <source src="/Video Do3 02.mp4?quality=480p" type="video/mp4" />
              <source src="/Video Do3 02.mp4?quality=360p" type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>

            {/* Botão de Play Semitransparente */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                bg-black/30 hover:bg-black/50 text-white rounded-full p-6
                transition-all duration-300 
                ${isPlaying && !showControls ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
            >
              <Play className="w-12 h-12" />
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            A Realidade Cruel de Uma Família à Beira do Colapso
          </h2>
          <p className="text-gray-700 mb-6">
            Imagine o som devastador do choro de uma criança faminta ecoando em uma casa vazia. Para Francivaldo, este não é um pesadelo - é sua realidade diária. Com quatro filhos pequenos e nenhuma renda, ele enfrenta o desafio mais doloroso que um pai pode enfrentar: ver seus filhos definharem de fome diante de seus olhos.
          </p>

          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
            <p className="text-sm text-yellow-700">
              <strong>A situação é crítica:</strong><br/>
              • A geladeira está vazia há semanas<br/>
              • As crianças não têm uma refeição completa há dias<br/>
              • Francivaldo sacrifica suas próprias refeições, mas não é suficiente
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-4 text-green-600">
            Você Pode Ser o Herói Que Esta Família Precisa!
          </h2>
          <p className="text-gray-700 mb-6">
            Sua doação não é apenas dinheiro - é esperança, é vida, é um futuro para estas crianças inocentes. Cada centavo conta nesta batalha contra a fome:
          </p>
          <ul className="list-disc list-inside text-gray-700 mb-6">
            <li>R$30 = Alimentos nutritivos para 1 dia</li>
            <li>R$100 = Uma semana de refeições balanceadas</li>
            <li>R$300 = Garantia de alimentação por 2 semanas</li>
          </ul>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Progresso: <span className="text-green-600">27%</span>
              </span>
              <span className="text-sm font-semibold text-gray-700">
                Meta: <span className="text-green-600">{formatCurrency(11500)}</span>
              </span>
            </div>
            <div className="relative bg-gray-200 h-4 rounded-full overflow-hidden">
              <div className="absolute top-0 left-0 h-full bg-green-600" style={{ width: "27%" }}></div>
              <span className="absolute top-0 left-2 text-xs font-semibold text-white h-full flex items-center">
                {formatCurrency(3105)}
              </span>
            </div>
          </div>

          <p className="text-lg mb-4 font-bold text-red-600 text-center">
            Escolha Seu Nível de Impacto - Cada Doação é Um Milagre!
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {[30, 40, 50, 70, 100, 150, 200, 300, 500, 750, 950].map((amount) => (
              <button
                key={amount}
                onClick={() => handleDonate(amount)}
                className={`bg-green-500 text-white py-3 rounded-lg text-lg font-bold hover:bg-green-600 transition duration-300 transform hover:scale-105 text-center ${
                  amount === 950 ? 'col-span-2' : ''
                }`}
              >
                {formatCurrency(amount)}
              </button>
            ))}
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mb-6">
            <p className="text-gray-700 italic mb-2">
              "Nunca pensei que chegaria a este ponto. Ver meus filhos dormirem com fome parte meu coração em mil pedaços. Sua ajuda não é apenas comida, é esperança para continuarmos lutando."
            </p>
            <p className="text-right text-gray-600 font-bold">
              - Francivaldo, pai lutador
            </p>
          </div>

          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Junte-se a Centenas de Heróis Anônimos
          </h2>
          <p className="text-gray-700 mb-6">
            Mais de 150 pessoas já se uniram a esta causa. Cada doação, não importa o tamanho, está fazendo a diferença. Seja parte desta onda de solidariedade e ajude a escrever um final feliz para a história desta familia.
          </p>

          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Mensagens de Apoio (4 recentes)
            </h2>
            <div className="space-y-4">
              {[
                {
                  name: "Pedro Santos",
                  avatar: "https://engenharia360.com/wp-content/uploads/2019/05/esta-pessoa-nao-existe-engenharia360-4.png.webp",
                  message: "Ninguém deveria passar fome. Estou doando o que posso para ajudar Francivaldo e seus filhos. Que Deus abençoe esta família!",
                  time: "2 min atrás"
                },
                {
                  name: "Patricia Garcia",
                  avatar: "https://newr7-r7-prod.web.arc-cdn.net/resizer/v2/ULBLSUYTUBJKJDD6LWYKCLLJAI.jpg?auth=6a31d59dc3e4b40f45d3da37623eefe4f5e811f94132e9fa5a106965cb2bae59&width=1024&height=1024",
                  message: "Isso parte meu coração. Francivaldo é um homem de valor. Doei e compartilhei. Vamos ajudar esta família! Juntos somos mais fortes.",
                  time: "15 min atrás"
                },
                {
                  name: "Ana Beatriz",
                  avatar: "https://newr7-r7-prod.web.arc-cdn.net/resizer/v2/ZVZDZNC3OZO53LGDQ5PGI537UA.jpg?auth=7dd70ca49702d2c1c667781a8635d728994029ccdf29fb263b50d86d504f0c60&width=1024&height=1024",
                  message: "Que Deus abençoe Francivaldo e seus filhos. Acabei de fazer minha doação. Juntos podemos fazer a diferença! Não podemos ficar indiferentes a esta situação.",
                  time: "30 min atrás"
                },
                {
                  name: "Benedita Oliveira",
                  avatar: "https://newr7-r7-prod.web.arc-cdn.net/resizer/v2/3PEEVMRB75K53F3ADUTK25NDLA.jpg?auth=78d9120a6ae79cc9562dea70f18fb60dc1be47c75806f01abfcb20c105ea9477&width=1024&height=1024",
                  message: "É triste ver uma situação assim. Doei e espero que mais pessoas ajudem. Força, Francivaldo! Não desista, estamos com você nesta luta.",
                  time: "45 min atrás"
                }
              ].map((comment, index) => (
                <div key={index} className="flex items-start space-x-3 bg-gray-50 p-4 rounded-lg">
                  <img 
                    src={comment.avatar} 
                    alt={`Profile picture of ${comment.name}`} 
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-bold text-blue-600">{comment.name}</p>
                    <p className="text-gray-700 mt-1">{comment.message}</p>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <button className="mr-4 hover:text-blue-600">Responder</button>
                      <button className="mr-4 hover:text-red-600">
                        <i className="far fa-heart mr-1"></i>Curtir
                      </button>
                      <span>{comment.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600 mt-6 font-semibold">
              Faça login para deixar uma mensagem de apoio e se juntar a esta corrente do bem.
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white p-6">
          <div className="mb-6">
            <img src="https://i.postimg.cc/TP138NvP/Design-sem-nome-3.png" alt="Vakinha Online Logo" className="h-8" />
          </div>
          <div className="mb-6">
            <h3 className="text-green-500 mb-2 font-bold">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              {[
                "Quem somos", "Vaquinhas", "Criar vaquinhas", "Login",
                "Vaquinhas mais amadas", "Política de privacidade", "Termos de uso",
                "Dúvidas frequentes", "Taxas e prazos", "Fale conosco",
                "Loja da Vakinha", "Vakinha Premiada", "Blog da Vakinha"
              ].map((link, index) => (
                <li key={index}>
                  <a href="#" className="hover:text-green-400">{link}</a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6">
            <h3 className="text-green-500 mb-2 font-bold">Fale conosco</h3>
            <p className="text-sm">51 3000-0099</p>
            <p className="text-sm">De Segunda - Sexta</p>
            <p className="text-sm">Das 9h30 às 17h</p>
          </div>
          <div>
            <h3 className="text-green-500 mb-2 font-bold">Baixe nosso App</h3>
            <div className="space-y-2">
              <a href="#" className="flex items-center bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300">
                <i className="fab fa-google-play mr-2"></i>Google Play
              </a>
              <a href="#" className="flex items-center bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300">
                <i className="fab fa-apple mr-2"></i>App Store
              </a>
            </div>
          </div>
          <div className="mt-8 text-sm text-gray-400 border-t border-gray-700 pt-6">
            © 2024 Vakinha Online - Todos direitos reservados
          </div>
        </footer>
      </div>
      <FixedDonationButton />
    </>
  );
}