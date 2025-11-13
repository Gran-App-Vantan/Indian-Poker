import axios from "axios";
import { getAuthToken } from "@/utils/authToken";

export type GameStartResponse = 
  | {
    success: true;
    message: string;
  }
  | {
    success: false;
    message: string;
  };

export async function GameStart(deviceNumber: number):Promise<GameStartResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/game/start`;
  const authToken = getAuthToken(deviceNumber);

  return axios
    .post(apiUrl, {
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