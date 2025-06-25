"use client";
import { useState, Fragment } from 'react';
import Icon from '@mdi/react';
import { mdiClipboardTextOutline, mdiHelpCircleOutline, mdiUpload, mdiPlus, mdiTrashCanOutline } from '@mdi/js';
import { Dialog, Transition } from '@headlessui/react';

export default function ClosingDetailClient() {
  const [isTimecardModalOpen, setIsTimecardModalOpen] = useState(false);
  const [isRelatedDocsModalOpen, setIsRelatedDocsModalOpen] = useState(false);
  const [relatedDocuments, setRelatedDocuments] = useState<{id: number}[]>([]);

  function openTimecardModal() { setIsTimecardModalOpen(true); }
  function closeTimecardModal() { setIsTimecardModalOpen(false); }
  
  function openRelatedDocsModal() { setIsRelatedDocsModalOpen(true); }
  function closeRelatedDocsModal() { setIsRelatedDocsModalOpen(false); }

  const addRelatedDocument = () => {
    setRelatedDocuments(docs => [...docs, { id: Date.now() }]);
  };

  const removeRelatedDocument = (id: number) => {
    setRelatedDocuments(docs => docs.filter(doc => doc.id !== id));
  };

  const mockData = {
    name: "リツアン 次郎",
    clientName: "ソフトバンク株式会社",
    contractStartDate: "2025年04月01日",
    contractEndDate: "2025年06月30日",
    workStartDate: "2025年05月31日",
    workEndDate: "2025年06月30日",
    orderId: "40959",
    departmentName: "業務委託",
    closing: "月末",
    closingDate: "2025年06月30日",
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Icon path={mdiClipboardTextOutline} size={1.2} />
        勤怠締め入力
      </h1>
      <p className="text-gray-600 -mt-6">締め操作を行なってください</p>

      {/* 基本情報 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-2">基本情報</h2>
        <div className="text-sm -mx-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 py-4 px-6 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-2 items-center">
              <dt className="text-gray-500 col-span-1">氏名</dt>
              <dd className="text-gray-800 col-span-2">{mockData.name}</dd>
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <dt className="text-gray-500 col-span-1">受注番号</dt>
              <dd className="text-gray-800 col-span-2">{mockData.orderId}</dd>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 py-4 px-6 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-2 items-center">
              <dt className="text-gray-500 col-span-1">クライアント名</dt>
              <dd className="text-gray-800 col-span-2">{mockData.clientName}</dd>
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <dt className="text-gray-500 col-span-1">部署名</dt>
              <dd className="text-gray-800 col-span-2">{mockData.departmentName}</dd>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 py-4 px-6 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-2 items-center">
              <dt className="text-gray-500 col-span-1">契約期間</dt>
              <dd className="text-gray-800 col-span-2">{mockData.contractStartDate} 〜 {mockData.contractEndDate}</dd>
            </div>
            <div className="grid grid-cols-3 gap-2 items-center">
              <dt className="text-gray-500 col-span-1">締め</dt>
              <dd className="text-gray-800 col-span-2">{mockData.closing} <br /> {mockData.closingDate}</dd>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 pt-4 px-6">
            <div className="grid grid-cols-3 gap-2 items-center">
              <dt className="text-gray-500 col-span-1">労務期間</dt>
              <dd className="text-gray-800 col-span-2">{mockData.workStartDate} 〜 {mockData.workEndDate}</dd>
            </div>
          </div>
        </div>
      </div>

      {/* タイムカード */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          タイムカード
          <button onClick={openTimecardModal} className="ml-2">
            <Icon path={mdiHelpCircleOutline} size={0.8} className="text-blue-500 hover:text-blue-700" />
          </button>
        </h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center">
          <Icon path={mdiUpload} size={2} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">アップロードするファイルをドロップ</p>
          <p className="text-gray-600">または<span className="text-blue-600 font-semibold">ここをクリックして選択</span></p>
          <p className="text-xs text-gray-400 mt-4">※ 複数ファイルの同時選択はできません</p>
          <p className="text-xs text-gray-400 mt-2">受付可能ファイル: pdf(推奨), jpg, png, xls, xlsx, heic, heif, webp, avif, gif</p>
          <p className="text-xs text-gray-400">ファイルサイズ: 10MB以下</p>
        </div>
      </div>

      {/* 関連書類提出 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          関連書類提出
          <button onClick={openRelatedDocsModal} className="ml-2">
            <Icon path={mdiHelpCircleOutline} size={0.8} className="text-blue-500 hover:text-blue-700" />
          </button>
        </h2>

        <div className="space-y-4">
          {relatedDocuments.map((doc) => (
            <div key={doc.id} className="grid grid-cols-12 gap-4 items-start border border-gray-200 p-4 rounded-lg">
              <fieldset className="col-span-3 pt-2">
                <legend className="sr-only">書類種別</legend>
                <div className="space-y-2 text-sm">
                  <div>
                    <input type="radio" id={`trip-${doc.id}`} name={`doc-type-${doc.id}`} value="trip" className="mr-2" defaultChecked/>
                    <label htmlFor={`trip-${doc.id}`}>出張関連</label>
                  </div>
                  <div>
                    <input type="radio" id={`transport-${doc.id}`} name={`doc-type-${doc.id}`} value="transport" className="mr-2" />
                    <label htmlFor={`transport-${doc.id}`}>交通費都度</label>
                  </div>
                  <div>
                    <input type="radio" id={`other-${doc.id}`} name={`doc-type-${doc.id}`} value="other" className="mr-2" />
                    <label htmlFor={`other-${doc.id}`}>その他</label>
                  </div>
                </div>
              </fieldset>
              
              <div className="col-span-8">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors">
                   <Icon path={mdiUpload} size={1.5} className="text-gray-400 mx-auto mb-2" />
                   <p className="text-xs text-gray-500">アップロードするファイルをドロップ</p>
                   <p className="text-xs text-gray-500">または<span className="text-blue-600 font-semibold">ここをクリックして選択</span></p>
                   <p className="text-xs text-gray-400 mt-2">※ 複数ファイルの同時選択はできません</p>
                   <p className="text-xs text-gray-400 mt-1">受付可能ファイル: pdf(推奨), jpg, png, xls, xlsm, xlsx, heic, heif, webp, avif, gif</p>
                   <p className="text-xs text-gray-400">ファイルサイズ: 10MB以下</p>
                </div>
              </div>

              <div className="col-span-1 flex justify-center pt-2">
                <button onClick={() => removeRelatedDocument(doc.id)} title="削除する">
                  <Icon path={mdiTrashCanOutline} size={1} className="text-gray-400 hover:text-red-600 transition-colors" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={addRelatedDocument}
          className="mt-4 flex items-center justify-center w-full border border-blue-500 rounded-lg py-3 text-sm text-blue-500 hover:bg-blue-50 font-semibold transition-colors"
        >
          <Icon path={mdiPlus} size={0.8} className="mr-2" />
          提出書類を追加
        </button>
      </div>
      
      <div className="text-right">
        <button className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors">
          この内容で勤怠情報を提出する
        </button>
      </div>

      {/* Timecard Info Modal */}
      <Transition appear show={isTimecardModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeTimecardModal}>
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 text-gray-900 mb-4"
                  >
                    タイムカードについて
                  </Dialog.Title>
                  <div className="mt-4 space-y-6 text-sm text-gray-700">
                    <p>
                      利用している勤怠(タイムカード)を、データ化できる場合はデータ化してアップロードをお願いします。
                    </p>
                    
                    <div className="bg-orange-100 border-l-4 border-orange-400 p-3 text-orange-800">
                      <p className="font-bold">アップロード可能なファイル形式: pdf(推奨), jpg, png, xls, xlsm, xlsx</p>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg">
                      <h4 className="font-bold text-gray-800 mb-3">提出対象者</h4>
                      <ul className="space-y-2 list-disc list-inside text-gray-600">
                        <li>タイムカードを業務管理部宛にメールで送付していた方。</li>
                        <li>タイムカードが物理的に手元にあり、PDFやExcel、写真撮影（一カ月単位の画面）を含むデータ化が可能な方。</li>
                        <li>EDI（例: e-staffingや客先勤怠システム）を利用しており、データで出力できる、または写真撮影（一カ月単位の画面）で提出できる方。</li>
                        <li>e-staffingをご利用中で、締日が月末締めかつ、PC版をご利用している方。e-staffingのデータ出力方法はマニュアルをご覧ください。</li>
                      </ul>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg">
                       <h4 className="font-bold text-gray-800 mb-3">対応が不要な方（業務管理部がアップロードします）</h4>
                       <ul className="space-y-2 list-disc list-inside text-gray-600">
                        <li>タイムカードが手元になく、外部に持ち出せないなど、クライアントの許可が得られない場合。</li>
                        <li>EDIを利用しており、データ出力や写真撮影（一カ月単位の画面）できないなどデータにすることが不可能な場合。</li>
                        <li className="text-red-600 font-semibold">業務管理部がアップロードを完了した際には、メールでお知らせします。</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-8 text-right">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeTimecardModal}
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

      {/* Related Docs Info Modal */}
      <Transition appear show={isRelatedDocsModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeRelatedDocsModal}>
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl font-bold leading-6 text-gray-900 mb-4"
                  >
                    関連書類について
                  </Dialog.Title>
                  <div className="mt-4 space-y-6 text-sm text-gray-700">
                    <p>
                      タイムカード以外の請求に関わる添付ファイルをアップロードお願いします。
                    </p>
                    
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="grid grid-cols-3 items-stretch">
                        <div className="font-bold bg-gray-50 p-3 flex items-center">出張関連</div>
                        <div className="p-3 col-span-2 border-l border-gray-200">出張申請書、旅費交通費・宿泊費の領収書</div>
                      </div>
                      <div className="grid grid-cols-3 items-stretch border-t border-gray-200">
                         <div className="font-bold bg-gray-50 p-3 flex items-center">交通費都度</div>
                         <div className="p-3 col-span-2 border-l border-gray-200">定額・日額契約以外の方で出社時交通費にかかった申請書</div>
                      </div>
                      <div className="grid grid-cols-3 items-stretch border-t border-gray-200">
                         <div className="font-bold bg-gray-50 p-3 flex items-center">その他</div>
                         <div className="p-3 col-span-2 border-l border-gray-200">上記に含まれない請求に関わる書類</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>※ 請求に関係のないファイルのアップロードしないでください。</p>
                      <p>※ TCと上記ファイルがまとまっている場合（1枚のPDFなど）、タイムカードへアップロードしてください。</p>
                    </div>
                  </div>

                  <div className="mt-8 text-right">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeRelatedDocsModal}
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
    </div>
  );
} 