import axios from "axios";
import Cookies from "js-cookie";
import humps from "humps";

export interface getCurrentUserResponse {
  id: number;
  userId: number;
  snsId: number;
  point: number;
  name: string;
  userIcon: string;
  isParent: boolean;
}

export async function GetCurrentUser(): Promise<getCurrentUserResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/me`;
  const authToken = Cookies.get("authToken");

  return axios
    .get(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    })
    .then((res) => {
      res.data = humps.camelizeKeys(res.data);
      return res.data as getCurrentUserResponse;
    })
    .catch((err) => {
      throw err;
    })
}