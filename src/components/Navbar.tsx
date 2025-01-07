import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, LogIn, User } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <Brain className="h-8 w-8 text-white" />
          <span className="text-white text-xl font-bold">MathSolver</span>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <button
                onClick={() => navigate('/dashboard')}
                className="text-white hover:text-gray-200"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="flex items-center space-x-2 text-white hover:text-gray-200"
              >
                <User className="h-5 w-5" />
                <span>Profil</span>
              </button>
              <button
                onClick={() => signOut()}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="flex items-center space-x-2 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              <LogIn className="h-5 w-5" />
              <span>Connexion</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;