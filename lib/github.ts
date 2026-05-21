import axios from "axios";

const BASE = "https://api.github.com";

export async function getUser(username: string) {
  try {
    const res = await axios.get(`${BASE}/users/${username}`);
    return res.data;
  } catch (err: any) {
    throw new Error("USER_FETCH_FAILED");
  }
}

export async function getRepos(username: string) {
  try {
    const res = await axios.get(`${BASE}/users/${username}/repos`);
    return res.data;
  } catch (err: any) {
    throw new Error("REPOS_FETCH_FAILED");
  }
}