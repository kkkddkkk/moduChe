import SNSLogInButton from "./SNSLogInButton"
import { FRONT_SERVERHOST } from "../common/Variables";

const GoogleLoginButton = () => {
    const NAVER_CLIENT_ID = process.env.REACT_APP_NAVER_LOGIN_CLIENT_ID; // 발급받은 클라이언트 아이디
    const REDIRECT_URI = FRONT_SERVERHOST; // Callback URL
    const STATE = "false";
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;


    const clickGoogleIcon = () => {
        window.location.href = NAVER_AUTH_URL;
    }
    return (
        <SNSLogInButton
            onClick={clickGoogleIcon}
            logoFileName={"GOOGLE_LOGO"}
            snsName={"구글"}
            outline
        />
    )
}
export default GoogleLoginButton;