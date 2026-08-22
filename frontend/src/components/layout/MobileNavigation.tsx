import * as Dialog from "@radix-ui/react-dialog";
import { Menu, PanelLeft, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/Button";
import { SidebarNavigation, type SidebarItem } from "./Sidebar";

type MobileNavigationProps = {
  items: SidebarItem[];
};

export function MobileNavigation({ items }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog.Root onOpenChange={setIsOpen} open={isOpen}>
      <Dialog.Trigger asChild>
        <Button
          aria-label="Open primary navigation"
          className="size-10 lg:hidden"
          size="icon"
          variant="ghost"
        >
          <Menu aria-hidden="true" className="size-5 shrink-0" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-[var(--color-overlay)] backdrop-blur-md data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content className="neu-raised-lg fixed inset-y-0 left-0 z-50 flex w-64 max-w-[calc(100vw-1.5rem)] flex-col border-r border-border/60 bg-surface p-5 outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left">
          <div className="mb-8 flex items-center justify-between gap-3 px-2">
            <Dialog.Title className="flex items-center gap-2 text-lg font-semibold tracking-tight text-text">
              <PanelLeft aria-hidden="true" className="size-5 shrink-0 text-primary" />
              DevLupo
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close primary navigation"
                className="neu-raised flex size-10 shrink-0 items-center justify-center rounded-xl text-muted transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevation-3)] hover:text-text active:translate-y-0 active:shadow-[var(--shadow-inset)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
                type="button"
              >
                <X aria-hidden="true" className="size-5 shrink-0" />
              </button>
            </Dialog.Close>
          </div>
          <SidebarNavigation items={items} onNavigate={() => setIsOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
