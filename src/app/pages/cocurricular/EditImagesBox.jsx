import * as React from 'react';
import Button from '@mui/material/Button';
import { Image } from 'react-bootstrap'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Loader from '../../components/Loader';
import { useState, useEffect } from 'react';
import AxiosObj from '../../axios/AxiosObj';
import { toast } from 'react-toastify';
import ViewImagesBox from './ViewImagesBox'
import { Stack, Typography } from '@mui/material'
import secureLocalStorage from "react-secure-storage";

export default function EditImageBox({ open, setOpen, data }) {
    const capitalizeWords = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    const [loading, setLoading] = useState(false)

    const [eventId, setEventID] = useState('')

    const [errorMsg, setErrorMsg] = useState('')
    const [isChange, setIsChange] = useState(false)

    const handleClose = () => {
        setEventID('')
        setRank1Image1('')
        setRank1Image1Url('')
        setRank1Image2('')
        setRank1Image2Url('')
        setRank2Image1('')
        setRank2Image1Url('')
        setRank2Image2('')
        setRank2Image2Url('')
        setRank3Image1('')
        setRank3Image1Url('')
        setRank3Image2('')
        setRank3Image2Url('')
        setEventImage('')
        setEventImageUrl('')
        setErrorMsg('')
        setOpen(false);
        setIsChange(false)
        setLoading(false)
    };

    const updatedStudentImage = (e) => {
        e.preventDefault();
        
        setLoading(true)
        let data = new FormData()
        data.append('event_id', eventId)
        data.append('rank1_image1', rank1Image1)
        data.append('rank1_image2', rank1Image2)
        data.append('rank2_image1', rank2Image1)
        data.append('rank2_image2', rank2Image2)
        data.append('rank3_image1', rank3Image1)
        data.append('rank3_image2', rank3Image2)
        data.append('event_image', eventImage)
       
        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'event/add/image/',
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

    useEffect(() => {
        if (open && open === true) {
            setEventID(data.eid)
        }
    }, [open, data])

    // Edit Student Image
    const [rank1Image1, setRank1Image1] = useState('')
    const [rank1Image1Url, setRank1Image1Url] = useState('')

    const [rank1Image2, setRank1Image2] = useState('')
    const [rank1Image2Url, setRank1Image2Url] = useState('')

    const [rank2Image1, setRank2Image1] = useState('')
    const [rank2Image1Url, setRank2Image1Url] = useState('')

    const [rank2Image2, setRank2Image2] = useState('')
    const [rank2Image2Url, setRank2Image2Url] = useState('')

    const [rank3Image1, setRank3Image1] = useState('')
    const [rank3Image1Url, setRank3Image1Url] = useState('')

    const [rank3Image2, setRank3Image2] = useState('')
    const [rank3Image2Url, setRank3Image2Url] = useState('')

    const [eventImage, setEventImage] = useState('')
    const [eventImageUrl, setEventImageUrl] = useState('')

    // Edit Student Image
    const [editImageDetails, setEditImageDetails] = useState('')
    const [openEditImageBox, setOpenEditImageBox] = useState(false);
    const handleChangeImage = (type) => {
        if (type === "rank1Image1") {
            setEditImageDetails({
                type: type,
                url: rank1Image1Url,
                image: rank1Image1
            })
        }
        if (type === "rank1Image2") {
            setEditImageDetails({
                type: type,
                url: rank1Image2Url,
                image: rank1Image2
            })
        }
        if (type === "rank2Image1") {
            setEditImageDetails({
                type: type,
                url: rank2Image1Url,
                image: rank2Image1
            })
        }
        if (type === "rank2Image2") {
            setEditImageDetails({
                type: type,
                url: rank2Image2Url,
                image: rank2Image2
            })
        }
        if (type === "rank3Image1") {
            setEditImageDetails({
                type: type,
                url: rank3Image1Url,
                image: rank3Image1
            })
        }
        if (type === "rank3Image2") {
            setEditImageDetails({
                type: type,
                url: rank3Image2Url,
                image: rank3Image2
            })
        }
        if (type === "eventImg") {
            setEditImageDetails({
                type: type,
                url: eventImageUrl,
                image: eventImage
            })
        }
        setOpenEditImageBox(true)
    }

    useEffect(() => {
        if (editImageDetails.isChange && editImageDetails.isChange === true) {
            setIsChange(true)
            if (editImageDetails.type === "rank1Image1") {
                setRank1Image1(editImageDetails.image)
                setRank1Image1Url(editImageDetails.url)
            }
            if (editImageDetails.type === "rank1Image2") {
                setRank1Image2(editImageDetails.image)
                setRank1Image2Url(editImageDetails.url)
            }
            if (editImageDetails.type === "rank2Image1") {
                setRank2Image1(editImageDetails.image)
                setRank2Image1Url(editImageDetails.url)
            }
            if (editImageDetails.type === "rank2Image2") {
                setRank2Image2(editImageDetails.image)
                setRank2Image2Url(editImageDetails.url)
            }
            if (editImageDetails.type === "rank3Image1") {
                setRank3Image1(editImageDetails.image)
                setRank3Image1Url(editImageDetails.url)
            }
            if (editImageDetails.type === "rank3Image2") {
                setRank3Image2(editImageDetails.image)
                setRank3Image2Url(editImageDetails.url)
            }
            if (editImageDetails.type === "eventImg") {
                setEventImage(editImageDetails.image)
                setEventImageUrl(editImageDetails.url)
            }
        }
    }, [editImageDetails, openEditImageBox])


    return (
        <div>
            <Dialog fullWidth open={open} onClose={handleClose} >
                <DialogTitle variant='h5' style={{ display: "flex", justifyContent: "space-between" }} >Add Event Images</DialogTitle>
                <DialogContent >
                    <Stack direction={'row'} spacing={2} mx={0} gap={1}>
                        <Stack direction={'column'} spacing={2} mx={3} sx={{ justifyContent: "space-between" }}>
                            <Stack spacing={2} m={0} direction={'column'}>
                                <Stack direction={'row'} gap={"55px"} alignItems={"center"} p={1} spacing={2} style={{ opacity: "40%", marginTop: "5px", borderBottom: "0.5px solid #707070" }} m={0}>
                                    <Typography style={{ marginTop: "0", color: "#616161", fontSize: "19px", fontWeight: "500", textTransform: "capitalize" }} variant='body1'>Rank 1</Typography>
                                    {rank1Image1Url === '' ? (<Image width={50} src={require('../../assets/Images/add_image.png')} onClick={() => { handleChangeImage("rank1Image1") }} style={{ cursor: "pointer" }} />) : (<Image width={50} src={rank1Image1Url} onClick={() => { handleChangeImage("rank1Image1") }} style={{ cursor: "pointer" }} />)}
                                    {rank1Image2Url === '' ? (<Image width={50} src={require('../../assets/Images/add_image.png')} onClick={() => { handleChangeImage("rank1Image2") }} style={{ cursor: "pointer" }} />) : (<Image width={50} src={rank1Image2Url} onClick={() => { handleChangeImage("rank1Image2") }} style={{ cursor: "pointer" }} />)}
                                </Stack>
                                <Stack direction={'row'} gap={"55px"} alignItems={"center"} p={1} spacing={2} style={{ opacity: "40%", marginTop: "5px", borderBottom: "0.5px solid #707070" }} m={0}>
                                    <Typography style={{ marginTop: "0", color: "#616161", fontSize: "19px", fontWeight: "500", textTransform: "capitalize" }} variant='body1'>Rank 2</Typography>
                                    {rank2Image1Url === '' ? (<Image width={50} src={require('../../assets/Images/add_image.png')} onClick={() => { handleChangeImage("rank2Image1") }} style={{ cursor: "pointer" }} />) : (<Image width={50} src={rank2Image1Url} onClick={() => { handleChangeImage("rank1Image1") }} style={{ cursor: "pointer" }} />)}
                                    {rank2Image2Url === '' ? (<Image width={50} src={require('../../assets/Images/add_image.png')} onClick={() => { handleChangeImage("rank2Image2") }} style={{ cursor: "pointer" }} />) : (<Image width={50} src={rank2Image2Url} onClick={() => { handleChangeImage("rank1Image2") }} style={{ cursor: "pointer" }} />)}
                                </Stack>
                                <Stack direction={'row'} gap={"55px"} alignItems={"center"} p={1} spacing={2} style={{ opacity: "40%", marginTop: "5px", borderBottom: "0.5px solid #707070" }} m={0}>
                                    <Typography style={{ marginTop: "0", color: "#616161", fontSize: "19px", fontWeight: "500", textTransform: "capitalize" }} variant='body1'>Rank 3</Typography>
                                    {rank3Image1Url === '' ? (<Image width={50} src={require('../../assets/Images/add_image.png')} onClick={() => { handleChangeImage("rank3Image1") }} style={{ cursor: "pointer" }} />) : (<Image width={50} src={rank3Image1Url} onClick={() => { handleChangeImage("rank3Image1") }} style={{ cursor: "pointer" }} />)}
                                    {rank3Image2Url === '' ? (<Image width={50} src={require('../../assets/Images/add_image.png')} onClick={() => { handleChangeImage("rank3Image2") }} style={{ cursor: "pointer" }} />) : (<Image width={50} src={rank3Image2Url} onClick={() => { handleChangeImage("rank3Image2") }} style={{ cursor: "pointer" }} />)}
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack direction={'column'} spacing={2} mx={0} justifyContent={"center"} style={{ opacity: "40%", margin: "0", paddingLeft: "20px", borderLeft: "0.5px solid #707070" }}>
                            <Stack direction={'column'} gap={"10px"} alignItems={"center"} spacing={2} style={{ marginTop: "5px" }} m={0}>
                                <Typography style={{ marginTop: "0", color: "#616161", fontSize: "19px", fontWeight: "500", textTransform: "capitalize" }} variant='body1'>Event Image</Typography>
                                {eventImageUrl === '' ? (<Image width={75} src={require('../../assets/Images/add_image.png')} onClick={() => { handleChangeImage("eventImg") }} style={{ cursor: "pointer" }} />) : (<Image width={75} src={eventImageUrl} onClick={() => { handleChangeImage("eventImg") }} style={{ cursor: "pointer" }} />)}
                            </Stack>
                        </Stack>
                    </Stack>
                </DialogContent>
                <Typography color={'red'} textAlign={'center'}>{errorMsg !== '' ? errorMsg : null}</Typography>
                {loading ? <Loader /> : <Button disabled={!isChange} variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content', }} onClick={updatedStudentImage} >Save</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
            <ViewImagesBox open={openEditImageBox} setOpen={setOpenEditImageBox} data={editImageDetails} setEditImageDetails={setEditImageDetails} />
        </div>
    )
}
