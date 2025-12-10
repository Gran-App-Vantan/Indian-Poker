import axios from "axios";
import { getAuthToken } from "@/utils/authToken";

export interface ChangeLatchResponse {
  message: string;
  latch: number;
}

export async function ChangeLatch(deviceNumber: number, latch: number):Promise<ChangeLatchResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/game/change-latch`;
  const authToken = getAuthToken(deviceNumber);

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