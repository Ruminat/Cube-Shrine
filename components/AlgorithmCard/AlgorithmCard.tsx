import { memo, useCallback, useMemo, useState } from "react";
import { Copy, RotateCcw, SquareArrowOutUpRight } from "lucide-react";
import { Tooltip } from "@radix-ui/themes";
import { AlgorithmNotation } from "@/components/AlgorithmNotation/AlgorithmNotation";
import { MiniCube } from "@/components/MiniCube/MiniCube";
import { OllTopView } from "@/components/OllTopView/OllTopView";
import { PllTopView } from "@/components/PllTopView/PllTopView";
import { getCanonicalOllTopPatternFromNotation } from "@/lib/oll/getOllTopPatternFromNotation";
import { getPllTopViewFromNotation } from "@/lib/pll/getPllTopViewFromNotation";
import { invertNotationSequence, parseReversedNotation } from "@/lib/notation/parser";
import type { Algorithm } from "@/types/algorithm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CARD_CUBE_SIZE = 100;

interface AlgorithmCardProps {
  algorithm: Algorithm;
  isReversed: boolean;
  onClick: (algorithm: Algorithm) => void;
  onToggleReverse: () => void;
  useOllSpecialTopView?: boolean;
  usePllSpecialTopView?: boolean;
}

function AlgorithmCardComponent({
  algorithm,
  isReversed,
  onClick,
  onToggleReverse,
  useOllSpecialTopView = false,
  usePllSpecialTopView = false,
}: AlgorithmCardProps) {
  const displayNotation = useMemo(
    () => (isReversed ? invertNotationSequence(algorithm.notation) : algorithm.notation),
    [algorithm.notation, isReversed]
  );
  const notationRotations = useMemo(() => parseReversedNotation(displayNotation), [displayNotation]);
  const ollTopPattern = useMemo(() => {
    if (algorithm.category !== "OLL" || !useOllSpecialTopView) {
      return null;
    }
    return getCanonicalOllTopPatternFromNotation(displayNotation);
  }, [algorithm.category, displayNotation, useOllSpecialTopView]);
  const pllTopModel = useMemo(() => {
    if (algorithm.category !== "PLL" || !usePllSpecialTopView) {
      return null;
    }
    return getPllTopViewFromNotation(algorithm.id, displayNotation);
  }, [algorithm.category, algorithm.id, displayNotation, usePllSpecialTopView]);
  const [isCopied, setIsCopied] = useState(false);

  const handleOpenDialog = useCallback(() => onClick(algorithm), [algorithm, onClick]);
  const handleCopyNotation = useCallback(
    async (event: React.MouseEvent) => {
      event.stopPropagation();
      if (!navigator?.clipboard?.writeText) {
        return;
      }
      await navigator.clipboard.writeText(displayNotation);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 1400);
    },
    [displayNotation]
  );

  const handleReverseClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onToggleReverse();
    },
    [onToggleReverse]
  );

  const handleOpenClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      handleOpenDialog();
    },
    [handleOpenDialog]
  );

  const iconButtonClass = "size-8 shrink-0 cursor-pointer";

  return (
    <div
      className={cn(
        "group relative flex flex-row items-center gap-4 rounded-lg border border-border bg-card p-4",
        "shadow-sm transition-[border-color,box-shadow] hover:border-primary/50 hover:shadow-md"
      )}
    >
      <div className="flex size-[100px] shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted/50">
        {ollTopPattern ? (
          <OllTopView pattern={ollTopPattern} label={algorithm.name} size={CARD_CUBE_SIZE} />
        ) : pllTopModel ? (
          <PllTopView model={pllTopModel} label={algorithm.name} size={CARD_CUBE_SIZE} />
        ) : (
          <MiniCube deferUntilVisible size={CARD_CUBE_SIZE} preparationRotations={notationRotations} />
        )}
      </div>

      <div className="flex min-h-[100px] min-w-0 flex-1 flex-col justify-center gap-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="m-0 min-w-0 flex-1 text-sm font-semibold leading-snug text-foreground">{algorithm.name}</h3>
          <div className="flex shrink-0 items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
            <Tooltip content={isReversed ? "Show forward algorithm" : "Show reversed algorithm"}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(iconButtonClass, isReversed && "bg-accent")}
                aria-label={isReversed ? "Show forward algorithm" : "Show reversed algorithm"}
                aria-pressed={isReversed}
                onClick={handleReverseClick}
              >
                <RotateCcw className="size-4" />
              </Button>
            </Tooltip>
            <Tooltip content={isCopied ? "Copied!" : "Copy notation"}>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={iconButtonClass}
                aria-label={`Copy ${algorithm.name} notation`}
                onClick={handleCopyNotation}
              >
                <Copy className={cn("size-4", isCopied && "text-green-600 dark:text-green-500")} />
              </Button>
            </Tooltip>
            <Tooltip content="View details">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={iconButtonClass}
                aria-label={`Open ${algorithm.name} details`}
                onClick={handleOpenClick}
              >
                <SquareArrowOutUpRight className="size-4" />
              </Button>
            </Tooltip>
          </div>
        </div>

        <AlgorithmNotation notation={displayNotation} className="break-words text-xs text-muted-foreground" />
      </div>
    </div>
  );
}

export const AlgorithmCard = memo(AlgorithmCardComponent);
