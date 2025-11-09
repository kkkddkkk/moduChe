import React, { useEffect, useState } from "react";
import {
    getRecommendationsByDisability,
    getRecommendationDetail,
} from "../../api/myFitAPI/myFitRecommendAPI";

const MyFitRecommend = () => {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await getRecommendationsByDisability("시각장애");
            setRecommendations(data);
        };
        fetchData();
    }, []);

    return (
        <div>
            <h2>추천 운동</h2>
            <ul>
                {recommendations.map((r) => (
                    <li key={r.recommendId}>
                        {r.recommendMvmNm} - {r.intensity}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyFitRecommend;
