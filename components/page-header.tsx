"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type PageHeaderContent = {
  title: string;
  description?: string;
  actions?: ReactNode;
};

const HeaderStateContext = createContext<PageHeaderContent | null>(null);
const SetHeaderContext = createContext<
  ((header: PageHeaderContent | null) => void) | null
>(null);

export function PageHeaderProvider({ children }: { children: ReactNode }) {
  const [header, setHeaderState] = useState<PageHeaderContent | null>(null);
  const setHeader = useCallback((next: PageHeaderContent | null) => {
    setHeaderState(next);
  }, []);

  return (
    <SetHeaderContext.Provider value={setHeader}>
      <HeaderStateContext.Provider value={header}>
        {children}
      </HeaderStateContext.Provider>
    </SetHeaderContext.Provider>
  );
}

function useSetHeader() {
  const setHeader = useContext(SetHeaderContext);
  if (!setHeader) {
    throw new Error("PageHeader harus dipakai di dalam AppShell.");
  }
  return setHeader;
}

export function PageHeader({
  title,
  description,
  actions,
}: PageHeaderContent) {
  const setHeader = useSetHeader();

  useLayoutEffect(() => {
    setHeader({ title, description, actions });
    return () => setHeader(null);
  }, [actions, description, setHeader, title]);

  return null;
}

export function ShellHeader({
  fallbackTitle,
  menuButton,
}: {
  fallbackTitle: string;
  menuButton?: ReactNode;
}) {
  const header = useContext(HeaderStateContext);
  const title = header?.title ?? fallbackTitle;
  const description = header?.description;

  return (
    <header
      className={cn(
        "sticky top-0 z-20", // layout
        "border-b border-line bg-white", // contrast vs sidebar, flush join
      )}
    >
      <div className="flex items-start gap-3 px-4 py-6 sm:px-8 lg:py-7">
        {menuButton}
        <div className="min-w-0">
          <h1 className="font-display text-3xl tracking-tight text-ink lg:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export function ShellToolbar() {
  const header = useContext(HeaderStateContext);
  if (!header?.actions) {
    return null;
  }

  return (
    <Card className="mb-6 overflow-hidden px-4 py-3 sm:px-5">
      <div className="grid w-full min-w-0 gap-3">{header.actions}</div>
    </Card>
  );
}
