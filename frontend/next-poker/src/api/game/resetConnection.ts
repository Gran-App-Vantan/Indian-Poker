import axios from "axios";
import Cookies from "js-cookie";

const RESET_CONNECTION_ENDPOINT = `${process.env.NEXT_PUBLIC_GAME_API_URL}/auth/reset-connection`;

export async function ResetConnection(): Promise<void> {
  const authToken = Cookies.get("authToken");

  return axios
    .post(RESET_CONNECTION_ENDPOINT, {}, {
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

export function ResetConnectionKeepAlive(): void {
  const authToken = Cookies.get("authToken");

  if (typeof window === "undefined" || !authToken) {
    return;
  }

  try {
    fetch(RESET_CONNECTION_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      keepalive: true,
    }).catch((err) => {
      console.error("keepaliveでの接続リセットに失敗しました:", err);
    });
  } catch (error) {
    console.error("接続リセットのkeepalive呼び出し中に例外が発生しました:", error);
  }
}
