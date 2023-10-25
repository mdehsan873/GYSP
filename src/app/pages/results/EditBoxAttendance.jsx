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
import secureLocalStorage from "react-secure-storage";
import { FormLabel, Stack, Typography, Input } from '@mui/material'

export default function EditBoxAttendance({ open, setOpen, data }) {

    const [isChange, setIsChange] = useState(false)
    const [loading, setLoading] = useState(false)
    const [marksID, setMarksID] = useState('')

    const [attendance, setAttendance] = useState('')
    const [attendance2, setAttendance2] = useState('')

    const [inputType, setInputType] = useState('')
    const [testName, setTestName] = useState('')

    const [isDisabled, setIsDisabled] = useState(false);

    const [errorMsg, setErrorMsg] = useState('')

    const handleClose = () => {
        
        setAttendance('')
        setAttendance2('')
        setTestName('')
        setErrorMsg('')
        setLoading(false);
        setOpen(false);
        setIsDisabled(false);
        setIsChange(false);
    };

    const handleChangeValue = (e) => {

        const { value, name } = e.target;

        if (name == "att") {
            setIsChange(true);
            setAttendance(value)
        }
    };

    const buttonRef = useRef(null);

    const editDetailsBTN = async () => {
        setErrorMsg('');

        if(attendance ==0){
            toast.error("Max days should not be '0'");
            setErrorMsg("Max days should not be '0'");
            return null;
        }
        if(attendance < 1){
            toast.error("Max days should not be '0'");
            setErrorMsg("Max days should not be '0'");
            return null;
        }

        setLoading(true);
        let dataN = new FormData();
        dataN.append("id", marksID);
        dataN.append("max_day", attendance);

        const config = {
            method: 'Patch',
            maxBodyLength: Infinity,
            url: 'result/edit/max_day/',
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
            setTestName(data.test_name)

            setAttendance(data.Att)
            setAttendance2(data.Att)

            setMarksID(data.id)
            setInputType("number")
        }
    }, [open, data])

    return (
        <div >
            <Dialog fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >{"Update Max Attendance"}</DialogTitle>
                <DialogContent >
                    <div style={{ textAlign: "center" }} >
                        <DialogTitle variant='h6' style={{ padding: "10px 0px", display: "flex", justifyContent: "space-between" }} >{testName}</DialogTitle>
                        <Stack fullwidth="true">
                            <FormLabel style={{ textAlign: "left" }}>Max Day of Attendance</FormLabel>
                            <Input value={attendance} disabled={isDisabled} name="att" type={inputType || "text"} onKeyDown={handleKeyDown} onChange={handleChangeValue} />
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
