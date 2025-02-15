"use client";

import { MOCK_API } from "@/api/api";
import SearchBar from "@/components/search/search_bar";
import { SearchResult } from "@/components/search/search_result";
import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useFilterStore } from "@/store/filters";
import { useSearchStore } from "@/store/search";
import { Group } from "@/types/group";
import { User } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { PanelLeft } from "lucide-react";

export default function Page() {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-row w-full flex-1 gap-4 py-6 px-6 border-b border-border justify-center">
        <Button
          className={cn(!isMobile && "hidden")}
          variant="outline"
          onClick={toggleSidebar}
        >
          <PanelLeft />
        </Button>
        <SearchBar className="w-full" />
      </div>
      <div className="pr-8 pl-6 py-6">
        <SearchResults />
      </div>
    </div>
  );
}

function SearchResults() {
  const { search } = useSearchStore();
  const filters = useFilterStore();

  const projectNames = filters.projects.map((p) => p.pathWithNamespace);
  const projectIds = filters.projects.map((p) => p.id);

  const groups = filters.namespaces
    .map((ns) => ns.group)
    .filter((g) => g) as Group[];
  const users = filters.namespaces
    .map((ns) => ns.user)
    .filter((u) => u) as User[];

  const groupNames = groups.map((g) => g.path);
  const groupIds = groups.map((g) => g.id);

  const userNames = users.map((u) => u.username);
  const userIds = users.map((u) => u.id);

  const { isPending, error, data } = useQuery({
    queryKey: [
      "search",
      search,
      "projects",
      ...projectNames,
      "groups",
      ...groupNames,
      "users",
      ...userNames,
    ],
    queryFn: () =>
      MOCK_API.getSearchResults(search, groupIds, userIds, projectIds),
    enabled: search.length >= 3,
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (data && data.length > 0) {
    return (
      <div className="flex flex-col gap-8 w-full">
        {data.map((result) => (
          <SearchResult key={result.id} {...result} searchFor={search} />
        ))}
      </div>
    );
  } else {
    return <span>No results</span>;
  }
}
