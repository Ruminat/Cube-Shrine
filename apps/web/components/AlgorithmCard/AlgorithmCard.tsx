import { memo, useCallback, useMemo, useState } from "react";
import { Copy, RotateCcw, SquareArrowOutUpRight } from "lucide-react";
import { IconButton, Tooltip } from "@radix-ui/themes";
import { AlgorithmNotation } from "@/components/AlgorithmNotation/AlgorithmNotation";
import { OllTopView } from "@/components/OllTopView/OllTopView";
import { PllTopView } from "@/components/PllTopView/PllTopView";
import { useOllTopFlatViewEnabled, usePllTopFlatViewEnabled } from "@/lib/client-storage/top-flat-view";
import { getAlgorithmPreviewRotations } from "@/lib/algorithm-preview-rotations";
import { invertNotationSequence, normalizeAlgorithm } from "@shreklabs/cube-shrine/core";
import { getPllTopViewFromNotation } from "@/lib/pll-top-view-from-source";
import { getCanonicalOllTopPatternFromNotation } from "@/lib/oll-canonical-top-pattern";
import { MiniCube } from "@shreklabs/cube-shrine/react";
import type { Algorithm } from "@/types/algorithm";
import { cn } from "@/lib/utils";

const CARD_MINI_CUBE_PX = 100;
const CARD_TOP_FLAT_PX = 76;

interface AlgorithmCardProps {
  algorithm: Algorithm;
  isReversed: boolean;
  onClick: (algorithm: Algorithm) => void;
  onToggleReverse: () => void;
}

function AlgorithmCardComponent({ algorithm, isReversed, onClick, onToggleReverse }: AlgorithmCardProps) {
  const ollTopFlat = useOllTopFlatViewEnabled();
  const pllTopFlat = usePllTopFlatViewEnabled();
  const useOllSpecialTopView = algorithm.category === "OLL" && ollTopFlat;
  const usePllSpecialTopView = algorithm.category === "PLL" && pllTopFlat;

  const normalizedForwardNotation = useMemo(
    () => normalizeAlgorithm(algorithm.notation) ?? algorithm.notation,
    [algorithm.notation],
  );
  const displayNotation = useMemo(() => {
    if (!isReversed) {
      return normalizedForwardNotation;
    }
    const reversedNotation = invertNotationSequence(normalizedForwardNotation);
    return normalizeAlgorithm(reversedNotation) ?? reversedNotation;
  }, [isReversed, normalizedForwardNotation]);
  const ollCanon = useMemo(() => {
    if (algorithm.category !== "OLL") {
      return null;
    }
    return getCanonicalOllTopPatternFromNotation(displayNotation);
  }, [algorithm.category, displayNotation]);
  const pllTopModel = useMemo(() => {
    if (algorithm.category !== "PLL") {
      return null;
    }
    return getPllTopViewFromNotation(algorithm.id, displayNotation);
  }, [algorithm.category, algorithm.id, displayNotation]);

  const notationRotations = useMemo(
    () => getAlgorithmPreviewRotations(algorithm, displayNotation, pllTopModel),
    [algorithm, displayNotation, pllTopModel],
  );
  const ollTopPattern = useMemo(() => {
    if (algorithm.category !== "OLL" || !useOllSpecialTopView || !ollCanon) {
      return null;
    }
    return ollCanon.pattern;
  }, [algorithm.category, useOllSpecialTopView, ollCanon]);
  const useTopFlatCanvas = Boolean(ollTopPattern ?? (usePllSpecialTopView && pllTopModel));
  const previewSlotPx = useTopFlatCanvas ? CARD_TOP_FLAT_PX : CARD_MINI_CUBE_PX;
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
    [displayNotation],
  );

  const handleReverseClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onToggleReverse();
    },
    [onToggleReverse],
  );

  const handleOpenClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      handleOpenDialog();
    },
    [handleOpenDialog],
  );

  return (
    <div
      className={cn(
        "group relative flex flex-row items-center gap-4 rounded-lg border border-border bg-card p-4",
        "shadow-sm transition-[border-color,box-shadow] hover:border-primary/50 hover:shadow-md",
      )}
    >
      <div
        className='flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted/50'
        style={{
          width: previewSlotPx,
          height: previewSlotPx,
          minWidth: previewSlotPx,
          minHeight: previewSlotPx,
        }}
      >
        {ollTopPattern ? (
          <OllTopView pattern={ollTopPattern} label={algorithm.name} size={CARD_TOP_FLAT_PX} />
        ) : usePllSpecialTopView && pllTopModel ? (
          <PllTopView model={pllTopModel} label={algorithm.name} size={CARD_TOP_FLAT_PX} />
        ) : (
          <MiniCube deferUntilVisible size={CARD_MINI_CUBE_PX} preparationRotations={notationRotations} />
        )}
      </div>

      <div className='flex min-w-0 flex-1 flex-col justify-center gap-2' style={{ minHeight: previewSlotPx }}>
        <div className='flex items-center justify-between gap-2'>
          <h3 className='m-0 min-w-0 flex-1 text-sm font-semibold leading-snug text-foreground'>{algorithm.name}</h3>
          <div className='flex shrink-0 items-center gap-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'>
            <Tooltip content={isReversed ? "Show forward algorithm" : "Show reversed algorithm"}>
              <IconButton
                type='button'
                variant='ghost'
                size='2'
                aria-label={isReversed ? "Show forward algorithm" : "Show reversed algorithm"}
                aria-pressed={isReversed}
                onClick={handleReverseClick}
              >
                <RotateCcw className='size-4' />
              </IconButton>
            </Tooltip>
            <Tooltip content={isCopied ? "Copied!" : "Copy notation"}>
              <IconButton
                type='button'
                variant='ghost'
                size='2'
                aria-label={`Copy ${algorithm.name} notation`}
                onClick={handleCopyNotation}
              >
                <Copy className={cn("size-4", isCopied && "text-green-600 dark:text-green-500")} />
              </IconButton>
            </Tooltip>
            <Tooltip content='View details'>
              <IconButton
                type='button'
                variant='ghost'
                size='2'
                aria-label={`Open ${algorithm.name} details`}
                onClick={handleOpenClick}
              >
                <SquareArrowOutUpRight className='size-4' />
              </IconButton>
            </Tooltip>
          </div>
        </div>

        <AlgorithmNotation notation={displayNotation} className='break-words text-xs text-muted-foreground' />
      </div>
    </div>
  );
}

export const AlgorithmCard = memo(AlgorithmCardComponent);
