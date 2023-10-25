import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormLabel, Stack, TextField, Typography } from '@mui/material';
import Loader from '../../components/Loader';
import { useState } from 'react';
import AxiosObj from '../../axios/AxiosObj';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useSelector } from 'react-redux';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import secureLocalStorage from "react-secure-storage";
import { FormControl } from '@mui/material';
import { toast } from 'react-toastify';

export default function AddBulkItemDialog({ open, setOpen }) {

    const { sessions } = useSelector(state => state.infra)

    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState()
    const [seclectedSessionID, setSeclectedSessionID] = useState('')

    const [errorMsg, setErrorMsg] = useState('')
    const [isChange, setIsChange] = useState(false)

    const handleClose = () => {
        setIsChange(false)
        setErrorMsg(false)
        setFile('')
        setSeclectedSessionID('')
        setOpen(false);
    };

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!file || file === '') {
            toast.error("Select the file first");
            setErrorMsg("Select the file first");
            return;
        }
        const selectedFile = file;
        const allowedExtensions = ['.xlsx', '.xls', '.csv'];
        const fileExtension = selectedFile.name.split('.').pop();

        if (!allowedExtensions.includes(`.${fileExtension}`)) {
            toast.error("File should be an Excel file");
            setErrorMsg("File should be an Excel file");
            return;
        }

        setLoading(true)
        let data = new FormData();
        data.append('file', file);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'subject/add/bulk/',
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),  
            },
            data: data
        };

        AxiosObj.request(config)
            .then((response) => {
                if (response.data?.Success) {
                    toast.success(response.data?.data || "Subject has been Uploaded");

                    if (secureLocalStorage.getItem("allSubjectRAWData")) {
                        secureLocalStorage.removeItem("allSubjectRAWData")
                    }

                    // Reload the window after 2 seconds
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    toast.error(response.data?.data || "Something went wrong...!");
                    setErrorMsg(response.data?.data || "Something went wrong...!");
                }
            })
            .catch((e) => {
                try {
                    e.response.data?.data.map(item => (
                        toast.error(item || "Something went wrong...!")
                    ))
                } catch (e) {
                    toast.error(e.response.data?.data || "Something went wrong...!")
                    setErrorMsg(e.response.data?.data || "Something went wrong...!");
                }
            })
            .finally(() => setLoading(false))
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

    const handleFilterClose = () => {
        setSeclectedSessionID('');
        setOpenFilter(false);
    };

    const askBox = (e) => {
        setOpenFilter(true)
    }

    // Open ask class
    const [openFilter, setOpenFilter] = useState(false)

    const getCSV = () => {

        if (!seclectedSessionID || seclectedSessionID === '') {
            toast.error("Fill the required fields");
            setErrorMsg("Fill the required fields");
            return;
        }

        let data = undefined;
        let config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: 'subject/get/bulk/template/?session_id=' + seclectedSessionID,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),  
            },
            data: data,
            responseType: 'blob' // Set the responseType to 'blob' to receive binary data
        };


        AxiosObj.request(config)
            .then((response) => {
                const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = 'subjectSample.xlsx';
                downloadLink.click();
                setOpenFilter(false);
            }).catch((e) => {
                try {
                    e.response.data?.data.map(item => (
                        toast.error(item || "Something went wrong...!")
                    ))
                } catch (e) {
                    toast.error(e.response.data?.data || "Something went wrong...!")
                }
            })
            .finally(() => setLoading(false))

    }

    const SelectSession = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="classSection-simple-select-standard-label"
                    id="classSection-simple-select-standard"
                    value={seclectedSessionID}
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
                <DialogTitle variant='h5' >Add Bulk Subject</DialogTitle>
                <DialogContent >
                    <form method='post' encType='multipart/form-data'>
                        <Stack margin={2}>
                            <FormLabel>Upload Subject CSV file</FormLabel>
                            <TextField type={'file'} onChange={handleFile} />
                        </Stack>
                    </form>
                </DialogContent>
                <Typography color='red' textAlign={'center'}>{errorMsg}</Typography>
                {loading ? <Loader /> : <Button disabled={!isChange} startIcon={<FileUploadIcon />} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={handleFileUpload} >Upload Subjects</Button>}

                <Button startIcon={<DownloadIcon />} onClick={() => { askBox() }} variant='outlined' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', marginTop: 2 }} >Download Sample Subject CSV file</Button>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog maxWidth='sm' fullWidth open={openFilter} onClose={handleFilterClose} >
                <DialogTitle variant='h5' >Session</DialogTitle>
                <DialogContent >
                    <form method='post'>
                        <Stack margin={2}>
                            <FormLabel>Session</FormLabel>
                            <SelectSession />
                        </Stack>
                    </form>
                </DialogContent>
                <Button variant='outlined' color='warning' onClick={() => { getCSV() }} sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', marginTop: 2 }} >Download</Button>
                <DialogActions>
                    <Button onClick={handleFilterClose}>Cancel</Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}
