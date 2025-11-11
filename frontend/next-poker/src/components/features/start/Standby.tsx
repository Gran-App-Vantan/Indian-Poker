import { StandbyItem } from "./StandbyItem";

export interface StandbyProps {
    iconSrc: string | undefined | null;
    deviceNumber: number;
    name: string | undefined | null;
    point: number | undefined;
}

export function Standby({
    iconSrc,
    deviceNumber,
    name,
    point
}: StandbyProps) {
    const standby = ["待機中...", "準備OK"];

    return (
        <dialog 
            className="flex flex-col gap-14 items-center justify-center m-auto gradation-red  rounded-custom overflow-hidden  bg-black/80 w-[1094px] h-[639px]"
        >
            <ul className="flex flex-col gap-3">
                <li>
                    <StandbyItem
                        iconSrc={iconSrc}
                        deviceNumber={deviceNumber}
                        name={name}
                        point={point}
                    />
                </li>
            </ul>
            <button className="flex justify-center items-center w-48 h-20  bg-white/40 rounded-2xl font-black text-white text-3xl">
                <p>{standby[0]}</p>
            </button>
        </dialog>
    );
}