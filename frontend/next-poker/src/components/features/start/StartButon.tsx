import Image from 'next/image';

export function StartButton() {
    return (
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 hover:cursor-pointer">
            <Image
                src="/start/StartButton.png"
                alt="start-button"
                width={400}
                height={100}
            />
        </div>
    );
}