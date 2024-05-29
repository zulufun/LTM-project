import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

interface Props {
  dataThongKe: any[];
}

const MyPieChart: React.FC<Props> = ({ dataThongKe }) => {
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    name
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5+170;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="black" // Màu của label
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {name}
      </text>
    );
  };

  return (
    <PieChart width={800} height={800}>
      <Pie
        data={dataThongKe}
        cx={400}
        cy={400}
        labelLine={false}
        label={renderCustomizedLabel}
        outerRadius={300}
        fill="#8884d8"
        dataKey="count"
      >
        {dataThongKe.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
    </PieChart>
  );
};

export default MyPieChart;
