import React from "react";
interface WaveTransitionProps {
  fromColor?: string;
  toColor?: string;
  className?: string;
  inverted?: boolean;
}
const WaveTransition: React.FC<WaveTransitionProps> = ({
  fromColor = "black",
  toColor = "rgb(9, 9, 11)",
  className = "",
  inverted = false
}) => {
  return <div className={`relative w-full overflow-hidden ${className}`} style={{
    background: fromColor
  }}>
      
      
      {/* Enhanced gradient overlay for smoother transition */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{
      background: `linear-gradient(to ${inverted ? 'top' : 'bottom'}, ${fromColor}08 0%, transparent 40%, transparent 100%)`
    }}></div>
      
      {/* Additional subtle glow effect for more premium look */}
      {!inverted && <div className="absolute bottom-0 left-0 w-full h-12 pointer-events-none" style={{
      background: `radial-gradient(ellipse at center, ${toColor}15 0%, transparent 80%)`,
      transform: 'translateY(50%)'
    }}></div>}
    </div>;
};
export default WaveTransition;