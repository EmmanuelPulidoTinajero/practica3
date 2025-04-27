const express =  require('express')
const router = express.Router()
const dataHandler = require('../controllers/data_handler');
router.get('/', (req, res) => {
const searchQuery = req.query.query;
if(searchQuery) {
    res.json(dataHandler.findProduct(searchQuery))
} else {
res.json(dataHandler.getProducts())
}
});

router.post('/cart', (req, res) => {
    const cartItems = req.body;
    if (!Array.isArray(cartItems)) {
      return res.status(400).json({
        message: 'El cuerpo de la solicitud debe ser un array de productos.',
      })
    }
      const foundProducts = [];
      for (const item of cartItems) {
        const productUuidToFind = item.productUuid;
        const foundProduct = dataHandler.getProductById(productUuidToFind);
        if (!foundProduct) {
          return res.status(404).json({
            message: 'Producto no encontrado con UUID'
          });
        }
        foundProducts.push(foundProduct);
      }
      return res.status(200).json(foundProducts);
    });

router.get('/:id', (req, res) => {
    const productId = req.params.id;
    const foundProduct = dataHandler.getProductById(productId);
    if (foundProduct) {
      res.status(200).json(foundProduct);
    } else {
      res.status(404).json({ message: `Producto no encontrado con ID: ${productId}` });
    }
});

module.exports = router;