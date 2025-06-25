"use client";
import { mdiAccountPlus } from "@mdi/js";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineInfoCircle, AiOutlineFileDone, AiOutlineUser, AiOutlineIdcard, AiOutlineTeam, AiOutlineDollarCircle, AiOutlineStar, AiOutlineMail } from "react-icons/ai";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Icon from '@mdi/react';
import { mdiPencil, mdiFilePdfBox, mdiPlus, mdiChevronLeft, mdiMagnifyPlus, mdiMagnifyMinus, mdiDownload, mdiDotsVertical } from '@mdi/js';
import Image from 'next/image';
import { useRef } from 'react';
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

export default function StaffPage() {
  const [selected, setSelected] = useState<number[]>([]);
  const [drawerStaff, setDrawerStaff] = useState<any>(null);
  const [showTooltip, setShowTooltip] = useState<number | null>(null);
  const [perPage, setPerPage] = useState(20);

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
                selected={null}
                onChange={() => {}}
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
                onClick={() => {}}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 