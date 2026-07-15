import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Home, Search } from "lucide-react";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-[family-name:--font-display] text-[120px] font-extrabold leading-none text-gradient">404</p>
      <h1 className="t-section mt-6 font-[family-name:--font-display]">{t("title")}</h1>
      <p className="t-body mt-5 max-w-md text-[--color-text-muted]">{t("body")}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn btn-primary btn-lg group"><Home className="size-4" aria-hidden />{t("home")}</Link>
        <Link href="/services" className="btn btn-secondary btn-lg"><Search className="size-4" aria-hidden />{t("services")}</Link>
      </div>
    </div>
  );
}
