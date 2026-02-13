"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useTranslations } from "next-intl";
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import {
  ClientType,
  GET_ALL_CLIENTS,
  GetAllClientsResponse,
  GetAllClientsVariables,
} from "@/graphql/queries/clients";

interface ClientSelectProps {
  onClientSelect: (client: ClientType | null) => void;
  selectedClient: ClientType | null;
}

export function ClientSelect({
  onClientSelect,
  selectedClient,
}: ClientSelectProps) {
  const t = useTranslations("adminPackages.clientSelect");
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);

  // Build GraphQL variables
  const queryVariables: GetAllClientsVariables = {
    page: 1,
    pageSize: 50,
    orderBy: "full_name",
  };

  // Only include search if it has a valid value
  if (debouncedSearch) {
    queryVariables.search = debouncedSearch;
  }

  const { data, loading, error } = useQuery<
    GetAllClientsResponse,
    GetAllClientsVariables
  >(GET_ALL_CLIENTS, {
    variables: queryVariables,
    skip: !open, // Only fetch when popover is open
  });

  const clients = data?.allClients.results || [];

  const handleSelect = (client: ClientType) => {
    onClientSelect(client);
    setOpen(false);
    setSearchInput(""); // Reset search on selection
    console.log("Selected client:", {
      id: client.id,
      fullName: client.fullName,
      email: client.email,
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a client"
          className="w-full justify-between h-auto min-h-[2.5rem] px-3 py-2 hover:bg-primary/5 hover:border-primary/30 transition-colors "
        >
          {selectedClient ? (
            <div className="flex flex-col items-start gap-0.5 text-left">
              <span className="font-medium text-primary">
                {selectedClient.fullName}
              </span>
              <span className="text-xs text-muted-foreground">
                {selectedClient.email}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">{t("placeholder")}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder={t("searchPlaceholder")}
              value={searchInput}
              onValueChange={setSearchInput}
              className="border-0 focus:ring-0"
            />
          </div>
          <CommandList>
            {loading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  {t("loading")}
                </span>
              </div>
            )}

            {error && (
              <div className="py-6 px-4 text-center">
                <p className="text-sm text-destructive">
                  {t("error", { message: error.message })}
                </p>
              </div>
            )}

            {!loading && !error && clients.length === 0 && (
              <CommandEmpty>
                <div className="py-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    {t("noClientsFound")}
                  </p>
                  {searchInput && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("tryDifferentSearch")}
                    </p>
                  )}
                </div>
              </CommandEmpty>
            )}

            {!loading && !error && clients.length > 0 && (
              <CommandGroup>
                <ScrollArea className="h-[300px]">
                  {clients.map((client) => (
                    <CommandItem
                      key={client.id}
                      value={client.id}
                      onSelect={() => handleSelect(client)}
                      className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-primary/10 data-[selected=true]:bg-primary/15 data-[selected=true]:text-foreground transition-colors"
                    >
                      <Check
                        className={cn(
                          "h-4 w-4 text-primary",
                          selectedClient?.id === client.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium truncate">
                          {client.fullName || "N/A"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          {client.email}
                        </span>
                        {(client.city || client.state) && (
                          <span className="text-xs text-muted-foreground/70 truncate">
                            {client.city && client.state
                              ? `${client.city}, ${client.state}`
                              : client.city || client.state}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </ScrollArea>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
