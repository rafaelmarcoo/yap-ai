"use client";
import { useState } from 'react';

interface Message {
   role: 'user' | 'assistant';
   content: string;
}

const ChatInterface = () => {
   const [message, setMessage] = useState('');
   const [messages, setMessages] = useState<Message[]>([]);
   const [isLoading, setIsLoading] = useState(false);

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
         const response = await fetch('api/openai', {
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
      <div className="flex flex-col w-full h-screen max-w-2xl mx-auto bg-neutral-900/50 rounded-lg text-white">
         <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
               <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
               >
                  <div
                     className={`max-w-[80%] rounded-lg p-3 ${msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-white'
                     }`}
                  >
                     {msg.content}
                  </div>
               </div>
            ))}
            {isLoading && (
               <div className='flex justify-start'>
                  <div className='bg-gray-800 text-white rounded-lg p-3'>
                     Thinking...
                  </div>
               </div>
            )}
         </div> 
         <form
            onSubmit={handleSubmit}
            className='border-t border-neutral-700 p-4'
         >
            <div className='flex gap-2'>
               <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className='flex-1 bg-neutral-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
                  disabled={isLoading}
               />
               <button
                  type="submit"
                  className='bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 transition-colors'
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