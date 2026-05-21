"use client";

import { useState } from "react";
import { getUser, getRepos } from "@/lib/github";
import UserCard from "@/components/UserCard";
import RepoList from "@/components/RepoList";
import { Repo } from "@/types/github";

export default function Page() {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<any>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setError("");
    setLoading(true);

    try {
      if (!username.trim()) {
        setError("Enter username");
        setLoading(false);
        return;
      }

      const userData = await getUser(username);
      const repoData = await getRepos(username);

      const sorted = repoData.sort(
        (a: Repo, b: Repo) => b.stargazers_count - a.stargazers_count
      );

      setUser(userData);
      setRepos(sorted.slice(0, 5));
    } catch (err: any) {
      if (err.message === "USER_FETCH_FAILED") {
        setError("User not found or API error");
      } else {
        setError("Something went wrong or rate limited");
      }
    }

    setLoading(false);
  };

  const totalStars = repos.reduce(
    (acc, r) => acc + r.stargazers_count,
    0
  );

  const languageMap: Record<string, number> = {};
  repos.forEach((r) => {
    if (r.language) {
      languageMap[r.language] = (languageMap[r.language] || 0) + 1;
    }
  });

  const topLanguage =
    Object.entries(languageMap).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "N/A";

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold">GitHub Analyzer</h1>

      <div className="flex gap-2 mt-4">
        <input
          className="border p-2 flex-1"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button
          onClick={fetchData}
          className="bg-black text-white px-4"
        >
          Search
        </button>
      </div>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}

      {user && (
        <>
          <UserCard
            user={user}
            totalStars={totalStars}
            topLanguage={topLanguage}
          />
          <RepoList repos={repos} />
        </>
      )}
    </div>
  );
}