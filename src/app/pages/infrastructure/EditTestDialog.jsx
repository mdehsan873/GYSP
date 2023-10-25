import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Divider, Typography, FormLabel, Input, MenuItem, Select, Stack, FormControl } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AlertDialog from '../../components/dialogs/confimationBoxTest';
import secureLocalStorage from "react-secure-storage";
import AxiosObj from '../../axios/AxiosObj';
import Loader from '../../components/Loader';

export default function AddTestDialog({ open, setOpen, data }) {
    const { sessions } = useSelector(state => state.infra);

    const capitalizeWords = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const [testArr, setTestArr] = useState(['',]);
    const [testPatternID, setTestPatternID] = useState('');

    const [session, setSession] = useState('');
    const [testName, setTestName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const [formcount, setFormcount] = useState([1,]);
    const [prevTestName, setPrevTestName] = useState('');

    const [loading, setLoading] = useState(false);
    const [isChange, setIsChange] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
    const [deleteData, setDeleteData] = useState('');
    const [deletedTests, setDeletedTests] = useState([]);

    const handleClose = () => {
        setFormcount([1,]);
        setTestArr(['',]);
        setTestName('');
        setSession('');
        setErrorMsg('');
        setTestPatternID('');
        setOpen(false);
        setLoading(false);
        setIsChange(false);
    };

    const handleDeleteOpen = () => {
        setOpenDeleteAlert(true);
        setDeleteData({
            testPatternID: testPatternID,
            testArr: testArr,
        });
    };

    const addTest = async () => {
        let testPatherError = false;
        let testPatherErrorMSG;
        let testError = false;
        let testErrorMSG = 1;
        if (session === '' || session === undefined) {
            toast.error('Please select the session');
            setErrorMsg('Please select the session');
            return;
        }
        for (let i = 0; i < testArr.length; i++) {
            if (testArr[i]?.test.trim() === "") {
                setErrorMsg('Sub Test name should not be empty');

                toast.error('Sub Test name should not be empty');
                return false;
            }
        }
        if (testName === '' || testName === undefined) {
            toast.error('Fill required field');
            setErrorMsg('Fill required field');
            return false;
        }

        setLoading(true);

        const updateTest = async () => {
            try {
                let data = JSON.stringify({
                    name: testName,
                });
                let testtConfig = {
                    method: 'PATCH',
                    maxBodyLength: Infinity,
                    url: `result/edit/test/pattern/${testPatternID}/`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),  
                    },
                    data: data
                };
                const response = await AxiosObj.request(testtConfig)

                if (response.data?.Success) {
                    if (secureLocalStorage.getItem("testPatternFilterRAW")) {
                        secureLocalStorage.removeItem("testPatternFilterRAW")
                    }
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                    // toast.success(
                    //     capitalizeWords(response.data?.Data[0]) ||
                    //     'Test Pattern has been updated'
                    // );
                    testPatherError = false
                    testArr.forEach((item, index) => {
                        if (item.test === '') {
                            setTestArr((prevArr) =>
                                prevArr.slice(0, index).concat(prevArr.slice(index + 1))
                            );
                        }
                    });
                }
            } catch (error) {
                testErrorMSG++;

                try {
                    // testPatherErrorMSG = error.response.data?.Data[0];
                    error.response.data?.Data.forEach((item) =>
                        toast.error(capitalizeWords(item) || 'Something went wrong...!')
                    );
                } catch (err) {
                    // testPatherErrorMSG = error.response.data?.Data;
                    toast.error(
                        error.response.data?.Data || 'Something went wrong...!'
                    );
                }
                return false;
            }
        };

        const updateTestArr = async () => {
            testArr.forEach((item) => {
                if (item.test.trim() === "") {
                    toast.error('Sub Test name should not be empty');

                    testErrorMSG++;
                    return false;
                }
            });

            try {
                for (let index = 0; index < testArr.length; index++) {
                    const item = testArr[index];
                    if (item.isChanged) {
                        if (item.test_id) {
                            if (item.test !== '') {
                                const data2 = JSON.stringify({ test: item.test });
                                const testIDD = item.test_id;
                                const config = {
                                    method: 'patch',
                                    maxBodyLength: Infinity,
                                    url: `result/edit/test/${testIDD}/`,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),  
                                    },
                                    data: data2,
                                };

                                const response = await AxiosObj.request(config);

                                if (response.data?.Success) {
                                    if (secureLocalStorage.getItem("testPatternFilterRAW")) {
                                        secureLocalStorage.removeItem("testPatternFilterRAW")
                                    }
                                    setTimeout(() => {
                                        window.location.reload();
                                    }, 1500);
                                    // toast.success(
                                    //     capitalizeWords(response.data?.Data[0]) || 'Test has been updated'
                                    // );
                                }
                                if (!response.data?.Success) {
                                    testError = true;
                                    testErrorMSG++;
                                    toast.error(
                                        capitalizeWords(response.data?.Data[0]) || 'Something went wrong...!'
                                    );
                                    return false;
                                }
                            } else {
                                toast.error('Sub Test name should not be empty');
                                return false;
                            }
                        } else if (item.test !== '') {
                            if (item.test.trim() === "") {

                                testErrorMSG++;
                                toast.error('Sub Test name should not be empty');
                                return false;
                            }

                            const data2 = JSON.stringify({
                                test_pattern_id: testPatternID,
                                session_id: session,
                                test: [{ test_name: item.test.trim() }],
                            });

                            const config = {
                                method: 'post',
                                maxBodyLength: Infinity,
                                url: 'result/add/test/',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),  
                                },
                                data: data2,
                            };

                            const response = await AxiosObj.request(config);

                            if (!response.data?.Success) {
                                testErrorMSG++;
                                testError = true;
                                toast.error(response.data?.Data[0] || 'Something went wrong...!');
                                return false;
                            }
                            if (response.data?.Success) {
                                if (secureLocalStorage.getItem("testPatternFilterRAW")) {
                                    secureLocalStorage.removeItem("testPatternFilterRAW")
                                }
                                setTimeout(() => {
                                    window.location.reload();
                                }, 1500);
                                // toast.success(
                                //     capitalizeWords(response.data?.Data[0]) || 'Test has been added'
                                // );
                            }
                        }
                    }
                }
            } catch (error) {
                try {
                    error.response.data?.Data.forEach((item) =>
                        toast.error(item || 'Something went wrong...!')
                    );
                } catch (err) {
                    testErrorMSG++;
                    toast.error(
                        error.response.data?.Data || 'Something went wrong...!'
                    );
                }
                return false;
            }
        };

        const deleteTestsAPI = async () => {
            try {
                for (const deletedTest of deletedTests) {
                    const { test_id } = deletedTest;
                    const config = {
                        method: 'DELETE',
                        maxBodyLength: Infinity,
                        url: `result/edit/test/${test_id}/`,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),  
                        },
                        data: {},
                    };

                    const response = await AxiosObj.request(config);

                    if (response.data?.Success) {
                        // toast.success(
                        //     capitalizeWords(response.data?.Data[0]) || 'Test has been deleted'
                        // );
                        if (secureLocalStorage.getItem("testPatternFilterRAW")) {
                            secureLocalStorage.removeItem("testPatternFilterRAW")
                        }
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);

                    } else {
                        testError = true;
                        toast.error(
                            capitalizeWords(response.data?.Data[0]) || 'Something went wrong...!'
                        );
                        return false;
                    }
                }
            } catch (error) {
                testErrorMSG++;
                try {
                    testErrorMSG++;
                    error.response.data?.Data.forEach((item) =>
                        toast.error(item || 'Something went wrong...!')
                    );
                } catch (err) {
                    toast.error(error.response.data?.Data || 'Something went wrong...!');
                }
                return false;
            }
        };

        try {
            if (testName !== prevTestName) {
                await updateTest();
            }

            await updateTestArr();
            await deleteTestsAPI(); // Call the delete tests API after updating tests

            if (testErrorMSG === 1) {
                toast.success('Test Pattern has been updated');
            }


        } catch (error) {
            // Handle any additional error handling if needed
            console.log(error)
        } finally {
            setLoading(false);
            setIsChange(false);
        }
    };

    const deleteSubTest = (index) => {
        setIsChange(true);
        const deletedTest = testArr[index];
        if (deletedTest.test_id) {
            // If the test has a test_id, mark it as deleted
            setDeletedTests((prevDeletedTests) => [
                ...prevDeletedTests,
                { test_id: deletedTest.test_id, test_name: deletedTest.test },
            ]);
            setTestArr((prevArr) => prevArr.filter((item, idx) => idx !== index));
        } else {
            // If the test doesn't have a test_id, remove it from the array
            setTestArr((prevArr) => prevArr.filter((item, idx) => idx !== index));
        }
    };


    const handleChange = (e, index) => {
        const value = e.target.value; // Trim the value to remove leading/trailing whitespace
        setIsChange(true);
        setTestArr((prevArr) =>
            prevArr.map((item, i) =>
                i === index ? { ...item, test: value, isChanged: true } : item
            )
        );
    };

    useEffect(() => {
        if (data !== '') {
            setTestPatternID(data.id);
            setTestName(data.name);
            setPrevTestName(data.name);
            setTestArr(data.tests);

            if (data && data.tests && data.tests.length > 0) {
                const sessionName = data.tests[0]?.session_name;
                const foundItem2 = sessions.find((item) => item.name === sessionName);
                if (foundItem2) {
                    setSession(foundItem2.id);
                }
            }

            setTestArr((prevArr) =>
                prevArr ? prevArr.map((item) => ({ ...item, isChanged: false })) : []
            );
        }
    }, [data]);

    return (
        <div>
            <Dialog maxWidth={'xs'} sx={{ m: 0, p: 0, }} fullWidth={true} open={open} onClose={handleClose} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Edit Test Pattern <DeleteIcon style={{ color: "red", cursor: "pointer" }} onClick={() => handleDeleteOpen()} /></DialogTitle>
                <Divider />
                <DialogContent sx={{ m: 0, p: 2, pl: 4, pr: 4 }} >
                    <form  >
                        <Stack spacing={2} direction={'column'} >
                            <Stack style={{ width: "25%" }} sx={{ ml: 0 }}>
                                <FormControl variant="standard" sx={{ width: '100%' }}>
                                    <FormLabel>Session*</FormLabel>
                                    <Select
                                        labelId="gender-simple-select-standard-label"
                                        id="gender-simple-select-standard"
                                        value={session}
                                        onChange={(e) => {
                                            setSession(e.target.value)
                                            setIsChange(true)
                                        }}
                                        label="Session"
                                    >
                                        {sessions.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            </Stack>
                            <Stack direction={'row'}>
                                <Stack style={{ width: "100%" }} >
                                    <FormLabel>Test Pattern name*</FormLabel>
                                    <Input value={testName} onChange={e => {
                                        const newName = e.target.value;
                                        setIsChange(true)
                                        setPrevTestName(testName); // Store the previous test name
                                        setTestName(newName); // Update the test name with the new value
                                    }} />
                                </Stack>
                            </Stack>

                            {testArr && testArr.map((item, index) => (
                                <div key={index}>
                                    <Stack key={index} spacing={2} direction="row" style={{ alignItems: "center" }} mt={2}>
                                        <Stack style={{ width: "100%" }}>
                                            <FormLabel>Test {index + 1}</FormLabel>
                                            <Input
                                                placeholder="Sub-Test Name"
                                                value={item.test}
                                                onChange={(e) => handleChange(e, index)}
                                            />
                                        </Stack>
                                        <DeleteIcon style={{ color: "red", cursor: "pointer" }} onClick={() => deleteSubTest(index)} />
                                    </Stack>
                                </div>
                            ))}
                        </Stack>
                        <Button color="info" sx={{ width: 'max-content', mt: 2 }} onClick={() => {
                            // setIsChange(true);
                            setTestArr((prevArr) => [...prevArr, { test: '', isChanged: false }]);
                        }}>
                            + Add More Test
                        </Button>

                        <Typography color='red' textAlign={'center'}>{errorMsg}</Typography>
                    </form>

                </DialogContent>
                {loading ? <Loader /> : <Button disabled={!isChange} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={addTest} >Update</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <AlertDialog openBox={openDeleteAlert} setOpen={setOpenDeleteAlert} data={deleteData} />
        </div>
    );
}
