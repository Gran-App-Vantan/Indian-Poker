import Image from 'next/image';

export function StartButton() {
    return (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 hover:cursor-pointer hover:scale-125 transition-transform duration-500">
            <Image
                src="/start/StartButton.png"
                alt="start-button"
                width={400}
                height={100}
            />
        </div>
    );
}