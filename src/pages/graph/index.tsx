import React, { useState } from "react"
import Graph from "react-graph-vis"
import Layout from "@theme/Layout"
import { Box, Menu, MenuItem, Modal, Typography } from "@mui/material"
import graphData from "../../../graphData.json"

export default function GraphPage() {
  const [selectedNode, setSelectedNode] = useState(null)

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const options = {
    edges: {
      color: "#000000",
    },
    height: "100%",
  }

  const events = {
    select: function (event) {
      const { nodes } = event
      if (nodes.length > 0) {
        const node = graphData.nodes.find((node) => node.id === nodes[0])
        setSelectedNode(node)
        setAnchorEl(event.pointer.DOM)
      }
    },
  }

  const handleClose = () => {
    setAnchorEl(null)
    setSelectedNode(null)
  }

  const openLink = () => {
    if (selectedNode && selectedNode.url) {
      window.open(selectedNode.url, "_blank")
    }
    handleClose()
  }

  return (
    <Layout title="Graph" description="Knowledge graph">
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
            <MenuItem onClick={openLink}>Open Document</MenuItem>
          )}
          <MenuItem onClick={handleClose}>Close</MenuItem>
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
