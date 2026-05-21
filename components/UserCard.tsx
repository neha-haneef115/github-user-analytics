import { GitHubUser } from "@/types/github";

export default function UserCard({ user, totalStars, topLanguage }: {
  user: GitHubUser;
  totalStars: number;
  topLanguage: string;
}) {
  return (
    <div className="bg-zinc-950 p-6 relative overflow-hidden border border-white/5">
      <div className="flex items-start gap-5 mb-8">
        <div className="relative group shrink-0">
          <img 
            src={user.avatar_url} 
            className="w-20 h-20 grayscale group-hover:grayscale-0 transition-all duration-500 border border-white/10" 
            alt="avatar"
          />
          {/* GitHub Icon Link */}
          <a 
            href={user.html_url} 
            target="_blank" 
            className="absolute -bottom-2 -right-2 bg-white text-black p-1.5 hover:bg-purple-500 hover:text-white transition-colors border border-black"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5C5.7.5.6 5.7.6 12.2c0 5.2 3.4 9.6 8.2 11.1.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.9 2.1 2.9 1.5.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0C16.8 5.4 17.8 5.7 17.8 5.7c.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1 .8 2.1v3.1c0 .3.2.7.8.6 4.8-1.5 8.2-5.9 8.2-11.1C23.4 5.7 18.3.5 12 .5z" />
            </svg>
          </a>
        </div>

        <div className="min-w-0">
          <h2 className="text-xl font-black text-white truncate leading-none uppercase tracking-tighter">
            {user.login}
          </h2>
          <p className="text-[10px] font-mono text-purple-500 mt-1 uppercase font-bold tracking-widest">
            {user.name || "Anonymous_Entity"}
          </p>
          <p className="text-[10px] text-zinc-500 mt-3 leading-relaxed font-medium uppercase italic">
            {user.bio || "No system biography found."}
          </p>
        </div>
      </div>

      {/* Expanded Data Grid */}
      <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">
        <DataPoint label="Aggregate_Stars" value={totalStars} highlight />
        <DataPoint label="Primary_Stack" value={topLanguage} />
        <DataPoint label="Public_Repos" value={user.public_repos} />
        <DataPoint label="Followers" value={user.followers} />
        <DataPoint label="Following" value={user.following} />
        <DataPoint label="Account_Age" value={`${new Date().getFullYear() - new Date(user.created_at).getFullYear()}Y`} />
      </div>

      <div className="mt-6 flex justify-between items-center opacity-30 group-hover:opacity-100 transition-opacity">
        <span className="text-[8px] font-mono font-bold tracking-[0.4em] text-zinc-500 uppercase">
          Node_Deployment: {new Date(user.created_at).toLocaleDateString()}
        </span>
        <div className="h-1 w-8 bg-zinc-800" />
      </div>
    </div>
  );
}

function DataPoint({ label, value, highlight = false }: { label: string, value: string | number, highlight?: boolean }) {
  return (
    <div className="bg-zinc-950 p-3">
      <p className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter mb-0.5">{label}</p>
      <p className={`text-sm font-black uppercase ${highlight ? 'text-purple-500' : 'text-zinc-200'}`}>
        {value}
      </p>
    </div>
  );
}