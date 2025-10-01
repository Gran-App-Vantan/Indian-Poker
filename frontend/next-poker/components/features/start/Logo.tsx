import Image from "next/image";

export  function Logo() {
    return (
        <div>
            <div className="flex items-center justify-center">
                <Image
                    src="/logo.svg"
                    alt="Poker"
                    width={1000}
                    height={1000}
                />
            </div>
        
            {/* <div className="fixed bottom-0 left-0">
                <Image
                    src="/light.svg"
                    alt="light"
                    width={1000}
                    height={1000}
                    />
            </div> */}
        </div>
    );
}