import ChartCard from '../ChartCard';

export default function ChartCardExample() {
  const barData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 4500 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 5500 },
  ];

  return (
    <div className="p-4">
      <ChartCard title="Monthly Sales" type="bar" data={barData} />
    </div>
  );
}
