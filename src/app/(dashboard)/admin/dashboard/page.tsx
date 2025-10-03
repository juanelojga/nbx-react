import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <PageHeader
        heading="Admin Dashboard"
        text="Welcome to the NarBox admin dashboard"
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            The admin dashboard will provide an overview of all system
            activities, including:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Total packages in the system</li>
            <li>Active shipments and deliveries</li>
            <li>User statistics and analytics</li>
            <li>Recent system activities</li>
            <li>Revenue and financial reports</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
