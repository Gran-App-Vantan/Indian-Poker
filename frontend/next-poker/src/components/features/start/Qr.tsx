import { QRCodeSVG } from "qrcode.react";

export function Qr({ token, deviceNumber }: { token: string; deviceNumber?: number }) {
    const qrUrl = `http://10.79.12.146:3005/connection/${token}/`;
    console.log("QRコード生成:", { token, deviceNumber, qrUrl });
    
    return(
        <dialog
            className="flex items-center justify-center m-auto
                gradation-red  rounded-custom overflow-hidden  bg-black/80 w-[865px] h-[541px] ">
                <div className="flex flex-col justify-center items-center gap-10">
            {deviceNumber && (
                <p className="text-4xl text-yellow-400 font-black">デバイス {deviceNumber}</p>
            )}
            <div className="flex justify-center items-center w-64 h-64 bg-white rounded-xl">
                <QRCodeSVG value={qrUrl}/>
            </div>
                <p className="text-3xl text-white font-black">QRコードを読み込んでください</p>
            </div>  
        </dialog>
    );
}

