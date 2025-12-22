
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const CommandCenter: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Nimbus Roofing AI Executive Dashboard active. I am ready to guide you through the 4-Step MVP Lifecycle: Acquisition, Forensics, Monetization, or Governance. What is the current operational focus?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const newChat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: "You are the Real-Time Decision Engine for Nimbus Roofing AI. Your core function is to guide the user through the 4-Step Business Lifecycle:\n\n1. ACQUISITION: Use 'Market Authority' for SEO and 'Emergency Response' for lead intake.\n2. FORENSICS: Use 'Roof Inspector' for damage assessment and 'Paperwork Scanner' for policy ingestion.\n3. MONETIZATION: Use 'Claims Intelligence' to maximize value and 'ADK Workbench' to execute tasks.\n4. GOVERNANCE: Use 'Security Ops' for protection and 'Command Center' for strategy.\n\nAlways frame your advice within these four steps. Speak with executive authority."
        }
      });
      setChat(newChat);
    } catch (e) {
      setError('Failed to initialize the AI model. Please check your API key.');
      console.error(e);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!userInput.trim() || !chat) return;

    const userMessage: Message = { role: 'user', text: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const result = await chat.sendMessageStream({ message: userInput });

      let modelResponse = '';
      setMessages((prev) => [...prev, { role: 'model', text: '...' }]);

      for await (const chunk of result) {
        modelResponse += chunk.text;
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { ...newMessages[newMessages.length - 1], text: modelResponse };
          return newMessages;
        });
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to get response: ${errorMessage}`);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-[calc(100vh-10rem)] flex flex-col border-indigo-500/30 shadow-indigo-900/20">
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-lg px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-800 border border-gray-700 text-gray-200'}`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-700/50">
        {error && <p className="text-red-400 text-sm mb-2">{error}</p>}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder="Command the OS..."
            className="flex-1 bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} isLoading={isLoading}>
            Execute
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CommandCenter;
