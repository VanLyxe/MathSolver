import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Calculator, BookOpen, Award, Users } from 'lucide-react';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';
import { generateCanonicalUrl } from '../utils/seo.utils';

const Home = () => {
  const navigate = useNavigate();
  const canonicalUrl = generateCanonicalUrl('/');

  const websiteSchema = {
    name: 'MathSolver',
    description: 'Résolvez vos problèmes de mathématiques instantanément avec des solutions détaillées étape par étape.',
    url: canonicalUrl,
    potentialAction: {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://mathsolver.fr/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  const features = [
    {
      icon: Calculator,
      title: "Solutions détaillées",
      description: "Obtenez des explications étape par étape pour comprendre chaque résolution."
    },
    {
      icon: BookOpen,
      title: "Tous niveaux",
      description: "Du collège aux études supérieures, nous couvrons tous les niveaux mathématiques."
    },
    {
      icon: Award,
      title: "Précision garantie",
      description: "Notre IA assure des résultats précis et vérifiés."
    }
  ];

  const subjects = [
    "Algèbre",
    "Géométrie",
    "Analyse",
    "Trigonométrie",
    "Probabilités",
    "Statistiques"
  ];

  return (
    <>
      <SEO 
        title="Résolution de problèmes mathématiques en ligne"
        description="MathSolver vous aide à résoudre vos problèmes de mathématiques avec des solutions détaillées étape par étape. Idéal pour les étudiants de tous niveaux."
        keywords="mathématiques, résolution problèmes, aide mathématiques, solutions détaillées, intelligence artificielle"
        canonicalUrl={canonicalUrl}
      />
      <StructuredData type="WebSite" data={websiteSchema} />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-purple-50 to-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Brain className="h-16 w-16 text-purple-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Résolvez vos problèmes de mathématiques instantanément
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Soumettez votre problème par texte ou image et obtenez une solution détaillée en quelques secondes. 
              Notre technologie d'intelligence artificielle vous guide pas à pas vers la compréhension.
            </p>
            <button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Commencer maintenant
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Pourquoi choisir MathSolver ?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Icon className="h-8 w-8 text-purple-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subjects Section */}
        <div className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-12">
              Toutes les matières couvertes
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {subjects.map((subject, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-800 font-medium">{subject}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Users className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Rejoint par des milliers d'étudiants
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Faites confiance à MathSolver pour vous accompagner dans votre réussite scolaire. 
              Notre plateforme aide déjà des milliers d'étudiants à mieux comprendre et maîtriser les mathématiques.
            </p>
            <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
              <div>
                <p className="text-3xl font-bold text-purple-600">50K+</p>
                <p className="text-gray-600">Utilisateurs</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">100K+</p>
                <p className="text-gray-600">Problèmes résolus</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600">4.8/5</p>
                <p className="text-gray-600">Note moyenne</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;