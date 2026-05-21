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
    <div className="p-4 border rounded-lg mt-4">
      <img src={user.avatar_url} className="w-20 rounded-full" />

      <h2 className="text-xl font-bold">{user.login}</h2>
      <p>{user.bio || "No bio"}</p>

      <div className="mt-2 text-sm space-y-1">
        <p>Followers: {user.followers}</p>
        <p>Following: {user.following}</p>
        <p>Repos: {user.public_repos}</p>
        <p>Total Stars: {totalStars}</p>
        <p>Top Language: {topLanguage}</p>
        <p>Joined: {new Date(user.created_at).toDateString()}</p>
      </div>
    </div>
  );
}