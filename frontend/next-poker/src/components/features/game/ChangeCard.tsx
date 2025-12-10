import Image from "next/image";
import { Card } from "@/api/game/types";

interface ChangeCardProps {
    cards: Card[] | null;
    selectedCardId: number | null;
    onCardClick: (cardId: number) => void;
}

export function ChangeCard({
    cards,
    selectedCardId,
    onCardClick,
}: ChangeCardProps) {
    return (
        <ul className="flex items-center justify-center gap-4 ">
            {Array.isArray(cards) && cards.map((card) => {
                const isSelected = selectedCardId === card.id;
                return (
                    <li key={card.id}>
                        <Image 
                            src="/game/BackSide.svg"
                            width={160}
                            height={215}
                            alt=""
                            onClick={() => onCardClick(card.id)}
                            className={`
                                cursor-pointer hover:scale-110 transition-transform duration-300
                                ${isSelected && "border-6 border-sky-500 rounded-2xl scale-110"}
                            `}
                        />
                    </li>
                );
            })}
        </ul>
    );
}
