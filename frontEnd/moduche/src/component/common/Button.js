import React from "react";
import { Box, Button } from "@mui/material";

const justifyMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
    "space-between": "space-between",
};

/**
 * 단일 버튼
 * - 버튼 위에 컨테이너(Box)를 두고, 버튼은 컨테이너 폭을 채웁니다.
 * - inline=true면 한 줄에 여러 개 나란히 배치 가능 (inline-flex)
 */
export function OneAlignedButton({
    align = "center",
    containerSx,
    buttonWrapperSx, // 버튼을 감싸는 컨테이너 스타일(폭/최소폭/반응형)
    buttonSx,
    children,
    variant = "contained",
    color = "primary",
    size = "medium",
    sx,
    inline = true,
    ...buttonProps
}) {
    return (
        <Box
            sx={{
                display: inline ? "inline-flex" : "flex",
                justifyContent: justifyMap[align],
                width: "100%",
                ...containerSx,
            }}
        >
            {/* 버튼 위 컨테이너 */}
            <Box
                sx={{
                    // 여기서 너비/최소너비/반응형을 조정
                    // 예) width: 240, 혹은 width: { xs: "100%", sm: 260 }
                    ...buttonWrapperSx,
                }}
            >
                <Button
                    variant={variant}
                    color={color}
                    size={size}
                    sx={{
                        borderRadius: "12px",
                        fontWeight: 600,
                        textTransform: "none",
                        px: 3,
                        py: 1.2,
                        width: "100%", // ✅ 래퍼(Box) 너비를 항상 꽉 채움
                        ...buttonSx,
                        ...sx,
                    }}
                    {...buttonProps}
                >
                    {children}
                </Button>
            </Box>
        </Box>
    );
}

/**
 * 두 개 버튼 (단일 그룹 컨테이너 버전)
 * - 두 버튼이 "하나의 컨테이너"로 감싸집니다.
 * - 그룹 컨테이너(groupContainerSx)에서 전체 폭/최소폭/반응형을 제어합니다.
 * - equalWidth=true면 두 버튼에 flex:1을 주어 같은 너비로 배분합니다.
 */
export function TwoAlignedButtons({
    align = "center",
    gap = 2,
    equalWidth = false,
    containerSx,      // 바깥 정렬 래퍼(Box)의 스타일
    groupContainerSx, // 두 버튼을 함께 감싸는 단일 컨테이너(Box)의 스타일(폭/최소폭/반응형)
    leftButton = {},
    rightButton = {},
    defaults = {},
}) {
    const {
        variant = "contained",
        color = "primary",
        size = "medium",
        buttonSx = {},
    } = defaults;

    // 개별 버튼에서 sx만 분리하여 충돌 방지
    const { sx: leftSx, ...leftRest } = leftButton;
    const { sx: rightSx, ...rightRest } = rightButton;

    // 버튼 공통 스타일
    const baseBtnSx = {
        borderRadius: "12px",
        fontWeight: 600,
        textTransform: "none",
        px: 3,
        py: 1.2,
        ...(equalWidth ? { flex: 1 } : {}),
        ...buttonSx,
    };

    return (
        // 바깥 래퍼: 라인에서 그룹 컨테이너의 정렬 담당
        <Box
            sx={{
                display: "flex",
                width: "100%",
                justifyContent: justifyMap[align] || "center",
                ...containerSx,
            }}
        >
            {/* 단일 그룹 컨테이너: 이 박스에서 전체 길이(폭) 제어 */}
            <Box
                sx={{
                    display: "flex",
                    gap,
                    flexWrap: "wrap",
                    // 예) width: { xs: "100%", sm: 440 }, maxWidth: 520
                    ...groupContainerSx,
                }}
            >
                <Button
                    variant={leftRest.variant || variant}
                    color={leftRest.color || color}
                    size={leftRest.size || size}
                    sx={{ ...baseBtnSx, ...leftSx }}
                    {...leftRest}
                >
                    {leftRest.children || "Left"}
                </Button>

                <Button
                    variant={rightRest.variant || variant}
                    color={rightRest.color || color}
                    size={rightRest.size || size}
                    sx={{ ...baseBtnSx, ...rightSx }}
                    {...rightRest}
                >
                    {rightRest.children || "Right"}
                </Button>
            </Box>
        </Box>
    );
}
