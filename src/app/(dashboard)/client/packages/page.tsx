import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientPackages() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="My Packages"
        description="View and manage your packages"
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This page will display all your packages with features including:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Complete list of your packages</li>
            <li>Filter by status (pending, in-transit, delivered)</li>
            <li>Search packages by tracking number</li>
            <li>View detailed package information</li>
            <li>Download shipping labels and receipts</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
