// Footer.jsx - Enhanced
import "./Footer.css";
import { FaCopyright, FaHeart } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="billing-footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="footer-text">
            <FaCopyright className="footer-icon" />
            <span>{currentYear} StormSofts Technology</span>
          </div>
          <div className="footer-message">
            Professional Billing Software Solution
          </div>
        </div>
        
        <div className="footer-right">
          <div className="footer-links">
            <a href="/privacy" className="footer-link">Privacy Policy</a>
            <a href="/terms" className="footer-link">Terms of Service</a>
            <a href="/support" className="footer-link">Support</a>
          </div>
          <div className="footer-credit">
            Made with <FaHeart className="heart-icon" /> for businesses
          </div>
        </div>
      </div>
    </footer>
  );
}