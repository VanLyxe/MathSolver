import React from 'react';

const LegalMentions = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Mentions légales</h1>
      
      <div className="prose prose-purple max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Éditeur du site</h2>
          <p className="text-gray-600">
            MathSolver est édité par [Nom de la société]<br />
            Siège social : [Adresse]<br />
            SIRET : [Numéro SIRET]<br />
            Capital social : [Montant]<br />
            Directeur de la publication : [Nom du directeur]
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Hébergement</h2>
          <p className="text-gray-600">
            Le site est hébergé par [Nom de l'hébergeur]<br />
            Adresse : [Adresse de l'hébergeur]<br />
            Contact : [Contact de l'hébergeur]
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
            Email : contact@mathsolver.fr<br />
            Téléphone : [Numéro de téléphone]
          </p>
        </section>
      </div>
    </div>
  );
};

export default LegalMentions;