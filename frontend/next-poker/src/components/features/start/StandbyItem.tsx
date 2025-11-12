import Image from "next/image";

type StandbyitemProps = {
  iconSrc: string;
  deviceNumber: number;
  name: string;
  point: number;
  isCurrentUser?: boolean;
}

export function StandbyItem({
  iconSrc,
  deviceNumber,
  name,
  point,
  isCurrentUser = false,
}: StandbyitemProps) {
  return (
    <div className={`flex items-center justify-between px-11 py-5 rounded-2xl w-160 ${
      isCurrentUser 
        ? "bg-yellow-300 border-4 border-yellow-500 shadow-lg" 
        : "bg-gray-300"
    }`}>
      <div className="flex items-center gap-4 text-xl font-bold">
        <Image 
          src={iconSrc || "/icons/default-user-icon.svg"}
          alt={`${name}-icon`}
          width={44}
          height={44}
        />
        {deviceNumber}P
      </div>
      <p className="text-2xl font-black">
        {name}
      </p>
      <div className="flex items-center gap-2">
        <Image
          src="/game/chip_icon1.svg"
          alt=""
          width={24}
          height={24}
        />
        <span className="text-xl font-bold">{point}</span>pt
      </div>
    </div>
  );
}