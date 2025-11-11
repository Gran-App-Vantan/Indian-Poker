import axios from "axios";
import Cookies from "js-cookie";
import humps from "humps";

export interface GetSnsUserResponse {
  userId: number;
  snsId: number | null;
  point: number;
  name: string;
  userIcon: string | null;
  isParent: boolean;
}

export async function GetSnsUser():Promise<GetSnsUserResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/auth/me`;
  const authToken = Cookies.get("authToken");

  return axios
    .get(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json"
      },
    })
    .then((res) => {
      res.data = humps.camelizeKeys(res.data) as typeof res.data;
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};