const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardNumber: {
    type: String,
    required: true
  },
  cardLast4: {
    type: String,
    required: true
  },
  cardHolderName: {
    type: String,
    required: true
  },
  expiryMonth: {
    type: String,
    required: true
  },
  expiryYear: {
    type: String,
    required: true
  },
  cardType: {
    type: String,
    enum: ['visa', 'mastercard', 'rupay', 'other'],
    default: 'other'
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt card number before saving (in production, use proper encryption)
cardSchema.pre('save', function(next) {
  // Store only last 4 digits
  if (this.isModified('cardNumber')) {
    this.cardLast4 = this.cardNumber.slice(-4);
  }
  next();
});

module.exports = mongoose.model('Card', cardSchema);
