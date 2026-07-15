/** Store category order is the rendered order. Not alphabetical, not by price. */
export interface Category {
  key: string;
  group: "monthly" | "onetime" | "custom";
  titleEn: string;
  titleAr: string;
  introEn: string;
  introAr: string;
}

export const CATEGORIES: Category[] = [
  { key: "social-monthly", group: "monthly",
    titleEn: "Social Media Monthly Packages", titleAr: "باقات التواصل الاجتماعي الشهرية",
    introEn: "Managed social presence billed monthly. Change tier or cancel at the end of any month.",
    introAr: "حضور اجتماعي مُدار يُفوتر شهرياً. غيّر الباقة أو ألغِ في نهاية أي شهر." },
  { key: "social-design", group: "onetime",
    titleEn: "Social Media + Graphic Design", titleAr: "التواصل الاجتماعي + التصميم الجرافيكي",
    introEn: "Design kits and creative packages for teams posting in-house.",
    introAr: "حقائب تصميم وباقات إبداعية للفرق التي تنشر داخلياً." },
  { key: "social-video", group: "onetime",
    titleEn: "Social Media + AI Video", titleAr: "التواصل الاجتماعي + الفيديو بالذكاء الاصطناعي",
    introEn: "Reels and commercials produced with AI, directed by a human.",
    introAr: "ريلز وإعلانات تُنتَج بالذكاء الاصطناعي، بإشراف مخرج بشري." },
  { key: "branding", group: "onetime",
    titleEn: "Branding Packages", titleAr: "باقات الهوية البصرية",
    introEn: "Identity systems delivered once, priced once — bilingual from the first sketch.",
    introAr: "أنظمة هوية تُسلَّم مرة وتُسعَّر مرة — بلغتين منذ أول رسم." },
  { key: "website", group: "onetime",
    titleEn: "Website Packages", titleAr: "باقات المواقع",
    introEn: "Fixed-scope bilingual websites, RTL-first from the wireframe.",
    introAr: "مواقع ثنائية اللغة بنطاق ثابت، بالعربية أولاً منذ المخطط." },
  { key: "ecommerce", group: "onetime",
    titleEn: "E-commerce Packages", titleAr: "باقات التجارة الإلكترونية",
    introEn: "Storefronts measured by completed checkouts, not page views.",
    introAr: "متاجر تُقاس بعمليات الشراء المكتملة لا بالزيارات." },
  { key: "ai-software", group: "onetime",
    titleEn: "AI & Software Solutions", titleAr: "حلول الذكاء الاصطناعي والبرمجيات",
    introEn: "Production AI and custom software, measured before anything ships.",
    introAr: "ذكاء اصطناعي جاهز للإنتاج وبرمجيات مخصّصة، تُقاس قبل إطلاق أي شيء." },
  { key: "enterprise", group: "custom",
    titleEn: "Enterprise Custom Solutions", titleAr: "الحلول المؤسسية المخصّصة",
    introEn: "Scoped individually for multi-brand and multi-branch organisations.",
    introAr: "تُحدَّد بشكل فردي للمؤسسات متعددة العلامات والفروع." },
];

export const categoryTitle = (c: Category, locale: string) => (locale === "ar" ? c.titleAr : c.titleEn);
export const categoryIntro = (c: Category, locale: string) => (locale === "ar" ? c.introAr : c.introEn);
