import { Repo } from "@/types/github";

export default function RepoList({ repos }: { repos: Repo[] }) {
  return (
    <div className="w-full">

      {/* Header (responsive fix) */}
      <div className="flex items-center gap-3 mb-5">

        <div className="h-[1px] flex-1 bg-zinc-800" />

        <h3 className="font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] text-zinc-500 whitespace-nowrap">
          Top Repositories
        </h3>

        <div className="h-[1px] flex-1 bg-zinc-800" />

      </div>

      {/* Repo list */}
      <div className="grid gap-3">

        {repos.map((repo, index) => (
          <div
            key={repo.id}
            className="group relative bg-[#0a0a0a] border border-white/5 p-4 sm:p-5 transition hover:border-purple-500/30"
          >

            {/* Index */}
            <div className="absolute top-2 right-2 text-[9px] text-zinc-700 group-hover:text-purple-500">
              #{index + 1}
            </div>

            {/* Main content */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">

              <div className="min-w-0">

                <a
                  href={repo.html_url}
                  target="_blank"
                  className="block font-bold text-sm text-zinc-200 hover:text-purple-400 transition truncate"
                >
                  {repo.name}
                </a>

                <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] font-mono">

                  <span className="text-purple-500 font-bold">
                    ★ {repo.stargazers_count.toLocaleString()}
                  </span>

                  <span className="text-zinc-700">•</span>

                  <span className="text-zinc-400 uppercase">
                    {repo.language || "plain_text"}
                  </span>

                </div>

              </div>

              {/* Button (mobile-safe) */}
              <a
                href={repo.html_url}
                target="_blank"
                className="sm:opacity-0 sm:group-hover:opacity-100 transition bg-white text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white self-start"
              >
                Open
              </a>

            </div>

            {/* Activity bar */}
            <div className="mt-4 h-[2px] w-full bg-zinc-900 overflow-hidden">
              <div
                className="h-full bg-purple-600 group-hover:bg-purple-400 transition-all"
                style={{
                  width: `${Math.min((repo.stargazers_count / 100) * 100, 100)}%`,
                }}
              />
            </div>

          </div>
        ))}

      </div>

      {/* Footer (simplified) */}
      <div className="mt-5 text-[9px] text-zinc-700 flex justify-between font-mono">
        <span>{repos.length} repositories</span>
        <span className="text-purple-500">active_stream</span>
      </div>

    </div>
  );
}