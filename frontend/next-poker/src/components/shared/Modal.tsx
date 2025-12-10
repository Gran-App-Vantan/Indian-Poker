"use client";

export type ModalProps = {
    isOpen: boolean;
    children: React.ReactNode;
};

export function Modal({ isOpen, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-out transform">
            <div
                className="absolute inset-0 bg-black/65"
            />
            <div>
                {children}
            </div>
        </div>
    );
}
