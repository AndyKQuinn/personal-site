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
  const groupMap = {};
  let groupId = 0;

  function traverseDirectory(directory) {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverseDirectory(fullPath);
      } else if (file.endsWith('.md')) {
        const { title, tags, routeName } = extractTitleAndTags(fullPath);
        const formattedTitle = toTitleCase(title);

        if (!groupMap[directory]) {
          groupMap[directory] = ++groupId;
        }

        nodes.push({ id: formattedTitle, href: `/${routeName}`, group: groupMap[directory] });

        tags.forEach(tag => {
          if (!tagToNodes[tag]) {
            tagToNodes[tag] = [];
          }
          tagToNodes[tag].push(formattedTitle);
        });
      }
    });
  }

  traverseDirectory(docsPath);

  Object.values(tagToNodes).forEach(titles => {
    for (let i = 0; i < titles.length; i++) {
      for (let j = i + 1; j < titles.length; j++) {
        const source = titles[i];
        const target = titles[j];
        const existingLink = links.find(link => link.source === source && link.target === target);
        if (existingLink) {
          existingLink.value += 1;
        } else {
          links.push({ source, target, value: 1 });
        }
      }
    }
  });

  return { nodes, links };
}

function main() {
  const docsPath = path.join(__dirname, 'docs');
  const graphStructure = createGraphStructure(docsPath);
  fs.writeFileSync('graph_structure.json', JSON.stringify(graphStructure, null, 2));
}

main();