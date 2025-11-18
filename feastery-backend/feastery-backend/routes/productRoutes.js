const multer = require("multer");

// Multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Add product with image
router.post('/add', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Image is required" });
    }

    const product = new Product({
      name,
      price,
      description,
      category,
      image: req.file.filename,  // Save uploaded file name
    });

    await product.save();

    res.json({ success: true, message: 'Product added', product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


// Get all products
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update product (with optional image)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const update = { name, price, description, category };

    if (req.file && req.file.filename) {
      update.image = req.file.filename;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!product) return res.status(404).json({ success: false, error: 'Not found' });

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;
