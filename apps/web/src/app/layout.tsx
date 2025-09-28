// apps/web/src/app/layout.tsx
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Topbar } from "@/components/Topbar";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { dark } from "@clerk/themes";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground">
        {/* ✅ Providers must live inside body */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
          storageKey="tp-theme"
        >
          <ClerkProvider
            appearance={{
              baseTheme: dark,
              layout: { socialButtonsVariant: "iconButton", shimmer: true, logoPlacement: "inside" },
              variables: {
                colorPrimary: "#111827",
                colorText: "#111827",
                colorBackground: "#ffffff",
                colorInputBackground: "#f9fafb",
                borderRadius: "12px",
                fontSize: "14px",
                fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system",
              },
              elements: {
                card: "shadow-xl border border-border",
                headerTitle: "text-xl font-semibold",
                headerSubtitle: "text-sm text-muted-foreground",
                formFieldInput:
                  "rounded-lg border-border bg-background focus:ring-0 focus:border-black dark:focus:border-white",
                formButtonPrimary:
                  "bg-black dark:bg-white text-white dark:text-black rounded-lg h-10 text-sm",
                footerActionLink: "text-black dark:text-white hover:underline",
              },
            }}
          >
            <SignedIn>
              <div className="flex h-screen bg-background text-foreground">
                <Sidebar />
                <div className="flex flex-col flex-1">
                  <Topbar />
                  <main className="flex-1 overflow-y-auto p-6">{children}</main>
                </div>
              </div>
            </SignedIn>
            <SignedOut>{children}</SignedOut>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}