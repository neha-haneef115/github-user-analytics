import { Repo } from "@/types/github";

export default function RepoList({ repos }: { repos: Repo[] }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-zinc-800 to-zinc-800" />
        <h3 className="font-black text-[10px] uppercase tracking-[0.4em] text-zinc-500">
          Top_Repositories_Stream
        </h3>
      </div>

      <div className="grid gap-3">
        {repos.map((repo, index) => (
          <div 
            key={repo.id} 
            className="group relative bg-[#0a0a0a] border border-white/5 p-4 transition-all hover:border-purple-500/30 hover:bg-[#0d0d0d]"
          >
            {/* Index Counter */}
            <div className="absolute top-0 right-0 p-2 font-mono text-[8px] text-zinc-800 group-hover:text-purple-500/30">
              [0{index + 1}]
            </div>

            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <a 
                  href={repo.html_url}
                  target="_blank"
                  className="font-black text-sm text-zinc-200 uppercase tracking-tighter hover:text-purple-400 transition-colors"
                >
                  {repo.name}
                </a>
                
                <div className="flex items-center gap-3 font-mono text-[10px]">
                  <span className="text-purple-500 font-bold">
                    ★ {repo.stargazers_count.toLocaleString()}
                  </span>
                  <span className="text-zinc-600">|</span>
                  <span className="text-zinc-400 uppercase tracking-widest">
                    {repo.language || "PLAIN_TEXT"}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <a 
                href={repo.html_url}
                target="_blank"
                className="opacity-0 group-hover:opacity-100 transition-all bg-zinc-200 text-black px-3 py-1 text-[9px] font-black uppercase tracking-tighter hover:bg-purple-500 hover:text-white"
              >
                Access_Node
              </a>
            </div>

            {/* Visual "Activity" Bar */}
            <div className="mt-4 h-[2px] w-full bg-zinc-900 overflow-hidden">
              <div 
                className="h-full bg-purple-600 transition-all duration-1000 group-hover:bg-purple-400"
                style={{ width: `${Math.min((repo.stargazers_count / 100) * 100, 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Terminal Footer Decor */}
      <div className="mt-6 flex justify-between font-mono text-[8px] text-zinc-700 uppercase tracking-widest">
        <span>End_of_List</span>
        <span className="animate-pulse">_Cursor_Active</span>
      </div>
    </div>
  );
}