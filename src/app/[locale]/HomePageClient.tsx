"use client";

import { useState, Suspense, lazy } from "react";
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Coins,
  Crown,
  ExternalLink,
  Eye,
  Footprints,
  Gamepad2,
  Gift,
  Keyboard,
  ListChecks,
  Map as MapIcon,
  Newspaper,
  Rocket,
  Skull,
  Smartphone,
  Sparkles,
  Star,
  Tag,
  Target,
  Trophy,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// Tools Grid 卡片锚点 —— 与下方 8 个模块 section id 一一对应
const TOOL_SECTION_IDS = [
  "codes",
  "beginner-guide",
  "tier-list",
  "giant-guide",
  "controls",
  "maps-hiding-spots",
  "coins-unlocks",
  "updates-rework",
];

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.lurkinggiants.online";

  const ROBLOX_GAME = "https://www.roblox.com/games/6328880674/Lurking-Giants";
  const DISCORD_INVITE = "https://discord.com/invite/ultraworks";
  const ROBLOX_COMMUNITY =
    "https://www.roblox.com/communities/172453377/ULTRA-works";
  const YOUTUBE_VIDEO = "https://www.youtube.com/watch?v=xC2WY05wi0";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Lurking Giants Wiki",
        description:
          "Complete Lurking Giants Wiki covering codes, giants, perks, maps, controls, coins, updates, and survival tips for the Roblox analog-horror survival game.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Lurking Giants - Roblox Analog Horror Survival",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Lurking Giants Wiki",
        alternateName: "Lurking Giants",
        url: siteUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Lurking Giants Wiki - Roblox Analog Horror Survival",
        },
        sameAs: [ROBLOX_GAME, DISCORD_INVITE, ROBLOX_COMMUNITY, YOUTUBE_VIDEO],
      },
      {
        "@type": "VideoGame",
        name: "Lurking Giants",
        gamePlatform: ["PC", "Mac", "Mobile", "Roblox"],
        applicationCategory: "Game",
        genre: ["Survival", "Horror", "Analog Horror", "Multiplayer"],
        numberOfPlayers: { minValue: 1, maxValue: 8 },
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: "0",
          availability: "https://schema.org/InStock",
          url: ROBLOX_GAME,
        },
      },
      {
        "@type": "VideoObject",
        name: "5 Idiots Escape 1 Lurking Giant - Lurking Giants Gameplay",
        description:
          "Gameplay preview of Lurking Giants, the Roblox analog-horror survival game by ULTRA works.",
        uploadDate: "2026-07-11",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/xDC2WY05wi0",
        url: YOUTUBE_VIDEO,
      },
    ],
  };

  // Module 6 Maps accordion state
  const [mapsExpanded, setMapsExpanded] = useState<number | null>(0);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  // Module 4 Giant Guide 卡片图标（每卡不同）
  const GIANT_ICONS = [Skull, Eye, Users, Target];
  // Module 3 Tier 层级装饰图标 + 主题色透明度（不硬编码颜色）
  const TIER_META: Record<string, { Icon: any; opacity: string }> = {
    S: { Icon: Crown, opacity: "0.95" },
    A: { Icon: Trophy, opacity: "0.7" },
    B: { Icon: Star, opacity: "0.5" },
  };

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                          bg-[hsl(var(--nav-theme)/0.1)]
                          border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Gift className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href={ROBLOX_GAME}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="xC2WY05wi0"
              title="5 Idiots Escape 1 Lurking Giant - Lurking Giants Gameplay"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 8 Navigation Cards（位于视频区之后、Latest Updates 之前）*/}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="mx-auto max-w-3xl text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              const sectionId = TOOL_SECTION_IDS[index];
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                bg-[hsl(var(--nav-theme)/0.1)]
                                flex items-center justify-center
                                group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后再加载广告 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端优先使用方形，桌面端保留横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section（位于 Tools Grid 之后）*/}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={12} />

      {/* Module 1: Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))] mb-3">
              <Gift className="w-4 h-4" />
              {t.modules.lurkingGiantsCodes.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.lurkingGiantsCodes.title}
            </h2>
            <p className="mx-auto max-w-3xl text-base md:text-lg text-muted-foreground">
              {t.modules.lurkingGiantsCodes.subtitle}
            </p>
            <p className="mx-auto mt-3 max-w-3xl text-sm md:text-base text-muted-foreground">
              {t.modules.lurkingGiantsCodes.intro}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {t.modules.lurkingGiantsCodes.items.map((item: any, index: number) => {
              if (item.type === "active-code") {
                return (
                  <div
                    key={index}
                    className="p-5 md:p-6 bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.4)] rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.4)] font-semibold">
                        <Check className="w-3 h-3" /> {item.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Verified {item.verifiedDate}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">Active code</p>
                    <p className="text-2xl md:text-3xl font-bold tracking-wider text-[hsl(var(--nav-theme-light))] mb-2 break-all">
                      {item.code}
                    </p>
                    <p className="text-sm font-medium">{item.reward}</p>
                  </div>
                );
              }
              if (item.type === "expired-codes") {
                return (
                  <div
                    key={index}
                    className="p-5 md:p-6 bg-white/5 border border-border rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-bold">{item.status}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                );
              }
              // redemption-guide
              return (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl md:col-span-2"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <ListChecks className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    <h3 className="font-bold text-base md:text-lg">{item.title}</h3>
                  </div>
                  <ol className="space-y-3">
                    {item.steps.map((step: string, si: number) => (
                      <li key={si} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center text-xs font-bold text-[hsl(var(--nav-theme-light))]">
                          {si + 1}
                        </span>
                        <span className="text-sm md:text-base text-muted-foreground">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 2: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))] mb-3">
              <BookOpen className="w-4 h-4" />
              {t.modules.lurkingGiantsBeginnerGuide.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.lurkingGiantsBeginnerGuide.title}
            </h2>
            <p className="mx-auto max-w-3xl text-base md:text-lg text-muted-foreground">
              {t.modules.lurkingGiantsBeginnerGuide.subtitle}
            </p>
            <p className="mx-auto mt-3 max-w-3xl text-sm md:text-base text-muted-foreground">
              {t.modules.lurkingGiantsBeginnerGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {t.modules.lurkingGiantsBeginnerGuide.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">{step.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块之后的阅读停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 3: Tier List */}
      <section id="tier-list" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))] mb-3">
              <Trophy className="w-4 h-4" />
              {t.modules.lurkingGiantsTierList.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.lurkingGiantsTierList.title}
            </h2>
            <p className="mx-auto max-w-3xl text-base md:text-lg text-muted-foreground">
              {t.modules.lurkingGiantsTierList.subtitle}
            </p>
            <p className="mx-auto mt-3 max-w-3xl text-sm md:text-base text-muted-foreground">
              {t.modules.lurkingGiantsTierList.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 gap-4 md:grid-cols-3">
            {t.modules.lurkingGiantsTierList.items.map((giant: any, index: number) => {
              const meta = TIER_META[giant.tier] || TIER_META.B;
              const TierIcon = meta.Icon;
              return (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors flex flex-col"
                  style={{ borderTopColor: `hsl(var(--nav-theme)/${meta.opacity})`, borderTopWidth: 4 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-bold text-sm"
                      style={{
                        backgroundColor: `hsl(var(--nav-theme)/${meta.opacity})`,
                        color: "white",
                      }}
                    >
                      <TierIcon className="w-4 h-4" /> Tier {giant.tier}
                    </span>
                    <span className="text-xs text-muted-foreground">{giant.difficulty}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-1 text-[hsl(var(--nav-theme-light))]">
                    {giant.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {giant.availability} · {giant.cost}
                  </p>

                  <div className="mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1.5">Strengths</p>
                    <ul className="space-y-1">
                      {giant.strengths.map((s: string, si: number) => (
                        <li key={si} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1.5">Weaknesses</p>
                    <ul className="space-y-1">
                      {giant.weaknesses.map((w: string, wi: number) => (
                        <li key={wi} className="flex items-start gap-2 text-sm">
                          <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-sm mt-auto pt-3 border-t border-border">
                    <span className="font-semibold">Best for:</span>{" "}
                    <span className="text-muted-foreground">{giant.bestFor}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Module 4: Giant Guide */}
      <section id="giant-guide" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))] mb-3">
              <Skull className="w-4 h-4" />
              {t.modules.lurkingGiantsGiantGuide.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.lurkingGiantsGiantGuide.title}
            </h2>
            <p className="mx-auto max-w-3xl text-base md:text-lg text-muted-foreground">
              {t.modules.lurkingGiantsGiantGuide.subtitle}
            </p>
            <p className="mx-auto mt-3 max-w-3xl text-sm md:text-base text-muted-foreground">
              {t.modules.lurkingGiantsGiantGuide.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 gap-4 md:grid-cols-2">
            {t.modules.lurkingGiantsGiantGuide.items.map((giant: any, index: number) => {
              const Icon = GIANT_ICONS[index] || Skull;
              return (
                <div
                  key={index}
                  className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[hsl(var(--nav-theme)/0.15)]">
                      <Icon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </span>
                    <div>
                      <h3 className="text-lg font-bold">{giant.name}</h3>
                      <p className="text-xs text-muted-foreground">{giant.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div>
                      <p className="text-muted-foreground/70 font-semibold uppercase tracking-wider">Unlock</p>
                      <p className="text-muted-foreground">{giant.unlock}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground/70 font-semibold uppercase tracking-wider">Difficulty</p>
                      <p className="text-muted-foreground">{giant.difficulty}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    <span className="font-semibold">Playstyle:</span> {giant.playstyle}
                  </p>

                  <div className="mb-2">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1">Strengths</p>
                    <ul className="space-y-1">
                      {giant.strengths.map((s: string, si: number) => (
                        <li key={si} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1">Weaknesses</p>
                    <ul className="space-y-1">
                      {giant.weaknesses.map((w: string, wi: number) => (
                        <li key={wi} className="flex items-start gap-2 text-sm">
                          <X className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-sm pt-3 border-t border-border">
                    <span className="font-semibold">Strategy:</span>{" "}
                    <span className="text-muted-foreground">{giant.strategy}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 5: Controls */}
      <section id="controls" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))] mb-3">
              <Keyboard className="w-4 h-4" />
              {t.modules.lurkingGiantsControls.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.lurkingGiantsControls.title}
            </h2>
            <p className="mx-auto max-w-3xl text-base md:text-lg text-muted-foreground">
              {t.modules.lurkingGiantsControls.subtitle}
            </p>
            <p className="mx-auto mt-3 max-w-3xl text-sm md:text-base text-muted-foreground">
              {t.modules.lurkingGiantsControls.intro}
            </p>
          </div>

          <div className="scroll-reveal overflow-hidden border border-border rounded-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.1)] text-left">
                  <th className="p-3 md:p-4 font-semibold">Platform</th>
                  <th className="p-3 md:p-4 font-semibold">Input</th>
                  <th className="p-3 md:p-4 font-semibold">Action</th>
                  <th className="hidden md:table-cell p-3 md:p-4 font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.lurkingGiantsControls.items.map((row: any, index: number) => {
                  const PlatformIcon = row.platform.toLowerCase().includes("mobile")
                    ? Smartphone
                    : row.platform.toLowerCase().includes("giant")
                      ? Skull
                      : row.platform.toLowerCase().includes("controller")
                        ? Gamepad2
                        : Keyboard;
                  return (
                    <tr key={index} className="border-t border-border hover:bg-white/5 transition-colors align-top">
                      <td className="p-3 md:p-4">
                        <span className="inline-flex items-center gap-1.5 font-medium">
                          <PlatformIcon className="w-4 h-4 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                          {row.platform}
                        </span>
                      </td>
                      <td className="p-3 md:p-4">
                        <span className="font-mono font-semibold text-[hsl(var(--nav-theme-light))]">{row.input}</span>
                      </td>
                      <td className="p-3 md:p-4 font-medium">{row.action}</td>
                      <td className="hidden md:table-cell p-3 md:p-4 text-muted-foreground">{row.notes}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* 移动端 notes 单独渲染（表格在移动端隐藏 notes 列）*/}
          <div className="md:hidden mt-3 space-y-2">
            {t.modules.lurkingGiantsControls.items.map((row: any, index: number) => (
              <p key={index} className="text-xs text-muted-foreground">
                <span className="font-semibold">{row.action}:</span> {row.notes}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Maps and Hiding Spots (accordion) */}
      <section id="maps-hiding-spots" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))] mb-3">
              <MapIcon className="w-4 h-4" />
              {t.modules.lurkingGiantsMaps.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.lurkingGiantsMaps.title}
            </h2>
            <p className="mx-auto max-w-3xl text-base md:text-lg text-muted-foreground">
              {t.modules.lurkingGiantsMaps.subtitle}
            </p>
            <p className="mx-auto mt-3 max-w-3xl text-sm md:text-base text-muted-foreground">
              {t.modules.lurkingGiantsMaps.intro}
            </p>
          </div>

          <div className="scroll-reveal space-y-3">
            {t.modules.lurkingGiantsMaps.items.map((area: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden bg-white/5">
                <button
                  onClick={() => setMapsExpanded(mapsExpanded === index ? null : index)}
                  className="w-full flex items-center gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <Footprints className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-bold text-base md:text-lg">{area.title}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{area.summary}</p>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${mapsExpanded === index ? "rotate-180" : ""}`}
                  />
                </button>
                {mapsExpanded === index && (
                  <div className="px-4 md:px-5 pb-5">
                    <ul className="space-y-2">
                      {area.details.map((d: string, di: number) => (
                        <li key={di} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 7: 模块间停顿位 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 7: Coins and Unlocks */}
      <section id="coins-unlocks" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))] mb-3">
              <Coins className="w-4 h-4" />
              {t.modules.lurkingGiantsCoins.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.lurkingGiantsCoins.title}
            </h2>
            <p className="mx-auto max-w-3xl text-base md:text-lg text-muted-foreground">
              {t.modules.lurkingGiantsCoins.subtitle}
            </p>
            <p className="mx-auto mt-3 max-w-3xl text-sm md:text-base text-muted-foreground">
              {t.modules.lurkingGiantsCoins.intro}
            </p>
          </div>

          <div className="scroll-reveal grid grid-cols-1 gap-3 md:grid-cols-2">
            {t.modules.lurkingGiantsCoins.items.map((row: any, index: number) => (
              <div
                key={index}
                className="p-4 md:p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-medium">
                    {row.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-[hsl(var(--nav-theme-light))]">
                    <Tag className="w-3 h-3" /> {row.cost}
                  </span>
                </div>
                <h3 className="font-bold text-base md:text-lg mb-1">{row.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  <span className="font-semibold">How to get:</span> {row.howToGet}
                </p>
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold">Priority:</span> {row.priority}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Updates and Rework (timeline) */}
      <section id="updates-rework" className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold uppercase tracking-wider text-[hsl(var(--nav-theme-light))] mb-3">
              <Newspaper className="w-4 h-4" />
              {t.modules.lurkingGiantsUpdates.eyebrow}
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.modules.lurkingGiantsUpdates.title}
            </h2>
            <p className="mx-auto max-w-3xl text-base md:text-lg text-muted-foreground">
              {t.modules.lurkingGiantsUpdates.subtitle}
            </p>
            <p className="mx-auto mt-3 max-w-3xl text-sm md:text-base text-muted-foreground">
              {t.modules.lurkingGiantsUpdates.intro}
            </p>
          </div>

          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6">
            {t.modules.lurkingGiantsUpdates.items.map((entry: any, index: number) => {
              const statusKey = (entry.status || "").toLowerCase();
              const StatusIcon = statusKey === "released"
                ? Check
                : statusKey === "ongoing"
                  ? Clock
                  : statusKey === "announced"
                    ? Rocket
                    : Gamepad2;
              return (
                <div key={index} className="relative">
                  <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                  <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] font-medium">
                        <StatusIcon className="w-3 h-3" /> {entry.status}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" /> {entry.period}
                      </span>
                    </div>
                    <h3 className="font-bold mb-2 text-base md:text-lg">{entry.title}</h3>
                    <ul className="space-y-1.5">
                      {entry.changes.map((c: string, ci: number) => (
                        <li key={ci} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner bottom */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={DISCORD_INVITE}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href={ROBLOX_COMMUNITY}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGroup}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href={ROBLOX_GAME}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.robloxGame}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
                <li>
                  <a
                    href={YOUTUBE_VIDEO}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
