export const formatKatexExpression = (expression: string): string => {
  // Si c'est une expression avec A =, on la traite différemment
  if (expression.startsWith('A =')) {
    return expression
      .replace('A =', 'A &= ')
      .replace(/\((-?\d+)\/(\d+)\)/g, '\\frac{$1}{$2}')
      .replace(/÷/g, '\\div')
      .replace(/×/g, '\\times');
  }

  // Pour les autres expressions mathématiques
  let formatted = expression
    // Nettoyer les espaces superflus
    .trim()
    // Remplacer les opérateurs
    .replace(/÷/g, '\\div')
    .replace(/×/g, '\\times')
    // Gérer les fractions avec parenthèses négatives
    .replace(/\((-?\d+)\/(\d+)\)/g, '\\frac{$1}{$2}')
    // Gérer les fractions simples
    .replace(/(\d+)\/(\d+)/g, '\\frac{$1}{$2}')
    // Gérer les parenthèses
    .replace(/\(/g, '\\left(')
    .replace(/\)/g, '\\right)');

  // Ajouter l'alignement pour les équations
  if (formatted.includes('=')) {
    return `\\begin{aligned} ${formatted} \\end{aligned}`;
  }

  return formatted;
};

export const isTextLine = (line: string): boolean => {
  // Une ligne est du texte si elle ne contient pas de symboles mathématiques
  // et n'est pas un titre d'étape
  return !line.includes('=') && 
         !line.match(/^\d+\./) &&
         !line.includes('Expression initiale :') &&
         !/[+\-×÷*/()]/.test(line);
};

export const isMathExpression = (line: string): boolean => {
  // Une ligne est une expression mathématique si elle contient des opérateurs
  // ou des égalités, mais n'est pas un titre
  return (line.includes('=') || /[+\-×÷*/()]/.test(line)) &&
         !line.match(/^\d+\./) &&
         !line.includes('Expression initiale :');
};