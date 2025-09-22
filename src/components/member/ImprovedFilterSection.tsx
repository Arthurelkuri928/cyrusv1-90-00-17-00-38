
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Filter {
  id: string;
  name: string;
}

interface FilterProps {
  filters: Filter[];
  onFilterChange: (filter: string) => void;
}

const ImprovedFilterSection = ({ filters, onFilterChange }: FilterProps) => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const handleFilterClick = (filterId: string) => {
    const newFilter = activeFilter === filterId ? null : filterId;
    setActiveFilter(newFilter);
    onFilterChange(newFilter || "all");
  };

  const handleStatusChange = (status: string) => {
    const newStatus = statusFilter === status ? null : status;
    setStatusFilter(newStatus);
    // In a real app, this would trigger a filtering action
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button
          variant="ghost"
          size="sm"
          className={`rounded-full border border-zinc-800 px-4 py-1 text-sm transition-all duration-300 ${
            !activeFilter
              ? "bg-purple-600 border-purple-500 text-white"
              : "bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          }`}
          onClick={() => handleFilterClick("")}
        >
          Todos
        </Button>

        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant="ghost"
            size="sm"
            className={`rounded-full border border-zinc-800 px-4 py-1 text-sm transition-all duration-300 ${
              activeFilter === filter.id
                ? "bg-purple-600 border-purple-500 text-white"
                : "bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            }`}
            onClick={() => handleFilterClick(filter.id)}
          >
            {filter.name}
          </Button>
        ))}

        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:bg-zinc-800 hover:text-white px-4 py-1 text-sm"
              >
                {t("filters")} {statusFilter && "✓"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-white">
              <DropdownMenuLabel>{t("status")}</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-zinc-800" />
              <DropdownMenuCheckboxItem
                checked={statusFilter === "on"}
                onCheckedChange={() => handleStatusChange("on")}
                className="hover:bg-purple-900/20"
              >
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  {t("active")}
                </span>
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === "off"}
                onCheckedChange={() => handleStatusChange("off")}
                className="hover:bg-purple-900/20"
              >
                <span className="flex items-center">
                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2"></span>
                  {t("inactive")}
                </span>
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default ImprovedFilterSection;
