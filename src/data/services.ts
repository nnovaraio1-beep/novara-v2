/**
 * Twelve services. Each maps to its own cropped image under
 * public/images/services/. Shape matches the spec exactly:
 * id, slug, category, image, titleEn/Ar, descriptionEn/Ar, price, currency,
 * billingType, timeline, featuresEn/Ar — plus detail-page fields.
 *
 * `price` is whole JOD (null = custom quote). No component duplicates this data.
 */
export type Billing = "monthly" | "once" | "custom";

export interface Service {
  id: string;
  slug: string;
  group: "social" | "design" | "web" | "software" | "ai" | "cloud";
  category: string;
  image: string;
  titleEn: string; titleAr: string;
  valueEn: string; valueAr: string;
  descriptionEn: string; descriptionAr: string;
  price: number | null; currency: "JOD"; billingType: Billing;
  timelineEn: string; timelineAr: string;
  bestForEn: string; bestForAr: string;
  featuresEn: string[]; featuresAr: string[];
  processEn: string[]; processAr: string[];
  feature?: boolean;
}

export const SERVICES: Service[] = [
  {
    id: "svc-social", slug: "social-media-management", group: "social", feature: true,
    category: "Social & Growth", image: "/images/services/social-media-management.webp",
    titleEn: "Social Media Management", titleAr: "إدارة منصات التواصل",
    valueEn: "A managed presence that reports against results you can bank, not reach you cannot spend.",
    valueAr: "حضور مُدار يقدّم تقاريره بنتائج يمكنك الاعتماد عليها، لا بانتشار لا يمكنك إنفاقه.",
    descriptionEn: "Most feeds fail on consistency, not creativity. We plan a month ahead, design every asset, write in your voice, manage the community, and report monthly against a baseline taken before we start.",
    descriptionAr: "معظم الصفحات تفشل في الانتظام لا في الإبداع. نخطّط لشهر مقدماً، ونصمّم كل عنصر، ونكتب بصوتك، وندير المجتمع، ونقدّم تقريراً شهرياً مقابل خط أساس يُؤخذ قبل أن نبدأ.",
    price: 250, currency: "JOD", billingType: "monthly",
    timelineEn: "Monthly subscription", timelineAr: "اشتراك شهري",
    bestForEn: "Brands that want a consistent, measured presence.", bestForAr: "العلامات التي تريد حضوراً متسقاً ومقاساً.",
    featuresEn: ["Content calendar and captions", "Post, story and reel design", "Community management", "Monthly performance report"],
    featuresAr: ["تقويم محتوى ونصوص", "تصميم منشورات وقصص وريلز", "إدارة المجتمع", "تقرير أداء شهري"],
    processEn: ["Baseline and strategy", "Calendar and design", "Publish and engage", "Report and adjust"],
    processAr: ["خط الأساس والاستراتيجية", "التقويم والتصميم", "النشر والتفاعل", "التقرير والتعديل"],
  },
  {
    id: "svc-marketing", slug: "digital-marketing", group: "social",
    category: "Social & Growth", image: "/images/services/digital-marketing.webp",
    titleEn: "Digital Marketing", titleAr: "التسويق الرقمي والإعلانات",
    valueEn: "Paid campaigns measured by cost per qualified lead, optimised weekly.",
    valueAr: "حملات مدفوعة تُقاس بتكلفة العميل المحتمل المؤهَّل، وتُحسَّن أسبوعياً.",
    descriptionEn: "We set up tracking properly, target the right audiences, run retargeting, and review spend weekly. If a channel is not working, we say so in month one rather than spending your budget to look busy.",
    descriptionAr: "نُعدّ التتبّع بشكل صحيح، ونستهدف الجماهير الصحيحة، ونشغّل إعادة الاستهداف، ونراجع الإنفاق أسبوعياً. وإن كانت قناة لا تعمل، نقولها في الشهر الأول بدل إنفاق ميزانيتك لنبدو مشغولين.",
    price: 1500, currency: "JOD", billingType: "monthly",
    timelineEn: "Monthly subscription", timelineAr: "اشتراك شهري",
    bestForEn: "Brands buying reach and measuring leads.", bestForAr: "العلامات التي تشتري الوصول وتقيس العملاء المحتملين.",
    featuresEn: ["Campaign setup and tracking", "Audience and retargeting", "Weekly optimisation", "Lead and spend reporting"],
    featuresAr: ["إعداد الحملات والتتبّع", "الجمهور وإعادة الاستهداف", "تحسين أسبوعي", "تقارير العملاء والإنفاق"],
    processEn: ["Audit and tracking", "Creative and targeting", "Launch and optimise", "Report on leads"],
    processAr: ["التدقيق والتتبّع", "التصميم والاستهداف", "الإطلاق والتحسين", "التقرير بالعملاء"],
  },
  {
    id: "svc-graphic", slug: "graphic-design", group: "design",
    category: "Design & Branding", image: "/images/services/graphic-design.webp",
    titleEn: "Graphic Design", titleAr: "التصميم الجرافيكي",
    valueEn: "A design retainer that keeps your feed and campaigns consistently on-brand.",
    valueAr: "عقد تصميم شهري يبقي صفحاتك وحملاتك متسقة مع هويتك.",
    descriptionEn: "A monthly design partnership: you bring the brief, we return polished, on-brand creative — social, print or ad — in both Arabic and Latin typesetting.",
    descriptionAr: "شراكة تصميم شهرية: تقدّم الموجز، ونعيد تصاميم مصقولة متسقة مع الهوية — اجتماعية أو مطبوعة أو إعلانية — بتنضيد عربي ولاتيني.",
    price: 300, currency: "JOD", billingType: "monthly",
    timelineEn: "Monthly retainer", timelineAr: "عقد شهري",
    bestForEn: "Teams that need a steady stream of on-brand design.", bestForAr: "الفرق التي تحتاج تدفقاً ثابتاً من التصاميم المتسقة.",
    featuresEn: ["Social and ad creative", "Carousels and stories", "Print-ready artwork", "Editable source files"],
    featuresAr: ["تصاميم اجتماعية وإعلانية", "دوّارات وقصص", "أعمال جاهزة للطباعة", "ملفات مصدرية قابلة للتعديل"],
    processEn: ["Brief", "Design", "Review", "Deliver"], processAr: ["الموجز", "التصميم", "المراجعة", "التسليم"],
  },
  {
    id: "svc-branding", slug: "branding", group: "design", feature: true,
    category: "Design & Branding", image: "/images/services/branding.webp",
    titleEn: "Branding & Visual Identity", titleAr: "الهوية البصرية والبراندينج",
    valueEn: "An identity system with rules, not just a logo file.",
    valueAr: "نظام هوية بقواعد، لا مجرد ملف شعار.",
    descriptionEn: "A complete identity: a bilingual wordmark, colour and type scales, packaging and print mockups, and usage guidelines with real examples — tested side by side in both scripts before delivery.",
    descriptionAr: "هوية كاملة: علامة نصية بلغتين، ومقاييس ألوان وخطوط، ونماذج تغليف وطباعة، وإرشادات استخدام بأمثلة حقيقية — مُختبَرة جنباً إلى جنب بالحرفين قبل التسليم.",
    price: 2400, currency: "JOD", billingType: "once",
    timelineEn: "5–9 weeks", timelineAr: "5–9 أسابيع",
    bestForEn: "Brands launching or repositioning.", bestForAr: "العلامات المُطلَقة حديثاً أو المُعاد تموضعها.",
    featuresEn: ["Bilingual wordmark", "Colour and type system", "Packaging and print mockups", "Usage guidelines"],
    featuresAr: ["علامة نصية بلغتين", "نظام ألوان وخطوط", "نماذج تغليف وطباعة", "إرشادات الاستخدام"],
    processEn: ["Discovery", "Concepts", "Refinement", "Guidelines"], processAr: ["الاستكشاف", "المفاهيم", "التنقيح", "الإرشادات"],
  },
  {
    id: "svc-video", slug: "ai-video-production", group: "design",
    category: "Design & Branding", image: "/images/services/ai-video-production.webp",
    titleEn: "AI Video Production", titleAr: "إنتاج الفيديو الإعلاني بالذكاء الاصطناعي",
    valueEn: "A commercial in two weeks, not two months — AI accelerates, a human signs off.",
    valueAr: "إعلان في أسبوعين لا في شهرين — الذكاء الاصطناعي يسرّع، والبشر يعتمدون.",
    descriptionEn: "Script, storyboard, AI-generated scenes, Arabic and English voice-over, subtitles and Reel cut-downs. AI does the heavy lifting; direction and final approval stay human.",
    descriptionAr: "نص ولوحة قصصية ومشاهد بالذكاء الاصطناعي وتعليق صوتي بالعربية والإنجليزية وترجمة ونسخ قصيرة للريلز. الذكاء الاصطناعي يؤدي العمل الثقيل؛ والإخراج والاعتماد النهائي يبقيان بشريين.",
    price: 400, currency: "JOD", billingType: "once",
    timelineEn: "3–6 weeks", timelineAr: "3–6 أسابيع",
    bestForEn: "Brands that need video fast, on a budget.", bestForAr: "العلامات التي تحتاج فيديو بسرعة وبميزانية.",
    featuresEn: ["Script and storyboard", "AI-generated scenes", "Bilingual voice-over", "Subtitles and Reel cuts"],
    featuresAr: ["نص ولوحة قصصية", "مشاهد بالذكاء الاصطناعي", "تعليق صوتي بلغتين", "ترجمة ونسخ للريلز"],
    processEn: ["Script", "Generate", "Edit", "Deliver"], processAr: ["النص", "التوليد", "المونتاج", "التسليم"],
  },
  {
    id: "svc-web", slug: "web-development", group: "web", feature: true,
    category: "Websites & Commerce", image: "/images/services/web-development.webp",
    titleEn: "Web Development", titleAr: "تطوير المواقع",
    valueEn: "Sites measured by qualified enquiries and speed, not page views.",
    valueAr: "مواقع تُقاس بالاستفسارات المؤهَّلة والسرعة لا بالزيارات.",
    descriptionEn: "RTL-first from the wireframe, not retrofitted. A CMS your marketers can run, structured data, and a performance budget enforced in CI so it stays fast after launch.",
    descriptionAr: "بالعربية أولاً منذ المخطط لا كإضافة لاحقة. نظام محتوى يديره فريق التسويق، وبيانات مُهيكلة، وميزانية أداء مفروضة في التكامل المستمر لتبقى سريعة بعد الإطلاق.",
    price: 3200, currency: "JOD", billingType: "once",
    timelineEn: "4–10 weeks", timelineAr: "4–10 أسابيع",
    bestForEn: "Companies that need to be found and trusted.", bestForAr: "الشركات التي تريد أن تُوجد ويُوثق بها.",
    featuresEn: ["Bilingual, RTL-first build", "Content management", "Analytics and search console", "Performance budget in CI"],
    featuresAr: ["بناء ثنائي اللغة بالعربية أولاً", "إدارة المحتوى", "التحليلات وأدوات المواقع", "ميزانية أداء في CI"],
    processEn: ["Wireframe", "Design", "Build", "Launch"], processAr: ["المخطط", "التصميم", "التطوير", "الإطلاق"],
  },
  {
    id: "svc-ecom", slug: "ecommerce", group: "web", feature: true,
    category: "Websites & Commerce", image: "/images/services/ecommerce.webp",
    titleEn: "E-commerce", titleAr: "التجارة الإلكترونية",
    valueEn: "A store that takes payment on day one, in three steps.",
    valueAr: "متجر يستقبل المدفوعات من اليوم الأول، في ثلاث خطوات.",
    descriptionEn: "Catalogue, cart and checkout, local and card payments, tax and shipping rules, and abandoned-cart recovery — headline metric is checkout completion rate, nothing softer.",
    descriptionAr: "كتالوج وسلة وإتمام شراء، ومدفوعات محلية وبطاقات، وقواعد ضريبة وشحن، واسترجاع السلات المتروكة — المقياس الرئيسي هو معدّل إتمام الشراء، لا شيء أقل.",
    price: 5600, currency: "JOD", billingType: "once",
    timelineEn: "7–14 weeks", timelineAr: "7–14 أسبوعاً",
    bestForEn: "Brands selling direct to customers.", bestForAr: "العلامات التي تبيع مباشرة للعملاء.",
    featuresEn: ["Catalogue, cart, checkout", "Local and card payments", "Tax and shipping rules", "Abandoned-cart recovery"],
    featuresAr: ["كتالوج وسلة وإتمام شراء", "مدفوعات محلية وبطاقات", "قواعد الضريبة والشحن", "استرجاع السلات المتروكة"],
    processEn: ["Model", "Build", "Integrate", "Launch"], processAr: ["النمذجة", "التطوير", "التكامل", "الإطلاق"],
  },
  {
    id: "svc-software", slug: "software-development", group: "software", feature: true,
    category: "Software & Mobile", image: "/images/services/software-development.webp",
    titleEn: "Software Development", titleAr: "تطوير البرمجيات",
    valueEn: "Platforms your team can run without us, from day one after handover.",
    valueAr: "منصات يشغّلها فريقك دوننا، منذ اليوم الأول بعد التسليم.",
    descriptionEn: "Discovery, domain modelling, clean architecture and tests, CI/CD and observability, documentation and runbooks, and team training at handover. Built to be maintained.",
    descriptionAr: "استكشاف ونمذجة نطاق، ومعمارية نظيفة واختبارات، وتكامل مستمر ورصد، وتوثيق وأدلة تشغيل، وتدريب الفريق عند التسليم. مبنية لتُصان.",
    price: 7800, currency: "JOD", billingType: "once",
    timelineEn: "12–24 weeks", timelineAr: "12–24 أسبوعاً",
    bestForEn: "Products you intend to own, not rent.", bestForAr: "المنتجات التي تنوي تملّكها لا استئجارها.",
    featuresEn: ["Domain modelling and tests", "CI/CD and observability", "Documentation and runbooks", "Team training"],
    featuresAr: ["نمذجة النطاق والاختبارات", "تكامل مستمر ورصد", "توثيق وأدلة تشغيل", "تدريب الفريق"],
    processEn: ["Discovery", "Architecture", "Build", "Handover"], processAr: ["الاستكشاف", "المعمارية", "التطوير", "التسليم"],
  },
  {
    id: "svc-mobile", slug: "mobile-app-development", group: "software",
    category: "Software & Mobile", image: "/images/services/mobile-app-development.webp",
    titleEn: "Mobile App Development", titleAr: "تطوير تطبيقات الجوال",
    valueEn: "Installs that survive the first week, measured by day-7 retention.",
    valueAr: "تنزيلات تصمد بعد الأسبوع الأول، تُقاس بالاحتفاظ في اليوم السابع.",
    descriptionEn: "One codebase for iOS and Android, offline-first behaviour, push notifications and deep links, store submission handled, and crash and performance monitoring from launch.",
    descriptionAr: "شيفرة واحدة لـ iOS وأندرويد، وسلوك دون اتصال أولاً، وإشعارات فورية وروابط عميقة، وتولّي رفع التطبيق للمتاجر، ورصد الأعطال والأداء من الإطلاق.",
    price: 9800, currency: "JOD", billingType: "once",
    timelineEn: "14–22 weeks", timelineAr: "14–22 أسبوعاً",
    bestForEn: "Products that live on a phone, offline-first.", bestForAr: "المنتجات التي تعيش على الهاتف، دون اتصال أولاً.",
    featuresEn: ["iOS and Android from one codebase", "Offline-first behaviour", "Push and deep links", "Store submission and monitoring"],
    featuresAr: ["iOS وأندرويد من شيفرة واحدة", "سلوك دون اتصال أولاً", "إشعارات وروابط عميقة", "الرفع والرصد"],
    processEn: ["Design", "Build", "Test", "Ship"], processAr: ["التصميم", "التطوير", "الاختبار", "الإطلاق"],
  },
  {
    id: "svc-ai", slug: "ai-solutions", group: "ai", feature: true,
    category: "AI & Automation", image: "/images/services/ai-solutions.webp",
    titleEn: "AI Solutions", titleAr: "حلول الذكاء الاصطناعي",
    valueEn: "AI you can trust in production, because it is measured before it ships.",
    valueAr: "ذكاء اصطناعي تثق به في الإنتاج، لأنه يُقاس قبل إطلاقه.",
    descriptionEn: "Retrieval over your own documents, an evaluation set scored before launch, human review on costly decisions, and a cost-and-latency dashboard. If the achievable quality is not good enough, you hear it in week two.",
    descriptionAr: "استرجاع من مستنداتك، ومجموعة تقييم مُقيَّمة قبل الإطلاق، ومراجعة بشرية للقرارات المكلفة، ولوحة للتكلفة وزمن الاستجابة. وإن كانت الجودة الممكنة غير كافية، تسمعها في الأسبوع الثاني.",
    price: 4200, currency: "JOD", billingType: "once",
    timelineEn: "8–20 weeks", timelineAr: "8–20 أسبوعاً",
    bestForEn: "Teams putting AI into production, carefully.", bestForAr: "الفرق التي تُدخل الذكاء الاصطناعي للإنتاج بعناية.",
    featuresEn: ["Retrieval over your documents", "Evaluation set before launch", "Human review on key decisions", "Cost and latency dashboard"],
    featuresAr: ["استرجاع من مستنداتك", "مجموعة تقييم قبل الإطلاق", "مراجعة بشرية للقرارات المهمة", "لوحة التكلفة والاستجابة"],
    processEn: ["Evaluate", "Build", "Measure", "Deploy"], processAr: ["التقييم", "التطوير", "القياس", "النشر"],
  },
  {
    id: "svc-automation", slug: "ai-automation", group: "ai",
    category: "AI & Automation", image: "/images/services/ai-automation.webp",
    titleEn: "AI Automation", titleAr: "الأتمتة والذكاء الاصطناعي",
    valueEn: "Operations freed from manual data entry, with an honest go / no-go call.",
    valueAr: "عمليات مُحرَّرة من الإدخال اليدوي، بتوصية صريحة بالمضي أو التوقف.",
    descriptionEn: "We pick one workflow drowning in manual work, measure the baseline, automate it end to end with human review on costly steps, add monitoring and alerting, and give you an honest recommendation on whether to expand.",
    descriptionAr: "نختار سير عمل واحداً غارقاً في العمل اليدوي، ونقيس خط الأساس، ونؤتمته كاملاً مع مراجعة بشرية للخطوات المكلفة، ونضيف الرصد والتنبيهات، ونعطيك توصية صريحة حول التوسّع.",
    price: 4200, currency: "JOD", billingType: "once",
    timelineEn: "6–14 weeks", timelineAr: "6–14 أسبوعاً",
    bestForEn: "Operations drowning in manual data entry.", bestForAr: "العمليات الغارقة في الإدخال اليدوي.",
    featuresEn: ["One workflow automated", "Baseline measured first", "Human review on costly steps", "Monitoring and alerting"],
    featuresAr: ["أتمتة سير عمل واحد", "قياس خط الأساس أولاً", "مراجعة بشرية للخطوات المكلفة", "الرصد والتنبيهات"],
    processEn: ["Map", "Baseline", "Automate", "Monitor"], processAr: ["الرسم", "خط الأساس", "الأتمتة", "الرصد"],
  },
  {
    id: "svc-cloud", slug: "cloud-solutions", group: "cloud",
    category: "Cloud & Infrastructure", image: "/images/services/cloud-solutions.webp",
    titleEn: "Cloud & Infrastructure", titleAr: "الحلول السحابية والبنية التحتية",
    valueEn: "Infrastructure that scales with you and is reproducible from a repository.",
    valueAr: "بنية تحتية تتوسّع معك وقابلة لإعادة الإنشاء من مستودع.",
    descriptionEn: "Infrastructure as code, CI/CD pipelines, monitoring and alerting, backups and disaster recovery, and a security baseline. Everything is reproducible from a repository, so there is no server only one person understands.",
    descriptionAr: "بنية تحتية كشيفرة، ومسارات تكامل ونشر مستمر، ورصد وتنبيهات، ونسخ احتياطي وتعافٍ من الكوارث، وخط أساس أمني. كل شيء قابل لإعادة الإنشاء من مستودع، فلا يوجد خادم يفهمه شخص واحد فقط.",
    price: 3600, currency: "JOD", billingType: "once",
    timelineEn: "4–12 weeks", timelineAr: "4–12 أسبوعاً",
    bestForEn: "Teams that need reliable, reproducible infrastructure.", bestForAr: "الفرق التي تحتاج بنية تحتية موثوقة وقابلة لإعادة الإنشاء.",
    featuresEn: ["Infrastructure as code", "CI/CD pipelines", "Monitoring and backups", "Security baseline"],
    featuresAr: ["بنية تحتية كشيفرة", "مسارات تكامل ونشر", "رصد ونسخ احتياطي", "خط أساس أمني"],
    processEn: ["Assess", "Provision", "Migrate", "Operate"], processAr: ["التقييم", "التهيئة", "الترحيل", "التشغيل"],
  },
];

export const SERVICE_GROUPS = ["social", "design", "web", "software", "ai", "cloud"] as const;
export type ServiceGroup = (typeof SERVICE_GROUPS)[number];

export const groupTitles: Record<ServiceGroup, { en: string; ar: string; intro_en: string; intro_ar: string }> = {
  social:   { en: "Social Media & Growth", ar: "التواصل الاجتماعي والنمو",
              intro_en: "We run the channels and buy the reach — content, community and paid, reported against results you can bank.",
              intro_ar: "ندير القنوات ونشتري الوصول — محتوى ومجتمع وإعلانات مدفوعة، بتقارير بنتائج يمكنك الاعتماد عليها." },
  design:   { en: "Design & Branding", ar: "التصميم والهوية",
              intro_en: "Identity, creative and video. Defined in Arabic and Latin script from the first sketch.",
              intro_ar: "هوية وإبداع وفيديو. تُعرَّف بالحرفين العربي واللاتيني منذ أول رسم." },
  web:      { en: "Websites & E-commerce", ar: "المواقع والتجارة الإلكترونية",
              intro_en: "Bilingual sites and stores measured by speed and completed checkouts, not page views.",
              intro_ar: "مواقع ومتاجر ثنائية اللغة تُقاس بالسرعة وعمليات الشراء المكتملة لا بالزيارات." },
  software: { en: "Software & Mobile Apps", ar: "البرمجيات وتطبيقات الجوال",
              intro_en: "Custom platforms and apps built to be owned, handed over with documentation and a team who can run them.",
              intro_ar: "منصات وتطبيقات مخصّصة تُبنى لتملكها، تُسلَّم بوثائق وفريق قادر على تشغيلها." },
  ai:       { en: "AI & Automation", ar: "الذكاء الاصطناعي والأتمتة",
              intro_en: "Production AI with an evaluation harness, not a demo. Measured before it ships.",
              intro_ar: "ذكاء اصطناعي جاهز للإنتاج مع منظومة تقييم، لا عرض تجريبي. يُقاس قبل إطلاقه." },
  cloud:    { en: "Cloud & Infrastructure", ar: "الحلول السحابية والبنية التحتية",
              intro_en: "Secure, scalable infrastructure provisioned as code — reproducible from a repository.",
              intro_ar: "بنية تحتية آمنة وقابلة للتوسّع تُهيّأ كشيفرة — قابلة لإعادة الإنشاء من مستودع." },
};

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);
export const serviceSlugs = () => SERVICES.map((s) => s.slug);
