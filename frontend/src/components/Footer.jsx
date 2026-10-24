
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer
      id="contact"
      className="scroll-mt-24 bg-gradient-to-br from-orange-950 via-orange-900 to-amber-950 px-5 py-12 text-white sm:px-8"
    >
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-3">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-extrabold text-amber-300">
            Shree Ladli
          </h2>
          <p className="mt-1 text-sm text-orange-100">
            Sweets &amp; Snacks
          </p>
          <p className="mt-4 max-w-sm leading-7 text-orange-100/80">
            Fresh sweets, delicious snacks and authentic Indian taste,
            prepared every day with love.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-bold text-amber-300">
            Quick Links
          </h3>
          <div className="mt-4 flex flex-col items-start gap-3 text-orange-100/90">
            <Link to="/" className="transition hover:text-amber-300">
              Home
            </Link>
            <Link to="/menu" className="transition hover:text-amber-300">
              Our Menu
            </Link>
            <Link to="/cart" className="transition hover:text-amber-300">
              Shopping Cart
            </Link>
            <Link to="/my-orders" className="transition hover:text-amber-300">
              My Orders
            </Link>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-bold text-amber-300">
            Contact Us
          </h3>
          <div className="mt-4 space-y-3 text-orange-100/90">
            <p>
              <span className="mr-2">📍</span>
              Visit Shree Ladli Sweets &amp; Snacks
            </p>
            <p className="text-sm leading-6 text-orange-100/70">
              For shop location and contact details, please contact us
              directly.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl border-t border-orange-700/70 pt-6 text-center text-sm text-orange-100/70">
        © {new Date().getFullYear()} Shree Ladli Sweets &amp; Snacks.
        All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
