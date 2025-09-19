import React, { useEffect, useState } from "react";
import "./Background.css";

type Bubble = {
  id: number;
  size: number;
  left: number;
  duration: number;
  delay: number;
};

const bubbleCount = 40; // number of bubbles at a time

const Background: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const generatedBubbles: Bubble[] = Array.from({ length: bubbleCount }, (_, i) => ({
      id: i,
      size: 15 + Math.random() * 30,
      left: Math.random() * 100,
      duration: 10 + Math.random() * 15, // speed of float
      delay: Math.random() * 10,        // stagger start
    }));
    setBubbles(generatedBubbles);
  }, []);

  return (
    <div className="wc-bg-container">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="wc-bg-bubble"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default Background;
