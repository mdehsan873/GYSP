import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormLabel, Stack, TextField, Typography } from '@mui/material';
import Loader from '../Loader';
import { useState, useEffect } from 'react';
import AxiosObj from '../../axios/AxiosObj';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useSelector } from 'react-redux';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { FormControl } from '@mui/material';
import secureLocalStorage from "react-secure-storage";
import { toast } from 'react-toastify';

export default function AddBulkItemDialog({ open, setOpen }) {

    const { classAndSection, sessions } = useSelector(state => state.infra)

    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState()
    const [errorMsg, setErrorMsg] = useState('')
    const [isChange, setIsChange] = useState(false)

    // Open ask class
    const [openFilter, setOpenFilter] = useState(false)

    // Field
    const [seclectedClassItemID, setSeclectedClassItemID] = useState('')
    const [seclectedSessionID, setSeclectedSessionID] = useState('')


    const handleClose = () => {
        setOpen(false);
        setSeclectedSessionID('');
        setSeclectedClassItemID('');
        setErrorMsg('');
    };

    const handleFilterClose = () => {
        setOpenFilter(false);
        setSeclectedSessionID('');
        setSeclectedClassItemID('');
        setErrorMsg('');
    };

    const handleFileUpload = async () => {
        setErrorMsg('');
        if (seclectedSessionID == "" || file == "" || file == undefined) {
            toast.error("Select required fields")
            setErrorMsg("Select required fields")
            return;
        }

        setLoading(true)
        let data = new FormData();
        data.append('file', file);
        data.append('session_id', seclectedSessionID);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'student/add/bulk/csv/',
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),
                accept: 'application/json'
            },
            data: data,
            responseType: 'blob' // Set the responseType to 'blob' to receive binary data
        };

        AxiosObj.request(config)
            .then((res) => {
                if (secureLocalStorage.getItem("countStudent")) {
                    secureLocalStorage.removeItem("countStudent")
                }
                const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = 'studentDeatils.xlsx';
                downloadLink.click();
                window.location.reload()
            }).catch((e) => {
                // console.log(e)
                // if(e.response.data.Data.description){
                //     setErrorMsg(e.response.data.Data.description || "Something went wrong...!")
                // }
                try {
                    e.response.data?.Data.map(item => (
                        toast.error(item || "Something went wrong...!")
                    ))
                    setErrorMsg(e.response.data?.Data[0] || "Something went wrong...!")
                } catch (ess) {
                    toast.error(e.response.data?.Data || "Something went wrong...!")
                    setErrorMsg(e.response.data?.Data || "Something went wrong...!")
                }
            }).finally(() => setLoading(false))
    }

    const handleFile = (e) => {
        if (e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const fileSize = selectedFile.size / 1024 / 1024; // File size in MB

            if (fileSize <= 50) {
                const allowedExtensions = ['.xlsx', '.xls', '.csv'];
                const fileExtension = selectedFile.name.split('.').pop();

                if (allowedExtensions.includes(`.${fileExtension}`)) {
                    const selectedImage = e.target.files[0];
                    setFile(selectedImage);
                    setIsChange(true);
                    setErrorMsg('');
                } else {
                    toast.error("File should be an Excel file");
                    setErrorMsg("File should be an Excel file");
                }
            } else {
                toast.error("File size should not exceed 50 MB");
                setErrorMsg("File size should not exceed 50 MB");
            }
        }
    };

    const [classFilterArray, setClassFilterArray] = useState([]);

    useEffect(() => {
        setClassFilterArray([...classAndSection])
    }, [classAndSection]);

    useEffect(() => {
        const foundItem2 = sessions.find(item => item.id === seclectedSessionID);

        let filteredClass = classAndSection.filter((cc) => {
            const classMatch = 'all' ;
            return classMatch;
        });
        setClassFilterArray(filteredClass);
    }, [seclectedSessionID]);

    const askBox = (e) => {
        setOpenFilter(true)
    }

    useEffect(() => {
        setSeclectedSessionID(sessions[0]?.id)
    }, [sessions, open]);

    const getCSV = (e) => {

        if (seclectedClassItemID == "" || seclectedSessionID == "") {
            toast.error("Select the required field")
            setErrorMsg("Select the required fields")
            return;
        }

        let data = undefined;

        let config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: 'student/get/bulk/csv/?class_id=' + seclectedClassItemID + '&session_id=' + seclectedSessionID,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data,
            responseType: 'blob' // Set the responseType to 'blob' to receive binary data
        };

        AxiosObj.request(config)
            .then((response) => {
                const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = 'studentSample.xlsx';
                downloadLink.click();
                // window.location.reload()
                setOpenFilter(false);
            }).catch((e) => {
                try {
                    e.response?.data.Data.map(item => (
                        toast.error(item || "Something went wrong...!")
                    ))
                    setErrorMsg(e.response.data?.Data[0] || "Something went wrong...!")
                    handleFilterClose();
                } catch (err) {
                    toast.error(e.response.data?.Data || "Something went wrong...!")
                    setErrorMsg(e.response.data?.Data || "Something went wrong...!")
                }
            }).finally()
    }

    const SelectClass = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="classSection-simple-select-standard-label"
                    id="classSection-simple-select-standard"
                    value={seclectedClassItemID}
                    required
                    onChange={(e) => { setSeclectedClassItemID(e.target.value) }}
                    label="classSection"
                >
                    {classFilterArray.filter((item, index, self) => self.findIndex((i) => i.class_name === item.class_name) === index)
                        .map((item) => (
                            <MenuItem key={item.id} value={item.class_id}>{(item.class_name).toUpperCase()}</MenuItem>
                        ))}
                </Select>
            </FormControl>
        )
    }

    const SelectSession = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="classSection-simple-select-standard-label"
                    id="classSection-simple-select-standard"
                    value={seclectedSessionID}
                    required
                    onChange={(e) => { setSeclectedSessionID(e.target.value) }}
                    label="classSection"
                >
                    {sessions.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                </Select>
            </FormControl>
        )
    }
    return (
        <div>
            <Dialog maxWidth='xs' fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' >Add Bulk Student</DialogTitle>
                <DialogContent >
                    <form method='post' encType='multipart/form-data'>
                        <Stack margin={2}>
                            <FormLabel>Upload Studnet CSV file</FormLabel>
                            <TextField required type={'file'} onChange={handleFile} />
                        </Stack>
                        <Stack margin={2}>
                            <FormLabel>Session*</FormLabel>
                            <SelectSession />
                        </Stack>
                    </form>
                </DialogContent>
                <Typography color='red' textAlign={'center'}>{errorMsg}</Typography>
                {loading ? <Loader /> : <Button disabled={!isChange} startIcon={<FileUploadIcon />} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={handleFileUpload} >Upload Students</Button>}
                <Button startIcon={<DownloadIcon />} onClick={() => { askBox() }} variant='outlined' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', marginTop: 2 }} >Download Add Bulk Student Excel File</Button>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog maxWidth='sm' fullWidth open={openFilter} onClose={handleFilterClose} >
                <DialogTitle variant='h5' >Get Student Excel Template</DialogTitle>
                <DialogContent >
                    <form method='post' encType='multipart/form-data'>
                        <Stack margin={2}>
                            <FormLabel>Session*</FormLabel>
                            <SelectSession />
                        </Stack>
                        <Stack margin={2}>
                            <FormLabel>Class*</FormLabel>
                            <SelectClass />
                        </Stack>
                    </form>
                </DialogContent>
                <Typography color='red' textAlign={'center'}>{errorMsg}</Typography>
                <Button variant='outlined' color='warning' onClick={() => { getCSV() }} sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', marginTop: 2 }} >Download</Button>
                <DialogActions>
                    <Button onClick={handleFilterClose}>Cancel</Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}
