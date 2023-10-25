import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography } from '@mui/material';
import Loader from '../../components/Loader';
import { useState, useEffect } from 'react';
import { getAxiosWithToken } from "../../axios/AxiosObj";
import { toast } from 'react-toastify';
import secureLocalStorage from "react-secure-storage";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';


export default function EditSchoolLogo({ open, setOpen, data }) {

    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [image, setImage] = useState('')
    const [media, setMedia] = useState('')
    const [isChange, setIsChange] = useState(false)

    const handleClose = () => {
        setImage('');
        setMedia('');
        setIsChange(false);
        setLoading(false);
        setOpen(false);
    };

    const handleImageChange = (event) => {
        if (event.target.files[0]) {
            if (event.target.files[0].size <= 2097152) {
                if (event.target.files[0].type.includes('image')) {
                    const selectedImage = event.target.files[0];
                    const imageUrl = URL.createObjectURL(selectedImage);
                    setMedia(selectedImage)
                    setImage(imageUrl);
                    setIsChange(true)
                    setErrorMsg('')
                } else {
                    toast.error("File should be a image");
                    setErrorMsg("File should be a image");
                }
            } else {
                toast.error("Image should not be more than 2 MB");
                setErrorMsg("Image should not be more than 2 MB");
            }
        }
    }

    const addClass = async (e) => {

        e.preventDefault();
        if (!media || media === '') {
            toast.error("Select the image first");
            setErrorMsg("Select the image first");
        }
        setLoading(true)
        let data = new FormData()
        data.append('image', media)

        let config = {
            method: 'Patch',
            maxBodyLength: Infinity,
            url: 'school/upload/logo/',
            headers: {
                "Content-Type": "multipart/form-data",
                accept: 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),     
            },
            data: data
        };
        const AxiosObj = getAxiosWithToken();

        if (data.image !== "" && media) {

            AxiosObj.request(config)
                .then((response) => {
                    if (response.data?.Success) {
                        toast.success("Logo has been updated");

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
                    } catch (e) {
                        toast.error(e.response.data?.Data || "Something went wrong...!")
                    }
                })
                .finally(() => setLoading(false))
        } else {
            toast.error("Please, Select the image");
        }
    }

    useEffect(() => {
        if (open && open === true) {
            if (data.imgUrl !== null) {
                setImage(`https://cyber-tutor-x-backend.vercel.app/${data.imgUrl}`)
            } else {
                setImage(null)
            }

        }
    }, [open, data])


    return (
        <div>
            <Dialog fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Edit Logo </DialogTitle>
                <DialogContent >
                    <form style={{ textAlign: "center" }} >
                        <ImageListItem style={{ height: "250px", width: "300px", margin: "auto", border: "0.5px solid #00000087" }}>
                            {image ? (<img src={image} alt="" style={{ width: "100%", height:"auto" }} />) : (<img src={require("../../assets/Logo/noimage.png")} style={{ width: "100%", height:"auto" }} alt="" />)}
                            <ImageListItemBar
                                actionPosition='left'
                                sx={{ height: "80px" }}
                                className='MuiImageListItemBar-positionBelow'
                                actionIcon={
                                    <IconButton
                                        sx={{ color: 'rgba(255, 255, 255, 0.54)', marginLeft: "100px" }}
                                        aria-label={`info about `}
                                    >
                                        <Button component="label">
                                            <CameraAltOutlinedIcon style={{ color: "#fff", fontSize: "32px" }} />
                                            <input
                                                type="file"
                                                hidden
                                                name="imgInput"
                                                id="fileInputImg"
                                                onChange={handleImageChange}
                                                accept="image/png, image/jpeg, image/jpg"
                                            />
                                        </Button>
                                    </IconButton>
                                }
                            />
                        </ImageListItem>
                        <br />
                        <br />


                    </form>
                </DialogContent>
                <Typography color={'red'} textAlign={'center'}>{errorMsg !== '' ? errorMsg : null}</Typography>
                {loading ? <Loader /> : <Button disabled={!isChange} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={addClass} >Update</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
