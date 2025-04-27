const  express = require('express');
const  app = express();
const  port  = 3000;
const fs = require('fs'); // Importas el módulo fs
const path = require('path'); // Importas el módulo path (recomendado para manejar rutas)
const productsFilePath = path.join(__dirname, 'data', 'products.json');
const data = fs.readFileSync(productsFilePath, 'utf8');
let products = JSON.parse(data);
const productsRouter = require('./routes/products');
app.use('/products', productsRouter);
const adminRouter = require('./routes/admin_products');
app.use('/admin',  adminRouter);
const viewsDirectory = path.join(__dirname, 'views');

app.get(['/', '/home'], (req, res) => {
  res.sendFile('home.html', { root: viewsDirectory }, (err) => {
    if (err) {
      res.status(500).send('Error al cargar la página de inicio.');
    }
  });
});
app.get('/shopping_cart', (req, res) => {
  res.sendFile('shopping_cart.html', { root: viewsDirectory }, (err) => {
    if (err) {
      res.status(500).send('Error al cargar la página del carrito.');
    }
  });
});
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });