// src/pages/MyFit/MyFitMeasureConfig.js

export const MyFitMeasureConfig = {
    지체장애: [
        {
            key: "cardio",
            label: "심폐지구력",
            category: "기초 체력",
            options: ["6분 걷기", "휠체어 5분 달리기", "스텝 검사"],
            unit: "초",
        },
        {
            key: "strength",
            label: "근력",
            category: "기초 체력",
            options: ["악력 측정", "윗몸 일으키기"],
            unit: "kg",
        },
        {
            key: "balance",
            label: "평형성",
            category: "기능 체력",
            options: ["외발 서기", "균형 보드"],
            unit: "초",
        },
    ],
    시각장애: [
        {
            key: "cardio",
            label: "심폐지구력",
            category: "기초 체력",
            options: ["6분 걷기", "페이서 테스트"],
            unit: "초",
        },
        {
            key: "flexibility",
            label: "유연성",
            category: "기능 체력",
            options: ["윗몸 앞으로 굽히기"],
            unit: "cm",
        },
    ],
    청각장애: [
        {
            key: "strength",
            label: "근력",
            category: "기초 체력",
            options: ["악력 측정"],
            unit: "kg",
        },
        {
            key: "agility",
            label: "민첩성",
            category: "기능 체력",
            options: ["왕복 달리기"],
            unit: "초",
        },
    ],
};
