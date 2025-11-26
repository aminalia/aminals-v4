import Footer from '@components/Footer';
import Header from '@components/Header';
import { PropsWithChildren } from 'react';

const Layout = (props: PropsWithChildren) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:pt-2 flex-grow w-full">
        <Header />
        <main className="pb-20 md:pb-8">{props.children}</main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
