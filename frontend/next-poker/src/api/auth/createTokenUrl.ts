import axios from "axios";
import humps from "humps";

export interface CreateTokenUrlRequest {
  deviceNumber: number;
  gameType: "IndianPoker" | "Roulette" | "Slot" | "Blackjack";
}

export type CreateTokenUrlResponse =
  | {
    success: true;
    message: string;
    data: {
      token: string;
      gameType: "IndianPoker" | "Roulette" | "Slot" | "Blackjack";
    }
  }
  | {
    success: false;
  }

export async function CreateTokenUrl(req: CreateTokenUrlRequest): Promise<CreateTokenUrlResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/game/create-url`;

  return axios
    .post(apiUrl, req, {
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    })
    .then((res) => {
      res.data = humps.camelizeKeys(res.data);
      return res.data as CreateTokenUrlResponse;
    })
    .catch((err) => {
      throw err;
    });
}