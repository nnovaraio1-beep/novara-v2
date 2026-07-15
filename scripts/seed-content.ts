/**
 * بذور المحتوى: ينقل الخدمات والباقات والفئات والإضافات من الملفات الثابتة
 * إلى قاعدة البيانات، عشان تظهر في لوحة الأدمن وتقدر تعدّلها.
 *
 * Seeds services, packages, categories and add-ons from the static data files
 * into the database so they appear (and become editable) in the admin.
 *
 * التشغيل: npm run seed
 * آمن للتكرار: بيستخدم upsert — ما بيكرّر، بيحدّث الموجود.
 */
import { PrismaClient } from "@prisma/client";
import { SERVICES } from "../src/data/services";
import { PACKAGES } from "../src/data/packages";
import { CATEGORIES } from "../src/data/categories";
import { ADDONS } from "../src/data/addons";

const db = new PrismaClient();
const fils = (jod: number | null) => (jod === null ? null : Math.round(jod * 1000));

async function main() {
  // الفئات أولاً (لأن الباقات بتشير إليها)
  for (const [i, c] of CATEGORIES.entries()) {
    await db.category.upsert({
      where: { key: c.key },
      update: { titleEn: c.titleEn, titleAr: c.titleAr, introEn: c.introEn ?? null, introAr: c.introAr ?? null, group: c.group, order: i },
      create: { key: c.key, titleEn: c.titleEn, titleAr: c.titleAr, introEn: c.introEn ?? null, introAr: c.introAr ?? null, group: c.group, order: i, visible: true },
    });
  }
  console.log(`✓ ${CATEGORIES.length} فئة`);

  for (const [i, s] of SERVICES.entries()) {
    const data = {
      titleEn: s.titleEn, titleAr: s.titleAr, descriptionEn: s.descriptionEn, descriptionAr: s.descriptionAr,
      valueEn: s.valueEn ?? null, valueAr: s.valueAr ?? null, priceFils: fils(s.price), billingType: s.billingType,
      timelineEn: s.timelineEn ?? null, timelineAr: s.timelineAr ?? null,
      featuresEn: s.featuresEn ?? [], featuresAr: s.featuresAr ?? [],
      featured: Boolean(s.feature), purchasable: true, status: "published" as const, order: i,
    };
    await db.service.upsert({ where: { slug: s.slug }, update: data, create: { slug: s.slug, ...data } });
  }
  console.log(`✓ ${SERVICES.length} خدمة`);

  for (const [i, p] of PACKAGES.entries()) {
    const data = {
      categoryKey: p.category, titleEn: p.titleEn, titleAr: p.titleAr, descriptionEn: p.descriptionEn, descriptionAr: p.descriptionAr,
      priceFils: fils(p.price), currency: p.currency, billingType: p.billingType,
      timelineEn: p.timelineEn ?? null, timelineAr: p.timelineAr ?? null,
      featuresEn: p.featuresEn ?? [], featuresAr: p.featuresAr ?? [],
      platforms: p.platforms ?? null, posts: p.posts ?? null, stories: p.stories ?? null, reels: p.videos ?? null,
      popular: Boolean((p as { popular?: boolean }).popular), status: "published" as const, order: i,
    };
    await db.package.upsert({ where: { slug: p.slug }, update: data, create: { slug: p.slug, ...data } });
  }
  console.log(`✓ ${PACKAGES.length} باقة`);

  for (const [i, a] of ADDONS.entries()) {
    const data = { titleEn: a.titleEn, titleAr: a.titleAr, priceFils: fils(a.price) ?? 0, currency: a.currency, billingType: "once", order: i, active: true };
    await db.addOn.upsert({ where: { slug: a.slug }, update: data, create: { slug: a.slug, ...data } });
  }
  console.log(`✓ ${ADDONS.length} إضافة`);

  console.log("\n✅ تم نقل كل المحتوى إلى قاعدة البيانات. افتح /admin/packages لتراه.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
