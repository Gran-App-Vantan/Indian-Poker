import { StandbyItem } from "./StandbyItem";
import { PlayingUser } from "@/api/game";

export function Standby({ playingUsers }: { playingUsers: PlayingUser[] | undefined }) {
    const standby = ["待機中...", "準備OK"];

    return (
        <dialog 
            className="flex flex-col gap-14 items-center justify-center m-auto gradation-red  rounded-custom overflow-hidden  bg-black/80 w-[1094px] h-[639px]"
        >
            <ul className="flex flex-col gap-3">
                {playingUsers?.map((playinguser, index) => (
                    <li key={index}>
                        <StandbyItem 
                            iconSrc={playinguser.userIcon}
                            deviceNumber={playinguser.deviceNumber} // deviceNumberはユーザーのidを使用
                            name={playinguser.name}
                            point={playinguser.point}
                        />
                    </li>
                ))}
            </ul>
            <button className="flex justify-center items-center w-48 h-20  bg-white/40 rounded-2xl font-black text-white text-3xl">
                <p>{standby[0]}</p>
            </button>
        </dialog>
    );
}