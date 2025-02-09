import { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, Settings, ChevronDown, Mic } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      content: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [font, setFont] = useState('sans-serif');
  const [recognitionActive, setRecognitionActive] = useState(false);
  const scrollAreaRef = useRef(null);
  
  const  mockBotResponses = [
    "Sure! Turning on the living room lights now. Let me know if you need any other adjustments!",
    "I've set the thermostat to 22°C. Feeling cozy yet?",
    "The front door is already locked. Stay secure! Need me to double-check anything else?",
    "Your garage door is closed. Let me know if you want to open it—just say the word!",
    "The bedroom fan is now on at speed 3. Hope that keeps you nice and cool!",
    "I've scheduled the garden sprinkler for 6:00 AM. Your plants will thank you!",
    "You can control lights, thermostat, security, and more. What would you like to do today?",
    "I'm here to help! Try saying 'Turn off the lights' or 'Set the temperature to 24°C'. Whatever you need!",
    "It looks like the porch light is off. Would you like me to turn it on? Just a tap away!",
    "The music is playing in the kitchen at volume 50. Need adjustments? Want me to pick a new playlist?",
    "Motion detected at the front door. Do you want me to turn on the porch light, or should I check the security feed?",
    "Your morning routine is scheduled at 7:00 AM. Let me know if you want to change it or add anything else—maybe some coffee brewing?",
    "Oops! It looks like I didn't quite catch that. Could you try again?",
    "Got it! Making those changes now. Anything else on your mind?",
    "You're all set! Let me know if you need anything else.",
    "Hey there! What can I help you with today?",
    "I’m always here to assist. Just let me know what you need!"
];


  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const generateResponse = async () => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const randomResponse = mockBotResponses[Math.floor(Math.random() * mockBotResponses.length)];
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content: randomResponse,
      sender: 'bot',
      timestamp: new Date(),
    }]);
    setIsTyping(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    await generateResponse();
  };

  const startVoiceRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    setRecognitionActive(true);

    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
    };

    recognition.onend = () => {
      setRecognitionActive(false);
    };
  };

  return (
    <div className={`min-h-screen p-6 flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`} style={{ fontFamily: font }}>
      <div className="w-full max-w-2xl">
        <Card className="h-[80vh] flex flex-col shadow-lg rounded-lg overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between bg-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">AI Assistant</h2>
                <Badge variant="secondatry" className="bg-green-500/20 text-green-400">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Online
                </Badge>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5 text-white" />
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFont(font === 'sans-serif' ? 'serif' : 'sans-serif')}>Change Font</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDarkMode(!darkMode)}>Toggle Dark Mode</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={cn("flex gap-3 max-w-[75%]", message.sender === 'user' ? "ml-auto flex-row-reverse" : "")}>
                  <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", message.sender === 'user' ? "bg-blue-500" : "bg-gray-700")}>
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-indigo-400" />
                    )}
                  </div>
                  <div>
                    <div className={cn("rounded-lg p-3 text-sm", message.sender === 'user' ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300")}>{message.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <form onSubmit={handleSubmit} className="p-4 border-t flex gap-2">
            <Button type="button" onClick={startVoiceRecognition} disabled={recognitionActive}>
              <Mic className="h-5 w-5" />
            </Button>
            <Input placeholder="Type your message..." value={input} onChange={(e) => setInput(e.target.value)} className="flex-1" />
            <Button type="submit" disabled={!input.trim() || isTyping}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Chatbot;
