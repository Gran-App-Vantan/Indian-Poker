import Image from "next/image";

interface StandbyItemProps {
  iconSrc: string;
  deviceNumber: number;
  name: string;
  point: number;
}

export function StandbyItem({
  iconSrc,
  deviceNumber,
  name,
  point
}: StandbyItemProps) {
  return (
    <div>
      <div>
        <Image 
          src={iconSrc}
          alt={`${name}-icon`}
          width={44}
          height={44}
        />
        {deviceNumber}P
      </div>
      <p>
        {name}
      </p>
      <Image 
        src="/game/chip_icon1.svg"
        alt=""
        width={24}
        height={24}
      />
      {point}pt
    </div>
  )
}