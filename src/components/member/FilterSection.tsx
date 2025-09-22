
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";

interface FilterOption {
  id: string;
  name: string;
}

interface FilterSectionProps {
  filters: FilterOption[];
  onFilterChange?: (selectedFilter: string) => void;
}

const FilterSection = ({ filters, onFilterChange }: FilterSectionProps) => {
  const [activeFilter, setActiveFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'on' | 'off'>('all');

  const handleFilterClick = (filterId: string) => {
    const newFilter = activeFilter === filterId ? '' : filterId;
    setActiveFilter(newFilter);
    if (onFilterChange) {
      onFilterChange(newFilter);
    }
  };

  const handleStatusChange = (status: 'all' | 'on' | 'off') => {
    setStatusFilter(status);
    // You would typically call a parent function here to update the filtered content
  };

  return (
    <div className="mb-4 space-y-4">
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-1 px-1">
        {filters.map(filter => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            size="sm"
            className={activeFilter === filter.id 
              ? "bg-purple-600 hover:bg-purple-700 text-white border-none rounded-full" 
              : "bg-zinc-800 text-white border-none hover:bg-zinc-700 rounded-full"
            }
            onClick={() => handleFilterClick(filter.id)}
          >
            {filter.name}
          </Button>
        ))}
      </div>
      
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <Filter size={16} className="text-zinc-400" />
          <span className="text-zinc-400 text-sm">Status:</span>
        </div>
        <Button
          variant={statusFilter === 'all' ? "default" : "outline"}
          size="sm"
          className={`${statusFilter === 'all' ? "bg-purple-600 hover:bg-purple-700" : "bg-zinc-800 hover:bg-zinc-700"} text-white border-none rounded-full`}
          onClick={() => handleStatusChange('all')}
        >
          All
        </Button>
        <Button
          variant={statusFilter === 'on' ? "default" : "outline"}
          size="sm"
          className={`${statusFilter === 'on' ? "bg-purple-600 hover:bg-purple-700" : "bg-zinc-800 hover:bg-zinc-700"} text-white border-none rounded-full`}
          onClick={() => handleStatusChange('on')}
        >
          <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
          Online
        </Button>
        <Button
          variant={statusFilter === 'off' ? "default" : "outline"}
          size="sm"
          className={`${statusFilter === 'off' ? "bg-purple-600 hover:bg-purple-700" : "bg-zinc-800 hover:bg-zinc-700"} text-white border-none rounded-full`}
          onClick={() => handleStatusChange('off')}
        >
          <div className="h-2 w-2 bg-red-500 rounded-full mr-2"></div>
          Offline
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;
