import { QRCodeSVG } from "qrcode.react";

export function Qr({ token }: { token: string}) {
    return(
        <dialog
            className="flex items-center justify-center m-auto
                gradation-red  rounded-custom overflow-hidden  bg-black/80 w-[865px] h-[541px] ">
                <div className="flex flex-col justify-center items-center gap-10">
            <div className="flex justify-center items-center w-64 h-64 bg-white rounded-xl">
                <QRCodeSVG value={`http://10.79.12.146:3005/connection/${token}/`}/>
            </div>
                <p className="text-3xl text-white font-black">QRコードを読み込んでください</p>
            </div>  
        </dialog>
    );
}

