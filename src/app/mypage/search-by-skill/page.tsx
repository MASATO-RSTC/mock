"use client";
import { mdiAccountPlus } from "@mdi/js";
import { useState, Fragment } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineInfoCircle, AiOutlineFileDone, AiOutlineUser, AiOutlineIdcard, AiOutlineTeam, AiOutlineDollarCircle, AiOutlineStar, AiOutlineMail } from "react-icons/ai";
import { FaSlack } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import Icon from '@mdi/react';
import { 
  mdiMagnify, 
  mdiHistory, 
  mdiStarOutline, 
  mdiShareVariantOutline, 
  mdiClose,
  mdiAccountGroup,
  mdiSlack,
  mdiCardAccountDetailsOutline
} from '@mdi/js';
import Link from 'next/link';
import { jobCategories, JobCategory } from "@/data/jobCategories";
import { itLanguages, itFrameworks, itOS, itDB, itMiddleware, itCloudServices } from "@/data/itSkillOptions";
import { kidenCadToolsLanguages, kidenIndustries } from "@/data/kidenSkillOptions";
import { kenchikuTools, kenchikuExperience } from "@/data/kenchikuSkillOptions";

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
    job_major: "IT",
    job_medium: "コンサルタント・アナリスト・プリセールス",
    job_minor: "システムアナリスト",
    mainSkills: {
      language: ["Java", "Python"],
      framework: ["Spring Boot", "Django"],
      os: ["Linux", "Windows"],
      db: ["PostgreSQL", "MySQL"],
      middleware: ["Apache", "Nginx"],
      cloudServices: ["AWS", "Azure"]
    },
    slackParticipant: true,
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
    job_major: "機電",
    job_medium: "回路・システム設計",
    job_minor: "システム設計・アーキテクチャ構築",
    mainSkills: {
      cadTools: ["AutoCAD", "SolidWorks"],
      languages: ["C++", "MATLAB"],
      industries: ["自動車", "家電"]
    },
    slackParticipant: false,
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
    job_major: "建築",
    job_medium: "プランニング・設計・積算・測量",
    job_minor: "設計（建築）",
    mainSkills: {
      tools: ["AutoCAD", "ArchiCAD"],
      experience: ["戸建（分譲）", "アパート／マンション（新築）"]
    },
    slackParticipant: true,
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
    job_major: "IT",
    job_medium: "システム開発（WEB・オープン・モバイル系）",
    job_minor: "プログラマー",
    mainSkills: {
      language: ["JavaScript", "TypeScript", "PHP"],
      framework: ["React", "Vue.js", "Laravel"],
      os: ["Linux", "macOS"],
      db: ["MySQL", "MongoDB"],
      middleware: ["Node.js", "Apache"],
      cloudServices: ["AWS", "GCP"]
    },
    slackParticipant: true,
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
    job_major: "その他",
    job_medium: "営業",
    job_minor: "",
    mainSkills: {
      tools: ["Excel", "PowerPoint", "Word"]
    },
    slackParticipant: false,
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
    job_major: "IT",
    job_medium: "システム開発（WEB・オープン・モバイル系）",
    job_minor: "プロジェクトマネージャー、プロジェクトリーダー",
    mainSkills: {
      language: ["Java", "C#"],
      framework: ["Spring", ".NET"],
      os: ["Linux", "Windows Server"],
      db: ["Oracle", "SQL Server"],
      middleware: ["WebLogic", "IIS"],
      cloudServices: ["AWS", "Azure"]
    },
    slackParticipant: true,
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
    job_major: "機電",
    job_medium: "機械・機構設計、金型設計、CAE解析",
    job_minor: "機械・機構設計（家電・AV・コンピュータ・通信機器系）",
    mainSkills: {
      cadTools: ["SolidWorks", "CATIA"],
      languages: ["C", "Fortran"],
      industries: ["家電", "AV機器"]
    },
    slackParticipant: false,
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
    job_major: "-",
    job_medium: "-",
    job_minor: "-",
    mainSkills: {},
    slackParticipant: false,
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
    job_major: "建築",
    job_medium: "施工管理",
    job_minor: "施工管理・工事監理者（建築）",
    mainSkills: {
      tools: ["JW-CAD", "VectorWorks"],
      experience: ["戸建（分譲）", "商業施設"]
    },
    slackParticipant: true,
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
    job_major: "IT",
    job_medium: "テクニカルサポート・監視・運用・保守",
    job_minor: "サーバ・マシン運用・監視",
    mainSkills: {
      language: ["Shell Script", "Python"],
      os: ["Linux", "Windows Server"],
      db: ["MySQL", "PostgreSQL"],
      middleware: ["Apache", "Nginx"],
      cloudServices: ["AWS", "GCP"]
    },
    slackParticipant: true,
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

const SlackIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 256 256"
  >
    <g fill="none">
      <path fill="#36C5F0" d="M82.96 158.038a26.332 26.332 0 1 1 0-52.664h26.332a26.332 26.332 0 1 1 0 52.664H82.96Z"/>
      <path fill="#2EB67D" d="M98.038 82.96a26.332 26.332 0 1 1 52.664 0v26.332a26.332 26.332 0 1 1-52.664 0V82.96Z"/>
      <path fill="#ECB22E" d="M173.04 98.038a26.332 26.332 0 1 1 0 52.664h-26.332a26.332 26.332 0 1 1 0-52.664h26.332Z"/>
      <path fill="#E01E5A" d="M158.038 173.04a26.332 26.332 0 1 1-52.664 0v-26.332a26.332 26.332 0 1 1 52.664 0v26.332Z"/>
    </g>
  </svg>
);

const renderMainSkills = (mainSkills: any, jobMajor: string) => {
  if (!mainSkills || Object.keys(mainSkills).length === 0) {
    return <span className="text-gray-400 text-xs">未設定</span>;
  }
  const skillLabels: { [key: string]: string } = {
    // IT
    language: "言語",
    framework: "フレームワーク",
    os: "OS",
    db: "DB",
    middleware: "ミドルウェア",
    cloudServices: "クラウド",
    // 機電
    cadTools: "CAD・ツール",
    languages: "言語",
    industries: "業界",
    // 建築
    tools: "ツール",
    experience: "経験業務",
    // その他
  };
  return (
    <div className="space-y-1">
      {Object.entries(mainSkills).map(([key, values]) => {
        if (!values || (Array.isArray(values) && values.length === 0)) return null;
        const label = skillLabels[key] || key;
        const displayValues = Array.isArray(values) ? values : [values];
        
        return (
          <div key={key} className="text-xs">
            <span className="text-gray-600 font-medium">{label}:</span>
            <span className="text-gray-800 ml-1">{displayValues.join(', ')}</span>
          </div>
        );
      })}
    </div>
  );
};

const renderSlackStatus = (isParticipant: boolean) => {
  if (isParticipant) {
    return (
      <div className="flex items-center justify-center">
        <SlackIcon />
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center">
        <span className="inline-block border border-gray-300 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
          不参加
        </span>
      </div>
    );
  }
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
  const allOptions = isGrouped
    ? (Object.values(options).flat() as string[]).filter(o => o && o !== 'その他（フリーテキスト）')
    : (options as string[]).filter(o => o !== 'その他（フリーテキスト）');

  const handleToggleSelection = (item: string) => {
    setSelectedOptions(
      selectedOptions.includes(item)
        ? selectedOptions.filter(i => i !== item)
        : [...selectedOptions, item]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedOptions.length === allOptions.length) {
      setSelectedOptions([]);
    } else {
      setSelectedOptions(allOptions);
    }
  };

  const renderOptions = () => {
    if (isGrouped) {
      return Object.entries(options).map(([group, groupOptions]) => (
        (groupOptions as string[]).length > 0 && (
          <div key={group}>
            <h5 className="px-3 py-2 bg-gray-100 font-bold text-sm text-gray-600 sticky top-0">{group}</h5>
            <ul>
              {(groupOptions as string[]).filter(item => item !== 'その他（フリーテキスト）').map(item => (
                <li key={item}>
                  <label className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50">
                    <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" checked={selectedOptions.includes(item)} onChange={() => handleToggleSelection(item)} />
                    <span className="text-sm">{item}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )
      ));
    }
    return (options as string[]).filter(item => item !== 'その他（フリーテキスト）').map(item => (
      <li key={item}>
        <label className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50">
          <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" checked={selectedOptions.includes(item)} onChange={() => handleToggleSelection(item)} />
          <span className="text-sm">{item}</span>
        </label>
      </li>
    ));
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 flex justify-between items-center">
                  {title}
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><Icon path={mdiClose} size={1} /></button>
                </Dialog.Title>
                <div className="mt-4">
                  <div className="border-b border-t">
                    <label className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600 rounded" checked={selectedOptions.length === allOptions.length && allOptions.length > 0} onChange={handleSelectAll} />
                      <span className="font-semibold text-sm">すべて選択</span>
                    </label>
                  </div>
                  <ul className="h-full overflow-y-auto" style={{ maxHeight: '400px' }}>
                    {renderOptions()}
                  </ul>
                  {setOtherText && (
                    <div className="mt-2 p-2 border-t">
                      <input
                        type="text"
                        placeholder="その他（自由入力）"
                        className="w-full border rounded-md px-3 py-2 text-sm"
                        value={otherText}
                        onChange={(e) => setOtherText(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-end gap-4 border-t pt-4">
                  <button type="button" className="text-gray-600 hover:text-gray-800" onClick={() => {
                    setSelectedOptions([]);
                    if (setOtherText) setOtherText('');
                  }}>クリア</button>
                  <button type="button" className="rounded-md bg-blue-600 text-white px-6 py-2 text-sm font-bold hover:bg-blue-700" onClick={onClose}>決定</button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const DynamicSearchForm = ({ selectedMajorId }: { selectedMajorId: string | null }) => {
  const [modalState, setModalState] = useState({
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

  const [selections, setSelections] = useState({
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

  const [otherTexts, setOtherTexts] = useState({
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

  const openModal = (type: keyof typeof modalState) => setModalState(prev => ({ ...prev, [type]: true }));
  const closeModal = (type: keyof typeof modalState) => setModalState(prev => ({ ...prev, [type]: false }));

  const setSelectionFor = (type: keyof typeof selections) => (options: string[]) => {
    setSelections(prev => ({ ...prev, [type]: options }));
  };

  const setOtherTextFor = (type: keyof typeof otherTexts) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherTexts(prev => ({ ...prev, [type]: e.target.value }));
  };
  
  const [showTooltip, setShowTooltip] = useState<number | null>(null);
  const [tooltipContent, setTooltipContent] = useState<string>('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [searchFormTooltip, setSearchFormTooltip] = useState<string>('');
  const [searchFormTooltipPosition, setSearchFormTooltipPosition] = useState({ x: 0, y: 0 });

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

  const handleMouseEnter = (e: React.MouseEvent, content: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipContent(content);
    setTooltipPosition({ x: rect.left, y: rect.bottom + 5 });
    setShowTooltip(Date.now());
  };

  const handleMouseLeave = () => {
    setShowTooltip(null);
  };

  const handleSearchFormMouseEnter = (e: React.MouseEvent, content: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSearchFormTooltip(content);
    setSearchFormTooltipPosition({ x: rect.left, y: rect.bottom + 5 });
  };

  const handleSearchFormMouseLeave = () => {
    setSearchFormTooltip('');
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
    return renderForm(itItems);
  }

  const renderKidenForm = () => {
    const kidenItems = [
      { type: 'kidenTool', label: 'CAD・ツール・言語', options: kidenCadToolsLanguages, selectionKey: 'kidenTools', isGrouped: true },
      { type: 'kidenIndustry', label: '業界', options: kidenIndustries, selectionKey: 'kidenIndustries', isGrouped: false },
    ];
    return renderForm(kidenItems);
  }

  const renderKenchikuForm = () => {
    const kenchikuItems = [
      { type: 'kenchikuTool', label: 'ツール', options: kenchikuTools, selectionKey: 'kenchikuTools', isGrouped: false },
      { type: 'kenchikuExperience', label: '経験業務', options: kenchikuExperience, selectionKey: 'kenchikuExperiences', isGrouped: true },
    ];
    return renderForm(kenchikuItems);
  }
  
  const renderOtherForm = () => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">ツール</label>
      <input
        type="text"
        placeholder="Excel、マクロ、PowerPoint、Word、その他ツール"
        value={otherTexts.otherFreeText}
        onChange={setOtherTextFor('otherFreeText')}
        className="w-full border rounded-md px-3 py-2 text-sm"
      />
    </div>
  )

  const renderForm = (items: any[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
      {items.map(item => {
        const currentSelections = selections[item.selectionKey as keyof typeof selections] || [];
        const currentOtherText = otherTexts[item.selectionKey as keyof typeof otherTexts] || '';
        const { displayText, tooltipText, hasOverflow } = renderSelectedItems(currentSelections, currentOtherText);
        
        return (
          <div key={item.type}>
            <label className="block text-sm font-bold text-gray-700 mb-1">{item.label}</label>
            <button
              onClick={() => openModal(item.type as keyof typeof modalState)}
              className="w-full border rounded-md px-3 py-2 text-sm text-left bg-white truncate relative group"
              onMouseEnter={hasOverflow ? (e) => handleSearchFormMouseEnter(e, tooltipText) : undefined}
              onMouseLeave={hasOverflow ? handleSearchFormMouseLeave : undefined}
            >
              {displayText}
            </button>
            {hasOverflow && searchFormTooltip === tooltipText && (
              <div
                className="fixed bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg z-50 max-w-xs break-words"
                style={{ 
                  left: searchFormTooltipPosition.x, 
                  top: searchFormTooltipPosition.y,
                  transform: 'translateX(-50%)'
                }}
              >
                {tooltipText}
              </div>
            )}
            <SkillSelectionModal
              isOpen={modalState[item.type as keyof typeof modalState]}
              onClose={() => closeModal(item.type as keyof typeof modalState)}
              title={`${item.label}を選択`}
              options={item.options}
              selectedOptions={currentSelections}
              setSelectedOptions={setSelectionFor(item.selectionKey as keyof typeof selections)}
              isGrouped={item.isGrouped}
              otherText={currentOtherText}
              setOtherText={(text) => setOtherTexts(prev => ({...prev, [item.selectionKey]: text}))}
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
  const [perPage, setPerPage] = useState(20);
  const [careerSheetDate, setCareerSheetDate] = useState<Date | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  
  // Job Category Modal State
  const [isJobModalOpen, setJobModalOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<JobCategory | null>(null);
  const [selectedMediums, setSelectedMediums] = useState<JobCategory[]>([]);
  
  // Free Text Search State
  const [freeTextSearch, setFreeTextSearch] = useState<string>('');
  
  // Career Sheet Tooltip State
  const [careerSheetTooltipId, setCareerSheetTooltipId] = useState<number | null>(null);
  const [careerSheetTooltipContent, setCareerSheetTooltipContent] = useState<string>('');
  const [careerSheetTooltipPosition, setCareerSheetTooltipPosition] = useState({ x: 0, y: 0 });

  const handleCareerSheetMouseEnter = (e: React.MouseEvent, staffId: number, content: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCareerSheetTooltipContent(content);
    setCareerSheetTooltipPosition({ x: rect.left, y: rect.bottom + 5 });
    setCareerSheetTooltipId(staffId);
  };

  const handleCareerSheetMouseLeave = () => {
    setCareerSheetTooltipId(null);
  };
  
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

  const allIds = staffList.map((s) => s.id);
  const isAllChecked = selected.length === staffList.length;
  const isIndeterminate = selected.length > 0 && !isAllChecked;

  const handleCheckAll = () => {
    setSelected(isAllChecked ? [] : allIds);
  };
  const handleCheck = (id: number) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]);
  };

  const handleClearConditions = () => {
    setSelectedMajor(null);
    setSelectedMediums([]);
    setFreeTextSearch('');
  };

  // ページネーションボタン生成（1〜10, ..., 51, 52）
  const pageButtons = [
    ...Array(10).fill(0).map((_, i) => i + 1),
    '...',
    51,
    52,
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex items-center gap-3">
        <Icon path={mdiAccountGroup} size={1.5} className="text-gray-500" />
        <h1 className="text-2xl font-bold text-gray-800">スキルから探す</h1>
      </div>
      <p className="text-gray-600 -mt-6">
        ritsuanで共に働くスタッフを検索できます。<br />
        今のプロジェクトに参加して欲しい人を見つけたり、あんなことなどににご利用ください
      </p>

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
        {/* Tabs */}
        <div className="flex border-b mb-6">
          <button className="flex items-center gap-2 py-3 px-4 text-blue-600 border-b-2 border-blue-600 font-bold">
            <Icon path={mdiMagnify} size={1} />
            検索
          </button>
          <button className="flex items-center gap-2 py-3 px-4 text-gray-500 hover:text-gray-700">
            <Icon path={mdiHistory} size={1} />
            履歴
          </button>
          <button className="flex items-center gap-2 py-3 px-4 text-gray-500 hover:text-gray-700">
            <Icon path={mdiStarOutline} size={1} />
            お気に入り
          </button>
          <button className="flex items-center gap-2 py-3 px-4 text-gray-500 hover:text-gray-700">
            <Icon path={mdiShareVariantOutline} size={1} />
            シェア中
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* 職種 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">職種</label>
            <button
              onClick={() => setJobModalOpen(true)}
              className="relative w-full flex items-center border rounded-md p-2.5 text-left text-gray-900 bg-gray-50/50 hover:bg-gray-100 transition"
            >
              {selectedMediums.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">{selectedMajor?.name}</span>
                  {selectedMediums.map(m => (
                    <span key={m.id} className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                      {m.name}
                    </span>
                  ))}
                </div>
              ) : (
                <span>職種を選択してください</span>
              )}

              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </button>
          </div>
          
          <DynamicSearchForm key={selectedMajor?.id || 'none'} selectedMajorId={selectedMajor?.id || null} />

          {/* フリーワード検索 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">フリーワード検索</label>
            <input
              type="text"
              placeholder="キャリアシートの担当業務内容に記載されている文言から検索します"
              value={freeTextSearch}
              onChange={(e) => setFreeTextSearch(e.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center items-center gap-4 mt-8 pt-6 border-t">
          <button className="bg-blue-600 text-white rounded-md px-10 py-2.5 text-sm font-semibold shadow hover:bg-blue-700 transition flex items-center gap-2">
            <Icon path={mdiMagnify} size={0.9} />
            検索
          </button>
          <button 
            className="text-gray-600 hover:text-gray-800 text-sm font-semibold flex items-center gap-2"
            onClick={handleClearConditions}
          >
            <Icon path={mdiClose} size={0.9} />
            条件をクリア
          </button>
        </div>
      </div>

      {/* 一覧テーブル */}
      <div className="bg-white rounded-xl shadow border border-gray-200 overflow-x-auto">
        <div className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold mb-0">検索結果</h2>
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
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap">スタッフ氏名</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-60">職種詳細</th>
              <th className="px-2 py-4 text-left text-sm font-bold text-gray-700 whitespace-nowrap w-48">メインスキル</th>
              <th className="px-2 py-4 text-center text-sm font-bold text-gray-700 whitespace-nowrap w-20">
                Slack利用
                <span className="relative group cursor-pointer ml-1">
                  <AiOutlineInfoCircle className="inline text-gray-400 hover:text-blue-500" size={14} />
                  <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 w-48 text-sm rounded px-3 py-2 opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-pre-line shadow-lg transition-opacity duration-200 bg-gray-800 text-white">
                    リツアンSTCのエンジニアSlackに参加しているメンバーにはSlackアイコンが表示されます。
                  </span>
                </span>
              </th>
              <th className="px-2 py-4 text-center text-sm font-bold text-gray-700 whitespace-nowrap w-12">
              </th>
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
                    <div className="flex flex-col gap-1">
                      <span className={`inline-block border text-xs font-bold px-2 py-0.5 rounded-full w-fit ${getStatusColor(staff.status)}`}>
                        社員：{staff.status}
                      </span>
                      <div className="text-xs text-gray-500">
                        <div>{staff.status === "退職" ? "-" : `${staff.client_number} ${staff.client_name}`}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-40">
                    <div className="text-xs text-gray-500 mb-0.5">{staff.staff_number}</div>
                    <div className="font-bold">{staff.staff_name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{staff.staff_kana}</div>
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-60">
                    <div className="flex flex-col gap-1">
                      <div className="font-bold">{staff.job_major}</div>
                      <div className="text-sm text-gray-700">{staff.job_medium}</div>
                      {staff.job_minor && staff.job_minor !== "-" && (
                        <div className="text-xs text-gray-600">{staff.job_minor}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap w-48">
                    {renderMainSkills(staff.mainSkills, staff.job_major)}
                  </td>
                  <td className="px-2 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {renderSlackStatus(staff.slackParticipant)}
                  </td>
                  <td className="px-2 py-4 text-center w-12">
                    <Link href={`/mypage/staff/${staff.id}`} className="text-blue-600 hover:text-blue-800 inline-block">
                      <Icon path={mdiCardAccountDetailsOutline} size={1} />
                    </Link>
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
      {/* 職種選択モーダル */}
      <Transition appear show={isJobModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setJobModalOpen(false)}>
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
                <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 flex justify-between items-center">
                    職種を選択
                    <button onClick={() => setJobModalOpen(false)} className="text-gray-400 hover:text-gray-600">
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
                            <label className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-3 cursor-pointer transition-colors ${selectedMajor?.id === major.id ? 'bg-blue-50' : 'hover:bg-gray-100'}`}>
                              <input
                                type="radio"
                                name="major-category"
                                className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                checked={selectedMajor?.id === major.id}
                                onChange={() => {
                                  setSelectedMajor(major);
                                  setSelectedMediums([]);
                                }}
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
                              <label className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
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
                      onClick={() => setJobModalOpen(false)}
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
    </div>
  );
} 