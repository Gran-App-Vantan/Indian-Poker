"use client";
import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import{LoginButton} from"@/components/features/start/LoginButton";

export default function Test() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>

        <Modal
            openModal={showModal}
            size="normal"
            onClose={() => setShowModal(false)}
        >
            <div>
                <LoginButton/>
            </div>
        </Modal>
        </div>
    );
}
