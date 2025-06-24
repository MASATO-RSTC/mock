"use client";
import { useState, Fragment } from 'react';
import Link from 'next/link';
import { mdiChevronLeft, mdiChevronRight, mdiClipboardTextClockOutline, mdiInformationOutline } from '@mdi/js';
import Icon from '@mdi/react';
import { Dialog, Transition } from '@headlessui/react';

const contractData = {
  "2025": {
    "6": [
      {
        id: "41525",
        status: "提出済",
        contractStartDate: "2025年04月01日",
        contractEndDate: "2025年06月30日",
        clientName: "日本車輌製造株式会社",
        departmentName: "鉄道車両本部 技術部 新幹線鉄道車体ｸﾞﾙｰﾌﾟ",
        submissionDate: "2025/06/25",
        closingDate: "06月30日",
        workPeriod: "2025年05月31日",
        workEndDate: "2025年06月30日"
      }
    ],
    "5": [
      {
        id: "41488",
        status: "提出済",
        contractStartDate: "2025年03月01日",
        contractEndDate: "2025年05月31日",
        clientName: "株式会社サンプル",
        departmentName: "開発部",
        submissionDate: "2025/05/28",
        closingDate: "05月31日",
        workPeriod: "2025年04月30日",
        workEndDate: "2025年05月31日"
      }
    ],
    "4": [
      {
        id: "41450",
        status: "提出済",
        contractStartDate: "2025年02月01日",
        contractEndDate: "2025年04月30日",
        clientName: "株式会社テック",
        departmentName: "エンジニアリング部",
        submissionDate: "2025/04/25",
        closingDate: "04月30日",
        workPeriod: "2025年03月31日",
        workEndDate: "2025年04月30日"
      }
    ],
    "3": [
      {
        id: "41401",
        status: "提出済",
        contractStartDate: "2025年01月01日",
        contractEndDate: "2025年03月31日",
        clientName: "株式会社テスト",
        departmentName: "IT部",
        submissionDate: "2025/03/26",
        closingDate: "03月31日",
        workPeriod: "2025年02月28日",
        workEndDate: "2025年03月31日"
      }
    ]
  }
};

type Contract = {
  id: string;
  status: string;
  contractStartDate: string;
  contractEndDate: string;
  clientName: string;
  departmentName: string;
  submissionDate: string;
  closingDate: string;
  workPeriod: string;
  workEndDate: string;
};

type ContractsByYear = {
  [year: string]: {
    [month: string]: Contract[];
  };
};

const getStatusChip = (status: string) => {
  let chipStyle = "border border-gray-400 text-gray-800";
  
  if (status === '-') {
    return <span>-</span>;
  }

  return (
    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${chipStyle}`}>
      {status}
    </span>
  );
};

export default function ClosingWorkPage() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  
  const months = Array.from({ length: 12 }, (_, i) => 12 - i)
    .filter(month => {
      if (currentYear < today.getFullYear()) return true;
      if (currentYear > today.getFullYear()) return false;
      return month <= currentMonth;
    });

  const contracts: ContractsByYear = contractData;

  function closeModal() {
    setIsModalOpen(false);
  }

  function openModal() {
    setIsModalOpen(true);
  }

  return (
    <>
      <div className="bg-white p-8 rounded-xl shadow-md relative">
        <div className="absolute top-8 right-8">
            <button 
              onClick={openModal}
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              <Icon path={mdiInformationOutline} size={0.8} />
              このページについて
            </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
          <Icon path={mdiClipboardTextClockOutline} size={1.2} />
          勤怠締め作業
        </h1>

        <p className="text-gray-600 mb-6">該当する契約を選択し、締め操作を行なってください</p>
        
        {/* 年セレクター */}
        <div className="flex justify-center items-center gap-6 mb-8">
          <button onClick={() => setCurrentYear(y => y - 1)} className="text-gray-500 hover:text-gray-800">
            <Icon path={mdiChevronLeft} size={1.5} />
          </button>
          <span className="text-3xl font-bold text-gray-800">{currentYear}年</span>
          <button onClick={() => setCurrentYear(y => y + 1)} className="text-gray-500 hover:text-gray-800">
            <Icon path={mdiChevronRight} size={1.5} />
          </button>
        </div>

        {/* 月別リスト */}
        <div className="space-y-4">
          {months.map(month => {
            const monthContracts = contracts[currentYear]?.[month] || [];
            return (
              <div key={month} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-2xl font-semibold">{month}月</h2>
                  {monthContracts.length === 0 && (
                    <div className="text-gray-500 text-sm">
                      「締め作業」を行う契約がございません。
                    </div>
                  )}
                </div>
                {monthContracts.length > 0 && (
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      {/* ヘッダー */}
                      <div className="grid grid-cols-12 gap-4 text-xs text-gray-500 mb-2 px-4">
                        <div className="col-span-1">受注No</div>
                        <div className="col-span-1">ステータス</div>
                        <div className="col-span-2">契約期間</div>
                        <div className="col-span-4">クライアント/部署名</div>
                        <div className="col-span-1">提出日</div>
                        <div className="col-span-1">締め日</div>
                        <div className="col-span-2"></div>
                      </div>
                      {/* データ */}
                      {monthContracts.map(contract => (
                        <Link href={`/mypage/closing/${contract.id}`} key={contract.id} className="grid grid-cols-12 gap-4 items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                          <div className="col-span-1 font-bold text-gray-800">{contract.id}</div>
                          <div className="col-span-1">{getStatusChip(contract.status)}</div>
                          <div className="col-span-2 text-sm text-gray-700">
                            {contract.contractStartDate}
                            <br />
                            {contract.contractEndDate}
                          </div>
                          <div className="col-span-4 text-sm text-gray-700">
                            <div className="font-semibold">{contract.clientName}</div>
                            <div>{contract.departmentName}</div>
                          </div>
                          <div className="col-span-1 text-gray-700">{contract.submissionDate}</div>
                          <div className="col-span-1 text-sm text-gray-700">
                            <div className="font-bold text-lg text-black">{contract.closingDate}</div>
                          </div>
                          <div className="col-span-2 text-xs text-gray-500">
                            <div>労務期間</div>
                            <div>{contract.workPeriod}</div>
                            <div>{contract.workEndDate}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold leading-6 text-gray-900 mb-4"
                  >
                    このページに表示される契約について
                  </Dialog.Title>
                  <div className="mt-2 space-y-4 text-sm text-gray-700">
                    <p>
                      このページには、締め期間が契約期間（派遣期間）に含まれる契約が表示されます。
                      同じ月に複数の契約が表示された場合は、以下のルールに沿ってファイルを提出してください。
                    </p>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex gap-2">
                        <span className="font-bold text-blue-600">・</span>
                        <div>
                          締め期間に該当する契約が複数存在する場合は、 受注No.が最も大きい契約で締め作業を行ってください。
                          <br />
                          <span className="text-xs text-gray-500">※同一クライアントの場合に限ります。</span>
                        </div>
                      </li>
                      <li className="flex gap-2">
                        <span className="font-bold text-blue-600">・</span>
                        <div>
                        同じ締め期間内で、配属先が異なる複数の契約がある場合は、すべての契約について締め作業を行ってください。
                        </div>
                      </li>
                    </ul>
                    <p className="text-xs text-gray-500">
                      ※ 休業中の方は契約が表示されません。締め作業の対応も不要です。
                      <br/>
                      ※ 配属先との契約があるにも関わらず表示されない場合は、お手数ですが <a href="mailto:support@ritsuan.com" className="text-blue-600 hover:underline">support@ritsuan.com</a> までご連絡ください。
                    </p>
                  </div>

                  <div className="mt-8 text-right">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      閉じる
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
} 