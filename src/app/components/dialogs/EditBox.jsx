import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Loader from '../Loader';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import { getAxiosWithToken } from "../../axios/AxiosObj";
import { toast } from 'react-toastify';
import { FormLabel, Stack, Typography, Input } from '@mui/material'
import secureLocalStorage from "react-secure-storage";

export default function EditBox({ open, setOpen, data }) {

    const [loading, setLoading] = useState(false)

    const [inputLabel, setInputLabel] = useState('')
    const [inputType, setInputType] = useState('')
    const [fieldValue, setFieldValue] = useState('')
    const [inputvalue, setInputvalue] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [isChange, setIsChange] = useState(false)
    const [apiEndPoint, setApiEndPoint] = useState('')

    const handleClose = () => {
        setApiEndPoint('')
        setFieldValue('')
        setInputLabel('')
        setInputType('')
        setInputvalue('')
        setErrorMsg('')
        setLoading(false);
        setOpen(false);
        setIsChange(false)
    };

    function isValidEmail(inputValue) {
        // Regular expression for matching an email address
        const emailPattern = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

        // Test the input value against the email pattern
        return emailPattern.test(inputValue);
    }
    const editDetailsBTN = async () => {

        if (inputvalue === "" || inputvalue === undefined) {
            toast.error("Fill the reqiured field");
            setErrorMsg('Fill the reqiured field')
            return;
        }
        
        if (inputType === "email") {
            if (!isValidEmail(inputvalue)) {
                toast.error("Enter a valid email");
                setErrorMsg('Enter a valid email')
                return;
            }
        }

        const allowedTextFields = ["owner_phone", "phone"];
        if (allowedTextFields.includes(fieldValue) && inputvalue.length !== 10) {
            toast.error("Enter a valid number");
            setErrorMsg('Enter a valid number')
            return null;
        }

        setLoading(true)
        let data = new FormData()
        data.append(fieldValue, inputvalue)

        let config = {
            method: 'Patch',
            maxBodyLength: Infinity,
            url: apiEndPoint,
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),
                accept: 'application/json'
            },
            data: data
        };
        const AxiosObj = getAxiosWithToken();

        AxiosObj.request(config)
            .then((response) => {
                if (response.data?.Success) {
                    toast.success(response.data?.Data[0] || "Details has been updated");
                    // Reload the window after 2 seconds
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    toast.error(response.data?.Data || "Something went wrong...!");
                }
            })
            .catch((e) => {
                try {
                    e.response.data?.Data.map(item => (
                        toast.error(item || "Something went wrong...!")
                    ))
                } catch (es) {
                    toast.error(e.response.data?.Data || "Something went wrong...!")
                }
            })
            .finally(() => setLoading(false))

    }

    const handleChangeValue = (e) => {
        setIsChange(true)
        if (e.target.name = "editChange") {
            setInputvalue(e.target.value)
        }
    }

    const buttonRef = useRef(null);
    const handleKey = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            buttonRef.current.click();  
        }

        const { name, value, type } = e.target;

        if (type == "number") {
            if (e.keyCode === 69) {
                e.preventDefault();
            }
            if (value.length >= 10) {
                // Check if the pressed key is a backspace, delete, or arrow key
                if (e.key === 'Backspace' || e.key === 'Delete' || e.key.includes('Arrow')) {
                    // Allow these keys
                } else {
                    // Prevent typing for other keys
                    e.preventDefault();
                }
            }
        }
    };

    useEffect(() => {
        if (open && open === true) {
            setApiEndPoint(data.apiEndPoint)
            setFieldValue(data.fieldName)
            setInputLabel(data.label)
            setInputvalue(data.fieldValue)
            setInputType(data.type)
        }
    }, [open, data])

    return (
        <div>
            <Dialog fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Update Details</DialogTitle>
                <DialogContent >
                    {/* <form style={{ textAlign: "center" }} > */}
                        <Stack fullwidth="true">
                            <FormLabel style={{ textAlign: "left" }}>{inputLabel || "Label"} </FormLabel>
                            <Input type={inputType} value={inputvalue} name="editChange" onKeyDown={handleKey} onChange={handleChangeValue} />
                        </Stack>
                    {/* </form> */}
                </DialogContent>
                <Typography color={'red'} textAlign={'center'}>{errorMsg !== '' ? errorMsg : null}</Typography>
                {loading ? <Loader /> : <Button ref={buttonRef} disabled={!isChange} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={editDetailsBTN} >Update</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
