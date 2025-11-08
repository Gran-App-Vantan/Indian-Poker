"use client";

export type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

export function Modal({ isOpen, onClose, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ease-out transform">
            <div
                className="absolute inset-0 bg-black/65"
                onClick={onClose}
            />
            <div>
                {children}
            </div>
        </div>
    );
}
