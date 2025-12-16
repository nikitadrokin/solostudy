import { AuthOverlay } from '@/components/auth-overlay';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return <AuthOverlay>{children}</AuthOverlay>;
};

export default Layout;
