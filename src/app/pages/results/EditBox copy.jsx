import * as React from 'react';
import { useRef } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import secureLocalStorage from "react-secure-storage";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Loader from '../../components/Loader';
import { useState, useEffect } from 'react';
import { getAxiosWithToken } from "../../axios/AxiosObj";
import { toast } from 'react-toastify';
import { FormLabel, Stack, Typography, Input } from '@mui/material'

export default function EditBox({ open, setOpen, data, maxDays }) {

    const [isChange, setIsChange] = useState(false)

    const [loading, setLoading] = useState(false)

    const [marksID, setMarksID] = useState('')

    const [subjectMarks, setSubjectMarks] = useState('')
    const [subjectMarks2, setSubjectMarks2] = useState('')
    const [subjectName, setSubjectName] = useState('')
    const [subjectOptional, setSubjectOptional] = useState(false)
    const [subjectOptional2, setSubjectOptional2] = useState(false)

    const [studentName, setStudentName] = useState('')

    const [subjectType, setSubjectType] = useState('')
    const [inputType, setInputType] = useState('')

    const [minMarks, setMinMarks] = useState('')
    const [maxMarks, setMaxMarks] = useState('')


    const [checked, setChecked] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const [errorMsg, setErrorMsg] = useState('')

    const handleClose = () => {
        setSubjectMarks('')
        setMarksID('')
        setSubjectName('')
        setStudentName('')
        setInputType('')
        setSubjectType('')
        setErrorMsg('')
        setLoading(false);
        setChecked(false)
        setSubjectOptional(false)
        setSubjectOptional(false)
        setSubjectOptional2(false)
        setOpen(false);
        setIsDisabled(false);
        setIsChange(false);
    };

    const handleChange = (event) => {
        setIsChange(true)
        // If Mark as AB but it was not AB

        if (data.subjectMarks != "AB") {

            if (event.target.checked == true) {
                setInputType('text')
                setSubjectMarks('AB')
                setIsDisabled(true);
                setIsChange(true)
            } else {
                setIsDisabled(false);
                setInputType(data.inputType)
                setSubjectMarks(data.subjectMarks)

                if (data.subjectMarks == "-") {
                    setIsDisabled(true)
                    setSubjectOptional(true)
                    setSubjectMarks2('-')
                    setSubjectMarks('-')
                    setInputType("text")
                }
            }
        }

        if (data.subjectMarks == "AB" && data.subjectMarks !== "-") {
            if (event.target.checked == true) {
                setIsDisabled(false);
                setInputType('number')
            } else {
                setInputType('text')
                setSubjectMarks('AB')
                setIsDisabled(true);
                setIsChange(false)
            }
        }

        if (data.subjectMarks == "-") {
            setIsDisabled(true)
            setSubjectOptional(true)
            setSubjectMarks2('-')
            setSubjectMarks('-')
            setInputType("text")
        }

        setChecked(event.target.checked);
    };

    const handleChange2 = (event) => {

        setIsChange(true)
        setSubjectOptional(event.target.checked);
        if (data.subjectMarks = "-" && event.target.checked == true) {
            setSubjectMarks("")
        }
        if (data.subjectMarks = "-" && event.target.checked == false) {
            setSubjectMarks("-")
        }
        if (data.subjectMarks != "-" && event.target.checked == false) {
            setSubjectMarks(subjectMarks2)
        }
    };


    const handleChangeValue = (e) => {
        if (e.target.name === "subjectMarks") {
            const value = e.target.value
            if (inputType === "number") {
                setIsChange(true);
                setSubjectMarks(value);
            } else {
                setIsChange(true);
                setSubjectMarks(value);
            }
        }
    };

    const buttonRef = useRef(null);
    const handleKey = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            buttonRef.current.click();
        }
    };


    const editDetailsBTN = async () => {
        setErrorMsg('');

        // Empty Check
        if (subjectMarks === undefined) {
            toast.error("Fill the required field");
            setErrorMsg('Fill the required field');
            return null;
        }

        // Attendance check
        if (subjectType == "attendance") {
            if (maxDays < subjectMarks) {
                toast.error("Cannot exceed maximum days of attendance");
                setErrorMsg('Cannot exceed maximum days of attendance');
                return null;

            }
        }

        // Marks Check
        if (subjectMarks == '') {
            if (subjectMarks2 == '' || subjectMarks2 == '-') {
                if (subjectOptional == true || subjectOptional2 == false) {
                    toast.error("You marked as a opted subject");
                    setErrorMsg('You marked as a opted subject');
                    return null;
                }
            }
        }
        // Min mark Check
        if (minMarks !== "") {
            if (minMarks > subjectMarks && subjectMarks !== "AB" && subjectMarks !== "-" && subjectMarks !== null) {
                toast.error("Marks should not be less than min marks");
                setErrorMsg('Marks should not be less than min marks');
                return null;
            }
        }
        // Max mark Check
        if (maxMarks !== "") {
            if (maxMarks < subjectMarks && subjectMarks !== "AB" && subjectMarks !== "-" && subjectMarks !== null) {
                toast.error("Marks should not be greater than max marks");
                setErrorMsg('Marks should not be greater than max marks');
                return null;
            }
        }

        setLoading(true);
        let dataN = new FormData();

        let url;

        if (subjectType == "AcadmicsSubject") {

            if(subjectMarks == ""){
                toast.error("Marks should not be empty");
                setErrorMsg('Marks should not be empty');
                return null;
            }

            if(subjectMarks == "AB" && isDisabled == true){
                dataN.append("marks_id", marksID);
                url = 'result/mark-absent/acadmics/';
            }
            if (subjectMarks == '' || subjectMarks == '-') {
                url = 'result/mark-optional/acadmics/';
            }
            if(subjectMarks !== "AB" && subjectMarks !== "-"){
                dataN.append("marks_id", marksID);
                dataN.append("marks", subjectMarks);
                url = 'result/edit/result/acedmics/';
            }

        } else if (subjectType === "CoScholasticSubject") {
            dataN.append("marks_id", marksID);
            dataN.append("grade", subjectMarks);
            url = 'result/edit/result/coschoolistic/';
            if (subjectMarks == '' || subjectMarks == '-') {
                url = 'result/mark-optional/coschoolastic/';
            }
        } else if (subjectType === "CoCurricularSubject") {
            url = 'result/edit/result/cocurricular/';
            dataN.append("marks_id", marksID);
            dataN.append("marks", subjectMarks);
        } else if (subjectType == "attendance") {
            dataN.append("attendance_id", marksID);
            dataN.append("attendance", subjectMarks);

            url = 'result/edit/result/attendance/';
        } else if (subjectType == "remark") {
            dataN.append("attendance_id", marksID);
            dataN.append("remark", subjectMarks);

            url = 'result/edit/result/attendance/';
        }

        const config = {
            method: 'Patch',
            maxBodyLength: Infinity,
            url,
            headers: {
                "Content-Type": "multipart/form-data",
                "accept": 'application/json',
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
                        // window.location.reload();
                    }, 1000);
                } else {
                    toast.error(response.data?.Data || "Something went wrong...!");
                }
            })
            .catch((e) => {
                try {
                    toast.error(e.response.data?.Data || "Something went wrong...!");
                    setErrorMsg(e.response.data?.Data || "Something went wrong...!");
                } catch (de) {
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


        // if (checked === true && isDisabled == true) {
        //     let dataN2 = new FormData();
        //     dataN2.append("marks_id", marksID);
        //     config.url = subjectType === "AcadmicsSubject" ? 'result/mark-absent/acadmics/' : 'result/mark-absent/coschoolastic/';
        //     config.data = dataN2;

        //     AxiosObj.request(config)
        //         .then((response) => {
        //             if (response.data?.Success) {
        //                 toast.success(response.data?.Data || "Marks has been updated");
        //                 // Reload the window after 2 seconds
        //                 setTimeout(() => {
        //                     window.location.reload();
        //                 }, 1000);
        //             } else {
        //                 toast.error(response.data?.Data || "Something went wrong...!");
        //             }
        //         })
        //         .catch((e) => {
        //             try {
        //                 toast.error(e.response.data?.Data || "Something went wrong...!");
        //                 setErrorMsg(e.response.data?.Data || "Something went wrong...!");
        //             } catch (e) {
        //                 if (e.response?.data?.Data instanceof Array) {
        //                     e.response.data.Data.map((item) => toast.error(item || "Something went wrong...!"));
        //                     setErrorMsg(e.response.data.Data[0] || "Something went wrong...!");
        //                 } else {
        //                     toast.error("Something went wrong...!");
        //                     setErrorMsg("Something went wrong...!");
        //                 }
        //             }
        //         })
        //         .finally(() => setLoading(false));
        // } else {
        //     AxiosObj.request(config)
        //         .then((response) => {
        //             if (response.data?.Success) {
        //                 toast.success(response.data?.Data || "Marks has been updated");
        //                 // Reload the window after 2 seconds
        //                 setTimeout(() => {
        //                     window.location.reload();
        //                 }, 1000);
        //             } else {
        //                 toast.error(response.data?.Data || "Something went wrong...!");
        //             }
        //         })
        //         .catch((e) => {
        //             try {
        //                 toast.error(e.response.data?.Data || "Something went wrong...!");
        //                 setErrorMsg(e.response.data?.Data || "Something went wrong...!");
        //             } catch (e) {
        //                 if (e.response?.data?.Data instanceof Array) {
        //                     e.response.data.Data.map((item) => toast.error(item || "Something went wrong...!"));
        //                     setErrorMsg(e.response.data.Data[0] || "Something went wrong...!");
        //                 } else {
        //                     toast.error("Something went wrong...!");
        //                     setErrorMsg("Something went wrong...!");
        //                 }
        //             }
        //         })
        //         .finally(() => setLoading(false));
        // }
    };

    function handleKeyDown(event) {
        if (inputType == "Number" || inputType == "number") {
            if (event.keyCode === 69) {
                event.preventDefault();
            }
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
            setMarksID(data.subjectMarkId)
            setStudentName(data.StudentName)
            setSubjectMarks(data.subjectMarks)
            setSubjectMarks2(data.subjectMarks)
            setSubjectName(data.subjectName)
            setSubjectType(data.subjectType)
            setInputType(data.inputType)
            if (data.max_marks) {
                setMaxMarks(data.max_marks)
            }
            if (data.min_marks) {
                setMinMarks(data.min_marks)
            }


            if (data.subjectMarks == null || data.subjectMarks == "AB") {
                setIsDisabled(true)
                setInputType("text")
            }
            if (data.subjectMarks == "-") {
                setSubjectOptional2(true)
                setSubjectMarks2('-')
                setInputType(data.inputType)
            }
        }
    }, [open, data])

    return (
        <div >
            <Dialog fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Update {subjectType === "attendance" ? ("Attendance") : (subjectType === "remark" ? ("Remark") : ("Mark"))} </DialogTitle>
                <DialogContent >
                    <div style={{ textAlign: "center" }} >
                        <DialogTitle variant='h6' style={{ padding: "10px 0px", display: "flex", justifyContent: "space-between" }} >Student Name: {studentName}</DialogTitle>
                        <Stack fullwidth="true">
                            <FormLabel style={{ textAlign: "left" }}>{(subjectName || "Label").toUpperCase()} </FormLabel>
                            <Input value={subjectMarks} disabled={isDisabled} name="subjectMarks" type={inputType || "text"} onKeyDown={handleKeyDown} onChange={handleChangeValue} />
                        </Stack>
                        {subjectType == "AcadmicsSubject" || subjectType == "CoScholasticSubject" ? (
                            subjectMarks2 != "AB" ? (
                                <Stack fullwidth="true" mt={1} direction="row" gap={1} alignItems="center">
                                    <FormLabel style={{ textAlign: "left" }}>Mark as Absent: </FormLabel>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={checked}
                                                onChange={handleChange}
                                                onKeyDown={handleKey}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        }
                                    />
                                </Stack>
                            ) : (<Stack fullwidth="true" mt={1} direction="row" gap={1} alignItems="center">
                                <FormLabel style={{ textAlign: "left" }}>Mark as Present: </FormLabel>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={checked}
                                            onChange={handleChange}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    }
                                />
                            </Stack>)
                        ) : null}
                        {subjectType == "AcadmicsSubject" || subjectType == "CoScholasticSubject" ? (
                            !subjectOptional2 ? (
                                <Stack fullwidth="true" mt={1} direction="row" gap={1} alignItems="center">
                                    <FormLabel style={{ textAlign: "left" }}>Mark as not-opted subject: </FormLabel>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={subjectOptional}
                                                onChange={handleChange2}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />
                                        }
                                    />
                                </Stack>
                            ) : (<Stack fullwidth="true" mt={1} direction="row" gap={1} alignItems="center">
                                <FormLabel style={{ textAlign: "left" }}>Mark as opted subject: </FormLabel>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={subjectOptional}
                                            onChange={handleChange2}
                                            inputProps={{ 'aria-label': 'controlled' }}
                                        />
                                    }
                                />
                            </Stack>)
                        ) : null}
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
