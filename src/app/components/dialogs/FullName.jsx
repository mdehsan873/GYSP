import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { useRef } from 'react';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Loader from '../Loader';
import { useState, useEffect } from 'react';
import { getAxiosWithToken } from "../../axios/AxiosObj";
import { toast } from 'react-toastify';
import { FormLabel, Stack, Typography, Input } from '@mui/material'
import secureLocalStorage from "react-secure-storage";

export default function FullName({ open, setOpen, data }) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isChange, setIsChange] = useState(false);
    const [apiEndPoint, setApiEndPoint] = useState('');


    const buttonRef = useRef(null);

    // inputs
    const [firstName, setfirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleClose = () => {
        setLoading(false);
        setLastName('')
        setfirstName('')
        setErrorMsg('')
        setMiddleName('')
        setApiEndPoint('')
        setOpen(false);
        setIsChange(false);
    };

    const editDetailsBTN = async () => {

        if (firstName === "") {
            toast.error("First Name is reqiured");
            setErrorMsg('First Name is reqiured')
            return;
        }

        setLoading(true);
        let data = new FormData();
        data.append("first_name", firstName);
        data.append("middle_name", middleName);
        data.append("last_name", lastName);

        let config = {
            method: 'Patch',
            maxBodyLength: Infinity,
            url: apiEndPoint,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),
                accept: 'application/json'
            },
            data: data
        };

        const AxiosObj = getAxiosWithToken();

        AxiosObj.request(config)
            .then((response) => {
                if (response.data?.Success) {
                    if (secureLocalStorage.getItem("rStudentDetails")) {
                        secureLocalStorage.removeItem("rStudentDetails")
                    }
                    try {
                        response.data?.Data.map((item) => toast.success(item || 'Update'));
                    } catch (se) {
                        toast.success(response.data?.Data || 'Update');
                    }
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    toast.error(response.data?.Data || 'Something went wrong...!');
                }
            })
            .catch((e) => {
                try {
                    e.response.data?.Data.map((item) => toast.error(item || 'Something went wrong...!'));
                } catch (se) {
                    toast.error(e.response.data?.Data || 'Something went wrong...!');
                }
            })
            .finally(() => setLoading(false));
    };

    const handleChangeValue = (e) => {
        setIsChange(true);
        const { name, value } = e.target;

        if (name === "firstName") {
            setfirstName(value);
        }
        if (name === "middleName") {
            setMiddleName(value);
        }
        if (name === "lastName") {
            setLastName(value);
        }

        if (e.key == 'Enter') {
            e.preventDefault();
            buttonRef.current.click();
        }
    };

    useEffect(() => {
        if (open && open === true) {
            setApiEndPoint(data.apiEndPoint);
            setfirstName(data.firstName);
            setMiddleName(data.middleName);
            setLastName(data.lastName);
        }
    }, [open, data]);

    const handleKey = (e) => {
        const { name, value } = e.target;
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

        // Block numbers for text input, except for specific fields
        // const allowedTextFields = ["father_name", "mother_name"];
        // if (/^[0-9]+$/.test(e.key) && !allowedTextFields.includes(fieldValue)) {
        if (/^[0-9]+$/.test(e.key)) {
            e.preventDefault();
        }

    };


    return (
        <div>
            <Dialog fullWidth open={open} onClose={handleClose}>
                <DialogTitle variant="h5" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Update Details
                </DialogTitle>
                <DialogContent>
                    <form style={{ textAlign: 'center' }}>
                        <Stack fullwidth="true" mb={2}>
                            <FormLabel style={{ textAlign: 'left' }}>First Name</FormLabel>
                            <Input type={"text"} value={firstName} name={"firstName"} onKeyDown={(e) => { handleKey(e) }} onChange={handleChangeValue} />
                        </Stack>
                        <Stack fullwidth="true" mb={2}>
                            <FormLabel style={{ textAlign: 'left' }}>Middle Name</FormLabel>
                            <Input type={"text"} value={middleName} name={"middleName"} onKeyDown={(e) => { handleKey(e) }} onChange={handleChangeValue} />
                        </Stack>
                        <Stack fullwidth="true" mb={2}>
                            <FormLabel style={{ textAlign: 'left' }}>Last Name</FormLabel>
                            <Input type={"text"} value={lastName} name={"lastName"} onKeyDown={(e) => { handleKey(e) }} onChange={handleChangeValue} />
                        </Stack>
                    </form>
                </DialogContent>
                <Typography color="red" textAlign="center">{errorMsg !== '' ? errorMsg : null}</Typography>
                {loading ? (
                    <Loader />
                ) : (
                    <Button
                        disabled={!isChange}
                        variant="contained"
                        color="warning"
                        ref={buttonRef}
                        sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content' }}
                        onClick={editDetailsBTN}
                    >
                        Update
                    </Button>
                )}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
