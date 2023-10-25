import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, FormLabel, Grid, Input, MenuItem, Select, Stack } from '@mui/material';
import axios from 'axios';
import AxiosObj from '../../../axios/AxiosObj';
import { useEffect, useState } from 'react';
import Loader from '../../Loader';

export default function EditResultDialog({ open, setOpen, id }) {
    const [testPattern, setTestPattern] = useState('');
    const [session, setSession] = useState('');
    const [selectClass, setSelectClass] = useState('');
    const [maxDayAttandence, setMaxDayAttandence] = useState('')
    const [loading, setLoading] = useState(false)

    const handleClose = () => {
        setOpen(false);
    };
    const [sessionData, setSessionData] = useState([])
    const [classData, setClassData] = useState([])
    const [testPatternData, setTestPatternData] = useState([])

    const fetchResult = async () => {
        AxiosObj.get('exam_result/exam_result-detail/' + id + '/')
            .then(res => {
                const data = res.data
                setSession(data?.Session)
                setSelectClass(data?.Class)
                setMaxDayAttandence(data?.max_day_attendence)
                setTestPattern(data?.Test_pattern)
            })
            .catch(e => console.log('error while fetching result details', e))
    }
    useEffect(() => {
        if(open ===true){
            fetchResult()
        }
    }, [id, open])
    const SelectTestPattern = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                {/* <InputLabel id="testPattern-simple-select-standard-label">testPattern</InputLabel> */}
                <Select
                    labelId="testPattern-simple-select-standard-label"
                    id="testPattern-simple-select-standard"
                    value={testPattern}
                    onChange={(e) => { setTestPattern(e.target.value) }}
                    label="testPattern"
                >
                    {testPatternData.map(item => <MenuItem value={item?.id}>{item?.Test_pattern_name}</MenuItem>)}
                </Select>
            </FormControl>
        )
    }
    const SelectSession = () => {
        return (
            <>
                {/* <InputLabel id="session-simple-select-standard-label">Session</InputLabel> */}
                <FormControl variant="standard" sx={{ width: '100%' }}>
                    <Select
                        labelId="session-simple-select-standard-label"
                        id="session-simple-select-standard"
                        value={session}
                        onChange={(e) => { setSession(e.target.value) }}
                        label="Session"
                    >
                        {sessionData.map(item => <MenuItem value={item?.id}>{item?.session}</MenuItem>)}
                    </Select>
                </FormControl>
            </>
        )
    }
    const SelectClass = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                {/* <InputLabel id="selectClass-simple-select-standard-label">Class</InputLabel> */}
                <Select
                    labelId="selectClass-simple-select-standard-label"
                    id="selectClass-simple-select-standard"
                    value={selectClass}
                    onChange={(e) => { setSelectClass(e.target.value) }}
                    label="selectClass"
                >
                    {classData.map(item => <MenuItem value={item?.id}>{item?.Class}</MenuItem>)}
                </Select>
            </FormControl>
        )
    }
    const handleUpdateResult = async () => {
        setLoading(true)
        let data = JSON.stringify({
            "Session": session,
            "Class": selectClass,
            "Test_pattern": testPattern,
            "max_day_attendence": maxDayAttandence
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'exam_result/exam_result-update/' + id + '/',
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        AxiosObj.request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                window.location.reload()
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => { setLoading(false) })
    }
    return (
        <div>
            <Dialog maxWidth='xs' fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' >Update Result</DialogTitle>
                <DialogContent >
                    <form  >
                        <Stack spacing={2} >
                            <Grid container justifyContent='space-around' alignItems={'center'}>
                                <Grid item lg={4} xs={12}>
                                    <FormLabel>Session</FormLabel>
                                    <SelectSession />
                                </Grid>
                                <Grid item lg={4} xs={12}>
                                    <FormLabel>Class</FormLabel>
                                    <SelectClass />

                                </Grid>
                            </Grid>
                            <Grid container justifyContent='space-around' alignItems={'center'}>

                                <Grid item lg={4} xs={12}>
                                    <FormLabel>Test Pattern</FormLabel>
                                    <SelectTestPattern />
                                </Grid>
                                <Grid item lg={4} xs={12}>
                                    <Stack>
                                        <FormLabel>Max Day Attandance</FormLabel>
                                        <Input value={maxDayAttandence} onChange={e => setMaxDayAttandence(e.target.value)} />
                                    </Stack>
                                </Grid>
                            </Grid>
                        </Stack>
                    </form>

                </DialogContent>
                {loading ? <Loader /> : <Button variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={handleUpdateResult} >Update Result</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
