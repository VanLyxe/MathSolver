import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password }) => {
  const requirements = [
    {
      text: 'Au moins 6 caractères',
      test: () => password.length >= 6
    },
    {
      text: 'Au moins 1 chiffre',
      test: () => /\d/.test(password)
    },
    {
      text: 'Au moins 1 majuscule',
      test: () => /[A-Z]/.test(password)
    },
    {
      text: 'Au moins 1 minuscule',
      test: () => /[a-z]/.test(password)
    },
    {
      text: 'Au moins 1 caractère spécial (!@#$%^&*)',
      test: () => /[!@#$%^&*(),.?":{}|<>]/.test(password)
    }
  ];

  return (
    <div className="mt-2">
      <p className="text-sm text-gray-600 font-medium mb-2">Le mot de passe doit contenir :</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {requirements.map((req, index) => {
          const isValid = req.test();
          return (
            <div 
              key={index}
              className={`flex items-start space-x-2 text-sm ${
                isValid ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {isValid ? (
                <Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
              ) : (
                <X className="h-4 w-4 flex-shrink-0 mt-0.5" />
              )}
              <span>{req.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordRequirements;