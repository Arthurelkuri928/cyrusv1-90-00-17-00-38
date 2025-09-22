interface CyrusBackgroundProps {
  variant?: 'default' | 'intense' | 'subtle';
  children: React.ReactNode;
}

const CyrusBackground = ({ variant = 'default', children }: CyrusBackgroundProps) => {
  const getBackgroundStyles = () => {
    switch (variant) {
      case 'intense':
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0A0F1C] to-black"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(142,36,170,0.05),transparent_70%)]"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[700px] bg-gradient-radial from-[#8E24AA]/20 via-[#8E24AA]/8 to-transparent blur-3xl"></div>
            <div className="absolute top-1/3 right-0 w-[900px] h-[500px] bg-gradient-radial from-[#A64EFF]/15 via-[#A64EFF]/5 to-transparent blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-[700px] h-[400px] bg-gradient-radial from-[#4A148C]/12 via-[#4A148C]/4 to-transparent blur-3xl"></div>
          </>
        );
      case 'subtle':
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-[#8E24AA]/8 via-[#8E24AA]/3 to-transparent blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-gradient-radial from-[#A64EFF]/6 via-[#A64EFF]/2 to-transparent blur-3xl"></div>
          </>
        );
      default:
        return (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-radial from-[#8E24AA]/12 via-[#8E24AA]/4 to-transparent blur-3xl"></div>
            <div className="absolute top-1/3 right-0 w-[800px] h-[400px] bg-gradient-radial from-[#A64EFF]/8 via-[#A64EFF]/3 to-transparent blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[300px] bg-gradient-radial from-[#4A148C]/6 via-[#4A148C]/2 to-transparent blur-3xl"></div>
            <div className="absolute inset-0 bg-[radial-gradient(rgba(142,36,170,0.03)_1px,transparent_1px)] [background-size:50px_50px] opacity-30"></div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none">
        {getBackgroundStyles()}
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#8E24AA] rounded-full opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite ${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default CyrusBackground;