"use client"
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import React from "react";

const clientList = [
  {
    id: 1,
    client_number: "808",
    client_name: "ARアドバンステクノロジ株式会社",
    staffs: [
      { id: 1, department: "NTシステム事業一部", job: "システム開発業務", period: "2025年06月01日 〜 2025年06月30日", staff_number: "2415", staff_name: "笠野 啓介", tc_submit: true, tc_approve: false },
    ],
  },
  {
    id: 2,
    client_number: "5",
    client_name: "CKD株式会社",
    staffs: [
      { id: 2, department: "開発部", job: "設計業務", period: "2025年06月01日 〜 2025年06月30日", staff_number: "2002", staff_name: "鈴木 一郎", tc_submit: false, tc_approve: true },
      { id: 3, department: "開発部", job: "設計業務", period: "2025年06月01日 〜 2025年06月30日", staff_number: "2003", staff_name: "高橋 次郎", tc_submit: true, tc_approve: true },
    ],
  },
  {
    id: 3,
    client_number: "101",
    client_name: "ソフトバンク株式会社",
    staffs: [
      { id: 4, department: "IT本部", job: "ネットワーク運用", period: "2025年06月01日 〜 2025年06月20日", staff_number: "3101", staff_name: "田中 三郎", tc_submit: true, tc_approve: true },
    ],
  },
  {
    id: 4,
    client_number: "102",
    client_name: "楽天グループ株式会社",
    staffs: [
      { id: 5, department: "開発部", job: "アプリ開発", period: "2025年06月01日 〜 2025年06月25日", staff_number: "3102", staff_name: "山本 四郎", tc_submit: false, tc_approve: false },
      { id: 6, department: "開発部", job: "アプリ開発", period: "2025年06月01日 〜 2025年06月25日", staff_number: "3103", staff_name: "中村 五郎", tc_submit: true, tc_approve: false },
    ],
  },
  {
    id: 5,
    client_number: "103",
    client_name: "トヨタ自動車株式会社",
    staffs: [
      { id: 7, department: "設計部", job: "車両設計", period: "2025年06月01日 〜 2025年06月30日", staff_number: "3104", staff_name: "小林 六郎", tc_submit: false, tc_approve: true },
    ],
  },
  {
    id: 6,
    client_number: "104",
    client_name: "パナソニック株式会社",
    staffs: [
      { id: 8, department: "システム部", job: "システム運用", period: "2025年06月01日 〜 2025年06月30日", staff_number: "3105", staff_name: "佐藤 花子", tc_submit: true, tc_approve: true },
    ],
  },
  {
    id: 7,
    client_number: "105",
    client_name: "日立製作所",
    staffs: [
      { id: 9, department: "開発部", job: "インフラ構築", period: "2025年06月01日 〜 2025年06月30日", staff_number: "3106", staff_name: "鈴木 一郎", tc_submit: false, tc_approve: false },
      { id: 10, department: "開発部", job: "インフラ構築", period: "2025年06月01日 〜 2025年06月30日", staff_number: "3107", staff_name: "高橋 次郎", tc_submit: true, tc_approve: true },
    ],
  },
  {
    id: 8,
    client_number: "106",
    client_name: "富士通株式会社",
    staffs: [
      { id: 11, department: "ITサービス部", job: "サーバ運用", period: "2025年06月01日 〜 2025年06月30日", staff_number: "3108", staff_name: "田中 三郎", tc_submit: true, tc_approve: false },
    ],
  },
  {
    id: 9,
    client_number: "107",
    client_name: "NECソリューションイノベータ株式会社",
    staffs: [
      { id: 12, department: "開発部", job: "アプリ開発", period: "2025年06月01日 〜 2025年06月30日", staff_number: "3109", staff_name: "山本 四郎", tc_submit: false, tc_approve: true },
    ],
  },
  {
    id: 10,
    client_number: "108",
    client_name: "三菱電機株式会社",
    staffs: [
      { id: 13, department: "設計部", job: "機械設計", period: "2025年06月01日 〜 2025年06月30日", staff_number: "3110", staff_name: "中村 五郎", tc_submit: true, tc_approve: false },
      { id: 14, department: "設計部", job: "機械設計", period: "2025年06月01日 〜 2025年06月30日", staff_number: "3111", staff_name: "小林 六郎", tc_submit: false, tc_approve: true },
    ],
  },
];

export default function TimecardSettings() {
  const [openClient, setOpenClient] = useState<number | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [staffStates, setStaffStates] = useState(() => {
    // 初期値は全スタッフのtc_submit, tc_approveを保持
    const state: Record<number, { tc_submit: boolean; tc_approve: boolean }> = {};
    clientList.forEach(client => {
      client.staffs.forEach(staff => {
        state[staff.id] = { tc_submit: staff.tc_submit, tc_approve: staff.tc_approve };
      });
    });
    return state;
  });
  const isAllChecked = selected.length === clientList.length;
  const isIndeterminate = selected.length > 0 && !isAllChecked;

  const handleCheckAll = () => {
    setSelected(isAllChecked ? [] : clientList.map((c) => c.id));
  };
  const handleCheck = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]);
  };
  const toggleAccordion = (id: number) => {
    setOpenClient(openClient === id ? null : id);
  };
  const toggleSwitch = (staffId: number, key: "tc_submit" | "tc_approve") => {
    setStaffStates(prev => ({
      ...prev,
      [staffId]: {
        ...prev[staffId],
        [key]: !prev[staffId][key],
      },
    }));
  };

  // ページング用モック
  const totalCount = 264;
  const perPageOptions = [10, 20, 50, 100];
  const [perPage, setPerPage] = useState(10);
  const totalPages = Math.ceil(totalCount / perPage);
  const currentPage = 1;

  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [bulkSubmit, setBulkSubmit] = useState(true);
  const [bulkApprove, setBulkApprove] = useState(true);

  const handleBulkChange = () => {
    // 選択されたクライアントのスタッフの状態を一括更新
    const newStaffStates = { ...staffStates };
    clientList.forEach(client => {
      if (selected.includes(client.id)) {
        client.staffs.forEach(staff => {
          newStaffStates[staff.id] = {
            tc_submit: bulkSubmit,
            tc_approve: bulkApprove
          };
        });
      }
    });
    setStaffStates(newStaffStates);
    setBulkDialogOpen(false);
  };

  return (
    <div className="space-y-8 p-8">
      {/* タイトル＋アイコン */}
      <div className="flex items-center gap-3 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-2xl font-bold text-gray-800">タイムカード設定</span>
      </div>
      {/* 検索フォーム */}
      <div className="bg-white rounded-xl shadow p-8 mb-4 border border-gray-200">
        <h2 className="text-xl font-bold mb-6">検索</h2>
        <form className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600 font-bold">クライアント番号</label>
            <input className="border rounded px-3 py-2 text-sm" placeholder="クライアント番号" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600 font-bold">クライアント名</label>
            <input className="border rounded px-3 py-2 text-sm" placeholder="クライアント名" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600 font-bold">スタッフ番号</label>
            <input className="border rounded px-3 py-2 text-sm" placeholder="スタッフ番号" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600 font-bold">スタッフ氏名</label>
            <input className="border rounded px-3 py-2 text-sm" placeholder="スタッフ氏名" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-600 font-bold">対象月</label>
            <select className="border rounded px-3 py-2 text-sm">
              {Array.from({length: 12}, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const y = date.getFullYear();
                const m = (date.getMonth() + 1).toString().padStart(2, '0');
                return <option key={`${y}-${m}`}>{`${y}年${m}月`}</option>;
              })}
            </select>
          </div>
        </form>
      </div>
      {/* 一覧テーブル */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
        <div className="px-6 pt-6 pb-2 flex items-center justify-between">
          <h2 className="text-xl font-bold mb-0">タイムカード設定一覧</h2>
          {/* 一括操作ボタン（タイトル右上） */}
          <button
            className="rounded-lg px-6 py-2 text-xs font-bold text-sky-600 hover:text-sky-700 border border-sky-300 hover:border-sky-400 transition-colors"
            onClick={() => setBulkDialogOpen(true)}
          >
            チェックした項目を一括操作
          </button>
        </div>
        {/* 上部コントロール */}
        <div className="flex items-center justify-between px-6 pb-2">
          {/* ページネーション（左上） */}
          <div className="flex items-center gap-1">
            <button className="px-2 py-0.5 rounded border text-xs text-gray-500">&lt;</button>
            {Array.from({ length: Math.min(10, totalPages) }, (_, i) => (
              <button key={`page-${i+1}`} className={`px-2 py-0.5 rounded border text-xs ${currentPage === i+1 ? 'bg-blue-600 text-white border-blue-600' : 'text-gray-700 border-gray-300 hover:bg-gray-100'}`}>{i+1}</button>
            ))}
            <span className="px-1 text-xs text-gray-500">...</span>
            <button className="px-2 py-0.5 rounded border text-xs">{totalPages-1}</button>
            <button className="px-2 py-0.5 rounded border text-xs">{totalPages}</button>
            <button className="px-2 py-0.5 rounded border text-xs text-gray-500">&gt;</button>
          </div>
          {/* 表示件数＋件数情報（右上） */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">表示件数:</span>
              <select className="border rounded px-2 py-1 text-xs" value={perPage} onChange={e => setPerPage(Number(e.target.value))}>
                {perPageOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}件</option>
                ))}
              </select>
            </div>
            <span className="text-xs text-gray-500">{currentPage} / {totalPages} 全 {totalCount}件</span>
          </div>
        </div>
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-4 text-center w-10 text-xs font-bold text-gray-700 whitespace-nowrap">
                <input type="checkbox" checked={isAllChecked} ref={el => { if (el) el.indeterminate = isIndeterminate; }} onChange={handleCheckAll} />
              </th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-24">クライアント番号</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-56">クライアント名</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-32">配属スタッフ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {clientList.map((client) => (
              <React.Fragment key={client.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-3 py-4 text-center w-10 text-sm">
                    <input type="checkbox" checked={selected.includes(client.id)} onChange={() => handleCheck(client.id)} />
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-24">{client.client_number}</td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-56">{client.client_name}</td>
                  <td className="px-2 py-4 text-sm text-blue-600 font-bold cursor-pointer w-32" onClick={() => toggleAccordion(client.id)}>
                    {client.staffs.length}人
                    <span className="inline-block align-middle ml-1">
                      {openClient === client.id ? (
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 12L10 8L14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                  </td>
                </tr>
                {openClient === client.id && (
                  <tr key={`staff-${client.id}`}>
                    <td colSpan={4} className="bg-gray-50 px-8 py-4">
                      <div className="rounded-xl border border-gray-200 bg-white p-4 mb-2">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-black font-bold border-b border-gray-300">
                              <th className="text-left py-1">部署名</th>
                              <th className="text-left py-1">業務</th>
                              <th className="text-left py-1">契約期間</th>
                              <th className="text-left py-1">スタッフ名</th>
                              <th className="text-left py-1">TC提出</th>
                              <th className="text-left py-1">TC承認</th>
                            </tr>
                          </thead>
                          <tbody>
                            {client.staffs.map(staff => (
                              <tr key={staff.id} className="border-b border-gray-200 last:border-b-0">
                                <td className="py-2 px-2 text-gray-500">{staff.department}</td>
                                <td className="py-2 px-2 text-gray-500">{staff.job}</td>
                                <td className="py-2 px-2 text-gray-500">{staff.period}</td>
                                <td className="py-2 px-2 text-black font-bold">
                                  {staff.staff_name}
                                  <span className="block text-xs text-gray-400 font-normal mt-0.5">{staff.staff_number}</span>
                                </td>
                                <td className="py-2 px-2">
                                  <button
                                    className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ${staffStates[staff.id]?.tc_submit ? 'bg-blue-500' : 'bg-gray-300'}`}
                                    onClick={() => toggleSwitch(staff.id, "tc_submit")}
                                    type="button"
                                  >
                                    <span
                                      className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${staffStates[staff.id]?.tc_submit ? 'translate-x-6' : ''}`}
                                    />
                                  </button>
                                </td>
                                <td className="py-2 px-2">
                                  <button
                                    className={`w-12 h-6 rounded-full flex items-center transition-colors duration-200 ${staffStates[staff.id]?.tc_approve ? 'bg-blue-500' : 'bg-gray-300'}`}
                                    onClick={() => toggleSwitch(staff.id, "tc_approve")}
                                    type="button"
                                  >
                                    <span
                                      className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${staffStates[staff.id]?.tc_approve ? 'translate-x-6' : ''}`}
                                    />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {/* 下部コントロール */}
        <div className="flex items-center justify-end px-6 py-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">表示件数:</span>
              <select className="border rounded px-2 py-1 text-xs" value={perPage} onChange={e => setPerPage(Number(e.target.value))}>
                {perPageOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}件</option>
                ))}
              </select>
            </div>
            <span className="text-xs text-gray-500">{currentPage} / {totalPages} 全 {totalCount}件</span>
          </div>
        </div>
      </div>
      {/* 一括操作ダイアログ */}
      <Dialog
        open={bulkDialogOpen}
        onClose={() => setBulkDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-xl w-full rounded-xl bg-white p-6">
            <Dialog.Title className="text-lg font-bold mb-2">一括変更</Dialog.Title>
            <div className="text-sm text-gray-600 mb-4">チェックを入れたスタッフの設定を一括で変更します</div>
            <div className="flex border rounded-lg overflow-hidden divide-x mb-6">
              {/* 提出 */}
              <div className="flex-1 flex flex-col items-center py-4 px-6">
                <div className="font-bold text-sm mb-2">提出</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">なし</span>
                  <button
                    className={`w-10 h-6 rounded-full flex items-center transition-colors duration-200 ${bulkSubmit ? 'bg-blue-500' : 'bg-gray-300'}`}
                    onClick={() => setBulkSubmit(!bulkSubmit)}
                    type="button"
                  >
                    <span
                      className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${bulkSubmit ? 'translate-x-4' : ''}`}
                    />
                  </button>
                  <span className="text-xs text-gray-500">あり</span>
                </div>
              </div>
              {/* 承認 */}
              <div className="flex-1 flex flex-col items-center py-4 px-6">
                <div className="font-bold text-sm mb-2">承認</div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">なし</span>
                  <button
                    className={`w-10 h-6 rounded-full flex items-center transition-colors duration-200 ${bulkApprove ? 'bg-blue-500' : 'bg-gray-300'}`}
                    onClick={() => setBulkApprove(!bulkApprove)}
                    type="button"
                  >
                    <span
                      className={`inline-block w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-200 ${bulkApprove ? 'translate-x-4' : ''}`}
                    />
                  </button>
                  <span className="text-xs text-gray-500">あり</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700"
                onClick={() => setBulkDialogOpen(false)}
              >
                キャンセル
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white font-bold flex items-center gap-2 hover:bg-blue-700 text-sm"
                onClick={handleBulkChange}
              >
                <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' /></svg>
                一括変更
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 