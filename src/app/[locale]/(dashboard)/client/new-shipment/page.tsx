import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewShipment() {
  return (
    <div className="space-y-6">
      <PageHeader heading="New Shipment" text="Create a new package shipment" />
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            This page will provide a form to create new shipments with:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
            <li>Sender and recipient information</li>
            <li>Package details (weight, dimensions, type)</li>
            <li>Shipping method selection</li>
            <li>Cost calculation and payment options</li>
            <li>Generate shipping label and tracking number</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
