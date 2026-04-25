import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import User from "../components/User";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import useSearchUsers from "../hooks/useSearchUsers";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [recentSearch, setRecentSearch] = useState([]);
  const [showRecent, setShowRecent] = useState(true);

  const { users: searchUsers, loading } = useSearchUsers({ query });

  const handleSearch = (e) => {
    const value = e.target.value.trim();
    setQuery(value);
    setShowRecent(value === "");
  };

  const handleUserClick = (user) => {
    setRecentSearch((prev) => {
      const filtered = prev.filter((u) => u._id !== user._id);
      return [user, ...filtered].slice(0, 5);
    });
    setQuery("");
    setShowRecent(true);
  };

  return (
    <div className="w-full flex flex-col py-4 gap-2 items-center">
      <div className="w-md">
        <InputGroup>
          <InputGroupInput
            placeholder="Search..."
            value={query}
            onChange={handleSearch}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <div className="overflow-auto h-full disableScrollbar mt-4">
          {showRecent && recentSearch.length > 0 && (
            <div className="mb-4">
              <p className="px-4 py-2 text-sm font-semibold">Recent Searches</p>
              {recentSearch.map((user) => (
                <User
                  key={user._id}
                  user={user}
                  isRecentSearch
                  onClick={() => handleUserClick(user)}
                />
              ))}
            </div>
          )}

          <div className="flex flex-col gap-1 items-center">
            {loading ? (
              <Spinner />
            ) : searchUsers.length > 0 ? (
              searchUsers.map((user) => (
                <User
                  key={user._id}
                  user={user}
                  onClick={() => handleUserClick(user)}
                />
              ))
            ) : (
              query &&
              !showRecent && (
                <p className="text-center text-sm text-muted-foreground">
                  User not found!
                </p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
