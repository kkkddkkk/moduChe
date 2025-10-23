import { FRONT_SERVERHOST } from "../common/Variables";
import SNSLogInButton from "./SNSLogInButton";

const KakaoLoginButton = () => {
    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_LOGIN_CLIENT_ID; // 발급받은 클라이언트 아이디
    const REDIRECT_URI = FRONT_SERVERHOST; // Callback URL
    const STATE = "false";
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;


    const clickKaKaoLogin = () => {
        window.location.href = NAVER_AUTH_URL;
    }
    return (
        <SNSLogInButton
            onClick={clickKaKaoLogin}
            logoFileName={"KAKAO_LOGO"}
            snsName={"카카오"}
        />
    )
}
export default KakaoLoginButton;