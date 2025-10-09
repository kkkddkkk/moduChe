// src/component/common/Paper.js
// ❌ import { useTheme } from '@emotion/react';
import { useTheme } from '@mui/material/styles';
import MuiPaper from '@mui/material/Paper';

const Paper = ({
    children,
    onClick,
    elevation = 3,
    padding = 3,
    hoverable = false,
    sx,
    ...rest
}) => {
    const theme = useTheme();

    // 방어: elevation 범위(0~24) 보정
    const safeElevation = Math.min(Math.max(elevation, 0), 24);
    const hoverElevation = Math.min(safeElevation + 2, 24);

    return (
        <MuiPaper
            elevation={safeElevation}
            onClick={onClick}
            sx={{
                p: padding,
                m: 2,
                borderRadius: 2,
                // 방어용 옵셔널 체이닝 + 기본값
                backgroundColor: theme?.palette?.background?.paper ?? '#fff',
                color: theme?.palette?.text?.primary ?? '#000',
                boxShadow: theme?.shadows?.[safeElevation],
                transition: 'all 0.3s ease',
                cursor: onClick ? 'pointer' : 'default',
                ...(hoverable
                    ? {
                        '&:hover': {
                            boxShadow: theme?.shadows?.[hoverElevation],
                            transform: 'translateY(-2px)',
                        },
                    }
                    : {}),
                ...sx,
            }}
            {...rest}
        >
            {children}
        </MuiPaper>
    );
};

export default Paper;
