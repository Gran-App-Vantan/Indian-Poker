import axios from "axios";
import Cookies from "js-cookie";

export interface ChangeLatchResponse {
  message: string;
  latch: number;
}

export async function ChangeLatch(latch: number):Promise<ChangeLatchResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/game/change-latch`;
  const authToken = Cookies.get("authToken");

  return axios
    .post(apiUrl, { latch }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json"
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};