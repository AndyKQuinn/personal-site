import { useRef, useState, useEffect } from "react"
import {
  Box,
  Button,
  Stack,
  Dialog,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material"
import { ForceGraph3D } from "react-force-graph"
import graphData from "../../../graphData.json"
import SpriteText from "three-spritetext"
import Layout from "@theme/Layout"
import graphingData from "../../../graph_structure.json"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"

export default function Graph() {
  const fgRef = useRef()
  const [selectedNode, setSelectedNode] = useState(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>()

  useEffect(() => {
    const bloomPass = new UnrealBloomPass()
    bloomPass.strength = 4
    bloomPass.radius = 1
    bloomPass.threshold = 0
    fgRef.current.postProcessingComposer().addPass(bloomPass)

    const composer = new EffectComposer(fgRef.current.renderer())
    composer.addPass(
      new RenderPass(fgRef.current.scene(), fgRef.current.camera())
    )
    composer.addPass(bloomPass)

    const animate = () => {
      requestAnimationFrame(animate)
      composer.render()
    }

    animate()
  }, [])

  const handleNodeClick = (node, event) => {
    setSelectedNode(node)
    setAnchorEl(event.target)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setSelectedNode(null)
  }

  return (
    <Layout>
      <Box
        sx={{
          zIndex: 100,
          position: "absolute",
          top: "-100px",
          left: "10px",
          backgroundColor: "white",
        }}
        style={{ position: "absolute", top: "-600px", left: "10px" }}
      >
        Box
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{ position: "absolute", top: "-600px", left: "10px" }}
      >
        {selectedNode && (
          <div>
            <MenuItem disabled>
              <Typography variant="h6">{selectedNode.id}</Typography>
            </MenuItem>
            <MenuItem component="a" href={selectedNode.href}>
              View Document
            </MenuItem>
          </div>
        )}
      </Menu>
      <ForceGraph3D
        ref={fgRef}
        backgroundColor="#000003"
        graphData={graphingData}
        nodeAutoColorBy="group"
        onNodeClick={handleNodeClick}
        nodeThreeObject={(node) => {
          const sprite = new SpriteText(node.id)
          sprite.color = node.color
          sprite.textHeight = 8
          return sprite
        }}
      />
    </Layout>
  )
}
