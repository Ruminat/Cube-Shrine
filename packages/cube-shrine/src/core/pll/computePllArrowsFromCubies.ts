import type { Cubie } from "../cubieModel";
import { createSolvedCubies } from "../rotation";
import type { PllGridCell, PllTopArrow } from "./pllTopTypes";
import { cubieColorBagSignature, findCubie, uLayerDiagramSlots, xzToPllGridCell } from "./lastLayerCaseUtils";

const cellKey = (c: PllGridCell): string => `${c.row},${c.col}`;

const dirKey = (from: PllGridCell, to: PllGridCell): string => `${cellKey(from)}->${cellKey(to)}`;

/**
 * Builds PLL top-flat arrows from a **canonical** U-layer cubie state: each arrow runs from the center
 * of the slot where a cubie currently sits to the center of its solved home slot. Swap pairs become
 * double-headed segments; longer cycles use one-way arrows in listed order.
 */
export function computePllArrowsFromCubies(cubies: Cubie[]): PllTopArrow[] {
  const solved = createSolvedCubies();
  /** Multiset of face colors identifies each U non-center physical cubie uniquely on a 3×3. */
  const homeByColorBag = new Map<string, PllGridCell>();
  for (const { x, z } of uLayerDiagramSlots) {
    const sc = findCubie(solved, x, 1, z);
    if (!sc) continue;
    homeByColorBag.set(cubieColorBagSignature(sc), xzToPllGridCell(x, z));
  }

  const directed: { from: PllGridCell; to: PllGridCell }[] = [];
  for (const { x, z } of uLayerDiagramSlots) {
    const cur = findCubie(cubies, x, 1, z);
    if (!cur) continue;
    const bag = cubieColorBagSignature(cur);
    const home = homeByColorBag.get(bag);
    const here = xzToPllGridCell(x, z);
    if (!home || (home.row === here.row && home.col === here.col)) continue;
    directed.push({ from: here, to: home });
  }

  const used = new Set<string>();
  const arrows: PllTopArrow[] = [];
  for (const d of directed) {
    const k = dirKey(d.from, d.to);
    if (used.has(k)) continue;
    const rk = dirKey(d.to, d.from);
    const paired = directed.some((o) => dirKey(o.from, o.to) === rk);
    if (paired) {
      if (used.has(rk)) continue;
      used.add(k);
      used.add(rk);
      arrows.push({ from: d.from, to: d.to, doubleHeaded: true });
    } else {
      used.add(k);
      arrows.push({ from: d.from, to: d.to, doubleHeaded: false });
    }
  }
  return arrows;
}
