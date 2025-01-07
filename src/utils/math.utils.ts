export const formatMathExpression = (solution: string): string => {
  return solution
    .split('\n')
    .map(line => {
      const cleanLine = line.trim();
      if (!cleanLine) return '';

      // Titres et étapes
      if (cleanLine === 'Expression initiale :' || /^\d+\./.test(cleanLine)) {
        return cleanLine;
      }

      // Expressions mathématiques pures (sans texte)
      if (isMathExpression(cleanLine)) {
        return cleanLine
          .replace(/÷/g, '\\div')
          .replace(/×/g, '\\times')
          .replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}')
          .trim();
      }

      // Texte explicatif
      return cleanLine;
    })
    .filter(Boolean)
    .join('\n');
};

const isMathExpression = (line: string): boolean => {
  // Une ligne est une expression mathématique si elle contient:
  // - des opérateurs mathématiques
  // - des égalités
  // - des variables isolées
  return /[=+\-×÷*/()]/.test(line) && 
         !line.includes('soit') &&
         !line.includes('Soit') &&
         !line.includes('est') &&
         !line.includes('donc');
};