"use client";
import Icon from '@mdi/react';
import { mdiPencil, mdiFilePdfBox, mdiPlus, mdiChevronLeft, mdiMagnifyPlus, mdiMagnifyMinus, mdiDownload, mdiDotsVertical } from '@mdi/js';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

const TruncatedText = ({ text, maxLength = 40 }: { text: string, maxLength?: number }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const spanRef = useRef<HTMLSpanElement>(null);
  
  if (!text) return null;

  const oneLineText = text.replace(/\n/g, " ");
  const truncatedText = oneLineText.length > maxLength ? oneLineText.substring(0, maxLength) + '...' : oneLineText;
  
  const needsTooltip = text.includes('\n') || oneLineText.length > maxLength;

  const handleMouseEnter = () => {
    if (spanRef.current) {
      const rect = spanRef.current.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top,
        left: rect.left + rect.width / 2,
      });
    }
    setShowTooltip(true);
  };

  if (!needsTooltip) {
    return <span>{text}</span>;
  }
  
  let portalRoot = null;
  if(typeof window !== 'undefined') {
    portalRoot = document.getElementById('tooltip-root');
  }

  return (
    <>
      <span 
        ref={spanRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {truncatedText}
      </span>
      {showTooltip && portalRoot && createPortal(
        <div 
          className="fixed p-3 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-50"
          style={{ 
            top: tooltipPosition.top, 
            left: tooltipPosition.left,
            transform: 'translate(-50%, -110%)',
            minWidth: '300px',
            maxWidth: '500px'
          }}
        >
          <p className="whitespace-pre-line text-left">{text}</p>
        </div>,
        portalRoot
      )}
    </>
  );
};

const InfoCard = ({ title, children, editable = true, gridCols = 2 }: { title: string, children: React.ReactNode, editable?: boolean, gridCols?: number }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200">
    <div className="flex justify-between items-center p-3 border-b border-gray-200">
      <h3 className="font-bold text-gray-800 text-base">{title}</h3>
      {editable && (
        <button className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1">
          <Icon path={mdiPencil} size={0.8} /> 編集
        </button>
      )}
    </div>
    <div className={`p-4 grid grid-cols-${gridCols} gap-4`}>
      {children}
    </div>
  </div>
);

const SkillTag = ({ name, years }: { name: string, years: number }) => (
    <span className="bg-gray-100 text-gray-800 text-sm font-medium mr-2 mb-2 px-3 py-1 rounded-full">{name} ({years}年)</span>
);

const CareerHistoryTable = ({ title, histories, isOther = false }: { title: string, histories: any[], isOther?: boolean }) => (
  <div>
    <h4 className="font-semibold text-gray-700 mb-3 text-lg">{title}</h4>
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
                <tr>
                    <th className="p-3 text-left font-semibold text-gray-600">会社/部署</th>
                    <th className="p-3 text-left font-semibold text-gray-600">在籍期間</th>
                    <th className="p-3 text-left font-semibold text-gray-600">職種</th>
                    {isOther ? (
                        <>
                            <th className="p-3 text-left font-semibold text-gray-600">業務内容</th>
                            <th className="p-3 text-left font-semibold text-gray-600">使用ツール</th>
                        </>
                    ) : (
                        <>
                            <th className="p-3 text-left font-semibold text-gray-600">言語</th>
                            <th className="p-3 text-left font-semibold text-gray-600">フレームワーク</th>
                            <th className="p-3 text-left font-semibold text-gray-600">OS</th>
                            <th className="p-3 text-left font-semibold text-gray-600">DB</th>
                            <th className="p-3 text-left font-semibold text-gray-600">ミドルウェア</th>
                            <th className="p-3 text-left font-semibold text-gray-600">クラウド</th>
                            <th className="p-3 text-left font-semibold text-gray-600">工程</th>
                            <th className="p-3 text-left font-semibold text-gray-600">チーム人数・役割</th>
                            <th className="p-3 text-left font-semibold text-gray-600" style={{ minWidth: '300px' }}>業務内容</th>
                        </>
                    )}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
                {histories.map((h, i) => (
                    <tr key={i}>
                        <td className={`p-3 text-gray-700 ${!isOther ? 'whitespace-pre' : 'whitespace-pre-line'}`}>{h.company}<br/><span className="text-xs text-gray-500">{h.department}</span></td>
                        <td className={`p-3 text-gray-500 ${!isOther ? 'whitespace-pre' : 'whitespace-pre-line'}`}>{h.period}</td>
                        <td className={`p-3 text-gray-700 ${!isOther ? 'whitespace-pre' : 'whitespace-pre-line'}`}>{h.role}</td>
                        {isOther ? (
                            <>
                                <td className="p-3 text-gray-700 whitespace-pre-line"><TruncatedText text={h.description} /></td>
                                <td className="p-3 text-gray-700">{h.tools}</td>
                            </>
                        ) : (
                            <>
                                <td className="p-3 text-gray-700 whitespace-pre">{h.languages.join(', ')}</td>
                                <td className="p-3 text-gray-700 whitespace-pre">{h.frameworks.join(', ')}</td>
                                <td className="p-3 text-gray-700 whitespace-pre">{h.os.join(', ')}</td>
                                <td className="p-3 text-gray-700 whitespace-pre">{h.db.join(', ')}</td>
                                <td className="p-3 text-gray-700 whitespace-pre">{h.middleware.join(', ')}</td>
                                <td className="p-3 text-gray-700 whitespace-pre">{h.cloud.join(', ')}</td>
                                <td className="p-3 text-gray-700 whitespace-pre">{h.process}</td>
                                <td className="p-3 text-gray-700 whitespace-pre">{h.team}</td>
                                <td className="p-3 text-gray-700 whitespace-pre"><TruncatedText text={h.projectSummary} /></td>
                            </>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
  </div>
);

const PdfViewer = ({ pdfUrl, title }: { pdfUrl: string, title: string }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4">
            <div className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
                <Icon path={mdiFilePdfBox} size={1} className="text-red-500"/>
                <span>{title}</span>
            </div>
        </div>
        <div className="bg-gray-800 p-2 flex items-center justify-between text-white text-sm">
            <div className="flex items-center gap-4">
                <span className='ml-2'>{pageNumber} / {numPages || '-'}</span>
                <div className='flex items-center gap-1'>
                    <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-1 hover:bg-gray-700 rounded"><Icon path={mdiMagnifyMinus} size={0.8}/></button>
                    <select value={scale} onChange={e => setScale(parseFloat(e.target.value))} className="bg-gray-700 text-white text-xs p-1 rounded border border-gray-600">
                        <option value="0.5">50%</option>
                        <option value="0.75">75%</option>
                        <option value="1">100%</option>
                        <option value="1.25">125%</option>
                        <option value="1.5">150%</option>
                    </select>
                    <button onClick={() => setScale(s => Math.min(2.0, s + 0.1))} className="p-1 hover:bg-gray-700 rounded"><Icon path={mdiMagnifyPlus} size={0.8}/></button>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button className="p-1 hover:bg-gray-700 rounded"><Icon path={mdiDownload} size={0.8}/></button>
                <button className="p-1 hover:bg-gray-700 rounded"><Icon path={mdiDotsVertical} size={0.8}/></button>
            </div>
        </div>
        <div className="flex bg-gray-200">
            <div className="w-48 bg-gray-100 p-2 overflow-y-auto" style={{height: '800px'}}>
                {Array.from(new Array(numPages), (el, index) => (
                    <div key={`page_thumb_${index + 1}`} onClick={() => setPageNumber(index + 1)} className={`cursor-pointer border-2 ${pageNumber === index + 1 ? 'border-blue-500' : 'border-transparent'} mb-2`}>
                         <Document file={pdfUrl} >
                            <Page pageNumber={index + 1} width={150} renderTextLayer={false} renderAnnotationLayer={false}/>
                        </Document>
                    </div>
                ))}
            </div>
            <div className="flex-1 flex justify-center items-start p-4 overflow-auto" style={{height: '800px'}}>
                <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page pageNumber={pageNumber} scale={scale} />
                </Document>
            </div>
        </div>
    </div>
    )
};

export default function ApplicantSkillsPage() {
    const itHistory = [
        { company: '株式会社リツアンSTC', department: 'エンジニアリング事業部', period: '2024年01月01日\n〜\n2025年07月31日', role: 'SE (アプリケーション設計)', languages: ['Java'], frameworks: ['Spring', 'Struts2', 'Struts'], os: ['Linux', 'Windows'], db: ['Oracle'], middleware: ['nginx', 'Ansible', 'ApacheHadoop'], cloud: ['Force.com', 'AWS'],
          process: '要件定義,\n基本設計,\n詳細設計,\n実装・単体,\n結合テスト,\n総合テスト', team: '10名未満\nチームリーダー,\nサブリーダー', 
          projectSummary: `【プロジェクト概要】\n・Javaを用いたWebアプリケーションの新規開発および既存システムの改修・保守。\n【担当業務】\n・要件定義\n・基本設計\n・詳細設計\n・開発（Java, Spring）\n・単体テスト・結合テスト\n・総合テスト\n・チームリーダーとしての進捗管理\n・サブリーダーへのタスク指示\n【体制・連携・会議】\n・全体10名未満のチーム\n・毎日朝会での進捗共有\n・週1回の顧客との定例会議\n【工夫・成果】\n・複雑な業務ロジックを設計書に分かりやすく図式化し、開発効率を向上。\n・テスト自動化ツールを導入し、リグレッションテストの工数を50%削減。` },
        // ...（他のitHistoryデータも同様に追加）
    ];
    const otherHistory = [
        { company: '株式会社リツアンSTC', department: 'エンジニアリング事業部', period: '2020年04月01日\n〜\n2022年12月31日', role: '営業・セールス', 
          description: `【プロジェクト概要】\n・営業・セールス部門における品質保証活動。\n【担当業務】\n・デシジョンツリーリストテストの計画立案\n・テストケースの作成\n・テストの実行と記録\n・不具合の起票と管理\n・開発チームへのフィードバック\n・リリース判定会議への参加\n・ユーザーマニュアルのレビュー\n・QAプロセスの改善提案\n【体制・連携・会議】\n・QA担当として開発チームと連携。\n・週1回のQA定例会を主催。\n【工夫・成果】\n・テスト観点の抜け漏れを防ぐチェックリストを導入。\n・クリティカルな不具合の流出を未然に防ぎ、製品品質の向上に貢献。`, 
          tools: 'スプレッドシート, RPF' },
        // ...（他のotherHistoryデータも同様に追加）
    ];

    return (
      <div className="space-y-6">
        {/* ここにマイページ側のreturn内容を貼り付け */}
        <div className="p-6 space-y-6">
          <div className='flex justify-between items-start'>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">スキル情報</h1>
              <p className="text-sm text-gray-600 mt-2">
                最新の情報を反映するため、<br/>
                メインスキルとキャリアシート（職務経歴）の登録・更新にご協力をお願いいたします。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 grid grid-cols-1 gap-6">
              <InfoCard title="学歴">
                <div className='text-sm text-gray-700'><span className="font-semibold w-24 inline-block">最終学歴</span> 4年生大学卒業</div>
                <div className='text-sm text-gray-700'><span className="font-semibold w-24 inline-block">学校名</span> 〇〇大学</div>
                <div className='text-sm text-gray-700'><span className="font-semibold w-24 inline-block">学部学科</span> 情報学科</div>
                <div></div>
              </InfoCard>
              <InfoCard title="最寄駅" gridCols={1}>
                <div className='text-sm text-gray-700'><span className="font-semibold w-24 inline-block">最寄駅1</span> JR北上線 江釣子</div>
              </InfoCard>
            </div>
            <div className="grid grid-cols-1 gap-6">
              <InfoCard title="資格" gridCols={1}>
                   <div className='text-sm text-gray-700 flex justify-between'><span>自動車運転免許</span> <span className='text-gray-500'>仮運転免許</span></div>
                   <div className='text-sm text-gray-700 flex justify-between'><span>その他の資格1</span> <span className='text-gray-500'>hey 2025年01月</span></div>
              </InfoCard>
              <InfoCard title="語学力" gridCols={1}>
                <div className='text-sm text-gray-700 flex justify-between'>
                    <span>TOEIC (英語)</span>
                    <div>
                        <span className="font-bold">700点</span>
                        <span className='text-xs text-gray-500 ml-2'>2025年01月取得</span>
                    </div>
                </div>
                <div className='text-sm text-gray-700 flex justify-between'>
                    <span>TOEFL (卒業見込)</span>
                     <div>
                        <span className="font-bold">600点</span>
                        <span className='text-xs text-gray-500 ml-2'>2025年01月取得</span>
                    </div>
                </div>
              </InfoCard>
            </div>
          </div>
    
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center p-3 border-b border-gray-200">
                  <h3 className="font-bold text-gray-800 text-base">メインスキル</h3>
                  <button className="text-blue-500 hover:text-blue-700 text-sm flex items-center gap-1">
                      <Icon path={mdiPencil} size={0.8} /> 編集
                  </button>
              </div>
              <div className='p-4'>
                  <p className="text-xs text-gray-500 mb-4">登録された内容は、キャリアシートのヘッダーに「メインスキル」として自動反映されます。</p>
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-x-4 gap-y-2 text-sm">
                      <div className="font-semibold col-span-1 text-gray-600">職種</div>
                      <div className="col-span-5 text-gray-800">IT システム開発 (WEB・オープン・モバイル系) SE (アプリケーション設計)</div>
                      
                      <div className="font-semibold col-span-1 text-gray-600 pt-1">言語</div>
                      <div className="col-span-5 flex flex-wrap items-center">
                          <SkillTag name="Java" years={11}/>
                          <SkillTag name="JavaScript" years={11}/>
                          <SkillTag name="PHP" years={11}/>
                          <SkillTag name="Python" years={11}/>
                          <SkillTag name="GoogleAppsScript" years={5}/>
                      </div>

                      <div className="font-semibold col-span-1 text-gray-600 pt-1">OS</div>
                      <div className="col-span-5 flex flex-wrap items-center">
                          <SkillTag name="Linux" years={11}/>
                          <SkillTag name="Windows" years={11}/>
                      </div>
                      
                      <div className="font-semibold col-span-1 text-gray-600 pt-1">DB</div>
                      <div className="col-span-5 flex flex-wrap items-center">
                          <SkillTag name="MySQL" years={11}/>
                      </div>
                  </div>
              </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h2 className="text-xl font-bold mb-2 text-gray-800">職務経歴</h2>
              <p className="text-xs text-gray-500 mb-4">登録された内容がキャリアシートに経歴として反映されます。<br/>登録した経歴は期間（開始）が降順で表示され、キャリアシート（PDF）のエリアに自動でPDFに変換されます。</p>
              <div className="space-y-8">
                  <CareerHistoryTable title="IT" histories={itHistory}/>
                  <CareerHistoryTable title="その他" histories={otherHistory} isOther={true}/>
              </div>
              <div className="mt-6 text-center">
                  <button className="text-blue-600 hover:text-blue-800 font-bold py-2 px-4 rounded-lg border-2 border-blue-500 hover:bg-blue-50 transition-colors text-sm flex items-center gap-1 mx-auto">
                      <Icon path={mdiPlus} size={0.9}/>
                      職務経歴を追加する
                  </button>
              </div>
          </div>
    
          <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-800">キャリアシート (pdf)</h2>
              <PdfViewer pdfUrl="/R.H_2050.pdf" title="IT" />
              <PdfViewer pdfUrl="/R.H_2050（その他）.pdf" title="その他" />
          </div>

          <div className="text-center text-xs text-gray-500 py-8">
              © 2025 Ritsuan STC Co., Ltd. All Rights Reserved.
          </div>
        </div>
      </div>
    );
} 