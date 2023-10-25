import { Button, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import TableWrapper from '../../components/wrappers/TableWrapper'
import Paper from '@mui/material/Paper';
import AddCocurricularEventDialog from '../../components/dialogs/cocurricular/AddCocurricularEventDialog';
import Loader from '../../components/Loader';
import MUIDataTable from 'mui-datatables';
import { options2 } from '../../utils/variables';
import { Link } from 'react-router-dom';
import AxiosObj from '../../axios/AxiosObj';
import { handleUnarchieve } from '../../utils';
import { resetLocal } from './../../partials/localStorage'

export default function CocurricularInactive() {
    useEffect(() => {
        resetLocal("cocurricular");
    }, []);
    const [open, setOpen] = React.useState(false)
    const [eventList, setEventList] = useState([])
    const [apiData, setApiData] = useState(false)
    const columns = ['Id', 'Name', 'Category', 'Day of Event', 'Session', 'View', 'Unarchive']

    const unarchieve = (id) => {
        handleUnarchieve(id, "event/event-update");
        setEventList(prev => prev.filter((e) => e[0] !== id));
    }
    const fetchEventList = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'event/Inactive-event-list/',
            headers: {}
        };

        AxiosObj.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setApiData(response.data)
                setEventList(response?.data.map(item => [item?.id.toString(), item?.Event_Name, item?.Category, item?.Event_Date, item?.session, <Link className='secondary' to={'/event-details/' + item?.id}>View</Link>, <Button
                    color="info"
                    onClick={() => {
                        unarchieve(item?.id.toString())
                    }}
                >
                    restore
                </Button>,]))
            })
            .catch((error) => {
                console.log(error);
            });

    }
    useEffect(() => {
        fetchEventList()
    }, [])
    return (
        <TableWrapper>
            <Stack direction={'row'} spacing={2}>
                <Button color='info' sx={{ textTransform: 'capitalize' }} onClick={() => { open ? setOpen(false) : setOpen(true) }}>+Add Event</Button>
                <Button color='info' sx={{ textTransform: 'capitalize' }} onClick={() => { }}>Download Event Template</Button>

            </Stack>
            <Paper sx={{ width: '100%' }}>
                {apiData == false ? <Loader /> :

                    <MUIDataTable
                        title={'Co-curricular'}
                        columns={columns}
                        data={eventList}
                        options={options2}
                    />
                }

            </Paper>
            <AddCocurricularEventDialog open={open} setOpen={setOpen} />
        </TableWrapper>
    )
}
