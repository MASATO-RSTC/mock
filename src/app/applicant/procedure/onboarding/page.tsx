"use client";
import { useState, useEffect } from "react";

export default function OnboardingProcedurePage() {
  // 仮の初期値
  const [form, setForm] = useState({
    name_kanji: "リツアン 次郎",
    name_kana: "リツアン ジロウ",
    gender: "男性",
    birthday: "1989-04-02",
    postal: "272-0035",
    address1: "東京都墨田区東向島5-36-8",
    address2: "レジェイド東向島802号室",
    address3: "",
    tel: "03-1234-5678",
    mobile: "080-5525-9867",
    email: "app.ritsuan+1691@gmail.com",
    email2: "",
    education: "大学卒",
    station: "JR北上線 江釣子",
    // 緊急連絡先
    emergency_name: "",
    emergency_relation: "",
    emergency_living_status: "同居",
    emergency_postal: "",
    emergency_address1: "",
    emergency_address2: "",
    emergency_address3: "",
    emergency_tel: "",
    // 給与振込口座
    bank_name: "",
    bank_code: "",
    branch_name: "",
    branch_code: "",
    account_type: "普通",
    account_number: "",
    account_holder: "",
    bank_book_file: null as File | null,
  });

  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(true);
  const [isBankAccountOpen, setIsBankAccountOpen] = useState(false);

  // 銀行・支店検索用の状態
  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [branchSearchQuery, setBranchSearchQuery] = useState("");
  const [bankSearchResults, setBankSearchResults] = useState<Array<{code: string, name: string}>>([]);
  const [branchSearchResults, setBranchSearchResults] = useState<Array<{code: string, name: string}>>([]);
  const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);

  const relationOptions = [
    "夫", "妻", "父", "母", "義父", "義母", "祖父", "祖母", "曾祖父", "曾祖母",
    "長男", "長女", "次男", "次女", "三男", "三女", "孫", "伯父", "伯母", "叔父", "叔母",
    "甥", "姪", "義兄", "義姉", "義弟", "義妹", "婿", "嫁"
  ];

  const accountTypeOptions = ["普通", "当座", "貯蓄"];

  // 仮の銀行データ
  const bankData = [
    { code: "0001", name: "みずほ銀行" },
    { code: "0005", name: "三菱UFJ銀行" },
    { code: "0009", name: "三井住友銀行" },
    { code: "0010", name: "りそな銀行" },
    { code: "0011", name: "埼玉りそな銀行" },
    { code: "0012", name: "千葉銀行" },
    { code: "0013", name: "横浜銀行" },
    { code: "0014", name: "静岡銀行" },
    { code: "0015", name: "名古屋銀行" },
    { code: "0016", name: "京都銀行" },
    { code: "0017", name: "関西みらい銀行" },
    { code: "0018", name: "中国銀行" },
    { code: "0019", name: "広島銀行" },
    { code: "0020", name: "山口銀行" },
  ];

  // 仮の支店データ
  const branchData = {
    "0001": [ // みずほ銀行
      { code: "001", name: "東京営業部" },
      { code: "002", name: "新宿支店" },
      { code: "003", name: "渋谷支店" },
      { code: "004", name: "池袋支店" },
      { code: "005", name: "銀座支店" },
    ],
    "0005": [ // 三菱UFJ銀行
      { code: "001", name: "東京営業部" },
      { code: "002", name: "新宿支店" },
      { code: "003", name: "渋谷支店" },
      { code: "004", name: "池袋支店" },
      { code: "005", name: "銀座支店" },
    ],
    "0009": [ // 三井住友銀行
      { code: "001", name: "東京営業部" },
      { code: "002", name: "新宿支店" },
      { code: "003", name: "渋谷支店" },
      { code: "004", name: "池袋支店" },
      { code: "005", name: "銀座支店" },
    ],
  };

  // 銀行検索機能
  const searchBank = async (query: string) => {
    if (query.length < 1) {
      setBankSearchResults([]);
      return;
    }
    
    // 実際のAPI実装時はここで外部APIを呼び出す
    // const response = await fetch(`/api/banks?q=${encodeURIComponent(query)}`);
    // const data = await response.json();
    
    // 仮の実装：ローカルデータから検索
    const results = bankData.filter(bank => 
      bank.name.includes(query) || bank.code.includes(query)
    ).slice(0, 10); // 最大10件まで
    
    setBankSearchResults(results);
  };

  // 支店検索機能
  const searchBranch = async (bankCode: string, query: string) => {
    if (!bankCode || query.length < 1) {
      setBranchSearchResults([]);
      return;
    }
    
    // 実際のAPI実装時はここで外部APIを呼び出す
    // const response = await fetch(`/api/branches?bankCode=${bankCode}&q=${encodeURIComponent(query)}`);
    // const data = await response.json();
    
    // 仮の実装：ローカルデータから検索
    const branches = branchData[bankCode as keyof typeof branchData] || [];
    const results = branches.filter(branch => 
      branch.name.includes(query) || branch.code.includes(query)
    ).slice(0, 10); // 最大10件まで
    
    setBranchSearchResults(results);
  };

  // 銀行選択時の処理
  const selectBank = (bank: {code: string, name: string}) => {
    setForm(f => ({...f, bank_name: bank.name, bank_code: bank.code}));
    setBankSearchQuery(bank.name);
    setShowBankDropdown(false);
    setForm(f => ({...f, branch_name: "", branch_code: ""})); // 支店情報をリセット
  };

  // 支店選択時の処理
  const selectBranch = (branch: {code: string, name: string}) => {
    setForm(f => ({...f, branch_name: branch.name, branch_code: branch.code}));
    setBranchSearchQuery(branch.name);
    setShowBranchDropdown(false);
  };

  // 銀行検索のデバウンス処理
  useEffect(() => {
    const timer = setTimeout(() => {
      searchBank(bankSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [bankSearchQuery]);

  // 支店検索のデバウンス処理
  useEffect(() => {
    const timer = setTimeout(() => {
      searchBranch(form.bank_code, branchSearchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [branchSearchQuery, form.bank_code]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(f => ({...f, bank_book_file: file}));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-0">
      {/* タイトル・説明文を白枠外に */}
      <h1 className="text-2xl font-bold mb-2 text-gray-800">入社手続き</h1>
      <p className="text-gray-700 mb-6">こちらから入社に必要な手続きを行ってください。</p>
      <div className="bg-white rounded-xl shadow p-6 md:p-8 border border-gray-200">
        <form className="space-y-8">
          {/* 基本情報 */}
          <div>
            <button
              type="button"
              onClick={() => setIsBasicInfoOpen(!isBasicInfoOpen)}
              className="flex items-center justify-between w-full text-left text-lg font-bold text-gray-700 mb-4"
            >
              <span>基本情報</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${isBasicInfoOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isBasicInfoOpen && (
              <div className="space-y-8">
                {/* 氏名グループ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">氏名（漢字）</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.name_kanji} onChange={e => setForm(f => ({...f, name_kanji: e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">氏名（カナ）</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.name_kana} onChange={e => setForm(f => ({...f, name_kana: e.target.value}))} />
                  </div>
                </div>

                {/* 生年月日・性別グループ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">生年月日</label>
                    <input type="date" className="w-full border rounded px-3 py-2" value={form.birthday} onChange={e => setForm(f => ({...f, birthday: e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">性別</label>
                    <select className="w-full border rounded px-3 py-2" value={form.gender} onChange={e => setForm(f => ({...f, gender: e.target.value}))}>
                      <option value="男性">男性</option>
                      <option value="女性">女性</option>
                      <option value="その他">その他</option>
                    </select>
                  </div>
                </div>

                {/* 住所グループ */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">郵便番号</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.postal} onChange={e => setForm(f => ({...f, postal: e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">住所1</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.address1} onChange={e => setForm(f => ({...f, address1: e.target.value}))} placeholder="都道府県・市区町村" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">住所2</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.address2} onChange={e => setForm(f => ({...f, address2: e.target.value}))} placeholder="番地・建物名" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">住所3</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.address3} onChange={e => setForm(f => ({...f, address3: e.target.value}))} placeholder="部屋番号など" />
                  </div>
                </div>

                {/* 連絡先グループ */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
                    <input type="tel" className="w-full border rounded px-3 py-2" value={form.tel} onChange={e => setForm(f => ({...f, tel: e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">携帯番号</label>
                    <input type="tel" className="w-full border rounded px-3 py-2" value={form.mobile} onChange={e => setForm(f => ({...f, mobile: e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
                    <input type="email" className="w-full border rounded px-3 py-2" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス2</label>
                    <input type="email" className="w-full border rounded px-3 py-2" value={form.email2} onChange={e => setForm(f => ({...f, email2: e.target.value}))} />
                  </div>
                </div>

                {/* その他グループ */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">最終学歴</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.education} onChange={e => setForm(f => ({...f, education: e.target.value}))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">最寄駅</label>
                    <input type="text" className="w-full border rounded px-3 py-2" value={form.station} onChange={e => setForm(f => ({...f, station: e.target.value}))} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 緊急連絡先 */}
          <div className="border-t pt-8">
            <button
              type="button"
              onClick={() => setIsEmergencyOpen(!isEmergencyOpen)}
              className="flex items-center justify-between w-full text-left text-lg font-bold text-gray-700 mb-4"
            >
              <span>緊急連絡先</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${isEmergencyOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isEmergencyOpen && (
              <div className="space-y-6">
                {/* 緊急連絡先番号 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    緊急連絡先番号
                    <span className="text-xs text-gray-500 ml-2">
                      ※ご両親やご兄弟などで、すぐにご連絡の取れる方の連絡先のご記入をお願いいたします。
                    </span>
                  </label>
                  <input 
                    type="tel" 
                    className="w-full border rounded px-3 py-2" 
                    value={form.emergency_tel} 
                    onChange={e => setForm(f => ({...f, emergency_tel: e.target.value}))} 
                  />
                </div>

                {/* 氏名・続柄・居住区分 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">氏名</label>
                    <input 
                      type="text" 
                      className="w-full border rounded px-3 py-2" 
                      value={form.emergency_name} 
                      onChange={e => setForm(f => ({...f, emergency_name: e.target.value}))} 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">続柄</label>
                    <select 
                      className="w-full border rounded px-3 py-2" 
                      value={form.emergency_relation} 
                      onChange={e => setForm(f => ({...f, emergency_relation: e.target.value}))}
                    >
                      <option value="">選択してください</option>
                      {relationOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">居住区分</label>
                    <select 
                      className="w-full border rounded px-3 py-2" 
                      value={form.emergency_living_status} 
                      onChange={e => setForm(f => ({...f, emergency_living_status: e.target.value}))}
                    >
                      <option value="同居">同居</option>
                      <option value="別居">別居</option>
                    </select>
                  </div>
                </div>

                {/* 住所（別居の場合のみ表示） */}
                {form.emergency_living_status === "別居" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">郵便番号</label>
                      <input 
                        type="text" 
                        className="w-full border rounded px-3 py-2" 
                        value={form.emergency_postal} 
                        onChange={e => setForm(f => ({...f, emergency_postal: e.target.value}))} 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">住所1</label>
                      <input 
                        type="text" 
                        className="w-full border rounded px-3 py-2" 
                        value={form.emergency_address1} 
                        onChange={e => setForm(f => ({...f, emergency_address1: e.target.value}))} 
                        placeholder="都道府県・市区町村" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">住所2</label>
                      <input 
                        type="text" 
                        className="w-full border rounded px-3 py-2" 
                        value={form.emergency_address2} 
                        onChange={e => setForm(f => ({...f, emergency_address2: e.target.value}))} 
                        placeholder="番地・建物名" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">住所3</label>
                      <input 
                        type="text" 
                        className="w-full border rounded px-3 py-2" 
                        value={form.emergency_address3} 
                        onChange={e => setForm(f => ({...f, emergency_address3: e.target.value}))} 
                        placeholder="部屋番号など" 
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 給与振込口座 */}
          <div className="border-t pt-8">
            <button
              type="button"
              onClick={() => setIsBankAccountOpen(!isBankAccountOpen)}
              className="flex items-center justify-between w-full text-left text-lg font-bold text-gray-700 mb-4"
            >
              <span>給与振込口座</span>
              <svg
                className={`w-5 h-5 transform transition-transform ${isBankAccountOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isBankAccountOpen && (
              <div className="space-y-6">
                {/* 銀行情報 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">銀行名</label>
                    <input 
                      type="text" 
                      className="w-full border rounded px-3 py-2" 
                      value={bankSearchQuery} 
                      onChange={e => {
                        setBankSearchQuery(e.target.value);
                        setShowBankDropdown(true);
                      }}
                      onFocus={() => setShowBankDropdown(true)}
                      placeholder="銀行名を入力してください"
                    />
                    {showBankDropdown && bankSearchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {bankSearchResults.map((bank, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                            onClick={() => selectBank(bank)}
                          >
                            <div className="font-medium">{bank.name}</div>
                            <div className="text-sm text-gray-500">コード: {bank.code}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">金融機関コード</label>
                    <input 
                      type="text" 
                      className="w-full border rounded px-3 py-2" 
                      value={form.bank_code} 
                      onChange={e => setForm(f => ({...f, bank_code: e.target.value}))} 
                      placeholder="4桁のコード"
                      maxLength={4}
                    />
                  </div>
                </div>

                {/* 支店情報 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">支店名</label>
                    <input 
                      type="text" 
                      className="w-full border rounded px-3 py-2" 
                      value={branchSearchQuery} 
                      onChange={e => {
                        setBranchSearchQuery(e.target.value);
                        setShowBranchDropdown(true);
                      }}
                      onFocus={() => setShowBranchDropdown(true)}
                      placeholder="支店名を入力してください"
                      disabled={!form.bank_code}
                    />
                    {showBranchDropdown && branchSearchResults.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {branchSearchResults.map((branch, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                            onClick={() => selectBranch(branch)}
                          >
                            <div className="font-medium">{branch.name}</div>
                            <div className="text-sm text-gray-500">コード: {branch.code}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">支店コード</label>
                    <input 
                      type="text" 
                      className="w-full border rounded px-3 py-2" 
                      value={form.branch_code} 
                      onChange={e => setForm(f => ({...f, branch_code: e.target.value}))} 
                      placeholder="3桁のコード"
                      maxLength={3}
                    />
                  </div>
                </div>

                {/* 口座情報 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">預金種別</label>
                    <select 
                      className="w-full border rounded px-3 py-2" 
                      value={form.account_type} 
                      onChange={e => setForm(f => ({...f, account_type: e.target.value}))}
                    >
                      {accountTypeOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">口座番号</label>
                    <input 
                      type="text" 
                      className="w-full border rounded px-3 py-2" 
                      value={form.account_number} 
                      onChange={e => setForm(f => ({...f, account_number: e.target.value}))} 
                      placeholder="口座番号を入力してください"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">名義人</label>
                    <input 
                      type="text" 
                      className="w-full border rounded px-3 py-2" 
                      value={form.account_holder} 
                      onChange={e => setForm(f => ({...f, account_holder: e.target.value}))} 
                      placeholder="口座名義人を入力してください"
                    />
                  </div>
                </div>

                {/* ファイルアップロード */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    給与振込口座の通帳またはキャッシュカードのコピー
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>ファイルをアップロード</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*,.pdf"
                            onChange={handleFileUpload}
                          />
                        </label>
                        <p className="pl-1">またはドラッグ&ドロップ</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF 最大10MB</p>
                      {form.bank_book_file && (
                        <p className="text-sm text-green-600">
                          アップロード済み: {form.bank_book_file.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 