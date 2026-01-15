import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AddressManager() {
  const { user, updateUser } = useAuth();
  const [address, setAddress] = useState("");

  const addAddress = () => {
    const newAddress = {
      id: Date.now(),
      label: "Address",
      text: address,
    };

    updateUser({
      addresses: [...(user.addresses || []), newAddress],
    });

    setAddress("");
  };

  return (
    <div className="card p-3 h-100 shadow-sm">
      <h5 className="fw-bold mb-3">My Addresses</h5>

      {(user.addresses || []).map((a) => (
        <div key={a.id} className="border p-2 mb-2 rounded">
          {a.text}
        </div>
      ))}

      <textarea
        className="form-control mb-2"
        placeholder="Add new address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button className="btn btn-outline-primary w-100" onClick={addAddress}>
        Add Address
      </button>
    </div>
  );
}
