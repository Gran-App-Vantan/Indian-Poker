import axios from "axios";
import Cookies from "js-cookie";
import humps from "humps";
import { Card } from "./types";

export interface CurrentOptionsResponse {
  cardOffer: Card[]
};

export async function CurrentOptions(): Promise<CurrentOptionsResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/game/current-options`;
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