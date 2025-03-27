import React from 'react';
import { Link } from 'react-router-dom';
import './contactus.css';
import greenTickImage from '../../../images/greentick.png'; // Import the image
import navlogo from '../../../images/Radiox-logo.png';

const ContactPage: React.FC = () => {
  return (
    <div className="contact-page">
      {/* Container 1 */}
      <div className="container1">
      <Link to="/">
        <img src={navlogo} alt="RadioX Logo" className="radiox-logo" />
        </Link>
        <img src={greenTickImage} alt="Green Tick" className="green-tick" />
        <div className="big-text">We are open to conversation</div>
        <div className="get-in-touch">Get in touch with us.</div>
      </div>

      {/* Container 2 */}
      <div className="container2">
        <div className="help-text">How can we help you?</div>

        {/* Form */}
        <div className="form-container">
          <div className="left-column">
            <input type="text" id="firstName" name="firstName" placeholder="First Name" />

            <input type="text" id="lastName" name="lastName" placeholder="Last Name" />

            <input type="text" id="email" name="email" placeholder="Email" />
          </div>

          <div className="right-column">  
            <input type="text" id="phone" name="phone" placeholder="Phone Number" />

            <input type="text" id="city" name="city" placeholder="City" />

            <input type="text" id="country" name="country" placeholder="Country" />
          </div>
        </div>

        <textarea id="comments" name="comments" rows={4} placeholder="Other Comments"></textarea>

        <button className="submit-button" type="submit">
          Submit
        </button>
      </div>
    </div>
  );
};

export default ContactPage;
