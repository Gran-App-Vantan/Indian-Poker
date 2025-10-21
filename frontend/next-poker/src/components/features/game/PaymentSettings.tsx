import Image from "next/image"
import styles from "@/app/game/GamePage.module.css"


export function PaymentSettings() {
    return (
        <dialog
            className="flex  flex-col items-center  m-auto p-8 gap-4
                gradation-red  rounded-custom overflow-hidden  bg-black/80 w-[865px] h-[541px]"
                >

                    <p className="text-4xl font-black text-white">掛金を決めてください</p>
                    
                    <div className="flex gap-3 font-bold">
                        <button className="flex justify-center items-center flex-col gap-6 w-52 h-52 bg-white/4 text-white rounded-xl ">
                            <Image
                                src="/game/chip_icon1.svg"
                                width={72}
                                height={72}
                                alt="coin"
                            />
                            <div className="flex justify-center items-center gap-1">
                                <Image
                                    src="/game/junPAYCoinicon.svg"
                                    width={30}
                                    height={30}
                                    alt="coinicon"
                                />
                                    <p className="text-2xl">100</p>
                            </div>
                        </button>

                        <button className="flex justify-center items-center flex-col gap-6 w-52 h-52 bg-white/4 text-white rounded-xl ">
                            <Image
                                src="/game/chip_icon2.png"
                                width={72}
                                height={72}
                                alt="coin"
                            />
                            <div className="flex justify-center items-center gap-1">
                                <Image
                                    src="/game/junPAYCoinicon.svg"
                                    width={30}
                                    height={30}
                                    alt="coinicon"
                                />
                                    <p className="text-2xl">1,000</p>
                            </div>
                        </button>

                        <button className="flex justify-center items-center flex-col gap-6 w-52 h-52 bg-white/4 text-white rounded-xl ">
                            <Image
                                src="/game/chip_icon3.png"
                                width={72}
                                height={72}
                                alt="coin"
                            />
                            <div className="flex justify-center items-center gap-1">
                                <Image
                                    src="/game/junPAYCoinicon.svg"
                                    width={30}
                                    height={30}
                                    alt="coinicon"
                                />
                                    <p className="text-2xl">10,000</p>
                            </div>
                        </button>
                    </div>
                    <div className="relative mt-4 w-[655px]">
                        <input type="range" 
                            className={`${styles.slider} w-full z-0`}/>
                        <span className="absolute top-1/2 left-[20px] -translate-y-1/2 text-brown2 font-bold pointer-events-none">
                            MIN
                        </span>
                        <span className="absolute top-1/2 right-[20px] -translate-y-1/2 text-brown font-bold pointer-events-none">
                            MAX
                        </span>
                    </div>

                    <button className='w-68 h-16 hover:cursor-pointer rounded-[47px]
                        p-1 bg-linear-to-r from-[#C59D4D] via-[#f5e798] to-[#7A5C2E] mt-4'>
                        <div className='flex justify-center items-center h-full bg-linear-to-b from-[#CF5056] via-[#500407] to-[#CF5056] rounded-[47px]'>
                        <Image
                            src="/game/junPAYCoinicon.svg"
                            width={30}
                            height={30}
                            alt="coinicon"
                        />
                        <p className="text-2xl text-white font-bold">1000 JUN</p>
                        </div>
                    </button>
                
        </dialog>
    )
}