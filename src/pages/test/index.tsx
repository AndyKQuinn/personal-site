import React, { useState } from "react"
import {
  Container,
  Grid,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from "@mui/material"

const data = {
  "Climate for learning": [
    {
      title: "Code Maintainability",
      subItems: [
        { title: "Clean Code", link: "/docs/clean-code" },
        { title: "Code Reviews", link: "/docs/code-reviews" },
      ],
    },
    {
      title: "Documentation quality",
      subItems: [
        { title: "API Docs", link: "/docs/api-docs" },
        { title: "User Guides", link: "/docs/user-guides" },
      ],
    },
    // ... other items
  ],
  "Fast flow": [
    {
      title: "Continuous delivery",
      subItems: [
        { title: "CI/CD Pipelines", link: "/docs/cicd-pipelines" },
        { title: "Release Management", link: "/docs/release-management" },
      ],
    },
    // ... other items
  ],
  "Fast feedback": [
    {
      title: "Continuous integration",
      subItems: [
        { title: "Build Automation", link: "/docs/build-automation" },
        { title: "Testing Frameworks", link: "/docs/testing-frameworks" },
      ],
    },
    // ... other items
  ],
}

const categories = Object.keys(data)

const FilterableComponent = () => {
  const [filter, setFilter] = useState<string | null>("Climate for learning")
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: string | null
  ) => {
    if (newFilter !== null) {
      setFilter(newFilter)
      setSelectedItem(null) // Reset selected item when changing category
    }
  }

  const handleItemClick = (itemTitle: string) => {
    setSelectedItem(itemTitle)
  }

  const getSubItems = (category: string, itemTitle: string) => {
    const categoryItems = data[category]
    const item = categoryItems.find((item) => item.title === itemTitle)
    return item?.subItems || []
  }

  return (
    <Container>
      <Box mb={4}>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          aria-label="text alignment"
        >
          <ToggleButton value="Climate for learning">
            Learning Climate
          </ToggleButton>
          <ToggleButton value="Fast flow">Fast Flow</ToggleButton>
          <ToggleButton value="Fast feedback">Fast Feedback</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Box border={1} borderRadius={2} p={2}>
            {filter && (
              <>
                <Typography variant="h6" gutterBottom>
                  {filter}
                </Typography>
                {data[filter].map((item, index) => (
                  <Button
                    key={index}
                    onClick={() => handleItemClick(item.title)}
                    fullWidth
                  >
                    {item.title}
                  </Button>
                ))}
              </>
            )}
          </Box>
        </Grid>

        {selectedItem && (
          <Grid item xs={12} md={4}>
            <Box border={1} borderRadius={2} p={2}>
              <Typography variant="h6" gutterBottom>
                {selectedItem}
              </Typography>
              {getSubItems(filter!, selectedItem).map((subItem, index) => (
                <Button key={index} href={subItem.link} fullWidth>
                  {subItem.title}
                </Button>
              ))}
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  )
}

export default FilterableComponent
