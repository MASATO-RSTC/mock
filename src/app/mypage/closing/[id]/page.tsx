import ClosingDetailClient from '@/components/ClosingDetailClient';

export default function ClosingDetailPage(props: any) {
  return <ClosingDetailClient />;
}

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' }
  ];
} 