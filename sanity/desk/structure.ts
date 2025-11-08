import type { StructureResolver } from "sanity/desk";

const HOME_HERO_DOCUMENT_ID = "homeHeroSection";
const ABOUT_PAGE_DOCUMENT_ID = "aboutPage";
const CONTACT_PAGE_DOCUMENT_ID = "contactPage";

const deskStructure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Pages")
        .child(
          S.list()
            .title("Pages")
            .items([
              S.listItem()
                .title("Home Page")
                .child(
                  S.document()
                    .title("Home Page")
                    .schemaType("homeHeroSection")
                    .documentId(HOME_HERO_DOCUMENT_ID)
                ),
              S.listItem()
                .title("About Page")
                .child(
                  S.document()
                    .title("About Page")
                    .schemaType("aboutPage")
                    .documentId(ABOUT_PAGE_DOCUMENT_ID)
                ),
              S.listItem()
                .title("Contact Page")
                .child(
                  S.document()
                    .title("Contact Page")
                    .schemaType("contactPage")
                    .documentId(CONTACT_PAGE_DOCUMENT_ID)
                ),
            ])
        ),
      S.listItem()
        .title("Categories")
        .schemaType("category")
        .child(
          S.documentTypeList("category")
            .title("Categories")
            .defaultOrdering([{ field: "order", direction: "asc" }])
        ),
      S.listItem()
        .title("Products")
        .child(
          S.documentTypeList("category")
            .title("Categories")
            .defaultOrdering([{ field: "order", direction: "asc" }])
            .menuItems([])
            .initialValueTemplates([])
            .child((categoryId) =>
              S.documentList()
                .title("Products")
                .filter('_type == "product" && category._ref == $categoryId')
                .params({ categoryId })
                .defaultOrdering([{ field: "order", direction: "asc" }, { field: "titleAz", direction: "asc" }])
            )
        ),
    ]);

export default deskStructure;
