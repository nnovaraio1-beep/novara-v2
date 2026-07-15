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

const serviceSchema = v.object({
  slug: v.string({ min: 1, max: 80 }),

  titleEn: v.string({ min: 1, max: 160 }),
  titleAr: v.string({ min: 1, max: 160 }),

  descriptionEn: v.string({ min: 1, max: 4000 }),
  descriptionAr: v.string({ min: 1, max: 4000 }),

  valueEn: v.optional(v.string({ max: 400 })),
  valueAr: v.optional(v.string({ max: 400 })),

  categoryKey: v.optional(v.string({ max: 60 })),

  priceFils: v.optional(
    v.int({ min: 0, max: 100_000_000 })
  ),

  billingType: v.literal(
    "once",
    "monthly",
    "custom"
  ),

  timelineEn: v.optional(v.string({ max: 120 })),
  timelineAr: v.optional(v.string({ max: 120 })),

  status: v.literal(
    "draft",
    "published",
    "scheduled",
    "archived"
  ),

  featured: v.optional(v.literal("on")),
  purchasable: v.optional(v.literal("on")),

  order: v.optional(
    v.int({ min: 0, max: 9999 })
  ),
});

function fromForm(fd: FormData) {
  const raw = Object.fromEntries(fd.entries());

  const parsed = parse(serviceSchema, {
    ...raw,
    priceFils: raw.priceFils
      ? Number(raw.priceFils)
      : undefined,
    order: raw.order
      ? Number(raw.order)
      : undefined,
  });

  return {
    slug: slugify(parsed.slug),

    titleEn: parsed.titleEn,
    titleAr: parsed.titleAr,

    descriptionEn: parsed.descriptionEn,
    descriptionAr: parsed.descriptionAr,

    valueEn: parsed.valueEn ?? null,
    valueAr: parsed.valueAr ?? null,

    categoryKey: parsed.categoryKey ?? null,
    priceFils: parsed.priceFils ?? null,

    billingType: parsed.billingType,

    timelineEn: parsed.timelineEn ?? null,
    timelineAr: parsed.timelineAr ?? null,

    status: parsed.status,

    featured: parsed.featured === "on",
    purchasable: parsed.purchasable === "on",

    order: parsed.order ?? 0,
  };
}

export async function createService(
  csrf: string,
  fd: FormData
): Promise<ActionResult<{ id: string }>> {
  return runAction(
    {
      permission: "store.write",
      csrf,
      audit: {
        action: "create",
        entityType: "service",
      },
    },
    async () => {
      const db = requireDb();

      const created = await db.service.create({
        data: fromForm(fd),
      });

      revalidatePath("/admin/services");
      revalidatePath("/en/services");
      revalidatePath("/ar/services");

      return {
        id: created.id,
      };
    }
  );
}

export async function updateService(
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
        entityType: "service",
        entityId: id,
      },
    },
    async () => {
      const db = requireDb();

      const before = await db.service.findUnique({
        where: { id },
      });

      if (before) {
        await db.revision.create({
          data: {
            entityType: "service",
            entityId: id,
            snapshot: JSON.parse(
              JSON.stringify(before)
            ),
          },
        });
      }

      await db.service.update({
        where: { id },
        data: fromForm(fd),
      });

      revalidatePath("/admin/services");

      if (before?.slug) {
        revalidatePath(`/en/services/${before.slug}`);
        revalidatePath(`/ar/services/${before.slug}`);
      }
    }
  );
}

export async function softDeleteService(
  id: string,
  csrf: string
): Promise<ActionResult> {
  return runAction(
    {
      permission: "store.write",
      csrf,
      audit: {
        action: "delete",
        entityType: "service",
        entityId: id,
      },
    },
    async () => {
      await requireDb().service.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });

      revalidatePath("/admin/services");
    }
  );
}

export async function restoreService(
  id: string,
  csrf: string
): Promise<ActionResult> {
  return runAction(
    {
      permission: "store.write",
      csrf,
      audit: {
        action: "restore",
        entityType: "service",
        entityId: id,
      },
    },
    async () => {
      await requireDb().service.update({
        where: { id },
        data: {
          deletedAt: null,
        },
      });

      revalidatePath("/admin/services");
    }
  );
}

export async function duplicateService(
  id: string,
  csrf: string
): Promise<ActionResult> {
  return runAction(
    {
      permission: "store.write",
      csrf,
      audit: {
        action: "duplicate",
        entityType: "service",
        entityId: id,
      },
    },
    async () => {
      const db = requireDb();

      const source = await db.service.findUnique({
        where: { id },
      });

      if (!source) {
        throw new Error("Service not found");
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

      await db.service.create({
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

      revalidatePath("/admin/services");
    }
  );
}