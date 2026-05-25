"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Tags, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";

const navItems = [
  { name: "Productos", href: "/products", icon: Package },
  { name: "Categorías", href: "/categories", icon: Tags },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <div className="md:hidden flex items-center p-4 border-b">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px]">
            <SheetHeader>
              <SheetTitle className="text-left border-b pb-4">
                Inventario
              </SheetTitle>
            </SheetHeader>
            <nav className="space-y-2 mt-4">
              {navItems.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <span className="ml-4 font-bold">Sistema de Inventario</span>
      </div>

      <div className={`hidden md:flex flex-col border-r bg-muted/40 transition-all duration-300 ${isCollapsed ? "w-[80px]" : "w-[250px]"}`}>
        <div className={`flex h-14 items-center border-b px-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          {!isCollapsed && <span className="font-bold text-lg">Inventario</span>}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 shrink-0"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex-1 px-3 mt-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.name} 
                href={item.href} 
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted ${isCollapsed ? "justify-center" : ""}`}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}