import { useRef, useState, useEffect } from "react"
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  Divider,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material"
import { ForceGraph3D } from "react-force-graph"
import SpriteText from "three-spritetext"
import Layout from "@theme/Layout"
import graphData from "../../../data.json"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"

export default function Graph() {
  const fgRef = useRef()
  const [selectedNode, setSelectedNode] = useState(null)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>()

  useEffect(() => {
    const bloomPass = new UnrealBloomPass()
    bloomPass.strength = 3
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
      Thingy
      {/* <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ padding: 0 }}
        style={{
          position: "absolute",
          top: "-600px",
          left: "10px",
          padding: 0,
        }}
      >
        {selectedNode && (
          <Box sx={{ width: 400 }}>
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
      <ForceGraph3D
        ref={fgRef}
        backgroundColor="#000003"
        graphData={graphData}
        nodeAutoColorBy="group"
        onNodeClick={handleNodeClick}
        linkDirectionalParticles="value"
        linkDirectionalParticleSpeed={(d) => d.value * 0.01}
        nodeThreeObject={(node) => {
          const sprite = new SpriteText(node.id)
          sprite.color = node.color
          sprite.textHeight = 8
          return sprite
        }}
      /> */}
    </Layout>
  )
}
