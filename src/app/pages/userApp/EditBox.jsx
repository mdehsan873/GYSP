import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Loader from '../../components/Loader';
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
        setInputType('')
        setFieldValue('')
        setErrorMsg('')
        setInputLabel('')
        setInputvalue('')
        setOpen(false);
        setLoading(false)
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

        const allowedTextFields = ["parents_no", "phone_no"];
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
                    toast.success(response.data?.Data || "Details has been updated");
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
                } catch (ee) {
                    toast.error(e.response.data?.Data || "Something went wrong...!")
                }
            })
            .finally(() => setLoading(false))

    }

    const handleChangeValue = (e) => {
        setIsChange(true)
        if (e.target.name = "editChange") {
            const allowedTextFields = ["parents_no", "phone_no"];
            if (allowedTextFields.includes(fieldValue) && e.target.value.length >= 11) {
                return null;
            }
            setInputvalue(e.target.value)
        }
    }

    const buttonRef = useRef(null);
    useEffect(() => {
        if (open && open === true) {
            setApiEndPoint(data.apiEndPoint)
            setFieldValue(data.fieldName)
            setInputLabel(data.label)
            setInputvalue(data.fieldValue)
            setInputType(data.type)
        }
    }, [open, data])


    const handleKey = (e) => {
        const { value } = e.target;
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter'];
        const isTextType = inputType === "text";
        const isNumberType = inputType === "number";

        if (e.key === 'Enter') {
            e.preventDefault();
            buttonRef.current.click();
        }

        if (isNumberType) {
            // Limit the length for phone_no and parents_no
            const allowedTextFields = ["parents_no", "phone_no"];

            if (/[^0-9]/.test(e.key) || e.key === 'e') {
                // Block letters and words for number input, including 'e'
                if (!allowedKeys.includes(e.key)) {
                    e.preventDefault();
                }
            }

        } else if (isTextType) {
            const allowedTextFields = ["father_name", "mother_name"];

            if (/^[0-9]+$/.test(e.key) && allowedTextFields.includes(fieldValue)) {
                e.preventDefault();
            }
        }
    };


    return (
        <div>
            <Dialog fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Update Details</DialogTitle>
                <DialogContent >
                    {/* <form style={{ textAlign: "center" }} > */}
                    <Stack fullwidth="true">
                        <FormLabel style={{ textAlign: "left" }}>{inputLabel || "Label"} </FormLabel>
                        {inputType == "date" ?
                            (<Input type={inputType} value={inputvalue} onKeyDown={(e) => { handleKey(e) }} name="editChange" onChange={handleChangeValue} />)
                            :
                            (<Input type={inputType} value={inputvalue} onKeyDown={(e) => { handleKey(e) }} name="editChange" onChange={handleChangeValue} />)
                        }
                    </Stack>
                    {/* </form> */}
                </DialogContent>
                <Typography color={'red'} textAlign={'center'}>{errorMsg !== '' ? errorMsg : null}</Typography>
                {loading ? <Loader /> : <Button disabled={!isChange} ref={buttonRef} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={editDetailsBTN} >Update</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
