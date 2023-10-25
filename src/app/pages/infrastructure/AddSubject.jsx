import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormLabel, Input, Stack, Typography, Grid } from '@mui/material';
import Loader from '../../components/Loader';
import AxiosObj from '../../axios/AxiosObj';
import { FormControl } from '@mui/material';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import secureLocalStorage from "react-secure-storage";
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';

export default function AddSubject({ open, setOpen, teacherListData }) {

    const { classAndSection } = useSelector(state => state.infra)

    // Subject Details
    const [name, setName] = useState('')
    const [teacherList, setTeacherList] = useState([])
    const [subjectType, setSubjectType] = useState('')
    const [seclectedClassItemID, setSeclectedClassItemID] = useState('')
    const [subjectTeacher, setSubjectTeacher] = useState('')
    const [isMandatory, setIsMandatory] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [loading, setLoading] = useState(false)

    const handleClose = () => {
        setSubjectTeacher('');
        setIsMandatory('');
        setErrorMsg('');
        setTeacherList([]);
        setName('');
        setSubjectType('');
        setSeclectedClassItemID('');
        setOpen(false);
    };

    const addSubject = async (e) => {
        e.preventDefault();
        if (name == '' || isMandatory == '' || seclectedClassItemID == '' || subjectType == '' || subjectTeacher == '') {
            setErrorMsg('Required field shloud not be empty')
            toast.error("Required field shloud not be empty");
            return;
        }

        const foundItem = await classAndSection.find(item => item.id === seclectedClassItemID);
        if (foundItem) {
            let data = JSON.stringify({
                "name": name,
                "is_mandatory": isMandatory,
                "class_id": foundItem.class_id,
                "section_id": foundItem.section_id,
                "subject_type": subjectType,
                "teacher_id": subjectTeacher
            });

            setLoading(true)
            let config;
            if (subjectType === "AcadmicsSubject") {
                config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'subject/add/acadmics/',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: data
                };
            } else {
                config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'subject/add/coscholastic/',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),  
                    },
                    data: data
                };
            }

            AxiosObj.request(config)
                .then((response) => {
                    if (response.data?.Success) {
                        toast.success(response.data?.data || "Subject has been added");

                        if (secureLocalStorage.getItem("allSubjectRAWData")) {
                            secureLocalStorage.removeItem("allSubjectRAWData")
                        }
                        // Reload the window after 2 seconds
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else {
                        toast.error("Subject already added")
                    }
                })
                .catch((e) => {
                    console.log("e.response.data",e.response.data)
                    try {
                        e.response.data.Data?.map(item => (
                            toast.error(item || "Something went wrong...!")
                        ))
                    } catch (e) {
                        toast.error("Subject already added")
                    }
                })
                .finally(() => setLoading(false));
        }
    }

    const SelectClass = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="classSection-simple-select-standard-label"
                    id="classSection-simple-select-standard"
                    value={seclectedClassItemID}
                    required
                    onChange={(e) => { setSeclectedClassItemID(e.target.value) }}
                    label="classSection"
                >
                    {classAndSection.map(item => <MenuItem key={item.id} value={item.id}>{(item.class_name + " " + item.section_name).toUpperCase()}</MenuItem>)}
                </Select>
            </FormControl>
        )
    }

    const SelectType = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="selectType-simple-select-standard-label"
                    id="selectType-simple-select-standard"
                    value={subjectType}
                    onChange={(e) => { setSubjectType(e.target.value) }}
                    label="selectType"
                >
                    <MenuItem value={'AcadmicsSubject'}>Academic</MenuItem>
                    <MenuItem value={'CoScholasticSubject'}>Co-scholastic</MenuItem>
                </Select>
            </FormControl>
        )
    }
    const SelectTeacher = () => {
        console.log("teacherList",teacherList);
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="subjectTeacher-simple-select-standard-label"
                    id="subjectTeacher-simple-select-standard"
                    value={subjectTeacher}
                    required
                    onChange={(e) => { setSubjectTeacher(e.target.value) }}
                    label="subjectTeacher"
                >
                    {
                    teacherList.map(item => <MenuItem key={item.teacher_details.id} value={item?.teacher_details.id}>{item?.teacher_details.name + "(" + item?.teacher_details.email + ")"}</MenuItem>)
                    }
                    
                </Select>
            </FormControl>
            

        )
    }
    const SelectMandatory = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="SelectMandatory-simple-select-standard-label"
                    id="SelectMandatory-simple-select-standard"
                    value={isMandatory}
                    required
                    onChange={(e) => { setIsMandatory(e.target.value) }}
                    label="isMandatory"
                >
                    <MenuItem value={"True"}>True</MenuItem>
                    <MenuItem value={"False"}>False</MenuItem>
                </Select>
            </FormControl>
        )
    }

    useEffect(() => {
        if (open && open === true) {
            // fetchSubject()
            // if (teacherListData.lenght > 0) {
                // console.log("Teacher data ",teacherListData);    
            setTeacherList(teacherListData)

            // }
        }
    }, [open, teacherListData])

    return (
        <div>
            <Dialog maxWidth='xs' fullWidth open={open} onClose={handleClose} >

                <DialogTitle variant='h5' >Add Subject</DialogTitle>
                <DialogContent >
                    <form >
                        <Stack spacing={2} >
                            <FormLabel>Subject Name*</FormLabel>
                            <Input value={name} required onChange={e => setName(e.target.value)} />
                            <FormLabel>Class*</FormLabel>
                            <SelectClass />
                            <FormLabel>Teacher*</FormLabel>
                            <SelectTeacher />
                            <FormLabel>Type*</FormLabel>
                            <SelectType />
                            <FormLabel>Mandatory*</FormLabel>
                            <SelectMandatory />
                        </Stack>
                    </form>
                </DialogContent>
                <Typography color='red' textAlign={'center'}>{errorMsg}</Typography>
                <Grid container spacing={2} mt={1} justifyContent='center' alignItems={'center'}>
                    {loading ? <Loader /> : <Button type='submit' variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={addSubject} >Add Subject</Button>}
                </Grid>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
