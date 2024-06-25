import React, { useState } from "react"
import Graph from "react-graph-vis"
import Layout from "@theme/Layout"
import { Box, Divider, Menu, MenuItem, Typography } from "@mui/material"
import graphData from "../../../graphData.json"

export default function GraphPage() {
  const [selectedNode, setSelectedNode] = useState(null)
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [connectedNodes, setConnectedNodes] = useState([])

  const options = {
    layout: {
      hierarchical: false,
    },
    nodes: {
      shape: "dot",
      size: 30,
      font: {
        size: 16,
      },
      borderWidth: 2,
    },
    edges: {
      width: 2,
    },
    height: "100%",
    groups: {
      persons: {
        shape: "icon",
        icon: {
          face: "FontAwesome",
          code: "\uf007", // User icon
          size: 50,
          color: "red",
        },
      },
      favorites: {
        shape: "icon",
        icon: {
          face: "FontAwesome",
          code: "\uf004", // Heart icon
          size: 50,
          color: "red",
        },
      },
      stars: {
        shape: "icon",
        icon: {
          face: "FontAwesome",
          code: "\uf005", // Star icon
          size: 50,
          color: "gold",
        },
      },
      checks: {
        shape: "icon",
        icon: {
          face: "FontAwesome",
          code: "\uf00c", // Check icon
          size: 50,
          color: "green",
        },
      },
      closes: {
        shape: "icon",
        icon: {
          face: "FontAwesome",
          code: "\uf00d", // Close icon
          size: 50,
          color: "black",
        },
      },
      searches: {
        shape: "icon",
        icon: {
          face: "FontAwesome",
          code: "\uf002", // Search icon
          size: 50,
          color: "blue",
        },
      },
      comments: {
        shape: "icon",
        icon: {
          face: "FontAwesome",
          code: "\uf086", // Comment icon
          size: 50,
          color: "orange",
        },
      },
      thumbsUp: {
        shape: "icon",
        icon: {
          face: "FontAwesome",
          code: "\uf164", // Thumbs up icon
          size: 50,
          color: "blue",
        },
      },
      lightbulbs: {
        shape: "icon",
        icon: {
          face: "FontAwesome",
          code: "\uf0eb", // Lightbulb icon
          size: 50,
          color: "yellow",
        },
      },
      bells: {
        shape: "icon",
        icon: {
          face: "FontAwesome",
          code: "\uf0f3", // Bell icon
          size: 50,
          color: "purple",
        },
      },
      source: {
        color: { border: "white" },
      },
    },
  }

  const events = {
    select: function (event) {
      const { nodes, edges } = event
      if (nodes.length > 0) {
        const node = graphData.nodes.find((node) => node.id === nodes[0])
        const connected = graphData.edges
          .filter((edge) => edge.from === node.id || edge.to === node.id)
          .map((edge) =>
            graphData.nodes.find(
              (n) => n.id === (edge.from === node.id ? edge.to : edge.from)
            )
          )
        setSelectedNode(node)
        setConnectedNodes(connected)
        setAnchorEl(event.pointer.DOM)
      }
    },
  }

  const handleClose = () => {
    setAnchorEl(null)
    setSelectedNode(null)
    setConnectedNodes([])
  }

  const openLink = () => {
    if (selectedNode && selectedNode.url) {
      window.open(selectedNode.url, "_blank")
    }
    handleClose()
  }

  return (
    <Layout title="Graph" description="Knowledge graph">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      ></link>
      <Typography p={2} align="center" variant="h3" component="h1">
        Knowledge Graph
      </Typography>

      {selectedNode && (
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={{ top: 100, left: 0 }}
        >
          <MenuItem disabled>{selectedNode.label}</MenuItem>
          {selectedNode.url && (
            <MenuItem onClick={openLink}>Learn more</MenuItem>
          )}
          <Divider />
          <MenuItem disabled>Related Nodes</MenuItem>
          {connectedNodes.map((node) => (
            <MenuItem key={node.id} disabled>
              {node.label}
            </MenuItem>
          ))}
        </Menu>
      )}

      <Box
        justifyContent="center"
        alignItems="center"
        sx={{
          height: "80vh",
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Graph
          style={{
            border: "1px solid purple",
            borderRadius: "10px",
            height: "80%",
            width: "80%",
          }}
          graph={graphData}
          options={options}
          events={events}
        />
      </Box>
    </Layout>
  )
}
