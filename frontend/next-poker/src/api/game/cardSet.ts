import axios from "axios";
import Cookies from "js-cookie";

export async function CardSet(): Promise<string> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/game/set`;
  const authToken = Cookies.get("authToken");

  return axios
    .post(apiUrl, {}, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json"
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};