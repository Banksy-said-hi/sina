'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  const menuItems: { label: string; href: string }[] = [
    // { label: 'Home', href: '#' },
    // { label: 'About', href: '#' },
    // { label: 'Services', href: '#' },
    // { label: 'Contact', href: '#' },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="fixed top-4 left-4 z-50 text-white hover:bg-white/10"
        >
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="bg-[#1a1a1a] border-r border-white/10">
        <nav className="flex flex-col gap-4 mt-8">
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-white text-lg hover:text-gray-300 transition-colors"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
