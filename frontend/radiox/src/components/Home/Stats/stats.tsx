import React, { useEffect, useRef, useState, useCallback } from 'react';
import './stats.css';

const ImpactSection: React.FC = () => {
  const [count, setCount] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const startCounting = useCallback(() => {
    if (count < 10) {
      setCount((prevCount) => prevCount + 1);
    } else {
      clearInterval(intervalId ?? undefined);
    }
  }, [count]);

  let intervalId: NodeJS.Timeout | null = null; // Declare intervalId here

  useEffect(() => {
    const sectionNode = sectionRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          intervalId = setInterval(startCounting, 200);
        }
      },
      { threshold: 0.5 } // Adjust the threshold as needed
    );

    if (sectionNode) {
      observer.observe(sectionNode);
    }

    return () => {
      if (sectionNode) {
        observer.unobserve(sectionNode);
      }

      clearInterval(intervalId ?? undefined); // Clear the interval on component unmount
    };
  }, [startCounting]);

  return (
    <section className="impact-section" ref={sectionRef}>
      <div className="impact-block1">
        <span>+{count}M</span>
        <p>
          Lives impacted <br /> annually in 1800+ sites <br /> across 80+ countries
          <br />
          <a href="#view-impact">View Impact Stories →</a>
        </p>
      </div>

      <div className="impact-block2">
        <span>40%</span>
        <p>
          Reduction in <br /> turnaround time using <br /> normal-abnormal triage
          <br />
          <a href="#read-products">Read about our products →</a>
        </p>
      </div>

      <div className="impact-block3">
        <span>+1B</span>
        <p>
          Unprecedented data <br /> set to train the industry <br /> leading algorithms
          <br />
          <a href="#read-evidence">Read our Evidence →</a>
        </p>
      </div>
    </section>
  );
};

export default ImpactSection;
