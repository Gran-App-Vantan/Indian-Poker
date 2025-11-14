import Image from "next/image";
import { Card } from "@/api/game/types";

export function ChangeCard({ cards }: { cards: Card[] | null }) {
    return (
        <ul className="flex items-center justify-center gap-4 ">
            {Array.isArray(cards) && cards.map((card) => {
                return (
                    <li key={card.id}>
                        <Image 
                            src={card.imagePath}
                            width={160}
                            height={215}
                            alt=""
                        />
                    </li>
                );
            })}
        </ul>
    );
}
