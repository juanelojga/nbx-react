import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <PageHeader
        heading="Settings"
        text="Configure system settings and preferences"
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This page will provide system configuration options including:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>General system settings and preferences</li>
            <li>Email and notification configurations</li>
            <li>Payment gateway settings</li>
            <li>Shipping rates and zones</li>
            <li>Security and access control settings</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
