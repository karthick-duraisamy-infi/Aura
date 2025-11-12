import RecentActivities from '../RecentActivities';

export default function RecentActivitiesExample() {
  const activities = [
    {
      id: '1',
      query: 'Show me the top 10 selling products this month',
      action: 'Report' as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: '2',
      query: 'Create a sales dashboard for Q4',
      action: 'Dashboard' as const,
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
    },
  ];

  return (
    <RecentActivities
      activities={activities}
      onActivityClick={(activity) => console.log('Clicked', activity)}
    />
  );
}
