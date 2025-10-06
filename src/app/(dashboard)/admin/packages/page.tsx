import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPackages() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="All Packages"
        description="Manage and track all packages in the system"
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This page will display all packages in the system with features
            including:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Complete package listing with search and filters</li>
            <li>Package status tracking and updates</li>
            <li>Bulk operations for package management</li>
            <li>Detailed package information and history</li>
            <li>Export capabilities for reports</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
