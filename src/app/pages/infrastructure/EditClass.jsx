import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormLabel, Input, MenuItem, Select, Stack, Typography, FormControl } from '@mui/material';
import Loader from '../../components/Loader';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAxiosWithToken } from "../../axios/AxiosObj";
import { toast } from 'react-toastify';
import AlertDialog from '../../components/dialogs/confimationBox';
import secureLocalStorage from "react-secure-storage";

export default function AddClass({ open, setOpen, data }) {
    const { sessions, classAndSection } = useSelector(state => state.infra)

    const [loading, setLoading] = useState(false)
    const [classSectionID, setClassSectionID] = useState('')
    const [className, setClassName] = useState('')
    const [classID, setClassID] = useState('')
    const [sectionName, setSectionName] = useState('')
    const [sectionID, setSectionID] = useState('')
    const [session, setSession] = useState('')
    const [newSession, setNewSession] = useState('')

    const [errorMsg, setErrorMsg] = useState('')

    // Delete
    const [isChange, setIsChange] = useState(false)
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
    const [deleteData, setDeleteData] = useState("")

    const handleDeleteOpen = (apiEndPoint) => {
        setOpenDeleteAlert(true);
        setDeleteData({
            "apiEndPoint": apiEndPoint,
            "apiData": JSON.stringify({ "session_id": session, "class_id": classID, "section_id": sectionID, })
        })
    };

    // Close
    const handleClose = () => {
        setClassName('')
        setClassID('')
        setSectionName('')
        setSectionID('')
        setOpen(false);
        setIsChange(false);
    };

    // Edit Class
    const addClass = async () => {

        if (!session || className === "" || sectionName === "") {
            setErrorMsg("Fill required field")
            toast.error("Fill required field");
            return;
        }
        let data;

        if (session !== newSession) {
            console.log('sdfs', newSession, session)
            data = JSON.stringify({ "session_id": session, "new_session_id": newSession, "class_name": className, "class_id": classID, "section_id": sectionID, "section_name": sectionName, });
        } else {
            console.log('same', newSession, session)
            data = JSON.stringify({ "session_id": session, "class_name": className, "class_id": classID, "section_id": sectionID, "section_name": sectionName, });
        }

        setLoading(true)
        let config = {
            method: 'Patch',
            maxBodyLength: Infinity,
            url: 'classes/edit/class/section/' + classSectionID,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
            },
            data: data
        };
        const AxiosObj = getAxiosWithToken();

        AxiosObj.request(config)
            .then((response) => {
                if (response.data?.Success) {
                    toast.success(response.data?.Data || "Class has been updated");
                    // Reload the window after 2 seconds

                    
                    if (secureLocalStorage.getItem("rClassAndSection")) {
                        secureLocalStorage.removeItem("rClassAndSection")
                    }
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    toast.error(response.data?.Data || "Something went wrong...!");
                    setErrorMsg(response.data?.Data || "Something went wrong...!");
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
            .finally(() => setLoading(false));
    }

    // Change 
    const handleChangeValue = (e) => {
        setIsChange(true);
        const { name, value } = e.target;

        if (name === "session") {
            // setSession(value);
            setNewSession(value);
        }
        if (name === "class") {
            setClassName(value);
        }

        if (name === "section") {
            setSectionName(value);
        }
    };

    useEffect(() => {
        if (open && open === true) {
            const foundItem = classAndSection.find(item => item.id === data.id);
            const foundItem2 = sessions.find(item => item.name === data.session);
            if (foundItem && foundItem2) {
                setClassSectionID(data?.id)
                setClassID(foundItem?.class_id)
                setSectionID(foundItem?.section_id)
                setClassName(foundItem?.class_name)
                setSectionName(foundItem?.section_name)
                setSession(foundItem2?.id)
                setNewSession(foundItem2?.id)
            }
        }
    }, [open, data])

    return (
        <div>
            <Dialog fullWidth={true} maxWidth='xs' open={open} onClose={handleClose} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Edit Class <DeleteIcon style={{  cursor:"pointer" }} onClick={() => handleDeleteOpen(`classes/delete/class/section/${classSectionID}`)} /></DialogTitle>
                <DialogContent >
                    <form  >
                        <Stack style={{ width: "20%" }} sx={{ ml: 0 }}>
                            <FormControl variant="standard" sx={{ width: '100%' }}>
                                <FormLabel>Session*</FormLabel>
                                <Select
                                    labelId="gender-simple-select-standard-label"
                                    id="gender-simple-select-standard"
                                    value={newSession}
                                    name="session"
                                    onChange={handleChangeValue}
                                    label="Session"
                                >
                                    {sessions.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack spacing={2} mt={2} direction={'row'}>
                            <Stack width={'100%'}>
                                <FormLabel>Class*</FormLabel>
                                <Input value={className || ""} name="class" id="classInput" onChange={handleChangeValue} />
                            </Stack>
                            <Stack>
                                <FormLabel>Section*</FormLabel>
                                <Input value={sectionName || ""} name="section" id="sectionIput" onChange={handleChangeValue} />
                            </Stack>
                        </Stack>
                    </form>
                </DialogContent>
                <Typography color={'red'} textAlign={'center'}>{errorMsg !== '' ? errorMsg : null}</Typography>
                {loading ? <Loader /> : <Button disabled={!isChange} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={addClass} >Update</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <AlertDialog openBox={openDeleteAlert} setOpen={setOpenDeleteAlert} data={deleteData} />
        </div>
    )
}
