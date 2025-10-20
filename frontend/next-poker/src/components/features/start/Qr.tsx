export function Qr(){
    return(
        <dialog
            className="flex items-center justify-center m-auto
                gradation-red  rounded-custom overflow-hidden  bg-black/80 w-[865px] h-[541px] ">
                <div className="flex flex-col justify-center items-center gap-10">
            <div className="flex justify-center items-center w-64 h-64 bg-white">
                仮QR
            </div>
                <p className="text-3xl text-white font-black">QRコードを読み込んでください</p>
            </div>  
        </dialog>
    );
}

