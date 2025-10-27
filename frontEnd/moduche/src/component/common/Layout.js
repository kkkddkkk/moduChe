import { Grid, useMediaQuery, useTheme } from '@mui/material';
import Header from '../main/Header';
import Footer from '../main/Footer';
import ScrollTopButton from './ScrollTopButton';
const Layout = ({ space, padding, children, outer, layoutProps, admin }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <>
      {outer ? <Header /> : <></>}
      <Grid
        container
        spacing={space}
        padding={padding}
        minHeight={outer ? '100vh' : false}
        width={'100%'}
        rowGap={0}
        {...layoutProps}
      >
        {children}
      </Grid>
      {outer ? <ScrollTopButton /> : <></>}
      {outer && !isMobile && !admin? <Footer /> : <></>}
    </>
  );
};
export default Layout;
