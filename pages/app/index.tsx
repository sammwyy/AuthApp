import TokenCard from "@/components/cards/token-card";
import CreateTokenDialog from "@/components/dialogs/create-token-dialog";
import { Input } from "@/components/ui/input";
import useData from "@/hooks/use-data";
import { useState } from "react";

function matchSearch(name: string, search: string) {
  const nameParts = name.split(" ");
  const searchParts = search.split(" ");

  return searchParts.every((searchPart) =>
    nameParts.some((namePart) =>
      namePart.toLowerCase().startsWith(searchPart.toLowerCase())
    )
  );
}

export default function WebApp() {
  const { tokens, selectedNamespace } = useData();
  const namespaceTokens = tokens.filter(
    (token) => token.namespace === selectedNamespace?.id
  );

  const [search, setSearch] = useState<string>("");
  const filteredTokens = namespaceTokens.filter((token) =>
    matchSearch(token.name, search)
  );

  return (
    <div className="flex flex-col max-w-[1366px] w-[90%] m-auto mt-10">
      <div className="flex gap-2">
        <CreateTokenDialog />
        <Input
          placeholder="Search for terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {/* Cards */}
        {filteredTokens.reverse().map((token) => (
          <TokenCard key={token.id} token={token} />
        ))}
      </div>
    </div>
  );
}
