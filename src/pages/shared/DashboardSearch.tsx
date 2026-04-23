import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BackendLoadingIndicator } from "@/components/BackendLoadingIndicator";
import { DashboardSearchRole, dashboardSearchConfig } from "@/lib/dashboard-search";
import { useDashboardSearchResults } from "@/hooks/use-dashboard-search-results";

type DashboardSearchProps = {
  role: DashboardSearchRole;
};

export default function DashboardSearch({ role }: DashboardSearchProps) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const config = dashboardSearchConfig[role];
  const { results, loading } = useDashboardSearchResults(role, query);
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            {config.label} Search
          </Badge>
          <p className="text-xs text-muted-foreground">Scoped to your current dashboard only</p>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">System Search</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Search dashboard widgets, live pages, and operational sections for the {config.label.toLowerCase()} workspace.
          </p>
        </div>
      </div>

      {query.trim() ? (
        <Card className="border border-border/60 shadow-sm">
          <CardContent className="p-4 sm:p-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Results for <span className="text-primary">"{query}"</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {results.length} {results.length === 1 ? "match" : "matches"} across {config.label.toLowerCase()} content
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to={config.basePath}>Back to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-border/60 shadow-sm">
          <CardContent className="p-6 text-center">
            <Search className="mx-auto h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm font-medium text-foreground">Start typing in the header search</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Search stays inside the {config.label.toLowerCase()} dashboard and does not mix results from other user types.
            </p>
          </CardContent>
        </Card>
      )}

      {query.trim() ? (
        loading ? (
          <Card className="border border-border/60 shadow-sm">
            <CardContent className="p-8">
              <BackendLoadingIndicator label="Loading..." compact />
            </CardContent>
          </Card>
        ) : results.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((result) => (
              <Card key={result.id} className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-base">{result.title}</CardTitle>
                      <CardDescription className="mt-1">{result.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {result.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground truncate">{result.path}</p>
                  <Button size="sm" variant="ghost" className="h-8 gap-1 text-primary" asChild>
                    <Link to={result.path}>
                      Open <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-border/60 shadow-sm">
            <CardContent className="p-8 text-center">
              <Search className="mx-auto h-10 w-10 text-muted-foreground/40" />
              <p className="mt-4 text-sm font-medium text-foreground">No matching content found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try another term like listings, payouts, collections, KYC, bookings, or disputes.
              </p>
            </CardContent>
          </Card>
        )
      ) : null}
    </div>
  );
}
