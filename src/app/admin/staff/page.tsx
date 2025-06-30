"use client";
import { mdiAccountPlus } from "@mdi/js";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineInfoCircle, AiOutlineFileDone, AiOutlineUser, AiOutlineIdcard, AiOutlineTeam, AiOutlineDollarCircle, AiOutlineStar, AiOutlineMail } from "react-icons/ai";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Icon from '@mdi/react';
import { mdiPencil, mdiFilePdfBox, mdiPlus, mdiChevronLeft, mdiMagnifyPlus, mdiMagnifyMinus, mdiDownload, mdiDotsVertical, mdiClose } from '@mdi/js';
import Image from 'next/image';
import { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { jobCategories, JobCategory } from "@/data/jobCategories";
import { itLanguages, itFrameworks, itOS, itDB, itMiddleware, itCloudServices } from "@/data/itSkillOptions";
import { kidenCadToolsLanguages, kidenIndustries } from "@/data/kidenSkillOptions";
import { kenchikuTools, kenchikuExperience } from "@/data/kenchikuSkillOptions";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.mjs`;

// 雇用形態のオプション
const employmentTypes = [
  "派遣社員（製造）",
  "派遣社員（販売/事務）",
  "派遣社員（技能）",
  "派遣社員（技術/プロ契）",
  "派遣社員（技術/時給）",
  "派遣社員（技術/月給）"
];

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

// モックデータ
const staffList = [
  {
    id: 1,
    client_number: "102",
    client_name: "ヤマハ発動機株式会社 マリン事業本部",
    staff_number: "1538",
    staff_name: "奈良崎 慎一",
    staff_kana: "ナラサキ シンイチ",
    employment_type: "派遣社員（技術/時給）",
    contract_type: "時給",
    unit_price: 4300,
    sales_person: "川村 駿介",
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
    employment_type: "派遣社員（技術/時給）",
    contract_type: "時給",
    unit_price: 5200,
    sales_person: "岩崎 泰成",
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
    employment_type: "派遣社員（技術/月給）",
    contract_type: "時給",
    unit_price: 8000,
    sales_person: "藤田 悠真",
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
    employment_type: "派遣社員（技術/月給）",
    contract_type: "月給",
    unit_price: 700000,
    sales_person: "久髙 陽子",
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
    employment_type: "派遣社員（製造）",
    contract_type: "時給",
    unit_price: 3000,
    sales_person: "久高 将真",
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
    employment_type: "派遣社員（技術/プロ契）",
    contract_type: "月給",
    unit_price: 900000,
    sales_person: "鈴木 祥",
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
    employment_type: "派遣社員（販売/事務）",
    contract_type: "時給",
    unit_price: 6700,
    sales_person: "川村 駿介",
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
    employment_type: "派遣社員（技能）",
    contract_type: "-",
    unit_price: 0,
    sales_person: "岩崎 泰成",
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
    employment_type: "派遣社員（技術/時給）",
    contract_type: "時給",
    unit_price: 3900,
    sales_person: "藤田 悠真",
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
    employment_type: "派遣社員（技術/月給）",
    contract_type: "月給",
    unit_price: 800000,
    sales_person: "久髙 陽子",
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

const itHistory = [
  { company: '株式会社リツアンSTC', department: 'エンジニアリング事業部', period: '2024年01月01日\n〜\n2025年07月31日', role: 'SE (アプリケーション設計)', languages: ['Java'], frameworks: ['Spring', 'Struts2', 'Struts'], os: ['Linux', 'Windows'], db: ['Oracle'], middleware: ['nginx', 'Ansible', 'ApacheHadoop'], cloud: ['Force.com', 'AWS'],
    process: '要件定義,\n基本設計,\n詳細設計,\n実装・単体,\n結合テスト,\n総合テスト', team: '10名未満\nチームリーダー,\nサブリーダー', 
    projectSummary: `【プロジェクト概要】
・Javaを用いたWebアプリケーションの新規開発および既存システムの改修・保守。
【担当業務】
・要件定義
・基本設計
・詳細設計
・開発（Java, Spring）
・単体テスト・結合テスト
・総合テスト
・チームリーダーとしての進捗管理
・サブリーダーへのタスク指示
【体制・連携・会議】
・全体10名未満のチーム
・毎日朝会での進捗共有
・週1回の顧客との定例会議
【工夫・成果】
・複雑な業務ロジックを設計書に分かりやすく図式化し、開発効率を向上。
・テスト自動化ツールを導入し、リグレッションテストの工数を50%削減。` },
  { company: '株式会社リツアンSTC', department: 'エンジニアリング事業部', period: '2023年03月01日\n〜\n2024年03月31日', role: 'プログラマー', languages: ['GoogleAppsScript', 'Java'], frameworks: ['Spring'], os: ['MacOS', 'Linux'], db: ['DB2', 'Oracle'], middleware: ['Apache', 'ストレージ関連', 'Docker'], cloud: ['AWS'],
    process: '要件定義,\n基本設計,\n詳細設計,\n実装・単体,\n結合テスト,\n総合テスト', team: '10名未満\nチームリーダー', 
    projectSummary: `【プロジェクト概要】
・部署内の業務効率化を目的としたGoogle Apps Script (GAS)ツールの開発。
【担当業務】
・業務内容のヒアリング
・ツール仕様の策定
・GASでのプログラミング
・スプレッドシートとの連携機能実装
・Gmail自動送信機能実装
・利用者へのレクチャー
・マニュアル作成
・保守・運用
【体制・連携・会議】
・チームリーダーとして単独で開発を担当。
・利用部門と週次でレビュー会議を実施。
【工夫・成果】
・これまで手動で行っていたECサイトの在庫確認と報告業務を自動化。
・月次レポート作成にかかる時間を80%削減することに成功。` },
  { company: '株式会社リツアンSTC', department: 'エンジニアリング事業部', period: '2019年09月01日\n〜\n2025年06月30日', role: 'SE (アプリケーション設計)', languages: ['GAS', 'SQL', 'VBA'], frameworks: ['Bootstrap', 'Tool1', 'Dropwizard', 'AngularJS'], os: ['Linux'], db: ['MongoDB'], middleware: ['Apache', 'Tool2'], cloud: ['Force.com'],
    process: '要件定義,\n基本設計,\n詳細設計,\n実装・単体,\n結合テスト', team: '10名未満\nチームリーダー', 
    projectSummary: `【プロジェクト概要】
・React+Firebaseを用いた営業報告の属人化を解消するための支援アプリ新規開発。
【担当業務】
・要件定義
・基本設計
・Firebase(Firestore)の設計
・Reactでのフロントエンド開発
・認証機能の実装
・リアルタイムデータベースとの連携
・テスト
・オンプレミスからAWSへのインフラ移行
【体制・連携・会議】
・チームリーダーとして開発を主導。
・営業部門との仕様調整会議に参画。
【工夫・成果】
・リアルタイムでの報告共有を実現し、営業活動の透明性を向上。
・AWS移行により、サーバー運用コストを30%削減。` },
  { company: '株式会社ミライタス', department: 'IT事業部', period: '2017年08月05日\n〜\n2019年12月01日', role: 'SE (アプリケーション設計)', languages: ['Python', 'PHP', 'JavaScript', 'Java', 'VBA'], frameworks: [], os: ['Windows', 'Linux'], db: ['MySQL'], middleware: [], cloud: [],
    process: '実装・単体,\n結合テスト,\n総合テスト,\n保守・運用', team: '10名未満\nチームリーダー,\nPL,\nPM,\nメンバー', 
    projectSummary: `【プロジェクト概要】
・大手通信キャリアの業務支援ツール開発プロジェクト。
【担当業務】
・実装・プログラミング (Python, PHP, Java)
・単体テストコード作成
・結合テスト
・総合テストのサポート
・不具合の修正
・既存機能の保守・運用
・ドキュメント修正
・メンバーのコードレビュー
【体制・連携・会議】
・10名未満のチームでPL, PMの指示のもと開発。
・JIRAを用いたタスク管理と情報共有。
【工夫・成果】
・担当したモジュールの品質を高く保ち、リリース後の不具合件数を抑制。
・保守性を考慮したコーディングで、後の機能追加が容易になったと評価された。` },
];

const otherHistory = [
  { company: '株式会社リツアンSTC', department: 'エンジニアリング事業部', period: '2020年04月01日\n〜\n2022年12月31日', role: '営業・セールス', 
    description: `【プロジェクト概要】
・営業・セールス部門における品質保証活動。
【担当業務】
・デシジョンツリーリストテストの計画立案
・テストケースの作成
・テストの実行と記録
・不具合の起票と管理
・開発チームへのフィードバック
・リリース判定会議への参加
・ユーザーマニュアルのレビュー
・QAプロセスの改善提案
【体制・連携・会議】
・QA担当として開発チームと連携。
・週1回のQA定例会を主催。
【工夫・成果】
・テスト観点の抜け漏れを防ぐチェックリストを導入。
・クリティカルな不具合の流出を未然に防ぎ、製品品質の向上に貢献。`, 
    tools: 'スプレッドシート, RPF' },
  { company: '株式会社サードウェーブ', department: '池袋本店', period: '2015年04月05日\n〜\n2016年08月05日', role: '派遣・小売', 
    description: `【プロジェクト概要】
・アパレル店舗およびECサイトの運営・マーケティング業務。
【担当業務】
・店舗での接客・販売
・売上管理
・スタッフの育成とマネジメント
・ECサイトの更新作業
・Webマーケティング施策の立案
・VBAを用いたレポート作成の自動化
・在庫管理システムの改善
・顧客データ分析
【体制・連携・会議】
・店長として店舗スタッフを統括。
・本社マーケティング部と週次で連携。
【工夫・成果】
・VBAによる業務自動化で月間20時間の工数削減を達成。
・データ分析に基づいた販売戦略で、担当店舗の売上を前年比120%に向上。`, 
    tools: 'Excel, PowerPoint' },
];

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

const SkillSelectionModal = ({
  isOpen,
  onClose,
  title,
  options,
  selectedOptions,
  setSelectedOptions,
  isGrouped = false,
  otherText,
  setOtherText,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: any;
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
  isGrouped?: boolean;
  otherText?: string;
  setOtherText?: (text: string) => void;
}) => {
  const handleToggleSelection = (item: string) => {
    setSelectedOptions(
      selectedOptions.includes(item)
        ? selectedOptions.filter(option => option !== item)
        : [...selectedOptions, item]
    );
  };

  const handleSelectAll = () => {
    if (isGrouped) {
      const allOptions = Object.values(options).flat() as string[];
      setSelectedOptions(selectedOptions.length === allOptions.length ? [] : allOptions);
    } else {
      setSelectedOptions(selectedOptions.length === options.length ? [] : options);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const renderOptions = () => {
    if (isGrouped) {
      return Object.entries(options).map(([groupName, groupOptions]) => (
        <div key={groupName} className="mb-4">
          <h4 className="font-semibold text-gray-700 mb-2">{groupName}</h4>
          <div className="grid grid-cols-2 gap-2">
            {(groupOptions as string[]).map((option: string) => (
              <label key={option} className="flex items-center space-x-2 text-sm" onClick={handleCheckboxClick}>
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleToggleSelection(option)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  onClick={handleCheckboxClick}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
      ));
    } else {
      return (
        <div className="grid grid-cols-2 gap-2">
          {options.map((option: string) => (
            <label key={option} className="flex items-center space-x-2 text-sm" onClick={handleCheckboxClick}>
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleToggleSelection(option)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                onClick={handleCheckboxClick}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      );
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50" static>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" onClick={(e) => e.stopPropagation()} />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel 
                className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                onClick={(e) => e.stopPropagation()}
              >
                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 mb-4">
                  {title}
                </Dialog.Title>
                
                <div className="max-h-96 overflow-y-auto">
                  {renderOptions()}
                </div>

                {setOtherText && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">その他</label>
                    <input
                      type="text"
                      value={otherText || ''}
                      onChange={(e) => setOtherText(e.target.value)}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      placeholder="その他の項目を入力"
                    />
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {isGrouped 
                      ? selectedOptions.length === Object.values(options).flat().length ? '全解除' : '全選択'
                      : selectedOptions.length === options.length ? '全解除' : '全選択'
                    }
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="bg-blue-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-blue-700"
                  >
                    確定
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const DynamicSearchForm = ({ 
  selectedMajorId,
  modalState,
  setModalState,
  selections,
  setSelections,
  otherTexts,
  setOtherTexts
}: { 
  selectedMajorId: string | null;
  modalState: any;
  setModalState: any;
  selections: any;
  setSelections: any;
  otherTexts: any;
  setOtherTexts: any;
}) => {
  const openModal = (type: keyof typeof modalState) => {
    setModalState((prev: any) => ({ ...prev, [type]: true }));
  };
  
  const closeModal = (type: keyof typeof modalState) => {
    setModalState((prev: any) => ({ ...prev, [type]: false }));
  };

  const handleButtonClick = (e: React.MouseEvent, type: keyof typeof modalState) => {
    e.preventDefault();
    e.stopPropagation();
    openModal(type);
  };

  const setSelectionFor = (type: keyof typeof selections) => (options: string[]) => {
    setSelections((prev: any) => ({ ...prev, [type]: options }));
  };

  const setOtherTextFor = (type: keyof typeof otherTexts) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherTexts((prev: any) => ({ ...prev, [type]: e.target.value }));
  };

  const renderSelectedItems = (items: string[], otherText: string) => {
    const allItems = otherText ? [...items, `その他: ${otherText}`] : items;
    const tooltipText = allItems.join(', ');
    let displayText;

    if (allItems.length === 0) {
      displayText = <span className="text-gray-500">指定なし</span>;
    } else if (allItems.length > 4) {
      displayText = `${allItems.slice(0, 4).join(', ')} 他${allItems.length - 4}件`;
    } else {
      displayText = tooltipText;
    }
    
    return { displayText, tooltipText, hasOverflow: allItems.length > 4 };
  };

  const renderITForm = () => {
    const itItems = [
      { type: 'language', label: '言語', options: itLanguages, selectionKey: 'languages', isGrouped: false },
      { type: 'framework', label: 'フレームワーク', options: itFrameworks, selectionKey: 'frameworks', isGrouped: true },
      { type: 'os', label: 'OS', options: itOS, selectionKey: 'os', isGrouped: false },
      { type: 'db', label: 'DB', options: itDB, selectionKey: 'db', isGrouped: false },
      { type: 'middleware', label: 'ミドルウェア', options: itMiddleware, selectionKey: 'middleware', isGrouped: true },
      { type: 'cloud', label: 'クラウドサービス', options: itCloudServices, selectionKey: 'cloudServices', isGrouped: false },
    ];
    return (
      <div>
        {renderForm(itItems)}
        <div className="border-b border-gray-200 pb-4 mb-4"></div>
      </div>
    );
  }

  const renderKidenForm = () => {
    const kidenItems = [
      { type: 'kidenTool', label: 'CAD・ツール・言語', options: kidenCadToolsLanguages, selectionKey: 'kidenTools', isGrouped: true },
      { type: 'kidenIndustry', label: '業界', options: kidenIndustries, selectionKey: 'kidenIndustries', isGrouped: false },
    ];
    return (
      <div>
        {renderForm(kidenItems)}
        <div className="border-b border-gray-200 pb-4 mb-4"></div>
      </div>
    );
  }

  const renderKenchikuForm = () => {
    const kenchikuItems = [
      { type: 'kenchikuTool', label: 'ツール', options: kenchikuTools, selectionKey: 'kenchikuTools', isGrouped: false },
      { type: 'kenchikuExperience', label: '経験業務', options: kenchikuExperience, selectionKey: 'kenchikuExperiences', isGrouped: true },
    ];
    return (
      <div>
        {renderForm(kenchikuItems)}
        <div className="border-b border-gray-200 pb-4 mb-4"></div>
      </div>
    );
  }
  
  const renderOtherForm = () => (
    <div>
      <label className="block text-sm text-gray-600 mb-1">ツール</label>
      <input
        type="text"
        placeholder="Excel、マクロ、PowerPoint、Word、その他ツール"
        value={otherTexts.otherFreeText}
        onChange={setOtherTextFor('otherFreeText')}
        className="w-full border rounded-md px-3 py-2 text-sm"
      />
      <div className="border-b border-gray-200 pb-4 mb-4"></div>
    </div>
  )

  const renderForm = (items: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4" onClick={(e) => e.stopPropagation()}>
      {items.map(item => {
        const currentSelections = selections[item.selectionKey as keyof typeof selections] || [];
        const currentOtherText = otherTexts[item.selectionKey as keyof typeof otherTexts] || '';
        const { displayText, tooltipText, hasOverflow } = renderSelectedItems(currentSelections, currentOtherText);
        
        return (
          <div key={item.type} onClick={(e) => e.stopPropagation()}>
            <label className="block text-sm text-gray-600 mb-1">{item.label}</label>
            <button
              onClick={(e) => handleButtonClick(e, item.type as keyof typeof modalState)}
              className="w-full border rounded-md px-3 py-2 text-sm text-left bg-white truncate relative group"
            >
              {displayText}
            </button>
            <SkillSelectionModal
              isOpen={modalState[item.type as keyof typeof modalState]}
              onClose={() => closeModal(item.type as keyof typeof modalState)}
              title={`${item.label}を選択`}
              options={item.options}
              selectedOptions={currentSelections}
              setSelectedOptions={setSelectionFor(item.selectionKey as keyof typeof selections)}
              isGrouped={item.isGrouped}
              otherText={currentOtherText}
              setOtherText={(text) => setOtherTexts((prev: any) => ({...prev, [item.selectionKey]: text}))}
            />
          </div>
        )
      })}
    </div>
  );

  switch (selectedMajorId) {
    case 'it':
      return renderITForm();
    case 'kiden':
      return renderKidenForm();
    case 'kenchiku':
      return renderKenchikuForm();
    case 'other':
      return renderOtherForm();
    default:
      return null;
  }
};

export default function StaffPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [drawerStaff, setDrawerStaff] = useState<any>(null);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);
  const [perPage, setPerPage] = useState(20);
  // メール送信ダイアログ用
  const [isMailDialogOpen, setIsMailDialogOpen] = useState(false);
  const [mailType, setMailType] = useState<'registration' | 'update'>('registration');
  const [subject, setSubject] = useState('【本登録のお願い】キャリア情報のご登録について（マイページよりご入力ください）');
  const [body, setBody] = useState('{ユーザー氏名}さん\n\nお仕事おつかれさまです、内勤の{ログインユーザー}でございます。\n\nキャリア情報のご登録・更新は、マイページ上からいつでも行っていただけます。\nつきましては、今後のご提案や営業活動の参考とさせていただくため、下記の項目についてご入力をお願いいたします。\n\n■ 必須項目\n・学歴\n・最寄駅\n・メインスキル（職種を選択後、得意とするスキルをご入力ください）\n・職務経歴\n\n■ 任意項目（お持ちの場合はぜひご記入ください）\n・資格\n・語学力\n\nみなさまにご入力いただいたキャリア情報は、\n法人営業の際に、企業に対して「エンジニアの強み」としてご紹介する材料になります。\nまた、会社全体のスキルや実績を整理・可視化することで、案件獲得力の強化やご希望に沿った案件の提案にもつながります。\n\nつまり、みなさま一人ひとりの登録が、企業としての競争力にもなり、結果的にご自身のチャンスも広がります。\nお忙しいところ恐縮ですが、ぜひご協力いただけますと幸いです。\n\n▶ ご入力はこちらから\nhttps://app.ritsuan.com/user/skill');
  // 検索フォーム用 state 追加
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [statusTarget, setStatusTarget] = useState<'all'|'employee'|'applicant'>('all');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<JobCategory | null>(null);
  const [selectedMediums, setSelectedMediums] = useState<JobCategory[]>([]);
  const [statusModalStep, setStatusModalStep] = useState<'target' | 'status'>('target');
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>('');
  const [skillKeyword, setSkillKeyword] = useState<string>('');
  
  // タブ機能用のstate
  const [activeTab, setActiveTab] = useState<'main' | 'career'>('main');
  
  // 経歴書から選ぶ機能用のstate
  const [isCareerHistoryModalOpen, setIsCareerHistoryModalOpen] = useState(false);
  const [selectedCareerMajor, setSelectedCareerMajor] = useState<JobCategory | null>(null);
  const [selectedCareerMediums, setSelectedCareerMediums] = useState<JobCategory[]>([]);
  
  // DynamicSearchForm用のstate
  const [skillModalState, setSkillModalState] = useState({
    language: false,
    framework: false,
    os: false,
    db: false,
    middleware: false,
    cloud: false,
    kidenTool: false,
    kidenIndustry: false,
    kenchikuTool: false,
    kenchikuExperience: false,
  });

  const [skillSelections, setSkillSelections] = useState({
    languages: [],
    frameworks: [],
    os: [],
    db: [],
    middleware: [],
    cloudServices: [],
    kidenTools: [],
    kidenIndustries: [],
    kenchikuTools: [],
    kenchikuExperiences: [],
  });

  const [skillOtherTexts, setSkillOtherTexts] = useState({
    languages: '',
    frameworks: '',
    os: '',
    db: '',
    middleware: '',
    cloudServices: '',
    kidenTools: '',
    kidenIndustries: '',
    kenchikuTools: '',
    kenchikuExperiences: '',
    otherFreeText: '',
  });

  // 経歴書から選ぶ機能用のDynamicSearchForm用のstate
  const [careerSkillModalState, setCareerSkillModalState] = useState({
    language: false,
    framework: false,
    os: false,
    db: false,
    middleware: false,
    cloud: false,
    kidenTool: false,
    kidenIndustry: false,
    kenchikuTool: false,
    kenchikuExperience: false,
  });

  const [careerSkillSelections, setCareerSkillSelections] = useState({
    languages: [],
    frameworks: [],
    os: [],
    db: [],
    middleware: [],
    cloudServices: [],
    kidenTools: [],
    kidenIndustries: [],
    kenchikuTools: [],
    kenchikuExperiences: [],
  });

  const [careerSkillOtherTexts, setCareerSkillOtherTexts] = useState({
    languages: '',
    frameworks: '',
    os: '',
    db: '',
    middleware: '',
    cloudServices: '',
    kidenTools: '',
    kidenIndustries: '',
    kenchikuTools: '',
    kenchikuExperiences: '',
    otherFreeText: '',
  });

  const baseStatusOptions = [
    '稼働中',
    '稼働中（異動）',
    '異動予定（本人希望）',
    '異動予定（終了確定）',
    '休業（産休・育休、傷病）',
    '休業（案件未決定）',
    '退職',
  ];
  const applicantStatusOptions = [
    'エントリー着',
    '初回連絡完了',
    '面談日時確定',
    '面談完了',
    '提案完了',
    '辞退',
    '不採用',
  ];
  const statusOptionsForTarget =
    statusTarget === 'all' ? [...baseStatusOptions, ...applicantStatusOptions]
    : statusTarget === 'employee' ? baseStatusOptions
    : applicantStatusOptions;

  const isAllChecked = selected.length === staffList.length;
  const isIndeterminate = selected.length > 0 && selected.length < staffList.length;
  const isDrawerOpen = !!drawerStaff;

  // ページネーションボタン生成（1〜10, ..., 51, 52）
  const pageButtons = [
    ...Array(10).fill(0).map((_, i) => i + 1),
    '...',
    51,
    52,
  ];

  const handleCheckAll = () => {
    setSelected(isAllChecked ? [] : staffList.map(staff => staff.id));
  };

  const handleCheck = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleSkillsModalOpen = () => {
    window.open('/admin/staff/skills', '_blank');
  };

  // ラジオ切替時に件名・本文を自動変更
  const handleMailTypeChange = (type: 'registration' | 'update') => {
    setMailType(type);
    if (type === 'registration') {
      setSubject('【本登録のお願い】キャリア情報のご登録について（マイページよりご入力ください）');
      setBody('{ユーザー氏名}さん\n\nお仕事おつかれさまです、内勤の{ログインユーザー}でございます。\n\nキャリア情報のご登録・更新は、マイページ上からいつでも行っていただけます。\nつきましては、今後のご提案や営業活動の参考とさせていただくため、下記の項目についてご入力をお願いいたします。\n\n■ 必須項目\n・学歴\n・最寄駅\n・メインスキル（職種を選択後、得意とするスキルをご入力ください）\n・職務経歴\n\n■ 任意項目（お持ちの場合はぜひご記入ください）\n・資格\n・語学力\n\nみなさまにご入力いただいたキャリア情報は、\n法人営業の際に、企業に対して「エンジニアの強み」としてご紹介する材料になります。\nまた、会社全体のスキルや実績を整理・可視化することで、案件獲得力の強化やご希望に沿った案件の提案にもつながります。\n\nつまり、みなさま一人ひとりの登録が、企業としての競争力にもなり、結果的にご自身のチャンスも広がります。\nお忙しいところ恐縮ですが、ぜひご協力いただけますと幸いです。\n\n▶ ご入力はこちらから\nhttps://app.ritsuan.com/user/skill');
    } else {
      setSubject('【キャリアシート情報更新のお願い】異動に伴い職務経歴の追加をご確認ください');
      setBody('{ユーザー氏名}さん\n\nお仕事おつかれさまです、内勤の{ログインユーザー}でございます。\n※ログインユーザーは苗字のみ\n\nこのたびのご異動に伴い、マイページ上のキャリアシートについて、\n職務経歴の追加・修正をお願いできればと思っております。\n\n現場変更のタイミングは、スキルやご経験の最新状況を整理し、\n次のご提案にすぐ活かせる重要な機会でもあります。\n\n職務経歴に加えて、必要に応じて以下の項目も更新いただけますと幸いです。\n\n■ 更新をご確認いただきたい項目\n・職務経歴（キャリアシート）\n・最寄駅、メインスキル、資格など変更がある場合\n\nお手数をおかけいたしますが、ご協力のほどよろしくお願いいたします。\n\n▶ ご入力・更新はこちらから\nhttps://app.ritsuan.com/user/skill');
    }
  };

  // ステータス選択の全選択/全解除
  const handleSelectAllStatuses = () => {
    if (selectedStatuses.length === statusOptionsForTarget.length) {
      setSelectedStatuses([]);
    } else {
      setSelectedStatuses(statusOptionsForTarget);
    }
  };

  // ステータス選択の切り替え
  const handleStatusToggle = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // ステータス選択のクリア
  const handleClearStatuses = () => {
    setSelectedStatuses([]);
  };

  // 職種選択の全選択/全解除
  const handleSelectAllMediums = () => {
    if (!selectedMajor || !selectedMajor.children) return;

    const areAllSelected =
      selectedMajor.children.length > 0 &&
      selectedMediums.length === selectedMajor.children.length;

    if (areAllSelected) {
      setSelectedMediums([]);
    } else {
      setSelectedMediums(selectedMajor.children);
    }
  };

  // 経歴書から選ぶ機能の職種選択ハンドラー
  const handleCareerSelectAllMediums = () => {
    if (!selectedCareerMajor || !selectedCareerMajor.children) return;

    const areAllSelected =
      selectedCareerMajor.children.length > 0 &&
      selectedCareerMediums.length === selectedCareerMajor.children.length;

    if (areAllSelected) {
      setSelectedCareerMediums([]);
    } else {
      setSelectedCareerMediums(selectedCareerMajor.children);
    }
  };

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
          {/* 1段目: 5項目 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
              <label className="text-base font-bold text-gray-700 whitespace-nowrap">雇用形態</label>
              <select 
                className="border rounded px-3 py-2 text-sm"
                value={selectedEmploymentType}
                onChange={(e) => setSelectedEmploymentType(e.target.value)}
              >
                <option value="">指定なし</option>
                {employmentTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
          {/* 2段目: 2項目 */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex flex-col gap-1 max-w-xs w-60">
              <label className="text-base font-bold text-gray-700 whitespace-nowrap truncate">契約形態</label>
              <select className="border rounded px-3 py-2 text-sm">
                <option>指定なし</option>
                <option>時給</option>
                <option>月給</option>
              </select>
            </div>
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
                selected={null}
                onChange={() => {}}
                dateFormat="yyyy/MM/dd"
                className="border rounded px-3 py-2 text-sm w-full"
                placeholderText="例: 2024/05/01"
                isClearable
              />
            </div>
          </div>
          {/* ステータス選択 */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">ステータス</label>
            <button
              type="button"
              onClick={() => {
                setIsStatusModalOpen(true);
              }}
              className="relative w-full flex items-center border rounded-md p-2.5 text-left text-gray-900 bg-gray-50/50 hover:bg-gray-100 transition"
            >
              {selectedStatuses.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  {selectedStatuses.map(status => (
                    <span key={status} className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                      {status}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-blue-600 font-medium">
                  {statusTarget === 'all' ? '全員' : statusTarget === 'employee' ? '社員のみ' : '応募者のみ'}で検索
                </span>
              )}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </button>
          </div>
          {/* 職種選択（タブ形式） */}
          <div className="mt-4">
            <div className="flex border-b border-gray-200 mb-4">
            <button
              type="button"
                onClick={() => setActiveTab('main')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'main'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                メインスキルから選ぶ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('career')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'career'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                経歴書から選ぶ
              </button>
            </div>
            
            <label className="block text-sm font-medium text-gray-700 mb-2">メインスキル（職種）</label>
            <button
              type="button"
              onClick={() => activeTab === 'main' ? setIsJobModalOpen(true) : setIsCareerHistoryModalOpen(true)}
              className="relative w-full flex items-center border rounded-md p-2.5 text-left text-gray-900 bg-gray-50/50 hover:bg-gray-100 transition"
            >
              {activeTab === 'main' ? (
                // メインスキルから選ぶの場合
                selectedMediums.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{selectedMajor?.name}</span>
                  {selectedMediums.map(m => (
                    <span key={m.id} className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                      {m.name}
                    </span>
                  ))}
                </div>
              ) : selectedMajor ? (
                <span className="text-blue-600 font-medium">
                  {selectedMajor.name}で検索
                </span>
              ) : (
                  <span className="text-gray-500">職種を選択してください</span>
                )
              ) : (
                // 経歴書から選ぶの場合
                selectedCareerMediums.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{selectedCareerMajor?.name}</span>
                    {selectedCareerMediums.map(m => (
                      <span key={m.id} className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                        {m.name}
                      </span>
                    ))}
                  </div>
                ) : selectedCareerMajor ? (
                  <span className="text-blue-600 font-medium">
                    {selectedCareerMajor.name}で検索
                  </span>
                ) : (
                  <span className="text-gray-500">職種を選択してください</span>
                )
              )}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </button>
          </div>
          
          <div className="mt-6">
            <DynamicSearchForm 
              key={`${activeTab}-${activeTab === 'main' ? selectedMajor?.id || 'none' : selectedCareerMajor?.id || 'none'}`} 
              selectedMajorId={activeTab === 'main' ? selectedMajor?.id || null : selectedCareerMajor?.id || null} 
              modalState={activeTab === 'main' ? skillModalState : careerSkillModalState} 
              setModalState={activeTab === 'main' ? setSkillModalState : setCareerSkillModalState} 
              selections={activeTab === 'main' ? skillSelections : careerSkillSelections} 
              setSelections={activeTab === 'main' ? setSkillSelections : setCareerSkillSelections} 
              otherTexts={activeTab === 'main' ? skillOtherTexts : careerSkillOtherTexts} 
              setOtherTexts={activeTab === 'main' ? setSkillOtherTexts : setCareerSkillOtherTexts} 
            />
          </div>

          {/* マイページのスキルから探す */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">フリーワード検索</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm text-gray-900 bg-white hover:bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="キャリアシートの担当業務の内容から検索"
              value={skillKeyword}
              onChange={(e) => setSkillKeyword(e.target.value)}
            />
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
                onClick={() => {
                  if (selected.length === 0) {
                    alert('送信対象のスタッフを選択してください。');
                    return;
                  }
                  setIsMailDialogOpen(true);
                }}
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
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-32">ステータス</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap">スタッフ</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-32">クライアント</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-32">雇用形態</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-20">契約形態</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-28">請求単価</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-28">営業担当</th>
              <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 flex items-center gap-1">
                キャリアシート更新情報
                <span className="relative group cursor-pointer">
                  <AiOutlineInfoCircle className="inline text-gray-400 hover:text-blue-500" size={18} />
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 w-64 text-sm rounded px-3 py-2 opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-pre-line shadow-lg transition-opacity duration-200 bg-gray-800 text-white">
                    未完了は、学歴、最寄駅、メインスキル、職務経歴を全て入力されていない状態です。
                  </span>
                </span>
              </th>
              <th className="px-2 py-4 text-center text-sm font-bold text-gray-700 whitespace-nowrap w-20">マイページ</th>
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
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-32">
                    <span className={`inline-block border text-xs font-bold px-2 py-0.5 rounded-full ${getStatusColor(staff.status)}`}>
                      社員：{staff.status}
                    </span>
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-40">
                    <div className="text-xs text-gray-500 mb-1">{staff.staff_number}</div>
                    <div className="font-bold">{staff.staff_name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{staff.staff_kana}</div>
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-32">
                    <div className="text-xs text-gray-500 mb-1">{staff.client_number}</div>
                    <div className="font-bold">{staff.client_name}</div>
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-32">
                    {staff.employment_type}
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-20">{staff.contract_type}</td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-28">
                    {staff.unit_price.toLocaleString()}円
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-28">
                    {staff.sales_person}
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
                    </div>
                  </td>
                  <td className="px-2 py-4 text-center w-20">
                    <button 
                      className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-300 rounded hover:bg-blue-50 transition-colors whitespace-nowrap"
                      onClick={() => handleSkillsModalOpen()}
                    >
                      マイページ
                    </button>
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
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs">最寄駅1</span>
                      <span className="ml-2 font-bold">JR北上線 江釣子</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* メインスキル */}
              <InfoCard title="メインスキル" gridCols={1} editable={false}>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <SkillTag name="Java" years={5} />
                    <SkillTag name="Spring Boot" years={3} />
                    <SkillTag name="PostgreSQL" years={4} />
                    <SkillTag name="Docker" years={2} />
                    <SkillTag name="AWS" years={3} />
                  </div>
                  <div className="text-xs text-gray-500">
                    スキルレベル: 上級者レベル
                  </div>
                </div>
              </InfoCard>

              {/* キャリアシートPDF */}
              <InfoCard title="キャリアシート" gridCols={1} editable={false}>
                <div className="space-y-6">
                  {/* 1つ目 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon path={mdiFilePdfBox} size={1.2} className="text-red-500" />
                        <span className="text-sm font-medium">R.H_2050.pdf</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-300 rounded hover:bg-blue-50 transition-colors">
                          <Icon path={mdiDownload} size={0.8} className="mr-1" />
                          ダウンロード
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      最終更新: 2024年3月15日
                    </div>
                    {/* PDFプレビュー */}
                    <div className="border rounded-lg overflow-hidden" style={{ height: '300px' }}>
                      <PdfViewer 
                        pdfUrl="/R.H_2050.pdf" 
                        title="キャリアシート" 
                      />
                    </div>
                  </div>
                  {/* 2つ目 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon path={mdiFilePdfBox} size={1.2} className="text-red-500" />
                        <span className="text-sm font-medium">R.H_2050（その他）.pdf</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="text-blue-600 hover:text-blue-800 text-xs px-2 py-1 border border-blue-300 rounded hover:bg-blue-50 transition-colors">
                          <Icon path={mdiDownload} size={0.8} className="mr-1" />
                          ダウンロード
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      最終更新: 2024年3月15日
                    </div>
                    {/* PDFプレビュー */}
                    <div className="border rounded-lg overflow-hidden" style={{ height: '300px' }}>
                      <PdfViewer 
                        pdfUrl="/R.H_2050（その他）.pdf" 
                        title="キャリアシート（その他）" 
                      />
                    </div>
                  </div>
                </div>
              </InfoCard>
            </div>
          </div>
        )}
      </div>

      {/* ステータス選択モーダル */}
      <Transition appear show={isStatusModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsStatusModalOpen(false)} static>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" onClick={(e) => e.stopPropagation()} />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                <Dialog.Panel 
                  className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 flex justify-between items-center">
                    ステータスを選択
                    <button onClick={() => setIsStatusModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <Icon path={mdiClose} size={1} />
                    </button>
                  </Dialog.Title>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4" style={{minHeight: '400px'}}>
                    {/* 対象者 */}
                    <div className="border-r pr-4">
                      <div className="flex items-center border-b pb-2 mb-2" style={{ minHeight: '42px' }}>
                        <h4 className="text-sm font-semibold text-gray-500">対象者</h4>
                      </div>
                      <ul>
                        <li>
                          <label className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 cursor-pointer transition-colors ${statusTarget === 'all' ? 'bg-blue-50' : 'hover:bg-gray-100'}`} onClick={(e) => e.stopPropagation()}>
                            <input
                              type="radio"
                              name="statusTarget"
                              value="all"
                              checked={statusTarget === 'all'}
                              onChange={() => {
                                setStatusTarget('all');
                                setSelectedStatuses([]);
                              }}
                              className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className={`${statusTarget === 'all' ? 'text-blue-700 font-bold' : 'text-gray-900'}`}>全員</span>
                          </label>
                        </li>
                        <li>
                          <label className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 cursor-pointer transition-colors ${statusTarget === 'employee' ? 'bg-blue-50' : 'hover:bg-gray-100'}`} onClick={(e) => e.stopPropagation()}>
                            <input
                              type="radio"
                              name="statusTarget"
                              value="employee"
                              checked={statusTarget === 'employee'}
                              onChange={() => {
                                setStatusTarget('employee');
                                setSelectedStatuses([]);
                              }}
                              className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className={`${statusTarget === 'employee' ? 'text-blue-700 font-bold' : 'text-gray-900'}`}>社員のみ</span>
                          </label>
                        </li>
                        <li>
                          <label className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 cursor-pointer transition-colors ${statusTarget === 'applicant' ? 'bg-blue-50' : 'hover:bg-gray-100'}`} onClick={(e) => e.stopPropagation()}>
                            <input
                              type="radio"
                              name="statusTarget"
                              value="applicant"
                              checked={statusTarget === 'applicant'}
                              onChange={() => {
                                setStatusTarget('applicant');
                                setSelectedStatuses([]);
                              }}
                              className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <span className={`${statusTarget === 'applicant' ? 'text-blue-700 font-bold' : 'text-gray-900'}`}>応募者のみ</span>
                          </label>
                        </li>
                      </ul>
                    </div>

                    {/* ステータス */}
                    <div className="border-r pr-4">
                      <div className="flex items-center gap-3 border-b pb-2 mb-2" style={{ minHeight: '42px' }}>
                        <input
                          id="select-all-statuses"
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600 rounded disabled:bg-gray-200"
                          checked={
                            statusOptionsForTarget.length > 0 &&
                            selectedStatuses.length === statusOptionsForTarget.length
                          }
                          onChange={handleSelectAllStatuses}
                          disabled={statusOptionsForTarget.length === 0}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label
                          htmlFor="select-all-statuses"
                          className="text-sm font-semibold text-gray-500 cursor-pointer"
                        >
                          ステータス
                        </label>
                      </div>

                      {statusOptionsForTarget.length > 0 ? (
                        <div className="h-full overflow-y-auto" style={{maxHeight: '350px'}}>
                          {statusTarget === 'all' && (
                            <>
                              {/* 社員ステータス */}
                              <div className="mb-3">
                                <div className="bg-gray-50 px-2 py-1 mb-1 rounded text-xs">
                                  <h5 className="text-xs font-medium text-gray-600">社員</h5>
                                </div>
                                <ul className="space-y-0.5">
                                  {baseStatusOptions.map(status => (
                                    <li key={status}>
                                      <label className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                        <input
                                          type="checkbox"
                                          className="form-checkbox h-3 w-3 text-blue-600 rounded"
                                          checked={selectedStatuses.includes(status)}
                                          onChange={() => handleStatusToggle(status)}
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <span className="text-xs">{status}</span>
                                      </label>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              
                              {/* 応募者ステータス */}
                              <div>
                                <div className="bg-gray-50 px-2 py-1 mb-1 rounded text-xs">
                                  <h5 className="text-xs font-medium text-gray-600">応募者</h5>
                                </div>
                                <ul className="space-y-0.5">
                                  {applicantStatusOptions.map(status => (
                                    <li key={status}>
                                      <label className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                        <input
                                          type="checkbox"
                                          className="form-checkbox h-3 w-3 text-blue-600 rounded"
                                          checked={selectedStatuses.includes(status)}
                                          onChange={() => handleStatusToggle(status)}
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <span className="text-xs">{status}</span>
                                      </label>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </>
                          )}
                          
                          {statusTarget === 'employee' && (
                            <div>
                              <div className="bg-gray-50 px-2 py-1 mb-1 rounded text-xs">
                                <h5 className="text-xs font-medium text-gray-600">社員</h5>
                              </div>
                              <ul className="space-y-0.5">
                                {baseStatusOptions.map(status => (
                                  <li key={status}>
                                    <label className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                      <input
                                        type="checkbox"
                                        className="form-checkbox h-3 w-3 text-blue-600 rounded"
                                        checked={selectedStatuses.includes(status)}
                                        onChange={() => handleStatusToggle(status)}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <span className="text-xs">{status}</span>
                                    </label>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {statusTarget === 'applicant' && (
                            <div>
                              <div className="bg-gray-50 px-2 py-1 mb-1 rounded text-xs">
                                <h5 className="text-xs font-medium text-gray-600">応募者</h5>
                              </div>
                              <ul className="space-y-0.5">
                                {applicantStatusOptions.map(status => (
                                  <li key={status}>
                                    <label className="flex items-center gap-3 px-2 py-1.5 rounded-md hover:bg-gray-100 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                      <input
                                        type="checkbox"
                                        className="form-checkbox h-3 w-3 text-blue-600 rounded"
                                        checked={selectedStatuses.includes(status)}
                                        onChange={() => handleStatusToggle(status)}
                                        onClick={(e) => e.stopPropagation()}
                                      />
                                      <span className="text-xs">{status}</span>
                                    </label>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-400 h-full flex items-center justify-center">
                          まず対象者を選択してください
                        </div>
                      )}
                    </div>
                    
                    {/* 選択済み */}
                    <div>
                      <div className="flex items-center border-b pb-2 mb-2" style={{ minHeight: '42px' }}>
                        <h4 className="text-sm font-semibold text-gray-500">選択中のステータス</h4>
                      </div>
                      {selectedStatuses.length > 0 ? (
                        <ul className="h-full overflow-y-auto" style={{maxHeight: '350px'}}>
                          {selectedStatuses.map(status => (
                            <li key={`selected-${status}`} className="flex items-center justify-between px-2 py-1 bg-gray-50 rounded-md mb-1">
                              <span className="text-sm">{status}</span>
                              <button
                                onClick={() => setSelectedStatuses(prev => prev.filter(s => s !== status))}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Icon path={mdiClose} size={0.7} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-gray-400 h-full flex items-center justify-center">
                          ステータスから選択してください
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-4 border-t pt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                      onClick={() => {
                        setSelectedStatuses([]);
                      }}
                    >
                      クリア
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      onClick={() => setIsStatusModalOpen(false)}
                    >
                      決定
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* 職種選択モーダル */}
      <Transition appear show={isJobModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsJobModalOpen(false)} static>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" onClick={(e) => e.stopPropagation()} />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                <Dialog.Panel 
                  className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 flex justify-between items-center">
                    職種を選択
                    <button onClick={() => setIsJobModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <Icon path={mdiClose} size={1} />
                    </button>
                  </Dialog.Title>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4" style={{minHeight: '400px'}}>
                    {/* 職種（大） */}
                    <div className="border-r pr-4">
                      <div className="flex items-center border-b pb-2 mb-2" style={{ minHeight: '42px' }}>
                        <h4 className="text-sm font-semibold text-gray-500">職種（大）</h4>
                      </div>
                      <ul>
                        {jobCategories.map(major => (
                          <li key={major.id}>
                            <label className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 cursor-pointer transition-colors ${selectedMajor?.id === major.id ? 'bg-blue-50' : 'hover:bg-gray-100'}`} onClick={(e) => e.stopPropagation()}>
                              <input
                                type="radio"
                                name="major-category"
                                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                checked={selectedMajor?.id === major.id}
                                onChange={() => {
                                  setSelectedMajor(major);
                                  setSelectedMediums([]);
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                              <span className={`${selectedMajor?.id === major.id ? 'text-blue-700 font-bold' : 'text-gray-900'}`}>{major.name}</span>
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* 職種（中） */}
                    <div className="border-r pr-4">
                      <div className="flex items-center gap-3 border-b pb-2 mb-2" style={{ minHeight: '42px' }}>
                        <input
                          id="select-all-mediums"
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600 rounded disabled:bg-gray-200"
                          checked={
                            !!selectedMajor?.children &&
                            selectedMajor.children.length > 0 &&
                            selectedMediums.length === selectedMajor.children.length
                          }
                          onChange={handleSelectAllMediums}
                          disabled={!selectedMajor?.children || selectedMajor.children.length === 0}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label
                          htmlFor="select-all-mediums"
                          className="text-sm font-semibold text-gray-500 cursor-pointer"
                        >
                          職種（中）
                        </label>
                      </div>

                      {selectedMajor?.children && selectedMajor.children.length > 0 ? (
                        <ul className="h-full overflow-y-auto" style={{maxHeight: '350px'}}>
                          {selectedMajor.children.map(medium => (
                            <li key={medium.id}>
                              <label className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="checkbox"
                                  className="form-checkbox h-4 w-4 text-blue-600 rounded"
                                  checked={selectedMediums.some(m => m.id === medium.id)}
                                  onChange={() => {
                                    setSelectedMediums(prev =>
                                      prev.some(m => m.id === medium.id)
                                        ? prev.filter(m => m.id !== medium.id)
                                        : [...prev, medium]
                                    )
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span className="text-sm">{medium.name}</span>
                              </label>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-gray-400 h-full flex items-center justify-center">
                          まず職種（大）を選択してください
                        </div>
                      )}
                    </div>
                    
                    {/* 選択済み */}
                    <div>
                      <div className="flex items-center border-b pb-2 mb-2" style={{ minHeight: '42px' }}>
                        <h4 className="text-sm font-semibold text-gray-500">選択中の職種</h4>
                      </div>
                      {selectedMediums.length > 0 ? (
                        <ul className="h-full overflow-y-auto" style={{maxHeight: '350px'}}>
                          {selectedMediums.map(m => (
                            <li key={`selected-${m.id}`} className="flex items-center justify-between px-2 py-1 bg-gray-50 rounded-md mb-1">
                              <span className="text-sm">{m.name}</span>
                              <button
                                onClick={() => setSelectedMediums(prev => prev.filter(p => p.id !== m.id))}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Icon path={mdiClose} size={0.7} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-gray-400 h-full flex items-center justify-center">
                          職種（中）から選択してください
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-4 border-t pt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                      onClick={() => {
                        setSelectedMajor(null);
                        setSelectedMediums([]);
                      }}
                    >
                      クリア
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      onClick={() => setIsJobModalOpen(false)}
                    >
                      決定
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* メール送信ダイアログ */}
      <Transition appear show={isMailDialogOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsMailDialogOpen(false)} static>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" onClick={(e) => e.stopPropagation()} />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                <Dialog.Panel 
                  className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 flex justify-between items-center">
                    メール送信
                    <button onClick={() => setIsMailDialogOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <Icon path={mdiClose} size={1} />
                    </button>
                  </Dialog.Title>
                  
                  <div className="mt-4 space-y-4">
                    {/* 送信対象 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">送信対象</label>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-sm text-gray-600">
                          選択されたスタッフ: <span className="font-semibold text-blue-600">{selected.length}名</span>
                        </p>
                        <div className="mt-2 max-h-32 overflow-y-auto">
                          {staffList
                            .filter(staff => selected.includes(staff.id))
                            .map(staff => (
                              <div key={staff.id} className="text-xs text-gray-500 py-1">
                                {staff.staff_name} ({staff.staff_number})
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    </div>

                    {/* メールタイプ選択 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">メールタイプ</label>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="mailType"
                            value="registration"
                            checked={mailType === 'registration'}
                            onChange={() => handleMailTypeChange('registration')}
                            className="mr-2"
                          />
                          <span className="text-sm">本登録のお願い</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="mailType"
                            value="update"
                            checked={mailType === 'update'}
                            onChange={() => handleMailTypeChange('update')}
                            className="mr-2"
                          />
                          <span className="text-sm">異動時の更新</span>
                        </label>
                      </div>
                    </div>

                    {/* 件名 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">件名</label>
                      <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                      />
                    </div>

                    {/* 本文 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">本文</label>
                      <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        rows={8}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end gap-4 border-t pt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                      onClick={() => setIsMailDialogOpen(false)}
                    >
                      キャンセル
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      onClick={() => {
                        // メール送信処理（実際の実装ではAPI呼び出し）
                        alert(`${selected.length}名のスタッフにメールを送信しました。`);
                        setIsMailDialogOpen(false);
                        setSelected([]); // 選択をクリア
                      }}
                    >
                      送信
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