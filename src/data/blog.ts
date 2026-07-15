/** Blog posts (typed, bilingual). Starter editorial content the owner can replace/extend. */
export interface Post {
  slug: string; image: string; dateISO: string;
  titleEn: string; titleAr: string; excerptEn: string; excerptAr: string;
  bodyEn: string[]; bodyAr: string[]; category: string;
}

export const POSTS: Post[] = [
  {
    slug: "why-arabic-first-design", image: "/images/services/branding.webp", dateISO: "2026-05-12", category: "Design",
    titleEn: "Why we design Arabic-first, not Arabic-last",
    titleAr: "لماذا نصمّم بالعربية أولاً لا أخيراً",
    excerptEn: "Retrofitting Arabic onto a Latin layout breaks in ways you only see after launch. Here is how we avoid it.",
    excerptAr: "إضافة العربية على تخطيط لاتيني تنكسر بطرق لا تراها إلا بعد الإطلاق. إليك كيف نتجنّب ذلك.",
    bodyEn: [
      "Most bilingual sites are built in English and translated at the end. The result is Arabic that technically renders but feels borrowed — line heights too tight, punctuation on the wrong side, numerals that switch systems mid-sentence.",
      "We design both scripts side by side from the first wireframe. RTL is native, type scales are tested in Arabic before sign-off, and Western digits are pinned so prices never flip. It costs a little more up front and saves a rebuild later.",
    ],
    bodyAr: [
      "تُبنى معظم المواقع ثنائية اللغة بالإنجليزية وتُترجم في النهاية. والنتيجة عربية تظهر تقنياً لكنها تبدو مستعارة — ارتفاعات أسطر ضيقة، وعلامات ترقيم في الجهة الخطأ، وأرقام تبدّل نظامها في منتصف الجملة.",
      "نصمّم الحرفين جنباً إلى جنب منذ أول مخطط. العربية أصيلة، ومقاييس الخطوط تُختبر بالعربية قبل الاعتماد، والأرقام الغربية مثبّتة فلا تنقلب الأسعار. يكلّف هذا قليلاً في البداية ويوفّر إعادة بناء لاحقاً.",
    ],
  },
  {
    slug: "measuring-before-shipping-ai", image: "/images/services/ai-solutions.webp", dateISO: "2026-04-28", category: "AI",
    titleEn: "We measure AI before we ship it",
    titleAr: "نقيس الذكاء الاصطناعي قبل إطلاقه",
    excerptEn: "A demo that works once is not a product. Here is the evaluation harness we put around every model.",
    excerptAr: "عرض يعمل مرة واحدة ليس منتجاً. إليك منظومة التقييم التي نضعها حول كل نموذج.",
    bodyEn: [
      "The gap between an impressive demo and a dependable feature is measurement. Before anything reaches users we build an evaluation set — real questions, graded answers — and score against it.",
      "If the achievable quality is not good enough, we say so in week two rather than after launch. Human review stays on the costly decisions, and a dashboard tracks cost and latency in production.",
    ],
    bodyAr: [
      "الفارق بين عرض مبهر وميزة موثوقة هو القياس. قبل أن يصل أي شيء للمستخدمين نبني مجموعة تقييم — أسئلة حقيقية وإجابات مُقيَّمة — ونقيس مقابلها.",
      "وإن كانت الجودة الممكنة غير كافية، نقولها في الأسبوع الثاني لا بعد الإطلاق. تبقى المراجعة البشرية على القرارات المكلفة، وتتابع لوحة التكلفة وزمن الاستجابة في الإنتاج.",
    ],
  },
  {
    slug: "social-metrics-that-matter", image: "/images/services/social-media-management.webp", dateISO: "2026-04-10", category: "Social",
    titleEn: "The social metrics worth reporting",
    titleAr: "مقاييس التواصل الاجتماعي التي تستحق التقرير",
    excerptEn: "Reach and followers are easy to grow and easy to fake. We report against a baseline you can bank.",
    excerptAr: "الوصول والمتابعون سهلا النمو وسهلا التزييف. نحن نقدّم التقارير مقابل خط أساس يمكنك الاعتماد عليه.",
    bodyEn: [
      "Vanity metrics move without meaning. A post can reach thousands and sell nothing. We take a baseline before we start and report against outcomes — saved posts, profile visits, qualified messages.",
      "Advertising spend, when it applies, is paid directly to the platform so you keep full visibility. Our fee is for the work, never the media budget.",
    ],
    bodyAr: [
      "المقاييس المظهرية تتحرّك بلا معنى. قد يصل منشور إلى الآلاف ولا يبيع شيئاً. نأخذ خط أساس قبل أن نبدأ ونقدّم التقارير مقابل النتائج — المنشورات المحفوظة، وزيارات الملف، والرسائل المؤهَّلة.",
      "وميزانية الإعلانات، عند وجودها، تُدفع مباشرة للمنصّة لتبقى لديك رؤية كاملة. أتعابنا مقابل العمل لا مقابل ميزانية الإعلان.",
    ],
  },
];

export const getPost = (slug: string) => POSTS.find((p) => p.slug === slug);
export const postSlugs = () => POSTS.map((p) => p.slug);
export const postTitle = (p: Post, locale: string) => (locale === "ar" ? p.titleAr : p.titleEn);
export const postExcerpt = (p: Post, locale: string) => (locale === "ar" ? p.excerptAr : p.excerptEn);
export const postBody = (p: Post, locale: string) => (locale === "ar" ? p.bodyAr : p.bodyEn);
