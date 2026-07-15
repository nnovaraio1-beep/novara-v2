"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireDb } from "@/server/db";
import {
  runAction,
  slugify,
  type ActionResult,
} from "@/server/admin/action";
import { parse, v } from "@/lib/validate";

const schema = v.object({
  slug: v.string({ min: 1, max: 80 }),
  categoryKey: v.string({ min: 1, max: 60 }),

  titleEn: v.string({ min: 1, max: 160 }),
  titleAr: v.string({ min: 1, max: 160 }),

  descriptionEn: v.string({ min: 1, max: 4000 }),
  descriptionAr: v.string({ min: 1, max: 4000 }),

  priceFils: v.optional(
    v.int({ min: 0, max: 100_000_000 })
  ),

  salePriceFils: v.optional(
    v.int({ min: 0, max: 100_000_000 })
  ),

  currency: v.literal("JOD"),

  billingType: v.literal(
    "once",
    "monthly",
    "custom"
  ),

  timelineEn: v.optional(
    v.string({ max: 120 })
  ),

  timelineAr: v.optional(
    v.string({ max: 120 })
  ),

  platforms: v.optional(
    v.int({ min: 0, max: 99 })
  ),

  posts: v.optional(
    v.int({ min: 0, max: 999 })
  ),

  stories: v.optional(
    v.int({ min: 0, max: 999 })
  ),

  reels: v.optional(
    v.int({ min: 0, max: 999 })
  ),

  aiVideos: v.optional(
    v.int({ min: 0, max: 999 })
  ),

  status: v.literal(
    "draft",
    "published",
    "scheduled",
    "archived"
  ),

  order: v.optional(
    v.int({ min: 0, max: 9999 })
  ),

  popular: v.optional(v.literal("on")),
  featured: v.optional(v.literal("on")),
  quoteOnly: v.optional(v.literal("on")),
  addToCart: v.optional(v.literal("on")),
  buyNow: v.optional(v.literal("on")),
});

function fromForm(fd: FormData) {
  const raw = Object.fromEntries(fd.entries());

  const num = (key: string) =>
    raw[key] ? Number(raw[key]) : undefined;

  const parsed = parse(schema, {
    ...raw,
    priceFils: num("priceFils"),
    salePriceFils: num("salePriceFils"),
    platforms: num("platforms"),
    posts: num("posts"),
    stories: num("stories"),
    reels: num("reels"),
    aiVideos: num("aiVideos"),
    order: num("order"),
  });

  return {
    slug: slugify(parsed.slug),
    categoryKey: parsed.categoryKey,

    titleEn: parsed.titleEn,
    titleAr: parsed.titleAr,

    descriptionEn: parsed.descriptionEn,
    descriptionAr: parsed.descriptionAr,

    priceFils: parsed.priceFils ?? null,
    salePriceFils: parsed.salePriceFils ?? null,

    currency: parsed.currency,
    billingType: parsed.billingType,

    timelineEn: parsed.timelineEn ?? null,
    timelineAr: parsed.timelineAr ?? null,

    platforms: parsed.platforms ?? null,
    posts: parsed.posts ?? null,
    stories: parsed.stories ?? null,
    reels: parsed.reels ?? null,
    aiVideos: parsed.aiVideos ?? null,

    status: parsed.status,
    order: parsed.order ?? 0,

    popular: parsed.popular === "on",
    featured: parsed.featured === "on",
    quoteOnly: parsed.quoteOnly === "on",
    addToCart: parsed.addToCart === "on",
    buyNow: parsed.buyNow === "on",
  };
}

export async function createPackage(
  csrf: string,
  fd: FormData
): Promise<ActionResult<{ id: string }>> {
  return runAction(
    {
      permission: "store.write",
      csrf,
      audit: {
        action: "create",
        entityType: "package",
      },
    },
    async () => {
      const created =
        await requireDb().package.create({
          data: fromForm(fd),
        });

      revalidatePath("/admin/packages");
      revalidatePath("/en/store");
      revalidatePath("/ar/store");

      return {
        id: created.id,
      };
    }
  );
}

export async function updatePackage(
  id: string,
  csrf: string,
  fd: FormData
): Promise<ActionResult> {
  return runAction(
    {
      permission: "store.write",
      csrf,
      audit: {
        action: "update",
        entityType: "package",
        entityId: id,
      },
    },
    async () => {
      const db = requireDb();

      const before =
        await db.package.findUnique({
          where: { id },
        });

      if (before) {
        await db.revision.create({
          data: {
            entityType: "package",
            entityId: id,
            snapshot: JSON.parse(
              JSON.stringify(before)
            ),
          },
        });
      }

      await db.package.update({
        where: { id },
        data: fromForm(fd),
      });

      revalidatePath("/admin/packages");

      if (before?.slug) {
        revalidatePath(
          `/en/store/${before.slug}`
        );

        revalidatePath(
          `/ar/store/${before.slug}`
        );
      }
    }
  );
}

export async function softDeletePackage(
  id: string,
  csrf: string
): Promise<ActionResult> {
  return runAction(
    {
      permission: "store.write",
      csrf,
      audit: {
        action: "delete",
        entityType: "package",
        entityId: id,
      },
    },
    async () => {
      await requireDb().package.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      revalidatePath("/admin/packages");
    }
  );
}

export async function restorePackage(
  id: string,
  csrf: string
): Promise<ActionResult> {
  return runAction(
    {
      permission: "store.write",
      csrf,
      audit: {
        action: "restore",
        entityType: "package",
        entityId: id,
      },
    },
    async () => {
      await requireDb().package.update({
        where: { id },
        data: {
          deletedAt: null,
        },
      });

      revalidatePath("/admin/packages");
    }
  );
}

export async function duplicatePackage(
  id: string,
  csrf: string
): Promise<ActionResult> {
  return runAction(
    {
      permission: "store.write",
      csrf,
      audit: {
        action: "duplicate",
        entityType: "package",
        entityId: id,
      },
    },
    async () => {
      const db = requireDb();

      const source =
        await db.package.findUnique({
          where: { id },
        });

      if (!source) {
        throw new Error("Package not found");
      }

      const {
        id: _id,
        createdAt: _createdAt,
        updatedAt: _updatedAt,
        featuresEn,
        featuresAr,
        seo,
        ...rest
      } = source;

      await db.package.create({
        data: {
          ...rest,

          slug: `${source.slug}-copy-${Math.random()
            .toString(36)
            .slice(2, 6)}`,

          status: "draft",

          featuresEn:
            featuresEn === null
              ? Prisma.DbNull
              : (featuresEn as Prisma.InputJsonValue),

          featuresAr:
            featuresAr === null
              ? Prisma.DbNull
              : (featuresAr as Prisma.InputJsonValue),

          seo:
            seo === null
              ? Prisma.DbNull
              : (seo as Prisma.InputJsonValue),
        },
      });

      revalidatePath("/admin/packages");
    }
  );
}