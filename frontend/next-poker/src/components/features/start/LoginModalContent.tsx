export type LoginModalContentProps = {
    onGuestPlay: () => void;
    onLogin: () => void;
}

export function LoginModalContent({
    onGuestPlay,
    onLogin
}: LoginModalContentProps
) {
    return (
        <dialog
            className="flex items-center justify-center m-auto
                gradation-red  rounded-custom overflow-hidden  bg-black/80 w-[865px] h-[541px] ">
            <div className="flex justify-center items-center gap-10 
            font-sans text-2xl font-black"
            >

                <button className="flex  justify-center items-center w-72 h-72 
            BgGray rounded-custom text-outline
            hover:cursor-pointer hover:scale-110 transition-transform duration-500"
                    onClick={onGuestPlay}
                >
                    <p className="text-white  drop-shadow-xl">ゲストとしてプレイ</p>
                </button>

                <button className=" flex  justify-center items-center w-72 h-72
            BgRed   rounded-custom 
            hover:cursor-pointer hover:scale-110 transition-transform duration-500"
                    onClick={onLogin}
                >
                    <p className="text-white drop-shadow-xl">ログインしてプレイ</p>
                </button>
            </div>
        </dialog>
    )
}
