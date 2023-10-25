import { Box, Stack, Typography, Divider, Button } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import TableWrapper from '../../components/wrappers/TableWrapper'
import AxiosObj from '../../axios/AxiosObj';
import { useParams } from 'react-router-dom'
import { Image } from 'react-bootstrap'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditRankBox from './EditRankBox'
import EditImageBox from './EditImageBox'
import EditImagesBox from './EditImagesBox'
import EditEventImageBox from './EditEventImageBox'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { resetLocal } from './../../partials/localStorage'
import secureLocalStorage from "react-secure-storage";

export const EventDetails = () => {

    useEffect(() => {
        resetLocal("cocurricular");
    }, []);

    const [eventDetails, setEventDetails] = useState([])
    const [eventStudentList, setEventStudentList] = useState([])
    const capitalizeWords = (str) => {
        if (!str) {
            return ''; // or any other default value
        }

        return str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const { id } = useParams()
    const fetchResultList = async () => {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'event/get/event/details/' + id,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),
            }
        };

        AxiosObj.request(config)
            .then((response) => {
                setEventDetails(response.data?.Data)
                const mappedData = response.data?.Data[1].event_result.map(event => {
                    const { class_name, section_name, data } = event;

                    return data.map(item => {
                        const { rank, student_details, image } = item;
                        const id = student_details.id;
                        const firstName = student_details?.first_name + " " + (student_details?.middle_name != null ? (student_details?.middle_name) : ('')) + " " + (student_details?.last_name != null ? (student_details?.last_name) : (""));
                        const profilePhoto = student_details?.profile_image;
                        const image1 = image ? image.image1 : null;
                        const image2 = image ? image.image2 : null;
                        const classAndSection = (class_name + " " + section_name).toUpperCase();

                        return { rank, firstName, image1, image2, classAndSection, id, profilePhoto};
                    });
                });

                const eventStudentList = mappedData.flat();
                setEventStudentList(eventStudentList);

            })
            .catch((error) => {
                console.log(error);
            });
    }
    useEffect(() => {
        fetchResultList()
    }, [])
    const sortedEventStudentList = eventStudentList.slice().sort((a, b) => {
        if (a.rank === null && b.rank === null) {
            return 0;
        }
        if (a.rank === null) {
            return 1;
        }
        if (b.rank === null) {
            return -1;
        }
        return a.rank - b.rank;
    });

    // Edit Detials
    const [editRankDetails, setEditRankDetails] = useState('')
    const [openEditRankBox, setOpenEditRankBox] = useState(false);
    const updatedStudentRankBox = (sid, rank, studentName) => {
        setEditRankDetails({
            "eid": id,
            "sid": sid,
            "rank": rank,
            "studentName": studentName,
        })
        setOpenEditRankBox(true)
    }

    // Edit Student Image
    const [editImageDetails, setEditImageDetails] = useState('')
    const [openEditImageBox, setOpenEditImageBox] = useState(false);
    const updatedStudentImageBox = (sid, imgurl, imageType, studentName) => {
        setEditImageDetails({
            "eid": id,
            "sid": sid,
            "imgurl": imgurl,
            "imageType": imageType,
            "studentName": studentName,
        })
        setOpenEditImageBox(true)
    }

    // Edit Event Image
    const [editEventImageDetails, setEditEventImageDetails] = useState('')
    const [openEditEventImageBox, setOpenEditEventImageBox] = useState(false);
    const updatedEventImageBox = (imgurl) => {
        setEditEventImageDetails({
            "eid": id,
            "imgurl": imgurl,
        })
        setOpenEditEventImageBox(true)
    }

    // Edit Event Image
    const [editEventImagesDetails, setEditEventImagesDetails] = useState('')
    const [openEditEventImagesBox, setOpenEditEventImagesBox] = useState(false);
    const updatedEventImagesBox = (imgurl) => {
        setEditEventImagesDetails({
            "eid": id,
            "imgurl": imgurl,
        })
        setOpenEditEventImagesBox(true)
    }

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 11;

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const totalPages = Math.ceil(sortedEventStudentList.length / rowsPerPage);
    const currentRows = sortedEventStudentList.slice(indexOfFirstRow, indexOfLastRow);
    const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPageNumbers = () => {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <button disabled={currentPage === 1} onClick={handlePrevPage} style={{ color: "#3D3D3D", cursor: "pointer", background: "transparent", border: 0, display: "flex", alignItems: "center", }}>

                    <ArrowBackIosIcon style={{ width: "11px" }} />
                    Previous Page
                </button>
                {pageNumbers.map((pageNumber) => (
                    <button
                        style={{ cursor: "pointer", background: "transparent", border: 0, color: `${currentPage === pageNumber ? "#1A73E8" : "#3D3D3D"}` }}
                        key={pageNumber}
                        onClick={() => handlePageChange(pageNumber)}
                        className={currentPage === pageNumber ? "active" : ""}
                    >
                        {pageNumber}
                    </button>
                ))}
                <button
                    disabled={currentPage === totalPages}
                    onClick={handleNextPage}
                    style={{ color: "#3D3D3D", cursor: "pointer", background: "transparent", border: 0, display: "flex", alignItems: "center", }}
                >
                    Next Page
                    <ArrowForwardIosIcon style={{ width: "11px" }} />
                </button>
            </div>
        );
    };

    const formatOutcome = (outcomeKey) => {
        switch (outcomeKey) {
            case 'concentration':
                return 'Concentration';
            case 'team_work':
                return 'Team Work';
            case 'logical_approach':
                return 'Logical Approach';
            case 'confidence':
                return 'Confidence';
            case 'creativity':
                return 'Creativity';
            case 'health':
                return 'Health';
            case 'patiance':
                return 'Patiance';
            case 'presentation':
                return 'Presentation';
            case 'social_skill':
                return 'Social Skill';
            case 'motor_skill':
                return 'Motor Skill';
            // Add more cases for other outcome keys
            default:
                // If the outcome key is not found in the switch cases,
                // return the outcome key with the first letter capitalized
                return outcomeKey.charAt(0).toUpperCase() + outcomeKey.slice(1);
        }
    };

    const formatEventType = (outcomeKey2) => {
        switch (outcomeKey2) {
            case 'inschool':
                return 'School Level';
            case 'inter_school':
                return 'Inter-School Level';
            case 'state':
                return 'State Level';
            case 'inter_state':
                return 'Inter-State Level';
            case 'national':
                return 'National Level';
            case 'inter_nation':
                return 'Inter-National Level';
            // Add more cases for other outcome keys
            // default:
            //     // If the outcome key is not found in the switch cases,
            //     // return the outcome key with the first letter capitalized
            //     return outcomeKey2.charAt(0).toUpperCase() + outcomeKey2.slice(1);
        }
    };

    return (
        <Box sx={{ width: "100%" }}>
            <Box margin={2}>
                <Link
                    className="secondary"
                    to={'/cocurricular'}
                    style={{ margin: "10px", marginBottom: "0px", display: "flex", cursor: "pointer", alignItems: "center", color: "#3D3D3D", fontSize: "14px", textDecoration: "none" }}
                >
                    <ArrowBackIosIcon style={{ marginRight: "4px", fontSize: "12px" }} /> Back
                </Link>
            </Box>
            <TableWrapper sx={{ width: '100%' }} >
                <Stack direction={'row'} spacing={2} mx={3} sx={{ justifyContent: "space-between", margin: "10px 55px 10px 20px", gap: "30px" }}>
                    <Stack spacing={2} m={2} style={{ width: "350px" }}>
                        <Typography variant='h5' style={{ textTransform: "capitalize", width: "400px", textOverflow: "ellipsis", display: "block", overflow: "hidden" }}>{eventDetails[0]?.event_meta_data.event_name || "Event Name"}</Typography>
                        <Stack spacing={2} style={{ marginTop: "5px" }} m={0}>
                            <Typography style={{ marginTop: "0", fontSize: "16px", fontWeight: "500", textTransform: "capitalize", width: "400px", textOverflow: "ellipsis", display: "block", overflow: "hidden" }} variant='body1'>{eventDetails[0]?.event_meta_data.description || "About"} </Typography>
                        </Stack>
                    </Stack>
                    <Stack spacing={2} m={2} justifyContent={"center"} textAlign={"left"}>
                        <Typography variant='h6' style={{ fontWeight: "500" }} >Session</Typography>
                        <Typography style={{ marginTop: "0", fontSize: "14px", fontWeight: "600", }} variant='body1'>{eventDetails[0]?.event_meta_data.session_name || "2022-23"}</Typography>
                    </Stack>
                    <Stack spacing={2} m={2} justifyContent={"center"} textAlign={"left"}>
                        <Typography variant='h6' style={{ fontWeight: "500" }}>Event Type:</Typography>
                        <Typography style={{ marginTop: "0", fontSize: "14px", fontWeight: "600", }} variant='body1'>{formatEventType(eventDetails[0]?.event_meta_data.event_type) || "Loading..."} </Typography>
                    </Stack>
                    <Stack spacing={2} m={2} justifyContent={"center"} textAlign={"left"}>
                        <Typography variant='h6' style={{ fontWeight: "500" }}>Participation Type:</Typography>
                        <Typography style={{ marginTop: "0", fontSize: "14px", fontWeight: "600", }} variant='body1'>{capitalizeWords(eventDetails[0]?.event_meta_data.participation_type) || "Solo"}</Typography>
                    </Stack>
                    <Stack spacing={2} m={2} justifyContent={"center"} textAlign={"left"}>
                        <Typography variant='h6' style={{ fontWeight: "500" }}>Catergory:</Typography>
                        <Typography style={{ marginTop: "0", fontSize: "14px", fontWeight: "600", }} variant='body1'>{capitalizeWords(eventDetails[0]?.event_meta_data.catergory_name) || "Sports"}</Typography>
                    </Stack>
                    <Stack spacing={2} mr={4} justifyContent={"center"} textAlign={"left"}>
                        <Typography variant='h6' style={{ fontWeight: "500" }}>Date of Event:</Typography>
                        <Typography style={{ marginTop: "0", fontSize: "14px", fontWeight: "600", }} variant='body1'>{eventDetails[0]?.event_meta_data.date_of_event || "16-06-2023"}</Typography>
                    </Stack>
                </Stack>
                <Divider />
                <Paper sx={{ width: '100%', boxShadow: "none" }} overflow={"hidden"}>
                    <Stack direction={'row'} gap={10} spacing={2} mx={0} py={0}>
                        <Stack direction={'column'} style={{ width: "45%" }} spacing={2} mx={5} py={3}>
                            <Typography variant='h6'>Eligible Classes</Typography>
                            <Stack direction={'row'} spacing={2} flexWrap={"wrap"} gap={2} mx={0} py={0}>
                                {eventDetails[0]?.event_meta_data.eligible_classes.length > 0 ? (
                                    eventDetails[0].event_meta_data.eligible_classes.map((item, index) => {
                                        return (
                                            <Typography variant='body1' key={index} px={2} py={1} style={{ margin: 0, }} sx={{ width: "fit-content", textAlign: "center", fontSize: "12px", background: "#b5ebef", border: "2px solid #40bac5", borderRadius: "20px" }}>{(item.class_name + " " + item.section_name).toUpperCase()}</Typography>
                                        )
                                    })
                                ) : ("There is no class available")}
                            </Stack>
                        </Stack>
                        <Stack direction={'column'} style={{ width: "45%" }} spacing={2} mx={5} py={3}>
                            <Typography variant='h6'>Outcomes</Typography>
                            <Stack direction={'row'} spacing={2} flexWrap={"wrap"} gap={2} mx={0} py={0}>
                                {eventDetails[0]?.event_meta_data.out_comes && Object.entries(eventDetails[0].event_meta_data.out_comes).map(([outcomeKey, outcomeValue]) => {
                                    if (outcomeValue == true) {
                                        return (
                                            <Typography
                                                variant='body1'
                                                key={outcomeKey}
                                                px={2}
                                                py={1}
                                                style={{ margin: 0 }}
                                                sx={{
                                                    width: "fit-content",
                                                    textAlign: "center",
                                                    fontSize: "12px",
                                                    background: "#b5ebef",
                                                    border: "2px solid #40bac5",
                                                    borderRadius: "20px"
                                                }}
                                            >
                                                {formatOutcome(outcomeKey)}
                                            </Typography>
                                        );
                                    }
                                    return null;
                                })}
                            </Stack>
                        </Stack>
                    </Stack>

                </Paper>
                <Divider />
                <Paper sx={{ width: '100%', boxShadow: "none", paddingBottom: "0" }} overflow={"hidden"}>
                    <Stack direction={'row'} justifyContent={"space-between"} mt={2} mx={5}>
                        <Typography variant='h5'>Result</Typography>
                        <Stack style={{ margin: '0px 12px' }}>
                            <Button
                                color="primary"
                                variant="outlined"
                                style={{ background: '#1A73E8', color: '#fff', border: '0', textAlign: 'center', width: "140px" }}
                                onClick={updatedEventImagesBox}
                            >
                                Add Images
                            </Button>
                        </Stack>
                    </Stack>
                    <Stack direction={'column'} py={3} spacing={2} mx={0} style={{ boxShadow: "none", }}>
                        <TableContainer component={Paper} style={{ boxShadow: "none", }} sx={{ width: "90%", margin: "auto", border: 0 }}>
                            <Table sx={{ minWidth: 650 }} size="TablePropsSizeOverrides" aria-label="a dense table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left"><Typography variant='body' sx={{ fontSize: "14px", fontWeight: "600" }}>Name</Typography></TableCell>
                                        <TableCell align="center"><Typography variant='body' sx={{ fontSize: "14px", fontWeight: "600" }}>Class</Typography></TableCell>
                                        <TableCell align="center"><Typography variant='body' sx={{ fontSize: "14px", fontWeight: "600" }}>Result</Typography></TableCell>
                                        <TableCell align="center"><Typography variant='body' sx={{ fontSize: "14px", fontWeight: "600" }}>Images</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {currentRows.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                No Data
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        currentRows.map((row) => (
                                            <TableRow
                                                key={row.firstName}

                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell align="left" component="th" style={{ padding: "8px", height: "61px" }} scope="row" sx={{ fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "10px" }}>
                                                    {row?.profilePhoto == "" || row?.profilePhoto == undefined || row?.profilePhoto == null ? (<Image src={require('../../assets/Images/profile.png')} width={'35'} style={{ borderRadius: "50px" }} />) : (<Image src={"https://cyber-tutor-x-backend.vercel.app/" + row?.profilePhoto} width={'35'} height={"35"} style={{ borderRadius: "50px" }} />)}
                                                    {row.firstName}
                                                </TableCell>
                                                <TableCell style={{ padding: "8px", height: "61px" }} align="center">{row.classAndSection}</TableCell>
                                                <TableCell style={{ padding: "8px", cursor: "pointer", height: "61px" }} align="center" onClick={() => { updatedStudentRankBox(row.id, (row.rank == null ? "participated" : row.rank), row.firstName) }}>
                                                    {row.rank == null ? "Participated" : null}
                                                    {row.rank == 1 ? "1st" : null}
                                                    {row.rank == 2 ? "2nd" : null}
                                                    {row.rank == 3 ? "3rd" : null}
                                                </TableCell>
                                                <TableCell style={{ padding: "8px", height: "61px" }} align="center">
                                                    {row.rank == 1 || row.rank == 2 || row.rank == 3 ? (
                                                        <React.Fragment>
                                                            {row.image1 == null ? (
                                                                <Image src={require('../../assets/Logo/noimage.png')} width={'45'} height={'35'} style={{ margin: "2px 5px", cursor: "pointer" }} onClick={() => { updatedStudentImageBox(row.id, null, "image1", row.firstName) }} />
                                                            ) : (
                                                                <>
                                                                    <Image src={"https://cyber-tutor-x-backend.vercel.app/" + row.image1 || require("../../assets/Logo/noimage.png")} width={'45'} height={'35'} style={{ margin: "2px 5px", cursor: "pointer" }} onClick={() => { updatedStudentImageBox(row.id, ("https://cyber-tutor-x-backend.vercel.app/" + row.image1), "image1", row.firstName) }} />
                                                                </>
                                                            )}
                                                            {row.image2 == null ? (
                                                                <Image src={require('../../assets/Logo/noimage.png')} width={'45'} height={'35'} style={{ margin: "2px 5px", cursor: "pointer" }} onClick={() => { updatedStudentImageBox(row.id, null, "image2", row.firstName) }} />
                                                            ) : (
                                                                <Image src={"https://cyber-tutor-x-backend.vercel.app/" + row.image2 || require("../../assets/Logo/noimage.png")} width={'45'} height={'35'} style={{ margin: "2px 5px", cursor: "pointer" }} onClick={() => { updatedStudentImageBox(row.id, ("https://cyber-tutor-x-backend.vercel.app/" + row.image2), "image2", row.firstName) }} />
                                                            )}
                                                            {eventDetails[0].event_meta_data.image == null ? (
                                                                <Image src={require('../../assets/Logo/noimage.png')} width={'45'} height={'35'} style={{ margin: "2px 5px", cursor: "pointer" }} onClick={() => { updatedEventImageBox(null) }} />
                                                            ) : (
                                                                <Image src={"https://cyber-tutor-x-backend.vercel.app/" + eventDetails[0].event_meta_data.image || require("../../assets/Logo/noimage.png")} width={'45'} height={'35'} style={{ margin: "2px 5px", cursor: "pointer" }} onClick={() => { updatedEventImageBox(("https://cyber-tutor-x-backend.vercel.app/" + eventDetails[0].event_meta_data.image)) }} />
                                                            )}
                                                        </React.Fragment>
                                                    ) : (eventDetails[0].event_meta_data.image == null ? (
                                                        <React.Fragment>
                                                            <Image src={require('../../assets/Logo/noimage.png')} width={'45'} height={'35'} style={{ margin: "2px 5px", cursor: "pointer", visibility: "hidden" }} onClick={() => { updatedEventImageBox(null) }} />
                                                            <Image src={require('../../assets/Logo/noimage.png')} width={'45'} height={'35'} style={{ margin: "2px 5px", cursor: "pointer", visibility: "hidden" }} onClick={() => { updatedEventImageBox(null) }} />
                                                            <Image src={require('../../assets/Logo/noimage.png')} width={'45'} height={'35'} style={{ margin: "2px 5px", cursor: "pointer" }} onClick={() => { updatedEventImageBox(null) }} />
                                                        </React.Fragment>
                                                    ) : (
                                                        <React.Fragment>
                                                            <Image src={require('../../assets/Logo/noimage.png')} width={'45'} height={'35'} style={{ margin: "2px 5px", cursor: "pointer", visibility: "hidden" }} onClick={() => { updatedEventImageBox(null) }} />
                                                            <Image src={require('../../assets/Logo/noimage.png')} width={'45'} height={'35'} style={{ margin: "2px 5px", cursor: "pointer", visibility: "hidden" }} onClick={() => { updatedEventImageBox(null) }} />
                                                            <Image src={"https://cyber-tutor-x-backend.vercel.app/" + eventDetails[0].event_meta_data.image || require("../../assets/Logo/noimage.png")} width={'45'} height={'35'} style={{ margin: "2px 5px", cursor: "pointer" }} onClick={() => { updatedEventImageBox(("https://cyber-tutor-x-backend.vercel.app/" + eventDetails[0].event_meta_data.image)) }} />
                                                        </React.Fragment>
                                                    ))}

                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {eventStudentList.length > 10 ? (<Box margin={2}><Box margin={2}>{renderPageNumbers()}</Box></Box>) : (null)}
                    </Stack>
                </Paper>
                <EditRankBox open={openEditRankBox} setOpen={setOpenEditRankBox} data={editRankDetails} />
                <EditImageBox open={openEditImageBox} setOpen={setOpenEditImageBox} data={editImageDetails} />
                <EditEventImageBox open={openEditEventImageBox} setOpen={setOpenEditEventImageBox} data={editEventImageDetails} />
                <EditImagesBox open={openEditEventImagesBox} setOpen={setOpenEditEventImagesBox} data={editEventImagesDetails} />
            </TableWrapper>
        </Box>
    )
}
