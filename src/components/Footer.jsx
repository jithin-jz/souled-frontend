import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-gray-400 py-6 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 text-center">

        {/* Brand */}
        <h2 className="text-base font-semibold text-white mb-3">
          THE SOULED STORE
        </h2>

        {/* Social Icons */}
        <div className="flex justify-center gap-6 text-xl mb-4">
          <a href="#" className="hover:text-white">
            <FaInstagram />
          </a>
          <a href="#" className="hover:text-white">
            <FaFacebookF />
          </a>
          <a href="#" className="hover:text-white">
            <FaWhatsapp />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} The Souled Store.
        </p>

      </div>
    </footer>
  );
};

export default Footer;
