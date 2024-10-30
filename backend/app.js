// backend/app.js
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('API para validación de respuestas');
});

app.listen(PORT, () => {
  console.log(`Backend corriendo en el puerto ${PORT}`);
});
