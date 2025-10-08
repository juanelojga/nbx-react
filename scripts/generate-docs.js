#!/usr/bin/env node

/**
 * Documentation Generator for Next.js Project
 * Scans components, extracts colors, and generates DESIGN_SYSTEM.md
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

// Configuration - adjust these paths to match your project structure
const CONFIG = {
  componentsDir: "./src/components",
  pagesDir: "./src/app",
  colorsFile: "./src/app/globals.css", // or wherever your colors are defined
  outputFile: "./documents/DESIGN_SYSTEM.md",
  // Add other paths as needed
  configFiles: [], // './tailwind.config.ts'
};

/**
 * Extract colors from CSS/config files
 */
function extractColors() {
  const colors = {};

  // Try to read CSS color definitions
  if (fs.existsSync(CONFIG.colorsFile)) {
    const cssContent = fs.readFileSync(CONFIG.colorsFile, "utf8");
    const colorRegex = /--([a-z-]+):\s*([^;]+);/g;
    let match;

    while ((match = colorRegex.exec(cssContent)) !== null) {
      colors[match[1]] = match[2].trim();
    }
  }

  // Try to read Tailwind config
  for (const configFile of CONFIG.configFiles) {
    if (fs.existsSync(configFile)) {
      try {
        const configContent = fs.readFileSync(configFile, "utf8");
        // Basic extraction - you may need to adjust this regex
        const themeMatch = configContent.match(/colors:\s*{([^}]+)}/s);
        if (themeMatch) {
          colors["tailwind-colors"] = themeMatch[1].trim();
        }
      } catch (error) {
        console.log(`Could not parse ${configFile}`, error);
      }
    }
  }

  return colors;
}

/**
 * Recursively scan directory for component files
 */
function scanComponents(dir, basePath = "") {
  const components = [];

  if (!fs.existsSync(dir)) {
    return components;
  }

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively scan subdirectories
      components.push(...scanComponents(filePath, path.join(basePath, file)));
    } else if (file.match(/\.(tsx|jsx)$/)) {
      const componentInfo = analyzeComponent(filePath, basePath, file);
      if (componentInfo) {
        components.push(componentInfo);
      }
    }
  }

  return components;
}

/**
 * Analyze a component file to extract information
 */
function analyzeComponent(filePath, basePath, fileName) {
  const content = fs.readFileSync(filePath, "utf8");
  const componentName = fileName.replace(/\.(tsx|jsx)$/, "");

  // Skip if it's not a component (e.g., utils, types)
  if (!content.includes("export") || fileName.startsWith("use")) {
    return null;
  }

  // Extract props interface/type
  const propsMatch =
    content.match(/interface\s+\w+Props\s*{([^}]+)}/s) ||
    content.match(/type\s+\w+Props\s*=\s*{([^}]+)}/s);

  const props = propsMatch
    ? propsMatch[1]
        .trim()
        .split("\n")
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  // Try to detect variants (common pattern)
  const variantMatch = content.match(/variant['"]\s*:\s*['"]([^'"]+)['"]/g);
  const variants = variantMatch
    ? [...new Set(variantMatch.map((v) => v.match(/['"]([^'"]+)['"]/)[1]))]
    : [];

  // Check for test files in multiple locations
  const testPatterns = [
    // Test file next to component: alert.test.tsx
    filePath.replace(/\.(tsx|jsx)$/, ".test.$1"),
    // Test file in __tests__ folder in same directory: ui/__tests__/alert.test.tsx
    path.join(
      path.dirname(filePath),
      "__tests__",
      fileName.replace(/\.(tsx|jsx)$/, ".test.$1")
    ),
    // Test file in parent __tests__ folder: __tests__/alert.test.tsx
    path.join(
      path.dirname(path.dirname(filePath)),
      "__tests__",
      fileName.replace(/\.(tsx|jsx)$/, ".test.$1")
    ),
  ];

  const hasTests = testPatterns.some((testPath) => fs.existsSync(testPath));

  return {
    name: componentName,
    path: path.join(basePath, fileName).replace(/\\/g, "/"),
    props: props.length,
    variants,
    hasTests,
  };
}

/**
 * Scan pages directory
 */
function scanPages(dir) {
  const pages = [];

  if (!fs.existsSync(dir)) {
    return pages;
  }

  const scan = (currentDir, route = "") => {
    const files = fs.readdirSync(currentDir);

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      if (
        stat.isDirectory() &&
        !file.startsWith("_") &&
        !file.startsWith(".")
      ) {
        scan(filePath, `${route}/${file}`);
      } else if (file === "page.tsx" || file === "page.jsx") {
        pages.push({
          route: route || "/",
          path: filePath.replace(/\\/g, "/"),
        });
      }
    }
  };

  scan(dir);
  return pages;
}

/**
 * Generate markdown documentation
 */
function generateMarkdown(colors, components, pages) {
  const timestamp = new Date().toISOString().split("T")[0];

  let md = `# Design System Documentation\n\n`;
  md += `*Last updated: ${timestamp}*\n\n`;
  md += `---\n\n`;

  // Table of Contents
  md += `## Table of Contents\n\n`;
  md += `- [Color Palette](#color-palette)\n`;
  md += `- [Components](#components)\n`;
  md += `- [Pages](#pages)\n`;
  md += `- [Project Status](#project-status)\n\n`;
  md += `---\n\n`;

  // Colors Section
  md += `## Color Palette\n\n`;
  if (Object.keys(colors).length > 0) {
    for (const [name, value] of Object.entries(colors)) {
      md += `- **${name}**: \`${value}\`\n`;
    }
  } else {
    md += `*No color definitions found. Update CONFIG.colorsFile in the script.*\n`;
  }
  md += `\n`;

  // Components Section
  md += `## Components\n\n`;
  md += `Total components: **${components.length}**\n\n`;

  if (components.length > 0) {
    for (const comp of components.sort((a, b) =>
      a.name.localeCompare(b.name)
    )) {
      md += `### ${comp.name}\n\n`;
      md += `- **Location**: \`${comp.path}\`\n`;
      md += `- **Props**: ${comp.props} props defined\n`;
      if (comp.variants.length > 0) {
        md += `- **Variants**: ${comp.variants.join(", ")}\n`;
      }
      md += `- **Tests**: ${comp.hasTests ? "✅ Yes" : "❌ No"}\n`;
      md += `\n`;
    }
  } else {
    md += `*No components found. Check CONFIG.componentsDir path.*\n\n`;
  }

  // Pages Section
  md += `## Pages\n\n`;
  md += `Total pages: **${pages.length}**\n\n`;

  if (pages.length > 0) {
    for (const page of pages.sort((a, b) => a.route.localeCompare(b.route))) {
      md += `- **${page.route}**\n`;
      md += `  - Path: \`${page.path}\`\n`;
    }
  } else {
    md += `*No pages found. Check CONFIG.pagesDir path.*\n`;
  }
  md += `\n`;

  // Status Section
  md += `## Project Status\n\n`;
  md += `### Completed ✅\n`;
  md += `- Login page\n`;
  md += `- Dashboard page (basic styles)\n`;
  md += `- Demo page (UI components showcase)\n`;
  md += `- Color palette defined\n\n`;
  md += `### In Progress 🚧\n`;
  md += `- Refining component styles\n`;
  md += `- Expanding component library\n\n`;
  md += `### TODO 📋\n`;
  md += `- [Add your pending tasks here]\n\n`;

  return md;
}

/**
 * Main execution
 */
function main() {
  console.log("🔍 Scanning project...\n");

  // Extract information
  const colors = extractColors();
  console.log(`✓ Found ${Object.keys(colors).length} color definitions`);

  const components = scanComponents(CONFIG.componentsDir);
  console.log(`✓ Found ${components.length} components`);

  const pages = scanPages(CONFIG.pagesDir);
  console.log(`✓ Found ${pages.length} pages`);

  // Generate documentation
  const markdown = generateMarkdown(colors, components, pages);

  // Write to file
  fs.writeFileSync(CONFIG.outputFile, markdown, "utf8");
  console.log(`\n✅ Documentation generated: ${CONFIG.outputFile}`);
}

// Run the script
main();
