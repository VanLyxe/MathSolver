import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Politique de confidentialité</h1>
      
      <div className="prose prose-purple max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Collecte des données</h2>
          <p className="text-gray-600">
            Nous collectons les données suivantes :<br />
            - Données d'identification (email)<br />
            - Données de connexion<br />
            - Historique des problèmes soumis<br />
            - Images téléchargées pour la résolution de problèmes
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Utilisation des données</h2>
          <p className="text-gray-600">
            Vos données sont utilisées pour :<br />
            - Fournir le service de résolution de problèmes<br />
            - Améliorer nos services<br />
            - Assurer le support utilisateur<br />
            - Respecter nos obligations légales
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Protection des données des mineurs</h2>
          <p className="text-gray-600">
            Notre service est destiné aux étudiants de tout âge. Nous accordons une attention particulière 
            à la protection des données des utilisateurs mineurs conformément au RGPD et autres 
            réglementations applicables.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Vos droits</h2>
          <p className="text-gray-600">
            Conformément au RGPD, vous disposez des droits suivants :<br />
            - Droit d'accès à vos données<br />
            - Droit de rectification<br />
            - Droit à l'effacement<br />
            - Droit à la portabilité<br />
            - Droit d'opposition
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;