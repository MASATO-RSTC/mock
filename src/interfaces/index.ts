export interface MenuAsideItem {
    label: string;
    icon?: string;
    color?: string;
    href?: string;
    target?: string;
    isLogout?: boolean;
    menu?: MenuAsideItem[];
}

export interface MenuAsideItemGroup {
    label: string;
    menu: MenuAsideItem[];
}

export interface UserInfo {
    id: number;
    name_kanji: string;
    name_kana: string;
    staff_number: string;
    role: 'admin' | 'external';
} 