import axios from "axios";
import humps from "humps";

export type LoginResponse =
  | {
    success: true;
    message: string;
    authToken: string;
  }
  | {
    success: false;
    message: string;
  }

export async function Login(id: number): Promise<LoginResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/auth/login/${id}`;

  return axios
    .post(apiUrl)
    .then((res) => {
      res.data = humps.camelizeKeys(res.data) as typeof res.data;
      return res.data;
    })
    .catch((error) => {
      throw error;
    });
};