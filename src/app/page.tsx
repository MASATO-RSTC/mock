import Image from "next/image";
import Link from "next/link";
import { FaUser, FaFileAlt, FaCogs } from "react-icons/fa";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 text-white">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm flex mb-12">
        <Image
          src="/logo_ritsuan_black.png"
          alt="Ritsuan Logo"
          width={240}
          height={80}
          priority
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <Link href="/mypage" className="flex items-center justify-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-lg px-8 py-4 text-lg shadow-lg transition-all text-center">
          <FaUser />
          マイページ（社員）
        </Link>
        <Link href="/applicant" className="flex items-center justify-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-lg px-8 py-4 text-lg shadow-lg transition-all text-center">
          <FaFileAlt />
          マイページ（応募者）
        </Link>
        <Link href="/admin/dashboard" className="flex items-center justify-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-lg px-8 py-4 text-lg shadow-lg transition-all text-center">
          <FaCogs />
          管理画面
        </Link>
      </div>
    </main>
  );
}
