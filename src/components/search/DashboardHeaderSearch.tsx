import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BackendLoadingIndicator } from "@/components/BackendLoadingIndicator";
import { DashboardSearchRole } from "@/lib/dashboard-search";
import { useDashboardSearchResults } from "@/hooks/use-dashboard-search-results";
import { searchDashboardEntriesLive } from "@/lib/typesense-search";

type DashboardHeaderSearchProps = {
  role: DashboardSearchRole;
  placeholder: string;
};

export function DashboardHeaderSearch({ role, placeholder }: DashboardHeaderSearchProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { results, loading } = useDashboardSearchResults(role, query, 6);

  useEffect(() => {
    setOpen(false);
    setMobileOpen(false);
    setQuery("");
  }, [location.pathname]);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    const bestMatch = results[0] ?? (await searchDashboardEntriesLive(role, trimmed))[0];
    if (!bestMatch) return;
    navigate(bestMatch.path);
    setOpen(false);
    setMobileOpen(false);
  };

  return (
    <>
      <div ref={containerRef} className="relative flex-1 max-w-sm hidden sm:block">
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            className="pl-9 h-9 bg-secondary/50 border-border/50 text-sm rounded-lg"
            value={query}
            onFocus={() => setOpen(true)}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
          />
        </form>

        {open && query.trim() ? (
          <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 rounded-xl border border-border/60 bg-background p-2 shadow-xl">
            {loading ? (
              <div className="px-3 py-4">
                <BackendLoadingIndicator label="Loading..." compact inline />
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    to={result.path}
                    className="flex items-start justify-between gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent/50"
                    onClick={() => {
                      setOpen(false);
                      setMobileOpen(false);
                    }}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{result.title}</p>
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{result.description}</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                      {result.category}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-3 py-4 text-sm text-muted-foreground">
                No matching dashboard content found.
              </div>
            )}
          </div>
        ) : null}
      </div>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="relative h-9 w-9 rounded-lg border border-border/60 bg-background sm:hidden"
        onClick={() => setMobileOpen((value) => !value)}
        aria-label="Open dashboard search"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
      </Button>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 sm:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            aria-label="Close dashboard search"
            onClick={() => {
              setMobileOpen(false);
              setQuery("");
            }}
          />
          <div className="absolute inset-x-0 top-0 flex max-h-[100dvh] flex-col rounded-b-3xl border-b border-border/70 bg-background shadow-2xl">
            <div className="border-b border-border/60 px-4 pb-4 pt-3">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Search dashboard</p>
                  <p className="text-xs text-muted-foreground">Only results from this workspace</p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-lg"
                  onClick={() => {
                    setMobileOpen(false);
                    setQuery("");
                  }}
                  aria-label="Close dashboard search"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  autoFocus
                  placeholder={placeholder}
                  className="h-11 rounded-xl border-border/60 bg-muted/30 pl-10 pr-20 text-sm"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                />
                {query ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 h-8 -translate-y-1/2 rounded-lg px-2.5 text-xs text-muted-foreground"
                    onClick={() => setQuery("")}
                  >
                    Clear
                  </Button>
                ) : null}
              </form>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              {query.trim() ? (
                loading ? (
                  <div className="py-8">
                    <BackendLoadingIndicator label="Loading..." compact inline />
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-2">
                    {results.map((result) => (
                      <Link
                        key={result.id}
                        to={result.path}
                        className="block rounded-2xl border border-border/60 bg-card px-4 py-3"
                        onClick={() => {
                          setMobileOpen(false);
                          setQuery("");
                        }}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground">{result.title}</p>
                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{result.description}</p>
                          </div>
                          <span className="shrink-0 rounded-md bg-muted px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                            {result.category}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-border/70 px-4 py-8 text-center">
                    <p className="text-sm font-medium text-foreground">No matching content found</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Try a property name, page title, or dashboard term.
                    </p>
                  </div>
                )
              ) : (
                <div className="rounded-2xl border border-dashed border-border/70 px-4 py-8 text-center">
                  <p className="text-sm font-medium text-foreground">Start typing to search</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Search stays inside the dashboard you are using now.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
