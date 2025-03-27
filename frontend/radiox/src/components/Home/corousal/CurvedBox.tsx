// CurvedBox.tsx
import React, { ReactNode } from 'react';
import './curvedBox.css';
import assistance from '../../../images/assistance.jpeg';
import collaborator from '../../../images/collaborator.jpeg';
import support from '../../../images/support.jpeg';

interface CurvedBoxProps {
  children: ReactNode;
}

const CurvedBox: React.FC = () => {
  return (
    <div className="container">
      {/* First Box */}
      <div className="curved-box">
        <div className="inner-box">
          {/* Include your image for the first box */}
          <img src={assistance} alt="Designed to be perfect collaborators with you" />
          {/* Include your text for the first box */}
          <p className="text-box">Designed to be perfect collaborators with you</p>
        </div>
      </div>

      {/* Second Box */}
      <div className="curved-box">
        <div className="inner-box">
          {/* Include your image for the second box */}
          <img src={collaborator} alt="AI-powered assistance for every care decision" />
          {/* Include your text for the first box */}
          <p className="text-box">AI-powered assistance for every care decision</p>
        </div>
      </div>

      {/* Third Box */}
      <div className="curved-box">
        <div className="inner-box">
          {/* Include your image for the third box */}
          <img src={support} alt="Deploy & scale anywhere with best in class support" />
          {/* Include your text for the first box */}
          <p className="text-box">Deploy & scale anywhere with best in class support</p>
        </div>
      </div>
    </div>
  );
};

export default CurvedBox;
