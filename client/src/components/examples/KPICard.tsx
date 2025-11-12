import KPICard from '../KPICard';
import { DollarSign } from 'lucide-react';

export default function KPICardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
      <KPICard
        title="Total Sales"
        value="$125,430"
        icon={DollarSign}
        trend={{ value: '12.5%', isPositive: true }}
      />
    </div>
  );
}
