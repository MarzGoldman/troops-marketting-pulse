// apps/web/src/ui/Buttons/RowActionPill.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Tooltip } from "@/ui/Tooltip/Tooltip";

type BaseProps = {
  label?: string;                     // visible text (omitted for iconOnly)
  icon?: React.ReactNode;             // any node (Material Symbol, etc.)
  iconPosition?: "start" | "end";     // default: start
  size?: "sm" | "md";                 // default: sm
  tone?: "neutral" | "primary" | "danger"; // default: neutral
  iconOnly?: boolean;                 // default: false
  className?: string;
  tooltip?: React.ReactNode;          // optional hover tip
};

type LinkMode = BaseProps &
  Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children"> & {
    href: string;
    onClick?: never;
  };

type ButtonMode = BaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & {
    onClick: () => void;
    href?: never;
  };

type Props = LinkMode | ButtonMode;

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

function pillClasses({ size, tone, iconOnly }: Pick<BaseProps,"size"|"tone"|"iconOnly">) {
  const padd = size === "md" ? (iconOnly ? "p-2" : "px-3 py-1.5") : iconOnly ? "p-1.5" : "px-2.5 py-1";
  const radius = "rounded-md";
  const base = "inline-flex items-center gap-1.5 text-xs font-medium transition-colors";

  const toneCls =
    tone === "primary"
      ? "border border-border text-foreground hover:bg-[color-mix(in_oklab,var(--color-background),black_7%)]"
      : tone === "danger"
      ? "border border-red-300/40 text-red-600 dark:text-red-400 hover:bg-red-500/10"
      : "border border-border text-foreground/70 hover:bg-[color-mix(in_oklab,var(--color-background),black_6%)]";

  return cx(base, padd, radius, toneCls);
}

function Content({
  icon,
  label,
  iconPosition = "start",
  iconOnly,
}: Pick<BaseProps, "icon" | "label" | "iconPosition" | "iconOnly">) {
  return (
    <>
      {icon && iconPosition === "start" && (
        <span className="inline-block leading-none">{icon}</span>
      )}
      {!iconOnly && (label ?? "Open")}
      {icon && iconPosition === "end" && (
        <span className="inline-block leading-none">{icon}</span>
      )}
    </>
  );
}

export function RowActionPill(props: Props) {
  const {
    label,
    icon,
    iconPosition = "start",
    size = "sm",
    tone = "neutral",
    iconOnly = false,
    className,
    tooltip,
    ...rest
  } = props as Props & Record<string, unknown>;

  const classes = cx(pillClasses({ size, tone, iconOnly }), className);

  const node =
    "onClick" in props ? (
      <button
        type="button"
        aria-label={iconOnly ? (typeof label === "string" ? label : "Action") : undefined}
        className={classes}
        onClick={props.onClick}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        <Content icon={icon} label={label} iconPosition={iconPosition} iconOnly={iconOnly} />
      </button>
    ) : (
      <Link
        href={props.href}
        aria-label={iconOnly ? (typeof label === "string" ? label : "Action") : undefined}
        className={classes}
        {...(rest as Omit<React.ComponentProps<typeof Link>, "href" | "className" | "children">)}
      >
        <Content icon={icon} label={label} iconPosition={iconPosition} iconOnly={iconOnly} />
      </Link>
    );

  return tooltip ? (
    <Tooltip tip={tooltip}>{node}</Tooltip>
  ) : (
    node
  );
}