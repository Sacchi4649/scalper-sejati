"use client";

import { useEffect, useRef, useState } from "react";
import { Tooltip } from "antd";
import { cn } from "@/lib/cn";

export function TruncatedName({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [truncated, setTruncated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function measure() {
      const node = ref.current;
      if (!node) return;
      setTruncated(node.scrollWidth > node.clientWidth + 1);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children]);

  return (
    <Tooltip
      title={truncated ? children : undefined}
      trigger={["hover", "click"]}
      mouseEnterDelay={0.15}
      styles={{ container: { maxWidth: 280 } }}
    >
      <span
        ref={ref}
        className={cn(
          "block min-w-0 truncate",
          truncated && "cursor-help",
          className,
        )}
      >
        {children}
      </span>
    </Tooltip>
  );
}
