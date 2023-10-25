import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormLabel, Stack, TextField } from '@mui/material';
import Loader from '../Loader';
import { useState } from 'react';
import AxiosObj from '../../axios/AxiosObj';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Link } from 'react-router-dom';

export default function AddBulkItemDialog({ open, setOpen, title, apiEndpoint, sampleFile }) {
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState()
    const handleClose = () => {
        setOpen(false);
    };
    const handleFileUpload = async () => {
        console.log('sending data')
        setLoading(true)
        let data = new FormData();
        data.append('files', file);
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: apiEndpoint,
            headers: {
                "Content-Type": "multipart/form-data",
                accept: 'application/json'
            },
            data: data
        };

        AxiosObj.request(config)
            .then((res) => {
                console.log(res.data)
                // window.location.reload()
            })
            .catch(e => console.log('failed to add data', e))
            .finally(() => { setLoading(false) })
    }

    const handleFile = (e) => {

        setFile(e.target.files[0])
    }

    return (
        <div>
            <Dialog maxWidth='xs' fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' >Add Bulk {title}</DialogTitle>
                <DialogContent >
                    <form method='post' encType='multipart/form-data'>
                        <Stack margin={2}>
                            <FormLabel>Upload {title} csv file</FormLabel>
                            <TextField type={'file'} onChange={handleFile} />
                        </Stack>
                    </form>
                </DialogContent>
                {loading ? <Loader /> : <Button startIcon={<FileUploadIcon />} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={handleFileUpload} >Upload {title}</Button>}

                <Button component={Link} to={sampleFile} startIcon={<DownloadIcon />} variant='outlined' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', marginTop: 2 }} download target="_blank" >download sample {title} csv file</Button>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
