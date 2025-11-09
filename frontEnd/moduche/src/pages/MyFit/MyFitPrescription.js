import React, { useEffect, useState } from "react";
import {
    generatePrescription,
    getPrescriptionByUser,
} from "../../api/myFitAPI/myFitPrescriptionAPI";

const MyFitPrescription = () => {
    const [prescription, setPrescription] = useState(null);

    useEffect(() => {
        const loadPrescription = async () => {
            const data = await getPrescriptionByUser(1);
            setPrescription(data);
        };
        loadPrescription();
    }, []);

    return (
        <div>
            <h2>운동 처방</h2>
            {prescription ? (
                <p>{prescription.prescriptionContent}</p>
            ) : (
                <p>데이터를 불러오는 중...</p>
            )}
        </div>
    );
};

export default MyFitPrescription;
