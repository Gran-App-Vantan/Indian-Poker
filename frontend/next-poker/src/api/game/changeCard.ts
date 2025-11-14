import axios from "axios";
import humps from "humps";
import { Card } from "./types";
import { getAuthToken } from "@/utils/authToken";

export interface ChangeCardRequest {
  deviceNumber: number;
  cardId: number;
  cardOffers: number[];
}

export interface ChangeCardResponse {
  message: string;
  card: Card;
}

export async function ChangeCardApi(req: ChangeCardRequest):Promise<ChangeCardResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/game/change-card`;
  const authToken = getAuthToken(req.deviceNumber);

  return axios
    .post(apiUrl, humps.decamelizeKeys(req), {
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