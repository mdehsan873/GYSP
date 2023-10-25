import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import Loader from '../../components/Loader';
import { useState, useEffect } from 'react';
import AxiosObj from '../../axios/AxiosObj';
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import secureLocalStorage from "react-secure-storage";
import { Stack, Typography } from '@mui/material'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../userApp/getCroppedImg'

export default function EditImageBox({ open, setOpen, data }) {

    const [loading, setLoading] = useState(false)

    const [eventId, setEventID] = useState('')
    const [studentId, setStudentID] = useState('')
    const [imgurl, setImgurl] = useState('')
    const [studentName, setStudentName] = useState('')
    const [media, setMedia] = useState('')
    const [imageType, setImageType] = useState('')

    const [openBox2, setOpenBox2] = useState(false);
    const [errorMsg, setErrorMsg] = useState('')
    const [isChange, setIsChange] = useState(false)
    const capitalizeWords = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handleClose = () => {
        setEventID('')
        setStudentID('')
        setMedia('')
        setImgurl('')
        setErrorMsg('')
        setOpen(false);
        setIsChange(false)
    };
    const handleClose2 = () => {
        setOpenBox2(false);
    };

    const updatedStudentImage = (e) => {
        e.preventDefault();
        if (!media || media === '') {
            toast.error("Select the image first");
            setErrorMsg("Select the image first");
            return false;
        }

        setLoading(true)
        let data = new FormData()
        data.append('event_id', eventId)
        data.append('student_id', studentId)
        if (imageType == "image1") {
            data.append('image1', media)
        } else {
            data.append('image2', media)
        }

        const config = {
            method: 'patch',
            maxBodyLength: Infinity,
            url: 'event/add/event/student/image/',
            headers: {
                "Content-Type": "multipart/form-data",
                accept: 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),
            },
            data: data
        };

        AxiosObj.request(config)
            .then((response) => {
                if (response.data?.Success) {
                    toast.success(response.data?.Data[0] || "Student Image has been updated");
                    // Reload the window after 2 seconds
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    toast.error(response.data?.data || "Something went wrong...!");
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
            .finally()

    }

    const handleImageChange = (event) => {
        if (event.target.files[0]) {
            if (event.target.files[0].size <= 2097152) {
                if (event.target.files[0].type.includes('image')) {
                    const selectedImage = event.target.files[0];
                    const imageUrl = URL.createObjectURL(selectedImage);
                    setMedia(imageUrl)
                    setImgurl(imageUrl);
                    setOpenCrop(true)
                    setIsChange(true)
                } else {
                    toast.error("File should be a image");
                    setErrorMsg("File should be a image");
                }
            } else {
                toast.error("Image Should be not more than 2 MB");
                setErrorMsg("Image Should be not more than 2 MB");
            }
        }
    }

    useEffect(() => {
        if (open && open === true) {
            setEventID(data.eid)
            setStudentID(data.sid)
            setImgurl(data.imgurl)
            setStudentName(data.studentName)
            setImageType(data.imageType)
        }
    }, [open, data])

    const handleDeleteSelectedRowsRqt2 = () => {
        setOpenBox2(true)
    }
    const handleDeleteSelectedRowsRqt = () => {
        setLoading(true)

        // Parse the JSON string into an object
        let data = JSON.parse(`{
            "event_id": "${eventId}",
            "student_id": "${studentId}",
            "image1": false,
            "image2": false
        }`);

        if (imageType === 'image2') {
            data.image2 = true;
        }
        if (imageType === 'image1') {
            data.image1 = true;
        }

        // Stringify the updated object back to JSON if needed
        data = JSON.stringify(data);

        let config = {
            method: 'DELETE',
            maxBodyLength: Infinity,
            url: `event/delete/event/student/image/`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),
            },
            data
        };

        AxiosObj.request(config)
            .then((response) => {
                if (response.data?.Success) {
                    toast.success(response.data?.Data[0] || "Event Image has been deleted");
                    // Reload the window after 2 seconds
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    toast.error(response.data?.data || "Something went wrong...!");
                }
            })
            .catch((e) => {
                try {
                    e.response.data?.Data.map((item) => {
                        toast.error(item || "Something went wrong...!");
                    });
                } catch (ee) {
                    toast.error(e.response.data?.Data || "Something went wrong...!");
                }
            })
            .finally(() => setLoading(false));
    }


    const [openCrop, setOpenCrop] = useState(false)

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)

    const handleCloseCrop = () => {
        setOpenCrop(false)
    }

    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }

    const cropImage = async () => {
        try {
            const croppedImage = await getCroppedImg(
                media,
                croppedAreaPixels,
                rotation
            )
            // Convert the cropped image to a Blob
            const blob = await fetch(croppedImage).then((res) => res.blob());

            // Create a File object from the Blob
            const file = new File([blob], 'croppedImage.jpg', { type: 'image/jpeg' });

            setCroppedImage(croppedImage)
            setMedia(file);
            // setImage(croppedImage);
            setOpenCrop(false)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div>
            <Dialog fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Update Student Event Image
                    {data?.imgurl !== null ? (<Stack style={{ margin: '0px 12px' }}>
                        <Button
                            color="primary"
                            variant="outlined"
                            style={{ border: '0', textAlign: 'center', margin: '0' }}
                            onClick={handleDeleteSelectedRowsRqt2}
                        >
                            <DeleteIcon style={{ margin: '0' }} />
                        </Button>
                    </Stack>) : (null)}
                </DialogTitle>
                <DialogContent >
                    <form style={{ textAlign: "center" }} >
                        <DialogTitle variant='h6' mb={2} style={{ padding: "10px 0px", display: "flex", justifyContent: "space-between" }} >Student Name: {studentName}</DialogTitle>
                        {imgurl === null ? (<img style={{ height: "250px", width: "300px", }} src={require('../../assets/Logo/noimage.png')} alt="" />) : (<img src={imgurl} style={{ height: "250px", width: "300px", }} alt="" />)}
                        <br />
                        <br />
                        <Button
                            variant="contained"
                            component="label"
                        >
                            Upload File
                            <input
                                type="file"
                                hidden
                                name="imgInput"
                                id="fileInputImg"
                                onChange={handleImageChange}
                                accept="image/png, image/jpeg, image/jpg"
                            />
                        </Button>
                    </form>
                </DialogContent>
                <Typography color={'red'} textAlign={'center'}>{errorMsg !== '' ? errorMsg : null}</Typography>
                {loading ? <Loader /> : <Button disabled={!isChange} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={updatedStudentImage} >Update</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openBox2}
                onClose={handleClose2}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle textAlign={"center"} id="alert-dialog-title">{"Delete Alert"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Are you sure want to delete?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Disagree</Button>
                    <Button onClick={handleDeleteSelectedRowsRqt} autoFocus>Agree</Button>
                </DialogActions>
            </Dialog>

            <Dialog fullWidth open={openCrop} onClose={handleCloseCrop} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Crop Image</DialogTitle>
                <DialogContent >
                    <Stack sx={{ position: 'relative', width: '50%', height: "180px", margin: "auto" }}>
                        <Cropper
                            image={media}
                            crop={crop}
                            rotation={rotation}
                            zoom={zoom}
                            aspect={3 / 2}
                            onCropChange={setCrop}
                            onRotationChange={setRotation}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </Stack>
                    <Stack sx={{ marginTop: "10px" }}>
                        {loading ? <Loader /> : <Button variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={cropImage} >Crop</Button>}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCrop}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
