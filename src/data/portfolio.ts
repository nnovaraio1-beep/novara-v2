/** Concept portfolio projects — clearly labelled as concept work, never as real client engagements. */
export interface Project {
  slug: string; image: string; category: string;
  titleEn: string; titleAr: string; summaryEn: string; summaryAr: string;
  briefEn: string; briefAr: string; approachEn: string[]; approachAr: string[];
  disciplinesEn: string[]; disciplinesAr: string[];
}

export const PROJECTS: Project[] = [
  { slug: "atlas-rebrand", image: "/images/services/branding.webp", category: "Branding",
    titleEn: "Atlas — identity concept", titleAr: "أطلس — مفهوم هوية",
    summaryEn: "A bilingual identity system for a fictional logistics brand.", summaryAr: "نظام هوية ثنائي اللغة لعلامة لوجستية افتراضية.",
    briefEn: "A concept exercise: build a full identity that reads as confidently in Arabic as in Latin, with packaging and print mockups.",
    briefAr: "تمرين تصوّري: بناء هوية كاملة تُقرأ بثقة بالعربية كما باللاتينية، مع نماذج تغليف وطباعة.",
    approachEn: ["Bilingual wordmark designed in parallel", "Colour and type scales tested in both scripts", "Packaging and stationery mockups", "A short usage guideline set"],
    approachAr: ["علامة نصية بلغتين صُمّمت بالتوازي", "مقاييس ألوان وخطوط اختُبرت بالحرفين", "نماذج تغليف وقرطاسية", "مجموعة إرشادات استخدام مختصرة"],
    disciplinesEn: ["Branding", "Print"], disciplinesAr: ["الهوية البصرية", "الطباعة"] },
  { slug: "meydan-commerce", image: "/images/services/ecommerce.webp", category: "E-commerce",
    titleEn: "Meydan — storefront concept", titleAr: "ميدان — مفهوم متجر",
    summaryEn: "A checkout-focused storefront concept for a fictional retailer.", summaryAr: "مفهوم متجر يركّز على إتمام الشراء لبائع تجزئة افتراضي.",
    briefEn: "Design a store whose single headline metric is checkout completion, bilingual and fast on a mid-range phone.",
    briefAr: "تصميم متجر مقياسه الرئيسي الوحيد هو إتمام الشراء، ثنائي اللغة وسريع على هاتف متوسط.",
    approachEn: ["Three-step checkout flow", "Local and card payment surfaces", "RTL-first product grid", "Sub-second load target"],
    approachAr: ["تدفّق إتمام شراء من ثلاث خطوات", "واجهات دفع محلية وبطاقات", "شبكة منتجات بالعربية أولاً", "هدف تحميل أقل من ثانية"],
    disciplinesEn: ["E-commerce", "Web"], disciplinesAr: ["التجارة الإلكترونية", "المواقع"] },
  { slug: "nova-campaign", image: "/images/services/ai-video-production.webp", category: "AI Video",
    titleEn: "Nova — launch film concept", titleAr: "نوفا — مفهوم فيلم إطلاق",
    summaryEn: "A concept launch film produced with AI and directed by a human.", summaryAr: "فيلم إطلاق تصوّري أُنتج بالذكاء الاصطناعي وأخرجه إنسان.",
    briefEn: "Show how AI video production compresses a two-month commercial into two weeks without losing direction.",
    briefAr: "إظهار كيف يختصر إنتاج الفيديو بالذكاء الاصطناعي إعلاناً من شهرين إلى أسبوعين دون فقدان الإخراج.",
    approachEn: ["Script and storyboard", "AI-generated scenes", "Bilingual voice-over", "Reel cut-downs for social"],
    approachAr: ["نص ولوحة قصصية", "مشاهد بالذكاء الاصطناعي", "تعليق صوتي بلغتين", "نسخ قصيرة للريلز"],
    disciplinesEn: ["AI Video", "Social"], disciplinesAr: ["فيديو بالذكاء الاصطناعي", "التواصل"] },
  { slug: "orbit-platform", image: "/images/services/software-development.webp", category: "Software",
    titleEn: "Orbit — platform concept", titleAr: "أوربت — مفهوم منصّة",
    summaryEn: "An internal-tools platform concept built to be owned.", summaryAr: "مفهوم منصّة أدوات داخلية مبنية لتُملَك.",
    briefEn: "Demonstrate a custom platform delivered with documentation, tests and training — no black boxes.",
    briefAr: "إظهار منصّة مخصّصة تُسلَّم بوثائق واختبارات وتدريب — بلا صناديق سوداء.",
    approachEn: ["Domain modelling", "Clean architecture with tests", "CI/CD and observability", "Handover documentation"],
    approachAr: ["نمذجة النطاق", "معمارية نظيفة مع اختبارات", "تكامل مستمر ورصد", "وثائق التسليم"],
    disciplinesEn: ["Software", "Cloud"], disciplinesAr: ["البرمجيات", "السحابة"] },
  { slug: "pulse-social", image: "/images/services/social-media-management.webp", category: "Social",
    titleEn: "Pulse — social system concept", titleAr: "بَلْس — مفهوم نظام اجتماعي",
    summaryEn: "A monthly social system concept with a measurable baseline.", summaryAr: "مفهوم نظام اجتماعي شهري بخط أساس قابل للقياس.",
    briefEn: "Show a month of managed social content planned, designed and reported against outcomes.",
    briefAr: "إظهار شهر من المحتوى الاجتماعي المُدار مُخطَّطاً ومُصمَّماً ومُقاساً مقابل النتائج.",
    approachEn: ["Content calendar", "Post and story design system", "Community playbook", "Outcome-based monthly report"],
    approachAr: ["تقويم محتوى", "نظام تصميم منشورات وقصص", "دليل إدارة مجتمع", "تقرير شهري قائم على النتائج"],
    disciplinesEn: ["Social", "Design"], disciplinesAr: ["التواصل", "التصميم"] },
  { slug: "vertex-ai", image: "/images/services/ai-solutions.webp", category: "AI",
    titleEn: "Vertex — AI assistant concept", titleAr: "فيرتكس — مفهوم مساعد ذكي",
    summaryEn: "A retrieval assistant concept with an evaluation harness.", summaryAr: "مفهوم مساعد استرجاع مع منظومة تقييم.",
    briefEn: "Illustrate a production-grade AI assistant measured before launch, with human review on costly steps.",
    briefAr: "توضيح مساعد ذكاء اصطناعي بمستوى إنتاجي يُقاس قبل الإطلاق، بمراجعة بشرية للخطوات المكلفة.",
    approachEn: ["Retrieval over documents", "Evaluation set scored pre-launch", "Human-in-the-loop review", "Cost and latency dashboard"],
    approachAr: ["استرجاع من المستندات", "مجموعة تقييم مُقيَّمة قبل الإطلاق", "مراجعة بإشراف بشري", "لوحة تكلفة وزمن استجابة"],
    disciplinesEn: ["AI", "Software"], disciplinesAr: ["الذكاء الاصطناعي", "البرمجيات"] },
];

export const getProject = (slug: string) => PROJECTS.find((p) => p.slug === slug);
export const projectSlugs = () => PROJECTS.map((p) => p.slug);
export const projTitle = (p: Project, locale: string) => (locale === "ar" ? p.titleAr : p.titleEn);
export const projSummary = (p: Project, locale: string) => (locale === "ar" ? p.summaryAr : p.summaryEn);
