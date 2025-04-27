const express = require('express')
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { Product, ProductException } = require('../controllers/products');
const dataHandler = require('../controllers/data_handler');
const productsFilePath = path.join(__dirname, '../data', 'products.json');
const validateAdmin = (req, res, next) => {
    const authHeader = req.headers['x-auth'];
    if (authHeader === 'admin') {
      next();
    } else {
      res.status(403).json({ message: 'Acceso no autorizado, no se cuenta con privilegios de administrador' });
    }
  };

  router.post('/', validateAdmin, async (req, res) => {
    try {
      const productData = req.body;
      const newProduct = Product.createFromObject(productData);
      dataHandler.createProduct(newProduct);
      const updatedProductsList = dataHandler.getProducts();
      const jsonString = JSON.stringify(updatedProductsList, null, 2);
      fs.writeFileSync(productsFilePath, jsonString, 'utf8');
      res.status(201).json({ message: `Producto creado con éxito: ${newProduct.title}`, productUuid: newProduct.uid });
  
    } catch (error) {
      if (error instanceof ProductException) {
        res.status(400).json({ message: `Error de validación del producto: ${error.message}` });
      } else {
        res.status(500).json({ message: 'Error interno del servidor al crear el producto.' });
      }
    }
  });
  router.put('/:id', validateAdmin, async (req, res) => {
    try {
      const productIdToUpdate = req.params.id;
      const updatedProductData = req.body;
      const existingProduct = dataHandler.getProductById(productIdToUpdate);
      if (!existingProduct) {
        return res.status(404).json({ message: `Producto no encontrado con ID: ${productIdToUpdate}` });
      }
      const updatableFields = ['title', 'description', 'image', 'unit', 'stock', 'pricePerUnit', 'category'];
      let updatedSuccessfully = false;
      for (const field of updatableFields) {
          if (updatedProductData.hasOwnProperty(field)) {
              try {
                  existingProduct[field] = updatedProductData[field];
                  updatedSuccessfully = true;
              } catch (error) {
                  if (error instanceof ProductException) {
                      return res.status(400).json({ message: `Error de validación en el campo "${field}": ${error.message}` });
                  } else {
                      throw error;
                  }
              }
          }
      }
      dataHandler.updateProduct(productIdToUpdate, existingProduct);
      const updatedProductsList = dataHandler.getProducts();
      const jsonString = JSON.stringify(updatedProductsList, null, 2);
      fs.writeFileSync(productsFilePath, jsonString, 'utf8');
      res.status(200).json({ message: `Producto actualizado con éxito: ${existingProduct.title}`, productUuid: existingProduct.uid });
    } catch (error) {
      res.status(500).json({ message: 'Error interno del servidor al actualizar el producto.' });
    }
  });
  router.delete('/:id', validateAdmin, async (req, res) => {
    try {
      const productIdToDelete = req.params.id;
      const productToDelete = dataHandler.getProductById(productIdToDelete);
      if (!productToDelete) {
        return res.status(404).json({ message: `Producto no encontrado con ID: ${productIdToDelete}` });
      }
      dataHandler.deleteProduct(productIdToDelete);
      const updatedProductsList = dataHandler.getProducts();
      const jsonString = JSON.stringify(updatedProductsList, null, 2);
      fs.writeFileSync(productsFilePath, jsonString, 'utf8');
      res.status(200).json({ message: `Producto eliminado con éxito: ${productToDelete.title}`, productUuid: productToDelete.uid });
    } catch (error) {
      res.status(500).json({ message: 'Error interno del servidor al eliminar el producto.' });
    }
  });

  module.exports = router;