"use client";

import { useCallback, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AlgorithmModal } from "@/components/AlgorithmModal/AlgorithmModal";
import { NotationGroup } from "@/components/NotationGroup/NotationGroup";
import {
  notationCategoryGroups,
  notationCategoryOrder,
  notationMoves,
  type NotationCategoryId,
} from "@/data/notation-moves";
import type { Algorithm } from "@/types/algorithm";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const categories: Array<NotationCategoryId | "All"> = ["All", ...notationCategoryOrder];

export function NotationGallery() {
  const [selectedCategory, setSelectedCategory] = useState<NotationCategoryId | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selected, setSelected] = useState<Algorithm | null>(null);
  const [reversedById, setReversedById] = useState<Record<string, boolean>>({});

  const handleCloseModal = useCallback(() => {
    setSelected(null);
  }, []);

  const isMoveReversed = useCallback(
    (algorithmId: string) => Boolean(reversedById[algorithmId]),
    [reversedById],
  );

  const handleToggleMoveReverse = useCallback((algorithmId: string) => {
    setReversedById((prev) => ({ ...prev, [algorithmId]: !prev[algorithmId] }));
  }, []);

  const handleToggleSelectedReverse = useCallback(() => {
    if (!selected) return;
    handleToggleMoveReverse(selected.id);
  }, [handleToggleMoveReverse, selected]);

  const filteredMoves = useMemo(() => {
    let list = notationMoves;
    if (selectedCategory !== "All") {
      const categoryGroup = notationCategoryGroups.find((group) => group.id === selectedCategory);
      list = categoryGroup?.faceGroups.flatMap((faceGroup) => faceGroup.moves) ?? [];
    }
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return list;
    }
    return list.filter(
      (move) =>
        move.name.toLowerCase().includes(query) ||
        move.notation.toLowerCase().includes(query) ||
        move.description.toLowerCase().includes(query),
    );
  }, [selectedCategory, searchQuery]);

  const groups = useMemo(() => {
    const visibleIds = new Set(filteredMoves.map((move) => move.id));
    return notationCategoryGroups
      .filter((group) => selectedCategory === "All" || group.id === selectedCategory)
      .map((group) => ({
        ...group,
        faceGroups: group.faceGroups
          .map((faceGroup) => ({
            ...faceGroup,
            moves: faceGroup.moves.filter((move) => visibleIds.has(move.id)),
          }))
          .filter((faceGroup) => faceGroup.moves.length > 0),
      }))
      .filter((group) => group.faceGroups.length > 0);
  }, [filteredMoves, selectedCategory]);

  const totalShown = filteredMoves.length;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search moves..."
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
              onClick={() => setSelectedCategory(category)}
            >
              {category === "All" ? "All" : notationCategoryGroups.find((g) => g.id === category)?.title}
              {category !== "All" ? (
                <span className="ml-1.5 text-xs opacity-70">
                  (
                  {notationCategoryGroups.find((g) => g.id === category)?.faceGroups.reduce(
                    (count, faceGroup) => count + faceGroup.moves.length,
                    0,
                  )}
                  )
                </span>
              ) : (
                <span className="ml-1.5 text-xs opacity-70">({notationMoves.length})</span>
              )}
            </Badge>
          ))}
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {totalShown} move{totalShown !== 1 ? "s" : ""}
      </div>

      {groups.length > 0 ? (
        <div className="space-y-8">
          {groups.map((group) => (
            <NotationGroup
              key={group.id}
              group={group}
              onOpenMove={setSelected}
              isMoveReversed={isMoveReversed}
              onToggleMoveReverse={handleToggleMoveReverse}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 text-4xl">🔍</div>
          <h3 className="text-lg font-semibold text-foreground">No moves found</h3>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search query</p>
        </div>
      )}

      <AlgorithmModal
        algorithm={selected}
        isReversed={selected ? isMoveReversed(selected.id) : false}
        onClose={handleCloseModal}
        onToggleReverse={handleToggleSelectedReverse}
      />
    </div>
  );
}
