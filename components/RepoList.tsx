import { Repo } from "@/types/github";

export default function RepoList({ repos }: { repos: Repo[] }) {
  return (
    <div className="mt-4">
      <h3 className="font-bold mb-2">Top Repositories</h3>

      <ul className="space-y-2">
        {repos.map((repo) => (
          <li key={repo.id} className="border p-2 rounded">
            <div className="font-semibold">{repo.name}</div>
            <div className="text-sm">
              ⭐ {repo.stargazers_count} | {repo.language || "N/A"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}