// apps/web/src/app/layout.tsx
import "./globals.css";
import { Topbar } from "@/components/Topbar";
import { Sidebar } from "@/components/Sidebar"; // ← use the fixed sidebar
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { dark } from "@clerk/themes";

// shadcn providers
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="tp-theme">
          <ClerkProvider
            appearance={{
              baseTheme: dark,
              layout: { socialButtonsVariant: "iconButton", shimmer: true, logoPlacement: "inside" },
              // ⬇️ use your design tokens instead of hard-coded hex
              variables: {
                colorPrimary: "hsl(var(--primary))",
                colorText: "hsl(var(--foreground))",
                colorBackground: "hsl(var(--background))",
                colorInputBackground: "hsl(var(--muted))",
                borderRadius: "12px",
                fontSize: "14px",
                fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system",
              },
              elements: {
                // keep element overrides minimal so shadcn styles lead
                card: "border border-border",
                headerTitle: "text-xl font-semibold",
                headerSubtitle: "text-sm text-muted-foreground",
                formFieldInput: "rounded-lg border-border bg-background focus:ring-0",
                formButtonPrimary: "rounded-lg h-10 text-sm",
                footerActionLink: "hover:underline",
              },
            }}
          >
            <SignedIn>
              <TooltipProvider delayDuration={150}>
                {/* Fixed sidebar on the left */}
                <Sidebar />
                {/* App shell shifted right by sidebar width */}
                <div className="min-h-screen pl-[260px] flex flex-col">
                  <Topbar />
                  <main className="flex-1 overflow-y-auto p-6">{children}</main>
                </div>
                <Toaster richColors closeButton />
              </TooltipProvider>
            </SignedIn>

            {/* Public routes (no shell) */}
            <SignedOut>{children}</SignedOut>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}