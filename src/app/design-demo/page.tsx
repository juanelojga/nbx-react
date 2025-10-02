"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoText } from "@/components/ui/logo";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Separator } from "@/components/ui/separator";
import { Package, TrendingUp, Users, AlertCircle } from "lucide-react";

export default function DesignDemo() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Logo */}
      <section>
        <LogoText size="xl" />
      </section>

      {/* Page Header */}
      <PageHeader
        title="Design System Demo"
        description="Explore the NarBox UI components and brand colors"
        actions={
          <>
            <Button variant="outline">Secondary Action</Button>
            <Button>Primary Action</Button>
          </>
        }
      />

      {/* Color Palette */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Brand Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-sm">Primary Orange</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-primary rounded-md"></div>
              <p className="mt-2 text-xs text-muted-foreground">#FF6F00</p>
            </CardContent>
          </Card>

          <Card className="border-secondary/20 bg-secondary/5">
            <CardHeader>
              <CardTitle className="text-sm">Secondary Teal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-secondary rounded-md"></div>
              <p className="mt-2 text-xs text-muted-foreground">#00B8D4</p>
            </CardContent>
          </Card>

          <Card className="border-success/20 bg-success/5">
            <CardHeader>
              <CardTitle className="text-sm">Success Green</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-success rounded-md"></div>
              <p className="mt-2 text-xs text-muted-foreground">#66BB6A</p>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-sm">Brand Blue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-20 bg-blue-500 rounded-md"></div>
              <p className="mt-2 text-xs text-muted-foreground">#2196F3</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Primary (Orange)</Button>
          <Button variant="secondary">Secondary (Teal)</Button>
          <Button className="bg-success hover:bg-success/90 text-success-foreground">
            Success (Green)
          </Button>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white">
            Brand (Blue)
          </Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
        </div>

        <Separator />

        <div className="flex flex-wrap gap-4 items-center">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Package className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge className="bg-success text-success-foreground">Success</Badge>
          <Badge className="bg-warning text-warning-foreground">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      {/* Stat Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Stat Cards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Packages"
            value="1,234"
            icon={Package}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            label="Active Users"
            value="856"
            icon={Users}
            variant="success"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            label="Pending Deliveries"
            value="42"
            icon={AlertCircle}
            variant="warning"
          />
          <StatCard
            label="Revenue"
            value="$12,345"
            icon={TrendingUp}
            variant="default"
            trend={{ value: 5, isPositive: false }}
          />
        </div>
      </section>

      {/* Form Elements */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Form Elements</h2>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sample Form</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" type="text" placeholder="John Doe" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button className="flex-1">Submit</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Typography */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Typography</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h1>Heading 1 - 4xl</h1>
            <h2>Heading 2 - 3xl</h2>
            <h3>Heading 3 - 2xl</h3>
            <h4>Heading 4 - xl</h4>
            <h5>Heading 5 - lg</h5>
            <h6>Heading 6 - base</h6>
            <p className="text-base">
              This is a paragraph with regular body text. It uses the base font
              size and normal weight.
            </p>
            <p className="text-sm text-muted-foreground">
              This is supporting text using the muted foreground color for less
              emphasis.
            </p>
            <a href="#" className="text-secondary">
              This is a link styled with the secondary blue color
            </a>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
