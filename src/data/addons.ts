/** Optional add-ons for the cart. Prices in whole JOD. */
export interface AddOn {
  id: string; slug: string;
  titleEn: string; titleAr: string;
  price: number; currency: "JOD";
}

export const ADDONS: AddOn[] = [
  { id: "add-platform", slug: "extra-platform", titleEn: "Additional social platform", titleAr: "منصّة تواصل إضافية", price: 90, currency: "JOD" },
  { id: "add-posts", slug: "extra-posts", titleEn: "4 additional posts", titleAr: "4 منشورات إضافية", price: 70, currency: "JOD" },
  { id: "add-stories", slug: "extra-stories", titleEn: "8 additional stories", titleAr: "8 قصص إضافية", price: 50, currency: "JOD" },
  { id: "add-carousel", slug: "extra-carousel", titleEn: "Extra carousel design", titleAr: "تصميم دوّار إضافي", price: 45, currency: "JOD" },
  { id: "add-video", slug: "extra-ai-video", titleEn: "Extra AI video", titleAr: "فيديو ذكاء اصطناعي إضافي", price: 120, currency: "JOD" },
  { id: "add-vo-ar", slug: "voiceover-ar", titleEn: "Arabic voice-over", titleAr: "تعليق صوتي بالعربية", price: 60, currency: "JOD" },
  { id: "add-vo-en", slug: "voiceover-en", titleEn: "English voice-over", titleAr: "تعليق صوتي بالإنجليزية", price: 60, currency: "JOD" },
  { id: "add-photo", slug: "product-photography", titleEn: "Product photography", titleAr: "تصوير المنتجات", price: 220, currency: "JOD" },
  { id: "add-filming", slug: "on-site-filming", titleEn: "On-site filming", titleAr: "تصوير في الموقع", price: 380, currency: "JOD" },
  { id: "add-ads", slug: "ads-management", titleEn: "Paid ads management", titleAr: "إدارة الإعلانات المدفوعة", price: 350, currency: "JOD" },
  { id: "add-community", slug: "community", titleEn: "Community management", titleAr: "إدارة المجتمع", price: 150, currency: "JOD" },
  { id: "add-strategy", slug: "strategy-meeting", titleEn: "Monthly strategy meeting", titleAr: "اجتماع استراتيجية شهري", price: 90, currency: "JOD" },
];

export const addonBySlug = (slug: string) => ADDONS.find((a) => a.slug === slug);
export const addonTitle = (a: AddOn, locale: string) => (locale === "ar" ? a.titleAr : a.titleEn);
