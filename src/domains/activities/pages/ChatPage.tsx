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

export default function ChatPage() {
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

    // Simular algunos mensajes iniciales
    setMessages([
      {
        id: '1',
        text: '¡Hola! Estamos en camino para atender a tu mascota.',
        sender: 'service',
        timestamp: new Date(Date.now() - 10 * 60000), // 10 minutos atrás
        senderName: 'Equipo SmartPet'
      },
      {
        id: '2',
        text: 'Perfecto, estaré esperando',
        sender: 'user',
        timestamp: new Date(Date.now() - 8 * 60000), // 8 minutos atrás
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
        text: 'Gracias por tu mensaje. Te mantendremos informado del progreso del servicio.',
        sender: 'service',
        timestamp: new Date(),
        senderName: 'Equipo SmartPet'
      };
      setMessages(prev => [...prev, autoResponse]);

      // Después de 3 segundos, enviar el botón de videollamada
      setTimeout(() => {
        const videoCallMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: 'El servicio ha comenzado. ¡Puedes ver a tu mascota en tiempo real!',
          sender: 'service',
          timestamp: new Date(),
          senderName: 'Equipo SmartPet'
        };
        setMessages(prev => [...prev, videoCallMessage]);
      }, 3000);
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
            onClick={() => navigate(`/activities/${orderId}`)} 
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
            <p className="text-sm text-gray-500">Servicio</p>
          </div>
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
              
              {/* Mostrar botón si es el mensaje de videollamada */}
              {message.text.includes('ver a tu mascota en tiempo real') && (
                <Button 
                  onClick={() => navigate(`/video/${orderId}`)}
                  className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  📹 Iniciar Video en Vivo
                </Button>
              )}
              
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

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
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
    </div>
  );
}