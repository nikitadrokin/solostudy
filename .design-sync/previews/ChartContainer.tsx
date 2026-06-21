import { ChartContainer } from 'web';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
const data = [
  { day: 'Mon', minutes: 45 }, { day: 'Tue', minutes: 60 }, { day: 'Wed', minutes: 30 },
  { day: 'Thu', minutes: 75 }, { day: 'Fri', minutes: 50 }, { day: 'Sat', minutes: 90 }, { day: 'Sun', minutes: 25 },
];
const config = { minutes: { label: 'Focus minutes', color: 'var(--chart-1)' } };
export const FocusMinutes = () => (
  <div className="w-[28rem]">
    <ChartContainer config={config} className="h-56 w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
        <Bar dataKey="minutes" fill="var(--color-minutes)" radius={6} />
      </BarChart>
    </ChartContainer>
  </div>
);
