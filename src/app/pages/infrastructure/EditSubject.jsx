import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormLabel, Input, Stack, Typography } from '@mui/material';
import Loader from '../../components/Loader';
import { useState, useEffect } from 'react';
import AxiosObj from '../../axios/AxiosObj';
import { FormControl } from '@mui/material';
import { Select } from '@mui/material';
import secureLocalStorage from "react-secure-storage";
import { MenuItem } from '@mui/material';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import AlertDialog from '../../components/dialogs/confimationBox';

export default function EditSubject({ open, setOpen, data, teacherListData }) {
    const { classAndSection } = useSelector(state => state.infra)

    const [loading, setLoading] = useState(false)
    // Subject Details
    const [teacherList, setTeacherList] = useState([])
    const [subjectID, setSubjectID] = useState('')
    const [name, setName] = useState('')
    const [subjectType, setSubjectType] = useState('')
    const [subjectClassID, setSubjectClassID] = useState('')
    const [subjectTeacherID, setSubjectTeacherID] = useState('')
    const [isMandatory, setIsMandatory] = useState('')
    const [apiUrl, setApiUrl] = useState('')
    const [errorMsg, setErrorMsg] = useState('')

    const handleClose = () => {
        setApiUrl('');
        setErrorMsg('');
        setIsMandatory('');
        setName('');
        setTeacherList([]);
        setSubjectTeacherID('');
        setSubjectClassID('');
        setSubjectID('');
        setSubjectType('');
        setOpen(false);
    };

    // Delete
    const [isChange, setIsChange] = useState(false)
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
    const [deleteData, setDeleteData] = useState("")

    const handleDeleteOpen = (apiEndPoint) => {
        setOpenDeleteAlert(true);
        setDeleteData({
            "apiEndPoint": apiEndPoint,
            "apiData": undefined
        })
    };

    const editSubject = async (e) => {
        e.preventDefault();
        if (isMandatory === '' || name === '' || subjectType === '' || subjectTeacherID === '' || subjectClassID === '') {
            setErrorMsg('Required field shloud not be empty')
            toast.error("Required field shloud not be empty");
            return;
        }

        const foundItem = await classAndSection.find(item => item.id === subjectClassID);
        if (foundItem) {
            setLoading(true)
            let dataN = JSON.stringify({
                "name": name,
                "is_mandatory": isMandatory,
                "class_id": foundItem.class_id,
                "section_id": foundItem.section_id,
                "subject_type": subjectType,
                "teacher_id": subjectTeacherID
            });
            let config;
            if (data.subjectType === "AcadmicsSubject") {
                config = {
                    method: 'patch',
                    maxBodyLength: Infinity,
                    url: 'subject/edit/acadmics/' + subjectID + '/',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: dataN
                };
            } else {
                config = {
                    method: 'patch',
                    maxBodyLength: Infinity,
                    url: 'subject/edit/coscholastic/' + subjectID + '/',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),  
                    },
                    data: dataN
                };
            }

            AxiosObj.request(config)
                .then((response) => {
                    if (response.data?.Success) {
                        toast.success(response.data?.data || "Subject has been updated");
                        // Reload the window after 2 seconds

                        if (secureLocalStorage.getItem("allSubjectRAWData")) {
                            secureLocalStorage.removeItem("allSubjectRAWData")
                        }
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else {
                        setErrorMsg('Required field shloud not be empty')
                        toast.error(response.data?.data || "Something went wrong...!");
                    }
                })
                .catch((e) => {
                    console.log("edit subject",e)
                        toast.error(e.response.data.Data || "Something went wrong...!")
                })
                .finally(() => setLoading(false))
        }
    }
    // Change 
    const handleChangeValue = (e) => {
        setIsChange(true);
        const { name, value } = e.target;

        if (name === "subjectClassID") {
            setSubjectClassID(value);
        }
        if (name === "subjectType") {
            setSubjectType(value);
        }
        if (name === "subjectTeacher") {
            setSubjectTeacherID(value);
        }
        if (name === "subjectTeacher") {
            setSubjectTeacherID(value);
        }
        if (name === "isMandatory") {
            setIsMandatory(value);
        }
        if (name === "name") {
            setName(value);
        }
    };

    useEffect(() => {
        if (open && open === true) {
            // fetchSubject()
            const foundItem = classAndSection.find(item => item.class_name === data.subjectClass && item.section_name === data.subjectSection);
            const foundItem2 = teacherListData.find(item => item?.teacher_details.name === data.subjectTeacher);
            if (foundItem && foundItem2) {
                setSubjectID(data?.id)
                setName(data?.name)
                setSubjectType(data?.subjectType)
                setSubjectClassID(foundItem?.id)
                setSubjectTeacherID(foundItem2.id)
                setIsMandatory(data?.isMandatory)
            } else {
                setSubjectID(data?.id)
                setName(data?.name)
                setSubjectType(data?.subjectType)
                setIsMandatory(data?.isMandatory)
            }

            if (data?.subjectType === "AcadmicsSubject") {
                setApiUrl(`subject/delete/acadmics/${data?.id}/`)
            } else {
                setApiUrl(`subject/delete/coscholastic/${data?.id}/`)
            }
            setTeacherList([...teacherListData])
        }
    }, [open, data])

    const SelectClass = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="selectClass-simple-select-standard-label"
                    id="selectClass-simple-select-standard"
                    value={subjectClassID}
                    name="subjectClassID"
                    onChange={handleChangeValue}
                    label="selectClass"
                >
                    {classAndSection.map(item => <MenuItem key={item.id} value={item.id}>{(item?.class_name + " " + item?.section_name).toUpperCase()}</MenuItem>)}
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
                    onChange={handleChangeValue}
                    name="subjectType"
                    label="selectType"
                >
                    <MenuItem value={'AcadmicsSubject'}>Academic</MenuItem>
                    <MenuItem value={'CoScholasticSubject'}>Co-scholastic</MenuItem>
                </Select>
            </FormControl>
        )
    }
    const SelectTeacher = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="subjectTeacher-simple-select-standard-label"
                    id="subjectTeacher-simple-select-standard"
                    value={subjectTeacherID}
                    onChange={handleChangeValue}
                    label="subjectTeacher"
                    name="subjectTeacher"
                >
                    {teacherList.map(item => <MenuItem key={item.id} value={item?.id}>{item?.teacher_details.name + "(" + item?.teacher_details.email + ")"}</MenuItem>)}
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
                    onChange={handleChangeValue}
                    label="isMandatory"
                    name="isMandatory"
                >
                    <MenuItem value={"True"}>True</MenuItem>
                    <MenuItem value={"False"}>False</MenuItem>
                </Select>
            </FormControl>
        )
    }
    return (
        <div>
            <Dialog maxWidth='xs' fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Edit Subject <DeleteIcon style={{ color: "red", cursor: "pointer" }} onClick={() => handleDeleteOpen(apiUrl)} /></DialogTitle>
                <DialogContent >
                    <form  >
                        <Stack spacing={2} >
                            <FormLabel>Subject Name*</FormLabel>
                            <Input value={name} name="name" onChange={handleChangeValue} />
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

                {loading ? <Loader /> : <Button disabled={!isChange} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={editSubject} >Update</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <AlertDialog openBox={openDeleteAlert} setOpen={setOpenDeleteAlert} data={deleteData} />
        </div>
    )
}
