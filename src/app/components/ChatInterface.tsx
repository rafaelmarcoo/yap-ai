"use client";
import { useState } from 'react';

const ChatInterface = () => {
   const [message, setMessage] = useState('');

   const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Handle message submission here
      setMessage('');
   };

   return (
      <div className="flex flex-col w-full h-screen max-w-4xl mx-auto bg-gray-900 text-white">
         {/* Messages container */}
         <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Messages will be rendered here */}
         </div>

         {/* Input area */}
         <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4">
            <div className="flex gap-2">
               <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
               />
               <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6 py-2 transition-colors"
               >
                  Send
               </button>
            </div>
         </form>
      </div>
   );
};

export default ChatInterface;