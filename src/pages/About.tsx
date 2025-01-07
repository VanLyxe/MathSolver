import React from 'react';
import { Brain, Users, Shield, Sparkles } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Brain,
      title: "Intelligence Artificielle",
      description: "Notre technologie de pointe analyse et résout les problèmes mathématiques avec précision."
    },
    {
      icon: Users,
      title: "Pour tous les niveaux",
      description: "Du collège aux études supérieures, nous nous adaptons à tous les niveaux d'études."
    },
    {
      icon: Shield,
      title: "Sécurité des données",
      description: "Vos données sont protégées selon les normes les plus strictes du RGPD."
    },
    {
      icon: Sparkles,
      title: "Apprentissage facilité",
      description: "Des solutions détaillées étape par étape pour mieux comprendre."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">À propos de MathSolver</h1>

      <div className="prose prose-purple max-w-none mb-12">
        <p className="text-lg text-gray-600">
          MathSolver est né de la volonté de rendre l'apprentissage des mathématiques 
          plus accessible et compréhensible pour tous les étudiants. Notre plateforme 
          combine intelligence artificielle et expertise pédagogique pour fournir des 
          solutions détaillées et adaptées à chaque niveau.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Icon className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default About;