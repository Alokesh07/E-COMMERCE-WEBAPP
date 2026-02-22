const Card = require('../models/Card');

// Get user's cards
exports.getUserCards = async (req, res) => {
  try {
    const cards = await Card.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cards', error: error.message });
  }
};

// Add new card
exports.addCard = async (req, res) => {
  try {
    const { cardNumber, cardHolderName, expiryMonth, expiryYear, isDefault } = req.body;

    // If this is default, unset other default cards
    if (isDefault) {
      await Card.updateMany(
        { userId: req.user.userId },
        { isDefault: false }
      );
    }

    const card = new Card({
      userId: req.user.userId,
      cardNumber,
      cardHolderName,
      expiryMonth,
      expiryYear,
      cardType: getCardType(cardNumber),
      isDefault: isDefault || false
    });

    await card.save();
    res.status(201).json({ message: 'Card added successfully', card });
  } catch (error) {
    res.status(500).json({ message: 'Error adding card', error: error.message });
  }
};

// Update card
exports.updateCard = async (req, res) => {
  try {
    const { cardHolderName, expiryMonth, expiryYear, isDefault } = req.body;
    const card = await Card.findOne({ _id: req.params.id, userId: req.user.userId });

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await Card.updateMany(
        { userId: req.user.userId, _id: { $ne: card._id } },
        { isDefault: false }
      );
    }

    card.cardHolderName = cardHolderName || card.cardHolderName;
    card.expiryMonth = expiryMonth || card.expiryMonth;
    card.expiryYear = expiryYear || card.expiryYear;
    card.isDefault = isDefault !== undefined ? isDefault : card.isDefault;

    await card.save();
    res.json({ message: 'Card updated successfully', card });
  } catch (error) {
    res.status(500).json({ message: 'Error updating card', error: error.message });
  }
};

// Delete card
exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting card', error: error.message });
  }
};

// Set default card
exports.setDefaultCard = async (req, res) => {
  try {
    // Unset all defaults
    await Card.updateMany(
      { userId: req.user.userId },
      { isDefault: false }
    );

    // Set new default
    const card = await Card.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { isDefault: true },
      { new: true }
    );

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    res.json({ message: 'Default card set successfully', card });
  } catch (error) {
    res.status(500).json({ message: 'Error setting default card', error: error.message });
  }
};

// Helper function to determine card type
function getCardType(cardNumber) {
  const firstDigit = cardNumber.charAt(0);
  const firstTwo = cardNumber.substring(0, 2);

  if (firstDigit === '4') return 'visa';
  if (['51', '52', '53', '54', '55'].includes(firstTwo)) return 'mastercard';
  if (['60', '61', '62', '63', '64', '65'].includes(firstTwo)) return 'rupay';
  return 'other';
}
