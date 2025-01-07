import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { title: 'Mentions légales', path: '/legal/mentions' },
    { title: 'Politique de confidentialité', path: '/legal/privacy' },
    { title: 'CGU', path: '/legal/terms' },
    { title: 'Cookies', path: '/legal/cookies' }
  ];

  const helpLinks = [
    { title: 'FAQ', path: '/help/faq' },
    { title: 'Contact', path: '/help/contact' },
    { title: 'À propos', path: '/about' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Brain className="h-8 w-8 text-purple-500" />
              <span className="text-xl font-bold text-white">MathSolver</span>
            </div>
            <p className="text-gray-400 mb-4">
              MathSolver est un outil éducatif conçu pour aider les étudiants à comprendre 
              et résoudre des problèmes mathématiques étape par étape.
            </p>
          </div>

          {/* Liens légaux */}
          <div>
            <h3 className="text-white font-semibold mb-4">Informations légales</h3>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens d'aide */}
          <div>
            <h3 className="text-white font-semibold mb-4">Aide</h3>
            <ul className="space-y-2">
              {helpLinks.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} MathSolver. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;