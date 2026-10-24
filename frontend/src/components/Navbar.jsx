
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/logo/logo.png";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customer, setCustomer] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  useEffect(() => {
    const token = localStorage.getItem("customerToken");
    const savedCustomer = localStorage.getItem("customer");

    setIsLoggedIn(Boolean(token));

    try {
      setCustomer(savedCustomer ? JSON.parse(savedCustomer) : null);
    } catch {
      setCustomer(null);
    }

    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);

    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  const goToSection = (sectionId) => {
    setMenuOpen(false);

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
      return;
    }

    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("customerToken");
    localStorage.removeItem("customer");

    setIsLoggedIn(false);
    setCustomer(null);
    setMenuOpen(false);

    navigate("/customer/login");
  };

  const linkClass =
    "block rounded-lg px-3 py-2.5 text-left font-semibold text-[#68202b] transition hover:bg-[#f8f0df] hover:text-[#a06e2d]";

  const actionClass =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition";

  const isLoginPage =
    location.pathname === "/login" ||
    location.pathname === "/customer/login";

  return (
    <nav className="relative z-50 w-full border-b border-[#e4d2ad] bg-[#fffdf7] shadow-sm">
      {/* Main navigation */}
      <div className="mx-auto flex min-h-[76px] max-w-screen-2xl items-center justify-between gap-3 px-4 sm:px-6 lg:min-h-[88px] lg:px-8">
        {/* Brand */}
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex min-w-0 items-center gap-2 sm:gap-3"
        >
          <img
            src={logo}
            alt="Shree Ladli logo"
            className="h-11 w-11 shrink-0 object-contain sm:h-14 sm:w-14 lg:h-16 lg:w-16"
          />

          <div className="min-w-0">
            <h1 className="whitespace-nowrap font-serif text-lg font-bold leading-tight text-[#68202b] sm:text-2xl lg:text-3xl">
              Shree Ladli
            </h1>
            <p className="text-[10px] tracking-wide text-[#9a7540] sm:text-xs sm:tracking-wider">
              Sweets &amp; Snacks
            </p>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-4 text-sm xl:flex 2xl:gap-6">
          <Link
            to="/"
            className="font-semibold text-[#68202b] transition hover:text-[#a06e2d]"
          >
            Home
          </Link>

          <button
            onClick={() => goToSection("about")}
            className="font-semibold text-[#68202b] transition hover:text-[#a06e2d]"
          >
            About Us
          </button>

          <Link
            to="/menu"
            className="font-semibold text-[#68202b] transition hover:text-[#a06e2d]"
          >
            Menu
          </Link>

          <button
            onClick={() => goToSection("categories")}
            className="font-semibold text-[#68202b] transition hover:text-[#a06e2d]"
          >
            Categories
          </button>

          <button
            onClick={() => goToSection("contact")}
            className="font-semibold text-[#68202b] transition hover:text-[#a06e2d]"
          >
            Contact
          </button>
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 2xl:flex">
          {isLoggedIn && (
            <Link
              to="/my-orders"
              className={`${actionClass} border border-[#d8c39a] text-[#68202b] hover:bg-[#f8f0df]`}
            >
              📦 My Orders
            </Link>
          )}

          <Link
            to="/cart"
            className={`${actionClass} bg-[#68202b] text-white hover:bg-[#50151f]`}
          >
            🛒 Cart
            {cartCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e6c77e] px-1 text-xs font-bold text-[#50151f]">
                {cartCount}
              </span>
            )}
          </Link>

          {isLoggedIn ? (
            <>
              <span className="max-w-28 truncate text-sm font-semibold text-[#68202b]">
                Hi, {customer?.name || "Customer"}
              </span>

              <button
                onClick={handleLogout}
                className={`${actionClass} border border-red-200 text-red-700 hover:bg-red-50`}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={`${actionClass} border border-[#d8c39a] text-[#68202b] hover:bg-[#f8f0df]`}
            >
              Login
            </Link>
          )}

          <Link
            to="/menu"
            className={`${actionClass} bg-[#b38b45] text-white hover:bg-[#967033]`}
          >
            Order Now
          </Link>
        </div>

        {/* Mobile and tablet actions */}
        <div className="flex shrink-0 items-center gap-2 2xl:hidden">
          <Link
            to="/cart"
            aria-label={`Cart, ${cartCount} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#68202b] text-lg text-white"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e6c77e] px-1 text-xs font-bold text-[#50151f]">
                {cartCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((previous) => !previous)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e4d2ad] text-xl text-[#68202b] transition hover:bg-[#f8f0df]"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile and tablet dropdown */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full max-h-[75vh] overflow-y-auto border-b border-[#e4d2ad] bg-[#fffdf7] px-4 py-4 shadow-xl xl:hidden">
          <div className="mx-auto flex max-w-screen-md flex-col gap-1">
            <Link to="/" className={linkClass}>
              Home
            </Link>

            <button
              onClick={() => goToSection("about")}
              className={linkClass}
            >
              About Us
            </button>

            <Link to="/menu" className={linkClass}>
              Menu
            </Link>

            <button
              onClick={() => goToSection("categories")}
              className={linkClass}
            >
              Categories
            </button>

            <button
              onClick={() => goToSection("contact")}
              className={linkClass}
            >
              Contact
            </button>

            {isLoggedIn && (
              <Link to="/my-orders" className={linkClass}>
                📦 My Orders
              </Link>
            )}

            {isLoggedIn ? (
              <>
                <p className="px-3 py-2 text-sm text-[#786d63]">
                  Hi, {customer?.name || "Customer"}
                </p>

                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-red-200 px-4 py-3 text-left font-semibold text-red-700 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="my-1 rounded-xl border border-[#d8c39a] px-4 py-3 text-center font-semibold text-[#68202b] hover:bg-[#f8f0df]"
              >
                Login
              </Link>
            )}

            <Link
              to="/menu"
              className="mt-2 rounded-xl bg-[#68202b] px-4 py-3 text-center font-bold text-white transition hover:bg-[#50151f]"
            >
              Order Now
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
