import { StandbyItem } from "./StandbyItem";
import { PlayingUser, GetSnsUserResponse } from "@/api/game";

interface StandbyProps {
    playingUsers: PlayingUser[] | undefined;
    user: GetSnsUserResponse | undefined;
    onExit?: () => void;
}

export function Standby({ 
    playingUsers,
    user,
    onExit,
}: StandbyProps) {
    const standby = ["待機中...", "準備OK"];
    
    const isPlayer1 = playingUsers?.find(p => p.snsId === user?.snsId)?.deviceNumber === 1;
    const playerCount = playingUsers?.length ?? 0;
    const canStartGame = playerCount >= 2;
    const buttonText = isPlayer1 ? "ゲーム開始" : standby[0];
    
    // 自分が参加しているユーザーかチェック
    const isParticipating = playingUsers?.some(p => p.snsId === user?.snsId) ?? false;

    return (
        <dialog 
            className="flex flex-col gap-14 items-center justify-center m-auto gradation-red  rounded-custom overflow-hidden  bg-black/80 w-[1094px] h-[639px]"
        >
            {/* 退出ボタン - 自分が参加している場合のみ表示 */}
            {onExit && isParticipating && (
                <button
                    onClick={onExit}
                    className="absolute top-4 right-4 text-white hover:text-gray-300 text-sm font-bold px-4 py-2 bg-gray-700/50 rounded-lg hover:bg-gray-600/50 transition-colors"
                >
                    × 退出
                </button>
            )}
            
            <ul className="flex flex-col gap-3">
                {playingUsers?.map((playinguser, index) => {
                    const isMe = user?.snsId === playinguser.snsId;
                    return (
                        <li key={index}>
                            <StandbyItem 
                                iconSrc={playinguser.userIcon}
                                deviceNumber={playinguser.deviceNumber}
                                name={playinguser.name}
                                point={playinguser.point}
                                isCurrentUser={isMe}
                            />
                        </li>
                    );
                })}
            </ul>
            <div className={`${isPlayer1 && "rounded-2xl bg-gradient-to-r from-[#E9CA00] via-[#FFED7A] to-[#E9CA00] p-1 cursor-pointer"}`}>
                <button
                    disabled={isPlayer1 && !canStartGame}
                    className={`flex justify-center items-center w-48 h-20 rounded-2xl font-black text-3xl ${
                        !isPlayer1
                            ? 'bg-gray-400/40 text-gray-300 cursor-not-allowed'
                            : 'bg-[linear-gradient(90deg,_#CF5056_0%,_#770E13_50%,_#CF5056_100%)] text-white cursor-pointer'
                    }`}
                >
                    {buttonText}
                </button>
            </div>
            {isPlayer1 && !canStartGame && (
                <p className="text-white text-sm -mt-10">※2人以上のプレイヤーが必要です</p>
            )}
        </dialog>
    );
}