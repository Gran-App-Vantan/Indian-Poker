import Image from "next/image";
import { StandbyProps } from "./Standby";

export function StandbyItem({
  iconSrc,
  deviceNumber,
  name,
  point
}: StandbyProps) {
  return (
    <div className="flex items-center justify-between bg-gray-300 px-11 py-5 rounded-2xl w-160">
      <div className="flex items-center gap-4 text-xl font-bold">
        <Image 
          src={iconSrc || "デフォルトアイコン"} // TODO: デフォルトアイコンを挿入
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