import { Container, Typography } from "@mui/material"

const Page404 = () => {
    return (
        <Container sx={{ textAlign: 'center', padding: 5 }} >
            <Typography variant="h1">Page not found</Typography>
            <Typography variant="subtitle1">The page you are looking for is not found</Typography>
        </Container>
    )
}
export default Page404