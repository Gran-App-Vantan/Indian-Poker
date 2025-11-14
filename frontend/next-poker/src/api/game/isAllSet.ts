import axios from "axios";
import humps from "humps";
import { getAuthToken } from "@/utils/authToken";

export async function IsAllSet(deviceNumber: number): Promise<boolean> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/game/is-all-set`;
  const authToken = getAuthToken(deviceNumber);

  return axios
    .get(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json"
      },
    })
    .then((res) => {
      const camelizedData = humps.camelizeKeys(res.data) as { allSet: boolean };
      console.log("IsAllSet API response:", camelizedData);
      return camelizedData.allSet;
    })
    .catch((err) => {
      console.error("IsAllSet API error:", err);
      throw err;
    });
};