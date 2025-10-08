"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GET_ALL_CLIENTS,
  GetAllClientsResponse,
  GetAllClientsVariables,
} from "@/graphql/queries/clients";
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type SortField = "full_name" | "email" | "created_at";
type SortOrder = "asc" | "desc";

export default function AdminClients() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const orderBy = `${sortOrder === "desc" ? "-" : ""}${sortField}`;

  const { data, loading, error } = useQuery<
    GetAllClientsResponse,
    GetAllClientsVariables
  >(GET_ALL_CLIENTS, {
    variables: {
      page,
      pageSize,
      orderBy,
    },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
  };

  const clients = data?.allClients.results || [];
  const totalCount = data?.allClients.totalCount || 0;
  const hasNext = data?.allClients.hasNext || false;
  const hasPrevious = data?.allClients.hasPrevious || false;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clients Management"
        description="View and manage all client accounts"
      />

      <Card>
        <CardContent className="p-6">
          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load clients: {error.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && clients.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 rounded-full bg-muted p-6">
                <svg
                  className="h-12 w-12 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">No clients found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                There are currently no clients in the system.
              </p>
            </div>
          )}

          {/* Table */}
          {!loading && !error && clients.length > 0 && (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("full_name")}
                          className="flex items-center gap-1"
                        >
                          Full Name
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("email")}
                          className="flex items-center gap-1"
                        >
                          Email
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSort("created_at")}
                          className="flex items-center gap-1"
                        >
                          Created At
                          <ArrowUpDown className="h-4 w-4" />
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.map((client) => (
                      <TableRow key={client.id}>
                        <TableCell className="font-medium">
                          {client.fullName || "-"}
                        </TableCell>
                        <TableCell>{client.email}</TableCell>
                        <TableCell>
                          {client.mobilePhoneNumber ||
                            client.phoneNumber ||
                            "-"}
                        </TableCell>
                        <TableCell>
                          {client.city && client.state
                            ? `${client.city}, ${client.state}`
                            : client.city || client.state || "-"}
                        </TableCell>
                        <TableCell>
                          {new Date(client.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination and Page Size Controls */}
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 md:items-center">
                {/* Left: Page Size Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    Rows per page
                  </span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) =>
                      handlePageSizeChange(parseInt(value))
                    }
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Center: Showing Entries */}
                <div className="flex justify-center">
                  <span className="text-sm text-muted-foreground">
                    Showing {(page - 1) * pageSize + 1}–
                    {Math.min(page * pageSize, totalCount)} of {totalCount}
                  </span>
                </div>

                {/* Right: Pagination Buttons */}
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={!hasPrevious}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm font-medium">Page {page}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={!hasNext}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
