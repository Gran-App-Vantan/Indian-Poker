import Image from "next/image";
import { ResultResponse } from "@/api/game/result";

interface ResultCardProps {
    result: ResultResponse;
    deviceNumber: number | null;
}

type ResultType = {
    id: number;
    deviceNumber: number;
    name?: string;
    userIcon?: string;
    type: "winner" | "second" | "third" | "other";
    width: number;
    height: number;
    cardWidth: number;
    cardHeight: number;
    bgGradient: string;
    titleImg?: string;
    cardImage: string;
    point: number;
    latch: number;
};

export function ResultCard({ 
    result, 
    deviceNumber 
}: ResultCardProps) {
    if (!result) {
        return <div className="text-white text-2xl">結果データがありません</div>;
    }

    // ランキングデータを整形
    const rankedPlayers: ResultType[] = result.ranking.map((rank) => {
        let type: "winner" | "second" | "third" | "other";
        let width: number;
        let height: number;
        let cardWidth: number;
        let cardHeight: number;
        let bgGradient: string;
        let titleImg: string | undefined;

        if (rank.rankPosition === 1) {
            type = "winner";
            width = 290;
            height = 379;
            cardWidth = 260;
            cardHeight = 349;
            bgGradient = "bg-linear-to-r from-[#C59D4D] via-[#f5e798] to-[#C59D4D]";
            titleImg = "/game/winner.svg";
        } else if (rank.rankPosition === 2) {
            type = "second";
            width = 236;
            height = 323;
            cardWidth = 218;
            cardHeight = 293;
            bgGradient = "bg-linear-to-r from-[#B2BDC8] via-[#5A6467] to-[#B2BDC8]";
            titleImg = "/game/no2.svg";
        } else if (rank.rankPosition === 3) {
            type = "third";
            width = 222;
            height = 304;
            cardWidth = 204;
            cardHeight = 274;
            bgGradient = "bg-linear-to-r from-[#CEAF98] via-[#A3807A] to-[#CEAF98]";
            titleImg = "/game/no3.svg";
        } else {
            type = "other";
            width = 204;
            height = 274;
            cardWidth = 204;
            cardHeight = 274;
            bgGradient = "";
        }

        return {
            id: rank.id,
            deviceNumber: rank.id,
            type,
            width,
            height,
            cardWidth,
            cardHeight,
            bgGradient,
            titleImg,
            cardImage: rank.card?.imagePath || "/game/BackSide.svg",
            point: rank.point,
            latch: rank.latch,
        };
    });

    return (
        <div className="flex items-center justify-center gap-10">
        {rankedPlayers.map((player) => (
            <div
            key={player.id}
            className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl ${player.bgGradient}`}
            style={{ width: `${player.width}px`, height: `${player.height}px` }}
            >
            {player.titleImg && (
                <Image
                src={player.titleImg}
                width={player.type === "winner" ? 164 : 164}
                height={player.type === "winner" ? 52 : 54}
                alt=""
                className="absolute top-[-20px] flex items-center justify-center shadow-inner"
                />
            )}

            <Image
                src={player.cardImage}
                width={player.cardWidth}
                height={player.cardHeight}
                alt="PlayerCard"
            />

            <div
                className={`absolute bottom-[-45px] flex items-center justify-center w-28 h-28 rounded-full ${
                player.bgGradient || "bg-gray"
                }`}
            >
                <Image
                    src={player.userIcon || "/icons/default-user-icon.svg"}
                    width={94}
                    height={94}
                    alt="PlayerAvatar"
                    className="rounded-full"
                />
            </div>
            </div>
        ))}
        </div>
    );
}
