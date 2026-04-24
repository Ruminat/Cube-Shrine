"use client";

import { useCallback, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AlgorithmGroup } from "@/components/AlgorithmGroup/AlgorithmGroup";
import { AlgorithmModal } from "@/components/AlgorithmModal/AlgorithmModal";
import { algorithms, getAlgorithmGroupsByCategory } from "@/data/algorithms";
import { ollSubgroupLabels, ollSubgroupOrder } from "@/data/oll.algs";
import { pllSubgroupLabels, pllSubgroupOrder } from "@/data/pll.algs";
import type { Algorithm, AlgorithmCategory } from "@/types/algorithm";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const categories: Array<AlgorithmCategory | "All"> = [
  "All",
  // "F2L",
  "OLL",
  "PLL",
];

function filterBySubgroup(list: Algorithm[], subgroupId: string | null) {
  if (!subgroupId) {
    return list;
  }
  return list.filter((a) => a.subgroupId === subgroupId);
}

export function AlgorithmGallery() {
  const [selectedCategory, setSelectedCategory] = useState<AlgorithmCategory | "All">("All");
  const [selectedSubgroup, setSelectedSubgroup] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Algorithm | null>(null);
  const [reversedById, setReversedById] = useState<Record<string, boolean>>({});

  const handleCloseModal = useCallback(() => {
    setSelected(null);
  }, []);

  const isAlgorithmReversed = useCallback(
    (algorithmId: string) => Boolean(reversedById[algorithmId]),
    [reversedById]
  );

  const handleToggleAlgorithmReverse = useCallback((algorithmId: string) => {
    setReversedById((prev) => ({ ...prev, [algorithmId]: !prev[algorithmId] }));
  }, []);

  const handleToggleSelectedReverse = useCallback(() => {
    if (!selected) return;
    handleToggleAlgorithmReverse(selected.id);
  }, [handleToggleAlgorithmReverse, selected]);

  const filteredAlgorithms = useMemo(() => {
    let list = algorithms;
    if (selectedCategory !== "All") {
      list = list.filter((a) => a.category === selectedCategory);
    }
    list = filterBySubgroup(list, selectedSubgroup);
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return list;
    }
    return list.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.notation.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
    );
  }, [selectedCategory, selectedSubgroup, searchQuery]);

  const groups = useMemo(
    () => getAlgorithmGroupsByCategory(filteredAlgorithms),
    [filteredAlgorithms]
  );

  const availableSubgroups = useMemo(() => {
    if (selectedCategory !== "OLL" && selectedCategory !== "PLL") {
      return [];
    }
    const source = algorithms.filter((a) => a.category === selectedCategory);
    const present = new Set(
      source.map((a) => a.subgroupId).filter((id): id is string => Boolean(id))
    );
    const order = selectedCategory === "OLL" ? ollSubgroupOrder : pllSubgroupOrder;
    const labels = selectedCategory === "OLL" ? ollSubgroupLabels : pllSubgroupLabels;
    return order
      .filter((id) => present.has(id))
      .map((id) => ({ id, title: labels[id as keyof typeof labels] }));
  }, [selectedCategory]);

  const handleCategoryChange = (category: AlgorithmCategory | "All") => {
    setSelectedCategory(category);
    setSelectedSubgroup(null);
  };

  const totalShown = filteredAlgorithms.length;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search algorithms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className="cursor-pointer px-4 py-1.5 transition-colors hover:bg-primary/80"
              onClick={() => handleCategoryChange(category)}
            >
              {category}
              {category !== "All" ? (
                <span className="ml-1.5 text-xs opacity-70">
                  ({algorithms.filter((a) => a.category === category).length})
                </span>
              ) : null}
            </Badge>
          ))}
        </div>

        {availableSubgroups.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <span className="mr-2 self-center text-sm text-muted-foreground">Subgroup:</span>
            <Badge
              variant={selectedSubgroup === null ? "secondary" : "outline"}
              className="cursor-pointer px-3 py-1 text-xs transition-colors"
              onClick={() => setSelectedSubgroup(null)}
            >
              All
            </Badge>
            {availableSubgroups.map((subgroup) => (
              <Badge
                key={subgroup.id}
                variant={selectedSubgroup === subgroup.id ? "secondary" : "outline"}
                className="cursor-pointer px-3 py-1 text-xs transition-colors"
                onClick={() => setSelectedSubgroup(subgroup.id)}
              >
                {subgroup.title}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {totalShown} algorithm{totalShown !== 1 ? "s" : ""}
      </div>

      {groups.length > 0 ? (
        <div className="space-y-8">
          {groups.map((group) => (
            <AlgorithmGroup
              key={group.category}
              group={group}
              onOpenAlgorithm={setSelected}
              isAlgorithmReversed={isAlgorithmReversed}
              onToggleAlgorithmReverse={handleToggleAlgorithmReverse}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 text-4xl">🔍</div>
          <h3 className="text-lg font-semibold text-foreground">No algorithms found</h3>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      )}

      <AlgorithmModal
        algorithm={selected}
        isReversed={selected ? isAlgorithmReversed(selected.id) : false}
        onClose={handleCloseModal}
        onToggleReverse={handleToggleSelectedReverse}
      />
    </div>
  );
}
