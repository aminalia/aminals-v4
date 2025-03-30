import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';

export default function Header() {
  return (
    <>
      {/* Desktop Header */}
      <header className="hidden md:flex justify-between items-center py-4">
        <div className="flex justify-center flex-col">
          <Link href="/">
            <h1 className="text-xl font-bold">👾 Aminals</h1>
          </Link>
        </div>

        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/auctions">💕 Breeding</Link>
              </NavigationMenuLink>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/leaderboard">🏆 Leaderboard</Link>
              </NavigationMenuLink>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/traits">🧬 Traits</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <ConnectButton />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden flex justify-between items-center py-2 px-4">
        <Link href="/">
          <h1 className="text-xl font-bold">👾 Aminals</h1>
        </Link>
        <ConnectButton />
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background/98 backdrop-blur-sm border-t z-50 shadow-lg">
        <div className="grid grid-cols-4 gap-1 p-2">
          <Link
            href="/"
            className="flex flex-col items-center justify-center p-2 hover:bg-accent rounded-lg"
          >
            <span className="text-2xl">👾</span>
            <span className="text-xs mt-1">Aminals</span>
          </Link>
          <Link
            href="/auctions"
            className="flex flex-col items-center justify-center p-2 hover:bg-accent rounded-lg"
          >
            <span className="text-2xl">💕</span>
            <span className="text-xs mt-1">Breeding</span>
          </Link>
          <Link
            href="/leaderboard"
            className="flex flex-col items-center justify-center p-2 hover:bg-accent rounded-lg"
          >
            <span className="text-2xl">🏆</span>
            <span className="text-xs mt-1">Leaderboard</span>
          </Link>
          <Link
            href="/traits"
            className="flex flex-col items-center justify-center p-2 hover:bg-accent rounded-lg"
          >
            <span className="text-2xl">🧬</span>
            <span className="text-xs mt-1">Traits</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
