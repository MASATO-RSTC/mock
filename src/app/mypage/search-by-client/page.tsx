"use client";
import { useState } from "react";
import { Dialog } from "@headlessui/react";
import React from "react";
import Icon from '@mdi/react';
import { mdiCogs, mdiChevronDown, mdiChevronUp, mdiCircle, mdiCircleSlice8 } from '@mdi/js';

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

const ToggleSwitch = ({ checked, onChange, disabled = false }: { checked: boolean, onChange: () => void, disabled?: boolean }) => (
  <button
      type="button"
      className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
          disabled
              ? 'cursor-not-allowed bg-gray-200'
              : checked
              ? 'bg-blue-600'
              : 'bg-gray-300'
      }`}
      onClick={() => !disabled && onChange()}
      disabled={disabled}
  >
      <span
          className={`${
              checked ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
  </button>
);

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
    setStaffStates(prev => {
      const newStates = { ...prev };
      const current = newStates[staffId];
      const newValue = !current[key];

      // 承認をONにするのは、提出がONの場合のみ
      if (key === 'tc_approve' && newValue && !current.tc_submit) {
          return newStates;
      }

      const newState = { ...current, [key]: newValue };

      // 提出をOFFにするなら、承認もOFFにする
      if (key === 'tc_submit' && !newValue) {
          newState.tc_approve = false;
      }

      newStates[staffId] = newState;
      return newStates;
    });
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

  const getStatusColor = (tc_submit: boolean, tc_approve: boolean) => {
    if (tc_approve) return "text-green-500";
    if (tc_submit) return "text-yellow-500";
    return "text-gray-300";
  };
  
  const getStatusText = (tc_submit: boolean, tc_approve: boolean) => {
    if (tc_approve) return "承認済";
    if (tc_submit) return "提出済";
    return "未提出";
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
                  <td className="px-3 py-4 text-center">
                    <input type="checkbox" checked={selected.includes(client.id)} onChange={() => handleCheck(client.id)} />
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-800 whitespace-nowrap">{client.client_number}</td>
                  <td className="px-2 py-4 text-sm text-gray-800 whitespace-nowrap">{client.client_name}</td>
                  <td className="px-2 py-4 text-sm text-gray-800 whitespace-nowrap">
                    <button onClick={() => toggleAccordion(client.id)} className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                      <span>{client.staffs.length} 名</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${openClient === client.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </td>
                </tr>
                {openClient === client.id && (
                  <tr>
                    <td colSpan={4} className="p-0">
                      <div className="bg-gray-100 p-4">
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                          {/* 詳細ヘッダー */}
                          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 text-xs font-bold text-gray-600">
                              <div className="col-span-2">部署名</div>
                              <div className="col-span-2">業務</div>
                              <div className="col-span-3">契約期間</div>
                              <div className="col-span-2">スタッフ名</div>
                              <div className="col-span-1 text-center">TC提出</div>
                              <div className="col-span-1 text-center">TC承認</div>
                              <div className="col-span-1"></div>
                          </div>
                          {/* 詳細ボディ */}
                          <div className="divide-y divide-gray-200">
                            {client.staffs.map((staff) => {
                              const currentState = staffStates[staff.id];
                              return (
                                <div key={staff.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                                  <div className="col-span-2 text-sm">{staff.department}</div>
                                  <div className="col-span-2 text-sm">{staff.job}</div>
                                  <div className="col-span-3 text-sm">{staff.period}</div>
                                  <div className="col-span-2">
                                    <div className="font-semibold">{staff.staff_name}</div>
                                    <div className="text-xs text-gray-500">{staff.staff_number}</div>
                                  </div>
                                  <div className="col-span-1 flex justify-center">
                                    <ToggleSwitch checked={currentState.tc_submit} onChange={() => toggleSwitch(staff.id, "tc_submit")} />
                                  </div>
                                  <div className="col-span-1 flex justify-center">
                                    <ToggleSwitch checked={currentState.tc_approve} onChange={() => toggleSwitch(staff.id, "tc_approve")} disabled={!currentState.tc_submit} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={bulkDialogOpen} onClose={() => setBulkDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-8">
            <Dialog.Title className="text-xl font-bold">一括操作</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-600">
              チェックしたクライアントに所属するスタッフのTC設定を一括で変更します。
            </Dialog.Description>
            <div className="mt-6 space-y-4">
              <label className="flex items-center gap-4">
                <input type="checkbox" checked={bulkSubmit} onChange={e => setBulkSubmit(e.target.checked)} className="rounded" />
                <span>TC提出を有効にする</span>
              </label>
              <label className="flex items-center gap-4">
                <input type="checkbox" checked={bulkApprove} onChange={e => setBulkApprove(e.target.checked)} className="rounded" />
                <span>TC承認を有効にする</span>
              </label>
            </div>
            <div className="mt-8 flex justify-end gap-4">
              <button
                className="rounded px-6 py-2 text-sm font-bold text-gray-700 border hover:bg-gray-100"
                onClick={() => setBulkDialogOpen(false)}
              >
                キャンセル
              </button>
              <button
                className="rounded px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700"
                onClick={handleBulkChange}
              >
                変更を保存
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
} 