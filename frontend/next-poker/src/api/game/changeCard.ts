import axios from "axios";
import Cookies from "js-cookie";
import humps from "humps";
import { Card } from "./types";

export interface ChangeCardRequest {
  cardId: number;
  cardOffers: number[];
}

export interface ChangeCardResponse {
  message: string;
  card: Card;
}

export async function ChangeCard(req: ChangeCardRequest):Promise<ChangeCardResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/game/change-card`;
  const authToken = Cookies.get("authToken");

  return axios
    .post(apiUrl, req, {
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