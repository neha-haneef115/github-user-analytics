import { GitHubUser } from "@/types/github";

export default function UserCard({
  user,
  totalStars,
  topLanguage,
}: {
  user: GitHubUser;
  totalStars: number;
  topLanguage: string;
}) {
  return (
    <div className="bg-zinc-950 border border-white/5 rounded-xl p-4 sm:p-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 mb-6">

        <div className="relative shrink-0">
          <img
            src={user.avatar_url}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-white/10"
            alt="avatar"
          />

          <a
            href={user.html_url}
            target="_blank"
            className="absolute -bottom-2 -right-2 bg-white text-black p-1.5 rounded hover:bg-purple-500 hover:text-white transition"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5C5.7.5.6 5.7.6 12.2c0 5.2 3.4 9.6 8.2 11.1.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.9 2.1 2.9 1.5.1-.7.4-1.2.7-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0C16.8 5.4 17.8 5.7 17.8 5.7c.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1 .8 2.1v3.1c0 .3.2.7.8.6 4.8-1.5 8.2-5.9 8.2-11.1C23.4 5.7 18.3.5 12 .5z" />
            </svg>
          </a>
        </div>

        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-white truncate uppercase">
            {user.login}
          </h2>

          <p className="text-xs text-purple-500 mt-1 uppercase tracking-widest">
            {user.name || "Anonymous"}
          </p>

          <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
            {user.bio || "No bio available"}
          </p>
        </div>

      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-px bg-white/5 border border-white/5">

        <DataPoint label="Stars" value={totalStars} highlight />
        <DataPoint label="Language" value={topLanguage} />
        <DataPoint label="Repos" value={user.public_repos} />
        <DataPoint label="Followers" value={user.followers} />
        <DataPoint label="Following" value={user.following} />
        <DataPoint
          label="Account Age"
          value={`${new Date().getFullYear() - new Date(user.created_at).getFullYear()}y`}
        />

      </div>

      {/* Footer */}
      <div className="mt-5 flex justify-between items-center text-[10px] text-zinc-600">
        <span>
          Joined {new Date(user.created_at).toLocaleDateString()}
        </span>
        <span className="w-8 h-[1px] bg-zinc-800" />
      </div>

    </div>
  );
}

/* ---- Data Block ---- */

function DataPoint({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="bg-zinc-950 p-3 sm:p-4">
      <p className="text-[9px] text-zinc-600 uppercase tracking-wider">
        {label}
      </p>

      <p
        className={`text-sm font-semibold uppercase mt-1 ${
          highlight ? "text-purple-500" : "text-zinc-200"
        }`}
      >
        {value}
      </p>
    </div>
  );
}