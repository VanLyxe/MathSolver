import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfSale = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate('/pricing')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Retour aux offres</span>
      </button>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Conditions Générales de Vente</h1>
      
      <div className="prose prose-purple max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Objet</h2>
          <p className="text-gray-600">
            Les présentes Conditions Générales de Vente (CGV) régissent les ventes de services de résolution 
            de problèmes mathématiques proposés par MathSolver aux utilisateurs de la plateforme.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Prix et Modalités de paiement</h2>
          <p className="text-gray-600">
            Les prix sont indiqués en euros TTC. Le paiement s'effectue par carte bancaire via notre 
            prestataire de paiement sécurisé Stripe. La transaction est immédiatement débitée après 
            vérification des informations.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Abonnements et Packs</h2>
          <p className="text-gray-600">
            Les tokens achetés via les packs n'ont pas de date d'expiration. L'abonnement Premium 
            est automatiquement renouvelé chaque mois jusqu'à résiliation. La résiliation peut être 
            effectuée à tout moment depuis l'espace client.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Droit de rétractation</h2>
          <p className="text-gray-600">
            Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation 
            ne peut être exercé pour les services pleinement exécutés avant la fin du délai de 
            rétractation et dont l'exécution a commencé après accord préalable exprès du consommateur.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Service client</h2>
          <p className="text-gray-600">
            Pour toute question relative aux ventes, notre service client est disponible par email 
            à l'adresse support@mathsolver.fr ou via le formulaire de contact de notre site.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsOfSale;