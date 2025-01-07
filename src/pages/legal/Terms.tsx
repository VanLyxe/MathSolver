import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Conditions Générales d'Utilisation</h1>
      
      <div className="prose prose-purple max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Objet</h2>
          <p className="text-gray-600">
            Les présentes CGU définissent les modalités d'utilisation de MathSolver, 
            un service d'aide à la résolution de problèmes mathématiques destiné aux étudiants.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Utilisation du service</h2>
          <p className="text-gray-600">
            L'utilisation de MathSolver implique :<br />
            - La création d'un compte utilisateur<br />
            - L'achat de tokens ou un abonnement<br />
            - Le respect des règles d'utilisation<br />
            - L'utilisation à des fins pédagogiques uniquement
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Responsabilités</h2>
          <p className="text-gray-600">
            MathSolver est un outil d'aide à l'apprentissage. Les utilisateurs restent 
            responsables de la vérification des résultats et de leur utilisation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Propriété intellectuelle</h2>
          <p className="text-gray-600">
            Les solutions générées sont destinées à un usage personnel et pédagogique. 
            Toute reproduction ou diffusion doit mentionner MathSolver comme source.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Terms;