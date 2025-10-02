import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientProfile() {
  return (
    <div className="space-y-6">
      <PageHeader heading="Profile" text="Manage your account settings" />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This page will allow you to manage your profile and settings:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Update personal information</li>
            <li>Change password and security settings</li>
            <li>Manage saved addresses</li>
            <li>Set notification preferences</li>
            <li>View account activity history</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
