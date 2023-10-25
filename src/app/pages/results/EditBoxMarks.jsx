import * as React from 'react';
import { useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Loader from '../../components/Loader';
import { useState, useEffect } from 'react';
import { getAxiosWithToken } from "../../axios/AxiosObj";
import { toast } from 'react-toastify';
import { FormLabel, Stack, Typography, Input } from '@mui/material'
import secureLocalStorage from "react-secure-storage";

export default function EditBoxMarks({ open, setOpen, data }) {

    const [isChange, setIsChange] = useState(false)
    const [loading, setLoading] = useState(false)
    const [marksID, setMarksID] = useState('')

    const [subjectMinMarks, setSubjectMinMarks] = useState('')
    const [subjectMinMarks2, setSubjectMinMarks2] = useState('')

    const [subjectMaxMarks, setSubjectMaxMarks] = useState('')
    const [subjectMaxMarks2, setSubjectMaxMarks2] = useState('')

    const [subjectName, setSubjectName] = useState('')

    const [subjectType, setSubjectType] = useState('')
    const [inputType, setInputType] = useState('')

    const [isDisabled, setIsDisabled] = useState(false);

    const [errorMsg, setErrorMsg] = useState('')

    const handleClose = () => {
        setMarksID('')
        setSubjectMaxMarks('')
        setSubjectMinMarks('')
        setSubjectName('')
        setInputType('')
        setSubjectType('')
        setErrorMsg('')
        setLoading(false);
        setOpen(false);
        setIsDisabled(false);
        setIsChange(false);
    };

    const handleChangeValue = (e) => {

        const { value, name } = e.target;

        if (name == "subjectMinMarks") {
            setIsChange(true);
            setSubjectMinMarks(value)
        }

        if (name == "subjectMaxMarks") {
            setIsChange(true);
            setSubjectMaxMarks(value)
        }
    };

    const buttonRef = useRef(null);

    const editDetailsBTN = async () => {
        setErrorMsg('');

        if (subjectMinMarks == '') {
            toast.error("Min Marks should not be empty");
            setErrorMsg("Min Marks should not be empty");
            return null;
        }
        if (subjectMaxMarks == '' ) {
            toast.error("Max Marks should not be empty");
            setErrorMsg("Max Marks should not be empty");
            return null;
        }

        if (subjectMaxMarks < subjectMinMarks) {
            toast.error("Max mark should not be less than min marks");
            setErrorMsg("Max mark should not be less than min marks");
            return null;
        }

        if (subjectMaxMarks == subjectMinMarks) {
            toast.error("Max mark should not be equal min marks");
            setErrorMsg("Max mark should not be equal min marks");
            return null;
        }

        setLoading(true);
        let dataN = new FormData();
        dataN.append("id", marksID);
        dataN.append("min_mark", subjectMinMarks);
        dataN.append("max_mark", subjectMaxMarks);

        const config = {
            method: 'Patch',
            maxBodyLength: Infinity,
            url: 'result/edit/result/min-max/',
            headers: {
                "Content-Type": "multipart/form-data",
                accept: 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),    
            },
            data: dataN
        };

        const AxiosObj = getAxiosWithToken();
        AxiosObj.request(config)
            .then((response) => {
                if (response.data?.Success) {
                    toast.success(response.data?.Data || "Marks has been updated");
                    // Reload the window after 2 seconds
                    if (secureLocalStorage.getItem("resultDetail")) {
                        secureLocalStorage.removeItem("resultDetail")
                    }
                    if (secureLocalStorage.getItem("studentDetailsre")) {
                        secureLocalStorage.removeItem("studentDetailsre")
                    }
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    toast.error(response.data?.Data || "Something went wrong...!");
                }
            })
            .catch((e) => {
                try {
                    toast.error(e.response.data?.Data || "Something went wrong...!");
                    setErrorMsg(e.response.data?.Data || "Something went wrong...!");
                } catch (e) {
                    if (e.response?.data?.Data instanceof Array) {
                        e.response.data.Data.map((item) => toast.error(item || "Something went wrong...!"));
                        setErrorMsg(e.response.data.Data[0] || "Something went wrong...!");
                    } else {
                        toast.error("Something went wrong...!");
                        setErrorMsg("Something went wrong...!");
                    }
                }
            })
            .finally(() => setLoading(false));
    };

    function handleKeyDown(event) {
        if (inputType == "Number" || inputType == "number") {
            if (event.keyCode === 69) {
                event.preventDefault();
            }
            // if (!/[0-9a-zA-Z]/.test(event.key)) {
            //     event.preventDefault();
            // } 

            if (!/[0-9.]|\bBackspace|\bDelete|\bArrow/.test(event.key)) {
                event.preventDefault();
            }

            // // Prevent multiple decimal points
            if (event.key == "." && event.target.value.includes(".")) {
                event.preventDefault();
            }
        } else {
            // If inputType is not "Number" or "number", prevent number keys
            if (/^\d+$/.test(event.key)) {
                event.preventDefault();
            }
        }
        if (event.key === 'Enter') {
            event.preventDefault();
            buttonRef.current.click();
        }
    }

    useEffect(() => {
        if (open && open === true) {
            setSubjectType(data.subjectType)
            setSubjectName(data.subjectName)

            setSubjectMinMarks(data.MinMarks)
            setSubjectMinMarks2(data.MinMarks)
            setSubjectMaxMarks(data.MaxMarks)
            setSubjectMaxMarks2(data.MaxMarks)

            setMarksID(data.subjectMarkId)
            setInputType(data.inputType)
        }
    }, [open, data])

    return (
        <div >
            <Dialog fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Update Min-Max Marks</DialogTitle>
                <DialogContent >
                    <div style={{ textAlign: "center" }} >
                        <DialogTitle variant='h6' style={{ padding: "10px 0px", display: "flex", justifyContent: "space-between" }} >{subjectName}</DialogTitle>
                        <Stack fullwidth="true" mt={2}>
                            <FormLabel style={{ textAlign: "left" }}>Max Marks </FormLabel>
                            <Input value={subjectMaxMarks} disabled={isDisabled} name="subjectMaxMarks" type={inputType || "text"} onKeyDown={handleKeyDown} onChange={handleChangeValue} />
                        </Stack>
                        <Stack fullwidth="true">
                            <FormLabel style={{ textAlign: "left" }}>Min Marks</FormLabel>
                            <Input value={subjectMinMarks} disabled={isDisabled} name="subjectMinMarks" type={inputType || "text"} onKeyDown={handleKeyDown} onChange={handleChangeValue} />
                        </Stack>
                    </div>
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
