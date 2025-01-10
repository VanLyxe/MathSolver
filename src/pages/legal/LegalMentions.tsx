import React from 'react';

const LegalMentions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions légales</h1>
      
      <div className="prose prose-purple max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Éditeur du site</h2>
          <p className="text-gray-600">
            MathSolver est édité par VanLyxe Corp<br />
            Siège social : 12 rue du nord 68000 Colmar<br />
            SIRET : 905 234 548<br />
            Capital social : 0<br />
            Directeur de la publication : Julien BERGE
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Hébergement</h2>
          <p className="text-gray-600">
            Le site est hébergé par Netlify<br />
            Adresse : 2325 3RD STREET,SUITE 215, SAN FRANCISCO, CA 94107 (USA)<br />
            Contact : privacy@netlify.com
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Propriété intellectuelle</h2>
          <p className="text-gray-600">
            L'ensemble du contenu de ce site est protégé par le droit d'auteur. 
            Toute reproduction, même partielle, est interdite sans autorisation préalable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Contact</h2>
          <p className="text-gray-600">
            Pour toute question concernant le site, vous pouvez nous contacter :<br />
            Email : vanlyxe@gmail.com<br />
            Téléphone : 06
          </p>
        </section>
      </div>
    </div>
  );
};

export default LegalMentions;
