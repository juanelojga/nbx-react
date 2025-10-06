import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TrackPackage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Track Package"
        description="Enter tracking number to find your package"
      />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This page will provide real-time package tracking features:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Enter tracking number for instant lookup</li>
            <li>View current package location</li>
            <li>See delivery timeline and history</li>
            <li>Estimated delivery date and time</li>
            <li>Receive notifications for status changes</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
