const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const marked = require('marked');

const docsDir = path.join(__dirname, 'docs');

// Define a color mapping for tags and titles
const colorMap = {
  'lightblue': ['title'],
  'red': ['Agile'],
  'green': ['SCM'],
  'purple': ['Docker'],
  'default': ['lightgray'] // Default color for tags not explicitly listed
};

// Define a group mapping for groups
const groupMap = {
  'persons': ['CI/CD'],
  'favorites': ['Source Control'],
  'stars': ['Agile'],
  'checks': ['SCM'],
  'searches': [''],
  'comments': [''],
  'thumbsUp': ['Documentation'],
  'default': ['closes'] // Default group for values not explicitly listed
};

function getColorForTag(tag) {
  for (const color in colorMap) {
    if (colorMap[color].includes(tag)) {
      return color;
    }
  }
  return colorMap['default'][0];
}

function getGroupForValue(group) {
  for (const grp in groupMap) {
    if (groupMap[grp].includes(group)) {
      return grp;
    }
  }
  return groupMap['default'][0];
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
    const group = parsed.data.group ? getGroupForValue(parsed.data.group) : getGroupForValue('default');

    parsedFiles.push({
      title: title,
      tags: parsed.data.tags || [],
      url: `/${relativePath}`,
      group: group
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

  // Create nodes for titles and tags
  parsedFiles.forEach((file) => {
    const titleColor = getColorForTag('title');
    const titleNode = { id: nodeId, label: file.title, title: file.title, url: file.url, color: { background: titleColor }, group: file.group };
    nodes.push(titleNode);
    titleNodeMap.set(file.title, nodeId);
    nodeId++;

    file.tags.forEach((tag) => {
      if (!tagNodeMap.has(tag)) {
        const tagColor = getColorForTag(tag);
        const tagNode = { id: nodeId, label: tag, title: tag, color: { background: tagColor }, group: getGroupForValue('default') };
        nodes.push(tagNode);
        tagNodeMap.set(tag, nodeId);
        nodeId++;
      }
      const edgeColor = getColorForTag(tag);
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
