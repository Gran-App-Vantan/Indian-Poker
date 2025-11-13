import Cookies from "js-cookie";

/**
 * デバイス番号に応じたauthTokenを取得
 */
export function getAuthToken(deviceNumber: number | null): string | undefined {
  if (!deviceNumber) {
    return undefined;
  }
  return Cookies.get(`authToken_device${deviceNumber}`);
}

/**
 * デバイス番号に応じたauthTokenを保存
 */
export function setAuthToken(deviceNumber: number, token: string): void {
  Cookies.set(`authToken_device${deviceNumber}`, token);
}

/**
 * デバイス番号に応じたauthTokenを削除
 */
export function removeAuthToken(deviceNumber: number): void {
  Cookies.remove(`authToken_device${deviceNumber}`);
}
