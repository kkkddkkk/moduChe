import {Grid} from '@mui/material'
const Layout=({space, padding, children})=>{
    return(
        <Grid container spacing={space} padding={padding}>
            {children}
        </Grid>
    )
}
export default Layout;