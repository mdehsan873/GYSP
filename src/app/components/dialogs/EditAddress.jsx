import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Loader from '../Loader';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import { getAxiosWithToken } from "../../axios/AxiosObj";
import { toast } from 'react-toastify';
import { FormLabel, Stack, Typography, Input } from '@mui/material'
import secureLocalStorage from "react-secure-storage";

export default function EditAddress({ open, setOpen, data }) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isChange, setIsChange] = useState(false);
    const [apiEndPoint, setApiEndPoint] = useState('');

    // inputs
    const [address1Details, setAddress1Details] = useState('');
    const [address1Value, setAddress1Value] = useState('');

    const [address2Details, setAddress2Details] = useState('');
    const [address2Value, setAddress2Value] = useState('');

    const [cityDetails, setCityDetails] = useState('');
    const [cityValue, setCityValue] = useState('');

    const [stateDetails, setStateDetails] = useState('');
    const [stateValue, setStateValue] = useState('');

    const [countryDetails, setCountryDetails] = useState('');
    const [countryValue, setCountryValue] = useState('');

    const [pincodeDetails, setPincodeDetails] = useState('');
    const [pincodeValue, setPincodeValue] = useState('');


    const handleClose = () => {
        setIsChange(false);
        setLoading(false);
        setErrorMsg('');
        setApiEndPoint('');
        setAddress1Details('');
        setAddress1Value('');
        setAddress2Details('');
        setAddress2Value('');
        setCityDetails('');
        setCityValue('');
        setStateDetails('');
        setStateValue('');
        setCountryDetails('');
        setCountryValue('');
        setPincodeDetails('');
        setPincodeValue('');
        setOpen(false);
        setIsChange(false);
    };

    const editDetailsBTN = async () => {

        if (address1Value === "" || cityValue === "" || countryValue === "" || stateValue === "") {
            toast.error("Fill the reqiured field");
            setErrorMsg('Fill the reqiured field')
            return;
        }

        if (pincodeDetails.name === "pincode" || pincodeDetails.name === "pin") {
            if (pincodeValue.length !== 6) {
                toast.error("Enter a vaild pin code");
                setErrorMsg('Enter a vaild pin code')
                return null;
            }
        }
        setLoading(true);
        let data = new FormData();
        data.append("address_line1", address1Value);
        data.append("address_line2", address2Value);
        data.append("city", cityValue);
        data.append("state", stateValue);
        data.append("country", countryValue);
        data.append("pincode", pincodeValue);

        let config = {
            method: 'Patch',
            maxBodyLength: Infinity,
            url: apiEndPoint,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),
                accept: 'application/json'
            },
            data: data
        };

        const AxiosObj = getAxiosWithToken();

        AxiosObj.request(config)
            .then((response) => {
                if (response.data?.Success) {
                    if (secureLocalStorage.getItem("rStudentDetails")) {
                        secureLocalStorage.removeItem("rStudentDetails")
                    }
                    try {
                        response.data?.Data.map((item) => toast.success(item || 'Details have been updated'));
                    } catch (ee) {
                        toast.success(response.data?.Data || 'Something went wrong...!');
                    }
                    // Reload the window after 2 seconds
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    toast.error(response.data?.Data || 'Something went wrong...!');
                }
            })
            .catch((e) => {
                try {
                    e.response.data?.Data.map((item) => toast.error(item || 'Something went wrong...!'));
                } catch (ee) {
                    toast.error(e.response.data?.Data || 'Something went wrong...!');
                }
            })
            .finally(() => setLoading(false));
    };

    const handleChangeValue = (e) => {
        setIsChange(true);
        const { name, value } = e.target;

        if (name === "address_line1") {
            setAddress1Value(value);
        }
        if (name === "address_line2") {
            setAddress2Value(value);
        }
        if (name === "city") {
            setCityValue(value);
        }
        if (name === "state") {
            setStateValue(value);
        }
        if (name === "country") {
            setCountryValue(value);
        }
        if (name === "pincode" || name === "pin") {
            if (value.length >= 7) {
                return null;
            }
            setPincodeValue(value);
        }
    };

    const buttonRef = useRef(null);
    useEffect(() => {
        if (open && open === true) {
            setApiEndPoint(data.apiEndPoint);
            setAddress1Details(data.addressData.address1)
            setAddress1Value(data.addressData.address1.value)
            setAddress2Details(data.addressData.address2)
            setAddress2Value(data.addressData.address2.value)
            setCityDetails(data.addressData.city)
            setCityValue(data.addressData.city.value)
            setStateDetails(data.addressData.state)
            setStateValue(data.addressData.state.value)
            setCountryDetails(data.addressData.country)
            setCountryValue(data.addressData.country.value)
            setPincodeDetails(data.addressData.pincode)
            setPincodeValue(data.addressData.pincode.value)
        }
    }, [open, data]);


    const handleKey = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            buttonRef.current.click();
        }
        const { name, value } = e.target;
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];

        // Block numbers for text input, except for specific fields
        const allowedTextFields = ["state", "city", "country"];

        // if (/^[0-9]+$/.test(e.key) && !allowedTextFields.includes(fieldValue)) {
        if (allowedTextFields.includes(name)) {
            if (/^[0-9]+$/.test(e.key)) {
                e.preventDefault();
            }
        }

        if (name == "pincode") {
            if (!/^[0-9]+$/.test(e.key) && !allowedKeys.includes(e.key)) {
                e.preventDefault();
            }
            if (value.length >= 6 && !allowedKeys.includes(e.key)) {
                e.preventDefault();
            }
        }

    };

    return (
        <div>
            <Dialog fullWidth open={open} onClose={handleClose}>
                <DialogTitle variant="h5" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Update Address Details
                </DialogTitle>
                <DialogContent>
                    <form style={{ textAlign: 'center' }}>
                        <Stack fullwidth="true" mb={2}>
                            <FormLabel style={{ textAlign: 'left' }}>{address1Details.label || 'Label'}</FormLabel>
                            <Input type={address1Details.type} value={address1Value} name={address1Details.name} onKeyDown={(e) => { handleKey(e) }} onChange={handleChangeValue} />
                        </Stack>
                        <Stack fullwidth="true" mb={2}>
                            <FormLabel style={{ textAlign: 'left' }}>{address2Details.label || 'Label'}</FormLabel>
                            <Input type={address2Details.type} value={address2Value} name={address2Details.name} onKeyDown={(e) => { handleKey(e) }} onChange={handleChangeValue} />
                        </Stack>
                        <Stack fullwidth="true" mb={2}>
                            <FormLabel style={{ textAlign: 'left' }}>{cityDetails.label || 'Label'}</FormLabel>
                            <Input type={cityDetails.type} value={cityValue} name={cityDetails.name} onKeyDown={(e) => { handleKey(e) }} onChange={handleChangeValue} />
                        </Stack>
                        <Stack fullwidth="true" mb={2}>
                            <FormLabel style={{ textAlign: 'left' }}>{stateDetails.label || 'Label'}</FormLabel>
                            <Input type={stateDetails.type} value={stateValue} name={stateDetails.name} onKeyDown={(e) => { handleKey(e) }} onChange={handleChangeValue} />
                        </Stack>
                        <Stack fullwidth="true" mb={2}>
                            <FormLabel style={{ textAlign: 'left' }}>{countryDetails.label || 'Label'}</FormLabel>
                            <Input type={countryDetails.type} value={countryValue} name={countryDetails.name} onKeyDown={(e) => { handleKey(e) }} onChange={handleChangeValue} />
                        </Stack>
                        <Stack fullwidth="true" mb={2}>
                            <FormLabel style={{ textAlign: 'left' }}>{pincodeDetails.label || 'Label'}</FormLabel>
                            <Input type={"number"} value={pincodeValue} name={pincodeDetails.name} onKeyDown={(e) => { handleKey(e) }} onChange={handleChangeValue} />
                        </Stack>
                    </form>
                </DialogContent>
                <Typography color="red" textAlign="center">
                    {errorMsg !== '' ? errorMsg : null}
                </Typography>
                {loading ? (
                    <Loader />
                ) : (
                    <Button
                        disabled={!isChange}
                        variant="contained"
                        color="warning"
                        sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content' }}
                        onClick={editDetailsBTN}
                        ref={buttonRef}
                    >
                        Update
                    </Button>
                )}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
