import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps
} from "recharts";
// import "./styles.css";

interface DataPoint {
  month: string;
  a: number;
  b: number;
  c: number;
}

interface PercentAreaChartProps {
  data: DataPoint[];
}

const toPercent = (decimal: number, fixed: number = 0): string =>
  `${(decimal * 100).toFixed(fixed)}%`;

const getPercent = (value: number, total: number): string => {
  const ratio = total > 0 ? value / total : 0;
  return toPercent(ratio, 2);
};

const renderTooltipContent: React.FC<TooltipProps<number, string>> = (o) => {
  const { payload = [], label } = o;
  const total = payload.reduce(
    (result: number, entry) => result + (entry.value || 0),
    0
  );

  return (
    <div className="customized-tooltip-content">
      <p className="total">{`${label} (Total: ${total})`}</p>
      <ul className="list">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}(${getPercent(
              entry.value as number,
              total
            )})`}
          </li>
        ))}
      </ul>
    </div>
  );
};

const PercentAreaChart: React.FC<PercentAreaChartProps> = ({ data }) => {
  return (
    <AreaChart
      width={500}
      height={400}
      data={data}
      stackOffset="expand"
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis tickFormatter={toPercent} />
      <Tooltip content={renderTooltipContent} />
      <Area
        type="monotone"
        dataKey="count"
        stackId="agribank"
        stroke="#8884d8"
        fill="#8884d8"
      />
      <Area
        type="monotone"
        dataKey="count"
        stackId="count"
        stroke="#82ca9d"
        fill="#82ca9d"
      />
      <Area
        type="monotone"
        dataKey="count"
        stackId="count"
        stroke="#ffc658"
        fill="#ffc658"
      />
    </AreaChart>
  );
};

export default PercentAreaChart;
