"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Timer } from "@/components/features/game/Timer";
import { Button } from "@/components/features/game/Button";
import { ChangeCard, UserCard, PaymentSettings } from "@/components/features/game";
import { GetPlayingUsers, ChangeLatch, CurrentOptions, Card, CardSet, ChangeCardApi, IsAllSet, Result } from "@/api/game";
import { User } from "@/api/auth";
import { Modal } from "@/components/shared/Modal";
import { useGameResult } from "@/contexts/GameResultContext";

export default function Game() {
    const router = useRouter();
    const { setResult } = useGameResult();
    const [showOverlay, setShowOverlay] = useState(false);
    const [deviceNumber, setDeviceNumber] = useState<number | null>(null);
    const [myUser, setMyUser] = useState<User | null>(null);
    const [opponentUsers, setOpponentUsers] = useState<User[]>([]);
    const [isBetModalOpen, setIsBetModalOpen] = useState(false);
    const [betPaymentSetting, setBetPaymentSetting] = useState(0);
    const [betPayment, setBetPayment] = useState(0);
    const [changeCards, setChangeCards] = useState<Card[] | null>(null);
    const [remainingChanges, setRemainingChanges] = useState(2); // 変更可能回数
    const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
    const [isSet, setIsSet] = useState(false);

    const displayName = myUser?.name && myUser.name.trim() !== ""
        ? myUser.name
        : "ゲストユーザー"; // ゲストの場合は「ゲストユーザー」と表示

    const handleClick = () => {
        if (remainingChanges <= 0) {
            return; // ボタンが無効化されているので何もしない
        }
        setShowOverlay(true);
        fetchChangeCards();
    };

    const handleClose = () => {
        setShowOverlay(false);
        setSelectedCardId(null); // 選択をリセット
    };

    const handleConfirmChange = (id: number, offers: number[]) => {
        if (!selectedCardId) {
            alert("カードを選択してください");
            return;
        }
        setRemainingChanges(prev => prev - 1);
        setShowOverlay(false);
        setSelectedCardId(null);
        changeCard(id, offers);
    };

    const handleConfirmAll = async () => {
        // 掛け金が設定されていない場合、モーダルを開く
        if (betPayment === 0) {
            setIsBetModalOpen(true);
            return;
        }

        // 掛け金が設定済みの場合、確認してカードセット
        if (confirm("一度セットするとカードや掛け金を設定できなくなります。よろしいですか？")) {
            await cardSet();
            setIsSet(true);
        }
    };

    const changeLatch = async (latch: number) => {
        if (latch === 0) {
            alert("掛け金は0より大きい値を設定してください");
            return;
        }

        if (deviceNumber === null) {
            console.error("デバイス番号が設定されていません");
            return;
        }

        try {
            const response = await ChangeLatch(deviceNumber, latch);
            setBetPayment(response.latch);
            setIsBetModalOpen(false);
            
            // 掛け金設定後、自動的にカードセット確認
            if (confirm("一度セットするとカードや掛け金を設定できなくなります。よろしいですか？")) {
                await cardSet();
                setIsSet(true);
                alert(`掛け金 ${response.latch}P でセットしました！`);
            } else {
                alert(`掛け金を ${response.latch}P に設定しました`);
            }
        } catch (error) {
            console.error("掛け金の指定に失敗しました: ", error);
            alert("掛け金の設定に失敗しました");
        }
    };

    const fetchChangeCards = async () => {
        if (deviceNumber === null) {
            console.error("デバイス番号が設定されていません");
            return;
        }

        try {
            const response = await CurrentOptions(deviceNumber);
            setChangeCards(response.cardOffer);
            console.log("カード候補の取得に成功しました", response.cardOffer);
        } catch (error) {
            console.error("カード候補の取得に失敗しました: ", error);
            setChangeCards(null);
        }
    }

    const changeCard = async (id: number, offers: number[]) => {
        if (deviceNumber === null) {
            console.error("デバイス番号が設定されていません");
            return;
        }

        const reqData = {
            deviceNumber: deviceNumber,
            cardId: id,
            cardOffers: offers
        };

        try {
            await ChangeCardApi(reqData);
            console.log("カードの入れ替えに成功しました");
        } catch (error) {
            console.error("カードの入れ替えに失敗しました", error);
        };
    };

    const cardSet = async () => {
        if (deviceNumber === null) {
            console.error("デバイス番号が設定されていません");
            return;
        }

        try {
            const response = await CardSet(deviceNumber);
            console.log("カードセットに成功しました: ", response);
        } catch (error) {
            console.error("カードセットに失敗しました: ", error);
        }
    }

    const getResult = async () => {
        if (deviceNumber === null) return;

        try {
            const response = await Result(deviceNumber);
            console.log("ゲーム結果を取得しました:", response);
            
            // Contextに結果を保存
            setResult(response);
            
            // 結果ページへ遷移
            router.push(`/result?deviceNumber=${deviceNumber}`);
        } catch (error) {
            console.error("リザルト取得のエラー: ", error);
            alert("結果の取得に失敗しました");
        }
    }

    useEffect(() => {
        if (deviceNumber === null) {
            return;
        }

        const fetchGameData = async () => {
            try {
                const response = await GetPlayingUsers(deviceNumber);

                if (response.success) {
                    setMyUser(response.myUser);
                    
                    const opponents = response.users.filter(
                        user => user.deviceNumber !== deviceNumber
                    );
                    setOpponentUsers(opponents);
                    
                    console.log("ゲームデータの取得に成功しました", {
                        myUser: response.myUser,
                        opponentsCount: opponents.length
                    });
                } else {
                    console.error("ゲームデータの取得に失敗しました: ", response.message);
                }
            } catch (error) {
                console.error("ゲームデータの取得エラー: ", error);
            };
        };

        fetchGameData();

        const intervalId = setInterval(() => {
            fetchGameData();
        }, 3000);

        return () => {
            clearInterval(intervalId);
        };
    }, [deviceNumber]);

    useEffect(() => {
        if (deviceNumber === null || !isSet) {
            console.log("IsAllSetポーリング: スキップ", { deviceNumber, isSet });
            return;
        }

        console.log("IsAllSetポーリング: 開始");
        
        const checkInterval = setInterval(async () => {
            try {
                console.log("IsAllSetポーリング: チェック中...");
                const allSet = await IsAllSet(deviceNumber);
                console.log("IsAllSetポーリング: 結果 =", allSet);
                
                if (allSet) {
                    clearInterval(checkInterval);
                    console.log("✅ 全員セット完了！");
                    
                    getResult();
                } else {
                    console.log("⏳ まだ全員セットされていません");
                }
            } catch (error) {
                console.error("IsAllSetポーリング: エラー", error);
            }
        }, 2000);

        return () => {
            console.log("IsAllSetポーリング: 停止");
            clearInterval(checkInterval);
        };
    }, [deviceNumber, isSet]);

    // copilot
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const deviceNumberFromUrl = params.get("deviceNumber");
        const storedDeviceNumber = sessionStorage.getItem("deviceNumber");
        
        if (deviceNumberFromUrl) {
            const parsedNumber = parseInt(deviceNumberFromUrl, 10);
            setDeviceNumber(parsedNumber);

            sessionStorage.setItem("deviceNumber", parsedNumber.toString());
        } else if (storedDeviceNumber) {
            const parsedNumber = parseInt(storedDeviceNumber, 10);
            setDeviceNumber(parsedNumber);
        } else {
            console.error("deviceNumberが見つかりません。URLパラメータまたはsessionStorageに保存されている必要があります。");
            alert("デバイス番号が設定されていません。待機ページからやり直してください。");
        }
    }, []);

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
                                key={index}
                                className={positionStyles[index]}
                            >
                                <UserCard 
                                    deviceNumber={opponentUser.deviceNumber}
                                    iconSrc={opponentUser.userIcon || null}
                                    imagePath={opponentUser.card.imagePath || undefined}
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
                            alt="my-user"
                            className="rounded-full"
                        />
                    </div>
                    <p className="text-white text-4xl font-bold">{displayName} ({myUser?.id}P)</p>
                    <p className="text-white text-2xl font-bold bg-black/60 px-6 py-2 rounded-lg">掛け金: {betPayment}P</p>
                </div>

                {!isSet && (
                    <div className="flex gap-5 absolute bottom-20 right-10">
                        <Button variant="decision" onClick={handleConfirmAll}/>
                        <Button variant="change" onClick={handleClick} disabled={remainingChanges <= 0}/>
                    </div>
                )}

                {showOverlay && (
                    <div className="fixed inset-0 flex flex-col gap-28 items-center justify-center bg-black/80 min-h-screen z-40 text-white text-5xl font-bold">
                        <p>カード選択してください</p>
                        <ChangeCard 
                            cards={changeCards}
                            selectedCardId={selectedCardId}
                            onCardClick={setSelectedCardId}
                        />
                        <p>残りの変更 {remainingChanges}回</p>

                        <div className="flex gap-5 absolute bottom-10 right-10">
                            <Button 
                                variant="stop" 
                                onClick={handleClose}
                            />
                            <Button 
                                variant="Confirmedtochange" 
                                onClick={() => handleConfirmChange(selectedCardId!, changeCards?.map(c => c.id) || [])}
                            />
                        </div>
                    </div>
                )}

                {isBetModalOpen && (
                    <Modal isOpen={isBetModalOpen}>
                        <PaymentSettings 
                            changeLatch={changeLatch}
                            setBetPaymentSetting={setBetPaymentSetting}
                            betPaymentSetting={betPaymentSetting}
                        />
                    </Modal>
                )}
        </div>
    );
}