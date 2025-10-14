import { Grid } from '@mui/material'
import Header from '../main/Header';
import Footer from '../main/Footer';
import ScrollTopButton from './ScrollTopButton';
const Layout = ({ space, padding, children, outer }) => {
    return (
        <Grid container spacing={space} padding={padding}>
            {outer ? <Header /> : <></>}
            {children}
            {outer ? <ScrollTopButton /> : <></>}
            {outer ? <Footer /> : <></>}
        </Grid>
    )
}
export default Layout;