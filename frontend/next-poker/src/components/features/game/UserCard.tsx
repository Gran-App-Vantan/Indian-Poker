import Image from "next/image";

export function UserCard() {
    return (
        <div className="flex flex-col items-start  gap-2">
            <p className="text-white text-4xl font-black">
                1p
            </p>
            <div className="relative">
                <Image
                    src="/game/BackSide.svg"
                    width={165}
                    height={221}
                    alt="UserCard"
                />
                <div className="flex items-center justify-center absolute top-[-20px] right-[-20px]  w-18 h-18 rounded-full bg-linear-to-r from-[#C59D4D] via-[#f5e798] to-[#7A5C2E]">
                    <Image
                        src="/game/yuma.png"
                        width={64}
                        height={64}
                        alt="UserIcon"
                        className="rounded-full"
                    />
                </div>
            </div>
        </div>
    )
    }