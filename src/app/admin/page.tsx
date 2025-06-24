import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8 bg-background">
      <main className="flex flex-col gap-6 items-center">
        <h1 className="text-2xl font-bold">管理画面</h1>
        <Link href="/" className="rounded bg-foreground text-background px-6 py-2 font-semibold shadow hover:bg-opacity-90 transition">TOPに戻る</Link>
      </main>
    </div>
  );
} 