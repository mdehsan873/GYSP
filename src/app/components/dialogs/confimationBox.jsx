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
    const [apiEndPoint, setApiEndPoint] = useState("");
    const [apiApiData, setApiApiData] = useState(undefined);

    const deleteItem = () => {
        let data = apiApiData;
        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: apiEndPoint,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),        
            },
            data: data
        };

        AxiosObj.request(config)
            .then((response) => {
                if (response.data?.Success) {
                    setTimeout(() => {

                        if (secureLocalStorage.getItem("rClassAndSection")) {
                            secureLocalStorage.removeItem("rClassAndSection")
                        }

                        if (secureLocalStorage.getItem("teacherRAWData")) {
                            secureLocalStorage.removeItem("teacherRAWData")
                        }
                        
                        if (secureLocalStorage.getItem("allSubjectRAWData")) {
                            secureLocalStorage.removeItem("allSubjectRAWData")
                        }
                        if (secureLocalStorage.getItem("eventRAWList")) {
                            secureLocalStorage.removeItem("eventRAWList")
                        }
                        if (secureLocalStorage.getItem("countEvent")) {
                            secureLocalStorage.removeItem("countEvent")
                        }
                        if (secureLocalStorage.getItem("resultRAWList")) {
                            secureLocalStorage.removeItem("resultRAWList")
                        }
                        if (secureLocalStorage.getItem("countResult")) {
                            secureLocalStorage.removeItem("countResult")
                        }


                        window.location.reload();
                    }, 1000);
                    try {
                        response.data?.Data.map(item => (
                            toast.success(item || "Data Deleted")
                        ))
                    } catch (es) {
                        toast.success(response.data?.Data || "Data Deleted")
                    }
                } else {
                    try {
                        response.data?.Data.map(item => (
                            toast.success(item || "Data not Deleted")
                        ))
                    } catch (es) {
                        toast.success(response.data?.Data || "Data not Deleted")
                    }
                }
            })
            .catch(e => {
                try {
                    e.response.data?.Data.map(item => (
                        toast.error(item || "Something went wrong...!")
                    ))
                } catch (err) {
                    toast.error(e.response.data?.Data || "Something went wrong...!")
                }
            })
            .finally(setOpen(false))
    }

    const handleClose = () => {
        setOpenBox2(false)
        setApiEndPoint('')
        setOpen(false);
    };

    useEffect(() => {
        setOpenBox2(openBox)
        setApiEndPoint(data?.apiEndPoint)
        setApiApiData(data?.apiData)
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