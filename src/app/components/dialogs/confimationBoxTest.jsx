import * as React from 'react';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import AxiosObj from '../../axios/AxiosObj';
import { toast } from 'react-toastify';
import secureLocalStorage from "react-secure-storage";

export default function AlertDialog({ openBox, setOpen, data }) {
    const [openBox2, setOpenBox2] = useState(false);
    const [testArr, setTestArr] = useState([]);
    const [testPatternID, setTestPatternID] = useState('');
    const [loading, setLoading] = useState(false)

    const deleteItem = () => {
        handleClose()
        let data = undefined;
        testArr.map((item, index) => {
            let testIDD = testArr[index].test_id
            let config = {
                method: 'DELETE',
                maxBodyLength: Infinity,
                url: 'result/edit/test/' + testIDD + '/',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };
            AxiosObj.request(config)
                .then().catch().finally()
        });


        let config = {
            method: 'DELETE',
            maxBodyLength: Infinity,
            url: 'result/delete/test/pattern/' + testPatternID + '/',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),  
            },
            data: data
        };

        setTimeout(() => {
            AxiosObj.request(config)
                .then((response) => {
                    if (response.data?.Success) {
                        toast.success(response.data?.data || "Test Pattern has been delete");
                        if (secureLocalStorage.getItem("testPatternFilterRAW")) {
                            secureLocalStorage.removeItem("testPatternFilterRAW")
                        }
                        // Reload the window after 2 seconds
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    } else {
                        toast.error(response.data?.Data || "Something went wrong...!");
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
        }, 2000);

    }

    const handleClose = () => {
        setLoading(false)
        setTestArr([])
        setOpen(false);
        setTestPatternID('')
        setOpenBox2(false)
    };

    useEffect(() => {
        setOpenBox2(openBox)
        setTestArr(data?.testArr)
        setTestPatternID(data?.testPatternID)
    }, [data, openBox])

    return (
        <div>
            <Dialog
                open={openBox2}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle textAlign={"center"} id="alert-dialog-title">{"Delete Alert"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Are you sure want to delete?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={deleteItem} autoFocus>Agree</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}