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

  const repoScore = (repo: Repo) => {
    const stars = repo.stargazers_count || 0;
    const forks = repo.forks_count || 0;
    const watchers = repo.watchers_count || 0;

    const daysSinceUpdate =
      (Date.now() - new Date(repo.updated_at).getTime()) /
      (1000 * 60 * 60 * 24);

    const recencyBoost = Math.max(0, 1 - daysSinceUpdate / 365);

    return stars * 4 + forks * 3 + watchers * 1 + recencyBoost * 50;
  };

  const fetchData = async () => {
    setError("");
    setLoading(true);

    try {
      if (!username.trim()) {
        setError("Username required");
        setLoading(false);
        return;
      }

      const [userData, repoData] = await Promise.all([
        getUser(username),
        getRepos(username),
      ]);

      const sortedRepos = repoData
        .map((repo: Repo) => ({
          ...repo,
          score: repoScore(repo),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5);

      setUser(userData);
      setRepos(sortedRepos);
    } catch {
      setError("User not found");
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  const developerScore = (allRepos: Repo[]) =>
    allRepos.reduce((acc, repo) => acc + repoScore(repo), 0);

  const getTier = (score: number, count: number) => {
    const normalized = count ? score / count : 0;
    if (normalized > 1200) return "ELITE";
    if (normalized > 600) return "STRONG";
    if (normalized > 200) return "AVERAGE";
    return "LOW ACTIVITY";
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans selection:bg-yellow-400 selection:text-black">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-900/10 blur-[100px] rounded-full" />
      </div>

      <div className="relative max-w-5xl mx-auto pt-24 pb-20 px-6">
        <div className="flex justify-between items-end mb-16 border-b border-white/10 pb-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-purple-500 font-bold">
              Terminal v2.0
            </span>
            <h1 className="text-5xl font-black tracking-tighter mt-2">
              GIT<span className="text-purple-500">.</span>DATA
            </h1>
          </div>
          <div className="hidden md:block text-right font-mono text-[10px] text-zinc-500 leading-tight">
            SYSTEM_STATUS: OPERATIONAL<br />
            API_SOURCE: GITHUB_V3
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-20">
          <div className="md:col-span-9 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-purple-500 text-sm">
              ~/
            </div>
            <input
              className="w-full bg-zinc-900/50 border border-white/5 rounded-sm py-4 pl-12 pr-4 text-white focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all font-mono placeholder:text-zinc-700"
              placeholder="enter_github_handle..."
              value={username}
              onKeyDown={(e) => e.key === "Enter" && fetchData()}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="md:col-span-3 bg-white text-black font-black uppercase text-sm tracking-widest hover:bg-purple-500 hover:text-white transition-colors duration-300 py-4 disabled:opacity-50"
          >
            {loading ? "FETCHING..." : "EXECUTE"}
          </button>

          {error && (
            <p className="col-span-12 mt-2 font-mono text-xs text-red-500">
              {error}
            </p>
          )}
        </div>

        {user && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-4 space-y-6">
              <div className="bg-zinc-900/40 border border-white/5 p-1 rounded-sm">
                <UserCard user={user} />
                <a
                  href={user?.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-3 bg-black text-white rounded-sm border border-white/10 hover:bg-zinc-900 hover:border-white/20 transition-all font-mono text-xs uppercase tracking-widest active:scale-[0.98]"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .5C5.7.5.6 5.7.6 12.2c0 5.2 3.4 9.6 8.2 11.1.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.9 2.1 2.9 1.5.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0C16.8 5.4 17.8 5.7 17.8 5.7c.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1 .8 2.1v3.1c0 .3.2.7.8.6 4.8-1.5 8.2-5.9 8.2-11.1C23.4 5.7 18.3.5 12 .5z" />
                  </svg>
                  View GitHub Profile
                </a>
              </div>

              <div className="bg-purple-500 p-6 rounded-sm text-black">
                <p className="font-mono text-[10px] font-bold uppercase mb-1">
                  Developer Score
                </p>
                <p className="text-3xl font-black leading-none">
                  {getTier(developerScore(repos), repos.length)}
                </p>
                <p className="text-xs font-medium mt-2 opacity-80 italic">
                  Based on stars, forks, and repository freshness.
                </p>
              </div>
            </div>

            <div className="md:col-span-8">
              <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rotate-45 translate-x-16 -translate-y-16 border border-white/10" />
                <h3 className="font-mono text-xs font-bold text-zinc-500 uppercase mb-8 flex items-center gap-4">
                  <span className="h-[1px] w-8 bg-zinc-800"></span>
                  Primary_Repositories
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