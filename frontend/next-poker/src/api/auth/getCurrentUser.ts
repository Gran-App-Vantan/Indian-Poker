import axios from "axios";
import Cookies from "js-cookie";
import humps from "humps";
import { User } from "./types";

export async function GetCurrentUser(): Promise<User> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/auth/me`;
  const authToken = Cookies.get("authToken");

  return axios
    .get(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    })
    .then((res) => {
      res.data = humps.camelizeKeys(res.data);
      return res.data as User;
    })
    .catch((err) => {
      throw err;
    })
}