
import React, { useState, useEffect } from 'react';

interface TreeFrogLoginAnimationProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const TreeFrogLoginAnimation: React.FC<TreeFrogLoginAnimationProps> = ({
  value,
  onChange,
  placeholder = "Enter password",
  className = ""
}) => {
  const [isTyping, setIsTyping] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (value.length > 0) {
      setIsTyping(true);
    } else {
      setIsTyping(false);
    }
  }, [value]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const styles = `
    .tree-frog-container {
      position: relative;
      width: 300px;
      height: 200px;
      margin: 0 auto;
    }

    .frog {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120px;
      height: 100px;
      background: linear-gradient(135deg, #4ade80, #22c55e);
      border-radius: 60px 60px 40px 40px;
      transition: all 0.3s ease;
    }

    .frog.typing {
      transform: translate(-50%, -45%) scale(1.05);
    }

    .frog::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 20px;
      width: 25px;
      height: 25px;
      background: #16a34a;
      border-radius: 50%;
      box-shadow: 50px 0 0 #16a34a;
    }

    .eyes {
      position: absolute;
      top: 15px;
      left: 15px;
      width: 35px;
      height: 35px;
    }

    .eye {
      position: absolute;
      width: 20px;
      height: 20px;
      background: white;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .eye.left {
      left: 0;
    }

    .eye.right {
      right: 0;
    }

    .eye::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 8px;
      height: 8px;
      background: #000;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .frog.typing .eye::after {
      transform: translate(-50%, -50%) translateX(-3px);
    }

    .hands {
      position: absolute;
      top: 60px;
      left: -20px;
      width: 160px;
      height: 30px;
    }

    .hand {
      position: absolute;
      width: 25px;
      height: 25px;
      background: #22c55e;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .hand.left {
      left: 0;
      transform: translateY(0);
    }

    .hand.right {
      right: 0;
      transform: translateY(0);
    }

    .frog.typing .hand.left {
      transform: translateY(-10px) rotate(-15deg);
      animation: typing 0.5s infinite alternate;
    }

    .frog.typing .hand.right {
      transform: translateY(-10px) rotate(15deg);
      animation: typing 0.5s infinite alternate reverse;
    }

    @keyframes typing {
      0% { transform: translateY(-10px) rotate(-15deg); }
      100% { transform: translateY(-15px) rotate(-25deg); }
    }

    .password-input {
      position: absolute;
      bottom: -50px;
      left: 50%;
      transform: translateX(-50%);
      width: 280px;
      padding: 12px 40px 12px 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.3s ease;
      background: white;
    }

    .password-input:focus {
      outline: none;
      border-color: #22c55e;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }

    .toggle-button {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s ease;
    }

    .toggle-button:hover {
      background: #f3f4f6;
    }

    .password-dots {
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 4px;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .password-dots.visible {
      opacity: 1;
    }

    .dot {
      width: 6px;
      height: 6px;
      background: #6b7280;
      border-radius: 50%;
      animation: bounce 1s infinite;
    }

    .dot:nth-child(2) {
      animation-delay: 0.1s;
    }

    .dot:nth-child(3) {
      animation-delay: 0.2s;
    }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(1); }
      40% { transform: scale(1.2); }
    }
  `;

  return (
    <div className={`relative ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      <div className="tree-frog-container">
        <div className={`frog ${isTyping ? 'typing' : ''}`}>
          <div className="eyes">
            <div className="eye left"></div>
            <div className="eye right"></div>
          </div>
          <div className="hands">
            <div className="hand left"></div>
            <div className="hand right"></div>
          </div>
        </div>

        <div className={`password-dots ${isTyping && !showPassword ? 'visible' : ''}`}>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>

        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="password-input"
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="toggle-button"
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
              <line x1="1" y1="1" x2="23" y2="23"/>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default TreeFrogLoginAnimation;
