import { Layout } from 'lucide-react';
import { Outlet } from 'react-router-dom';

const MyPage = () => {
  return (
    <Layout spacing={2}>
      <Outlet />
    </Layout>
  );
};
export default MyPage;
