"use client";
import { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import {Qr} from"@/components/features/start/Qr";
import {OperationInstructions} from"@/components/features/start/OperationInstructions";
import { Stanby } from "@/components/features/start/Standby";
import { PaymentSettings } from "@/components/features/game/PaymentSettings";
import { Timer } from "@/components/features/game/Timer";

export default function Test() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <Timer />
        </div>
    );
}
