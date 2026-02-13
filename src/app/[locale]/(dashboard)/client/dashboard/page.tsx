import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome to your NarBox dashboard"
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Your dashboard will provide an overview of your shipping activity:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Active shipments and tracking information</li>
            <li>Recent package history</li>
            <li>Pending deliveries</li>
            <li>Quick actions for common tasks</li>
            <li>Important notifications and updates</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
