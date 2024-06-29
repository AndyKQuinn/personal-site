const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

function extractTitleAndTags(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const parsed = matter(content);
  const title = parsed.data.title || parsed.content.match(/^# (.+)/m)[1];
  const tags = parsed.data.tags || [];
  const routeName = path.relative(__dirname, filePath).replace(/\\/g, '/').replace('.md', '');
  return { title, tags, routeName };
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

function createGraphStructure(docsPath) {
  const nodes = [];
  const links = [];
  const tagToNodes = {};
  const nodeExists = new Set(); // Keep track of existing node IDs to prevent duplication

  function traverseDirectory(directory, parent) {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        const dirName = toTitleCase(file);
        if (!nodeExists.has(dirName)) {
          nodes.push({ id: dirName, href: `/${file.toLowerCase()}`, group: 'Technology' });
          nodeExists.add(dirName);
        }
        if (parent && !links.some(link => link.source === dirName && link.target === parent)) {
          links.push({ source: dirName, target: parent, value: 1 }); // Ensure unique link
        }
        traverseDirectory(fullPath, dirName);
      } else if (file.endsWith('.md')) {
        const { title, tags, routeName } = extractTitleAndTags(fullPath);
        const formattedTitle = toTitleCase(title);

        if (!nodeExists.has(formattedTitle)) {
          nodes.push({ id: formattedTitle, href: `/${routeName}`, group: 'Document' });
          nodeExists.add(formattedTitle);
        }

        tags.forEach(tag => {
          const tagNode = toTitleCase(tag);
          if (!nodeExists.has(tagNode)) {
            nodes.push({ id: tagNode, href: `#${tag.toLowerCase()}`, group: 'Tag' });
            nodeExists.add(tagNode);
          }
          if (!links.some(link => link.source === formattedTitle && link.target === tagNode)) {
            links.push({ source: formattedTitle, target: tagNode, value: 1 });
          }
        });

        if (tags.length === 0 && parent) {
          if (!links.some(link => link.source === formattedTitle && link.target === parent)) {
            links.push({ source: formattedTitle, target: parent, value: 1 });
          }
        }
      }
    });
  }

  // Add a root node if there are subdirectories indicating a skills directory
  if (!nodeExists.has('Skills')) {
    nodes.push({ id: 'Skills', href: '/skills', group: 'Skills Directory' });
    nodeExists.add('Skills');
  }

  traverseDirectory(docsPath, 'Skills');

  return { nodes, links };
}

function main() {
  const docsPath = path.join(__dirname, 'docs');
  const graphStructure = createGraphStructure(docsPath);
  fs.writeFileSync('graph_structure.json', JSON.stringify(graphStructure, null, 2));
}

main();
