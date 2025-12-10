import Image from "next/image";

export interface UserCardProps {
    deviceNumber: number;
    iconSrc?: string | null;
    imagePath?: string | null;
}

export function UserCard({
    deviceNumber,
    iconSrc,
    imagePath
}: UserCardProps) {
    const userImageSrc = imagePath && imagePath.trim() !== ""
        ? imagePath
        : "/icons/default-user-icon.svg";

    const userIconSrc =
        iconSrc && iconSrc.trim() !== "" ? iconSrc : null;

    return (
        <div className="flex flex-col items-start  gap-2">
            <p className="text-white text-4xl font-black">
                {deviceNumber}P
            </p>
            <div className="relative">
                <Image
                    src={userImageSrc || ""}
                    width={165}
                    height={221}
                    alt="UserCard"
                />
                <div className="flex items-center justify-center absolute top-[-20px] right-[-20px]  w-18 h-18 rounded-full bg-linear-to-r from-[#C59D4D] via-[#f5e798] to-[#7A5C2E]">
                    <Image
                        src={userIconSrc || "/icons/default-user-icon.svg"}
                        width={64}
                        height={64}
                        alt="UserIcon"
                        className="rounded-full"
                    />
                </div>
            </div>
        </div>
    )
    }