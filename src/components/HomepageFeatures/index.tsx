import useMediaQuery from "@mui/material/useMediaQuery"

import {
  Card,
  CardActions,
  CardContent,
  Container,
  Stack,
  Typography,
} from "@mui/material"

type FeatureItem = {
  title: string
  image: any
  description: JSX.Element
}

const FeatureList: FeatureItem[] = [
  {
    title: "Full Stack Developer",
    image: "/img/card-1.png",
    description: (
      <>
        I come from a Windows and Unix server administration background and
        self-taught myself how to code. I have experience with Golang,
        JavaScript, Python and various other languages and frameworks.
      </>
    ),
  },
  {
    title: "Documentation Nerd",
    image: "/img/card-2.png",
    description: (
      <>
        I am passionate about ensuring documentation is updated regularly, easy
        to read and understand, and is updated as regualarly as the codebase
        itself.
        <div style={{ padding: 4 }} />I also am <b>obsessed</b> with{" "}
        <span style={{ color: "purple" }}>Docusaurus</span>. 😍
      </>
    ),
  },
  {
    title: "Usability Advocate",
    image: "/img/card-3.png",
    description: (
      <>
        Users must be able to traverse your site with ease, and your users may
        not always be able to see, hear or use your content. I am an A11Y and
        usability advocate and will ensure your site is usable by all.
      </>
    ),
  },
]

function Feature({ title, image, description }: FeatureItem) {
  return (
    <Card elevation={8} sx={{ maxWidth: 345 }}>
      <CardContent>
        <img src={image} alt={title} height="200" width="100%" />
      </CardContent>
      <Stack justifyContent="center" p={2} gap={4}>
        <Typography variant="h5" align="center">
          {title}
        </Typography>
        <Typography align="center">{description}</Typography>
      </Stack>
    </Card>
  )
}

export default function HomepageFeatures(): JSX.Element {
  const matches = useMediaQuery("(min-width:600px)")

  return (
    <Container sx={{ padding: 4 }}>
      <Stack direction={matches ? "row" : "column"} gap={4}>
        {FeatureList.map((props, idx) => (
          <Feature key={idx} {...props} />
        ))}
      </Stack>
    </Container>
  )
}
