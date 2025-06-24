"use client";
import SkillsPage from '../../../mypage/skills/page';
import MypageLayout from '../../../mypage/layout';

export default function AdminStaffSkillsMock() {
  // マイページ用サイドメニュー＋スキル情報画面をそのまま表示
  return (
    <MypageLayout>
      <SkillsPage />
    </MypageLayout>
  );
} 