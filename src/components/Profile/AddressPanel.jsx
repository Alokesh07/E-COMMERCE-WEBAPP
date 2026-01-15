import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AddressPanel() {
  const { user, updateUser } = useAuth();
  const [newAddress, setNewAddress] = useState("");

  const addresses = user.addresses || [];

  const addAddress = () => {
    updateUser({
      addresses: [...addresses, { id: Date.now(), text: newAddress }],
    });
    setNewAddress("");
  };

  return (
    <div className="card p-4 shadow-sm">
      <h4 className="fw-bold mb-3">Saved Addresses</h4>

      {addresses.length === 0 && (
        <p className="text-muted">No addresses saved yet.</p>
      )}

      {addresses.map((a, i) => (
        <div key={a.id} className="border rounded p-2 mb-2">
          <strong>{i === 0 ? "Default Address" : `Address ${i + 1}`}</strong>
          <div>{a.text}</div>
        </div>
      ))}

      <textarea
        className="form-control mb-2"
        placeholder="Add new address"
        value={newAddress}
        onChange={(e) => setNewAddress(e.target.value)}
      />

      <button className="btn btn-outline-primary" onClick={addAddress}>
        Add Address
      </button>
    </div>
  );
}
