import { useRef, useState, useEffect } from "react"
import BrowserOnly from "@docusaurus/BrowserOnly"
// import ForceGraph3D from "react-force-graph-3d"
import Layout from "@theme/Layout"
// import {
//   Bloom,
//   DepthOfField,
//   EffectComposer,
//   Noise,
//   Vignette,
// } from "@react-three/postprocessing"
import { Canvas } from "@react-three/fiber"
import graphData from "../../../data.json"
import SpriteText from "three-spritetext"
import {
  Box,
  Button,
  CardActions,
  CardContent,
  Menu,
  Stack,
  Typography,
} from "@mui/material"

export default function ForceGraphWithEffects() {
  const fgRef = useRef()
  const [selectedNode, setSelectedNode] = useState(null)
  const [anchorEl, setAnchorEl] = useState(null)

  const handleNodeClick = (node, event) => {
    console.log("Node: ", node)
    console.log("Event: ", event.target)
    setSelectedNode(node)
    setAnchorEl(event.target)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setSelectedNode(null)
  }

  return (
    <BrowserOnly>
      {() => {
        const ForceGraph3D = require("react-force-graph-3d").default

        return (
          <Layout>
            <div>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {selectedNode && (
                  <Box>
                    <CardContent>
                      <Stack gap={2}>
                        <Typography variant="h4">{selectedNode.id}</Typography>
                        <Typography>{selectedNode.description}</Typography>
                      </Stack>
                    </CardContent>
                    <CardActions>
                      <Button href={selectedNode.href}>View More</Button>
                    </CardActions>
                  </Box>
                )}
              </Menu>
            </div>
            <ForceGraph3D
              graphData={graphData}
              nodeAutoColorBy="group"
              linkAutoColorBy="group"
              backgroundColor="#000003"
              onNodeClick={handleNodeClick}
              linkDirectionalParticles="value"
              linkDirectionalParticleSpeed={(d) => d.value * 0.01}
              nodeThreeObject={(node) => {
                const sprite = new SpriteText(node.id)
                sprite.color = node.color
                sprite.textHeight = 12
                return sprite
              }}
            />
          </Layout>
        )
      }}
    </BrowserOnly>
  )
}
