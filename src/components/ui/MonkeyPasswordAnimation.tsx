
import React, { useState, useEffect, useRef } from 'react';

interface MonkeyPasswordAnimationProps {
  isPasswordVisible: boolean;
  className?: string;
  isPasswordError?: boolean;
}

const MonkeyPasswordAnimation: React.FC<MonkeyPasswordAnimationProps> = ({
  isPasswordVisible,
  className = "",
  isPasswordError = false
}) => {
  const [faceRotation, setFaceRotation] = useState({ x: 0, y: 0 });
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [hasBeenFocused, setHasBeenFocused] = useState(false);
  const [isShakingHead, setIsShakingHead] = useState(false);
  const [isCoveringEars, setIsCoveringEars] = useState(false);
  const monkeyRef = useRef<HTMLDivElement>(null);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (monkeyRef.current) {
        const rect = monkeyRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate the angle to the mouse position
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        // More pronounced face rotation
        const maxRotation = 15; // Increased rotation range
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const rotationX = distance > 0 ? (deltaY / distance) * Math.min(distance / 8, maxRotation) : 0;
        const rotationY = distance > 0 ? (deltaX / distance) * Math.min(distance / 8, maxRotation) : 0;
        
        setFaceRotation({ x: -rotationX, y: rotationY });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Handle password error animation (shake head "no")
  useEffect(() => {
    if (isPasswordError && !isShakingHead) {
      setIsShakingHead(true);
      setTimeout(() => {
        setIsShakingHead(false);
      }, 1000);
    }
  }, [isPasswordError, isShakingHead]);

  // Listen for password field focus events
  useEffect(() => {
    const handlePasswordFocus = () => {
      setIsPasswordFocused(true);
      if (!hasBeenFocused) {
        setHasBeenFocused(true);
      }
    };
    const handlePasswordBlur = () => setIsPasswordFocused(false);

    const passwordInputs = document.querySelectorAll('input[type="password"], input[placeholder*="senha"], input[placeholder*="Senha"]');
    
    passwordInputs.forEach(input => {
      input.addEventListener('focus', handlePasswordFocus);
      input.addEventListener('blur', handlePasswordBlur);
    });

    return () => {
      passwordInputs.forEach(input => {
        input.removeEventListener('focus', handlePasswordFocus);
        input.removeEventListener('blur', handlePasswordBlur);
      });
    };
  }, [hasBeenFocused]);

  // Listen for Windows + H key combination when password is focused
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Windows + H (or Cmd + H on Mac)
      if ((e.metaKey || e.ctrlKey) && e.key === 'h' && isPasswordFocused) {
        e.preventDefault();
        setIsCoveringEars(true);
        setTimeout(() => {
          setIsCoveringEars(false);
        }, 2000); // Cover ears for 2 seconds
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPasswordFocused]);

  const styles = `
    .monkey-avatar {
      --sz-avatar: 120px;
      width: var(--sz-avatar);
      min-width: var(--sz-avatar);
      max-width: var(--sz-avatar);
      height: var(--sz-avatar);
      min-height: var(--sz-avatar);
      max-height: var(--sz-avatar);
      border: 2px solid #6b7280;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
      z-index: 2;
      perspective: 200px;
      position: relative;
      margin: 0 auto 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #f3f4f6, #e5e7eb);
      --sz-svg: calc(var(--sz-avatar) - 10px);
      transition: all 0.3s ease;
    }

    .monkey-avatar:hover {
      border-color: #9333ea;
      transform: scale(1.05);
    }

    .monkey-avatar svg {
      position: absolute;
      transition: transform 0.2s ease-in, opacity 0.1s;
      transform-origin: 50% 50%;
      height: var(--sz-svg);
      width: var(--sz-svg);
      pointer-events: none;
    }

    .monkey-avatar svg#monkey {
      z-index: 1;
      transition: transform 0.3s ease;
    }

    .monkey-avatar.shake-head svg#monkey {
      animation: shake-head-no 1s ease-in-out;
    }

    .monkey-avatar svg#monkey-hands {
      z-index: 2;
      transform-style: preserve-3d;
      transform: translateY(calc(var(--sz-avatar) / 1.25)) rotateX(-21deg);
      transition: all 0.3s ease;
    }

    .monkey-avatar.password-visible svg#monkey-hands {
      transform: translate3d(0, 0, 0) rotateX(0deg);
    }

    .monkey-avatar.first-time-curious svg#monkey-hands {
      animation: super-curious-hands 1.5s ease-in-out;
    }

    .monkey-avatar.covering-ears svg#monkey-hands {
      transform: translate3d(0, calc(var(--sz-avatar) / -2), 0) rotateX(0deg);
      animation: cover-ears 2s ease-in-out;
    }

    .monkey-avatar::before {
      content: "";
      border-radius: 45%;
      width: calc(var(--sz-svg) / 3.889);
      height: calc(var(--sz-svg) / 5.833);
      border: 0;
      border-bottom: calc(var(--sz-svg) * (4 / 100)) solid #3c302a;
      bottom: 25%;
      position: absolute;
      transition: all 0.3s ease;
      z-index: 3;
    }

    .monkey-avatar.password-visible::before {
      width: calc(var(--sz-svg) * (9 / 100));
      height: 0;
      border-radius: 50%;
      border-bottom: calc(var(--sz-svg) * (10 / 100)) solid #3c302a;
    }

    .monkey-avatar.first-time-curious::before {
      animation: super-curious-mouth 1.5s ease-in-out;
    }

    .monkey-avatar.covering-ears::before {
      width: calc(var(--sz-svg) / 6);
      height: calc(var(--sz-svg) / 6);
      border-radius: 50%;
      border-bottom: calc(var(--sz-svg) * (6 / 100)) solid #3c302a;
    }

    .monkey-eye-r,
    .monkey-eye-l {
      animation: blink 8s 1s infinite;
      transition: all 0.3s ease;
    }

    .monkey-avatar.password-visible .monkey-eye-r,
    .monkey-avatar.password-visible .monkey-eye-l {
      ry: 0.5;
      cy: 30;
      animation: none;
    }

    .monkey-avatar.first-time-curious .monkey-eye-r,
    .monkey-avatar.first-time-curious .monkey-eye-l {
      animation: super-curious-eyes 1.5s ease-in-out;
    }

    .monkey-avatar.covering-ears .monkey-eye-r,
    .monkey-avatar.covering-ears .monkey-eye-l {
      ry: 0.5;
      cy: 30;
      animation: none;
    }

    @keyframes blink {
      0%, 2%, 4%, 26%, 28%, 71%, 73%, 100% {
        ry: 4.5;
        cy: 31.7;
      }
      1%, 3%, 27%, 72% {
        ry: 0.5;
        cy: 30;
      }
    }

    @keyframes shake-head-no {
      0%, 100% {
        transform: rotateZ(0deg);
      }
      10%, 30%, 50%, 70%, 90% {
        transform: rotateZ(-15deg);
      }
      20%, 40%, 60%, 80% {
        transform: rotateZ(15deg);
      }
    }

    @keyframes super-curious-eyes {
      0% {
        ry: 4.5;
        cy: 31.7;
        rx: 3.5;
      }
      15% {
        ry: 6.5;
        cy: 29;
        rx: 4.5;
      }
      30% {
        ry: 7;
        cy: 28;
        rx: 5;
      }
      50% {
        ry: 6;
        cy: 29.5;
        rx: 4.2;
      }
      70% {
        ry: 6.8;
        cy: 28.5;
        rx: 4.8;
      }
      85% {
        ry: 5.5;
        cy: 30.5;
        rx: 4;
      }
      100% {
        ry: 4.5;
        cy: 31.7;
        rx: 3.5;
      }
    }

    @keyframes super-curious-hands {
      0% {
        transform: translateY(calc(var(--sz-avatar) / 1.25)) rotateX(-21deg);
      }
      20% {
        transform: translateY(calc(var(--sz-avatar) / 1.1)) rotateX(-5deg) rotateZ(10deg);
      }
      40% {
        transform: translateY(calc(var(--sz-avatar) / 1.15)) rotateX(-10deg) rotateZ(-8deg);
      }
      60% {
        transform: translateY(calc(var(--sz-avatar) / 1.08)) rotateX(-3deg) rotateZ(12deg);
      }
      80% {
        transform: translateY(calc(var(--sz-avatar) / 1.2)) rotateX(-15deg) rotateZ(-5deg);
      }
      100% {
        transform: translateY(calc(var(--sz-avatar) / 1.25)) rotateX(-21deg);
      }
    }

    @keyframes super-curious-mouth {
      0% {
        width: calc(var(--sz-svg) / 3.889);
        height: calc(var(--sz-svg) / 5.833);
        border-radius: 45%;
      }
      25% {
        width: calc(var(--sz-svg) / 6);
        height: calc(var(--sz-svg) / 6);
        border-radius: 50%;
      }
      50% {
        width: calc(var(--sz-svg) / 4);
        height: calc(var(--sz-svg) / 8);
        border-radius: 30%;
      }
      75% {
        width: calc(var(--sz-svg) / 5);
        height: calc(var(--sz-svg) / 5);
        border-radius: 50%;
      }
      100% {
        width: calc(var(--sz-svg) / 3.889);
        height: calc(var(--sz-svg) / 5.833);
        border-radius: 45%;
      }
    }

    @keyframes cover-ears {
      0% {
        transform: translate3d(0, calc(var(--sz-avatar) / 1.25), 0) rotateX(-21deg);
      }
      20% {
        transform: translate3d(0, calc(var(--sz-avatar) / -2.5), 0) rotateX(0deg);
      }
      80% {
        transform: translate3d(0, calc(var(--sz-avatar) / -2.5), 0) rotateX(0deg);
      }
      100% {
        transform: translate3d(0, calc(var(--sz-avatar) / 1.25), 0) rotateX(-21deg);
      }
    }
  `;

  const faceTransform = `rotateX(${faceRotation.x}deg) rotateY(${faceRotation.y}deg)`;

  return (
    <div className={`relative ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <div 
        ref={monkeyRef}
        className={`monkey-avatar ${isPasswordVisible ? 'password-visible' : ''} ${isPasswordFocused && !hasBeenFocused ? 'first-time-curious' : ''} ${isShakingHead ? 'shake-head' : ''} ${isCoveringEars ? 'covering-ears' : ''}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          viewBox="0 0 64 64"
          id="monkey"
          style={{ transform: faceTransform }}
        >
          <ellipse cx="53.7" cy="33" rx="8.3" ry="8.2" fill="#89664c"></ellipse>
          <ellipse cx="53.7" cy="33" rx="5.4" ry="5.4" fill="#ffc5d3"></ellipse>
          <ellipse cx="10.2" cy="33" rx="8.2" ry="8.2" fill="#89664c"></ellipse>
          <ellipse cx="10.2" cy="33" rx="5.4" ry="5.4" fill="#ffc5d3"></ellipse>
          <g fill="#89664c">
            <path d="m43.4 10.8c1.1-.6 1.9-.9 1.9-.9-3.2-1.1-6-1.8-8.5-2.1 1.3-1 2.1-1.3 2.1-1.3-20.4-2.9-30.1 9-30.1 19.5h46.4c-.7-7.4-4.8-12.4-11.8-15.2"></path>
            <path d="m55.3 27.6c0-9.7-10.4-17.6-23.3-17.6s-23.3 7.9-23.3 17.6c0 2.3.6 4.4 1.6 6.4-1 2-1.6 4.2-1.6 6.4 0 9.7 10.4 17.6 23.3 17.6s23.3-7.9 23.3-17.6c0-2.3-.6-4.4-1.6-6.4 1-2 1.6-4.2 1.6-6.4"></path>
          </g>
          <path d="m52 28.2c0-16.9-20-6.1-20-6.1s-20-10.8-20 6.1c0 4.7 2.9 9 7.5 11.7-1.3 1.7-2.1 3.6-2.1 5.7 0 6.1 6.6 11 14.7 11s14.7-4.9 14.7-11c0-2.1-.8-4-2.1-5.7 4.4-2.7 7.3-7 7.3-11.7" fill="#e0ac7e"></path>
          <g fill="#3b302a" className="monkey-eye-nose">
            <path d="m35.1 38.7c0 1.1-.4 2.1-1 2.1-.6 0-1-.9-1-2.1 0-1.1.4-2.1 1-2.1.6.1 1 1 1 2.1"></path>
            <path d="m30.9 38.7c0 1.1-.4 2.1-1 2.1-.6 0-1-.9-1-2.1 0-1.1.4-2.1 1-2.1.5.1 1 1 1 2.1"></path>
            <ellipse 
              cx="40.7" 
              cy="31.7" 
              rx="3.5" 
              ry="4.5" 
              className="monkey-eye-r"
            ></ellipse>
            <ellipse 
              cx="23.3" 
              cy="31.7" 
              rx="3.5" 
              ry="4.5" 
              className="monkey-eye-l"
            ></ellipse>
          </g>
        </svg>
        
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          viewBox="0 0 64 64"
          id="monkey-hands"
        >
          <path fill="#89664C" d="M9.4,32.5L2.1,61.9H14c-1.6-7.7,4-21,4-21L9.4,32.5z"></path>
          <path fill="#FFD6BB" d="M15.8,24.8c0,0,4.9-4.5,9.5-3.9c2.3,0.3-7.1,7.6-7.1,7.6s9.7-8.2,11.7-5.6c1.8,2.3-8.9,9.8-8.9,9.8s10-8.1,9.6-4.6c-0.3,3.8-7.9,12.8-12.5,13.8C11.5,43.2,6.3,39,9.8,24.4C11.6,17,13.3,25.2,15.8,24.8"></path>
          <path fill="#89664C" d="M54.8,32.5l7.3,29.4H50.2c1.6-7.7-4-21-4-21L54.8,32.5z"></path>
          <path fill="#FFD6BB" d="M48.4,24.8c0,0-4.9-4.5-9.5-3.9c-2.3,0.3,7.1,7.6,7.1,7.6s-9.7-8.2-11.7-5.6c-1.8,2.3,8.9,9.8,8.9,9.8s-10-8.1-9.7-4.6c0.4,3.8,8,12.8,12.6,13.8c6.6,1.3,11.8-2.9,8.3-17.5C52.6,17,50.9,25.2,48.4,24.8"></path>
        </svg>
      </div>
    </div>
  );
};

export default MonkeyPasswordAnimation;
