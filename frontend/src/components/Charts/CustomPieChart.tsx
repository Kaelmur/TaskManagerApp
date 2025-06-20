import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import CustomLegend from "./CustomLegend";
import { useTheme } from "../theme-provider";

interface PieData {
  status: string;
  count: number;
}

interface CustomPieChartProps {
  data: PieData[];
  colors: string[];
}

const CustomPieChart: React.FC<CustomPieChartProps> = ({ data, colors }) => {
  const { theme } = useTheme();

  // Choose stroke color based on theme
  const strokeColor = theme === "dark" ? "#333" : "#fff";
  return (
    <ResponsiveContainer width="100%" height={325}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
          stroke={strokeColor}
        >
          {data.map((_, index: number) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend content={<CustomLegend />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
