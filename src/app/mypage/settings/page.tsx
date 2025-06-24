"use client";
import Icon from '@mdi/react';
import { mdiAccountBoxOutline } from '@mdi/js';

const InfoCard = ({ title, data }: { title: string, data: { label: string, value: string }[] }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden">
    <div className="p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <div className="divide-y divide-gray-200">
        {data.map((item, index) => (
          <div key={index} className="grid grid-cols-3 gap-4 py-4 text-sm">
            <dt className="text-gray-500 col-span-1">{item.label}</dt>
            <dd className="text-gray-800 col-span-2">{item.value}</dd>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function SettingsPage() {

  const basicInfo = [
    { label: "氏名", value: "リツアン 次郎" },
    { label: "フリガナ", value: "リツアン ジロウ" },
    { label: "生年月日", value: "1989年04月02日" },
    { label: "性別(戸籍上の性別)", value: "男性" },
  ];

  const contactInfo = [
    { label: "電話番号", value: "080-5525-9867" },
    { label: "メールアドレス", value: "app.ritsuan+1691@gmail.com" },
  ];

  const addressInfo = [
    { label: "郵便番号", value: "272-0035" },
    { label: "都道府県", value: "東京都墨田区東向島5-36-8" },
    { label: "市区町村", value: "レジェイド東向島802号室" },
    { label: "番地以下", value: "" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
        <Icon path={mdiAccountBoxOutline} size={1.2} />
        基本情報
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <InfoCard title="基本情報" data={basicInfo} />
        </div>
        <div className="lg:col-span-1">
          <InfoCard title="連絡先" data={contactInfo} />
        </div>
        <div className="lg:col-span-1">
          <InfoCard title="住所" data={addressInfo} />
        </div>
      </div>
    </div>
  );
} 