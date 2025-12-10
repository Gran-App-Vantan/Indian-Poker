import axios from "axios";
import { getAuthToken } from "@/utils/authToken";

export async function CardSet(deviceNumber: number): Promise<string> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/game/set`;
  const authToken = getAuthToken(deviceNumber);

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