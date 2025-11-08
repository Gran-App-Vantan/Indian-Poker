"use client";
import { useState, useEffect, use} from 'react';
import Image from 'next/image';

export type OperationInstructionsProps = {
    onComplete?: () => void;
};

export function OperationInstructions({
    onComplete
}: OperationInstructionsProps) {
    
    const [currentStep, setCurrentStep] = useState(0);

        

    const Steps = [
        {
            TopText:"インディアンポーカーとは",
            image:"/start/GameImage1.png",
            imagewidth:884,
            imageheight:284,
            bottomText1:"相手より高い数字のカードを予想して勝利を目指します",
            bottomText2:"みんなで話し合い騙しあいましょう",
        },

        {
            TopText:"掛金を決めよう！！",
            image:"/start/GameImage2.png",
            imagewidth:430,
            imageheight:284,
            bottomText1:"親のPCで掛金を決めれます",
            bottomText2:"ここもみんなで話し合い掛金を決めましょう",
        },

        {
            TopText:"カードが配られたら話し合おう！",
            image:"/start/GameImage3.png",
            imagewidth:884,
            imageheight:284,
            bottomText1:"話し合いの時間は5分 延長ボタンで延長もできます",
            bottomText2:"自分のカードが弱いと思ったら変更しよう",
        },

        {
            TopText:"カードの強さは？",
            image:"/start/GameImage4.png",
            imagewidth:430,
            imageheight:284,
            bottomText1:"左から右に向けて強くなります",
            bottomText2:"強いカードを引き当てて相手を怖がらせましょう",
        },

        {
            TopText:"勝利を目指して頑張ろう",
            image:"/start/GameImage5.png",
            imagewidth:430,
            imageheight:284,
            bottomText1:" 相手より高い数字のカードを引いて",
            bottomText2:"優勝を目指して頑張ろう!!",
        },
    ]

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                if (currentStep < Steps.length - 1) {
                    setCurrentStep(currentStep + 1);
                } else {
                    onComplete?.();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [currentStep, onComplete]);

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
                        <p>{Steps[currentStep].bottomText2}</p>
                    </div>

                    <button className='flex justify-center items-center w-[168px] h-[115px] 
                        absolute bottom-0 right-0 bg-gray rounded-tl-3xl rounded-br-3xl '
                        onClick={() => {
                            if (currentStep < Steps.length - 1) {
                                setCurrentStep(currentStep + 1);
                            } else {
                                onComplete?.();
                            }
                        }}
                    >
                        <Image
                            src="/start/EnterImg.png"
                            alt="next-button"
                            width={58}
                            height={71}
                            className='hover:cursor-pointer hover:scale-95'
                            />
                    </button>
                </div>
            </div>

        </div>
    );
};