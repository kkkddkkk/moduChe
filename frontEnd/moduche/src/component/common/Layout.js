import { Grid } from '@mui/material'
import Header from '../main/Header';
import Footer from '../main/Footer';
import ScrollTopButton from './ScrollTopButton';
const Layout = ({ space, padding, children, outer }) => {
    return (
        <>
            {outer ? <Header /> : <></>}
            <Grid container spacing={space} padding={padding} minHeight={outer ? '100vh' : false} width={"100%"}>
                {children}
            </Grid>
            {outer ? <ScrollTopButton /> : <></>}
            {outer ? <Footer /> : <></>}
        </>

    )
}
export default Layout;