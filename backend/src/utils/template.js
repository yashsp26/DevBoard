import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const templatesDirectory = path.join(
  __dirname,
  "../templates/emails"
);

export const renderTemplate = async (
  templateName,
  variables = {}
) => {
  let html = await fs.readFile(
    path.join(
      templatesDirectory,
      `${templateName}.html`
    ),
    "utf-8"
  );

  Object.entries(variables).forEach(
    ([key, value]) => {
      html = html.replaceAll(
        `{{${key}}}`,
        value ?? ""
      );
    }
  );

  return html;
};