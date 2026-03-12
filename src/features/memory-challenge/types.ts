import type React from "react";

export interface CardType {
  id: string;
  colorClass: string;
  Icon: React.ElementType;
  isFlipped: boolean;
  isMatched: boolean;
  colorId: number;
}
