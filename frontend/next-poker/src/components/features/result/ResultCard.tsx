import Image from "next/image";

type ResultType = {
    id: number;
    type: "winner" | "second" | "third" | "other"; // タイプ分け
    width: number;
    height: number;
    cardWidth: number;
    cardHeight: number;
    bgGradient: string;
    titleImg?: string;
    avatar: string;
};

const results: ResultType[] = [
    {
        id: 1,
        type: "winner",
        width: 290,
        height: 379,
        cardWidth: 260,
        cardHeight: 349,
        bgGradient: "bg-linear-to-r from-[#C59D4D] via-[#f5e798] to-[#C59D4D]",
        titleImg: "/game/winner.svg",
        avatar: "/game/yuma.png",
    },
    {
        id: 2,
        type: "second",
        width: 236,
        height: 323,
        cardWidth: 218,
        cardHeight: 293,
        bgGradient: "bg-linear-to-r from-[#B2BDC8] via-[#5A6467] to-[#B2BDC8]",
        titleImg: "/game/no2.svg",
        avatar: "/game/yuma.png",
    },
    {
        id: 3,
        type: "third",
        width: 222,
        height: 304,
        cardWidth: 204,
        cardHeight: 274,
        bgGradient: "bg-linear-to-r from-[#CEAF98] via-[#A3807A] to-[#CEAF98]",
        titleImg: "/game/no3.svg",
        avatar: "/game/yuma.png",
    },
    {
        id: 4,
        type: "other",
        width: 204,
        height: 274,
        cardWidth: 204,
        cardHeight: 274,
        bgGradient: "", // 無地
        avatar: "/game/yuma.png",
    },
];

export function ResultCard() {
    return (
        <div className="flex items-center justify-center gap-10">
        {results.map((res) => (
            <div
            key={res.id}
            className={`relative flex flex-col items-center justify-center gap-4 rounded-2xl ${res.bgGradient}`}
            style={{ width: `${res.width}px`, height: `${res.height}px` }}
            >
            {res.titleImg && (
                <Image
                src={res.titleImg}
                width={res.type === "winner" ? 164 : 164}
                height={res.type === "winner" ? 52 : 54}
                alt=""
                className="absolute top-[-20px] flex items-center justify-center shadow-inner"
                />
            )}

            <Image
                src="/game/BackSide.svg"
                width={res.cardWidth}
                height={res.cardHeight}
                alt="PlayerCard"
            />

            <div
                className={`absolute bottom-[-45px] flex items-center justify-center w-28 h-28 rounded-full ${
                res.bgGradient || "bg-gray"
                }`}
            >
                <Image
                src={res.avatar}
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
