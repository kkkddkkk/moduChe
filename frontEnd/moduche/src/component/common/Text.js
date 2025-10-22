import { Typography, useTheme } from '@mui/material';

export const CenterTitle = ({
  color,
  children,
  margin = '3% 0',
  italic,
  sx,
  onClick,
  hover,
}) => {
  const theme = useTheme();
  const main = theme.palette.primary.main;
  return (
    <Typography
      variant="h4"
      sx={{
        textAlign: 'center',
        color: color ? color : main,
        fontWeight: 'bold',
        margin: margin,
        fontStyle: italic ? 'italic' : 'normal',
        ...sx,
        '&:hover': {
          cursor: hover ? 'pointer' : 'auto',
        },
      }}
      onClick={hover ? onClick : () => {}}
    >
      {children}
    </Typography>
  );
};

export const StartTitle = ({
  color,
  children,
  margin = '3% 0',
  italic,
  sx,
  hover,
  onClick,
}) => {
  const theme = useTheme();
  const main = theme.palette.primary.main;
  return (
    <Typography
      variant="h4"
      sx={{
        ...sx,
        textAlign: 'initial',
        color: color ? color : main,
        fontWeight: 'bold',
        margin: margin,
        fontStyle: italic ? 'italic' : 'normal',
        '&:hover': {
          cursor: hover ? 'pointer' : 'auto',
        },
      }}
      onClick={hover ? onClick : () => {}}
    >
      {children}
    </Typography>
  );
};

export function SubTitle({
  color,
  children,
  margin = '0',
  italic,
  hover,
  onClick,
  sx,
}) {
  const theme = useTheme();
  const black = theme.palette.text.primary;
  return (
    <Typography
      variant="h6"
      color={color ? color : black}
      width={'100%'}
      sx={{
        ...sx,
        fontWeight: 'bold',
        margin: margin,
        fontStyle: italic ? 'italic' : 'normal',
        '&:hover': {
          cursor: hover ? 'pointer' : 'auto',
        },
      }}
      onClick={hover ? onClick : () => {}}
    >
      {children}
    </Typography>
  );
}

export function SmallerSubTitle({
  color,
  children,
  margin = '0',
  italic,
  hover,
  onClick,
  sx,
}) {
  const theme = useTheme();
  const gray = theme.palette.text.secondary;
  return (
    <Typography
      variant="subtitle1"
      color={color ? color : gray}
      width={'100%'}
      sx={{
        ...sx,
        fontWeight: 'bold',
        margin: margin,
        fontStyle: italic ? 'italic' : 'normal',
        '&:hover': {
          cursor: hover ? 'pointer' : 'auto',
        },
      }}
      onClick={hover ? onClick : () => {}}
    >
      {children}
    </Typography>
  );
}

export function Contents100({
  color,
  children,
  margin = '0',
  fontSize = 16,
  italic,
  bold,
  hover,
  onClick,
  sx,
}) {
  const theme = useTheme();
  const black = theme.palette.text.primary;
  return (
    <Typography
      variant="body2"
      color={color ? color : black}
      width={'100%'}
      sx={{
        ...sx,
        margin: margin,
        fontSize: `${fontSize}px`,
        fontStyle: italic ? 'italic' : 'normal',
        fontWeight: bold ? 'bold' : '',
        '&:hover': {
          cursor: hover ? 'pointer' : 'auto',
        },
      }}
      onClick={hover ? onClick : () => {}}
    >
      {children}
    </Typography>
  );
}
export function Contents({
  color,
  children,
  margin = '0',
  fontSize = 16,
  italic,
  bold,
  hover,
  onClick,
  sx,
}) {
  const theme = useTheme();
  const black = theme.palette.text.primary;
  return (
    <Typography
      variant="body2"
      color={color ? color : black}
      sx={{
        ...sx,
        margin: margin,
        fontSize: `${fontSize}px`,
        display: 'inline-block',
        fontStyle: italic ? 'italic' : 'normal',
        fontWeight: bold ? 'bold' : '',
        '&:hover': {
          cursor: hover ? 'pointer' : 'auto',
        },
      }}
      onClick={hover ? onClick : () => {}}
    >
      {children}
    </Typography>
  );
}
