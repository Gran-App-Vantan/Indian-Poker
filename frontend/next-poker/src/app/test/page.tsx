"use client";
import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import{LoginButton} from"@/components/features/start/LoginButton";
import {Qr} from"@/components/features/start/Qr";
import {OperationInstructions} from"@/components/features/start/OperationInstructions";
import { Stanby } from "@/components/features/start/Standby";

export default function Test() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <Modal
                size="large"
                openModal={showModal}
                onClose={() => setShowModal(false)}
                >
                    <Stanby />
            </Modal>
        </div>
    );
}
