"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Timer } from "@/components/features/game/Timer";
import { Button } from "@/components/features/game/Button";
import { ChangeCard } from "@/components/features/game/ChangeCard";
import { UserCard } from"@/components/features/game/UserCard";
import { GetPlayingUsers } from "@/api/game";
import { User } from "@/api/auth";

export default function Game() {
    const [showOverlay, setShowOverlay] = useState(false);
    const [deviceNumber, setDeviceNumber] = useState<number | null>(null);
    const [myUser, setMyUser] = useState<User | null>(null);
    const [opponentUsers, setOpponentUsers] = useState<User[]>([]);

    const handleClick = () => {
        setShowOverlay(true);
    };

    const handleClose = () => {
        setShowOverlay(false); 
    };

    useEffect(() => {
        const storedDeviceNumber = sessionStorage.getItem("deviceNumber");
        if (storedDeviceNumber) {
            setDeviceNumber(parseInt(storedDeviceNumber, 10));
        }
    }, []);

    useEffect(() => {
        if (deviceNumber === null) {
            return;
        }

        const fetchOpponentUsers = async () => {
            try {
                const response = await GetPlayingUsers(deviceNumber);

                if (response.success) {
                    setMyUser(response.myUser);
                    
                    // 自分以外のユーザーをフィルタリング
                    const opponents = response.users.filter(
                        user => user.deviceNumber !== deviceNumber
                    );
                    setOpponentUsers(opponents);
                    
                    console.log("相手ユーザーの取得に成功しました", {
                        myUser: response.myUser,
                        opponentsCount: opponents.length
                    });
                } else {
                    console.error("相手ユーザーの取得に失敗しました: ", response.message);
                }
            } catch (error) {
                console.error("相手ユーザーの取得エラー: ", error);
            };
        };
        fetchOpponentUsers();
    }, [deviceNumber]);

    console.log("My User:", myUser);
    console.log("Opponent Users:", opponentUsers);

    return (
        <div className="flex items-center justify-center relative w-screen h-screen  bg-[url('/bg-img/GamePageBg.png')] bg-no-repeat bg-cover bg-center">
                <div className="absolute top-10  left-10 z-50">
                    <Timer />
                </div>

                <ul>
                    {opponentUsers.map((opponentUser, index) => {
                        const positionStyles = [
                            "absolute top-1/2 -translate-y-1/2 left-10",
                            "absolute top-40 -translate-y-1/2",
                            "absolute top-1/2 -translate-y-1/2 right-10"
                        ];
                        
                        return (
                            <li 
                                key={opponentUser.id}
                                className={positionStyles[index]}
                            >
                                <UserCard 
                                    deviceNumber={opponentUser.deviceNumber}
                                    number={opponentUser.card.number}
                                    type={opponentUser.card.type}
                                    imagePath={opponentUser.card.imagePath}
                                />
                            </li>
                        );
                    })};
                </ul>

                <div className="flex flex-col items-center gap-4 absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="flex flex-col items-center justify-center w-40 h-40 bg-linear-to-r from-[#C59D4D] via-[#f5e798] to-[#7A5C2E] rounded-full">
                        <Image
                            src={myUser?.userIcon || "/icons/default-user-icon.svg"}
                            width={140}
                            height={140}
                            alt="UserIcon"
                            className="rounded-full"
                        />
                    </div>
                    <p className="text-white text-4xl font-bold">Usename (1P)</p>
                </div>

                <div className="flex gap-5 absolute bottom-10 right-10">
                    <Button variant="decision"/>
                    <Button variant="change" onClick={handleClick}/>
                </div>
                {showOverlay && (
                    <div className="fixed inset-0 flex flex-col gap-28 items-center justify-center bg-black/80 min-h-screen z-40 text-white text-5xl font-bold">
                        <p>カード選択してください</p>
                        <ChangeCard />
                        <p>残りの変更 n回</p>

                        <div className="flex gap-5 absolute bottom-10 right-10">
                            <Button variant="stop" onClick={handleClose}/>
                            <Button variant="Confirmedtochange" onClick={handleClose}/>
                        </div>
                    </div>
                )}
        </div>
    );
}