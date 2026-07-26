// Self-contained Swagger UI — loads from CDN, zero npm dependencies
const spec = require('../swagger-spec.json');

// We embed the spec directly; you can also put it in a separate file
const rawSpec = spec;

module.exports = (app) => {
  // Serve the raw OpenAPI JSON
  app.get('/api/docs.json', (req, res) => res.json(rawSpec));

  // Serve Swagger UI HTML (CDN-based — no npm packages needed)
  app.get('/api/docs', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>School Management API Docs</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
  <style>html{box-sizing:border-box}*,*::before,*::after{box-sizing:inherit}body{margin:0;background:#fafafa}.swagger-ui .topbar{display:none}</style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>
  <script>
    SwaggerUIBundle({ url: '/api/docs.json', dom_id: '#swagger-ui', presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset], layout: 'BaseLayout', deepLinking: true, defaultModelsExpandDepth: -1 });
  </script>
</body>
</html>`);
  });
};
