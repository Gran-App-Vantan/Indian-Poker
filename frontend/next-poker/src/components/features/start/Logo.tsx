import Image from 'next/image';


export function Logo () {
    return(
        <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Image
                        src="/logo.svg"
                        alt="Poker"
                        width={1200}
                        height={1200}
                        />
        </div>
    )
}