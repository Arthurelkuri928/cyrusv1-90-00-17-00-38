import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import ContentCard, { ContentCardProps } from "./ContentCard";
interface ContentRowProps {
  title: string;
  items: ContentCardProps[];
  filters?: React.ReactNode;
}
const ContentRow = ({
  title,
  items,
  filters
}: ContentRowProps) => {
  return <section className="mb-12 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-medium">{title}</h2>
          {filters && filters}
        </div>
        
        <Carousel className="mx-auto">
          <CarouselContent className="-ml-4">
            {items.map(item => <CarouselItem key={item.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                <ContentCard {...item} />
              </CarouselItem>)}
          </CarouselContent>
          <CarouselPrevious className="left-2 bg-black/50 hover:bg-black/70 border-none text-gray-50" />
          <CarouselNext className="right-2 bg-black/50 hover:bg-black/70 text-white border-none" />
        </Carousel>
      </div>
    </section>;
};
export default ContentRow;