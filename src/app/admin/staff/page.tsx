"use client";
import { mdiAccountPlus } from "@mdi/js";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineInfoCircle, AiOutlineFileDone, AiOutlineUser, AiOutlineIdcard, AiOutlineTeam, AiOutlineDollarCircle, AiOutlineStar, AiOutlineMail } from "react-icons/ai";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

// モックデータ
const staffList = [
  {
    id: 1,
    client_number: "102",
    client_name: "ヤマハ発動機株式会社 マリン事業本部",
    staff_number: "1538",
    staff_name: "奈良崎 慎一",
    staff_kana: "ナラサキ シンイチ",
    contract_type: "時給",
    unit_price: 4300,
    status: "稼働中",
    careerSheetStatus: {
      gakureki: true,
      station: true,
      skill: true,
      job: true,
    },
    careerSheetUpdatedAt: "2024/05/01 10:00",
  },
  {
    id: 2,
    client_number: "102",
    client_name: "ヤマハ発動機株式会社 マリン事業本部",
    staff_number: "1627",
    staff_name: "片瀬 博也",
    staff_kana: "カタセ ヒロヤ",
    contract_type: "時給",
    unit_price: 5200,
    status: "稼働中（異動）",
    careerSheetStatus: {
      gakureki: true,
      station: false,
      skill: true,
      job: false,
    },
    careerSheetUpdatedAt: "2024/04/15 09:30",
  },
  {
    id: 3,
    client_number: "102",
    client_name: "ヤマハ発動機株式会社 マリン事業本部",
    staff_number: "1994",
    staff_name: "石田 貴大",
    staff_kana: "イシダ タカヒロ",
    contract_type: "時給",
    unit_price: 8000,
    status: "異動予定（本人希望）",
    careerSheetStatus: {
      gakureki: true,
      station: true,
      skill: false,
      job: true,
    },
    careerSheetUpdatedAt: "2024/03/20 15:20",
  },
  {
    id: 4,
    client_number: "103",
    client_name: "株式会社テストシステム",
    staff_number: "2001",
    staff_name: "佐藤 花子",
    staff_kana: "サトウ ハナコ",
    contract_type: "月給",
    unit_price: 700000,
    status: "異動予定（終了確定）",
    careerSheetStatus: {
      gakureki: true,
      station: true,
      skill: true,
      job: true,
    },
    careerSheetUpdatedAt: "2024/05/10 11:00",
  },
  {
    id: 5,
    client_number: "117",
    client_name: "株式会社リツアンSTC",
    staff_number: "2002",
    staff_name: "鈴木 一郎",
    staff_kana: "スズキ イチロウ",
    contract_type: "時給",
    unit_price: 3000,
    status: "休業（産休・育休、傷病）",
    careerSheetStatus: {
      gakureki: false,
      station: false,
      skill: false,
      job: false,
    },
    careerSheetUpdatedAt: "",
  },
  {
    id: 6,
    client_number: "117",
    client_name: "株式会社リツアンSTC",
    staff_number: "2003",
    staff_name: "高橋 次郎",
    staff_kana: "タカハシ ジロウ",
    contract_type: "月給",
    unit_price: 900000,
    status: "休業（案件未決定）",
    careerSheetStatus: {
      gakureki: true,
      station: true,
      skill: true,
      job: false,
    },
    careerSheetUpdatedAt: "2024/03/30 13:10",
  },
  {
    id: 7,
    client_number: "106",
    client_name: "株式会社サンプル2",
    staff_number: "2004",
    staff_name: "田中 三郎",
    staff_kana: "タナカ サブロウ",
    contract_type: "時給",
    unit_price: 6700,
    status: "稼働中",
    careerSheetStatus: {
      gakureki: true,
      station: false,
      skill: true,
      job: true,
    },
    careerSheetUpdatedAt: "2024/05/05 08:45",
  },
  {
    id: 8,
    client_number: "-",
    client_name: "-",
    staff_number: "2005",
    staff_name: "山本 四郎",
    staff_kana: "ヤマモト シロウ",
    contract_type: "-",
    unit_price: 0,
    status: "退職",
    careerSheetStatus: {
      gakureki: true,
      station: true,
      skill: true,
      job: true,
    },
    careerSheetUpdatedAt: "2024/04/18 17:00",
  },
  {
    id: 9,
    client_number: "108",
    client_name: "株式会社デモ2",
    staff_number: "2006",
    staff_name: "中村 五郎",
    staff_kana: "ナカムラ ゴロウ",
    contract_type: "時給",
    unit_price: 3900,
    status: "稼働中（異動）",
    careerSheetStatus: {
      gakureki: false,
      station: true,
      skill: false,
      job: false,
    },
    careerSheetUpdatedAt: "",
  },
  {
    id: 10,
    client_number: "109",
    client_name: "株式会社サンプル3",
    staff_number: "2007",
    staff_name: "小林 六郎",
    staff_kana: "コバヤシ ロクロウ",
    contract_type: "月給",
    unit_price: 800000,
    status: "稼働中",
    careerSheetStatus: {
      gakureki: true,
      station: true,
      skill: true,
      job: true,
    },
    careerSheetUpdatedAt: "2024/05/12 14:30",
  },
];

const totalCount = 1034;
const perPageOptions = [10, 20, 50, 100];
const totalPages = 52;
const currentPage = 1;

const careerSheetTooltip = (status: any) => {
  return `学歴: ${status.gakureki ? 'OK' : '未'}\n最寄駅: ${status.station ? 'OK' : '未'}\nメインスキル: ${status.skill ? 'OK' : '未'}\n職務経歴: ${status.job ? 'OK' : '未'}`;
};

// ステータスに応じた色分けの関数
const getStatusColor = (status: string) => {
  switch (status) {
    case "稼働中":
    case "稼働中（異動）":
      return "border-blue-300 text-blue-700";
    case "異動予定（終了確定）":
    case "休業（案件未決定）":
      return "border-red-300 text-red-700";
    case "異動予定（本人希望）":
      return "border-yellow-300 text-yellow-700";
    case "休業（産休・育休、傷病）":
    case "退職":
    default:
      return "border-gray-300 text-gray-700";
  }
};

export default function StaffPage() {
  const [perPage, setPerPage] = useState(20);
  const [careerSheetDate, setCareerSheetDate] = useState<Date | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [drawerStaff, setDrawerStaff] = useState<any | null>(null);
  const isDrawerOpen = !!drawerStaff;
  const [mailDialogOpen, setMailDialogOpen] = useState(false);
  const [mailType, setMailType] = useState<'remind' | 'request'>('remind');
  // 仮の選択スタッフ情報
  const selectedStaff = staffList.find(s => selected.includes(s.id)) || staffList[0];
  const clientName = selectedStaff?.client_name || '';
  const staffName = selectedStaff?.staff_name || '';
  const loginUser = '管理者 太郎'; // 仮のログインユーザー名
  // 件名自動生成
  const mailSubject = `【キャリアシート更新依頼】_${clientName}_${staffName}`;
  // 本文テンプレート
  const remindBody = `${staffName}さん\n\nお仕事お疲れ様です。${loginUser}です。\n\n学歴、メインスキルがまだ登録いただけておりません。\n\n更新いただいた情報は、今後の案件マッチング・ご提案・単価見直しの際に活用され、\n最新スキルがある方ほど、早期に企業へ提案・配属決定しやすくなります。\n\nお手数をおかけしますが、更新作業をお願いいたします。`;
  const requestBody = `${staffName}さん\n\nお仕事お疲れ様です。${loginUser}です。\n\n次の配属先への提案のため、各項目の更新を行なってくださいますようお願いいたします。\n\nお手数をおかけしますが、更新作業をお願いいたします。`;
  const mailBody = mailType === 'remind' ? remindBody : requestBody;

  const allIds = staffList.map((s) => s.id);
  const isAllChecked = selected.length === staffList.length;
  const isIndeterminate = selected.length > 0 && !isAllChecked;

  const handleCheckAll = () => {
    setSelected(isAllChecked ? [] : allIds);
  };
  const handleCheck = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]);
  };

  // ページネーションボタン生成（1〜10, ..., 51, 52）
  const pageButtons = [
    ...Array(10).fill(0).map((_, i) => i + 1),
    '...',
    51,
    52,
  ];

  const [showTooltip, setShowTooltip] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      {/* タイトル＋アイコン */}
      <div className="flex items-center gap-3 mb-2">
        <AiOutlineTeam className="h-7 w-7 text-black" />
        <span className="text-2xl font-bold text-gray-800">スタッフ一覧</span>
      </div>
      {/* 検索フォーム */}
      <div className="bg-white rounded-xl shadow p-8 mb-4 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-xl font-bold">検索</h2>
        </div>
        <form>
          {/* 1段目: 5項目＋職種 */}
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-base font-bold text-gray-700 whitespace-nowrap">クライアント番号</label>
              <input className="border rounded px-3 py-2 text-sm" placeholder="クライアント番号" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-bold text-gray-700 whitespace-nowrap">クライアント名</label>
              <input className="border rounded px-3 py-2 text-sm" placeholder="クライアント名" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-bold text-gray-700 whitespace-nowrap">スタッフ番号</label>
              <input className="border rounded px-3 py-2 text-sm" placeholder="スタッフ番号" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-bold text-gray-700 whitespace-nowrap">スタッフ氏名</label>
              <input className="border rounded px-3 py-2 text-sm" placeholder="スタッフ氏名" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-bold text-gray-700 whitespace-nowrap">契約形態</label>
              <select className="border rounded px-3 py-2 text-sm">
                <option>指定なし</option>
                <option>時給</option>
                <option>月給</option>
              </select>
            </div>
            {/* 職種追加 */}
            <div className="flex flex-col gap-1">
              <label className="text-base font-bold text-gray-700 whitespace-nowrap">職種</label>
              <select className="border rounded px-3 py-2 text-sm">
                <option>選択してください</option>
                <option>IT</option>
                <option>機電</option>
                <option>建築</option>
                <option>その他</option>
                <option>未登録</option>
              </select>
            </div>
            {/* ステータス追加 */}
            <div className="flex flex-col gap-1">
              <label className="text-base font-bold text-gray-700 whitespace-nowrap">ステータス</label>
              <select className="border rounded px-3 py-2 text-sm">
                <option>指定なし</option>
                <option>稼働中</option>
                <option>稼働中（異動）</option>
                <option>異動予定（本人希望）</option>
                <option>異動予定（終了確定）</option>
                <option>休業（産休・育休、傷病）</option>
                <option>休業（案件未決定）</option>
                <option>退職</option>
              </select>
            </div>
          </div>
          {/* 2段目: 2項目 */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex flex-col gap-1 max-w-xs w-60">
              <label className="text-base font-bold text-gray-700 whitespace-nowrap truncate">キャリアシート更新状況</label>
              <select className="border rounded px-3 py-2 text-sm">
                <option>指定なし</option>
                <option>更新済</option>
                <option>未完了</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 max-w-xs w-60">
              <label className="text-base font-bold text-gray-700 whitespace-nowrap truncate">キャリアシート更新日時</label>
              <ReactDatePicker
                selected={careerSheetDate}
                onChange={(date) => setCareerSheetDate(date)}
                dateFormat="yyyy/MM/dd"
                className="border rounded px-3 py-2 text-sm w-full"
                placeholderText="例: 2024/05/01"
                isClearable
              />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <button type="submit" className="bg-blue-600 text-white rounded px-6 py-2 text-sm font-semibold shadow hover:bg-blue-700 transition">検索</button>
          </div>
        </form>
      </div>

      {/* 一覧テーブル */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold mb-0">スタッフ一覧</h2>
            {/* 一括操作（右上） */}
            <div className="flex items-center gap-2">
              <span className="text-xs">一括操作:</span>
              <select className="border rounded px-2 py-1 text-xs">
                <option>選択したスタッフにCS更新依頼メール送信</option>
              </select>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded px-4 py-2 text-xs shadow"
                onClick={() => setMailDialogOpen(true)}
              >
                実行
              </button>
            </div>
          </div>
        </div>
        {/* 上部コントロール */}
        <div className="flex items-center justify-between px-6 pb-2">
          {/* ページネーション（左上） */}
          <div className="flex items-center gap-1">
            <button className="px-2 py-0.5 rounded border text-xs text-gray-500">&lt;</button>
            {pageButtons.map((num, i) =>
              num === '...'
                ? <span key={`ellipsis-top-${i}`} className="px-1 text-xs text-gray-500">...</span>
                : <button key={`page-top-${num}-${i}`} className={`px-2 py-0.5 rounded border text-xs ${currentPage === num ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}>{num}</button>
            )}
            <button className="px-2 py-0.5 rounded border text-xs text-gray-500">&gt;</button>
          </div>
          {/* 表示件数セレクト＋件数情報（右上） */}
          <div className="flex items-center gap-4 ml-4">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span>表示件数:</span>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={perPage}
                onChange={e => setPerPage(Number(e.target.value))}
              >
                {perPageOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{currentPage}</span> / {totalPages} 全 {totalCount}件
            </div>
          </div>
        </div>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-4 text-center w-10 text-xs font-bold text-gray-700 whitespace-nowrap">
                <input type="checkbox" checked={isAllChecked} ref={el => { if (el) el.indeterminate = isIndeterminate; }} onChange={handleCheckAll} />
              </th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-24">クライアント番号</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-32">クライアント名</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-24">スタッフ番号</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap">スタッフ氏名</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-32">ステータス</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-20">契約形態</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-28">請求単価</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 flex items-center gap-1">
                キャリアシート更新情報
                <span className="relative group cursor-pointer">
                  <AiOutlineInfoCircle className="inline text-gray-400 hover:text-blue-500" size={18} />
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 text-sm rounded px-3 py-2 opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-pre-line shadow-lg transition-opacity duration-200 bg-gray-800 text-white">
                    未完了は、学歴、最寄駅、メインスキル、職務経歴を全て入力されていない状態です。
                  </span>
                </span>
              </th>
              <th className="px-2 py-4 text-center text-sm font-bold text-gray-700 whitespace-nowrap w-12">詳細</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {staffList.map((staff) => {
              const allDone = Object.values(staff.careerSheetStatus).every(Boolean);
              return (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-3 py-4 text-center w-10 text-sm">
                    <input type="checkbox" checked={selected.includes(staff.id)} onChange={() => handleCheck(staff.id)} />
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-24">{staff.client_number}</td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-32">{staff.client_name}</td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-24">{staff.staff_number}</td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-40">
                    <div className="font-bold">{staff.staff_name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{staff.staff_kana}</div>
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-32">
                    <span className={`inline-block border text-xs font-bold px-2 py-0.5 rounded-full ${getStatusColor(staff.status)}`}>
                      社員：{staff.status}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-20">{staff.contract_type}</td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-28">
                    {staff.unit_price.toLocaleString()}円
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    <div className="flex items-start gap-2">
                      {allDone ? (
                        <div className="flex flex-col items-start gap-1">
                          <span title={careerSheetTooltip(staff.careerSheetStatus)} className="inline-block border border-green-600 text-green-700 text-xs font-bold px-3 py-0.5 rounded-full">更新済</span>
                          <span className="text-xs text-gray-400">{staff.careerSheetUpdatedAt}</span>
                        </div>
                      ) : (
                        <span className="flex items-center gap-2 relative">
                          <span
                            onMouseEnter={() => setShowTooltip(staff.id)}
                            onMouseLeave={() => setShowTooltip(null)}
                            className="inline-block border border-yellow-500 text-yellow-700 text-xs font-bold px-3 py-0.5 rounded-full cursor-pointer"
                          >
                            未完了
                          </span>
                          {showTooltip === staff.id && (
                            <div className="absolute left-0 top-full mt-1 bg-gray-600 text-white border border-gray-400 shadow-md rounded-lg p-2 z-50 w-44 text-xs">
                              {careerSheetTooltip(staff.careerSheetStatus).split('\n').map((line, i) => (
                                <div key={i} className="mb-1">{line}</div>
                              ))}
                            </div>
                          )}
                        </span>
                      )}
                      <button 
                        className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-300 rounded hover:bg-blue-50 transition-colors"
                        onClick={() => window.open(`/mypage/staff/${staff.id}`, '_blank')}
                      >
                        マイページ
                      </button>
                    </div>
                  </td>
                  <td className="px-2 py-4 text-center w-12">
                    <button onClick={() => setDrawerStaff(staff)} className="text-blue-600 hover:text-blue-800">
                      <AiOutlineFileDone size={22} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* 下部コントロール */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* ページネーション（左下） */}
          <div className="flex items-center gap-1">
            <button className="px-2 py-0.5 rounded border text-xs text-gray-500">&lt;</button>
            {pageButtons.map((num, i) =>
              num === '...'
                ? <span key={`ellipsis-bottom-${i}`} className="px-1 text-xs text-gray-500">...</span>
                : <button key={`page-bottom-${num}-${i}`} className={`px-2 py-0.5 rounded border text-xs ${currentPage === num ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}>{num}</button>
            )}
            <button className="px-2 py-0.5 rounded border text-xs text-gray-500">&gt;</button>
          </div>
          {/* 表示件数セレクト＋件数情報（右下） */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <span>表示件数:</span>
              <select
                className="border rounded px-2 py-1 text-sm"
                value={perPage}
                onChange={e => setPerPage(Number(e.target.value))}
              >
                {perPageOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{currentPage}</span> / {totalPages} 全 {totalCount}件
            </div>
          </div>
        </div>
      </div>
      {/* Tailwindだけで作るリッチなドロワー＋オーバーレイ */}
      {/* オーバーレイ（フェードイン/アウト） */}
      <div
        className={`
          fixed inset-0 bg-black/30 z-40
          transition-opacity duration-500
          ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setDrawerStaff(null)}
      />
      {/* ドロワー本体（カスタムイージング＋ゆっくりスライド） */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-2xl z-50 ring-1 ring-black/10
          transition-transform duration-500 ease-[cubic-bezier(0.77,0,0.175,1)]
          ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ willChange: 'transform' }}
      >
        {drawerStaff && (
          <div className="flex flex-col h-full border-l border-gray-200 bg-white">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-bold">スタッフ詳細</h3>
              <button onClick={() => setDrawerStaff(null)} className="text-2xl text-gray-400 hover:text-gray-700">×</button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* 基本情報＋契約情報 */}
              <div className="border rounded-lg p-4 mb-2 grid grid-cols-1 md:grid-cols-3 gap-4 bg-white">
                <div>
                  <div className="text-gray-500 text-xs mb-1">氏名</div>
                  <div className="font-bold text-base">{drawerStaff.staff_name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{drawerStaff.staff_kana}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">スタッフ番号</div>
                  <div className="font-bold">{drawerStaff.staff_number}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">クライアント名</div>
                  <div className="font-bold">{drawerStaff.client_name}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">契約形態</div>
                  <div className="font-bold">{drawerStaff.contract_type}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs mb-1">請求単価</div>
                  <div className="font-bold">¥600,000/月</div>
                </div>
                {/* 学歴 */}
                <div className="col-span-full mt-4">
                  <div className="text-gray-500 text-xs mb-1">学歴</div>
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs">最終学歴</span>
                      <span className="ml-2 font-bold">大学卒</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs">学校名</span>
                      <span className="ml-2 font-bold">東京工業大学</span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs">学科</span>
                      <span className="ml-2 font-bold">情報工学科</span>
                    </div>
                  </div>
                </div>
                {/* 最寄駅 */}
                <div className="col-span-full mt-2">
                  <div className="text-gray-500 text-xs mb-1">最寄駅</div>
                  <div className="font-bold text-sm">東急目黒線 武蔵小山駅</div>
                </div>
              </div>
              {/* メインスキル */}
              <div className="border rounded-lg p-4 mb-2 bg-white">
                <div className="font-bold mb-2 text-sm">メインスキル</div>
                <div className="flex flex-wrap gap-6 text-sm">
                  <div>
                    <div className="text-gray-500 text-xs mb-1">職種（大）</div>
                    <div className="font-bold">IT</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">職種（中）</div>
                    <div className="font-bold">コンサルタント・アナリスト・プリセールス</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-xs mb-1">職種（小）</div>
                    <div className="font-bold">システムアナリスト</div>
                  </div>
                </div>
              </div>
              {/* その他スキル */}
              <div className="border rounded-lg p-4 bg-white">
                <div className="font-bold mb-2 text-sm">その他スキル</div>
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="py-1 text-gray-500 w-32">言語</td>
                      <td className="py-1 font-bold">JavaScript</td>
                      <td className="py-1 text-gray-500 w-24">経験年数</td>
                      <td className="py-1 font-bold">3年</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-500">フレームワーク</td>
                      <td className="py-1 font-bold">React</td>
                      <td className="py-1 text-gray-500">経験年数</td>
                      <td className="py-1 font-bold">2年</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-500">OS</td>
                      <td className="py-1 font-bold">Linux</td>
                      <td className="py-1 text-gray-500">経験年数</td>
                      <td className="py-1 font-bold">4年</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-500">DB</td>
                      <td className="py-1 font-bold">PostgreSQL</td>
                      <td className="py-1 text-gray-500">経験年数</td>
                      <td className="py-1 font-bold">2年</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-500">ミドルウェア</td>
                      <td className="py-1 font-bold">Nginx</td>
                      <td className="py-1 text-gray-500">経験年数</td>
                      <td className="py-1 font-bold">1年</td>
                    </tr>
                    <tr>
                      <td className="py-1 text-gray-500">クラウドサービス</td>
                      <td className="py-1 font-bold">AWS</td>
                      <td className="py-1 text-gray-500">経験年数</td>
                      <td className="py-1 font-bold">2年</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* キャリアシートPDFプレビュー＋DLボタン */}
              <div className="border rounded-lg p-4 bg-white mt-6">
                <div className="font-bold mb-2 text-sm">キャリアシート</div>
                {/* 本来はユーザーごとにファイル名・パスが変わります */}
                <iframe src="/R.H_2050.pdf" width="100%" height="400" className="border rounded mb-4" />
                <a href="/R.H_2050.pdf" download className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold rounded px-4 py-2 text-sm transition">
                  ダウンロード
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* キャリアシート更新依頼ダイアログ */}
      <Dialog open={mailDialogOpen} onClose={() => setMailDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full min-h-[500px] rounded-xl bg-white p-8">
            <Dialog.Title className="text-lg font-bold mb-4 flex items-center gap-2">
              <AiOutlineMail className="h-6 w-6 text-blue-500" />
              キャリアシート更新依頼
            </Dialog.Title>
            <div className="text-sm text-gray-600 mb-6">選択したスタッフにキャリアシート更新を依頼します。</div>
            {/* ラジオボタン */}
            <div className="flex gap-8 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="mailType" value="remind" checked={mailType === 'remind'} onChange={() => setMailType('remind')} />
                <span className="text-sm">未完了の催促</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="mailType" value="request" checked={mailType === 'request'} onChange={() => setMailType('request')} />
                <span className="text-sm">更新の依頼</span>
              </label>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-700 mb-1">メール件名</label>
              <input
                className="border rounded px-3 py-2 text-sm w-full"
                value={mailSubject}
                readOnly
              />
            </div>
            <div className="mb-6">
              <label className="block text-xs font-bold text-gray-700 mb-1">メール本文</label>
              <textarea
                className="border rounded px-3 py-2 text-sm w-full min-h-[200px]"
                value={mailBody}
                readOnly
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700"
                onClick={() => setMailDialogOpen(false)}
              >
                キャンセル
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white font-bold flex items-center gap-2 hover:bg-blue-700 text-sm"
                onClick={() => setMailDialogOpen(false)}
              >
                送信
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 