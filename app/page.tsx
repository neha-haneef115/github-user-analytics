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
  const [metrics, setMetrics] = useState({ totalStars: 0, topLanguage: "" });

  const calculateScore = (repo: Repo): number => {
    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;
    const watchers = repo.watchers_count || 0;
    const daysSinceUpdate = (Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24);
    const recencyBoost = Math.max(0, 1 - daysSinceUpdate / 365);
    return stars * 4 + forks * 3 + watchers * 1 + recencyBoost * 50;
  };

  const fetchData = async () => {
    setError("");
    setLoading(true);
    try {
      if (!username.trim()) {
        setError("IDENTIFIER_REQUIRED");
        setLoading(false);
        return;
      }
      const userData: GitHubUser = await getUser(username);
      const repoData: Repo[] = await getRepos(username);

      const totalStars = repoData.reduce((acc, r) => acc + r.stargazers_count, 0);
      const langMap: Record<string, number> = {};
      repoData.forEach(r => {
        if (r.language) langMap[r.language] = (langMap[r.language] || 0) + 1;
      });
      const topLanguage = Object.entries(langMap).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

      const scored = repoData
        .map((repo) => ({ ...repo, score: calculateScore(repo) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setMetrics({ totalStars, topLanguage });
      setUser(userData);
      setRepos(scored);
    } catch {
      setError("USER_NOT_FOUND");
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  const getTier = (items: ScoredRepo[]) => {
    if (items.length === 0) return "N/A";
    const avg = items.reduce((acc, r) => acc + r.score, 0) / items.length;
    return avg > 1200 ? "ELITE" : avg > 600 ? "STRONG" : "STABLE";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-purple-500/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[80%] md:w-[40%] h-[40%] bg-purple-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto pt-12 md:pt-24 pb-20 px-4 md:px-6">
        {/* Responsive Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 border-b border-white/5 pb-6 gap-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-purple-500 font-bold">Terminal v2.0.4</span>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mt-2 italic">GIT<span className="text-purple-600">.</span>DATA</h1>
          </div>
          <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest hidden md:block">Node_Status: Online</p>
        </div>

        {/* Responsive Search Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 mb-12 md:mb-20">
          <div className="col-span-1 md:col-span-9 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-purple-600 text-sm">~/_</div>
            <input
              className="w-full bg-zinc-900/30 border border-white/5 rounded-none py-4 md:py-5 pl-14 pr-4 text-white focus:outline-none focus:border-purple-500/40 transition-all font-mono text-sm md:text-base"
              placeholder="input_handle..."
              value={username}
              onKeyDown={(e) => e.key === "Enter" && fetchData()}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="col-span-1 md:col-span-3 bg-white text-black font-black uppercase text-[10px] md:text-xs tracking-widest hover:bg-purple-600 hover:text-white transition-all disabled:opacity-30 py-4 md:py-0"
          >
            {loading ? "FETCHING..." : "EXECUTE"}
          </button>
          {error && <p className="col-span-full mt-4 font-mono text-[10px] text-red-500 uppercase">ERR: {error}</p>}
        </div>

        {user && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4">
            {/* Sidebar (Full width on mobile, 4-cols on desktop) */}
            <div className="col-span-1 md:col-span-4 space-y-6">
              <div className="bg-zinc-900/20 border border-white/5 p-1">
                <UserCard user={user} totalStars={metrics.totalStars} topLanguage={metrics.topLanguage} />
              </div>
              
              {/* Responsive Rank Box */}
              <div className="relative overflow-hidden bg-purple-600 p-6 md:p-8 text-black font-black">
                <div className="absolute top-0 right-0 p-2 font-mono text-[8px] opacity-30">AUDIT_V2</div>
                <p className="font-mono text-[9px] uppercase mb-1 opacity-60 tracking-widest">System Rank</p>
                <p className="text-4xl md:text-5xl tracking-tighter leading-none">{getTier(repos)}</p>
                <p className="text-[9px] md:text-[10px] text-white/70  italic font-normal border-t border-black/10 pt-4">
                  Derived from weighted repo engagement + activity recency metrics.
                </p>
              </div>
            </div>

            {/* Main Content (Full width on mobile, 8-cols on desktop) */}
            <div className="col-span-1 md:col-span-8">
              <div className="bg-zinc-900/10 border border-white/5 p-6 md:p-10 h-full">
                <h3 className="font-mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-6 md:mb-8 flex items-center gap-2">
                  <span className="w-1 h-1 bg-purple-500" /> Top_Yield_Repos
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