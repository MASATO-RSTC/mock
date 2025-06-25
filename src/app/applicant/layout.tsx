"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Icon from '@mdi/react';
import { mdiCardAccountDetailsOutline, mdiFileDocumentEditOutline, mdiMenu, mdiClose, mdiLogout, mdiHeadset } from "@mdi/js";
import Link from "next/link";

const menuGroups = [
  {
    label: "プロフィール管理",
    items: [
      { label: "基本情報", href: "/applicant/settings", icon: mdiCardAccountDetailsOutline },
      { label: "スキル情報", href: "/applicant/skills", icon: mdiFileDocumentEditOutline },
    ],
  },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar }: { isSidebarOpen: boolean, toggleSidebar: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div
      className={`fixed top-0 left-0 bg-gray-800 text-white w-64 transition-transform duration-300 ease-in-out z-50 m-2 rounded-xl flex flex-col shadow-lg overflow-hidden h-[calc(100vh-1rem)] ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="p-4 pb-0 relative">
        <button onClick={toggleSidebar} className="absolute top-4 right-2 text-gray-400 hover:text-white">
          <Icon path={mdiClose} size={1.2} />
        </button>
        <div className="flex justify-center mt-2 mb-8">
          <Image src="/logo_ritsuan.png" alt="Ritsuan Logo" width={120} height={40} />
        </div>
        <div className="text-center mb-8">
          <p className="text-xl font-semibold">
            応募者 太郎
            <span className="text-sm text-gray-400 ml-2">(0000)</span>
          </p>
          <p className="text-sm text-gray-400">オウボシャ タロウ</p>
        </div>
      </div>
      <nav className="flex-1 space-y-4 px-4 overflow-y-auto pb-4">
        {menuGroups.map((group) => (
          <div key={group.label}>
            <h3 className="px-3 text-xs font-semibold uppercase text-gray-400 tracking-wider">
              {group.label}
            </h3>
            <ul className="mt-2 space-y-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Icon path={item.icon} size={0.8} className="mr-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <div className="mt-auto flex-shrink-0">
         <a href="#" className="flex items-center py-2 px-6 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
           <Icon path={mdiHeadset} size={0.8} className="mr-3" />
           お問い合わせ
         </a>
         <button onClick={handleLogout} className="flex items-center justify-center w-full bg-blue-600 text-white font-bold py-3 hover:bg-blue-700 transition-colors text-sm">
           <Icon path={mdiLogout} size={0.8} className="mr-2" />
           Logout
         </button>
      </div>
    </div>
  );
};

const Header = ({ isSidebarOpen, toggleSidebar }: { isSidebarOpen: boolean; toggleSidebar: () => void; }) => {
  return (
    <header className="h-16 px-6 flex justify-between items-center z-20 relative">
      <button
        onClick={toggleSidebar}
        className={`text-gray-600 hover:text-gray-900 ${isSidebarOpen ? 'invisible' : ''}`}
        aria-label="Open sidebar"
      >
        <Icon path={mdiMenu} size={1.2} />
      </button>
      <div className="text-right">
        <span className="text-sm text-gray-600 font-medium">応募者メニュー</span>
      </div>
    </header>
  );
};

const ApplicantLayoutClient = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 flex flex-col min-w-0 bg-gray-50/50 transition-all duration-300 ${isSidebarOpen ? 'pl-72' : 'pl-0'}`}>
        <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function ApplicantLayout({ children }: { children: React.ReactNode }) {
  return <ApplicantLayoutClient>{children}</ApplicantLayoutClient>;
} 