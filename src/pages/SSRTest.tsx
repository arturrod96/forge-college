import React from 'react';

const SSRTest: React.FC = () => {
  return (
    <div>
      <pre>SSR OK: {new Date().toISOString()}</pre>
      <p>Se você está vendo este texto sem JavaScript, o SSR está funcionando.</p>
      <p>Timestamp do servidor: {new Date().toLocaleString()}</p>
    </div>
  );
};

export default SSRTest;
