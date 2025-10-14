import { createTheme } from "@mui/material/styles";

const Theme = createTheme({
    palette: {
        mode: "light",

        // main1 / main2
        primary: { main: "#004288ff" },   // main1
        secondary: { main: "#029cdeff" }, // main2

        // background1 / background2
        background: {
            default: "#FFFFFF", // background1
            paper: "#F7F7F7",   // background2
        },

        // text1 / text2
        text: {
            primary: "#333333", // text1
            secondary: "#6B6666", // text2
        },

        // warning2만 표준 팔레트에 반영 (MUI 내부 호환용)
        warning: { main: "#f3a600ff" },
    },

    customColors: {
        background3: "#F0F7FB", 
        main1: "#004288",       
        main2: "#009DE1",      
        text1: "#333333",       
        text2: "#6B6666",       
        warning1: "#f38200ff",  
        warning2: "#f3a600ff",  
    },
});

export default Theme;
