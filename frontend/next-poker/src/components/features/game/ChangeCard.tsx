import Image from "next/image";

export function ChangeCard() {
    return (
        <div className="flex items-center justify-center gap-4 ">
        {Array.from({ length: 4 }).map((_, index) => (
            <Image
            key={index}
            src="/game/BackSide.svg"
            width={200}
            height={200}
            alt="ChangeCard"
            className="hover:border-6 hover:border-sky-500 hover:scale-110 transition-transform duration-500 rounded-2xl"
            />
        ))}
        </div>
    );
    }
