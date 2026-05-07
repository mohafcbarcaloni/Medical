import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { BackgroundMesh } from "@/components/BackgroundMesh";
import { ScrollProgress } from "@/components/ScrollProgress";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-elegant"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

import { checkAuthFn } from "@/lib/auth";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dr. Abdellatif Tarek — Chirurgien Général à Sétif" },
      {
        name: "description",
        content:
          "Compassionate, modern medical care. Book your appointment with Dr. Abdellatif Tarek at Abdellatif Tarek.",
      },
      { property: "og:title", content: "Abdellatif Tarek — Modern Medical Care" },
      {
        property: "og:description",
        content: "Compassionate, modern medical care. Easy online appointment booking.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=Cairo:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  loader: async () => {
    return await (checkAuthFn as any)();
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <LanguageProvider>
      <ThemeProvider defaultTheme="system" storageKey="tarek-clinic-theme">
        <div className="relative min-h-screen">
          <ScrollProgress />
          <BackgroundMesh />
          <SiteHeader />
          <main>
            <Outlet />
          </main>
          <SiteFooter />
          <WhatsAppButton />
          <Toaster richColors position="top-center" />
        </div>
      </ThemeProvider>
    </LanguageProvider>
  );
}
