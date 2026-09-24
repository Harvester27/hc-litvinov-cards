import ShadowForestGame from '@/components/games/shadow-forest/ShadowForestGame';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
  themeColor: '#07131b',
};

export const metadata = {
  title: 'Les stínů – herní demo | HC Litvínov Lancers',
  description:
    'Vytvoř svého pixelového hrdinu a začni příběh u táboráku se společnicí Eirou. Fantasy RPG z první osoby s rozhovory a tahovým bojem, bez přihlášení, pro mobil i počítač.',
};

export default function ShadowForestPage() {
  return <ShadowForestGame />;
}
