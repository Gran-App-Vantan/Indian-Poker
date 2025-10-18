"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';

export function OperationInstructions() {
    const [currentStep, setCurrentStep] = useState(0);

    const Steps = [
        {
            TopText:"インディアンポーカーとは",
            image:"/start/GameImage1.png",
            imagewidth:884,
            imageheight:284,
            bottomText1:"相手より高い数字のカードを予想して勝利を目指します",
            bottonText2:"みんなで話し合い騙し会いましょう",
        },

        {
            TopText:"掛金を決めよう！！",
            image:"/start/GameImage2.png",
            imagewidth:430,
            imageheight:284,
            bottomText1:"親のPCで掛金を決めれます",
            bottonText2:"ここもみんなで話し合い掛金を決めましょう",
        },

        {
            TopText:"カードが配られたら話し合おう！",
            image:"/start/GameImage3.png",
            imagewidth:884,
            imageheight:284,
            bottomText1:"話し合いの時間は5分 延長ボタンで延長もできます",
            bottonText2:"自分のカードが弱いと思ったら変更しよう",
        },

        {
            TopText:"カードの強さは？",
            image:"/start/GameImage4.png",
            imagewidth:430,
            imageheight:284,
            bottomText1:"左から右に向けて強くなります",
            bottonText2:"強いカードを引き当てて相手を怖がらせましょう",
        },

        {
            TopText:"勝利を目指して頑張ろう",
            image:"/start/GameImage5.png",
            imagewidth:430,
            imageheight:284,
            bottomText1:" 相手より高い数字のカードを引いて",
            bottonText2:"優勝を目指して頑張ろう!!",
        },
    ]

    useEffect

    return(
        <div className="w-full h-screen flex justify-center items-center bg-black/80">

            <div className=' w-[1206px] h-[704px] 
                bg-cover bg-center bg-no-repeat flex justify-center items-center m-auto 
                rounded-custom  border-gray border-8 relative'
                style={{ backgroundImage: "url('/bg-img/OperationinstructionsBg.png')" }}>
                    
                <div className=' flex flex-col justify-center items-center gap-10'>
                    <h2 className='text-4xl font-black bg-white/40'>
                        {Steps[currentStep].TopText}
                    </h2>

                    <Image
                        src={Steps[currentStep].image}
                        alt="game-image"
                        width={Steps[currentStep].imagewidth}
                        height={Steps[currentStep].imageheight}
                    />

                    <div className='text-2xl font-bold text-center bg-white/40'>
                        <p>{Steps[currentStep].bottomText1}</p>
                        <p>{Steps[currentStep].bottonText2}</p>
                    </div>

                    <div className='flex justify-center items-center w-[168px] h-[115px] 
                    absolute bottom-0 right-0 bg-gray rounded-tl-3xl rounded-br-3xl'>
                        <Image
                            src="/start/EnterImg.png"
                            alt="next-button"
                            width={58}
                            height={71}
                            />
                    </div>

                </div>

            </div>
        </div>
    );
};