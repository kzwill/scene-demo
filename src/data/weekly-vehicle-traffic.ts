export interface DailyVehicleTraffic {
  date: string;
  entries: number;
  exits: number;
}

// 演示用的日通行量，从最早一天排到今天；目前未接入道闸数据。
const demoCounts = [
  { entries: 72, exits: 64 },
  { entries: 84, exits: 76 },
  { entries: 96, exits: 88 },
  { entries: 80, exits: 83 },
  { entries: 86, exits: 74 },
  { entries: 100, exits: 92 },
  { entries: 65, exits: 54 },
];

export function getWeeklyVehicleTraffic(today = new Date()): DailyVehicleTraffic[] {
  return demoCounts.map((counts, index) => {
    const day = new Date(today);
    day.setDate(day.getDate() - (demoCounts.length - 1 - index));

    return { date: `${day.getMonth() + 1}/${day.getDate()}`, ...counts };
  });
}

export function sumVehicleTraffic(days: readonly DailyVehicleTraffic[]) {
  return days.reduce(
    (total, { entries, exits }) => ({ entries: total.entries + entries, exits: total.exits + exits }),
    { entries: 0, exits: 0 },
  );
}
