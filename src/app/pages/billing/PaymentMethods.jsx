import { Card, Divider, Grid, Typography, useMediaQuery } from '@mui/material'
import { Container, Stack } from '@mui/system'
import React from 'react'
import { Image } from 'react-bootstrap'

export default function PaymentMethods() {
    const PaymentCard = () => {
        return (
            <>
                <Stack direction={'row'} alignItems='center' spacing={1} paddingBottom={9} >
                    <Image src={require('../../assets/Images/visa.png')} height={50} />
                    <Typography>xxxx xxxx xxxx 7567</Typography>
                </Stack>
                <Divider />
                <Stack direction={'row'} justifyContent='space-between'>
                    <Typography className='secondary'>Primary</Typography>
                    <Typography >Remove</Typography>
                </Stack>
            </>
        )
    }
    const AddCard = () => {
        return (
            <Grid lg={6} md={6} sm={12} xs={12}  >

                <Card sx={{ margin: 1, padding: 8, borderStyle: 'dashed', borderColor: '#1A73E8' }}>
                    <Typography textAlign={'center'}>+ Add Payment Method</Typography>
                </Card>
            </Grid>
        )
    }
    const CardWraper = ({ children }) => {
        return (
            <Grid lg={6} md={6} sm={12} xs={12} >
                <Card sx={{ margin: 1, padding: 3, }}>
                    {children}
                </Card>
            </Grid>
        )
    }
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
                        <Typography variant='h5'>Payment Methods</Typography>
                        <Divider />
                        <Grid container >
                            <CardWraper><PaymentCard /></CardWraper>
                            <CardWraper><PaymentCard /></CardWraper>
                            <AddCard />
                        </Grid>
                        <Card></Card>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    )
}
