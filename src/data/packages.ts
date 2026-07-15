import type { Billing } from "@/lib/pricing";

/**
 * Nineteen packages. Shape matches the spec: id, slug, category, image,
 * titleEn/Ar, descriptionEn/Ar, price (whole JOD | null=quote), currency,
 * billingType, timeline, featuresEn/Ar — plus detail-page fields. Section
 * order below is the rendered order.
 */

export interface Package {
  id: string; slug: string; category: string; image: string;
  titleEn: string; titleAr: string; descriptionEn: string; descriptionAr: string;
  price: number | null; currency: "JOD"; billingType: Billing;
  timelineEn: string; timelineAr: string; bestForEn: string; bestForAr: string;
  featuresEn: string[]; featuresAr: string[];
  platforms?: number; posts?: number; stories?: number; videos?: number;
  communityEn?: string; communityAr?: string; reportEn?: string; reportAr?: string;
  revisionsEn?: string; revisionsAr?: string; noteEn?: string; noteAr?: string;
  popular?: boolean;
}

export const PACKAGES: Package[] = [
  {
    id: "pkg-social-start", slug: "social-start", category: "social-monthly", image: "/images/services/social-media-management.webp",
    titleEn: "Social Start", titleAr: "باقة الانطلاقة",
    descriptionEn: "A consistent, managed presence on two platforms with a monthly plan and report.", descriptionAr: "حضور مُدار ومنتظم على منصّتين بخطة وتقرير شهريين.",
    price: 250, currency: "JOD", billingType: "monthly",
    timelineEn: "Monthly subscription", timelineAr: "اشتراك شهري",
    bestForEn: "New brands finding their voice.", bestForAr: "العلامات الجديدة التي تبحث عن صوتها.",
    featuresEn: ["2 platforms managed", "12 posts / month", "8 stories / month", "Content calendar and captions", "Basic monthly report"],
    featuresAr: ["إدارة منصّتين", "12 منشوراً شهرياً", "8 قصص شهرياً", "تقويم محتوى ونصوص", "تقرير شهري أساسي"],
    platforms: 2,
    posts: 12,
    stories: 8,
    videos: 0,
    communityEn: "Monitoring only", communityAr: "متابعة فقط",
    reportEn: "Basic", reportAr: "أساسي",
    revisionsEn: "1 per design", revisionsAr: "مراجعة لكل تصميم",
  },
  {
    id: "pkg-social-growth", slug: "social-growth-design", category: "social-monthly", image: "/images/services/graphic-design.webp",
    titleEn: "Social Growth + Design", titleAr: "باقة النمو الإبداعي",
    descriptionEn: "Three platforms with professionally designed posts, carousels and a content strategy.", descriptionAr: "ثلاث منصّات بمنشورات مصمَّمة احترافياً ودوّارات واستراتيجية محتوى.",
    price: 450, currency: "JOD", billingType: "monthly",
    timelineEn: "Monthly subscription", timelineAr: "اشتراك شهري",
    bestForEn: "Brands ready to scale their content.", bestForAr: "العلامات المستعدة لتوسيع محتواها.",
    featuresEn: ["3 platforms managed", "16 designed posts / month", "12 stories / month", "4 carousel posts", "Monthly performance report"],
    featuresAr: ["إدارة 3 منصّات", "16 منشوراً مصمَّماً شهرياً", "12 قصة شهرياً", "4 منشورات دوّارة", "تقرير أداء شهري"],
    platforms: 3,
    posts: 16,
    stories: 12,
    videos: 0,
    communityEn: "Full management", communityAr: "إدارة كاملة",
    reportEn: "Monthly performance", reportAr: "أداء شهري",
    revisionsEn: "2 per design", revisionsAr: "مراجعتان لكل تصميم",
    popular: true,
  },
  {
    id: "pkg-social-complete", slug: "complete-social-presence", category: "social-monthly", image: "/images/services/ai-video-production.webp",
    titleEn: "Complete Social Presence", titleAr: "باقة الحضور المتكامل",
    descriptionEn: "Four platforms plus short AI advertising videos, voice-over and subtitles.", descriptionAr: "أربع منصّات مع فيديوهات إعلانية قصيرة بالذكاء الاصطناعي وتعليق صوتي وترجمة.",
    price: 750, currency: "JOD", billingType: "monthly",
    timelineEn: "Monthly subscription", timelineAr: "اشتراك شهري",
    bestForEn: "Brands that need video, not just posts.", bestForAr: "العلامات التي تحتاج فيديو لا منشورات فقط.",
    featuresEn: ["4 platforms managed", "20 designed posts / month", "4 AI videos or reels / month", "AI voice-over and subtitles", "Detailed monthly report"],
    featuresAr: ["إدارة 4 منصّات", "20 منشوراً مصمَّماً شهرياً", "4 فيديوهات أو ريلز شهرياً", "تعليق صوتي وترجمة بالذكاء الاصطناعي", "تقرير شهري مفصّل"],
    platforms: 4,
    posts: 20,
    stories: 16,
    videos: 4,
    communityEn: "Full management", communityAr: "إدارة كاملة",
    reportEn: "Detailed monthly", reportAr: "شهري مفصّل",
    revisionsEn: "2 per design or video", revisionsAr: "مراجعتان لكل تصميم أو فيديو",
  },
  {
    id: "pkg-social-performance", slug: "social-performance", category: "social-monthly", image: "/images/services/digital-marketing.webp",
    titleEn: "Social Performance", titleAr: "باقة الأداء والإعلانات",
    descriptionEn: "Everything in Complete Social Presence plus paid campaign management and lead generation.", descriptionAr: "كل ما في باقة الحضور المتكامل مع إدارة الحملات المدفوعة وجذب العملاء المحتملين.",
    price: 1100, currency: "JOD", billingType: "monthly",
    timelineEn: "Monthly subscription", timelineAr: "اشتراك شهري",
    bestForEn: "Brands buying reach and measuring leads.", bestForAr: "العلامات التي تشتري الوصول وتقيس العملاء المحتملين.",
    featuresEn: ["Everything in Complete Social Presence", "Meta Ads setup and targeting", "Pixel and conversion tracking", "Weekly campaign optimisation", "Lead generation campaign"],
    featuresAr: ["كل ما في باقة الحضور المتكامل", "إعداد إعلانات Meta والاستهداف", "تتبّع البكسل والتحويلات", "تحسين أسبوعي للحملات", "حملة لجذب العملاء المحتملين"],
    platforms: 4,
    posts: 20,
    stories: 16,
    videos: 4,
    communityEn: "Full management", communityAr: "إدارة كاملة",
    reportEn: "Detailed + advertising", reportAr: "مفصّل + إعلاني",
    revisionsEn: "2 per design or video", revisionsAr: "مراجعتان لكل تصميم أو فيديو",
    noteEn: "Advertising spend is not included in the package price.", noteAr: "الإنفاق الإعلاني غير مشمول في سعر الباقة.",
  },
  {
    id: "pkg-social-enterprise", slug: "enterprise-social", category: "enterprise", image: "/images/services/ai-automation.webp",
    titleEn: "Enterprise Social Management", titleAr: "باقة المؤسسات",
    descriptionEn: "Unlimited custom strategy for multi-brand and multi-branch organisations, with a dedicated account manager.", descriptionAr: "استراتيجية مخصّصة بلا حدود للمؤسسات متعددة العلامات والفروع، مع مدير حساب مخصّص.",
    price: null, currency: "JOD", billingType: "custom",
    timelineEn: "Custom scope", timelineAr: "نطاق مخصّص",
    bestForEn: "Multi-brand and multi-branch organisations.", bestForAr: "المؤسسات متعددة العلامات والفروع.",
    featuresEn: ["Unlimited custom strategy", "Dedicated account manager", "Monthly professional filming", "Crisis communication", "Executive analytics dashboard"],
    featuresAr: ["استراتيجية مخصّصة بلا حدود", "مدير حساب مخصّص", "تصوير احترافي شهري", "إدارة التواصل في الأزمات", "لوحة تحليلات تنفيذية"],
    communityEn: "Dedicated team", communityAr: "فريق مخصّص",
    reportEn: "Executive dashboard", reportAr: "لوحة تنفيذية",
    revisionsEn: "Unlimited scope", revisionsAr: "نطاق مفتوح",
  },
  {
    id: "pkg-design-kit", slug: "social-design-kit", category: "social-design", image: "/images/services/graphic-design.webp",
    titleEn: "Social Media Design Kit", titleAr: "حقيبة تصاميم التواصل",
    descriptionEn: "Templates and layouts for teams posting in-house.", descriptionAr: "قوالب وتخطيطات للفرق التي تنشر داخلياً.",
    price: 900, currency: "JOD", billingType: "once",
    timelineEn: "2–3 weeks", timelineAr: "2–3 أسابيع",
    bestForEn: "Teams posting in-house who need templates.", bestForAr: "الفرق التي تنشر داخلياً وتحتاج قوالب.",
    featuresEn: ["Post and story templates", "Carousel layouts", "Reel cover system", "Editable source files"],
    featuresAr: ["قوالب منشورات وقصص", "تخطيطات دوّارة", "نظام أغلفة الريلز", "ملفات مصدرية قابلة للتعديل"],
  },
  {
    id: "pkg-video-pack", slug: "ai-video-pack", category: "social-video", image: "/images/services/ai-video-production.webp",
    titleEn: "AI Video Pack", titleAr: "حزمة الفيديو بالذكاء الاصطناعي",
    descriptionEn: "Four AI-produced advertising videos with bilingual voice-over and subtitles.", descriptionAr: "أربعة فيديوهات إعلانية بالذكاء الاصطناعي بتعليق صوتي وترجمة بلغتين.",
    price: 1200, currency: "JOD", billingType: "once",
    timelineEn: "3–4 weeks", timelineAr: "3–4 أسابيع",
    bestForEn: "Brands launching a campaign fast.", bestForAr: "العلامات التي تطلق حملة بسرعة.",
    featuresEn: ["4 AI advertising videos", "Bilingual voice-over", "Subtitles and Reel cuts", "Script and storyboard"],
    featuresAr: ["4 فيديوهات إعلانية بالذكاء الاصطناعي", "تعليق صوتي بلغتين", "ترجمة ونسخ للريلز", "نص ولوحة قصصية"],
  },
  {
    id: "pkg-logo", slug: "logo-starter", category: "branding", image: "/images/services/branding.webp",
    titleEn: "Logo Starter", titleAr: "باقة الشعار",
    descriptionEn: "A mark to launch with — three directions, bilingual, with source files.", descriptionAr: "علامة للانطلاق — ثلاثة اتجاهات، بلغتين، مع الملفات المصدرية.",
    price: 600, currency: "JOD", billingType: "once",
    timelineEn: "2–3 weeks", timelineAr: "2–3 أسابيع",
    bestForEn: "Founders who need a mark to launch with.", bestForAr: "المؤسسون الذين يحتاجون علامة للانطلاق.",
    featuresEn: ["Three logo directions", "Bilingual wordmark", "Colour and type basics", "Source files included"],
    featuresAr: ["ثلاثة اتجاهات للشعار", "علامة نصية بلغتين", "أساسيات الألوان والخطوط", "الملفات المصدرية مشمولة"],
  },
  {
    id: "pkg-brand-identity", slug: "brand-identity", category: "branding", image: "/images/services/branding.webp",
    titleEn: "Brand Identity", titleAr: "الهوية البصرية",
    descriptionEn: "A complete identity system with packaging mockups and usage guidelines.", descriptionAr: "نظام هوية كامل بنماذج تغليف وإرشادات استخدام.",
    price: 2400, currency: "JOD", billingType: "once",
    timelineEn: "5–9 weeks", timelineAr: "5–9 أسابيع",
    bestForEn: "Brands launching or repositioning.", bestForAr: "العلامات المُطلَقة حديثاً أو المُعاد تموضعها.",
    featuresEn: ["Wordmark in Arabic and Latin", "Colour, type and spacing scales", "Packaging and print mockups", "Usage guidelines with examples"],
    featuresAr: ["علامة نصية بالحرفين", "مقاييس الألوان والخطوط والتباعد", "نماذج تغليف وطباعة", "إرشادات استخدام بأمثلة"],
    popular: true,
  },
  {
    id: "pkg-brand-launch", slug: "complete-brand-launch", category: "branding", image: "/images/services/branding.webp",
    titleEn: "Complete Brand Launch", titleAr: "إطلاق العلامة المتكامل",
    descriptionEn: "A full identity plus the launch campaign and video to introduce it.", descriptionAr: "هوية كاملة مع حملة الإطلاق والفيديو لتقديمها.",
    price: 4800, currency: "JOD", billingType: "once",
    timelineEn: "8–12 weeks", timelineAr: "8–12 أسبوعاً",
    bestForEn: "A full identity plus the campaign to launch it.", bestForAr: "هوية كاملة مع حملة إطلاقها.",
    featuresEn: ["Full brand identity system", "Launch campaign creative", "Social media design kit", "Launch video"],
    featuresAr: ["نظام هوية بصرية كامل", "تصاميم حملة الإطلاق", "حقيبة تصاميم التواصل", "فيديو الإطلاق"],
  },
  {
    id: "pkg-landing", slug: "landing-page", category: "website", image: "/images/services/web-development.webp",
    titleEn: "Landing Page", titleAr: "صفحة هبوط",
    descriptionEn: "One bilingual page built around a single conversion goal.", descriptionAr: "صفحة واحدة بلغتين مبنية حول هدف تحويل واحد.",
    price: 900, currency: "JOD", billingType: "once",
    timelineEn: "1–2 weeks", timelineAr: "1–2 أسبوع",
    bestForEn: "One campaign, one conversion goal.", bestForAr: "حملة واحدة، هدف تحويل واحد.",
    featuresEn: ["Single bilingual page", "Lead capture form", "Analytics and pixel setup", "Sub-second load target"],
    featuresAr: ["صفحة واحدة بلغتين", "نموذج جذب العملاء", "إعداد التحليلات والبكسل", "هدف تحميل أقل من ثانية"],
  },
  {
    id: "pkg-corporate", slug: "corporate-website", category: "website", image: "/images/services/web-development.webp",
    titleEn: "Corporate Website", titleAr: "موقع الشركة",
    descriptionEn: "Up to twelve bilingual pages with a CMS your team can run.", descriptionAr: "حتى اثنتي عشرة صفحة بلغتين بنظام محتوى يديره فريقك.",
    price: 3200, currency: "JOD", billingType: "once",
    timelineEn: "4–8 weeks", timelineAr: "4–8 أسابيع",
    bestForEn: "Companies that need to be found and trusted.", bestForAr: "الشركات التي تريد أن تُوجد ويُوثق بها.",
    featuresEn: ["Up to 12 bilingual pages", "Content management", "Structured data and sitemap", "Performance budget in CI"],
    featuresAr: ["حتى 12 صفحة بلغتين", "إدارة المحتوى", "بيانات مُهيكلة وخريطة موقع", "ميزانية أداء في CI"],
    popular: true,
  },
  {
    id: "pkg-ecom-starter", slug: "ecommerce-starter", category: "ecommerce", image: "/images/services/ecommerce.webp",
    titleEn: "E-commerce Starter", titleAr: "متجر البداية",
    descriptionEn: "A first storefront taking payment on day one.", descriptionAr: "أول متجر يستقبل المدفوعات من اليوم الأول.",
    price: 5600, currency: "JOD", billingType: "once",
    timelineEn: "7–10 weeks", timelineAr: "7–10 أسابيع",
    bestForEn: "First storefront, taking payment on day one.", bestForAr: "أول متجر، يستقبل المدفوعات من اليوم الأول.",
    featuresEn: ["Catalogue, cart and checkout", "Local and card payments", "Tax and shipping rules", "Admin dashboard"],
    featuresAr: ["كتالوج وسلة وإتمام شراء", "مدفوعات محلية وبطاقات", "قواعد الضريبة والشحن", "لوحة تحكم"],
  },
  {
    id: "pkg-ecom-pro", slug: "ecommerce-professional", category: "ecommerce", image: "/images/services/ecommerce.webp",
    titleEn: "E-commerce Professional", titleAr: "المتجر الاحترافي",
    descriptionEn: "Multi-market stores with real operations, multi-currency and fulfilment.", descriptionAr: "متاجر متعددة الأسواق بعمليات فعلية وعملات متعددة وتوصيل.",
    price: 9800, currency: "JOD", billingType: "once",
    timelineEn: "10–16 weeks", timelineAr: "10–16 أسبوعاً",
    bestForEn: "Multi-market stores with real operations.", bestForAr: "المتاجر متعددة الأسواق ذات عمليات فعلية.",
    featuresEn: ["Everything in E-commerce Starter", "Multi-currency and multi-language", "Inventory and fulfilment", "Conversion analytics pipeline"],
    featuresAr: ["كل ما في متجر البداية", "عملات ولغات متعددة", "المخزون والتوصيل", "مسار تحليلات التحويل"],
  },
  {
    id: "pkg-chatbot", slug: "ai-chatbot", category: "ai-software", image: "/images/services/ai-solutions.webp",
    titleEn: "AI Chatbot", titleAr: "روبوت محادثة ذكي",
    descriptionEn: "Retrieval over your own documents, evaluated before launch, with human escalation.", descriptionAr: "استرجاع من مستنداتك، مُقيَّم قبل الإطلاق، مع تصعيد بشري.",
    price: 2800, currency: "JOD", billingType: "once",
    timelineEn: "4–8 weeks", timelineAr: "4–8 أسابيع",
    bestForEn: "Support teams answering the same question daily.", bestForAr: "فرق الدعم التي تجيب السؤال نفسه يومياً.",
    featuresEn: ["Retrieval over your documents", "Evaluation set before launch", "Escalation to a human", "Arabic and English support"],
    featuresAr: ["استرجاع من مستنداتك", "مجموعة تقييم قبل الإطلاق", "تصعيد إلى موظف بشري", "دعم بالعربية والإنجليزية"],
  },
  {
    id: "pkg-automation", slug: "ai-automation-pkg", category: "ai-software", image: "/images/services/ai-automation.webp",
    titleEn: "AI Automation", titleAr: "الأتمتة بالذكاء الاصطناعي",
    descriptionEn: "One workflow automated end to end, with a baseline measured first.", descriptionAr: "أتمتة سير عمل واحد كاملاً، بخط أساس يُقاس أولاً.",
    price: 4200, currency: "JOD", billingType: "once",
    timelineEn: "6–14 weeks", timelineAr: "6–14 أسبوعاً",
    bestForEn: "Operations drowning in manual data entry.", bestForAr: "العمليات الغارقة في الإدخال اليدوي.",
    featuresEn: ["One workflow automated", "Baseline measured first", "Human review on costly steps", "Monitoring and alerting"],
    featuresAr: ["أتمتة سير عمل واحد", "قياس خط الأساس أولاً", "مراجعة بشرية للخطوات المكلفة", "الرصد والتنبيهات"],
    popular: true,
  },
  {
    id: "pkg-custom-software", slug: "custom-software", category: "ai-software", image: "/images/services/software-development.webp",
    titleEn: "Custom Software", titleAr: "برمجيات مخصّصة",
    descriptionEn: "A platform built to be owned, handed over with documentation and training.", descriptionAr: "منصة تُبنى لتملكها، تُسلَّم بوثائق وتدريب.",
    price: 7800, currency: "JOD", billingType: "once",
    timelineEn: "12–24 weeks", timelineAr: "12–24 أسبوعاً",
    bestForEn: "Platforms you intend to own, not rent.", bestForAr: "المنصات التي تنوي تملّكها لا استئجارها.",
    featuresEn: ["Discovery and domain modelling", "Clean architecture and tests", "CI/CD and observability", "Team training at handover"],
    featuresAr: ["استكشاف ونمذجة النطاق", "معمارية نظيفة واختبارات", "تكامل مستمر ورصد", "تدريب الفريق عند التسليم"],
  },
  {
    id: "pkg-enterprise-system", slug: "enterprise-system", category: "enterprise", image: "/images/services/cloud-solutions.webp",
    titleEn: "Enterprise System", titleAr: "نظام مؤسسي",
    descriptionEn: "Scoped individually for multi-team organisations with compliance needs.", descriptionAr: "يُحدَّد بشكل فردي للمؤسسات متعددة الفرق ذات متطلبات امتثال.",
    price: null, currency: "JOD", billingType: "custom",
    timelineEn: "Custom scope", timelineAr: "نطاق مخصّص",
    bestForEn: "Multi-team organisations with compliance needs.", bestForAr: "المؤسسات متعددة الفرق ذات متطلبات امتثال.",
    featuresEn: ["Architecture and security review", "Role-based access and audit trail", "Integration with existing systems", "Support and SLA"],
    featuresAr: ["مراجعة معمارية وأمنية", "صلاحيات حسب الدور وسجل تدقيق", "تكامل مع الأنظمة القائمة", "دعم واتفاقية مستوى خدمة"],
  },
];

export const getPackage = (slug: string) => PACKAGES.find((p) => p.slug === slug);
export const packageSlugs = () => PACKAGES.map((p) => p.slug);
export const packagesByCategory = (key: string) => PACKAGES.filter((p) => p.category === key);

/** The four subscription tiers shown as a pricing comparison, in order. */
export const SOCIAL_TIER_SLUGS = ["social-start", "social-growth-design", "complete-social-presence", "social-performance"] as const;
export const socialTiers = () => SOCIAL_TIER_SLUGS.map((s) => getPackage(s)!);
export const enterpriseSocial = () => getPackage("enterprise-social")!;

export const pkgTitle = (p: Package, locale: string) => (locale === "ar" ? p.titleAr : p.titleEn);
export const pkgDesc = (p: Package, locale: string) => (locale === "ar" ? p.descriptionAr : p.descriptionEn);
export const pkgFeatures = (p: Package, locale: string) => (locale === "ar" ? p.featuresAr : p.featuresEn);
export const pkgTimeline = (p: Package, locale: string) => (locale === "ar" ? p.timelineAr : p.timelineEn);
export const pkgBestFor = (p: Package, locale: string) => (locale === "ar" ? p.bestForAr : p.bestForEn);
