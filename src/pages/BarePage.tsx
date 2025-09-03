import React from 'react';

const BarePage: React.FC = () => {
  return (
    <html lang="en">
      <head>
        <title>Bare SSR Test</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <pre>BARE SSR OK: {new Date().toISOString()}</pre>
        <p>Se você vê este texto, o SSR básico está funcionando.</p>
        <p>Timestamp: {new Date().toLocaleString()}</p>
      </body>
    </html>
  );
};

export default BarePage;
