import { useState, useEffect } from "react";
import { Plus, MapPin, Trash2, Pencil, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../utils/api";
import "../../styles/profile.css";

export default function AddressPanel() {
  const { user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    address: "",
    city: "",
    zip: "",
    landmark: "",
    type: 'Home',
    isDefault: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Use effect to sync to local storage
  useEffect(() => {
    // Initialize from user data when available
    if (user && Array.isArray(user.addresses)) {
      setAddresses(user.addresses);
    }
  }, [user]);

  // Don't render if no user - use conditional rendering instead of early return
  if (!user) {
    return (
      <div className="text-center py-5">
        <p className="text-muted">Please login to view your addresses.</p>
      </div>
    );
  }

  /* -------------------- ADD / UPDATE ADDRESS -------------------- */
  const saveAddress = async () => {
    setError("");
    if (!form.address || !form.city || !form.zip) {
      setError('Please fill address, city and zip');
      return;
    }

    setLoading(true);
    try {
      if (editId) {
        await authAPI.updateAddress(editId, {
          name: form.name || '',
          address: form.address,
          city: form.city,
          state: form.state || '',
          zip: form.zip,
          phone: form.phone || '',
          isDefault: form.isDefault,
          type: form.type
        });
      } else {
        await authAPI.addAddress({
          name: form.name || '',
          address: form.address,
          city: form.city,
          state: form.state || '',
          zip: form.zip,
          phone: form.phone || '',
          isDefault: form.isDefault,
          type: form.type
        });
      }

      // Refresh current user
      const refreshed = await authAPI.getCurrentUser();
      setAddresses(refreshed.addresses || []);
      resetForm();
    } catch (err) {
      setError(err.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- REMOVE ADDRESS -------------------- */
  const removeAddress = async (id) => {
    setLoading(true);
    try {
      await authAPI.deleteAddress(id);
      const refreshed = await authAPI.getCurrentUser();
      setAddresses(refreshed.addresses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- SET DEFAULT -------------------- */
  const setDefault = async (id) => {
    setLoading(true);
    try {
      await authAPI.updateAddress(id, { isDefault: true });
      const refreshed = await authAPI.getCurrentUser();
      setAddresses(refreshed.addresses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- EDIT -------------------- */
  const editAddress = (addr) => {
    setForm({
      name: addr.name || '',
      address: addr.address,
      city: addr.city,
      state: addr.state || '',
      zip: addr.zip,
      phone: addr.phone || '',
      landmark: addr.landmark || '',
      type: addr.type || 'Home',
      isDefault: !!addr.isDefault,
    });
    setEditId(addr.id);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ address: "", city: "", zip: "", landmark: "", type: 'Home', isDefault: false });
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

                <div className="col-md-6">
                  <select className="form-select" value={form.type} onChange={(e)=>setForm({...form, type: e.target.value})}>
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="PG">PG</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="col-md-6 d-flex align-items-center gap-2">
                  <input type="checkbox" checked={form.isDefault} onChange={(e)=>setForm({...form, isDefault: e.target.checked})} id="isDefaultAddr" />
                  <label htmlFor="isDefaultAddr" className="m-0">Set as default</label>
                </div>
              </div>

              {error && <div className="alert alert-danger mt-3">{error}</div>}

              <div className="d-flex gap-2 mt-4">
                <button className="btn btn-secondary w-50" onClick={resetForm} disabled={loading}>
                  Cancel
                </button>

                <button className="btn btn-primary w-50" onClick={saveAddress} disabled={loading}>
                  {loading ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
