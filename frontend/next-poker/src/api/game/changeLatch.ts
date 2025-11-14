import axios from "axios";
import Cookies from "js-cookie";

export interface ChangeLatchResponse {
    message: string;
    latch: number;
  }

export async function ChangeLatch():Promise<ChangeLatchResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_AP_URL}`;
  const authToken = Cookies.get("authToken");

  return axios
    .post(apiUrl, {}, {
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