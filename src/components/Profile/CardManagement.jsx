import { useState, useEffect } from "react";
import { CreditCard, Plus, Trash2, Star, Lock } from "lucide-react";
import { cardsAPI } from "../../utils/api";

export default function CardManagement() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const data = await cardsAPI.getAll();
      setCards(data);
    } catch (err) {
      console.error("Error fetching cards:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.target);
    const cardData = {
      cardNumber: formData.get("cardNumber").replace(/\s/g, ""),
      cardHolderName: formData.get("cardHolderName"),
      expiryMonth: formData.get("expiryMonth"),
      expiryYear: formData.get("expiryYear"),
      isDefault: formData.get("isDefault") === "on"
    };

    try {
      await cardsAPI.add(cardData);
      fetchCards();
      setShowAddModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCard = async (id) => {
    if (!window.confirm("Are you sure you want to delete this card?")) return;
    try {
      await cardsAPI.delete(id);
      fetchCards();
    } catch (err) {
      console.error("Error deleting card:", err);
    }
  };

  const handleSetDefault = async (id) => {
    try {
      await cardsAPI.setDefault(id);
      fetchCards();
    } catch (err) {
      console.error("Error setting default card:", err);
    }
  };

  const getCardTypeIcon = (type) => {
    switch (type) {
      case 'visa':
        return <span style={{ color: "#1A1F71", fontWeight: "bold" }}>VISA</span>;
      case 'mastercard':
        return <span style={{ color: "#EB001B", fontWeight: "bold" }}>MC</span>;
      case 'rupay':
        return <span style={{ color: "#E31837", fontWeight: "bold" }}>RuPay</span>;
      default:
        return <CreditCard size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="m-0">Saved Cards</h5>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
          <Plus size={16} className="me-1" /> Add Card
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {cards.length === 0 ? (
        <div className="text-center py-4">
          <CreditCard size={48} className="text-muted mb-3" />
          <p className="text-muted">No saved cards</p>
          <button className="btn btn-outline-primary" onClick={() => setShowAddModal(true)}>
            Add Your First Card
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {cards.map((card) => (
            <div key={card._id} className="col-md-6">
              <div className={`card p-3 ${card.isDefault ? 'border-primary' : ''}`}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>{getCardTypeIcon(card.cardType)}</div>
                  {card.isDefault && (
                    <span className="badge bg-primary">Default</span>
                  )}
                </div>
                <div className="mb-2" style={{ letterSpacing: "2px" }}>
                  •••• •••• •••• {card.cardLast4}
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-muted d-block">{card.cardHolderName}</small>
                    <small className="text-muted">{card.expiryMonth}/{card.expiryYear}</small>
                  </div>
                  <div className="d-flex gap-2">
                    {!card.isDefault && (
                      <button
                        className="btn btn-sm btn-outline-primary"
                        title="Set as default"
                        onClick={() => handleSetDefault(card._id)}
                      >
                        <Star size={16} />
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline-danger"
                      title="Delete card"
                      onClick={() => handleDeleteCard(card._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Card Modal */}
      {showAddModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Card</h5>
                <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddCard}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      className="form-control"
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Card Holder Name</label>
                    <input
                      type="text"
                      name="cardHolderName"
                      className="form-control"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label className="form-label">Expiry Month</label>
                      <select name="expiryMonth" className="form-select" required>
                        <option value="">Month</option>
                        {[...Array(12)].map((_, i) => (
                          <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                            {String(i + 1).padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col">
                      <label className="form-label">Expiry Year</label>
                      <select name="expiryYear" className="form-select" required>
                        <option value="">Year</option>
                        {[...Array(10)].map((_, i) => (
                          <option key={i} value={2024 + i}>
                            {2024 + i}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-check">
                    <input type="checkbox" name="isDefault" className="form-check-input" id="defaultCard" />
                    <label className="form-check-label" htmlFor="defaultCard">
                      Set as default card
                    </label>
                  </div>
                  <div className="mt-3 text-muted small d-flex align-items-center gap-1">
                    <Lock size={14} /> Your card details are secure
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
