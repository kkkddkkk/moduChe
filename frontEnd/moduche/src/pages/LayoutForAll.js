
import Layout from "../component/common/Layout"
import { Outlet } from "react-router-dom";

const LayoutForAll=()=>{
    return(
        <Layout outer >
            <Outlet/>
        </Layout>
    )
}
export default LayoutForAll;