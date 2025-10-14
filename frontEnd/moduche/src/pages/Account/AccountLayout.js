import { Outlet } from "react-router-dom";
import Layout from "../../component/common/Layout";

const AccountLayout=()=>{
    return(
        <Layout outer>
            <Outlet/>
        </Layout>
    )
}
export default AccountLayout;