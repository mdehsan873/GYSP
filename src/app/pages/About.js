import React from 'react'
import { CssBaseline, useTheme, useMediaQuery, Box, Container, Grid, Typography } from '@mui/material'
import { Image } from 'react-bootstrap';
export default function About() {
    const smd = useMediaQuery(useTheme().breakpoints.down('sm'))
    return (
        <>
            <CssBaseline />
            <Box
                sx={{
                    px: smd ? 5 : 3,
                    py: smd ? 5 : 1,
                    textAlign: smd ? 'center' : null,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: 'white',
                    background: 'linear-gradient(to right bottom, blue, lightblue)',
                }}
            >
                <Container maxWidth='lg' disableGutters sx={{ mt: 10 }}>
                    <Grid container >
                        <Grid item lg={5} xs={12} >

                        </Grid>
                        <Grid item lg={7} xs={12}>
                            <Typography variant='h4' mt={1}>
                                SavMeds
                            </Typography>
                            <Typography variant='body1' mt={1} textAlign='justify' >
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat nisi voluptates quae, vel ea inventore! Velit perspiciatis exercitationem quo asperiores, sit accusantium! Eaque nisi sapiente ipsa voluptates molestias eos autem quis possimus praesentium aut fugiat, voluptatem consectetur eveniet! Natus possimus hic dignissimos, minus obcaecati inventore nisi nulla aliquam eos. Earum ab velit, eveniet quibusdam exercitationem obcaecati officiis nihil sed, magnam ad fugit deleniti ipsa expedita dicta, atque veniam nemo laborum eum voluptate dolore delectus aspernatur? Minus, molestias sint aut asperiores odit quasi nobis nulla aperiam repudiandae eaque laudantium dolorem expedita aspernatur necessitatibus unde alias debitis quidem. Similique consequatur deleniti in voluptatum enim veniam! Dicta quos odit expedita, veritatis libero in alias mollitia ratione quam fuga eveniet, nisi velit nam ex omnis. Libero eligendi labore et cum enim hic quasi! Eius expedita porro placeat incidunt laudantium sed dicta quam commodi quod quos nobis voluptates ex veniam, possimus, amet rem quis, animi iure nemo libero. Enim ipsa eveniet omnis assumenda dolor nisi laborum illum quos fugiat id. Beatae itaque voluptas, repellendus, explicabo cupiditate perferendis, unde aut quibusdam omnis nihil sequi. Sit suscipit hic in doloribus debitis tenetur enim odit explicabo quis beatae vel quasi deserunt iusto, assumenda, ad non! Voluptas, possimus beatae.                                <br />
                                <br />
                            </Typography>
                        </Grid>
                    </Grid>

                </Container>
            </Box>
        </>
    )
}
