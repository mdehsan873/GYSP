import { Card, Divider, Grid, Paper, Typography, useMediaQuery } from '@mui/material'
import { Container, Stack } from '@mui/system'
import React from 'react'
import { Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'

export default function Billing() {
    const mob = useMediaQuery('(max-width:600px)')
    return (
        <Container>
            <Grid container>
                <Grid item lg={3} md={3} xs={12}>
                    <Card sx={{ margin: 1, padding: 2, height: mob ? undefined : '80vh' }}>
                        <Stack direction={'row'} alignItems='center' spacing={1}>
                            <Image src={require('../../assets/Logo/logo_white2x.png')} height='50' />
                            <Stack>
                                <Typography variant='h5'>GYSP</Typography>
                                <Typography>Active</Typography>
                                <Typography>Since Feb 20th 2023</Typography>
                            </Stack>
                        </Stack>
                        <Divider sx={{ marginY: 3 }} />
                        <Typography>View invoices</Typography>
                        <Typography>Transaction history</Typography>
                        <Divider sx={{ marginY: 3 }} />
                    </Card>
                </Grid>
                <Grid item lg={9} md={9} xs={12}>
                    <Card sx={{ margin: 1, padding: 2, marginLeft: mob ? 0 : 1, height: mob ? undefined : '80vh' }}>
                        <Typography variant='h5'>Plan Details</Typography>
                        <Divider />
                        <table style={{ textAlign: 'left' }} className='tbl'>
                            <tr>
                                <th><Typography marginY={'auto'}>Plan</Typography></th>
                                <td><span style={{ padding: mob ? 8 : 50 }}></span></td>
                                <td><Typography>Basic</Typography></td>
                            </tr>
                            <tr>
                                <th><Typography>Lenience</Typography></th>
                                <td></td>
                                <td><Typography>1532</Typography></td>
                            </tr>
                            <tr>
                                <th><Typography>Total Dues</Typography></th>
                                <td></td>
                                <td><Typography>INR 00.00</Typography></td>
                            </tr>

                        </table>
                        <Typography variant='h5' marginTop={8}>Billing Details</Typography>
                        <table style={{ textAlign: 'left' }} className='tbl'>
                            <tr>
                                <th><Typography marginY={'auto'}>Next billing date</Typography></th>
                                <td><span style={{ padding: mob ? 8 : 50 }}></span></td>
                                <td><Typography>March 12th 2023</Typography></td>
                            </tr>
                            <tr>
                                <th><Typography>Payment Account ID</Typography></th>
                                <td></td>
                                <td><Typography>1532-5435-44D4</Typography></td>
                            </tr>
                            <tr>
                                <th><Typography>Payments Profile</Typography></th>
                                <td></td>
                                <td><Typography>6575664565765</Typography></td>
                            </tr>
                        </table>
                        <Typography variant='h6' marginTop={8}>Help</Typography>
                        <Link to={'#'} ><Typography className='secondary' >View Invoices</Typography></Link>
                        <Link to={'/payment-methods'} ><Typography className='secondary' >View Payment Methods</Typography></Link>
                        <Link to={'#'} ><Typography className='secondary' >View Transaction History</Typography></Link>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}
