import React, { useEffect, useState } from "react";
import {
    getAllMeasureResults,
    getMeasureResultById,
    saveMeasureResult,
} from "../../api/myFitAPI/myFitMeasureAPI";

const MyFitMeasure = () => {
    const [measureResults, setMeasureResults] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllMeasureResults();
            setMeasureResults(data);
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>측정 결과</h2>
            <ul>
                {measureResults.map((result) => (
                    <li key={result.id}>
                        {result.itemName} - {result.score}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyFitMeasure;
