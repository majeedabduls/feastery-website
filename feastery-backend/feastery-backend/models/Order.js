const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      qty: Number,
      price: Number,
      image: String
    }
  ],

  subtotal: { type: Number, required: true },

  customer: {
    name: String,
    phone: String,
    email: String,
    address: String
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", OrderSchema);
