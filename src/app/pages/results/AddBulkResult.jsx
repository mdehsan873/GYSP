import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormLabel, Stack, TextField, Input, Typography } from '@mui/material';
import Loader from '../../components/Loader';
import { useEffect, useState } from 'react';
import AxiosObj from '../../axios/AxiosObj';
import DownloadIcon from '@mui/icons-material/Download';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useSelector } from 'react-redux';
import { Select } from '@mui/material';
import { MenuItem } from '@mui/material';
import secureLocalStorage from "react-secure-storage";
import { FormControl } from '@mui/material';
import { toast } from 'react-toastify';

export default function AddBulkItemDialog({ open, setOpen }) {

    const { classAndSection, sessions } = useSelector(state => state.infra)

    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState()
    const [errorMsg, setErrorMsg] = useState('')
    const [isChange, setIsChange] = useState(false)

    // Open ask class
    const [openFilter, setOpenFilter] = useState(false)

    // Field
    const [testPattern, setTestPattern] = useState([])
    const [testPatternID, setTestPatternID] = useState('')
    const [testID, setTestID] = useState('')
    const [seclectedClassItemID, setSeclectedClassItemID] = useState('')
    const [seclectedSessionID, setSeclectedSessionID] = useState(0)
    const [maxDayAttandence, setMaxDayAttandence] = useState('')

    const [testPatternFilterRAW, setTestPatternFilterRAW] = useState([]);
    const [testFilterRAW, setTestFilterRAW] = useState([]);
    const [classFilterRAW, setClassFilterRAW] = useState([]);
    const [classSectionArray, setClassSectionArray] = useState([]);

    const handleClose = () => {
        setTestPattern([]);
        setTestID('');
        setTestPatternID('');
        setSeclectedClassItemID('');
        setSeclectedSessionID('');
        setMaxDayAttandence('');
        setErrorMsg('');
        setIsChange(false);
        setOpen(false);
    };

    useEffect(() => {
        setSeclectedSessionID(sessions[0]?.id)
        const foundItem2 = sessions.find(item => item.id == sessions[0]?.id);
        let filteredClass = classAndSection.filter((cc) => {
            const classMatch = foundItem2?.name === '' || cc.session_name === sessions[0]?.name;
            return classMatch;
        });
        setClassSectionArray(filteredClass);

        let filteredTestPat = testPatternFilterRAW.filter((tp) => {
            const testpMatch = foundItem2?.name === '' || (tp.tests.length > 0 && tp.tests[0].session_name == sessions[0]?.name);
            return testpMatch;
        });
        setTestPattern(filteredTestPat);

    }, [sessions, open]);

    const handleFilterClose = () => {
        setErrorMsg('');
        setOpenFilter(false);
    };

    const handleFileUpload = async () => {
        if (seclectedClassItemID == "" || seclectedSessionID == "" || testID == "" || file == "" || file == undefined) {
            toast.error("Select required fields")
            setErrorMsg("Select required fields")
            return;
        }

        const foundItem = classAndSection.find(item => item.id === seclectedClassItemID);
        if (foundItem) {
            setLoading(true)
            let data = new FormData();
            data.append('file', file);
            data.append('test_id', testID);
            data.append('session_id', seclectedSessionID);
            data.append('section_id', foundItem.section_id);
            data.append('class_id', foundItem.class_id);
            let config = {
                method: 'POST',
                maxBodyLength: Infinity,
                url: "result/upload/result/",
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),
                    accept: 'application/json'
                },
                data: data,
                responseType: 'blob'
            };

            AxiosObj.request(config)
                .then((response) => {
                    if (response.data?.Success) {
                        toast.success(response.data?.Data[0] || "Result has been uploaded");
                        // Reload the window after 2 seconds
                        if (secureLocalStorage.getItem("testPatternFilterRAW")) {
                            secureLocalStorage.removeItem("testPatternFilterRAW")
                        }
                        if (secureLocalStorage.getItem("countResult")) {
                            secureLocalStorage.removeItem("countResult")
                        }
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else {
                        try {
                            response.data?.Data.map(item => (
                                toast.error(item || "Something went wrong...!")
                            ))
                        } catch (e) {
                            toast.error(e.response.data?.Data || "Something went wrong...!")
                            setErrorMsg(e.response.data?.Data || "Something went wrong...!")
                        }
                    }
                }).catch((e) => {
                    console.log(e)
                    try {
                        e.response.data?.Data.map(item => (
                            toast.error(item || "Something went wrong...!")
                        ))
                    } catch (e) {
                        toast.error(e.response.data?.Data || "Something went wrong...!")
                        setErrorMsg(e.response.data?.Data || "Something went wrong...!")
                    }
                }).finally(() => { setLoading(false) })
        } else {
            toast.error("Something went wrong")
            setErrorMsg("Something went wrong")
        }
    }

    useEffect(() => {
        const foundItem2 = sessions.find(item => item.id === seclectedSessionID);
        let filteredClass = classAndSection.filter((cc) => {
            const classMatch =true;
            return classMatch;
        });
        setClassSectionArray(filteredClass);
        let filteredTestPat = testPatternFilterRAW.filter((tp) => {
            const testpMatch =
                foundItem2?.name === '' ||
                (tp.tests.length > 0 && tp.tests.some((test) => test.session_name === foundItem2?.name));
            return testpMatch;
        });
        setTestPattern(filteredTestPat);

    }, [seclectedSessionID, testPatternFilterRAW, sessions]);

    useEffect(() => {
        const foundItem2 = sessions.find((item) => item.id === seclectedSessionID);
        const filteredTest = testPatternFilterRAW.filter((tp) => {
            const testpMatch =
                (testPatternID === "" || tp.test_pattern_id === testPatternID) &&
                tp.tests.some((test) => test.session_name === foundItem2?.name);
            return testpMatch;
        });

        setTestFilterRAW(filteredTest);
    }, [testPatternID]);

    const handleFile = (e) => {
        if (e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const fileSize = selectedFile.size / 1024 / 1024; // File size in MB

            if (fileSize <= 500) {
                const allowedExtensions = ['.xlsx', '.xls', '.csv'];
                const fileExtension = selectedFile.name.split('.').pop();

                if (allowedExtensions.includes(`.${fileExtension}`)) {
                    const selectedImage = e.target.files[0];
                    setFile(selectedImage);
                    setIsChange(true);
                    setErrorMsg('');
                } else {
                    toast.error("File should be an Excel file");
                    setErrorMsg("File should be an Excel file");
                }
            } else {
                toast.error("File size should not exceed 500 MB");
                setErrorMsg("File size should not exceed 500 MB");
            }
        }
    };
    const capitalizeWords = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };


    const askBox = (e) => {
        setOpenFilter(true)
    }

    const getCSV = () => {
        if (seclectedClassItemID == "" || seclectedSessionID == "" || testID == "" || maxDayAttandence == "") {
            toast.error("Select required fields")
            setErrorMsg("Select required fields")
            return;
        }
        if (maxDayAttandence == 0 ) {
            toast.error("Max days of attendance should not be '0'")
            setErrorMsg("Max days of attendance should not be '0'")
            return;
        }

        const foundItem = classAndSection.find(item => item.id === seclectedClassItemID);
        const foundItem2 = testPattern.flatMap((item) => item.tests).find((itemTest) => itemTest.test_id === testID);
        if (foundItem && foundItem2) {
            let data = undefined;
            let config = {
                method: 'GET',
                maxBodyLength: Infinity,
                url: 'result/get/result/template/?session_id=' + seclectedSessionID + '&section_id=' + foundItem.section_id + '&class_id=' + foundItem.class_id + '&test_id=' + testID + '&test_name=' + foundItem2.test + '&max_day_of_attendence=' + maxDayAttandence,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                },
                data: data,
                responseType: 'blob' // Set the responseType to 'blob' to receive binary data
            };

            AxiosObj.request(config)
                .then((response) => {
                    const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
                    const downloadLink = document.createElement('a');
                    downloadLink.href = URL.createObjectURL(blob);
                    downloadLink.download = 'resultSample.xlsx';
                    downloadLink.click();
                    handleFilterClose()
                }).catch((e) => {
                    console.log(e)
                    try {
                        e.response.data?.data.map(item => (
                            toast.error(item || "Something went wrong...!")
                        ))
                    } catch (e) {
                        toast.error(e.response.data?.data || "Something went wrong...!")
                        setErrorMsg(e.response.data?.data || "Something went wrong...!")
                    }
                }).finally(() => { setLoading(false) })
        } else {
            toast.error("Something went wrong")
            setErrorMsg("Something went wrong")
        }
    }

    useEffect(() => {
        // setClassFilterRAW([...classAndSection]);
        // setClassSectionArray([...classAndSection]);
    }, [classAndSection]);

    useEffect(() => {
        if (open === true) {
            let config2 = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'result/get/testpattern/',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                },
            };
            AxiosObj.request(config2).then((res) => { setTestPatternFilterRAW(res?.data?.Data); }).catch((e) => console.log(e)).finally();
        }
    }, [open])


    const handleKey = (e) => {
        const { name, value } = e.target;

        setIsChange(true);

        // Check if the pressed key is a backspace, delete, or arrow key
        if (e.key === 'Backspace' || e.key === 'Delete' || e.key.includes('Arrow')) {
            // Allow these keys
            return;
        }

        if (!/^\d$/.test(e.key)) {
            // If the pressed key is not a digit, prevent typing
            e.preventDefault();
            return;
        }

        if (value.length > 2) {
            // Prevent typing if input length is more than 3
            e.preventDefault();
        }
    };




    const SelectTestPattern = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="test-simple-select-standard-label"
                    id="test-simple-select-standard"
                    value={testPatternID}
                    onChange={(e) => {
                        setTestPatternID(e.target.value)
                        setTestID()
                    }}
                    label="Test"
                >
                    {testPattern.map((item) => (
                        <MenuItem key={item.test_pattern_id} value={item.test_pattern_id}>
                            {capitalizeWords(item.name)}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        )
    }

    const SelectTest = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="test-simple-select-standard-label"
                    id="test-simple-select-standard"
                    value={testID}
                    onChange={(e) => { setTestID(e.target.value) }}
                    label="Test"
                >
                    {testFilterRAW.map((item) =>
                        item.tests.sort((a, b) => a.test_id - b.test_id).map((itemTest) => (
                            <MenuItem key={itemTest.test_id} value={itemTest.test_id}>
                                {(itemTest.test).toUpperCase()}
                            </MenuItem>
                        ))
                    )}
                </Select>
            </FormControl>
        )
    }

    const SelectClass = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="classSection-simple-select-standard-label"
                    id="classSection-simple-select-standard"
                    value={seclectedClassItemID}
                    onChange={(e) => {
                        setSeclectedClassItemID(e.target.value)
                    }}
                    label="classSection"
                >
                    {classSectionArray.map(item => <MenuItem key={item.id} value={item.id}>{(item.class_name + " " + item.section_name).toUpperCase()}</MenuItem>)}
                </Select>
            </FormControl>
        )
    }

    const SelectSession = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="classSection-simple-select-standard-label"
                    id="classSection-simple-select-standard"
                    value={seclectedSessionID}
                    onChange={(e) => {
                        setSeclectedSessionID(e.target.value)
                        setTestPatternID()
                        setTestID()
                        setSeclectedClassItemID()
                    }}
                    label="classSection"
                >
                    {sessions.map(item => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                </Select>
            </FormControl>
        )
    }
    return (
        <div>
            <Dialog maxWidth='xs' fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' >Upload Result</DialogTitle>
                <DialogContent >
                    <form method='post' encType='multipart/form-data'>
                        <Stack margin={2}>
                            <FormLabel>Upload Result Excel file</FormLabel>
                            <TextField type={'file'} onChange={handleFile} />
                        </Stack>
                        <Stack margin={2}>
                            <FormLabel>Session*</FormLabel>
                            <SelectSession />
                        </Stack>
                        <Stack margin={2}>
                            <FormLabel>Test Pattern*</FormLabel>
                            <SelectTestPattern />
                        </Stack>
                        <Stack margin={2}>
                            <FormLabel>Test*</FormLabel>
                            <SelectTest />
                        </Stack>
                        <Stack margin={2}>
                            <FormLabel>Class*</FormLabel>
                            <SelectClass />
                        </Stack>

                    </form>
                </DialogContent>
                <Typography color='red' textAlign={'center'}>{errorMsg}</Typography>
                {loading ? <Loader /> : <Button disabled={!isChange} startIcon={<FileUploadIcon />} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={handleFileUpload} >Upload Results</Button>}
                <Button startIcon={<DownloadIcon />} onClick={() => { askBox() }} variant='outlined' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', marginTop: 2 }} >Download Sample Result Excel file</Button>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog maxWidth='sm' fullWidth open={openFilter} onClose={handleFilterClose} >
                <DialogTitle variant='h5' >Download Sample Excel</DialogTitle>
                <DialogContent >
                    <form method='post' encType='multipart/form-data'>
                        <Stack margin={2}>
                            <FormLabel>Session*</FormLabel>
                            <SelectSession />
                        </Stack>
                        <Stack margin={2}>
                            <FormLabel>Test Pattern*</FormLabel>
                            <SelectTestPattern />
                        </Stack>
                        <Stack margin={2}>
                            <FormLabel>Test*</FormLabel>
                            <SelectTest />
                        </Stack>
                        <Stack margin={2}>
                            <FormLabel>Class*</FormLabel>
                            <SelectClass />
                        </Stack>
                        <Stack margin={2}>
                            <FormLabel>Max Day Attandance*</FormLabel>
                            <Input value={maxDayAttandence} onChange={e => setMaxDayAttandence(e.target.value)} onKeyDown={(e) => { handleKey(e) }} />
                        </Stack>
                    </form>
                </DialogContent>
                <Typography color='red' textAlign={'center'}>{errorMsg}</Typography>
                <Button variant='outlined' color='warning' onClick={() => { getCSV() }} sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', marginTop: 2 }} >Download</Button>
                <DialogActions>
                    <Button onClick={handleFilterClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
