import React from 'react';

const StaticBare: React.FC = () => {
  const timestamp = new Date().toISOString();
  
  return (
    <html lang="en">
      <head>
        <title>Static Bare SSR Test</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <pre>STATIC BARE SSR OK: {timestamp}</pre>
        <p>Se você vê este texto, o SSR está funcionando.</p>
        <p>Timestamp: {new Date().toLocaleString()}</p>
        <p>Esta página renderiza HTML estático no servidor.</p>
      </body>
    </html>
  );
};

export default StaticBare;
