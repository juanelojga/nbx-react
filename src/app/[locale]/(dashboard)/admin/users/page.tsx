import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminUsers() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Users Management"
        description="Manage system users and permissions"
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This page will provide comprehensive user management capabilities:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>View and manage all user accounts</li>
            <li>Add, edit, or deactivate user accounts</li>
            <li>Manage user roles and permissions</li>
            <li>View user activity and package history</li>
            <li>Send notifications to users</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
