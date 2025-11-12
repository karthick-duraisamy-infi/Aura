import DataTable from '../DataTable';

export default function DataTableExample() {
  const columns = [
    { key: 'id', label: 'Id', align: 'left' as const },
    { key: 'location', label: 'Location', align: 'left' as const },
    { key: 'status', label: 'Status', align: 'left' as const },
  ];

  const data = Array.from({ length: 10 }, (_, i) => ({
    id: `PROD-${String(i + 1).padStart(3, '0')}`,
    location: ['New York, USA', 'London, UK', 'Paris, France', 'Berlin, Germany', 'Tokyo, Japan'][i % 5],
    status: 'Paid',
  }));

  return (
    <DataTable
      title="Top 10 Selling Products - November 2025"
      subtitle="Generated from your prompt on 10/31/2025"
      columns={columns}
      data={data}
    />
  );
}
