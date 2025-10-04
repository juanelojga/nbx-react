import { PageHeader } from "@/components/ui/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Package,
  TrendingUp,
  Users,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Package2,
} from "lucide-react";

export default function AdminDashboard() {
  // Mock data - replace with real data from API
  const recentPackages = [
    {
      id: "PKG-2024-001",
      customer: "John Doe",
      status: "in_transit",
      destination: "San Francisco, CA",
      date: "2024-01-15",
    },
    {
      id: "PKG-2024-002",
      customer: "Jane Smith",
      status: "delivered",
      destination: "New York, NY",
      date: "2024-01-14",
    },
    {
      id: "PKG-2024-003",
      customer: "Mike Johnson",
      status: "pending",
      destination: "Los Angeles, CA",
      date: "2024-01-15",
    },
    {
      id: "PKG-2024-004",
      customer: "Sarah Williams",
      status: "in_transit",
      destination: "Chicago, IL",
      date: "2024-01-15",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-success text-success-foreground">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Delivered
          </Badge>
        );
      case "in_transit":
        return (
          <Badge variant="secondary">
            <Package2 className="h-3 w-3 mr-1" />
            In Transit
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-warning text-warning-foreground">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Overview of all system activities and metrics"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Packages"
          value="1,284"
          icon={Package}
          variant="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          label="Active Users"
          value="892"
          icon={Users}
          variant="success"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          label="Pending Deliveries"
          value="47"
          icon={AlertCircle}
          variant="warning"
        />
        <StatCard
          label="Revenue (MTD)"
          value="$28,450"
          icon={TrendingUp}
          variant="default"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Packages */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Packages</CardTitle>
                <CardDescription>Latest package shipments</CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm">{pkg.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {pkg.customer}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {pkg.destination}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    {getStatusBadge(pkg.status)}
                    <p className="text-xs text-muted-foreground">{pkg.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>System Overview</CardTitle>
            <CardDescription>Real-time system metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <CheckCircle2 className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <span className="font-medium">Delivered Today</span>
                </div>
                <span className="text-2xl font-bold">127</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                    <Package2 className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <span className="font-medium">In Transit</span>
                </div>
                <span className="text-2xl font-bold">234</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-warning/5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-warning flex items-center justify-center">
                    <Clock className="h-4 w-4 text-warning-foreground" />
                  </div>
                  <span className="font-medium">Processing</span>
                </div>
                <span className="text-2xl font-bold">47</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-destructive flex items-center justify-center">
                    <XCircle className="h-4 w-4 text-destructive-foreground" />
                  </div>
                  <span className="font-medium">Failed Deliveries</span>
                </div>
                <span className="text-2xl font-bold">3</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
