import { getCategoriesPageCopy, type Locale } from "@/lib/i18n";
import { getCategories } from "@/sanity/queries";

import { CategoryCard } from "@/components/pages/home/section-categories/category-card";

type CategoriesPageProps = {
  params: Promise<{
    locale: Locale;
  }>;
};

const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const { locale } = await params;
  const categories = await getCategories(locale);
  const copy = getCategoriesPageCopy(locale);

  return (
    <section className="section">
      <div className="container space-y-10">
        <header className="space-y-2">
          <h1 className="heading-2">{copy.title}</h1>
          <p className="text-muted-foreground">
            {copy.subtitle}
          </p>
        </header>

        {categories.length === 0 ? (
          <p>{copy.empty}</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category._id} category={category} variant="grid" locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesPage;

export const revalidate = 60;
