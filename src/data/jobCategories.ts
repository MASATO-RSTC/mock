export interface JobCategory {
  id: string;
  name: string;
  children?: JobCategory[];
}

export const jobCategories: JobCategory[] = [
  {
    id: "it",
    name: "IT",
    children: [
      { id: "it-1", name: "コンサルタント・アナリスト・プリセールス" },
      { id: "it-2", name: "システム開発（WEB・オープン・モバイル系）" },
      { id: "it-3", name: "システム開発（汎用機系）" },
      { id: "it-4", name: "システム開発（マイコン・ファームウエア・制御系）" },
      { id: "it-5", name: "パッケージソフト・ミドルウエア開発" },
      { id: "it-6", name: "ネットワーク設計・構築（LAN・Web系）" },
      { id: "it-7", name: "通信インフラ設計・構築（キャリア・ISP系）" },
      { id: "it-8", name: "テクニカルサポート・監視・運用・保守" },
      { id: "it-9", name: "社内SE、情報システム" },
      { id: "it-10", name: "研究、特許、テクニカルマーケティング、品質保証ほか" },
    ],
  },
  {
    id: "kiden",
    name: "機電",
    children: [
        { id: "kiden-1", name: "研究・開発・特許" },
        { id: "kiden-2", name: "回路・システム設計" },
        { id: "kiden-3", name: "半導体設計" },
        { id: "kiden-4", name: "制御設計" },
        { id: "kiden-5", name: "光学技術" },
        { id: "kiden-6", name: "機械・機構設計、金型設計、CAE解析" },
        { id: "kiden-7", name: "生産技術・プロセス開発" },
        { id: "kiden-8", name: "品質保証・品質管理・生産管理" },
        { id: "kiden-9", name: "セールスエンジニア・FAE" },
        { id: "kiden-10", name: "サービスエンジニア・サポートエンジニア" },
        { id: "kiden-11", name: "評価・検査・実験" },
    ],
  },
  {
    id: "kenchiku",
    name: "建築",
    children: [
        { id: "kenchiku-1", name: "プランニング・設計・積算・測量" },
        { id: "kenchiku-2", name: "施工管理" },
        { id: "kenchiku-3", name: "研究開発・構造解析・品質管理・特許" },
    ],
  },
  {
    id: "other",
    name: "その他",
    children: [
        { id: "other-1", name: "総務・人事" },
        { id: "other-2", name: "営業・セールス" },
        { id: "other-3", name: "製造・生産" },
        { id: "other-4", name: "金融・証券" },
        { id: "other-5", name: "不動産" },
        { id: "other-6", name: "流通・小売" },
        { id: "other-7", name: "物流・倉庫" },
        { id: "other-8", name: "その他" },
    ],
  },
]; 