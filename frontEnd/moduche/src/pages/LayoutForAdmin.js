
import Layout from "../component/common/Layout"
import { Outlet } from "react-router-dom";

const LayoutForAdmin=()=>{
    return(
        <Layout outer admin={true}>
            <Outlet/>
        </Layout>
    )
}
export default LayoutForAdmin;