import axios from "axios";
import { getAuthToken } from "@/utils/authToken";

export async function IsGameStarted(deviceNumber: number): Promise<boolean> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/game/is-started`;
  const authToken = getAuthToken(deviceNumber);

  return axios
    .get(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json"
      },
    })
    .then((res) => {
      return res.data; // バックエンドから true/false が返される
    })
    .catch((err) => {
      console.error("ゲーム開始状態の取得エラー:", err);
      return false;
    });
}
