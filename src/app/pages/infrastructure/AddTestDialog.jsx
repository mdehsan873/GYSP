import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider, FormLabel, Typography, IconButton, Input, MenuItem, Select, Stack, FormControl } from '@mui/material';
import AxiosObj from '../../axios/AxiosObj';
import Loader from '../../components/Loader';
import { useState } from 'react';
import secureLocalStorage from "react-secure-storage";
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify';
import { useEffect } from 'react';

export default function AddTestDialog({ open, setOpen, }) {
    const { sessions } = useSelector(state => state.infra)
    const [testArr, setTestArr] = useState(['',])
    const [session, setSession] = useState('')
    const [testName, setTestName] = useState('')
    const [formcount, setFormcount] = useState([1,])
    const capitalizeWords = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    const [errorMsg, setErrorMsg] = useState('')

    const [loading, setLoading] = useState(false)
    const handleClose = () => {
        setTestArr(['',])
        setTestName('')
        setFormcount([1,])
        setErrorMsg('');
        setOpen(false);
    };

    const addTest = async () => {

        let arr = testArr.map((item, index) => {
            let obj = {};
            // obj[`test_${index + 1}`] = item;
            obj[`test_name`] = item;
            return obj;
        });
        let data = JSON.stringify({
            "test_pattern": testName,
            "session_id": session,
            "test": arr
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'result/add/test/pattern/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),  
            },
            data: data
        };


        if (testName !== "" && session !== "" && Array.isArray(arr) && arr.length > 0) {
            for (let i = 0; i < testArr.length; i++) {
                if (testArr[i].trim() === "") {
                    toast.error('Sub Test name should not be empty');
                    return false;
                }
            }
            if (arr[0].test_name !== "") {
                setLoading(true);
                AxiosObj.request(config)
                    .then((response) => {
                        if (response.data?.Success) {
                            toast.success(capitalizeWords(response.data.Data[0]) || "Test Pattern has been added");

                            if (secureLocalStorage.getItem("testPatternFilterRAW")) {
                                secureLocalStorage.removeItem("testPatternFilterRAW")
                            }
                            // Reload the window after 2 seconds
                            setTimeout(() => {
                                window.location.reload();
                            }, 1500);
                        } else {
                            toast.error(capitalizeWords(response.data?.Data) || "Something went wrong...!");
                        }
                    })
                    .catch((e) => {
                        try {
                            e.response.data?.Data.map(item => (
                                toast.error(capitalizeWords(item) || "Something went wrong...!")
                            ))
                        } catch (e) {
                            toast.error(capitalizeWords(e.response.data?.Data) || "Something went wrong...!")
                        }
                    })
                    .finally(() => setLoading(false));
            } else {
                setErrorMsg('Atleast one test is required')
                toast.error("Atleast one test is required");
            }
        } else {
            setErrorMsg('Fill the required fields')
            toast.error("Fill the required fields");
        }

    }
    const incrementFormInput = () => {
        let arr = [...formcount, 1];
        setFormcount(arr);
        setTestArr(prevTestArr => [...prevTestArr, '']);
    };

    const decrementFormInput = (index) => {
        if (formcount.length > 1) {
            setFormcount(prevFormCount => {
                const updatedFormCount = [...prevFormCount];
                updatedFormCount.splice(index, 1);
                return updatedFormCount;
            });
            setTestArr(prevTestArr => {
                const updatedTestArr = [...prevTestArr];
                updatedTestArr.splice(index, 1);
                return updatedTestArr;
            });
        }
    };

    useEffect(() => {
        if (open === true) {
            setSession(sessions[0]?.id)
        }
    }, [open])
    return (
        <div>
            <Dialog maxWidth='xs' sx={{ m: 0, p: 0 }} fullWidth={true} open={open} onClose={handleClose} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Add Test Pattern <CloseIcon style={{ color: "#000", cursor: "pointer", fontSize: "22px", fontWeight: "bolder" }} onClick={handleClose} /></DialogTitle>
                <Divider />
                <DialogContent sx={{ m: 0, p: 2, pl: 4, pr: 4 }} >
                    <form  >
                        <Stack spacing={2} direction={'column'} >
                            <FormControl variant="standard" sx={{ width: '25%' }}>
                                <FormLabel>Session*</FormLabel>
                                <Select
                                    labelId="gender-simple-select-standard-label"
                                    id="gender-simple-select-standard"
                                    value={session}
                                    onChange={(e) => { setSession(e.target.value) }}
                                    label="Session"
                                >
                                    {sessions.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <Stack direction={'row'}>
                                <Stack style={{ width: "100%" }} >
                                    <FormLabel>Test Pattern name*</FormLabel>
                                    <Input value={testName} onChange={e => {
                                        let arr = e.target.value
                                        setTestName(arr)
                                    }} />
                                </Stack>
                            </Stack>
                            <Stack>
                                <FormLabel>Test 1*</FormLabel>
                                <Input value={testArr[0]} required onChange={e => {
                                    let arr = [...testArr]
                                    arr[0] = e.target.value
                                    setTestArr(arr)
                                }} />
                            </Stack>

                            {formcount.map((item, index) => {
                                if (index === 0) {
                                    return null;
                                } else {
                                    return (
                                        <Stack key={index} spacing={2} direction={'row'} mt={2}>
                                            <Stack style={{ width: "100%" }}>
                                                <FormLabel>Test {index + 1}*</FormLabel>
                                                <Input
                                                    value={testArr[index]}
                                                    required
                                                    onChange={e => {
                                                        let arr = [...testArr];
                                                        arr[index] = e.target.value;
                                                        setTestArr(arr);
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

                        </Stack>
                        <Button
                            color="info"
                            sx={{ width: 'max-content', mt: 2 }}
                            onClick={incrementFormInput}
                        >
                            + Add More Test
                        </Button>

                        <Typography color='red' textAlign={'center'}>{errorMsg}</Typography>
                    </form>
                </DialogContent>
                {loading ? <Loader /> : <Button variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={addTest} >Add Test</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
