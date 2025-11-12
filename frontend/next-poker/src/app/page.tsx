"use client";

import Image from "next/image";
import styles from "../app/StartPage.module.css"
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { Modal } from "@/components/shared/Modal";
import { Logo, StartButton, LoginModalContent, OperationInstructions, Qr, Standby } from "@/components/features/start";
import { Login, CreateTokenUrl, ResetConnection } from "@/api/auth";
import { GetSnsUser, GetSnsUserResponse, GetPlayingUsers } from "@/api/game";
import { PlayingUser } from "@/api/game";
import { useUserContext } from "@/contexts/UserContext";

export default function Home() {
  const context = useUserContext();
  const { user } = context || {};
  const [token, setToken] = useState("");
  const [snsUser, setSnsUser] = useState<GetSnsUserResponse | null>();
  const [modalType, setModalType] = useState<"login" | "operation" | "Qr" | "standby" | "error" | null>(null);
  const [deviceNumber, setDeviceNumber] = useState<number>(1);
  const [initialSnsId, setInitialSnsId] = useState<number | null>(null);
  const [playingUsers, setPlayingUsers] = useState<PlayingUser[]>();

  // ユーザー情報を取得する関数
  const getSnsUser = async () => {
    try {
      const response = await GetSnsUser();
      console.log("GetSnsUser レスポンス:", response);

      setSnsUser(response);
      if (response.snsId) {
        console.log("SNS連携ユーザー情報の取得に成功しました:", response);
      } else {
        console.log("ゲストユーザーとしてログイン中:", response);
      }
    } catch (error) {
      setSnsUser(null);
      console.error("ユーザー情報の取得に失敗しました: ", error);
    }
  };

  // QRコードモーダルを開く処理
  const handleOpenQrModal = async () => {
    try {
      console.log("QRコードモーダルを開く前に接続をリセットします");
      await ResetConnection();
      await getSnsUser(); // リセット後の最新状態を取得
      setModalType("Qr");
    } catch (error) {
      console.error("接続のリセットに失敗しました:", error);
      // エラーが発生してもQRコードモーダルは開く
      setModalType("Qr");
    }
  };

  const getPlayingUsers = async () => {
    try {
      const response = await GetPlayingUsers();

      if (response.success) {
        setPlayingUsers(response.users);
      } else {
        console.error("待機中のユーザーの取得に失敗しました", response.message);
      }
    } catch (error) {
      console.error("エラー: ", error);
    }
  }

  useEffect(() => {
    // localStorageからデバイス番号を取得、なければデフォルト1
    const storedDeviceNumber = localStorage.getItem("deviceNumber");
    if (storedDeviceNumber) {
      setDeviceNumber(parseInt(storedDeviceNumber, 10));
    } else {
      // 初回アクセス時は1を設定
      localStorage.setItem("deviceNumber", "1");
      setDeviceNumber(1);
    }
  }, []);

  useEffect(() => {
    if (deviceNumber === 0) return; // デバイス番号が設定されるまで待つ
    
    const login = async () => {
      try {
        console.log("デバイス番号でログイン:", deviceNumber);
        const response = await Login(deviceNumber);

        if (!response.success) {
          console.error("ログインに失敗しました");
          return;
        }

        Cookies.set("authToken", response.authToken);
        
        await createTokenUrl();
      } catch (error) {
        console.error("エラーが発生しました:", error);
      }
    };

    const createTokenUrl = async () => {
      try {
        const response = await CreateTokenUrl({
          deviceNumber: deviceNumber,
          gameType: "IndianPoker"
        });

        if (response.success) {
          setToken(response.data.token);
          await getSnsUser();
        } else {
          console.error("トークンURLの作成に失敗しました");
        }
      } catch (error) {
        console.error("エラーが発生しました:", error);
      }
    }
    
    login();
  }, [deviceNumber]);

  // QRコードモーダル表示中のポーリング処理
  useEffect(() => {
    if (modalType !== "Qr") return;

    // QRコードモーダルを開いた時点のsnsIdとis_playingを記録
    const startingSnsId = snsUser?.snsId ?? null;
    setInitialSnsId(startingSnsId);
    console.log("QRコードポーリング開始 - 初期状態:", { 
      初期snsId: startingSnsId,
      ユーザー情報: snsUser
    });
    
    let isActive = true; // クリーンアップ用フラグ
    
    const pollInterval = setInterval(async () => {
      if (!isActive) return;
      
      try {
        const response = await GetSnsUser();
        console.log("ポーリング結果:", {
          現在のsnsId: response.snsId,
          初期snsId: startingSnsId,
          変化: response.snsId !== startingSnsId,
          nullチェック: response.snsId !== null && response.snsId !== undefined,
          isPlaying: response.isParent ? 'parent' : 'player'
        });
        
        if (!isActive) return; // 非同期処理の間にクリーンアップされた場合
        setSnsUser(response);
        
        // 初期状態がnullの場合: snsIdがnullから変化したら遷移
        // 初期状態がnullでない場合: is_playingがtrueになったら遷移（再接続のケース）
        const shouldTransition = startingSnsId === null
          ? (response.snsId !== null && response.snsId !== undefined)
          : (response.snsId !== null && response.snsId !== undefined && response.snsId !== startingSnsId);
        
        if (shouldTransition) {
          console.log("✅ SNS連携が完了しました!", { 
            初期: startingSnsId, 
            現在: response.snsId,
            遷移理由: startingSnsId === null ? '新規接続' : '再接続'
          });
          clearInterval(pollInterval);
          if (isActive) {
            setModalType("standby");
            getPlayingUsers();
          }
        }
      } catch (error) {
        console.error("ポーリング中のエラー:", error);
      }
    }, 2000);

    // クリーンアップ: モーダルが閉じられたらポーリングを停止
    return () => {
      console.log("QRコードポーリング停止");
      isActive = false;
      clearInterval(pollInterval);
    };
  }, [modalType]);

  // 待機画面でのポーリング処理
  useEffect(() => {
    if (modalType !== "standby") return;

    getPlayingUsers();

    const pollInterval = setInterval(() => {
      getPlayingUsers();
    }, 2000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [modalType]);

  return (
    <div className={`relative min-h-screen bg-cover bg-center  ${styles.bgScrollX}`}
      style={{ backgroundImage: "url('/bg-img/bgimg.svg')" }}>

      {/* デバイス番号設定UI（開発用） */}
      <div className="absolute top-4 right-4 z-50 bg-black/70 text-white p-4 rounded-lg">
        <div className="text-sm mb-2">デバイス番号: {deviceNumber}</div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => {
                localStorage.setItem("deviceNumber", num.toString());
                setDeviceNumber(num);
                window.location.reload();
              }}
              className={`px-3 py-1 rounded ${
                deviceNumber === num
                  ? "bg-blue-500"
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <Logo />
        
      <div className={`absolute bottom-25 left-0 z-0  ${styles.swingImageLeft }`}>
          <Image
          src="/start/LightLeft.svg"
          alt="light-left"
          width={700}
          height={700}
          />
      </div>

      <div className={`absolute bottom-25 right-0 z-0 overflow-hidden ${styles.swingImageRight }`}>
          <Image
          src="/start/LightRight.svg"
          alt="light-right"
          width={700}
          height={700}
          />
      </div>

      <StartButton setModalType={(type) => setModalType(type as "login" | "operation" | "Qr" | "standby" | "error" | null)}/>

      <Modal isOpen={modalType === "login"} >
          <LoginModalContent
              onGuestPlay={() => {}} // TODO: ゲストプレイ用の処理を追加
              onLogin={() => {
                  handleOpenQrModal();
              }}
          />
      </Modal>

      <Modal isOpen={modalType === "operation"} >
          <OperationInstructions 
              onComplete={async () => {
                setModalType("standby");
              }}
          />
      </Modal>

      <Modal isOpen={modalType === "Qr"} >
          <Qr token={token} deviceNumber={deviceNumber}/>
      </Modal>

      <Modal isOpen={modalType === "standby"} >
          <Standby 
            user={user ?? undefined}
            playingUsers={playingUsers} 
          />
      </Modal>
    </div>
  );
}