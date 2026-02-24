import { AreaChart, Area, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import type { DayEntry } from '@/hooks/useGoalData';

interface MomentumChartProps {
  data: DayEntry[];
}

export default function MomentumChart({ data }: MomentumChartProps) {
  const chartData = data.map(e => ({
    date: new Date(e.date).toLocaleDateString('en-US', { weekday: 'short' }),
    momentum: e.momentum,
    energy: e.energy,
    focus: e.focus,
    clarity: e.clarity,
  }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-52 text-muted-foreground text-sm">
        No data yet. Start tracking to see trends.
      </div>
    );
  }

  return (
    <motion.div
      className="w-full h-60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
          <defs>
            <linearGradient id="momentumGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.25} />
              <stop offset="100%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'hsl(215, 14%, 46%)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 10]}
            tick={{ fontSize: 11, fill: 'hsl(215, 14%, 46%)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'hsla(0,0%,100%,0.95)',
              border: 'none',
              borderRadius: '10px',
              boxShadow: '0 4px 16px hsla(0,0%,0%,0.08)',
              fontSize: '13px',
              padding: '10px 14px',
            }}
          />
          <Area
            type="monotone"
            dataKey="momentum"
            stroke="hsl(160, 84%, 39%)"
            strokeWidth={2.5}
            fill="url(#momentumGrad)"
            dot={{ r: 3, fill: 'hsl(160, 84%, 39%)' }}
            animationDuration={1000}
          />
          <Line
            type="monotone"
            dataKey="energy"
            stroke="hsl(213, 94%, 68%)"
            strokeWidth={2}
            dot={{ r: 3, fill: 'hsl(213, 94%, 68%)' }}
            animationDuration={1200}
          />
          <Line
            type="monotone"
            dataKey="focus"
            stroke="hsl(280, 67%, 65%)"
            strokeWidth={2}
            dot={{ r: 3, fill: 'hsl(280, 67%, 65%)' }}
            animationDuration={1400}
          />
          <Line
            type="monotone"
            dataKey="clarity"
            stroke="hsl(35, 92%, 60%)"
            strokeWidth={2}
            dot={{ r: 3, fill: 'hsl(35, 92%, 60%)' }}
            animationDuration={1600}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
