import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { deskTool } from "sanity/desk";

import { apiVersion, dataset, projectId } from "./sanity/env";
import deskStructure from "./sanity/desk/structure";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "turtlewax",
  title: "Turtle Wax CMS",
  projectId,
  dataset,
  basePath: "/studio",
  schema: {
    types: schemaTypes,
  },
  plugins: [
    deskTool({ structure: deskStructure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
