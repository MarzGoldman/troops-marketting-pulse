// apps/web/src/components/NavUserClerk.tsx
"use client";

import * as React from "react";
import { SignedIn, SignedOut, SignInButton, useUser, useClerk } from "@clerk/nextjs";
import { ChevronsUpDown, LogOut, BadgeCheck, CreditCard, Bell, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

// Point this to your account portal domain (or set via env var)
const ACCOUNT_BASE =
    process.env.NEXT_PUBLIC_ACCOUNTS_BASE_URL ?? "https://clever-skunk-86.accounts.dev";

// Small helper to navigate to the portal (avoids SPA routing/blur issues)
function go(path: string) {
    if (typeof window !== "undefined") window.location.href = `${ACCOUNT_BASE}${path}`;
}

export function NavUserClerk() {
    const { user } = useUser();
    const { signOut } = useClerk();

    const name = user?.fullName || user?.username || "Account";
    const email = user?.primaryEmailAddress?.emailAddress || "—";
    const avatar = user?.imageUrl;
    const initials = (name || "U").slice(0, 1).toUpperCase();

    return (
        <>
            <SignedIn>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className={[
                                "w-full flex items-center gap-3 rounded-2xl px-3 py-2 transition",
                                "hover:bg-[color-mix(in_oklab,var(--sidebar),black_10%)]",
                                "text-[var(--sidebar-foreground)]/90",
                            ].join(" ")}
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={avatar ?? ""} alt={name} />
                                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 text-left">
                                <div className="truncate text-sm font-medium leading-tight">{name}</div>
                                <div className="truncate text-xs opacity-70">{email}</div>
                            </div>
                            <ChevronsUpDown className="ml-auto h-4 w-4 opacity-70" />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className={[
                            "min-w-56 rounded-lg border border-[var(--sidebar-border)]",
                            "bg-[var(--card)] text-foreground",
                            // remove scale/translate animations that can look blurry
                            "antialiased will-change-auto",
                            "data-[state=open]:animate-none data-[state=closed]:animate-none",
                        ].join(" ")}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-2 py-2">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={avatar ?? ""} alt={name} />
                                    <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                    <div className="truncate text-sm font-medium">{name}</div>
                                    <div className="truncate text-xs text-muted-foreground">{email}</div>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            {/* If you don’t have “Pro” in the portal, point this to your app’s upgrade route */}
                            <DropdownMenuItem onSelect={() => go("/user")}>
                                <Sparkles className="mr-2 h-4 w-4 text-muted-foreground" />
                                Upgrade to Pro
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem onSelect={() => go("/user")}>
                                <BadgeCheck className="mr-2 h-4 w-4 text-muted-foreground" />
                                Account
                            </DropdownMenuItem>
                            {/* If billing/notifications live in the portal, wire them here; otherwise send to your app */}
                            <DropdownMenuItem onSelect={() => go("/user")}>
                                <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                                Billing
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => go("/user")}>
                                <Bell className="mr-2 h-4 w-4 text-muted-foreground" />
                                Notifications
                            </DropdownMenuItem>
                            {/* Optional: org links you listed */}
                            <DropdownMenuItem onSelect={() => go("/organization")}>
                                Organization
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => go("/create-organization")}>
                                Create organization
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onSelect={() => {
                                void signOut({ redirectUrl: "/" });
                            }}
                        >
                            <LogOut className="mr-2 h-4 w-4 text-muted-foreground" />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SignedIn>

            <SignedOut>
                {/* Redirect to the hosted sign-in on your accounts domain */}
                <SignedOut>
                    <a
                        href={`${ACCOUNT_BASE}/sign-in`}
                        className={[
                            "block w-full rounded-2xl px-3 py-2 text-sm transition",
                            "hover:bg-[color-mix(in_oklab,var(--sidebar),black_10%)]",
                            "text-[var(--sidebar-foreground)]/90",
                        ].join(" ")}
                    >
                        Sign in
                    </a>
                </SignedOut>
            </SignedOut>
        </>
    );
}