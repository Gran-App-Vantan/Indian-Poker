export function LoginButton() {
    return (
        <div className="flex justify-center items-center gap-10 
        font-sans text-2xl font-black text-outline ">
            <button className=" flex  justify-center items-center w-72 h-72
            BgRed   rounded-custom 
            hover:cursor-pointer hover:scale-110 transition-transform duration-500">
                <p className="text-white drop-shadow-xl">ログインしてプレイ</p>
            </button>
            
            <button className="flex  justify-center items-center w-72 h-72 
            BgGray rounded-custom
            hover:cursor-pointer hover:scale-110 transition-transform duration-500">
                <p className="text-white  drop-shadow-xl">ゲストとしてプレイ</p>
            </button>

        </div>
    );
}