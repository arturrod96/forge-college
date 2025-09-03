import React from 'react';

const SSRCanary: React.FC = () => {
  const timestamp = new Date().toISOString();
  
  return (
    <html lang="en">
      <head>
        <title>SSR Canary Test</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <pre>SSR CANARY OK: {timestamp}</pre>
        <p>Se você vê este texto, o SSR está funcionando.</p>
        <p>Timestamp: {new Date().toLocaleString()}</p>
        <p>Esta página renderiza HTML estático no servidor.</p>
        <p>Runtime: Node.js</p>
        <p>Dynamic: force-dynamic</p>
      </body>
    </html>
  );
};

export default SSRCanary;
