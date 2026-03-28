import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type BetSelection = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  leagueName: string;
  oddLabel: string;
  oddValue: number;
};

type BetSlipContextType = {
  selections: BetSelection[];
  toggle: (selection: BetSelection) => void;
  isSelected: (id: string) => boolean;
  count: number;
  clear: () => void;
};

const BetSlipContext = createContext<BetSlipContextType | null>(null);

export function BetSlipProvider({ children }: { children: ReactNode }) {
  const [selections, setSelections] = useState<BetSelection[]>([]);

  const toggle = useCallback((selection: BetSelection) => {
    setSelections((prev) => {
      const exists = prev.some((s) => s.id === selection.id);
      if (exists) return prev.filter((s) => s.id !== selection.id);
      // Remove any other odd already selected for the same match, then add new one
      const withoutSameMatch = prev.filter((s) => !(s.homeTeam === selection.homeTeam && s.awayTeam === selection.awayTeam));
      return [...withoutSameMatch, selection];
    });
  }, []);

  const isSelected = useCallback(
    (id: string) => selections.some((s) => s.id === id),
    [selections],
  );

  const clear = useCallback(() => setSelections([]), []);

  return (
    <BetSlipContext.Provider value={{ selections, toggle, isSelected, count: selections.length, clear }}>
      {children}
    </BetSlipContext.Provider>
  );
}

export function useBetSlip() {
  const ctx = useContext(BetSlipContext);
  if (!ctx) throw new Error("useBetSlip must be used within BetSlipProvider");
  return ctx;
}
