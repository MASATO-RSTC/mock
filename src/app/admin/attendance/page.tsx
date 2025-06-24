"use client";
import { mdiAccountPlus } from "@mdi/js";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineInfoCircle, AiOutlineFileDone, AiOutlineUser, AiOutlineIdcard, AiOutlineTeam, AiOutlineDollarCircle, AiOutlineStar, AiOutlineMail } from "react-icons/ai";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

// モックデータ
interface Staff {
  id: number;
  order_number: number;
  client_number: string;
  client_name: string;
  staff_number: string;
  staff_name: string;
  staff_kana: string;
  contract_type: string;
  unit_price: number;
  period_from: string;
  period_to: string;
  careerSheetStatus: {
    gakureki: boolean;
    station: boolean;
    skill: boolean;
    job: boolean;
  };
  careerSheetUpdatedAt: string;
  submissionType: 'approval_required' | 'mypage' | 'admin';
  tcStatus: 'submitted' | 'not_submitted';
  hasDocuments: boolean;
  contactInfo?: {
    type: 'reminder' | 'contact';
    user: string;
    date: string;
    time: string;
  };
}
const staffList: Staff[] = [
  {
    id: 1,
    order_number: 4001,
    client_number: "102",
    client_name: "ヤマハ発動機株式会社 マリン事業本部",
    staff_number: "1538",
    staff_name: "奈良崎 慎一",
    staff_kana: "ナラサキ シンイチ",
    contract_type: "時給",
    unit_price: 4300,
    period_from: "2025年04月01日",
    period_to: "2025年09月30日",
    careerSheetStatus: { gakureki: true, station: true, skill: true, job: true },
    careerSheetUpdatedAt: "2024/05/01 10:00",
    submissionType: 'approval_required',
    tcStatus: 'submitted',
    hasDocuments: true,
    contactInfo: {
      type: 'reminder',
      user: '管理者 太郎',
      date: '05/22',
      time: '15:52'
    }
  },
  {
    id: 2,
    order_number: 4002,
    client_number: "102",
    client_name: "ヤマハ発動機株式会社 マリン事業本部",
    staff_number: "1627",
    staff_name: "片瀬 博也",
    staff_kana: "カタセ ヒロヤ",
    contract_type: "時給",
    unit_price: 5200,
    period_from: "2025年05月01日",
    period_to: "2025年10月31日",
    careerSheetStatus: { gakureki: true, station: false, skill: true, job: false },
    careerSheetUpdatedAt: "2024/04/15 09:30",
    submissionType: 'mypage',
    tcStatus: 'submitted',
    hasDocuments: false,
    contactInfo: {
      type: 'contact',
      user: '管理者 次郎',
      date: '05/22',
      time: '15:52'
    }
  },
  {
    id: 3,
    order_number: 4003,
    client_number: "102",
    client_name: "ヤマハ発動機株式会社 マリン事業本部",
    staff_number: "1994",
    staff_name: "石田 貴大",
    staff_kana: "イシダ タカヒロ",
    contract_type: "時給",
    unit_price: 8000,
    period_from: "2025年03月01日",
    period_to: "2025年08月31日",
    careerSheetStatus: { gakureki: true, station: true, skill: false, job: true },
    careerSheetUpdatedAt: "2024/03/20 15:20",
    submissionType: 'admin',
    tcStatus: 'not_submitted',
    hasDocuments: false,
  },
  {
    id: 4,
    order_number: 4004,
    client_number: "103",
    client_name: "株式会社テストシステム",
    staff_number: "2001",
    staff_name: "佐藤 花子",
    staff_kana: "サトウ ハナコ",
    contract_type: "月給",
    unit_price: 700000,
    period_from: "2025年02月01日",
    period_to: "2025年07月31日",
    careerSheetStatus: { gakureki: true, station: true, skill: true, job: true },
    careerSheetUpdatedAt: "2024/05/10 11:00",
    submissionType: 'approval_required',
    tcStatus: 'submitted',
    hasDocuments: true,
  },
  {
    id: 5,
    order_number: 4005,
    client_number: "104",
    client_name: "株式会社サンプル",
    staff_number: "2002",
    staff_name: "鈴木 一郎",
    staff_kana: "スズキ イチロウ",
    contract_type: "時給",
    unit_price: 3000,
    period_from: "2025年01月01日",
    period_to: "2025年06月30日",
    careerSheetStatus: { gakureki: false, station: false, skill: false, job: false },
    careerSheetUpdatedAt: "",
    submissionType: 'mypage',
    tcStatus: 'not_submitted',
    hasDocuments: false,
  },
  {
    id: 6,
    order_number: 4006,
    client_number: "105",
    client_name: "株式会社デモ",
    staff_number: "2003",
    staff_name: "高橋 次郎",
    staff_kana: "タカハシ ジロウ",
    contract_type: "月給",
    unit_price: 900000,
    period_from: "2025年07月01日",
    period_to: "2025年12月31日",
    careerSheetStatus: { gakureki: true, station: true, skill: true, job: false },
    careerSheetUpdatedAt: "2024/03/30 13:10",
    submissionType: 'admin',
    tcStatus: 'submitted',
    hasDocuments: true,
  },
  {
    id: 7,
    order_number: 4007,
    client_number: "106",
    client_name: "株式会社サンプル2",
    staff_number: "2004",
    staff_name: "田中 三郎",
    staff_kana: "タナカ サブロウ",
    contract_type: "時給",
    unit_price: 6700,
    period_from: "2025年08月01日",
    period_to: "2026年01月31日",
    careerSheetStatus: { gakureki: true, station: false, skill: true, job: true },
    careerSheetUpdatedAt: "2024/05/05 08:45",
    submissionType: 'approval_required',
    tcStatus: 'submitted',
    hasDocuments: false,
  },
  {
    id: 8,
    order_number: 4008,
    client_number: "107",
    client_name: "株式会社テスト2",
    staff_number: "2005",
    staff_name: "山本 四郎",
    staff_kana: "ヤマモト シロウ",
    contract_type: "月給",
    unit_price: 600000,
    period_from: "2025年09月01日",
    period_to: "2026年02月28日",
    careerSheetStatus: { gakureki: true, station: true, skill: true, job: true },
    careerSheetUpdatedAt: "2024/04/18 17:00",
    submissionType: 'mypage',
    tcStatus: 'not_submitted',
    hasDocuments: false,
  },
  {
    id: 9,
    order_number: 4009,
    client_number: "108",
    client_name: "株式会社デモ2",
    staff_number: "2006",
    staff_name: "中村 五郎",
    staff_kana: "ナカムラ ゴロウ",
    contract_type: "時給",
    unit_price: 3900,
    period_from: "2025年10月01日",
    period_to: "2026年03月31日",
    careerSheetStatus: { gakureki: false, station: true, skill: false, job: false },
    careerSheetUpdatedAt: "",
    submissionType: 'admin',
    tcStatus: 'submitted',
    hasDocuments: true,
  },
  {
    id: 10,
    order_number: 4010,
    client_number: "109",
    client_name: "株式会社サンプル3",
    staff_number: "2007",
    staff_name: "小林 六郎",
    staff_kana: "コバヤシ ロクロウ",
    contract_type: "月給",
    unit_price: 800000,
    period_from: "2025年11月01日",
    period_to: "2026年04月30日",
    careerSheetStatus: { gakureki: true, station: true, skill: true, job: true },
    careerSheetUpdatedAt: "2024/05/12 14:30",
    submissionType: 'approval_required',
    tcStatus: 'submitted',
    hasDocuments: true,
  },
];

const totalCount = 1034;
const perPageOptions = [10, 20, 50, 100];
const totalPages = 52;
const currentPage = 1;

const careerSheetTooltip = (status: any) => {
  return `学歴: ${status.gakureki ? 'OK' : '未'}\n最寄駅: ${status.station ? 'OK' : '未'}\nメインスキル: ${status.skill ? 'OK' : '未'}\n職務経歴: ${status.job ? 'OK' : '未'}`;
};

export default function AttendancePage() {
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

  const [form, setForm] = useState({
    clientNumber: '',
    clientName: '',
    staffNumber: '',
    staffName: '',
    orderNumber: '',
    targetMonth: '2025年6月',
    closingDay: '指定なし',
    contractType: '指定なし',
    tcStatus: '指定なし',
    docStatus: '指定なし',
    tcSubmitType: '指定なし',
    tcApproveType: '指定なし',
  });
  const handleClear = () => {
    setForm({
      clientNumber: '',
      clientName: '',
      staffNumber: '',
      staffName: '',
      orderNumber: '',
      targetMonth: '2025年6月',
      closingDay: '指定なし',
      contractType: '指定なし',
      tcStatus: '指定なし',
      docStatus: '指定なし',
      tcSubmitType: '指定なし',
      tcApproveType: '指定なし',
    });
  };

  return (
    <div className="space-y-8">
      {/* タイトル＋アイコン */}
      <div className="flex items-center gap-3 mb-2">
        <AiOutlineFileDone className="h-7 w-7 text-black" />
        <span className="text-2xl font-bold text-gray-800">勤怠一覧</span>
      </div>
      {/* 検索フォーム */}
      <div className="bg-white rounded-xl shadow p-8 mb-4 border border-gray-200">
        <div className="mb-6">
          <h2 className="text-xl font-bold">検索</h2>
        </div>
        <form>
          {/* 1段目: 6項目 */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
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
              <label className="text-base font-bold text-gray-700 whitespace-nowrap">受注番号</label>
              <input className="border rounded px-3 py-2 text-sm" placeholder="受注番号" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-bold text-gray-700 whitespace-nowrap">対象月</label>
              <select className="border rounded px-3 py-2 text-sm">
                <option>2025年6月</option>
                <option>2025年5月</option>
                <option>2025年4月</option>
                <option>2025年3月</option>
                <option>2025年2月</option>
                <option>2025年1月</option>
                <option>2024年12月</option>
                <option>2024年11月</option>
              </select>
            </div>
          </div>
          {/* 2段目: 6項目 */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4">
            <div className="flex flex-col gap-1">
              <label className="text-base font-bold text-gray-700 whitespace-nowrap">締め日</label>
              <select className="border rounded px-3 py-2 text-sm">
                <option>指定なし</option>
                <option>10日</option>
                <option>15日</option>
                <option>20日</option>
                <option>25日</option>
                <option>月末</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-bold text-gray-700 whitespace-nowrap">契約形態</label>
              <select className="border rounded px-3 py-2 text-sm">
                <option>指定なし</option>
                <option>時給</option>
                <option>月給</option>
                <option>月給時間制</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-bold text-gray-700 whitespace-nowrap">TC提出状態</label>
              <select className="border rounded px-3 py-2 text-sm">
                <option>指定なし</option>
                <option>提出済</option>
                <option>未提出</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-bold text-gray-700 whitespace-nowrap">関連書類提出状態</label>
              <select className="border rounded px-3 py-2 text-sm">
                <option>指定なし</option>
                <option>提出済</option>
                <option>未提出</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-bold text-gray-700 whitespace-nowrap">TC提出区分</label>
              <select className="border rounded px-3 py-2 text-sm">
                <option>指定なし</option>
                <option>提出必要</option>
                <option>提出不要</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-base font-bold text-gray-700 whitespace-nowrap">TC承認区分</label>
              <select className="border rounded px-3 py-2 text-sm">
                <option>指定なし</option>
                <option>承認必要</option>
                <option>承認不要</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <button type="button" className="bg-gray-200 text-gray-700 rounded px-6 py-2 text-sm font-semibold shadow hover:bg-gray-300 transition" onClick={handleClear}>検索条件をクリア</button>
            <button type="submit" className="bg-blue-600 text-white rounded px-6 py-2 text-sm font-semibold shadow hover:bg-blue-700 transition">検索</button>
          </div>
        </form>
      </div>
      {/* 一覧テーブル */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold mb-0">勤怠提出状況一覧</h2>
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
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-24">受注No</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-24">ステータス</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-32">連絡日時</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-32">クライアント</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-32">スタッフ</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-32">契約期間</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-20">締め日</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-20">契約形態</th>
              <th className="px-2 py-4 text-center text-sm font-bold text-gray-700 whitespace-nowrap w-12">詳細</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {staffList.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50">
                <td className="px-3 py-4 text-center w-10 text-sm">
                  <input type="checkbox" checked={selected.includes(staff.id)} onChange={() => handleCheck(staff.id)} />
                </td>
                <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-24">
                  <div className="flex flex-col items-center">
                    <a href={`/admin/attendance/${staff.order_number}`} className="text-blue-600 hover:text-blue-800">{staff.order_number}</a>
                    {staff.submissionType === 'approval_required' && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded-full border border-orange-500 text-orange-500 leading-none">承認必須</span>
                    )}
                    {staff.submissionType === 'mypage' && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded-full border border-gray-400 text-gray-500 leading-none">マイページから提出</span>
                    )}
                    {staff.submissionType === 'admin' && (
                      <span className="text-[11px] px-1.5 py-0.5 rounded-full border border-gray-400 bg-gray-100 text-gray-500 leading-none">業務管理から提出</span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-24">
                  <div className="flex flex-col items-center">
                    {staff.tcStatus === 'submitted' ? (
                      <>
                        <span className="text-[11px] px-1.5 py-0.5 rounded-full border border-green-500 bg-green-100 text-green-700 leading-none">TC提出済み</span>
                        {staff.hasDocuments && (
                          <span className="text-[11px] px-1.5 py-0.5 rounded-full border border-gray-400 bg-gray-100 text-gray-500 leading-none mt-1">関連書類あり</span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400">TC未提出</span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-32">
                  {staff.contactInfo ? (
                    <div className="text-gray-500">
                      {staff.contactInfo.type === 'reminder' ? '催促' : '連絡'} ({staff.contactInfo.user})<br />
                      {staff.contactInfo.date} {staff.contactInfo.time}
                    </div>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-32">{staff.client_name}</td>
                <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-32">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-gray-500">{staff.staff_number}</span>
                    <span>{staff.staff_name}</span>
                  </div>
                </td>
                <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-32">
                  <span>{staff.period_from}</span><br />
                  <span className="block text-center text-gray-400 text-xs">▼</span>
                  <span>{staff.period_to}</span>
                </td>
                <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-20">月末</td>
                <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-20">{staff.contract_type}</td>
                <td className="px-2 py-4 text-center w-12">
                  <button onClick={() => setDrawerStaff(staff)} className="text-blue-600 hover:text-blue-800">
                    <AiOutlineFileDone size={22} />
                  </button>
                </td>
              </tr>
            ))}
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
              <h3 className="text-lg font-bold">ファイルアップロード</h3>
              <button onClick={() => setDrawerStaff(null)} className="text-2xl text-gray-400 hover:text-gray-700">×</button>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* 上部情報 */}
              <div className="border-b border-gray-400 pb-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                  <div className="flex flex-col mb-2">
                    <span className="text-xs text-black font-bold">氏名</span>
                    <span className="text-gray-600">{drawerStaff.staff_name}</span>
                  </div>
                  <div className="flex flex-col mb-2">
                    <span className="text-xs text-black font-bold">受注番号</span>
                    <span className="text-gray-600">{drawerStaff.order_number}</span>
                  </div>
                  <div className="flex flex-col mb-2 md:col-span-2">
                    <span className="text-xs text-black font-bold">クライアント名</span>
                    <span className="text-gray-600">{drawerStaff.client_name}</span>
                  </div>
                  <div className="flex flex-col mb-2">
                    <span className="text-xs text-black font-bold">契約期間</span>
                    <span className="text-gray-600">{drawerStaff.period_from} ~ {drawerStaff.period_to}</span>
                  </div>
                  <div className="flex flex-col mb-2">
                    <span className="text-xs text-black font-bold">締め</span>
                    <span className="text-gray-600">2025年05月15日</span>
                  </div>
                </div>
              </div>
              {/* タイムカード アップロード */}
              <div className="mb-6">
                <div className="font-bold text-sm mb-2">タイムカード</div>
                <div className="border-2 border-dotted border-gray-300 rounded-lg p-8 flex flex-col items-center bg-gray-50">
                  <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4v-4m0 0l-2-2m2 2l2-2" /></svg>
                  <div className="text-gray-500 text-sm mb-2">アップロードするファイルをドロップ<br />または<span className="text-blue-600 underline cursor-pointer">ここをクリック</span>して選択</div>
                  <div className="text-xs text-gray-400 mb-1">※複数ファイルの同時選択はできません</div>
                  <div className="text-xs text-gray-400">受付可能ファイル: pdf(推奨), jpg, png, xls, xlsm, xlsx, heic, heif, webp, avif, gif</div>
                  <div className="text-xs text-gray-400">ファイルサイズ: 10MB以下</div>
                </div>
              </div>
              <hr className="my-6 border-gray-400" />
              {/* 関連書類 アップロード */}
              <div className="mb-6">
                <div className="font-bold text-sm mb-2">関連書類提出</div>
                <div className="border-2 border-dotted border-gray-300 rounded-lg p-8 flex flex-col items-center bg-gray-50">
                  <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 4v-4m0 0l-2-2m2 2l2-2" /></svg>
                  <div className="text-gray-500 text-sm mb-2">アップロードするファイルをドロップ<br />または<span className="text-blue-600 underline cursor-pointer">ここをクリック</span>して選択</div>
                  <div className="text-xs text-gray-400 mb-1">※複数ファイルの同時選択はできません</div>
                  <div className="text-xs text-gray-400">受付可能ファイル: pdf(推奨), jpg, png, xls, xlsm, xlsx, heic, heif, webp, avif, gif</div>
                  <div className="text-xs text-gray-400">ファイルサイズ: 10MB以下</div>
                </div>
              </div>
              <hr className="my-6 border-gray-400" />
              {/* ＋提出書類を追加ボタン */}
              <div className="flex justify-center mb-6">
                <button className="border border-blue-300 text-blue-600 bg-white rounded px-4 py-2 font-bold text-sm hover:bg-blue-50 transition flex items-center gap-1">
                  ＋提出書類を追加
                </button>
              </div>
              <hr className="my-6 border-gray-400" />
              {/* 一番下に追加の勤怠情報を提出するボタン */}
              <div className="flex justify-center mt-4">
                <button className="bg-blue-50 border border-blue-300 text-blue-700 rounded px-6 py-3 font-bold text-base hover:bg-blue-100 transition w-full max-w-xs">
                  追加の勤怠情報を提出する
                </button>
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