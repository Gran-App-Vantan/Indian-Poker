export function Stanby() {
    const standby = ["待機中...", "準備OK"];

    return (
        <dialog
            className="flex items-center justify-center m-auto
                gradation-red  rounded-custom overflow-hidden  bg-black/80 w-[865px] h-[541px] ">
            <button
                className="flex justify-center items-center w-48 h-20
                        bg-white/40 rounded-2xl font-black text-white text-3xl
                        absolute bottom-10"
            >
                <p>{standby[0]}</p>
            </button>
        </dialog>
);
}