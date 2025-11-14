type ButtonProps = {
    variant?: "change" | "decision" | "stop" | "Confirmedtochange" | "setBet";
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
}

export function Button({ variant = "change", className = "", onClick, disabled = false }: ButtonProps) {
    const base = "flex justify-center items-center w-64 h-14 rounded-full text-white font-bold text-2xl bg-linear-to-r from-[#C59D4D] via-[#f5e798] to-[#7A5C2E]";
    
    const variants: Record<string, string> =  {
        change: "flex justify-center items-center w-62 h-12 bg-[linear-gradient(180deg,#671818_0%,#C57979_17.79%,#671818_33.17%,#5B1111_62.02%,#972121_100%)] shadow-[0_0_36.7px_0_rgba(0,0,0,0.64),_0_0_28.2px_0_#000_inset,_0_0_50.6px_0_#971818_inset,_0_24px_24px_0_rgba(226,168,168,0.27)_inset,_0_-24px_49px_0_rgba(0,0,0,0.78)_inset] rounded-full",
        decision: "flex justify-center items-center w-62 h-12 bg-[linear-gradient(180deg,#675C18_0%,#BDC579_17.79%,#676218_33.17%,#5B5511_62.02%,#979121_100%)] shadow-[0_0_36.7px_0_rgba(0,0,0,0.64),0_0_28.2px_0_#000_inset,0_0_50.6px_0_#E4D154_inset,0_24px_24px_0_rgba(226,168,168,0.27)_inset,0_-24px_49px_0_rgba(0,0,0,0.78)_inset] rounded-full",
        stop: "flex justify-center items-center w-62 h-12  bg-[linear-gradient(180deg,#183A67_0%,#798FC5_17.79%,#182B67_33.17%,#11205B_62.02%,#215097_100%)] shadow-[0_0_36px_0_rgba(0,0,0,0.64),0_0_28.2px_0_#000_inset,0_0_50.6px_0_#188097_inset,0_24px_24px_0_rgba(168,193,226,0.27)_inset,0_-24px_49px_0_rgba(0,0,0,0.78)_inset] rounded-full",
        Confirmedtochange: "flex justify-center items-center w-62 h-12 bg-black shadow-[0_0_36.7px_0_rgba(0,0,0,0.64),0_0_28.2px_0_#000_inset,0_0_50.6px_0_#971818_inset,0_24px_24px_0_rgba(226,168,168,0.27)_inset,0_-24px_49px_0_rgba(0,0,0,0.78)_inset] rounded-full",
        setBet: "flex justify-center items-center w-62 h-12 bg-[linear-gradient(180deg,#186718_0%,#79C579_17.79%,#186718_33.17%,#115B11_62.02%,#219721_100%)] shadow-[0_0_36.7px_0_rgba(0,0,0,0.64),0_0_28.2px_0_#000_inset,0_0_50.6px_0_#18975F_inset,0_24px_24px_0_rgba(168,226,168,0.27)_inset,0_-24px_49px_0_rgba(0,0,0,0.78)_inset] rounded-full",
    }

    const texts: Record<string, React.ReactNode> = {
        change: "カードを変える",
        decision: "これでイクゥ!",
        stop: "やめる",
        Confirmedtochange: "変える",
        setBet: "掛け金を決める",
    }

    return (
        <div className={`${base} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'} transition-transform duration-500`}>
        <button
            className={`${variants[variant]} ${className}`}
            onClick={onClick}
            disabled={disabled}
        >
            <p className="opacity-60">{texts[variant]}</p>
        </button>
        </div>
    );
}
