"use client";
import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { StartButton } from "@/components/features/start/StartButon";

export default function Test() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="p-6">

        <Modal
            openModal={showModal}
            size="large"
            onClose={() => setShowModal(false)}
        >
            <div>
            <StartButton />
            </div>
        </Modal>
        </div>
    );
}
