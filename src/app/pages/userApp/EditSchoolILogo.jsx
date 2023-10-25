import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Typography, Stack } from '@mui/material';
import Loader from '../../components/Loader';
import { useState, useEffect } from 'react';
import { getAxiosWithToken } from "../../axios/AxiosObj";
import { toast } from 'react-toastify';
import secureLocalStorage from "react-secure-storage";
import Cropper from 'react-easy-crop'
import getCroppedImg from './getCroppedImg'
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';

export default function EditSchoolLogo({ open, setOpen, data }) {

    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [image, setImage] = useState('')
    const [media, setMedia] = useState('')
    const [apiUrl, setApiUrl] = useState('')
    const [isChange, setIsChange] = useState(false)

    const handleClose = () => {
        setImage('');
        setMedia('');
        setApiUrl('');
        setIsChange(false);
        setLoading(false);
        setOpen(false);
        setIsHovered(false);
        setOpenCrop(false);
    };

    const handleImageChange = (event) => {
        if (event.target.files[0]) {
            if (event.target.files[0].size <= 2097152) {
                if (event.target.files[0].type.includes('image')) {
                    const selectedImage = event.target.files[0];
                    const imageUrl = URL.createObjectURL(selectedImage);
                    setMedia(imageUrl)
                    // setImage(imageUrl);
                    setIsChange(true)
                    setOpenCrop(true)
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

    const uploadImage = async (e) => {

        e.preventDefault();
        if (!media || media === '') {
            toast.error("Select the image first");
            setErrorMsg("Select the image first");
        }
        setLoading(true)
        let data = new FormData()
        data.append('profile_image', media)

        let config = {
            method: 'Patch',
            maxBodyLength: Infinity,
            url: apiUrl,
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),
                accept: 'application/json'
            },
            data: data
        };
        const AxiosObj = getAxiosWithToken();

        if (data.image !== "" && media) {

            AxiosObj.request(config)
                .then((response) => {
                    if (response.data?.Success) {
                        if (secureLocalStorage.getItem("rStudentDetails")) {
                            secureLocalStorage.removeItem("rStudentDetails")
                        }
                        toast.success("Profile Image has been updated");

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
            if (data.imgUrl !== null && data.imgUrl !== "") {
                setImage(`https://cyber-tutor-x-backend.vercel.app/${data.imgUrl}`)
            } else {
                setImage(null)
            }
            setApiUrl(data.apiUrl)
        }
    }, [open, data])

    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

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
            setImage(croppedImage);
            setOpenCrop(false)
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <div>
            <Dialog fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Edit Profile Pic </DialogTitle>
                <DialogContent >
                    <ImageListItem style={{ margin: "auto", width: "250px" }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                        {image ? (<img src={image} alt="" style={{ width: "250px", height: "100%" }} />) : (<img src={require("../../assets/Images/profile.png")} style={{ width: "250px", height: "auto" }} alt="" />)}
                        {isHovered && (
                            <ImageListItemBar
                                actionPosition="left"
                                sx={{ height: '80px' }}
                                className="MuiImageListItemBar-positionBelow"
                                actionIcon={
                                    <IconButton
                                        sx={{ color: 'rgba(255, 255, 255, 0.54)', marginLeft: '80px' }}
                                        aria-label={`info about `}
                                    >
                                        <Button component="label">
                                            <CameraAltOutlinedIcon style={{ color: '#fff', fontSize: '32px' }} />
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
                        )}
                    </ImageListItem>
                    <br />
                    <br />
                </DialogContent>
                <Typography color={'red'} textAlign={'center'}>{errorMsg !== '' ? errorMsg : null}</Typography>
                {loading ? <Loader /> : <Button disabled={!isChange} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={uploadImage} >Update</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog fullWidth open={openCrop} onClose={handleCloseCrop} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Crop Image</DialogTitle>
                <DialogContent >
                    <Stack sx={{ position: 'relative', width: '50%', height: "180px", margin:"auto" }}>
                        <Cropper
                            image={media}
                            crop={crop}
                            rotation={rotation}
                            zoom={zoom}
                            aspect={1 / 1}
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