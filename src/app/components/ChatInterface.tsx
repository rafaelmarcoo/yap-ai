"use client";
import { useState, useRef, useEffect } from 'react';

interface Message {
   role: 'user' | 'assistant';
   content: string;
}

const ChatInterface = () => {
   const [message, setMessage] = useState('');
   const [messages, setMessages] = useState<Message[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const messagesEndRef = useRef<HTMLDivElement>(null);

   const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth'});
   };

   useEffect(() => {
      scrollToBottom();
   }, [messages]);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if(!message.trim() || isLoading) return;

      const userMessage : Message = {
         role: 'user',
         content: message.trim(),
      };

      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      setIsLoading(true);

      try {
         // To change to claude: change api route to 'api/claude'
         // To change to openai: change api route to 'api/openai'
         const response = await fetch('api/claude', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ messages: [...messages, userMessage]})
         })

         if(!response.ok) {
            throw new Error('Failed to fetch response');
         }

         const data = await response.json();
         const assistantMessage : Message = {
            role: 'assistant',
            content: data.message,
         };

         setMessages(prev => [...prev, assistantMessage]);
      } catch (error) {
         console.error('Error:', error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="flex flex-col w-full h-screen max-w-2xl mx-auto bg-gradient-to-b from-neutral-900 to-neutral-950 shadow-2xl text-white">

         <div className="p-4 border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
            <h1 className="text-xl font-semibold text-center text-blue-400">Yap AI</h1>
         </div>
         
         <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
            {messages.map((msg, index) => (
               <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
               >
                  <div
                     className={`max-w-[80%] rounded-2xl p-4 shadow-lg ${msg.role === 'user'
                        ? 'bg-blue-600 text-white ml-12'
                        : 'bg-neutral-800/80 backdrop-blur-sm text-gray-100 mr-12'
                     }`}
                  >
                     <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
               </div>
            ))}
            {isLoading && (
               <div className='flex justify-start'>
                  <div className='bg-neutral-800/80 backdrop-blur-sm text-gray-300 rounded-2xl p-4 flex items-center space-x-2'>
                     <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                     </div>
                     <span className="text-sm">Thinking</span>
                  </div>
               </div>
            )}
            <div ref={messagesEndRef} />
         </div>
         
         <form
            onSubmit={handleSubmit}
            className='border-t border-neutral-800 bg-neutral-900/50 backdrop-blur-sm p-4'
         >
            <div className='flex gap-3 max-w-4xl mx-auto'>
               <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className='flex-1 bg-neutral-800/50 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder-gray-400 transition-all duration-200'
                  disabled={isLoading}
               />
               <button
                  type="submit"
                  className='bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 disabled:hover:bg-blue-600 disabled:hover:shadow-none'
                  disabled={isLoading}
               >
                  Send
               </button>
            </div>
         </form>
      </div>
   );
};

export default ChatInterface;