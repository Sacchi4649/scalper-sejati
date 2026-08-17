"use client";

import {
  useState,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";
import { formatRupiah, parseRupiahDigits } from "@/lib/format";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

export function Input({ className, label, id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-ink">{label}</span>
      <input
        id={inputId}
        className={cn(
          "h-11 w-full", // layout
          "rounded-xl border border-line bg-white px-3", // box
          "text-sm text-ink outline-none placeholder:text-muted", // type
          "focus:border-brand focus:ring-2 focus:ring-brand/20", // state
          className,
        )}
        {...props}
      />
    </label>
  );
}

type PasswordInputProps = Omit<InputProps, "type">;

export function PasswordInput({
  className,
  label,
  id,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? props.name;

  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-ink">{label}</span>
      <span
        className={cn(
          "relative flex items-center", // layout
        )}
      >
        <input
          id={inputId}
          {...props}
          type={visible ? "text" : "password"}
          className={cn(
            "h-11 w-full", // layout
            "rounded-xl border border-line bg-white py-0 pr-11 pl-3", // box
            "text-sm text-ink outline-none", // type
            "focus:border-brand focus:ring-2 focus:ring-brand/20", // state
            className,
          )}
        />
        <button
          type="button"
          aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
          className={cn(
            "absolute top-1/2 right-2 -translate-y-1/2", // layout
            "grid h-8 w-8 place-items-center rounded-lg", // box
            "text-muted hover:bg-canvas hover:text-ink", // color + state
          )}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </span>
    </label>
  );
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.2 12s3.3-6.5 9.8-6.5S21.8 12 21.8 12 18.5 18.5 12 18.5 2.2 12 2.2 12Z"
      />
      <circle cx="12" cy="12" r="2.6" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m4 4 16 16M9.9 9.9A3 3 0 0 0 12 15a3 3 0 0 0 2.1-.9M7.1 7.4C4.3 9 2.5 12 2.5 12s3.3 6.5 9.5 6.5c1.6 0 3-.3 4.2-.8M16.7 15.3C19.3 13.7 21.5 12 21.5 12S18.2 5.5 12 5.5c-.7 0-1.4.1-2 .2"
      />
    </svg>
  );
}

type RupiahInputProps = {
  label: string;
  name?: string;
  value: number | null;
  onValueChange: (value: number | null) => void;
  required?: boolean;
};

export function RupiahInput({
  label,
  name,
  value,
  onValueChange,
  required,
}: RupiahInputProps) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-ink">{label}</span>
      <input
        name={name}
        inputMode="numeric"
        autoComplete="off"
        required={required}
        value={value == null ? "" : formatRupiah(value)}
        onChange={(event) => onValueChange(parseRupiahDigits(event.target.value))}
        placeholder="Rp 0"
        className={cn(
          "h-11 w-full", // layout
          "rounded-xl border border-line bg-white px-3", // box
          "text-sm text-ink outline-none", // type
          "focus:border-brand focus:ring-2 focus:ring-brand/20", // state
        )}
      />
    </label>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
};

export function Select({ className, label, id, children, ...props }: SelectProps) {
  const inputId = id ?? props.name;

  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-ink">{label}</span>
      <select
        id={inputId}
        className={cn(
          "h-11 w-full", // layout
          "rounded-xl border border-line bg-white px-3", // box
          "text-sm text-ink outline-none", // type
          "focus:border-brand focus:ring-2 focus:ring-brand/20", // state
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
};

export function Textarea({ className, label, ...props }: TextareaProps) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-ink">{label}</span>
      <textarea
        className={cn(
          "min-h-24 w-full", // layout
          "rounded-xl border border-line bg-white px-3 py-2", // box
          "text-sm text-ink outline-none", // type
          "focus:border-brand focus:ring-2 focus:ring-brand/20", // state
          className,
        )}
        {...props}
      />
    </label>
  );
}

