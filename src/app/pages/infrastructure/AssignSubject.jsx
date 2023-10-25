import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormLabel, Grid, Input, Stack, Typography } from '@mui/material';
import Loader from '../../components/Loader';
import { useState, useEffect } from 'react';
import AxiosObj from '../../axios/AxiosObj';
import { FormControl } from '@mui/material';
import secureLocalStorage from "react-secure-storage";
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { toast } from 'react-toastify';
import SearchIcon from "@mui/icons-material/Search";

import {
    ListSubheader,
    TextField,
    InputAdornment
} from "@mui/material";

export default function AssignSubject({ open, setOpen, data, teacherData }) {

    const [teacher_id, setTeacherId] = useState('')

    const [seclectedSubjectID, setSeclectedSubjectID] = useState('')
    const [subjectName, setSubjectName] = useState('')
    const [subjectType, setSubjectType] = useState('')
    const [searchText, setSearchText] = useState("");

    const [isChange, setIsChange] = useState(false)

    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)
    const [teacherDataRAW, setTeacherDataRAW] = useState([])

    const handleClose = () => {
        setErrorMsg('')
        setTeacherId('')
        setSeclectedSubjectID('')
        setSubjectName('')
        setSubjectType('')
        setIsChange(false)
        setLoading(false)
        setOpen(false);
    };

    const assignClass = async () => {

        if (!subjectType || teacher_id === "") {
            setErrorMsg("Fill required field")
            toast.error("Fill required field");
            return;
        }

        let data = JSON.stringify({
            "subject_type": subjectType,
            "teacher_id": teacher_id,
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'subject/assign/subject/teacher/' + seclectedSubjectID + '/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),  
            },
            data: data
        };

        AxiosObj.request(config)
            .then((response) => {
                if (response.data?.Success) {
                    toast.success(response.data?.data || "Subject has been Assigned");
                    if (secureLocalStorage.getItem("allSubjectRAWData")) {
                        secureLocalStorage.removeItem("allSubjectRAWData")
                    }
                    // Reload the window after 2 seconds
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    toast.error(response.data?.data || "Something went wrong...!");
                }
            })
            .catch((e) => {
                try {
                    e.response.data?.Data.map(item => (
                        toast.error(item || "Something went wrong...!")
                    ))
                } catch (e) {
                    toast.error(e.response.data?.Data || "Something went wrong...!")
                }
            })
            .finally(() => setLoading(false));

    }

    const handleChangeValue = (e) => {
        setIsChange(true);
        const { name, value } = e.target;

        if (name === "teacher") {
            setTeacherId(value);
        }

    };

    useEffect(() => {
        let filteredTeacher = teacherData.filter((teacherItem) => {
            const nameMatch =
                searchText.trim() === "" ||
                teacherItem.teacher_details.name
                    .toLowerCase()
                    .includes(searchText.toLowerCase().trim()) ||
                teacherItem.teacher_details.email
                    .toLowerCase()
                    .includes(searchText.toLowerCase().trim());
            return nameMatch;
        });

        setTeacherDataRAW(filteredTeacher);

    }, [searchText]);

    useEffect(() => {
        if (open === true) {
            const foundItem = teacherData.find(item => item.teacher_details.name === data.teacherName);
            if (foundItem) {
                setTeacherId(foundItem.id)
            } else {
                setTeacherId('')
            }
            setSeclectedSubjectID(data?.id)
            setSubjectName(data?.name)
            setSubjectType(data?.subjectType)
            setTeacherDataRAW([...teacherData])
        }
    }, [data, open]);

    // const SelectTeacher = () => {
    //     return (

    //     )
    // }
    return (
        <div>
            <Dialog maxWidth='sm' fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' >Assign Subject To Teachers</DialogTitle>
                <DialogContent >
                    <form>
                        <Grid container spacing={2} justifyContent='center' alignItems={'center'}>
                            <Grid item lg={6} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Teachers*</FormLabel>
                                    <FormControl variant="standard" sx={{ width: '100%' }}>
                                        <Select
                                            labelId="search-select-label"
                                            id="search-select"
                                            value={teacher_id}
                                            onChange={handleChangeValue}
                                            name="teacher"
                                            label="teacher_id"
                                        >
                                            <ListSubheader>
                                                <TextField
                                                    size="small"
                                                    // autoFocus
                                                    placeholder="Type to search..."
                                                    fullWidth
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <SearchIcon />
                                                            </InputAdornment>
                                                        ),
                                                        onKeyDown: (e) => {
                                                            if (e.key !== "Escape") {
                                                                // Prevents autoselecting item while typing (default Select behavior)
                                                                e.stopPropagation();
                                                            }
                                                            e.stopPropagation();
                                                            console.log(e)
                                                        }
                                                    }}
                                                    value={searchText}
                                                    onChange={(e) => {
                                                        setSearchText(e.target.value);
                                                    }}
                                                />
                                            </ListSubheader>
                                            {teacherDataRAW.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>
                                                    {item?.teacher_details.name + "(" + item?.teacher_details.email + ")"}
                                                </MenuItem>
                                            ))}
                                        </Select>

                                    </FormControl>
                                </Stack>
                            </Grid>
                            <Grid item lg={6} sm={12}>
                                <Stack margin={2}>
                                    <FormLabel>Subject's Name</FormLabel>
                                    <Input required value={subjectName} disabled />
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <Typography color={'red'} textAlign={'center'}>{errorMsg !== '' ? errorMsg : null}</Typography>
                {loading ? <Loader /> : <Button disabled={!isChange} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={assignClass} >Assign</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
