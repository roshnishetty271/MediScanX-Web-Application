// MainSections.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";
import twitterIcon from "../../../images/twitter-icon.png"
import InstagramIcon from "../../../images/Instagram.jpg"
import facebookIcon from "../../../images/facebook.jpg"
import youtubeIcon from "../../../images/youtube.jpg"
import navlogo from '../../../images/Mediscanx-logo.png';

const FooterSections: React.FC = () => {
  return (
    <div className="footer-sections-container">
      
      <section className="footer-section">
        
        <img src={navlogo} alt="Qure Logo" width={50} height={'auto'} />
        <p>MediScanX Health Platform</p>
        <p className="footer-qure-para">
          MediScanX was founded in 2023. Our mission is to use technology to make healthcare more accessible and affordable.
        </p>
        
        <div className="footer-follow-us">
          <p>Follow us</p>
          <div className="footer-icons-container">
            
            <a href="https://twitter.com/example" target="_blank" rel="noopener noreferrer">
              <img src={twitterIcon} alt="Twitter" className="footer-icon" />
            </a>

            
            <a href="https://www.linkedin.com/company/example" target="_blank" rel="noopener noreferrer">
              <img src={InstagramIcon} alt="Instagram" className="footer-icon" />
            </a>

           
            <a href="https://www.facebook.com/example" target="_blank" rel="noopener noreferrer">
              <img src={facebookIcon} alt="Facebook" className="footer-icon" />
            </a>

            
            <a href="https://www.youtube.com/c/example" target="_blank" rel="noopener noreferrer">
              <img src={youtubeIcon} alt="YouTube" className="footer-icon" />
            </a>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="footer-section footer-products">
        <h2>Products</h2>
        <ul>
          <li><Link to="/chest-x-ray-reporting">Chest X-ray Reporting</Link></li>
          <li><Link to="/tb-care-cascades">TB Care Cascades</Link></li>
          <li><Link to="/lung-nodule-management">Lung Nodule Management</Link></li>
          <li><Link to="/stroke-tbi">Stroke & TBI</Link></li>
          <li><Link to="/msk-x-ray-reporting">MSK X-Ray Reporting</Link></li>
          <li><Link to="/heart-failure">Heart Failure</Link></li>
          <li><Link to="/qure-ai-app">MediScanX App</Link></li>
        </ul>
      </section>

      {/* About Section */}
      <section className="footer-section footer-about">
        <h2>About</h2>
        <ul>
          <li><Link to="/about-us">About Us</Link></li>
          <li><Link to="/our-team">Our Team</Link></li>
          <li><Link to="/our-investors">Our Investors</Link></li>
          <li><Link to="/contact-us">Contact Us</Link></li>
        </ul>
      </section>

      {/* Knowledge Center Section */}
      <section className="footer-section footer-knowledge">
        <h2>Knowledge Center</h2>
        <ul>
          <li><Link to="/news-and-press">News and Press</Link></li>
          <li><Link to="/impact">Impact</Link></li>
          <li><Link to="/evidence">Evidence</Link></li>
          <li><Link to="/blogs">Blogs</Link></li>
          <li><Link to="/webinars">Webinars</Link></li>
        </ul>
      </section>
    </div>
  );
};

export default FooterSections;
