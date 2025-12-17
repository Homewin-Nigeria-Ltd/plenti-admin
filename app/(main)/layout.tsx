import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/common/Sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen [--sidebar-width:340px] [--navbar-height:120px]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 overflow-auto bg-[bg-white] p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
