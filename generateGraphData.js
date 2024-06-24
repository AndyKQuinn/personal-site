const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');

const docsDir = path.join(__dirname, 'docs');

const colorMap = {
  'title': 'lightblue',
  'windows': 'yellow',
  'linux': 'lightgreen',
  'tag3': 'purple',
  'default': 'orange'
};

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

    let title = parsed.data && parsed.data.title ? parsed.data.title : '';
    if (!title) {
      const tokens = marked.lexer(content);
      const headingToken = tokens.find((token) => token.type === 'heading' && token.depth === 1);
      title = headingToken ? headingToken.text : 'Untitled';
    }

    parsedFiles.push({
      title: title,
      tags: parsed.data.tags || [],
    });
  });

  return parsedFiles;
}

function generateGraphData() {
  const markdownFiles = getMarkdownFiles(docsDir);
  const parsedFiles = parseMarkdownFiles(markdownFiles);

  let nodes = [];
  let edges = [];
  let nodeId = 1;

  let titleNodeMap = new Map();
  let tagNodeMap = new Map();

  parsedFiles.forEach((file) => {
    const titleColor = colorMap['title'] || colorMap['default'];
    const titleNode = { id: nodeId, label: file.title, title: file.title, color: { background: titleColor } };
    nodes.push(titleNode);
    titleNodeMap.set(file.title, nodeId);
    nodeId++;

    file.tags.forEach((tag) => {
      if (!tagNodeMap.has(tag)) {
        const tagColor = colorMap[tag] || colorMap['default'];
        const tagNode = { id: nodeId, label: tag, title: tag, color: { background: tagColor } };
        nodes.push(tagNode);
        tagNodeMap.set(tag, nodeId);
        nodeId++;
      }
      const edgeColor = colorMap[tag] || colorMap['default'];
      edges.push({ from: titleNode.id, to: tagNodeMap.get(tag), color: { color: edgeColor } });
    });
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
