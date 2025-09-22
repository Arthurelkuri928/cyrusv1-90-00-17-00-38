
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { staticToolsData } from "@/data/staticToolsData";

interface CatalogSectionProps {
  addSectionRef?: (index: number) => (el: HTMLElement | null) => void;
}

const CatalogSection = ({ addSectionRef }: CatalogSectionProps) => {
  // Organize tools into groups of 20 (5x4 grid per carousel item)
  const toolsPerPage = 20;
  const toolGroups = [];
  for (let i = 0; i < staticToolsData.length; i += toolsPerPage) {
    toolGroups.push(staticToolsData.slice(i, i + toolsPerPage));
  }

  return (
    <section 
      ref={addSectionRef ? addSectionRef(1) : undefined}
      className="relative py-24 px-6 md:px-12 lg:px-24 bg-black text-white border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Catálogo de Acesso</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-4">
            +40 ferramentas profissionais. Organizadas. Ativas. Testadas.
          </p>
          <p className="text-md text-gray-400 max-w-2xl mx-auto">
            Busque por IA, espionagem, mineração, SEO, criativos, streaming e mais.
          </p>
        </div>
        
        {/* Tools carousel in 5x4 grid format with gradient overlay */}
        <div className="relative">
          <Carousel 
            opts={{
              align: "start",
              loop: false,
              dragFree: true
            }} 
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {toolGroups.map((toolGroup, groupIndex) => (
                <CarouselItem key={groupIndex} className="pl-4 md:pl-6 basis-full">
                  <div className="grid grid-cols-4 md:grid-cols-5 gap-4 md:gap-6">
                    {toolGroup.map(tool => (
                      <div 
                        key={tool.id} 
                        className="relative rounded-lg overflow-hidden h-[110px] cursor-default" 
                        style={{ backgroundColor: tool.bgColor || "#111" }}
                      >
                        {/* Card layout */}
                        <div className="flex h-full">
                          {/* Logo side */}
                          <div className="w-2/5 flex items-center justify-center p-3 border-r border-white/10 relative">
                            {tool.logoImage ? (
                              <div className="flex items-center justify-center w-full h-full">
                                <img 
                                  src={tool.logoImage} 
                                  alt={tool.title} 
                                  className="max-w-[85%] max-h-[85%] object-contain" 
                                />
                              </div>
                            ) : (
                              <div className={`text-4xl font-bold flex items-center justify-center ${tool.textColor === 'white' ? 'text-white' : 'text-black'}`}>
                                {tool.title.charAt(0)}
                              </div>
                            )}
                          </div>
                          
                          {/* Content side */}
                          <div className="w-3/5 flex flex-col justify-center p-4 relative">
                            <h3 className={`text-lg font-bold ${tool.textColor === 'white' ? 'text-white' : 'text-black'} line-clamp-1`}>
                              {tool.title}
                            </h3>
                            
                            <div className={`text-xs mt-1 ${tool.textColor === 'white' ? 'text-white/70' : 'text-black/70'}`}>
                              {tool.category}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {/* Fill empty slots if needed to maintain grid structure */}
                    {Array.from({ length: toolsPerPage - toolGroup.length }).map((_, index) => (
                      <div key={`empty-${index}`} className="h-[110px] opacity-0" />
                    ))}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Gradient overlays for smooth edge fade */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
            
          </Carousel>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Cada ferramenta aqui foi selecionada com um critério: precisão funcional.
          </p>
          <p className="text-lg text-gray-300 font-semibold mt-2 max-w-2xl mx-auto">
            Você não perde tempo — você executa.
          </p>
        </div>
      </div>
      
      {/* Background effects */}
      <div className="absolute top-20 right-10 w-80 h-80 bg-[#8E24AA]/10 rounded-full filter blur-[100px]"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-[#B388FF]/10 rounded-full filter blur-[80px]"></div>
    </section>
  );
};

export default CatalogSection;
