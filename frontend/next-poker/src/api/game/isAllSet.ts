import axios from "axios";
import humps from "humps";
import { getAuthToken } from "@/utils/authToken";

export async function IsAllSet(deviceNumber: number):Promise<boolean> {
  const apiUrl = `${process.env.NEXT_PUBLI_GAME_API_URL}/game/is-all-set`;
  const authToken = getAuthToken(deviceNumber);

  return axios
    .get(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json"
      },
    })
    .then((res) => {
      return res.data = humps.camelizeKeys(res.data) as typeof res.data;
    })
    .catch((err) => {
      throw err;
    });
};