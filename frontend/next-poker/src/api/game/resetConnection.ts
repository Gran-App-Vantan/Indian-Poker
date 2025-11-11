import axios from "axios";
import Cookies from "js-cookie";

export async function ResetConnection(): Promise<void> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/auth/reset-connection`;
  const authToken = Cookies.get("authToken");
  
  return axios
    .post(apiUrl, {}, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json"
      },
    })
    .then(() => {
      console.log("接続をリセットしました");
    })
    .catch((err) => {
      console.error("接続のリセットに失敗しました:", err);
      throw err;
    });
}
