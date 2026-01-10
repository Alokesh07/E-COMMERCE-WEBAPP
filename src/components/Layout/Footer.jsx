import {
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  ShieldCheck,
  Truck,
  RefreshCcw
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-light border-top mt-5">
      <div className="container py-5">

        {/* TOP GRID */}
        <div className="row gy-4">

          {/* BRAND + ABOUT */}
          <div className="col-md-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
              <ShoppingBag size={20} />
              Shop<span className="text-primary">X</span>
            </h5>

            <p className="text-muted small">
              ShopX is your one-stop destination for quality products,
              fast delivery, and seamless shopping experience.
            </p>

            <div className="d-flex gap-3 mt-3">
              <Facebook size={18} className="text-muted cursor-pointer" />
              <Instagram size={18} className="text-muted" />
              <Twitter size={18} className="text-muted" />
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="col-md-2">
            <h6 className="fw-semibold mb-3">Quick Links</h6>
            <ul className="list-unstyled small text-muted">
              <li className="mb-2">Home</li>
              <li className="mb-2">Shop</li>
              <li className="mb-2">My Account</li>
              <li className="mb-2">Orders</li>
              <li>Wishlist</li>
            </ul>
          </div>

          {/* CUSTOMER SUPPORT */}
          <div className="col-md-3">
            <h6 className="fw-semibold mb-3">Customer Support</h6>

            <div className="small text-muted d-flex gap-2 mb-2">
              <Phone size={16} /> +91 98765 43210
            </div>

            <div className="small text-muted d-flex gap-2 mb-2">
              <Mail size={16} /> support@shopx.com
            </div>

            <div className="small text-muted d-flex gap-2">
              <MapPin size={16} /> India · Nationwide Delivery
            </div>
          </div>

          {/* TRUST BADGES */}
          <div className="col-md-3">
            <h6 className="fw-semibold mb-3">Why Shop With Us?</h6>

            <div className="d-flex align-items-start gap-2 small text-muted mb-2">
              <Truck size={16} />
              Fast & reliable delivery
            </div>

            <div className="d-flex align-items-start gap-2 small text-muted mb-2">
              <ShieldCheck size={16} />
              Secure payments
            </div>

            <div className="d-flex align-items-start gap-2 small text-muted">
              <RefreshCcw size={16} />
              Easy returns & refunds
            </div>
          </div>
        </div>

        {/* DIVIDER */}
        <hr className="my-4" />

        {/* BOTTOM BAR */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center small text-muted">
          <p className="mb-2 mb-md-0">
            © 2026 ShopX. Crafted with care & confidence.
          </p>

          <div className="d-flex gap-3">
            <span>Privacy Policy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
