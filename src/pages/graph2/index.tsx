import React, { useState, useEffect } from "react"
import Graph from "react-graph-vis"
import Layout from "@theme/Layout"
import {
  Box,
  Container,
  Divider,
  Grid,
  Menu,
  MenuItem,
  ListItemText,
  FormControl,
  InputLabel,
  Stack,
  Select,
} from "@mui/material"
// import "./Graph.css"

// Assume `graphData` is imported from the generated JSON file
import graphData from "../../../graphData.json"

const GraphComponent = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)
  const [connectedNodes, setConnectedNodes] = useState([])
  const [filteredData, setFilteredData] = useState(graphData)
  const [selectedType, setSelectedType] = useState("All")
  const [selectedPersona, setSelectedPersona] = useState("All")

  // Extract types and personas from nodes
  const types = [
    "All",
    ...new Set(graphData.nodes.map((node) => node.type).filter(Boolean)),
  ]
  const personas = [
    "All",
    ...new Set(
      graphData.nodes.flatMap((node) => node.personas).filter(Boolean)
    ),
  ]

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value)
  }

  const handlePersonaChange = (event) => {
    setSelectedPersona(event.target.value)
  }

  useEffect(() => {
    let filteredNodes = graphData.nodes
    if (selectedType !== "All") {
      filteredNodes = filteredNodes.filter((node) => node.type === selectedType)
    }
    if (selectedPersona !== "All") {
      filteredNodes = filteredNodes.filter((node) =>
        node?.personas?.includes(selectedPersona)
      )
    }
    const filteredEdges = graphData.edges.filter(
      (edge) =>
        filteredNodes.some((node) => node.id === edge.from) &&
        filteredNodes.some((node) => node.id === edge.to)
    )
    setFilteredData({ nodes: filteredNodes, edges: filteredEdges })
  }, [selectedType, selectedPersona])

  const events = {
    select: function (event) {
      const { nodes } = event
      if (nodes.length > 0) {
        const node = filteredData.nodes.find((node) => node.id === nodes[0])
        const connected = filteredData.edges
          .filter((edge) => edge.from === node.id || edge.to === node.id)
          .map((edge) =>
            filteredData.nodes.find(
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
    <Layout>
      <Container>
        <Grid container>
          <Grid item xs={2}>
            <Stack>
              <InputLabel>Type</InputLabel>
              <Select
                value={selectedType}
                onChange={handleTypeChange}
                label="Type"
              >
                {types.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>

              <InputLabel>Persona</InputLabel>
              <Select
                value={selectedPersona}
                onChange={handlePersonaChange}
                label="Persona"
              >
                {personas.map((persona) => (
                  <MenuItem key={persona} value={persona}>
                    {persona}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          </Grid>

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
              graph={filteredData}
              options={{
                layout: { hierarchical: true },
                edges: {
                  color: "#000000",
                  arrows: {
                    to: { enabled: true, scaleFactor: 1 },
                    from: { enabled: true, scaleFactor: 1 },
                  },
                },
                nodes: {
                  shape: "dot",
                  size: 30,
                  font: {
                    size: 16,
                  },
                  borderWidth: 2,
                  scaling: {
                    customScalingFunction: function (min, max, total, value) {
                      return value / total
                    },
                    min: 5,
                    max: 150,
                  },
                },
                groups: {
                  diamonds: { shape: "diamond" },
                  dotsWithLabel: { shape: "dot", label: { visible: true } },
                  mints: { shape: "box", color: { background: "green" } },
                  icons: {
                    shape: "icon",
                    icon: {
                      face: "FontAwesome",
                      code: "\uf007",
                      size: 50,
                      color: "red",
                    },
                  },
                  default: { shape: "dot", color: { background: "black" } },
                },
                height: "100%",
              }}
              events={events}
            />
          </Box>
          {selectedNode && (
            <Menu
              anchorReference="anchorPosition"
              anchorPosition={{ top: 100, left: 0 }} // Adjust 'top' as needed
              open={Boolean(selectedNode)}
              onClose={handleClose}
            >
              <MenuItem disabled>{selectedNode.label}</MenuItem>
              <MenuItem onClick={openLink}>Open Page</MenuItem>

              <Divider />
              <MenuItem disabled>Related Nodes</MenuItem>
              {connectedNodes.map((node) => (
                <MenuItem key={node.id} disabled>
                  {node.label}
                </MenuItem>
              ))}
            </Menu>
          )}
        </Grid>
      </Container>
    </Layout>
  )
}

export default GraphComponent
