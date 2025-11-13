import axios from "axios";
import Cookies from "js-cookie";
import humps from "humps";

export interface EnterGameRequest {
  userId: number;
  snsId?: number | null;
  point?: number | null;
}

export type EnterGameResponse =
  | {
    success: true;
    message: string;
    data: {
      userId: number;
      snsId: number | null;
      point: number;
    };
  }
  | {
    success: false;
    message: string;
  }

export async function EnterGame(req: EnterGameRequest): Promise<EnterGameResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/auth/enter`;

  const requestBody = humps.decamelizeKeys({
    userId: req.userId,
    snsId: req.snsId ?? null,
    point: req.point ?? null,
  });

  return axios
    .post(apiUrl, requestBody)
    .then((res) => {
      res.data = humps.camelizeKeys(res.data) as typeof res.data;
      return res.data;
    })
    .catch((error) => {
      if (error.response?.data) {
        return humps.camelizeKeys(error.response.data) as EnterGameResponse;
      }
      throw error;
    });
}
