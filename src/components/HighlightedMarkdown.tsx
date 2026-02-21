import React from 'react';
import ReactMarkdown from 'react-markdown';

interface HighlightedMarkdownProps {
  content: string;
  className?: string;
}

const HighlightedMarkdown = ({ content, className }: HighlightedMarkdownProps) => {
  // Personnalisation du rendu pour supporter le surlignage jaune
  const components = {
    // Gérer les spans avec style inline pour le surlignage
    span: ({ node, ...props }: any) => {
      const style = props.style || {};
      
      // Vérifier si c'est un span de surlignage jaune
      if (style.backgroundColor === 'yellow' || style.backgroundColor === '#ffff00') {
        return (
          <span
            {...props}
            className="bg-yellow-300 text-black px-1 py-0.5 rounded text-sm font-medium inline-block"
            style={{
              backgroundColor: '#fef08a',
              color: '#000000',
              padding: '2px 6px',
              borderRadius: '4px',
              fontWeight: '500'
            }}
          />
        );
      }
      
      // Style par défaut pour les autres spans
      return <span {...props} />;
    },
    
    // Personnaliser les listes pour un meilleur affichage
    ul: ({ children }: any) => (
      <ul className="list-disc list-inside space-y-1 mb-4 text-gray-800 dark:text-gray-200">
        {children}
      </ul>
    ),
    
    ol: ({ children }: any) => (
      <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-800 dark:text-gray-200">
        {children}
      </ol>
    ),
    
    // Personnaliser les paragraphes
    p: ({ children }: any) => (
      <p className="mb-3 leading-relaxed text-gray-800 dark:text-gray-200">
        {children}
      </p>
    ),
    
    // Personnaliser les titres
    h1: ({ children }: any) => (
      <h1 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
        {children}
      </h1>
    ),
    
    h2: ({ children }: any) => (
      <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">
        {children}
      </h2>
    ),
    
    h3: ({ children }: any) => (
      <h3 className="text-base font-medium mb-2 text-gray-700 dark:text-gray-200">
        {children}
      </h3>
    ),
    
    // Personnaliser le code
    code: ({ inline, children }: any) => {
      if (inline) {
        return (
          <code className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-gray-900 dark:text-gray-100">
            {children}
          </code>
        );
      }
      return (
        <code className="block bg-gray-100 dark:bg-gray-900 p-3 rounded-lg text-sm font-mono text-gray-900 dark:text-gray-100 overflow-x-auto">
          {children}
        </code>
      );
    },
    
    // Personnaliser les blocs de code
    pre: ({ children }: any) => (
      <pre className="bg-muted p-3 rounded-lg overflow-x-auto mb-4">
        {children}
      </pre>
    ),
    
    // Personnaliser les blocs de citation
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-950">
        {children}
      </blockquote>
    ),
    
    // Personnaliser les tableaux
    table: ({ children }: any) => (
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
          {children}
        </table>
      </div>
    ),
    
    th: ({ children }: any) => (
      <th className="border border-gray-300 dark:border-gray-600 px-3 py-2 bg-gray-100 dark:bg-gray-800 font-bold text-gray-900 dark:text-gray-100 text-left">
        {children}
      </th>
    ),
    
    td: ({ children }: any) => (
      <td className="border border-gray-300 dark:border-gray-600 px-3 py-2 text-gray-800 dark:text-gray-200">
        {children}
      </td>
    ),
    
    // Personnaliser les liens
    a: ({ href, children }: any) => (
      <a
        href={href}
        className="text-blue-700 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 underline font-medium"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    
    // Personnaliser le texte en gras
    strong: ({ children }: any) => (
      <strong className="font-bold text-gray-900 dark:text-white">
        {children}
      </strong>
    ),
    
    // Personnaliser le texte en italique
    em: ({ children }: any) => (
      <em className="italic text-gray-700 dark:text-gray-300">
        {children}
      </em>
    ),
  };

  return (
    <div className={`prose prose-sm max-w-none bg-white dark:bg-gray-950 p-4 rounded-lg ${className}`}>
      <ReactMarkdown
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default HighlightedMarkdown;
