import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Loader from '../../components/Loader';
import { useState, useEffect } from 'react';
import AxiosObj from '../../axios/AxiosObj';
import { toast } from 'react-toastify';
import secureLocalStorage from "react-secure-storage";
import { FormLabel, Stack, Typography, MenuItem, Select, FormControl } from '@mui/material'

export default function EditRankBox({ open, setOpen, data }) {

    const [loading, setLoading] = useState(false)
    const capitalizeWords = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    const [eventId, setEventID] = useState('')
    const [studentId, setStudentID] = useState('')
    const [rankValue, setRankValue] = useState('')
    const [studentName, setStudentName] = useState('')

    const [errorMsg, setErrorMsg] = useState('')
    const [isChange, setIsChange] = useState(false)

    const handleClose = () => {
        setEventID('')
        setStudentID('')
        setRankValue('')
        setErrorMsg('')
        setOpen(false);
        setIsChange(false)
    };

    const updatedStudentRank = () => {

        let data = JSON.stringify({
            "event_id": eventId,
            "student_id": studentId,
            "rank": rankValue,
        });

        const config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: 'event/edit/event/rank/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),      
            },
            data: data
        };

        AxiosObj.request(config)
            .then((response) => {
                if (response.data?.Success) {
                    toast.success(response.data?.data || "Student rank has been updated");
                    // Reload the window after 2 seconds
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    toast.error(response.data?.data || "Something went wrong...!");
                }
            })
            .catch((e) => {
                try {
                    e.response.data?.Data.map(item => (
                        toast.error(capitalizeWords(item) || "Something went wrong...!")
                    ))
                } catch (e) {
                    toast.error(capitalizeWords(e.response.data?.Data) || "Something went wrong...!")
                }
            })
            .finally()

    }

    const handleChangeValue = (e) => {
        setIsChange(true)
        if (e.target.name = "rank") {
            setRankValue(e.target.value)
        }
    }

    useEffect(() => {
        if (open && open === true) {
            setEventID(data.eid)
            setStudentID(data.sid)
            setRankValue(data.rank)
            setStudentName(data.studentName)
        }
    }, [open, data])

    return (
        <div>
            <Dialog fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Update Rank</DialogTitle>
                <DialogContent >
                    <form style={{ textAlign: "center" }} >
                        <DialogTitle variant='h6' mb={2} style={{ padding: "10px 0px", display: "flex", justifyContent: "space-between" }} >Student Name: {studentName}</DialogTitle>
                        <Stack fullwidth="true" mb={4} style={{ flexDirection: "row" }}>
                            <FormLabel style={{ textAlign: "left" }}> Rank : </FormLabel>
                            <FormControl variant="standard" sx={{ width: '35%' }}>
                                <Select
                                    labelId="rank-simple-select-standard-label"
                                    id="rank-simple-select-standard"
                                    value={rankValue}
                                    onChange={handleChangeValue}
                                    label="rank"
                                >
                                    <MenuItem value={1}>1st</MenuItem>
                                    <MenuItem value={2}>2nd</MenuItem>
                                    <MenuItem value={3}>3rd</MenuItem>
                                    <MenuItem value={"participated"}>Participated</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </form>
                </DialogContent>
                <Typography color={'red'} textAlign={'center'}>{errorMsg !== '' ? errorMsg : null}</Typography>
                {loading ? <Loader /> : <Button disabled={!isChange} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={updatedStudentRank} >Update</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
