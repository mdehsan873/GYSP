import { Box, Stack, Typography } from '@mui/material'
import { Link } from "react-router-dom";
import React, { useRef, useState, useEffect } from 'react'
import Paper from '@mui/material/Paper';
import AxiosObj from '../../axios/AxiosObj';
import { useParams } from 'react-router-dom'
import { Container } from '@mui/system'
import EditBox from './EditBox'
import EditBoxMarks from './EditBoxMarks'
import EditBoxAttendance from './EditBoxAttendance'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import { resetLocal } from './../../partials/localStorage'
import Loader from '../../components/Loader';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import secureLocalStorage from "react-secure-storage";

export const ResultDetails = () => {

    useEffect(() => {
        resetLocal("result2");
    }, []);

    const { id, classID, sectionID } = useParams()
    const [studentDetails, setStudentDetails] = useState([]);
    const [resultDetail, setResultDetail] = useState([]);
    const [editDetails, setEditDetails] = useState('');

    const [openEditBox, setOpenEditBox] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 11;

    const [loading, setLoading] = useState(false);

    const [openEditMarkBox, setOpenEditMarkBox] = useState(false);
    const [editMarkDetails, setEditMarkDetails] = useState('');

    const [openEditAttBox, setOpenEditAttBox] = useState(false);
    const [editAttDetails, setEditAttDetails] = useState('');

    useEffect(() => {
        const fetchResultList = async () => {
            setLoading(true);
            // if (secureLocalStorage.getItem("studentDetailsre") && secureLocalStorage.getItem("resultDetail")) {
            //     setStudentDetails(secureLocalStorage.getItem("studentDetailsre"));
            //     setResultDetail(secureLocalStorage.getItem("resultDetail"));
            //     setLoading(false);

            // } else {
                let config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: 'result/get/result/details/' + id + '/?class_id=' + classID + '&section_id=' + sectionID,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                    }
                };
                try {
                    const response = await AxiosObj.request(config);

                    if (response.data.Data && response.data.Data.meta_data) {
                        const stortedStduent2 = await response.data?.Data.results.sort((a, b) => {
                            // If class_names are equal, compare by student_details.first_name
                            if (a.student_details) {
                                if (a.student_details.first_name < b.student_details.first_name) return -1;
                                if (a.student_details.first_name > b.student_details.first_name) return 1;
                            } else {
                                if (a.first_name < b.first_name) return -1;
                                if (a.first_name > b.first_name) return 1;
                            }

                            return 0; // Elements are equal
                        });
                        setStudentDetails(stortedStduent2);
                        setResultDetail(response.data?.Data.meta_data);
                        setLoading(false);

                        // secureLocalStorage.setItem("studentDetailsre", stortedStduent2)
                        // secureLocalStorage.setItem("resultDetail", response.data?.Data.meta_data)
                    }


                } catch (error) {
                    console.log(error);
                    setLoading(false);
                }
            // }

        };

        fetchResultList();
    }, [id, classID, sectionID]);

    const handleChangeMarks = (subjectName, subjectMarks, subjectMarkId, StudentName, subjectType, inputType, max_marks, min_marks,) => {
        if (!editableThings) {
            return false;
        }
        setEditDetails({
            "subjectName": subjectName,
            "subjectMarks": subjectMarks,
            "subjectMarkId": subjectMarkId,
            "StudentName": StudentName,
            "subjectType": subjectType,
            "inputType": inputType,
            "max_marks": max_marks,
            "min_marks": min_marks,
        });
        setOpenEditBox(true);
    };

    const handleChangeMMark = (subjectName, MaxMarks, MinMarks, subjectMarkId, subjectType, inputType) => {
        if (!editableThings) {
            return false;
        }
        setEditMarkDetails({
            "subjectName": subjectName,
            "MaxMarks": MaxMarks,
            "MinMarks": MinMarks,
            "subjectMarkId": subjectMarkId,
            "subjectType": subjectType,
            "inputType": inputType,
        });
        setOpenEditMarkBox(true);
    };

    const handleChangeAtt = (test_name, Att, id) => {
        if (!editableThings) {
            return false;
        }
        setEditAttDetails({
            "test_name": test_name,
            "Att": Att,
            "id": id,
        });
        setOpenEditAttBox(true);
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    };

    const stortedStduent = studentDetails.sort((a, b) => a.student_details.first_name - b.student_details.first_name);

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;

    const totalPages = Math.ceil(stortedStduent.length / rowsPerPage);

    const currentRows = stortedStduent.slice(indexOfFirstRow, indexOfLastRow);

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
    const scrollRef = useRef(null);
    let scrollTimeout = null;

    useEffect(() => {
        const el = scrollRef.current;

        if (el) {
            const handleMouseDown = (e) => {
                scrollTimeout = setTimeout(() => {
                    const startX = e.clientX;
                    let scrollLeft = el.scrollLeft;

                    const handleMouseMove = (e) => {
                        const distance = startX - e.clientX;
                        el.scrollLeft = scrollLeft + distance;
                    };

                    const handleMouseUp = () => {
                        clearTimeout(scrollTimeout);
                        el.removeEventListener("mousemove", handleMouseMove);
                        el.removeEventListener("mouseup", handleMouseUp);
                    };

                    el.addEventListener("mousemove", handleMouseMove);
                    el.addEventListener("mouseup", handleMouseUp);
                }, 500); // Adjust the duration (in milliseconds) based on your preference
            };

            const handleMouseLeave = () => {
                clearTimeout(scrollTimeout);
            };

            el.addEventListener("mousedown", handleMouseDown);
            el.addEventListener("mouseleave", handleMouseLeave);

            return () => {
                el.removeEventListener("mousedown", handleMouseDown);
                el.removeEventListener("mouseleave", handleMouseLeave);
            };
        }
    }, []);

    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = {
            day: "numeric",
            month: "long",
            year: "numeric",
        };

        const day = date.getDate();
        const month = date.toLocaleDateString(undefined, { month: "long" });
        const year = date.getFullYear();

        const formattedDate = `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
        return formattedDate;
    }

    function getOrdinalSuffix(day) {
        const suffixes = ["th", "st", "nd", "rd"];
        const relevantDigits = (day % 100) >= 11 && (day % 100) <= 13 ? 0 : day % 10;
        return suffixes[relevantDigits] || suffixes[0];
    }

    const preventSelectionStyles = {
        WebkitTouchCallout: 'none', /* Disable callout (iOS Safari) */
        WebkitUserSelect: 'none', /* Safari */
        KhtmlUserSelect: 'none', /* Konqueror HTML */
        MozUserSelect: 'none', /* Firefox */
        msUserSelect: 'none', /* Internet Explorer/Edge */
        userSelect: 'none', /* Non-prefixed version, supported by most browsers */
        overflow: "hidden"
    };

    const [editableSx, setEditableSx] = useState({});
    const [editableThings, setEditableThings] = useState(false);

    const handleEditable = () => {
        if (editableThings == true) {
            setEditableThings(false)
            setEditableSx({})
            secureLocalStorage.setItem("editableSx", {})
            secureLocalStorage.setItem("editableThings", false)
        } else {
            secureLocalStorage.setItem("editableSx", {
                color: "#0B0080",
                cursor: "pointer",
                textDecoration: "underline",
                cursor: "pointer"
            })
            secureLocalStorage.setItem("editableThings", true)
            setEditableThings(true)
            setEditableSx({
                color: "#0B0080",
                cursor: "pointer",
                textDecoration: "underline",
                cursor: "pointer"
            })
        }
    }

    useEffect(() => {
        if (secureLocalStorage.getItem("editableThings")) {
            setEditableThings(secureLocalStorage.getItem("editableThings"));
        }
        if (secureLocalStorage.getItem("editableSx")) {
            setEditableSx(secureLocalStorage.getItem("editableSx"));
        }
    }, []);

    return (
        <Box sx={{ width: "100%" }}>
            <Box margin={2}>
                <Link
                    className="secondary"
                    to={'/results'}
                    style={{ margin: "10px", marginBottom: "0px", display: "flex", cursor: "pointer", alignItems: "center", color: "#3D3D3D", fontSize: "14px", textDecoration: "none" }}
                >
                    <ArrowBackIosIcon style={{ marginRight: "4px", fontSize: "12px" }} /> Back
                </Link>
            </Box>
            <Container maxWidth="xxl" sx={{ maxWidth: "84vw", border: 0, }}  >
                <Paper sx={{ marginTop: 2, border: 0, boxShadow: "0px 3px 6px 0px rgba(0,0,0,0.2)", }}>
                    {loading ? (
                        <Loader />
                    ) : (<>
                        <Stack direction={'row'} spacing={2} mx={3} pt={3} mb={3} sx={{ justifyContent: "space-between" }}>
                            <Stack spacing={2} m={2} mt={0} direction={"column"} alignItems={"flex-end"}>
                                <Stack spacing={2} direction={"row"}>
                                    <SchoolOutlinedIcon fontSize="large" style={{ fontSize: "40px" }} />
                                    <Typography variant='h4'>{(resultDetail?.test_name)?.toUpperCase() || "Loading..."}</Typography>
                                </Stack>
                                <Typography variant='body1' style={{ marginTop: "8px", cursor: "pointer" }} onClick={handleEditable}>
                                    {editableThings ?
                                        (<> <CloseIcon style={{ height: "12px", width: "12px", marginRight: "2px", cursor: "pointer" }} /> Edit</>)
                                        :
                                        (<> <EditIcon style={{ height: "12px", width: "12px", marginRight: "2px", cursor: "pointer" }} />Edit</>)
                                    }

                                </Typography>
                            </Stack>
                            <Stack spacing={2} m={2} textAlign={"center"}>
                                <Typography variant='h6' onClick={() => handleChangeAtt(resultDetail.test_name, resultDetail.max_day_of_attedance, resultDetail.id)}>Max Attendance</Typography>
                                <Typography variant='body1' style={{ marginTop: "8px" }} sx={editableSx} onClick={() => handleChangeAtt(resultDetail.test_name, resultDetail.max_day_of_attedance, resultDetail.id)}>{resultDetail.max_day_of_attedance !== undefined ? resultDetail.max_day_of_attedance.toString() : "Loading..."} Days</Typography>
                            </Stack>
                            <Stack spacing={2} m={2} textAlign={"center"}>
                                <Typography variant='h6'>Class</Typography>
                                <Typography variant='body1' style={{ marginTop: "8px" }}>{(resultDetail.class_name + " " + resultDetail.section_name).toUpperCase() || "Loading..."}</Typography>
                            </Stack>
                            <Stack spacing={2} m={2} textAlign={"center"}>
                                <Typography variant='h6'>Session</Typography>
                                <Typography variant='body1' style={{ marginTop: "8px" }}>{resultDetail.session || "Loading..."}</Typography>
                            </Stack>
                            <Stack spacing={2} m={2} textAlign={"center"}>
                                <Typography variant='h6'>Class Teacher</Typography>
                                <Typography variant='body1' style={{ marginTop: "8px" }}>{resultDetail.class_teacher || "Loading..."}</Typography>
                            </Stack>
                            <Stack spacing={2} m={2} textAlign={"center"}>
                                <Typography variant='h6'>Created By</Typography>
                                <Typography variant='body1' style={{ marginTop: "8px" }}>{resultDetail.created_by || "Loading..."}</Typography>
                            </Stack>
                            <Stack spacing={2} m={2} textAlign={"center"}>
                                <Typography variant='h6'>Date of Upload:</Typography>
                                <Typography variant='body1' style={{ marginTop: "8px" }}>{formatDate(resultDetail.upload_date) || "Loading..."}</Typography>
                            </Stack>
                        </Stack>
                        <Paper sx={{ width: '100%', boxShadow: "none" }} >
                            <div style={preventSelectionStyles} >
                                {Array.isArray(currentRows) && currentRows.length > 0 ? (
                                    // <div ref={scrollRef}>
                                    <Stack direction={"row"} ref={scrollRef} m={2} sx={{ width: 'auto', overflow: "scroll", "&::-webkit-scrollbar": { width: 0, height: 0 }, "&::-webkit-scrollbar-track": { backgroundColor: "orange", }, "&::-webkit-scrollbar-thumb": { backgroundColor: "red", borderRadius: 2 } }} spacing={2} >
                                        <TableContainer sx={{ width: "100%", minWidth: "fit-content", overflow: "hidden", paddingRight: "0px", borderRight: "1px solid #b7b7b7" }}>
                                            <Stack style={{ width: "90%", margin: "auto", textAlign: "center", fontSize: "14px", padding: "5px 11px", background: "#43B5C1", color: "#fff", border: "2px solid #43B5C1", borderRadius: "0px" }}><Typography variant='body'>Student Information</Typography></Stack>
                                            <Table sx={{ overflow: "hidden" }} size="TablePropsSizeOverrides" aria-label="a dense table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={{ padding: "10px 12px" }}>
                                                            <Typography variant='body' sx={{ fontSize: "14px", fontWeight: "600" }}>S. No</Typography><br />
                                                            <Stack style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3px" }}>
                                                                <Typography variant='body' sx={{ fontSize: "11px", opacity: "50%", width: "fit-content", textAlign: "center", fontWeight: "500", lineHeight: "14px", visibility: "hidden" }}>hidden</Typography>
                                                                <Typography variant='body' sx={{ fontSize: "11px", opacity: "50%", width: "fit-content", textAlign: "center", fontWeight: "500", lineHeight: "14px", visibility: "hidden" }}>hidden</Typography>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell style={{ padding: "10px 12px" }}>
                                                            <Typography variant='body' sx={{ fontSize: "14px", fontWeight: "600" }}>Name</Typography><br />
                                                            <Stack style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3px" }}>
                                                                <Typography variant='body' sx={{ fontSize: "11px", opacity: "50%", width: "fit-content", textAlign: "center", fontWeight: "500", lineHeight: "14px", visibility: "hidden" }}>hidden</Typography>
                                                                <Typography variant='body' sx={{ fontSize: "11px", opacity: "50%", width: "fit-content", textAlign: "center", fontWeight: "500", lineHeight: "14px", visibility: "hidden" }}>hidden</Typography>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {Array.isArray(currentRows) && currentRows.length > 0 ? (
                                                        currentRows
                                                            .slice() // Create a copy of the array to avoid modifying the original array
                                                            .sort((a, b) =>
                                                                (a.student_details?.first_name || '').localeCompare(b.student_details?.first_name || '')
                                                            ).map((item, index) => (
                                                                <TableRow key={item.student_details.user + "-" + index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                    <TableCell component="th" scope="row" sx={{ fontSize: "12px", textAlign: "center", fontWeight: "600", paddingTop: '12px', paddingBottom: '12px' }}>{index + 1 + (currentPage - 1) * rowsPerPage}</TableCell>
                                                                    <TableCell align="left" style={{ paddingTop: '12px', paddingBottom: '12px' }}>{`${item.student_details?.first_name || ''} ${item.student_details?.middle_name || ''} ${item.student_details?.last_name || ''}`}</TableCell>
                                                                </TableRow>
                                                            ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={2} align="center">
                                                                No Data
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                        {/* {console.log(currentRows)} */}
                                        {/* Academics */}
                                        {Array.isArray(currentRows) && currentRows.length > 0 && currentRows[0].AcadmicsSubject.length > 0 && (
                                            <TableContainer style={{ marginLeft: "0px", minWidth: "fit-content" }} sx={{ width: "100%", overflow: "hidden", borderRight: "1px solid #b7b7b7" }} key={currentRows[0].student_details.user + 9}>
                                                <Stack style={{ width: "90%", margin: "auto", textAlign: "center", fontSize: "14px", padding: "5px 11px", background: "#43B5C1", color: "#fff", border: "2px solid #43B5C1", borderRadius: "0px" }}>
                                                    <Typography variant='body'>Academics Subject</Typography>
                                                </Stack>
                                                <Table sx={{ overflow: "hidden" }} size="TablePropsSizeOverrides" aria-label="a dense table">
                                                    <TableHead>
                                                        <TableRow>
                                                            {currentRows[0].AcadmicsSubject.slice() // Create a copy of the array to avoid modifying the original array
                                                                .sort((a, b) => a.subject_name.localeCompare(b.subject_name)
                                                                ).map((subject, index) => (
                                                                    <TableCell align="center" key={subject.id + "-" + index} style={{ padding: "10px 12px" }}>
                                                                        <Typography variant='body' sx={{ fontSize: "14px", width: "fit-content", textAlign: "center", fontWeight: "600" }}>{(subject.subject_name).toUpperCase()}</Typography><br />
                                                                        <Stack style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3px" }}>
                                                                            <Typography variant='body' sx={{ fontSize: "11px", opacity: "50%", width: "fit-content", textAlign: "center", fontWeight: "500", lineHeight: "14px" }} style={editableSx} onClick={() => handleChangeMMark(subject.subject_name, subject.max_marks, subject.min_marks, subject.id, "AcadmicsSubject", "number")}>Max:{subject.max_marks}</Typography>
                                                                            <Typography variant='body' sx={{ fontSize: "11px", opacity: "50%", width: "fit-content", textAlign: "center", fontWeight: "500", lineHeight: "14px" }} style={editableSx} onClick={() => handleChangeMMark(subject.subject_name, subject.max_marks, subject.min_marks, subject.id, "AcadmicsSubject", "number")}>Min:{subject.min_marks}</Typography>
                                                                        </Stack>
                                                                    </TableCell>
                                                                ))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {Array.isArray(currentRows) && currentRows.length > 0 ? (
                                                            currentRows
                                                                .slice() // Create a copy of the array to avoid modifying the original array
                                                                .sort((a, b) =>
                                                                    (a.student_details?.first_name || '').localeCompare(
                                                                        b.student_details?.first_name || ''
                                                                    )
                                                                )
                                                                .map((item, index) => (
                                                                    <TableRow key={item.student_details.user + "-" + item.student_details.id + "-" + index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                        {item.AcadmicsSubject
                                                                            .slice() // Create a copy of the array to avoid modifying the original array
                                                                            .sort((a, b) =>
                                                                                a.subject_name.localeCompare(b.subject_name)
                                                                            ).map((subject, subIndex) => (
                                                                                <TableCell key={subject.id + subject.marks + "-" + subIndex} component="th" scope="row" sx={{ fontSize: "12px", textAlign: "center", fontWeight: "600", paddingTop: '12px', paddingBottom: '12px' }}>
                                                                                    <span style={editableSx} onClick={() => handleChangeMarks(subject.subject_name, (subject.optional == "True" ? ("-") : ((subject.marks == 0 ? '0' : subject.marks) || "AB")), subject.id, (`${item?.student_details?.first_name ?? ''} ${item?.student_details?.middle_name ?? ''} ${item?.student_details?.last_name ?? ''}`), "AcadmicsSubject", "number", subject.max_marks, subject.min_marks)} >
                                                                                        {subject.optional == "True" ? ("-") : ((subject.marks == 0 ? '0' : subject.marks) || "AB")}
                                                                                    </span>
                                                                                </TableCell>
                                                                            ))}
                                                                    </TableRow>
                                                                ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={2} align="center">
                                                                    No Data
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}

                                        {/* Scholastic */}
                                        {Array.isArray(currentRows) && currentRows.length > 0 && currentRows[0].CoScholasticSubject.length > 0 && (
                                            <TableContainer style={{ marginLeft: "0px", minWidth: "fit-content" }} sx={{ width: "100%", overflow: "hidden", borderRight: "1px solid #b7b7b7" }} key={currentRows[0].student_details.user + 6}>
                                                <Stack style={{ width: "90%", margin: "auto", textAlign: "center", fontSize: "14px", padding: "5px 11px", background: "#43B5C1", color: "#fff", border: "2px solid #43B5C1", borderRadius: "0px" }}>
                                                    <Typography variant='body'>Co-Scholastic Subject</Typography>
                                                </Stack>
                                                <Table sx={{ overflow: "hidden" }} size="TablePropsSizeOverrides" aria-label="a dense table">
                                                    <TableHead>
                                                        <TableRow>
                                                            {currentRows[0].CoScholasticSubject.slice() // Create a copy of the array to avoid modifying the original array
                                                                .sort((a, b) => a.subject_name.localeCompare(b.subject_name)
                                                                ).map((subject, index) => (
                                                                    <TableCell align="center" key={subject.id + "-" + index} style={{ padding: "10px 12px" }}>
                                                                        <Typography variant='body' sx={{ fontSize: "14px", width: "fit-content", textAlign: "center", fontWeight: "600" }}>{(subject.subject_name).toUpperCase()}</Typography>
                                                                        <Stack style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3px" }}>
                                                                            <Typography variant='body' sx={{ fontSize: "11px", opacity: "50%", width: "fit-content", textAlign: "center", fontWeight: "500", lineHeight: "14px", }} style={editableSx} onClick={() => handleChangeMMark(subject.subject_name, subject.max_marks, subject.min_marks, subject.id, "CoScholasticSubject", "text")}>Max:{subject.max_marks}</Typography>
                                                                            <Typography variant='body' sx={{ fontSize: "11px", opacity: "50%", width: "fit-content", textAlign: "center", fontWeight: "500", lineHeight: "14px", }} style={editableSx} onClick={() => handleChangeMMark(subject.subject_name, subject.max_marks, subject.min_marks, subject.id, "CoScholasticSubject", "text")}>Min:{subject.min_marks}</Typography>
                                                                        </Stack>
                                                                    </TableCell>
                                                                ))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {currentRows.slice() // Create a copy of the array to avoid modifying the original array
                                                            .sort((a, b) =>
                                                                (a.student_details?.first_name || '').localeCompare(
                                                                    b.student_details?.first_name || ''
                                                                )
                                                            ).map((item, index) => (
                                                                <TableRow key={item.student_details.user + "-" + index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                    {item.CoScholasticSubject.slice() // Create a copy of the array to avoid modifying the original array
                                                                        .sort((a, b) =>
                                                                            a.subject_name.localeCompare(b.subject_name)
                                                                        ).map((subject, subIndex) => (
                                                                            <TableCell key={subject.id + "-" + subIndex} component="th" scope="row" sx={{ fontSize: "12px", textAlign: "center", fontWeight: "600", paddingTop: '12px', paddingBottom: '12px' }}>
                                                                                <span style={editableSx} onClick={() => handleChangeMarks(subject.subject_name, (subject.optional == "True" ? ("-") : ((subject.grade == 0 ? '0' : subject.grade) || "AB")), subject.id, (`${item?.student_details?.first_name ?? ''} ${item?.student_details?.middle_name ?? ''} ${item?.student_details?.last_name ?? ''}`), "CoScholasticSubject", "text")}>
                                                                                    {/* {subject.marks == true ? (null) : (subject.grade || "AB")} */}
                                                                                    {subject.optional == "True" ? ("-") : ((subject.grade == 0 ? '0' : subject.grade) || "AB")}
                                                                                </span>
                                                                            </TableCell>
                                                                        ))}
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}

                                        {/* Curricular */}
                                        {Array.isArray(currentRows) && currentRows.length > 0 && currentRows[0].CoCurricularSubject.length > 0 && (
                                            <TableContainer style={{ marginLeft: "0px", minWidth: "fit-content" }} sx={{ width: "100%", overflow: "hidden" }} key={currentRows[0].student_details.user + 3}>
                                                <Stack style={{ width: "98%", marginLeft: "auto", textAlign: "center", fontSize: "14px", padding: "5px 11px", background: "#43B5C1", color: "#fff", border: "2px solid #43B5C1", borderRadius: "0px" }}>
                                                    <Typography variant='body'>Co-Curricular Subject</Typography>
                                                </Stack>
                                                <Table sx={{ overflow: "hidden" }} size="TablePropsSizeOverrides" aria-label="a dense table">
                                                    <TableHead>
                                                        <TableRow>
                                                            {currentRows[0].CoCurricularSubject.slice() // Create a copy of the array to avoid modifying the original array
                                                                .sort((a, b) => a.subject_name.localeCompare(b.subject_name)
                                                                ).map((subject, index) => (
                                                                    <TableCell align="center" key={subject.id + "-" + index} style={{ padding: "10px 12px" }}>
                                                                        <Typography variant='body' sx={{ fontSize: "14px", width: "fit-content", textAlign: "center", fontWeight: "600" }}>{(subject.subject_name || "Name").toUpperCase()}</Typography>
                                                                        <Stack style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3px" }}>
                                                                            <Typography variant='body' sx={{ fontSize: "11px", opacity: "50%", width: "fit-content", textAlign: "center", fontWeight: "500", lineHeight: "14px", }} style={editableSx} onClick={() => handleChangeMMark(subject.subject_name, subject.max_marks, subject.min_marks, subject.id, "CoScholasticSubject", "number")}>Max:{subject.max_marks}</Typography>
                                                                            <Typography variant='body' sx={{ fontSize: "11px", opacity: "50%", width: "fit-content", textAlign: "center", fontWeight: "500", lineHeight: "14px", }} style={editableSx} onClick={() => handleChangeMMark(subject.subject_name, subject.max_marks, subject.min_marks, subject.id, "CoScholasticSubject", "number")}>Min:{subject.min_marks}</Typography>
                                                                        </Stack>
                                                                    </TableCell>
                                                                ))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {currentRows.slice() // Create a copy of the array to avoid modifying the original array
                                                            .sort((a, b) =>
                                                                (a.student_details?.first_name || '').localeCompare(
                                                                    b.student_details?.first_name || ''
                                                                )
                                                            ).map((item, index) => (
                                                                <TableRow key={item.student_details.user + "-" + index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                    {item.CoCurricularSubject.slice() // Create a copy of the array to avoid modifying the original array
                                                                        .sort((a, b) =>
                                                                            a.subject_name.localeCompare(b.subject_name)
                                                                        ).map((subject, subIndex) => (
                                                                            <TableCell key={subject.id + "-" + subIndex} component="th" scope="row" sx={{ fontSize: "12px", textAlign: "center", fontWeight: "600", paddingTop: '12px', paddingBottom: '12px' }}>
                                                                                <span style={editableSx} onClick={() => handleChangeMarks(subject.subject_name, ((subject.marks == 0 ? '0' : subject.marks) || "AB"), subject.id, (`${item?.student_details?.first_name ?? ''} ${item?.student_details?.middle_name ?? ''} ${item?.student_details?.last_name ?? ''}`), "CoCurricularSubject", "number", subject.max_marks, subject.min_marks)}  >
                                                                                    {((subject.marks == 0 ? '0' : subject.marks) || "AB")}
                                                                                </span>
                                                                            </TableCell>
                                                                        ))}
                                                                </TableRow>
                                                            ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        )}

                                        {/* Remarks */}
                                        <TableContainer style={{ marginLeft: "0px", minWidth: "490px" }} sx={{ width: "100%", overflow: "hidden" }} >
                                            <Stack style={{ width: "100%", margin: "auto", textAlign: "center", fontSize: "14px", padding: "5px 11px", background: "#fff", color: "#fff", border: "2px solid #fff", borderRadius: "0px" }}>
                                                <Typography variant='body'>hidden </Typography>
                                            </Stack>
                                            <Table sx={{ overflow: "hidden" }} size="TablePropsSizeOverrides" aria-label="a dense table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="center" style={{ padding: "10px 12px 10px 70px" }}>
                                                            <Typography variant='body' sx={{ fontSize: "14px", width: "fit-content", textAlign: "center", fontWeight: "600" }}>Attendance</Typography>
                                                            <Stack style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3px" }}>
                                                                <Typography variant='body' sx={{ fontSize: "11px", opacity: "50%", width: "fit-content", textAlign: "center", fontWeight: "500", lineHeight: "14px", visibility: "hidden" }}>hidden</Typography>
                                                                <Typography variant='body' sx={{ fontSize: "11px", opacity: "50%", width: "fit-content", textAlign: "center", fontWeight: "500", lineHeight: "14px", visibility: "hidden" }}>hidden</Typography>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell align="left" style={{ padding: "10px 12px 10px 70px" }}>
                                                            <Typography variant='body' sx={{ fontSize: "14px", width: "fit-content", textAlign: "left", fontWeight: "600" }}>Remark</Typography>
                                                            <Stack style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "3px" }}>
                                                                <Typography variant='body' sx={{ fontSize: "11px", opacity: "50%", width: "fit-content", textAlign: "center", fontWeight: "500", lineHeight: "14px", visibility: "hidden" }}>hidden</Typography>
                                                                <Typography variant='body' sx={{ fontSize: "11px", opacity: "50%", width: "fit-content", textAlign: "center", fontWeight: "500", lineHeight: "14px", visibility: "hidden" }}>hidden</Typography>
                                                            </Stack>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {Array.isArray(currentRows) && currentRows.length > 0 ? (
                                                        currentRows.slice() // Create a copy of the array to avoid modifying the original array
                                                            .sort((a, b) =>
                                                                (a.student_details?.first_name || '').localeCompare(
                                                                    b.student_details?.first_name || ''
                                                                )
                                                            ).map((item, index) => (
                                                                <TableRow key={item.student_details.user + "-" + index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                    {item.attendenceRemark ? (
                                                                        <React.Fragment>
                                                                            <TableCell align="center" sx={editableSx} style={{ padding: "16px", paddingLeft: "70px", fontWeight: "600", paddingTop: '12px', paddingBottom: '12px' }} onClick={() => handleChangeMarks("Attendance", (item.attendenceRemark.attedence || 0), item.attendenceRemark.attendance_id, (`${item?.student_details?.first_name ?? ''} ${item?.student_details?.middle_name ?? ''} ${item?.student_details?.last_name ?? ''}`), "attendance", "number")} >{item.attendenceRemark.attedence == null ? ("Attendence") : (item.attendenceRemark.attedence)}</TableCell>
                                                                            <TableCell align="left" sx={editableSx} style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", overflow: "hidden", padding: "16px", paddingLeft: "70px", fontWeight: "600", paddingTop: '12px', paddingBottom: '12px' }} onClick={() => handleChangeMarks("Remark", (item.attendenceRemark.remark || '-'), item.attendenceRemark.attendance_id, (`${item?.student_details?.first_name ?? ''} ${item?.student_details?.middle_name ?? ''} ${item?.student_details?.last_name ?? ''}`), "remark", "text")} >{item.attendenceRemark.remark || "Remark"}</TableCell>
                                                                        </React.Fragment>
                                                                    ) : (
                                                                        <React.Fragment>
                                                                            <TableCell align="center">0</TableCell>
                                                                            <TableCell align="left">-</TableCell>
                                                                        </React.Fragment>
                                                                    )}
                                                                </TableRow>
                                                            ))
                                                    ) : null}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Stack>
                                    // </div>
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} align="center">
                                            No Data
                                        </TableCell>
                                    </TableRow>
                                )}

                            </div>
                        </Paper>
                        <EditBox open={openEditBox} setOpen={setOpenEditBox} data={editDetails} maxDays={resultDetail?.max_day_of_attedance} />
                        <EditBoxMarks open={openEditMarkBox} setOpen={setOpenEditMarkBox} data={editMarkDetails} />
                        <EditBoxAttendance open={openEditAttBox} setOpen={setOpenEditAttBox} data={editAttDetails} />
                    </>)}
                </Paper>
            </Container>
            <Box margin={2}>
                {/* Pagenation with next preview button*/}
                <Box margin={2}>{renderPageNumbers()}</Box>
            </Box>
        </Box >
    )
}
