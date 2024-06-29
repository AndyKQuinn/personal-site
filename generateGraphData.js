const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function extractData(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(content);
  const title = parsed.data.title || parsed.content.match(/^# (.+)/m)[1];
  const tags = parsed.data.tags || [];
  const description = extractAndSanitizeDescription(parsed.content);

  const routeName = path.relative(__dirname, filePath).replace(/\\/g, '/').replace('.md', '');
  return { title, tags, routeName, description };
}

function extractAndSanitizeDescription(markdownText) {
  const contentWithoutFrontMatter = markdownText.replace(/^\s*---[\s\S]+?---\s*/g, '');

  const h1Regex = /# (.*)([\s\S]*?)(##|$)/;
  const match = contentWithoutFrontMatter.match(h1Regex);

  if (!match) return null;

  let description = (match[2] || '').trim();

  description = description.replace(/<[^>]*>/g, '');
  description = description.replace(/[<>]/g, '');


  return description;
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function createGraphStructure(docsPath) {
  const nodes = [];
  const links = [];
  const nodeExists = new Set();
  const folderToGroupIndex = {};
  let nextGroupId = 0;

  function ensureGroupIndex(folder) {
    if (!folderToGroupIndex.hasOwnProperty(folder)) {
      folderToGroupIndex[folder] = nextGroupId++;
    }
    return folderToGroupIndex[folder];
  }

  function addNode(id, href, group, description) {
    if (!nodeExists.has(id)) {
      nodes.push({ id, href, group, description });
      nodeExists.add(id);
    }
  }

  function traverseDirectory(directory) {
    const currentGroupIndex = ensureGroupIndex(directory);
    const files = fs.readdirSync(directory);

    files.forEach(file => {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);

      if (directory === docsPath && file.toLowerCase() === 'intro.md') {
        // skip making link, but still create the node so I can get the description
        const { title, tags, routeName, description } = extractData(fullPath);
        const formattedTitle = toTitleCase(title);
        addNode(formattedTitle, `/${routeName}`, currentGroupIndex, description);
        return;
      }

      if (stat.isDirectory()) {
        traverseDirectory(fullPath);
      } else if (file.endsWith('.md')) {
        const { title, tags, routeName, description } = extractData(fullPath);
        const formattedTitle = toTitleCase(title);

        addNode(formattedTitle, `/${routeName}`, currentGroupIndex, description);

        tags.forEach(tag => {
          const tagNode = toTitleCase(tag);
          const tagGroupIndex = ensureGroupIndex('tags');
          addNode(tagNode, `#${tag.toLowerCase()}`, tagGroupIndex);
          links.push({ source: formattedTitle, target: tagNode, value: 1 });
        });

        if (tags.length === 0) {
          const parentFolderName = path.basename(directory);
          const parentFolderTitle = toTitleCase(parentFolderName);
          if (parentFolderTitle !== formattedTitle) {
            links.push({ source: formattedTitle, target: parentFolderTitle, value: 1 });
          }
        }
      }
    });
  }

  traverseDirectory(docsPath);

  return { nodes, links };
}

function main() {
  const docsPath = path.join(__dirname, 'docs');
  const graphStructure = createGraphStructure(docsPath);
  fs.writeFileSync('data.json', JSON.stringify(graphStructure, null, 2));
}

main();
