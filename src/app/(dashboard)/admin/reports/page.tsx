import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="View analytics and generate reports"
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This page will provide detailed analytics and reporting features:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Revenue and financial reports</li>
            <li>Package delivery statistics and trends</li>
            <li>User activity and engagement metrics</li>
            <li>Performance analytics and KPIs</li>
            <li>Custom report generation and exports</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
