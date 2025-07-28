import React from "react";
import Navbar from "../navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <section>{children}</section>
    </div>
  );
};

export default Layout;
