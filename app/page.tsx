"use client";

import { useState } from "react";
import { getUser, getRepos } from "@/lib/github";
import UserCard from "@/components/UserCard";
import RepoList from "@/components/RepoList";
import { Repo, GitHubUser } from "@/types/github";

type ScoredRepo = Repo & { score: number };

export default function Page() {
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<ScoredRepo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [metrics, setMetrics] = useState({
    totalStars: 0,
    topLanguage: "",
  });

  /* SCORE CALCULATION */
  const calculateScore = (repo: Repo): number => {
    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;
    const watchers = repo.watchers_count || 0;

    const daysSinceUpdate =
      (Date.now() - new Date(repo.updated_at).getTime()) /
      (1000 * 60 * 60 * 24);

    const recencyBoost = Math.max(0, 1 - daysSinceUpdate / 365);

    return stars * 4 + forks * 3 + watchers + recencyBoost * 50;
  };

  /* FETCH DATA */
  const fetchData = async () => {
    setError("");
    setLoading(true);

    try {
      if (!username.trim()) {
        setError("Username required");
        setLoading(false);
        return;
      }

      const userData: GitHubUser = await getUser(username);
      const repoData: Repo[] = await getRepos(username);

      /* FIXED: typed reduce */
      const totalStars = repoData.reduce(
        (acc: number, r: Repo) => acc + (r.stargazers_count || 0),
        0
      );

      /* FIXED: typed map */
      const langMap: Record<string, number> = {};

      repoData.forEach((r: Repo) => {
        if (r.language) {
          langMap[r.language] = (langMap[r.language] || 0) + 1;
        }
      });

      /* FIXED: typed entries */
      const topLanguage =
        (Object.entries(langMap) as [string, number][])
          .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

      /* FIXED: strict scoring */
      const scored: ScoredRepo[] = repoData
        .map((repo: Repo) => ({
          ...repo,
          score: calculateScore(repo),
        }))
        .sort((a: ScoredRepo, b: ScoredRepo) => b.score - a.score)
        .slice(0, 5);

      setUser(userData);
      setRepos(scored);
      setMetrics({ totalStars, topLanguage });

    } catch {
      setError("User not found or API error");
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  /* TIER SYSTEM */
  const getTier = (items: ScoredRepo[]) => {
    if (!items.length) return "N/A";

    const avg = items.reduce(
      (acc: number, r: ScoredRepo) => acc + r.score,
      0
    ) / items.length;

    if (avg > 1200) return "ELITE";
    if (avg > 600) return "STRONG";
    return "STABLE";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans overflow-x-hidden">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[70%] md:w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-12 md:pt-24 pb-20">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-white/5 pb-6 mb-10 md:mb-16">

          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-purple-500">
              Terminal v2.0
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter mt-2 italic">
              GIT<span className="text-purple-600">.</span>DATA
            </h1>
          </div>

          <p className="hidden md:block font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
            NODE_STATUS: ONLINE
          </p>

        </div>

        {/* Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 mb-12 md:mb-20">

          <div className="md:col-span-9 relative">

            <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-purple-600 text-sm">
              ~/
            </div>

            <input
              className="w-full bg-zinc-900/30 border border-white/5 py-4 md:py-5 pl-12 md:pl-14 pr-4 text-white focus:outline-none focus:border-purple-500/40 transition font-mono text-sm md:text-base"
              placeholder="input_handle..."
              value={username}
              onKeyDown={(e) => e.key === "Enter" && fetchData()}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="w-full md:w-auto md:col-span-3 bg-white text-black font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-purple-600 hover:text-white transition disabled:opacity-30 py-4"
          >
            {loading ? "FETCHING..." : "EXECUTE"}
          </button>

          {error && (
            <p className="col-span-full text-red-500 text-[10px] font-mono uppercase">
              ERR: {error}
            </p>
          )}

        </div>

        {/* Results */}
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">

            <div className="md:col-span-4 space-y-6">
              <UserCard
                user={user}
                totalStars={metrics.totalStars}
                topLanguage={metrics.topLanguage}
              />

              <div className="bg-purple-600 text-black p-6 md:p-8 font-black">
                <p className="font-mono text-[11px] italic  uppercase opacity-60 tracking-widest">
                  System Rank
                </p>

                <p className="text-3xl  sm:text-4xl italic md:text-5xl tracking-normal">
                  {getTier(repos)}
                </p>

                <p className="text-[12px] text-white italic font-light mt-2 opacity-80">
                  Weighted repo engagement + activity recency
                </p>
              </div>
            </div>

            <div className="md:col-span-8">
              <div className="bg-zinc-900/10 border border-white/5 p-4 sm:p-6 md:p-10">

                <h3 className="font-mono text-[12px] uppercase tracking-widest text-zinc-500 mb-6">
                  Top_Yield_Repos
                </h3>

                <RepoList repos={repos} />

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}