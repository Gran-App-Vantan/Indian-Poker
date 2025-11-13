"use client";

import Image from "next/image";
import styles from "../app/StartPage.module.css"
import { useState, useEffect } from "react";
import { Modal } from "@/components/shared/Modal";
import { Logo, StartButton, LoginModalContent, OperationInstructions, Qr, Standby } from "@/components/features/start";
import { Login, CreateTokenUrl, EnterGame } from "@/api/auth";
import { GetSnsUser, GetSnsUserResponse, GetPlayingUsers, ResetConnection, ResetConnectionKeepAlive } from "@/api/game";
import { PlayingUser } from "@/api/game";
import { getAuthToken, setAuthToken } from "@/utils/authToken";

export default function Home() {
  const [token, setToken] = useState("");
  const [snsUser, setSnsUser] = useState<GetSnsUserResponse | null>();
  const [modalType, setModalType] = useState<"login" | "operation" | "Qr" | "standby" | "error" | null>(null);
  const [deviceNumber, setDeviceNumber] = useState<number | null>(null);
  const [playingUsers, setPlayingUsers] = useState<PlayingUser[]>();

  // ユーザー情報を取得する関数
  const getSnsUser = async () => {
    try {
      if (deviceNumber === null) {
        return;
      }
      const user = await GetSnsUser(deviceNumber);
      setSnsUser(user);
    } catch (error) {
      console.error("ユーザー情報の取得に失敗しました:", error);
    }
  };  // QRコードモーダルを開く処理
  const handleOpenQrModal = async () => {
    if (deviceNumber === null) {
      console.error("デバイス番号が設定されていません");
      return;
    }
    
    try {
      console.log("QRコードモーダルを開く前に接続をリセットします");
      
      // 待機画面から遷移する場合は、まずモーダルを閉じる
      if (modalType === "standby") {
        setModalType(null);
        // 状態更新を待つ
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      await ResetConnection(deviceNumber);
      await getSnsUser(); // リセット後の最新状態を取得
      setModalType("Qr");
    } catch (error) {
      console.error("接続のリセットに失敗しました:", error);
      // エラーが発生してもQRコードモーダルは開く
      setModalType("Qr");
    }
  };

  // ゲストプレイ処理
  const handleGuestPlay = async () => {
    if (deviceNumber === null) {
      console.error("デバイス番号が設定されていません");
      return;
    }
    
    try {
      console.log("ゲストとして参加します");
      await ResetConnection(deviceNumber);
      
      // ゲストとしてゲームに参加（sns_id, pointは渡さない）
      const response = await EnterGame({
        userId: deviceNumber,
      });

      if (response.success) {
        console.log("ゲストとして参加しました");
        await getSnsUser();
        // 操作説明画面を表示（ユーザーが読み終えたら待機画面へ）
        setModalType("operation");
        getPlayingUsers();
      } else {
        console.error("ゲスト参加に失敗しました:", response.message);
      }
    } catch (error) {
      console.error("ゲスト参加エラー:", error);
    }
  };

  const getPlayingUsers = async () => {
    if (deviceNumber === null) {
      return;
    }
    
    try {
      const response = await GetPlayingUsers(deviceNumber);

      if (response.success) {
        console.log("待機中のユーザー一覧:", response.users);
        setPlayingUsers(response.users);
      } else {
        console.error("待機中のユーザーの取得に失敗しました", response.message);
      }
    } catch (error) {
      console.error("エラー: ", error);
    }
  }

  useEffect(() => {
    // sessionStorageからデバイス番号を取得、なければデフォルト1
    const storedDeviceNumber = sessionStorage.getItem("deviceNumber");
    if (storedDeviceNumber) {
      setDeviceNumber(parseInt(storedDeviceNumber, 10));
    }
  }, []);

  useEffect(() => {
    if (deviceNumber === null) return; // デバイス番号が設定されるまで待つ
    
    const login = async () => {
      try {
        console.log("デバイス番号でログイン:", deviceNumber);
        const response = await Login(deviceNumber);

        if (!response.success) {
          console.error("ログインに失敗しました");
          return;
        }

        // デバイスごとに異なるCookieキーを使用
        setAuthToken(deviceNumber, response.authToken);
        
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
    const currentUserId = snsUser?.userId;
    console.log("QRコードポーリング開始 - 初期状態:", { 
      初期snsId: startingSnsId,
      ユーザーID: currentUserId,
      ユーザー情報: snsUser
    });
    
    let isActive = true; // クリーンアップ用フラグ
    let pollCount = 0; // ポーリング回数
    const maxPollCount = 60; // 最大60回（2秒間隔 × 60 = 2分）
    
    const pollInterval = setInterval(async () => {
      if (!isActive) return;
      
      pollCount++;
      
      // タイムアウトチェック
      if (pollCount >= maxPollCount) {
        console.error("QRコード読み取りがタイムアウトしました");
        clearInterval(pollInterval);
        if (isActive) {
          alert("QRコード読み取りがタイムアウトしました。もう一度お試しください。");
          setModalType(null); // モーダルを閉じる
        }
        return;
      }
      
      try {
        if (deviceNumber === null) {
          return;
        }
        
        const response = await GetSnsUser(deviceNumber);
        
        // ユーザーIDが変わっていないか確認（入れ替わり防止）
        if (response.userId !== currentUserId) {
          console.error("⚠️ ユーザーIDが変わりました！セッションが入れ替わっている可能性があります", {
            期待するユーザーID: currentUserId,
            実際のユーザーID: response.userId,
          });
          clearInterval(pollInterval);
          if (isActive) {
            alert("セッションエラーが発生しました。ページをリロードしてください。");
            window.location.reload();
          }
          return;
        }
        
        console.log("ポーリング結果:", {
          現在のsnsId: response.snsId,
          初期snsId: startingSnsId,
          変化: response.snsId !== startingSnsId,
          nullチェック: response.snsId !== null && response.snsId !== undefined,
          isPlaying: response.isParent ? 'parent' : 'player',
          ポーリング回数: pollCount
        });
        
        if (!isActive) return; // 非同期処理の間にクリーンアップされた場合
        setSnsUser(response);
        
        // 初期状態がnullの場合: snsIdがnullから変化したら遷移
        // 初期状態がnullでない場合: snsIdが変化したら遷移（再接続のケース）
        const shouldTransition = startingSnsId === null
          ? (response.snsId !== null && response.snsId !== undefined)
          : (response.snsId !== null && response.snsId !== undefined && response.snsId !== startingSnsId);
        
        if (shouldTransition) {
          console.log("✅ SNS連携が完了しました!", { 
            初期: startingSnsId, 
            現在: response.snsId,
            遷移理由: startingSnsId === null ? '新規接続' : '再接続',
            ポーリング回数: pollCount
          });
          clearInterval(pollInterval);
          if (isActive) {
            // SNSアプリ側から /api/auth/enter が既に呼ばれているはずなので、
            // 最新状態を取得してから待機画面に遷移
            await getSnsUser();
            setModalType("standby");
            getPlayingUsers();
          }
        }
      } catch (error) {
        console.error("ポーリング中のエラー:", error);
        // エラーが発生してもポーリングは継続
      }
    }, 2000);

    // クリーンアップ: モーダルが閉じられたらポーリングを停止
    return () => {
      console.log("QRコードポーリング停止", { ポーリング回数: pollCount });
      isActive = false;
      clearInterval(pollInterval);
    };
  }, [modalType]);

  // 待機画面でのポーリング処理
  useEffect(() => {
    if (modalType !== "standby") return;

    let consecutiveErrors = 0;
    const MAX_CONSECUTIVE_ERRORS = 3;
    let pollInterval: NodeJS.Timeout | null = null;

    const checkPlayingStatus = async () => {
      // タブが非アクティブな場合はポーリングをスキップ
      if (document.hidden) {
        console.log("タブが非アクティブのため、ポーリングをスキップします");
        return;
      }

      try {
        // エラーカウンターをリセット
        consecutiveErrors = 0;
        
        // 待機中のユーザー一覧を取得
        await getPlayingUsers();
      } catch (error) {
        consecutiveErrors++;
        console.error(`ポーリングエラー (${consecutiveErrors}/${MAX_CONSECUTIVE_ERRORS}):`, error);
        
        // 連続してエラーが発生した場合のみ警告
        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          console.warn("連続してポーリングエラーが発生しています。接続を確認してください。");
          // エラーが続いても待機画面は閉じない（ネットワーク一時的な問題の可能性）
        }
      }
    };

    // タブの可視性が変わったときの処理
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // タブがアクティブになったら即座にチェック
        console.log("タブがアクティブになりました。状態を確認します。");
        checkPlayingStatus();
      }
    };

    // 初回実行
    checkPlayingStatus();

    // ポーリング開始
    pollInterval = setInterval(() => {
      checkPlayingStatus();
    }, 2000);

    // タブの可視性変更イベントをリッスン
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [modalType]);

  // ページ離脱などで通信が途切れた際に接続情報を明示的にリセットする
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!snsUser?.snsId || !snsUser?.isPlaying) return;

    let hasSent = false;
    const handleDisconnect = () => {
      if (hasSent || deviceNumber === null) return;
      hasSent = true;
      console.log("ページ離脱を検知したため接続をリセットします");
      ResetConnectionKeepAlive(deviceNumber);
    };

    window.addEventListener("beforeunload", handleDisconnect);
    window.addEventListener("pagehide", handleDisconnect);
    window.addEventListener("offline", handleDisconnect);

    return () => {
      window.removeEventListener("beforeunload", handleDisconnect);
      window.removeEventListener("pagehide", handleDisconnect);
      window.removeEventListener("offline", handleDisconnect);
    };
  }, [snsUser?.snsId, snsUser?.isPlaying]);

  return (
    <div className={`relative min-h-screen bg-cover bg-center  ${styles.bgScrollX}`}
      style={{ backgroundImage: "url('/bg-img/bgimg.svg')" }}>
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
          onGuestPlay={() => handleGuestPlay()}
          onLogin={() => handleOpenQrModal()}
        />
      </Modal>

      <Modal isOpen={modalType === "operation"} >
        <OperationInstructions onComplete={async () => setModalType("standby")} />
      </Modal>

      <Modal isOpen={modalType === "Qr"} >
        <Qr 
          token={token} 
          deviceNumber={deviceNumber ?? undefined}
        />
      </Modal>

      <Modal isOpen={modalType === "standby"} >
        {modalType === "standby" && (() => {
          // 自分が待機中ユーザーに含まれているかチェック
          const isParticipating = snsUser?.isPlaying || playingUsers?.some(p => p.deviceNumber === deviceNumber);
          
          if (!isParticipating) {
            console.warn("⚠️ 自分は参加していないため、待機画面を表示しません", {
              deviceNumber,
              snsUserId: snsUser?.userId,
              isPlaying: snsUser?.isPlaying,
              playingUsers: playingUsers?.map(p => p.deviceNumber)
            });
            return (
              <div className="flex flex-col gap-4 items-center justify-center p-8 text-white">
                <p className="text-lg">このデバイスは現在ゲームに参加していません</p>
                <button
                  onClick={() => setModalType(null)}
                  className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700"
                >
                  閉じる
                </button>
              </div>
            );
          }
          
          return (
            <Standby 
              user={snsUser ?? undefined}
              playingUsers={playingUsers}
              onExit={async () => {
            console.log("🚪 待機画面から退出します", {
              現在のsnsUser: snsUser,
              現在のデバイス: deviceNumber,
              待機中ユーザー: playingUsers?.map(p => ({ deviceNumber: p.deviceNumber, snsId: p.snsId, name: p.name }))
            });
            
            // ユーザーIDの整合性チェック
            if (snsUser?.userId !== deviceNumber) {
              console.error("❌ ユーザーIDとデバイス番号が一致しません!", {
                snsUserのユーザーID: snsUser?.userId,
                デバイス番号: deviceNumber
              });
              alert(`エラー: セッション不整合を検出しました。\nsnsUser.userId: ${snsUser?.userId}\ndeviceNumber: ${deviceNumber}\n\nページをリロードしてください。`);
              return;
            }
            
            // 先にモーダルを閉じてポーリングを停止
            setModalType(null);
            setPlayingUsers([]);
            
            // その後、接続をリセット
            console.log("🔄 ResetConnection 呼び出し - デバイス", deviceNumber, "authToken:", getAuthToken(deviceNumber)?.substring(0, 10) + "...");
            await ResetConnection(deviceNumber);
            await getSnsUser();
          }}
        />
          );
        })()}
      </Modal>
    </div>
  );
}