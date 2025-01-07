import React from 'react';

const CookiesPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique des cookies</h1>
      
      <div className="prose prose-purple max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
          <p className="text-gray-600">
            Un cookie est un petit fichier texte stocké sur votre appareil lors de la visite 
            de notre site. Il nous permet de mémoriser vos préférences et d'améliorer votre 
            expérience utilisateur.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Cookies utilisés</h2>
          <p className="text-gray-600">
            Nous utilisons les types de cookies suivants :<br />
            - Cookies essentiels (authentification, sécurité)<br />
            - Cookies de performance (analyse du trafic)<br />
            - Cookies de fonctionnalité (préférences utilisateur)
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Gestion des cookies</h2>
          <p className="text-gray-600">
            Vous pouvez à tout moment :<br />
            - Accepter ou refuser les cookies non essentiels<br />
            - Modifier vos préférences dans les paramètres de votre navigateur<br />
            - Supprimer les cookies existants
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Durée de conservation</h2>
          <p className="text-gray-600">
            Les cookies sont conservés pour une durée maximale de 13 mois conformément 
            aux recommandations de la CNIL.
          </p>
        </section>
      </div>
    </div>
  );
};

export default CookiesPolicy;