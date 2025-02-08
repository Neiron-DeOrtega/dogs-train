import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface StatsViewProps {
  stats?: {dogName: string, averageRating: number}[]
}

export const StatsView: React.FC<StatsViewProps> = ({stats}) => {
  return (
    <div className="chart-container" style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={stats}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="dogName" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="averageRating" fill="#82ca9d" name="Средняя оценка"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
