import Image from 'next/image';


export function Logo () {
    return(
        <div className="absolute inset-0 flex items-center justify-center z-10 ">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={900}
                        height={900}
                        style={{ width: "auto", height: "auto" }}
                        priority
                        />
        </div>
    )
}