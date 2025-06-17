import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTheme } from "../theme-provider";

interface BarData {
  priority: "Low" | "Medium" | "High" | string;
  count: number;
}

interface CustomBarChartProps {
  data: BarData[];
}

const CustomBarChart: React.FC<CustomBarChartProps> = ({ data }) => {
  const { theme } = useTheme();

  const axisTickColor = theme === "dark" ? "#d1d5dc" : "#555";
  // Function to alternate colors
  const getBarColor = (entry: BarData): string => {
    switch (entry?.priority) {
      case "Low":
        return "#00BC7D";

      case "Средний":
        return "#FE9900";

      case "Высокий":
        return "#FF1F57";

      default:
        return "#00BC7D";
    }
  };

  const CustomToolTip: React.FC<{
    active?: boolean;
    payload?: {
      payload: BarData;
      value: number;
      name: string;
    }[];
  }> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-black shadow-md rounded-lg p-2 border border-gray-300">
          <p className="text-xs font-semibold text-purple-800 dark:text-blue-300 mb-1">
            {payload[0].payload.priority}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Счет:{" "}
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {payload[0].payload.count}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white mt-6 dark:bg-[#0d0d0d]">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid stroke="none" />

          <XAxis
            dataKey="priority"
            tick={{ fontSize: 12, fill: axisTickColor }}
            stroke="none"
          />
          <YAxis tick={{ fontSize: 12, fill: axisTickColor }} stroke="none" />

          <Tooltip
            content={<CustomToolTip />}
            cursor={{ fill: "transparent" }}
          />

          <Bar
            dataKey="count"
            name="priority"
            fill="#FF8042"
            radius={[10, 10, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomBarChart;
