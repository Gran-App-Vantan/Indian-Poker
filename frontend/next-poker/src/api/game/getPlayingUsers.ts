import axios from "axios";
import humps from "humps";
import { User } from "../auth";
import { getAuthToken } from "@/utils/authToken";

export type PlayingUser = Pick<User, "id" | "deviceNumber" | "snsId" | "name" | "userIcon" | "point">;

export type GetPlayingUsersResponse = 
  | {
    success: true;
    message: string;
    users: PlayingUser[];
  }
  | {
    success: false;
    message: string;
  }

export async function GetPlayingUsers(deviceNumber: number):Promise<GetPlayingUsersResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_GAME_API_URL}/game/is-playing-user`;
  const authToken = getAuthToken(deviceNumber);

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