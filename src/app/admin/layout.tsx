"use client";
import Image from "next/image";
import { useState } from "react";
import { Transition } from "@headlessui/react";
import { usePathname } from "next/navigation";
import { mdiViewDashboard, mdiAccountGroup, mdiClockOutline, mdiCog, mdiHome, mdiFileDocument, mdiFileDocumentEditOutline, mdiCheckCircle, mdiCardAccountDetailsOutline, mdiHeadset, mdiLogout, mdiMenu, mdiClose } from "@mdi/js";
import Icon from '@mdi/react';
import Link from "next/link";

const adminMenuGroups = [
  {
    label: "全体管理",
    items: [
      { label: "ダッシュボード", href: "/admin/dashboard", icon: mdiViewDashboard },
    ],
  },
  {
    label: "勤怠管理",
    items: [
      { label: "勤怠一覧", href: "/admin/attendance", icon: mdiClockOutline },
    ],
  },
  {
    label: "スタッフ管理",
    items: [
      { label: "スタッフ一覧", href: "/admin/staff", icon: mdiAccountGroup },
    ],
  },
  {
    label: "各種設定",
    items: [
      { label: "タイムカード設定", href: "/admin/settings", icon: mdiCog },
    ],
  },
];

const mypageMenuGroups = [
  {
    label: "勤怠作業",
    items: [
      { label: "締め作業", href: "/mypage/closing", icon: mdiCheckCircle },
    ],
  },
  {
    label: "プロフィール管理",
    items: [
      { label: "基本情報", href: "/mypage/settings", icon: mdiCardAccountDetailsOutline },
      { label: "スキル情報", href: "/mypage/skills", icon: mdiFileDocumentEditOutline },
    ],
  },
  {
    label: "仲間を探す",
    items: [
      { label: "スキルから探す", href: "/mypage/search-by-skill", icon: mdiAccountGroup },
      { label: "クライアントから探す", href: "/mypage/search-by-client", icon: mdiCog },
    ],
  },
];

function MdiIcon({ path, className = "", size = 20 }: { path: string; className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d={path} />
    </svg>
  );
}

function getBreadcrumbs(pathname: string) {
  // パンくず用のラベル辞書
  const labelMap: Record<string, string> = {
    staff: "スタッフ一覧",
    settings: "タイムカード設定",
    attendance: "勤怠一覧",
    dashboard: "ダッシュボード",
    // 必要に応じて他の一覧名も追加
  };
  const detailLabelMap: Record<string, string> = {
    staff: "スタッフ詳細",
    settings: "設定詳細",
    attendance: "勤怠詳細",
    dashboard: "ダッシュボード",
    // 必要に応じて他の詳細名も追加
  };
  const parts = pathname.replace(/^\//, "").split("/").filter(Boolean);

  // /admin/xxx → 一覧名のみ
  if (parts[0] === "admin" && parts.length === 2) {
    const listKey = parts[1];
    return [
      { label: labelMap[listKey] || listKey, href: `/admin/${listKey}` },
    ];
  }
  // /admin/xxx/yyy → 一覧名 ＞ 詳細名
  if (parts[0] === "admin" && parts.length === 3) {
    const listKey = parts[1];
    return [
      { label: labelMap[listKey] || listKey, href: `/admin/${listKey}` },
      { label: detailLabelMap[listKey] || "詳細", href: pathname },
    ];
  }
  // それ以外は従来通り
  const crumbs = parts.map((part, i) => ({
    label: part,
    href: "/" + parts.slice(0, i + 1).join("/"),
  }));
  return crumbs;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbs(pathname);
  
  // /admin/staff/skills/ページの場合のみマイページ側のメニューを表示
  const isSkillsPage = pathname.startsWith('/admin/staff/skills');
  const menuGroups = isSkillsPage ? mypageMenuGroups : adminMenuGroups;
  const userName = isSkillsPage ? "リツアン 次郎" : "片桐 雅人";
  const userKana = isSkillsPage ? "リツアン ジロウ" : "カタギリ マサト";
  const userNumber = isSkillsPage ? "（2459）" : "（58）";

  return (
    <div>
      {/* サイドメニューを固定・角丸・開閉アニメーション */}
      <Transition
        show={open}
        enter="transition-all duration-200"
        enterFrom="-translate-x-64 opacity-0"
        enterTo="translate-x-0 opacity-100"
        leave="transition-all duration-200"
        leaveFrom="translate-x-0 opacity-100"
        leaveTo="-translate-x-64 opacity-0"
      >
        <div className="fixed top-0 left-0 h-[calc(100vh-16px)] w-60 bg-gray-800 text-white flex flex-col z-40 rounded-xl rounded-b-xl m-2 shadow-lg overflow-hidden">
          <div className="flex items-center p-6 pb-0">
            {/* サイドメニュー閉じるボタン（ロゴの左側） */}
            <button
              className="mr-2 bg-gray-700 text-white rounded-full p-1 focus:outline-none"
              onClick={() => setOpen(false)}
              aria-label="サイドメニューを閉じる"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
            <Image src="/logo_ritsuan.png" alt="ritsuan" width={120} height={40} priority />
          </div>
          <div className="mt-6 text-center">
            <div className="text-lg font-bold">
              {userName}
              <span className="text-gray-400 font-normal ml-1">{userNumber}</span>
            </div>
            <div className="text-sm text-gray-400 mt-1">{userKana}</div>
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="px-4 space-y-4">
              {menuGroups.map((group) => (
                <li key={group.label}>
                  <div className="text-xs text-gray-400 mb-1">{group.label}</div>
                  {group.items.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 py-2 px-4 rounded transition font-medium ${pathname === item.href ? "text-white font-bold bg-gray-700" : "text-gray-300 hover:text-white"}`}
                    >
                      <MdiIcon path={item.icon} className="flex-none" size={20} />
                      <span>{item.label}</span>
                    </a>
                  ))}
                </li>
              ))}
            </ul>
          </nav>
          {/* ログアウトボタン */}
          <div className="mt-auto">
            <div className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-b-xl">
              <a href="/" className="flex items-center gap-2 w-full justify-center text-white font-medium py-3 text-base rounded-b-xl">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                </svg>
                Logout
              </a>
            </div>
          </div>
        </div>
      </Transition>
      {/* メインコンテンツはサイドメニュー分だけ右に余白（開いている時のみml-60） */}
      <div className={open ? "ml-60 min-h-screen bg-gray-100 transition-all duration-200" : "min-h-screen bg-gray-100 transition-all duration-200"}>
        {/* ヘッダー */}
        <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-2 h-12 bg-gray-100">
          {/* サイドメニュー開閉ボタン（サイドメニューが閉じているときのみ表示） */}
          {!open && (
            <button
              className="mr-4 bg-gray-100 text-black rounded-full p-2 focus:outline-none"
              onClick={() => setOpen(true)}
              aria-label="サイドメニューを開く"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="6" width="16" height="2" rx="1" fill="currentColor" />
                <rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor" />
                <rect x="4" y="16" width="16" height="2" rx="1" fill="currentColor" />
              </svg>
            </button>
          )}
          {/* パンくずリスト */}
          <nav className="text-sm text-gray-500 flex-1 flex justify-end items-center gap-2">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-2">
                {i > 0 && <span className="mx-1">&gt;</span>}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-gray-800 font-bold">{crumb.label}</span>
                ) : (
                  <a href={crumb.href} className="hover:underline">{crumb.label}</a>
                )}
              </span>
            ))}
          </nav>
        </header>
        <main className="p-6 pt-24">{children}</main>
      </div>
    </div>
  );
} 