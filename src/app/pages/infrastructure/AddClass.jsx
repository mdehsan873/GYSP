import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormLabel, Typography, Grid, IconButton, Input, MenuItem, Select, Stack, FormControl } from '@mui/material';
import Loader from '../../components/Loader';
import { useState } from 'react';
import { getAxiosWithToken } from '../../axios/AxiosObj';
import secureLocalStorage from "react-secure-storage";
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';

export default function AddClass({ open, setOpen, }) {
    const { sessions } = useSelector(state => state.infra)

    const [errorMsg, setErrorMsg] = useState('')
    const [classValue, setClassValue] = useState(['',])
    const [session, setSession] = useState(sessions[0].id)
    const [section, setSection] = useState(['',])
    const [loading, setLoading] = useState(false)
    const [formcount, setFormcount] = useState([1,])

    const handleClose = () => {
        setClassValue(['',])
        setSection(['',])
        setFormcount([1,])
        setErrorMsg('')
        setOpen(false);
    };
    const addClass = async () => {
        let flag = false;
        for (let i = 0; i < classValue.length; i++) {
            if (classValue[i] == '') {
                flag = true;
                break;
            }
        }

        if (flag) {
            setErrorMsg("Required field shloud not be empty")
            toast.error("Required field shloud not be empty");
            return;
        }
        if (!session) {
            setErrorMsg("Select session first")
            toast.error("Select session first");
            return;
        }

        let arr = formcount.map((item, index) => { return ({ "class_name": classValue[index], "section_name": section[index] }) })
        let data = JSON.stringify([{ "session_id": session, classes: arr }]);

        setLoading(true)
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'classes/add/class/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),  
            },
            data: data
        };
        const AxiosObj = getAxiosWithToken();

        AxiosObj.request(config)
            .then((response) => {
                if (response.data?.Success) {
                    toast.success(response.data?.Data || "Class has been added");
 
                    if (secureLocalStorage.getItem("rClassAndSection")) {
                        secureLocalStorage.removeItem("rClassAndSection")
                    }
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
                } catch (e) {
                    toast.error(e.response.data?.Data || "Something went wrong...!")
                }
            })
            .finally(() => setLoading(false));
    }

    const incrementFormInput = () => {
        let arr = [...formcount, 1];
        setFormcount(arr);
        setClassValue((prevClassValue) => [...prevClassValue, '']);
        setSection((prevSection) => [...prevSection, '']);
    };

    const decrementFormInput = (index) => {
        if (formcount.length > 1) {
            setFormcount((prevFormCount) => {
                const updatedFormCount = [...prevFormCount];
                updatedFormCount.splice(index, 1);
                return updatedFormCount;
            });
            setClassValue((prevClassValue) => {
                const updatedClassValue = [...prevClassValue];
                updatedClassValue.splice(index, 1);
                return updatedClassValue;
            });
            setSection((prevSection) => {
                const updatedSection = [...prevSection];
                updatedSection.splice(index, 1);
                return updatedSection;
            });
        }
    };

    return (
        <div>
            <Dialog fullWidth={true} maxWidth='xs' open={open} onClose={handleClose} >
                <DialogTitle variant='h5' >Add Class</DialogTitle>
                <DialogContent >
                    <Stack style={{ width: "25%" }} sx={{ ml: 0 }}>
                        <FormControl variant="standard" sx={{ width: '100%' }}>
                            <FormLabel>Session*</FormLabel>
                            <Select
                                labelId="gender-simple-select-standard-label"
                                id="gender-simple-select-standard"
                                value={session}
                                required
                                onChange={(e) => { setSession(e.target.value) }}
                                label="Session"
                            >
                                {sessions.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Stack>
                    <Stack spacing={2} mt={2} direction={'row'}>
                        <Stack width={'100%'}>
                            <FormLabel>Class*</FormLabel>
                            <Input required value={classValue[0]} onChange={e => {
                                let arr = [...classValue]
                                arr[0] = e.target.value
                                setClassValue(arr)
                            }} />
                        </Stack>
                        <Stack>
                            <FormLabel>Section*</FormLabel>
                            <Input required value={section[0]} onChange={e => {
                                let arr = [...section]
                                arr[0] = e.target.value
                                setSection(arr)
                            }} />
                        </Stack>
                        <IconButton sx={{ visibility: 'hidden' }} onClick={decrementFormInput}><CloseIcon /></IconButton>
                    </Stack>
                    {formcount.map((item, index) => {
                        if (index === 0) {
                            return null; // Skip the first input since it's already rendered outside the loop
                        } else {
                            return (
                                <Stack spacing={2} mt={2} direction="row" key={index}>
                                    <Stack width="100%">
                                        <FormLabel>Class*</FormLabel>
                                        <Input
                                            value={classValue[index]}
                                            onChange={(e) => {
                                                let arr = [...classValue];
                                                arr[index] = e.target.value;
                                                setClassValue(arr);
                                            }}
                                        />
                                    </Stack>
                                    <Stack>
                                        <FormLabel>Section*</FormLabel>
                                        <Input
                                            value={section[index]}
                                            onChange={(e) => {
                                                let arr = [...section];
                                                arr[index] = e.target.value;
                                                setSection(arr);
                                            }}
                                        />
                                    </Stack>
                                    <IconButton onClick={() => decrementFormInput(index)}>
                                        <CloseIcon />
                                    </IconButton>
                                </Stack>
                            );
                        }
                    })}
                    <Button
                        color="info"
                        sx={{ textTransform: "capitalize", marginTop: 3 }}
                        onClick={incrementFormInput}
                    >
                        + Add More Class
                    </Button>
                </DialogContent>

                <Typography color='red' textAlign={'center'}>{errorMsg}</Typography>
                <Grid container spacing={2} mt={1} justifyContent='center' alignItems={'center'}>
                    {loading ? <Loader /> : <Button variant='contained' type='submit' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={addClass} >Add Class</Button>}
                </Grid>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
