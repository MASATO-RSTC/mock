"use client"

import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const summary = [
  { icon: '📊', label: '稼働中人数', value: 312 },
  { icon: '💤', label: '待機人数', value: 24 },
  { icon: '🤝', label: '取引企業数', value: 58 },
  { icon: '👥', label: '社員数（総数）', value: 1024 },
  { icon: '📌', label: '稼働リソース数', value: 17 },
];

// 9月〜翌8月のラベル
const months = ['9月','10月','11月','12月','1月','2月','3月','4月','5月','6月','7月','8月'];
const kpiLineData = {
  labels: months,
  datasets: [
    { label: '入社数', data: [2,3,4,5,3,2,1,2,3,4,2,3], borderColor: '#60a5fa', backgroundColor: '#60a5fa22', tension: 0.3 },
    { label: '退社数', data: [1,1,2,1,2,1,1,1,2,1,1,1], borderColor: '#f87171', backgroundColor: '#f8717122', tension: 0.3 },
    { label: '異動数', data: [0,1,1,0,1,1,0,1,1,0,1,1], borderColor: '#fbbf24', backgroundColor: '#fbbf2422', tension: 0.3 },
    { label: '純増数', data: [1,2,2,4,1,0,0,1,2,3,1,2], borderColor: '#10b981', backgroundColor: '#10b98122', tension: 0.3 },
    { label: 'リード数', data: [10,12,15,13,11,10,9,10,12,13,11,12], borderColor: '#6366f1', backgroundColor: '#6366f122', tension: 0.3 },
    { label: 'エントリー数', data: [5,6,7,8,6,5,4,5,6,7,5,6], borderColor: '#0ea5e9', backgroundColor: '#0ea5e922', tension: 0.3 },
    { label: 'プロセス数', data: [3,4,5,4,3,2,2,3,4,5,3,4], borderColor: '#a21caf', backgroundColor: '#a21caf22', tension: 0.3 },
  ],
};

// ファネル分析用モック
const funnel = [
  { label: '本エントリー', value: 100 },
  { label: '面談実施', value: 70 },
  { label: '面談通過', value: 40 },
  { label: '内定', value: 20 },
  { label: '入社', value: 15 },
];
const funnelRates = [
  { label: '辞退率', value: '30%' },
  { label: '不採用率', value: '43%' },
  { label: '面談通過率', value: '57%' },
];

const empTrendData = {
  labels: ['2023/6', '2023/9', '2023/12', '2024/3', '2024/6'],
  datasets: [
    { label: '社員数', data: [900, 950, 980, 1000, 1024], backgroundColor: '#60a5fa' },
  ],
};
const leaveTrendData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    { label: '稼働数', data: [300, 320, 310, 312], backgroundColor: '#34d399' },
    { label: '退社数', data: [5, 7, 4, 3], backgroundColor: '#f87171' },
  ],
};
const typePieData = {
  labels: ['IT', '機電', '建築'],
  datasets: [
    { data: [700, 200, 124], backgroundColor: ['#60a5fa', '#fbbf24', '#34d399'] },
  ],
};
const empTypePieData = {
  labels: ['正社員', '契約社員', '業務委託'],
  datasets: [
    { data: [800, 150, 74], backgroundColor: ['#6366f1', '#f59e42', '#10b981'] },
  ],
};

const processList = [
  { name: '奈良崎 慎一', job: 'SE', status: '面談調整中' },
  { name: '片瀬 博也', job: 'PM', status: '書類選考中' },
  { name: '石田 貴大', job: 'PG', status: '結果待ち' },
  { name: '佐藤 花子', job: 'インフラ', status: '面談調整中' },
];

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* サマリーカード */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {summary.map((s) => (
          <div key={s.label} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      {/* KPI折れ線グラフ */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="font-bold mb-2">営業KPI（月次進捗 9月〜翌8月）</div>
        <Line data={kpiLineData} />
      </div>
      {/* ファネル分析 */}
      <div className="bg-white rounded-lg shadow p-4 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1">
          <div className="font-bold mb-2">プロセス分析（ファネル）</div>
          <div className="flex flex-col gap-2">
            {funnel.map((f, i) => (
              <div key={f.label} className="flex items-center gap-4">
                <div className="w-28 text-xs text-gray-500">{f.label}</div>
                <div className="h-4 bg-blue-100 rounded w-full max-w-xs relative">
                  <div className="bg-blue-500 h-4 rounded" style={{ width: `${(f.value / funnel[0].value) * 100}%` }} />
                  <span className="absolute left-2 top-0 text-xs text-white font-bold">{f.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="font-bold mb-2">主要率</div>
          {funnelRates.map(r => (
            <div key={r.label} className="flex items-center gap-2">
              <div className="w-20 text-xs text-gray-500">{r.label}</div>
              <div className="font-bold text-base">{r.value}</div>
            </div>
          ))}
        </div>
      </div>
      {/* グラフエリア */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="font-bold mb-2">社員数推移（前年比／月次）</div>
          <Bar data={empTrendData} />
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="font-bold mb-2">稼働数・退社数の四半期別推移</div>
          <Bar data={leaveTrendData} />
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center w-full max-w-xs mx-auto">
          <div className="font-bold mb-2">エンジニア種別構成</div>
          <Pie data={typePieData} />
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col items-center w-full max-w-xs mx-auto">
          <div className="font-bold mb-2">雇用区分内訳</div>
          <Pie data={empTypePieData} />
        </div>
      </div>
      {/* プロセス中の人材テーブル */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="font-bold mb-2">プロセス中の人材一覧</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-500">
              <th className="text-left py-2">名前</th>
              <th className="text-left py-2">希望職種</th>
              <th className="text-left py-2">進捗ステータス</th>
            </tr>
          </thead>
          <tbody>
            {processList.map((p, i) => (
              <tr key={i} className="border-t">
                <td className="py-2">{p.name}</td>
                <td className="py-2">{p.job}</td>
                <td className="py-2">{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 