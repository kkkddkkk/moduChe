import React from "react";
import { Box, Button } from "@mui/material";

const justifyMap = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
    "space-between": "space-between",
};

// 단일 버튼
export function OneAlignedButton({
    align = "center",
    containerSx,
    buttonSx,
    children,
    variant = "contained",
    color = "primary",
    size = "medium",
    sx,
    ...buttonProps
}) {
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: justifyMap[align],
                width: "100%",
                ...containerSx,
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
                    ...buttonSx,
                    ...sx,
                }}
                {...buttonProps}
            >
                {children}
            </Button>
        </Box>
    );
}

// 두 개 버튼
export function TwoAlignedButtons({
    align = "center",
    gap = 2,
    equalWidth = false,
    minButtonWidth,
    containerSx,
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

    const baseButtonSx = {
        borderRadius: "12px",
        fontWeight: 600,
        textTransform: "none",
        px: 3,
        py: 1.2,
        minWidth: minButtonWidth,
        ...(equalWidth ? { flex: 1 } : {}),
        ...buttonSx,
    };

    return (
        <Box
            sx={{
                display: "flex",
                width: "100%",
                gap,
                justifyContent: justifyMap[align] || "center",
                flexWrap: "wrap",
                ...containerSx,
            }}
        >
            <Button
                variant={leftButton.variant || variant}
                color={leftButton.color || color}
                size={leftButton.size || size}
                sx={{ ...baseButtonSx, ...leftButton.sx }}
                {...leftButton}
            >
                {leftButton.children || "Left"}
            </Button>

            <Button
                variant={rightButton.variant || variant}
                color={rightButton.color || color}
                size={rightButton.size || size}
                sx={{ ...baseButtonSx, ...rightButton.sx }}
                {...rightButton}
            >
                {rightButton.children || "Right"}
            </Button>
        </Box>
    );
}
