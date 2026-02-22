import { useState, useEffect } from "react";
import { QrCode, Copy, Check, RefreshCw } from "lucide-react";

export default function UPIPayment({ amount, onSuccess, onCancel }) {
  const [upiId] = useState("shopx@upi");
  const [qrCode, setQrCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("pending"); // pending, processing, success, failed
  const [transactionId, setTransactionId] = useState("");

  // Generate UPI payment string
  const generateUPIString = () => {
    const upiString = `upi://pay?pa=${upiId}&pn=ShopX&am=${amount}&cu=INR&tn=Order-${Date.now()}`;
    return upiString;
  };

  // Generate QR Code using Google Charts API (fallback)
  useEffect(() => {
    generateQRCode();
  }, [amount]);

  const generateQRCode = async () => {
    const upiString = generateUPIString();
    // Using a QR code API to generate the QR code
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
    setQrCode(qrApiUrl);
  };

  const copyUPIId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulatePayment = () => {
    setPaymentStatus("processing");
    // Simulate payment processing
    setTimeout(() => {
      const txId = "TXN" + Date.now();
      setTransactionId(txId);
      setPaymentStatus("success");
      onSuccess({
        transactionId: txId,
        upiId: upiId,
        amount: amount
      });
    }, 2000);
  };

  const handleRefresh = () => {
    generateQRCode();
    setPaymentStatus("pending");
    setTransactionId("");
  };

  return (
    <div className="upi-payment">
      <div className="text-center mb-4">
        <h5>Pay with UPI</h5>
        <p className="text-muted mb-0">Scan QR Code to pay ₹{amount}</p>
      </div>

      {/* QR Code */}
      <div className="text-center mb-4">
        <div className="d-inline-block p-3 bg-white rounded">
          {qrCode && (
            <img 
              src={qrCode} 
              alt="UPI QR Code" 
              style={{ width: "200px", height: "200px" }}
            />
          )}
        </div>
        <button 
          className="btn btn-link mt-2" 
          onClick={handleRefresh}
        >
          <RefreshCw size={16} className="me-1" /> Refresh QR
        </button>
      </div>

      {/* UPI ID */}
      <div className="mb-4">
        <p className="text-muted small text-center mb-2">Or pay to UPI ID:</p>
        <div className="d-flex align-items-center justify-content-center gap-2">
          <code className="bg-light px-3 py-2 rounded">{upiId}</code>
          <button 
            className="btn btn-sm btn-outline-secondary" 
            onClick={copyUPIId}
          >
            {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
          </button>
        </div>
      </div>

      {/* Payment Status */}
      {paymentStatus === "processing" && (
        <div className="text-center py-3">
          <div className="spinner-border text-primary mb-2" role="status">
            <span className="visually-hidden">Processing...</span>
          </div>
          <p className="mb-0">Processing payment...</p>
        </div>
      )}

      {paymentStatus === "success" && (
        <div className="text-center py-3">
          <div className="text-success mb-2">
            <Check size={48} />
          </div>
          <h6>Payment Successful!</h6>
          <p className="small text-muted">Transaction ID: {transactionId}</p>
        </div>
      )}

      {/* Actions */}
      {paymentStatus === "pending" && (
        <div className="d-grid gap-2">
          <button 
            className="btn btn-primary" 
            onClick={simulatePayment}
          >
            I've Paid
          </button>
          <button 
            className="btn btn-outline-secondary" 
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      )}

      {paymentStatus === "failed" && (
        <div className="d-grid gap-2">
          <button 
            className="btn btn-primary" 
            onClick={handleRefresh}
          >
            Try Again
          </button>
          <button 
            className="btn btn-outline-secondary" 
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-light rounded">
        <small className="text-muted">
          <strong>How to pay:</strong>
          <ol className="mb-0 mt-2">
            <li>Open your UPI app (GPay, PhonePe, Paytm)</li>
            <li>Scan the QR code or enter UPI ID</li>
            <li>Enter amount ₹{amount} and pay</li>
            <li>Click "I've Paid" after successful payment</li>
          </ol>
        </small>
      </div>
    </div>
  );
}
