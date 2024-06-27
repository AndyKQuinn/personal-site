const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');

const docsDir = path.join(__dirname, 'docs');

// Define a mapping for colors
const colorMap = {
  'Technical': 'lightblue',
  'Knowledge': 'green',
  'Informational': 'orange'
};

function getColorForType(type) {
  return colorMap[type] || colorMap['default'];
}

function getMarkdownFiles(dir) {
  let files = fs.readdirSync(dir);
  let markdownFiles = [];

  files.forEach((file) => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      markdownFiles = markdownFiles.concat(getMarkdownFiles(fullPath));
    } else if (path.extname(fullPath) === '.md') {
      markdownFiles.push(fullPath);
    }
  });

  return markdownFiles;
}

function parseMarkdownFiles(files) {
  let parsedFiles = [];

  files.forEach((file) => {
    let content = fs.readFileSync(file, 'utf8');
    let parsed = matter(content);

    // Extract title from front matter or markdown content
    let title = parsed.data && parsed.data.title ? parsed.data.title : '';
    if (!title) {
      const tokens = marked.lexer(content);
      const headingToken = tokens.find((token) => token.type === 'heading' && token.depth === 1);
      title = headingToken ? headingToken.text : 'Untitled';
    }

    const relativePath = path.relative(__dirname, file).replace(/\\/g, '/').replace(/\.md$/, '');

    parsedFiles.push({
      title: title,
      tags: parsed.data.tags || [],
      type: parsed.data.type || 'Informational',
      parent: parsed.data.parent || '',
      personas: parsed.data.personas || [],
      url: `/${relativePath}`
    });
  });

  return parsedFiles;
}function generateGraphData() {
  const markdownFiles = getMarkdownFiles(docsDir);
  const parsedFiles = parseMarkdownFiles(markdownFiles);

  let nodes = [];
  let edges = [];
  let nodeIdMap = new Map();
  let currentId = 1;

  // Create nodes for titles
  parsedFiles.forEach((file) => {
    const color = getColorForType(file.type);
    const titleNode = { id: currentId++, label: file.title, url: file.url, color: { background: color }, type: file.type, personas: file.personas, value: 1.0 };
    let initialNodeId = titleNode.id;
    nodeIdMap.set(file.title, titleNode.id);
    nodes.push(titleNode);

    // Create two-way edges for tags and increment their values
    file.tags.forEach((tag) => {
      if (!nodeIdMap.has(tag)) {
        const tagNodeId = currentId++;
        const tagNode = { id: tagNodeId, label: tag, color: { background: color }, value: 1.0 };
        nodes.push(tagNode);
        nodeIdMap.set(tag, tagNodeId);
      }
      const tagNodeId = nodeIdMap.get(tag);
      edges.push({ from: titleNode.id, to: tagNodeId, arrows: 'to, from', color: { color: color } });

      // Find the tag node in the nodes array and update its value
      const tagNode = nodes.find(node => node.id === tagNodeId);
      tagNode.value += 0.1;
    });

    // Create one-way edge for parent
    if (file.parent) {
      if (!nodeIdMap.has(file.parent)) {
        const parentNodeId = currentId++;
        const parentNode = { id: parentNodeId, label: file.parent, color: { background: color }, value: 1.0 };
        nodes.push(parentNode);
        nodeIdMap.set(file.parent, parentNodeId);
      }
      const parentNodeId = nodeIdMap.get(file.parent);
      edges.push({ from: titleNode.id, to: parentNodeId, arrows: 'to', color: { color: color } });

      // Find the parent node in the nodes array and update its value if needed
      const parentNode = nodes.find(node => node.id === parentNodeId);
      parentNode.value += 0.1;
    }
  });

  return { nodes, edges };
}

function generateJSON() {
  const graphData = generateGraphData();

  fs.writeFileSync(
    path.join(__dirname, 'graphData.json'),
    JSON.stringify(graphData, null, 2)
  );

  console.log('Graph JSON file has been generated.');
}

generateJSON();
