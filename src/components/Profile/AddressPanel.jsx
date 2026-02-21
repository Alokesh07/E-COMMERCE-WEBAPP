import { useState, useEffect } from "react";
import { Plus, MapPin, Trash2, Pencil, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "../../styles/profile.css";

export default function AddressPanel() {
  const { user, updateUser } = useAuth();

  // Initialize state with default values first (hooks must be at top)
  const [addresses, setAddresses] = useState(() => {
    const stored = localStorage.getItem("addresses");
    return stored ? JSON.parse(stored) : [];
  });

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    address: "",
    city: "",
    zip: "",
    landmark: "",
  });

  // Use effect to sync to local storage
  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
    if (user) {
      updateUser({ addresses });
    }
  }, [addresses, user, updateUser]);

  // Don't render if no user - use conditional rendering instead of early return
  if (!user) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">Please login to view your addresses.</p>
      </div>
    );
  }

  /* -------------------- ADD / UPDATE ADDRESS -------------------- */
  const saveAddress = () => {
    if (!form.address || !form.city || !form.zip) return;

    if (editId) {
      setAddresses(
        addresses.map((a) => (a.id === editId ? { ...a, ...form } : a))
      );
    } else {
      setAddresses([
        ...addresses,
        {
          id: Date.now(),
          ...form,
          isDefault: addresses.length === 0,
        },
      ]);
    }

    resetForm();
  };

  /* -------------------- REMOVE ADDRESS -------------------- */
  const removeAddress = (id) => {
    const filtered = addresses.filter((a) => a.id !== id);

    if (!filtered.some((a) => a.isDefault) && filtered.length > 0) {
      filtered[0].isDefault = true;
    }

    setAddresses(filtered);
  };

  /* -------------------- SET DEFAULT -------------------- */
  const setDefault = (id) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  /* -------------------- EDIT -------------------- */
  const editAddress = (addr) => {
    setForm({
      address: addr.address,
      city: addr.city,
      zip: addr.zip,
      landmark: addr.landmark,
    });
    setEditId(addr.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ address: "", city: "", zip: "", landmark: "" });
    setEditId(null);
    setShowForm(false);
  };

  return (
    <>
      <div className="address-card-container">
        <div className="address-header-bar">
          <h4 className="m-0">Saved Addresses</h4>

          <button className="add-address-btn" onClick={() => setShowForm(true)}>
            <Plus size={16} /> Add New Address
          </button>
        </div>

        {addresses.length === 0 && (
          <p className="text-muted mt-3">No addresses saved yet.</p>
        )}

        {addresses.map((a, i) => (
          <div key={a.id} className="address-card">
            <div className="address-card-top">
              <div className="d-flex align-items-center gap-2">
                <MapPin size={16} />
                <strong>
                  {a.isDefault ? "Default Address" : `Address ${i + 1}`}
                </strong>
              </div>

              {a.isDefault && <span className="badge-primary">DEFAULT</span>}
            </div>

            <p className="address-main">{a.address}</p>
            <p className="address-sub">
              {a.city} – {a.zip}
            </p>

            {a.landmark && (
              <small className="text-muted">Landmark: {a.landmark}</small>
            )}

            <div className="address-actions">
              {!a.isDefault && (
                <button
                  className="action-btn"
                  onClick={() => setDefault(a.id)}
                  title="Set as default"
                >
                  <Star size={14} /> Default
                </button>
              )}

              <button
                className="action-btn"
                onClick={() => editAddress(a)}
                title="Edit"
              >
                <Pencil size={14} /> Edit
              </button>

              <button
                className="action-btn danger"
                onClick={() => removeAddress(a.id)}
                title="Remove"
              >
                <Trash2 size={14} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.55)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content p-4">
              <h5 className="fw-bold mb-3">
                {editId ? "Edit Address" : "Add New Address"}
              </h5>

              <div className="row g-3">
                <div className="col-12">
                  <input
                    className="form-control"
                    placeholder="House No, Street, Area"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                  />
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="City"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>

                <div className="col-md-6">
                  <input
                    className="form-control"
                    placeholder="Zip Code"
                    value={form.zip}
                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <input
                    className="form-control"
                    placeholder="Landmark (optional)"
                    value={form.landmark}
                    onChange={(e) =>
                      setForm({ ...form, landmark: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button className="btn btn-secondary w-50" onClick={resetForm}>
                  Cancel
                </button>

                <button className="btn btn-primary w-50" onClick={saveAddress}>
                  Save Address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
