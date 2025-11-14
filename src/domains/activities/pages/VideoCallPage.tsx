import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaChevronLeft, FaPaperPlane } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDetailStore } from "@/store/detail";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'service';
  timestamp: Date;
  senderName?: string;
}

export default function VideoCallPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedPet } = useDetailStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!orderId) {
      navigate("/");
      return;
    }

    // Simular mensajes iniciales para la videollamada
    setMessages([
      {
        id: '1',
        text: 'Iniciando videollamada en vivo. ¡Ya puedes ver a tu mascota!',
        sender: 'service',
        timestamp: new Date(Date.now() - 5 * 60000),
        senderName: 'Equipo SmartPet'
      },
      {
        id: '2',
        text: 'Excelente, ya puedo ver todo',
        sender: 'user',
        timestamp: new Date(Date.now() - 3 * 60000),
      }
    ]);
  }, [orderId, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simular respuesta automática
    setTimeout(() => {
      const autoResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Tu mascota se ve muy bien. El servicio está casi terminado.',
        sender: 'service',
        timestamp: new Date(),
        senderName: 'Equipo SmartPet'
      };
      setMessages(prev => [...prev, autoResponse]);
    }, 2000);
  };

  if (!orderId) {
    navigate("/");
    return null;
  }

  return (
    <div className="w-full h-screen flex flex-col">
      {/* Header */}
      <div className="w-full flex items-center justify-between p-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <FaChevronLeft 
            onClick={() => navigate(`/chat/${orderId}`)} 
            className="cursor-pointer text-lg"
          />
          <Avatar className="size-10">
            <AvatarImage
              src={selectedPet?.photo_url || ""}
              alt={selectedPet?.name || "Mascota"}
            />
            <AvatarFallback>
              {selectedPet?.name?.charAt(0).toUpperCase() || "M"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-bold text-lg">{selectedPet?.name || "Mascota"}</h2>
            <p className="text-sm text-gray-500">Video en vivo</p>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="w-full h-64 bg-black relative">
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📹</span>
            </div>
            <p className="text-lg font-medium">Video en vivo</p>
            <p className="text-sm opacity-80">Servicio de {selectedPet?.name || "tu mascota"}</p>
          </div>
        </div>
        
        {/* Live indicator */}
        <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          EN VIVO
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-900 shadow-sm'
              }`}
            >
              {message.sender === 'service' && message.senderName && (
                <p className="text-xs font-semibold mb-1 text-blue-600">
                  {message.senderName}
                </p>
              )}
              <p className="text-sm">{message.text}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-400'
              }`}>
                {format(message.timestamp, "HH:mm", { locale: es })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input and Buttons */}
      <div className="p-4 border-t bg-white space-y-3">
        <form onSubmit={handleSendMessage}>
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!newMessage.trim()}>
              <FaPaperPlane className="size-4" />
            </Button>
          </div>
        </form>
        
        <Button 
          onClick={() => navigate(`/rating/${orderId}`)}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          Terminar Servicio
        </Button>
      </div>
    </div>
  );
}