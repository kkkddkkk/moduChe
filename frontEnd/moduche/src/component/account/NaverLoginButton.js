import SNSLogInButton from "./SNSLogInButton"
import { FRONT_SERVERHOST } from "../common/Variables";

const NaverLoginButton = () => {
    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_LOGIN_CLIENT_ID; // 발급받은 클라이언트 아이디
    const REDIRECT_URI = FRONT_SERVERHOST; // Callback URL
    const STATE = "false";
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;


    const clickNaverLogin = () => {
        window.location.href = NAVER_AUTH_URL;
    }
    return (
        <SNSLogInButton
            onClick={clickNaverLogin}
            logoFileName={"NAVER_LOGO"}
            snsName={"네이버"}
        />
    )
}
export default NaverLoginButton;