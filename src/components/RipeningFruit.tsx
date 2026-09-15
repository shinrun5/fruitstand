import { Fruit } from "@/lib/fruit";
import { ripenessFilter, ripenessStage } from "@/lib/ripeness";
import { FruitAvatar } from "./FruitAvatar";

interface Props {
  kind: Fruit;
  ripeness: number;
  size?: number;
  showStage?: boolean;
}

export function RipeningFruit({ kind, ripeness, size = 48, showStage = false }: Props) {
  const stage = ripenessStage(ripeness);
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="flex items-center justify-center rounded-full border-2 border-ink bg-paper transition-[filter] duration-500"
        style={{
          width: size + 16,
          height: size + 16,
          filter: ripenessFilter(ripeness),
        }}
      >
        <FruitAvatar kind={kind} size={size} />
      </div>
      {showStage && (
        <span className="font-heading text-[11px] font-bold text-muted-ink">
          {stage.emoji} {stage.label}
        </span>
      )}
    </div>
  );
}
