"use client";
import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import{LoginButton} from"@/components/features/start/LoginButton";
import {Qr} from"@/components/features/start/Qr";
import {OperationInstructions} from"@/components/features/start/OperationInstructions";

export default function Test() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <OperationInstructions />
        </div>
    );
}
