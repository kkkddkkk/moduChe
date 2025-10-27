import { PencilLine } from "lucide-react";
import { SmallerSubTitle } from "../common/Text";
import { useTheme } from "@mui/material";

export const SignInText = ({title}) => {
    const theme = useTheme();
  return (
    <SmallerSubTitle sx={{ display: 'inline-flex', gap: '6px' }} color={theme.palette.text.primary}>
      <PencilLine />
      {title}
    </SmallerSubTitle>
  );
};
