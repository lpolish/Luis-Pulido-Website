import React from 'react';
import { Header } from '@/components/header';


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>
    <div className="pb-24">
      <Header />
    </div>
    <main className="mx-auto">
      {children}
    </main>
  </div>
);

export default Layout;