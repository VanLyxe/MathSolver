import React from 'react';

const FAQ = () => {
  const faqs = [
    {
      question: "Comment fonctionne MathSolver ?",
      answer: "MathSolver utilise l'intelligence artificielle pour analyser votre problème mathématique et fournir une solution détaillée étape par étape. Vous pouvez soumettre votre problème sous forme de texte ou d'image."
    },
    {
      question: "Combien coûte le service ?",
      answer: "Nous proposons différentes formules : un pack découverte à 2.99€, un pack populaire à 4.99€, et un abonnement premium à 9.99€/mois. Chaque formule inclut un nombre différent de résolutions."
    },
    {
      question: "Les solutions sont-elles fiables ?",
      answer: "Oui, notre système est conçu pour fournir des solutions précises. Cependant, nous recommandons toujours de vérifier les résultats et de les utiliser comme support d'apprentissage."
    },
    {
      question: "Puis-je utiliser le service sur mobile ?",
      answer: "Oui, MathSolver est entièrement responsive et fonctionne sur tous les appareils : ordinateurs, tablettes et smartphones."
    },
    {
      question: "Comment puis-je obtenir plus de tokens ?",
      answer: "Vous pouvez acheter des tokens supplémentaires ou souscrire à notre abonnement premium depuis la page Tarifs."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Questions fréquentes</h1>
      
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              {faq.question}
            </h2>
            <p className="text-gray-600">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;