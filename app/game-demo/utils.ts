export type PointTotals = { [team: string]: number };
export function calculatePointTotals(
  data: { team: string; name: string; points: number }[]
): PointTotals {
  const pointTotals: PointTotals = {};

  for (const { team, points } of data) {
    if (pointTotals[team]) {
      pointTotals[team] += points;
    } else {
      pointTotals[team] = points;
    }
  }

  return pointTotals;
}

export function getColorName(tailwindColor: string): string {
    return tailwindColor
      .replace("bg-", "")
      .replace("-500", "")
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }

export function colorNameToColor(color: string | undefined, tailwind?: boolean): string {
    if (!color) {
        return '#ffffff';
    }
    let simpleName = color;
    if (simpleName.includes('-')) {
        simpleName = getColorName(color);
    }
    switch (simpleName) {
        case 'Red':
            return tailwind ? 'text-red-500' : '#ef4444';
        case 'Yellow':
            return tailwind ? 'text-yellow-500' : '#eab308';
        case 'Green':
            return tailwind ? 'text-green-500' : '#22c55e';
        case 'Blue':
            return tailwind ? 'text-sky-500' : '#0ea5e9';
    }
    return '#ffffff';
}