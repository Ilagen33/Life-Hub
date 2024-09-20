import React, { useState, useEffect } from 'react';

const Typewriter = ({ text, speed }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [index, text, speed]);

  return (
    <div className="typewriter">
      {displayedText}
      <span className="cursor">|</span>
    </div>
  );
};

export default Typewriter;
