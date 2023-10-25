import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Loader from '../../components/Loader';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Typography, Stack } from '@mui/material'
import Cropper from 'react-easy-crop'
import getCroppedImg from '../userApp/getCroppedImg'

export default function ViewImagesBox({ open, setOpen, data, setEditImageDetails }) {

    const [loading, setLoading] = useState(false)

    const [imgurl, setImgurl] = useState('')
    const [media, setMedia] = useState('')
    const [type, setType] = useState('')

    const [errorMsg, setErrorMsg] = useState('')
    const [isChange, setIsChange] = useState(false)

    const handleClose = () => {
        setMedia('')
        setImgurl('')
        setType('')
        setOpen(false);
        setIsChange(false)
    };

    const updatedStudentImage = (e) => {
        e.preventDefault();

        if (!media || media === '') {
            toast.error("Select the image first");
            setErrorMsg("Select the image first");
            return false;
        }

        try {
            setEditImageDetails({
                isChange: true,
                type: type,
                url: imgurl,
                image: media
            })
        } catch (e) {

        } finally {
            handleClose()
        }

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
            setImgurl(data.url)
            setMedia(data.image)
            setType(data.type)
        }
    }, [open, data])


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
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Event Image</DialogTitle>
                <DialogContent >
                    <form style={{ textAlign: "center" }} >
                        {imgurl === null ? (<img src={require('../../assets/Logo/noimage.png')} style={{ height: "250px", width: "300px", }} alt="" />) : (<img src={imgurl} style={{ height: "250px", width: "300px", }} alt="" />)}
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
                {loading ? <Loader /> : <Button disabled={!isChange} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={updatedStudentImage} >Add Image</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
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
