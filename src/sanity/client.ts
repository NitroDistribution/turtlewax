import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, readToken, useCdn } from "@sanity/env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
  token: readToken,
  perspective: readToken ? "drafts" : "published",
});
