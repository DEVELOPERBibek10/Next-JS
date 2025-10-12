import Header from "@/components/Header";
import MobileNavigation from "@/components/MobileNavigation";
import Sidebar from "@/components/Sidebar";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <main className="flex h-screen">
        <Sidebar />
        <section className="flex h-full flex-1 flex-col">
          <MobileNavigation /> <Header />
          <div className="remove-scrollbar h-full flex-1 overflow-auto bg-light-400 px-5 py-7 sm:mr-7 sm:rounded-[30px] md:mb-7 md:px-9 md:py-10">
            {children}
          </div>
        </section>
      </main>
    </>
  );
};

export default Layout;
