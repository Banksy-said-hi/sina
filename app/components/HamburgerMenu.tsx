'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MenuItem } from '@/app/types';

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { label: 'Enigma', href: '#enigma' },
    // { label: 'Gallery', href: '#gallery' },
    // { label: 'About', href: '#about' },
    // { label: 'Contact', href: '#contact' },
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
      <SheetContent side="left" className="bg-[#1a1a1a] border-r border-white/10 w-64 px-0">
        <nav className="flex flex-col gap-0 mt-16 px-6">
          {menuItems.map((item, index) => (
            <a
              key={item.label}
              href={item.href}
              className="text-white text-lg hover:text-cyan-400 transition-colors py-4 px-4 border-b border-white/5 hover:bg-white/5 rounded-sm"
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
