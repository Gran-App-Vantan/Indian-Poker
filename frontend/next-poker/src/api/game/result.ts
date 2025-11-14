import axios from "axios";
import humps from "humps";
import { getAuthToken } from "@/utils/authToken";
import { Card, Player } from "./types";
import { Rank } from "../ranking/types";

export interface ResultResponse {
  winners: [
    id: number,
    card: Card,
    latch: number,
    point: number,
  ],
  totalLatch: number;
  isDraw: boolean;
  players: Player[];
  ranking: Rank[];
}

export async function Result(deviceNumber: number):Promise<ResultResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/game/result`;
  const authToken = getAuthToken(deviceNumber);

  return axios
    .get(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json"
      },
    })
    .then((res) => {
      return res.data = humps.camelizeKeys(res.data) as typeof res.data;
    })
    .catch((err) => {
      throw err;
    });
};