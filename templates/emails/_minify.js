#!/usr/bin/env node

import path from "path";
import fs from "fs/promises";
import { inline } from "@css-inline/css-inline";
import { minify } from "minify";

const [, , input, output] = process.argv;

if (!input || !output) {
  console.log("usage:");
  console.log("  css-inline-minifier <input.html> <output.html>");
  process.exit(1);
}

const inputPath = path.resolve(process.cwd(), input);
const outputPath = path.resolve(process.cwd(), output);

const processHTML = async(inputPath, outputPath)=>{
  try {
    const html = await fs.readFile(inputPath, "utf8");

    const inlinedHTML = inline(html, {
      url: "file://" + process.cwd(),
      removeStyleTags: false,
      preserveMediaQueries: true,
      applyStyleTags: true
    });

    const minifiedHTML = await minify.html(inlinedHTML, {
      html: {
        removeComments: true,
        removeAttributeQuotes: false,
        removeOptionalTags: false,
        collapseWhitespace: true
      }
    });

    await fs.writeFile(outputPath, minifiedHTML);

    return {
      success: true,
      input: inputPath,
      output: outputPath
    };

  } catch (err) {
    throw new Error(`processing failed: ${err.message}`);
  }
}

processHTML(inputPath, outputPath)
  .then(() => {
    console.log("file processed successfully!");
    console.log("> input: ", inputPath);
    console.log("> output:", outputPath);
  })
  .catch((err) => {
    console.error("error:", err.message);
    process.exit(1);
  });
