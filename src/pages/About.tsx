
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center pt-8 px-4">
      <header className="w-full max-w-3xl flex justify-between items-center mb-8 px-4">
        <Button variant="ghost" onClick={() => navigate('/')} className="text-white">
          <ArrowLeft className="mr-2" /> Back to Game
        </Button>
        
        <h1 className="text-2xl font-bold text-game-token">About <span className="text-white">SKS</span></h1>
      </header>
      
      <main className="w-full max-w-3xl mx-auto bg-gray-900 rounded-lg p-6 mb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-game-token">SKS - Connecting People</h2>
          <p className="text-lg text-gray-300">The crypto behind the Snake Arcade game</p>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">About SKS Token</h3>
          <p className="mb-4">
            SKS (Snake Krypto System) is a token designed to reward gamers for their time and skill.
            By playing our Snake Arcade game and watching ads, you can earn SKS tokens that have real value 
            in the crypto ecosystem.
          </p>
          <p>
            Built on the Polygon Network, SKS offers fast transactions with minimal fees, making it perfect
            for microtransactions in gaming environments.
          </p>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">How to Earn SKS</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Play Snake Arcade and achieve high scores</li>
            <li>Watch ads after completing games</li>
            <li>Participate in weekly tournaments</li>
            <li>Refer friends to join the platform</li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-3 border-b border-gray-700 pb-2">Connect With Us</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <a 
              href="https://twitter.com/snakekrypto" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 mb-2">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
              <span>Twitter</span>
            </a>
            <a 
              href="https://t.me/snakekrypto" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 mb-2">
                <path d="m22 2-7 20-4-9-9-4Z"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              <span>Telegram</span>
            </a>
            <a 
              href="https://discord.gg/snakekrypto" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 mb-2">
                <circle cx="9" cy="12" r="1"></circle>
                <circle cx="15" cy="12" r="1"></circle>
                <path d="M7.5 7.5c3.5-1 5.5-1 9 0"></path>
                <path d="M7.5 16.5c3.5 1 5.5 1 9 0"></path>
                <path d="M8 20l4 1 4-1"></path>
                <path d="M12 4v4"></path>
                <path d="M16 7q1 2 1 5c0 2-.67 4-2 6"></path>
                <path d="M8 7q-1 2-1 5c0 2 .67 4 2 6"></path>
              </svg>
              <span>Discord</span>
            </a>
            <a 
              href="mailto:info@snakekrypto.com" 
              className="flex flex-col items-center p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400 mb-2">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <span>Email</span>
            </a>
          </div>
        </div>
      </main>

      <footer className="mt-auto text-center text-sm text-gray-500 pb-8">
        <p>© 2025 Snake Krypto System. All rights reserved.</p>
        <p className="mt-2 text-xs">Built on Polygon Network</p>
      </footer>
    </div>
  );
};

export default About;
