"use client";
import Icon from '@mdi/react';
import { mdiPencil, mdiFilePdfBox, mdiPlus, mdiMagnifyPlus, mdiMagnifyMinus, mdiDownload, mdiDotsVertical } from '@mdi/js';
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

export default function AdminSkillsPage() {
  // SkillsPageの内容をそのまま流用
  // ...（itHistory, otherHistoryなども同様に流用）
  // 必要に応じて管理画面用のサイドメニューやレイアウトを追加してください
  return (
    <div className="space-y-6">
      {/* ここに管理画面用のサイドメニューやヘッダーを追加してもOK */}
      {/* SkillsPageの内容をここに展開 */}
    </div>
  );
} 