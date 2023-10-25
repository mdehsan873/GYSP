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
import { toast } from 'react-toastify';
import secureLocalStorage from "react-secure-storage";

export default function AddBulkItemDialog({ open, setOpen }) {

    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState()
    const [errorMsg, setErrorMsg] = useState('')
    const [isChange, setIsChange] = useState(false)

    const handleClose = () => {
        setIsChange(false)
        setErrorMsg(false)
        setFile('')
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
            url: 'teacher/add/bulk/',
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),  
            },
            data: data
        };

        AxiosObj.request(config)
            .then((response) => {
                if (response.data?.Success) {
                    toast.success(response.data?.data || "Teacher has been Uploaded");
                    if (secureLocalStorage.getItem("teacherRAWData")) {
                        secureLocalStorage.removeItem("teacherRAWData")
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
                    setErrorMsg(e.response.data?.data || "Something went wrong...!")
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

    const getCSV = (e) => {
        let data = undefined;
        let config = {
            method: 'GET',
            maxBodyLength: Infinity,
            url: 'teacher/add/bulk/',
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
                downloadLink.download = 'teacherSample.xlsx';
                downloadLink.click();

            }).catch((e) => {
                try {
                    e.response.data?.Data.map(item => (
                        toast.error(item || "Something went wrong...!")
                    ))
                } catch (e) {
                    toast.error(e.response.data?.Data || "Something went wrong...!")
                }
            })
            .finally(() => setLoading(false))
    }

    return (
        <div>
            <Dialog maxWidth='xs' fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' >Add Bulk Teacher</DialogTitle>
                <DialogContent >
                    <form method='post' encType='multipart/form-data'>
                        <Stack margin={2}>
                            <FormLabel>Upload Teacher CSV file</FormLabel>
                            <TextField type="file" accept=".xlsx, .xls, .csv" onChange={handleFile} />
                        </Stack>
                    </form>
                </DialogContent>
                <Typography color='red' textAlign={'center'}>{errorMsg}</Typography>
                {loading ? <Loader /> : <Button disabled={!isChange} startIcon={<FileUploadIcon />} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={handleFileUpload} >Upload Teachers</Button>}

                <Button startIcon={<DownloadIcon />} onClick={() => { getCSV() }} variant='outlined' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', marginTop: 2 }} >Download Sample Teacher CSV file</Button>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}
