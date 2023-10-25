import { Button, CssBaseline, Box, Checkbox, IconButton, Stack, Grid, FormLabel, FormControl, Select, MenuItem, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import TableWrapper from "../../components/wrappers/TableWrapper";
import Paper from "@mui/material/Paper";
import AxiosObj from "../../axios/AxiosObj";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import DeleteIcon from '@mui/icons-material/Delete';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import SearchIcon from '@mui/icons-material/Search';
import TablePagination from '@mui/material/TablePagination';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-toastify';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { resetLocal } from './../../partials/localStorage'

export default function Students() {
    const { sessions, classAndSection } = useSelector((state) => state.infra);
  
    useEffect(() => {
        resetLocal("student");
    }, []);

    const [open, setOpen] = useState(false);
    const [openBox2, setOpenBox2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const [openEdit, setOpenEdit] = useState(false);

    const [openBulkUpload, setOpenBulkUpload] = useState(false);

    // Filter
    const [studentSearchFilter, setStudentSearchFilter] = useState("");
    const [sessionFilterValue, setSessionFilterValue] = useState(sessions[0]?.id);
    const [classFilterValue, setClassFilterValue] = useState("all");
    const [sectionFilterValue, setSectionFilterValue] = useState("all");
    const [sortingFilterValue, setSortingFilterValue] = useState('none');

    // Filter Array
    const [classFilterArray, setClassFilterArray] = useState([]);
    const [sectionFilterArray, setSectionFilterArray] = useState([]);

    // pagination
    const [nextPage, setNextPage] = useState("");
    const [previousPage, setPreviousPage] = useState("");
    const [totalStudent, setTotalStudent] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [studentList, setStudentList] = useState([]);
    const [studentRAWList, setStudentRAWList] = useState([]);

    const columns = [
        "Name",
        "Reg no",
        "Session",
        "Class",
        "View",
        // "Restore",
    ];

    const fetchData2 = async (page, limit) => {
        setNextPage(null)
        setPreviousPage(null)

        let sessionApiFilter = '';
        let classApiFilter = '';
        let searchApiFilter = '';
        let sectionApiFilter = '';
        if (sessionFilterValue != "all") {
            sessionApiFilter = `&session_id=${sessionFilterValue}`
        }
        if (classFilterValue != "all") {
            classApiFilter = `&class_id=${classFilterValue}`
        }
        if (sectionFilterValue != "all") {
            sectionApiFilter = `&section_id=${sectionFilterValue}`
        }
        if (studentSearchFilter != "") {
            searchApiFilter = `&search=${studentSearchFilter}`
        }

        try {
            const response = await AxiosObj.get(`student/get/archived/student/?page=${page}&limit=${limit}${sessionApiFilter}${classApiFilter}${sectionApiFilter}${searchApiFilter}`);
            // const response = await AxiosObj.get(`student/get/archived/student/limit=${limit}${sessionApiFilter}`);
            // const response = await AxiosObj.get(`student/get/archived/student/?limit=${limit}${sessionApiFilter}`);
            setStudentRAWList(response.data.results);
            setNextPage(response.data.next);
            setPreviousPage(response.data.previous);
            setTotalStudent(response.data.count);
            setTotalPage(Math.ceil(response.data.count / limit));
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData2(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage, sessionFilterValue, classFilterValue, sectionFilterValue, studentSearchFilter, openEdit]);

    const handleClose = () => {
        setOpenBox2(false)
    };

    const handleStudentSearch = (event) => {
        setStudentSearchFilter(event.target.value);
    };

    const handleFilterChange = async (e) => {
        const { name, value } = e.target;
        if (name === "session") {
            setSessionFilterValue(value);
        }

        if (name === "class") {
            setClassFilterValue(value);
        }

        if (name === "section") {
            setSectionFilterValue(value);
        }

        if (name === 'sorting') {
            setSortingFilterValue(value);
        }
    };

    useEffect(() => {
        fetchData2(currentPage, rowsPerPage);
    }, []);

    useEffect(() => {
        setSectionFilterArray([...classAndSection])
        setClassFilterArray([...classAndSection])
    }, [classAndSection]);

    useEffect(() => {
        // Clone the studentRAWList to avoid mutating the original data
        const filteredStudents = [...studentRAWList];

        if (sortingFilterValue === 'za') {
            filteredStudents.sort((a, b) =>
                b.student_details.first_name.localeCompare(a.student_details.first_name)
            );
        } else if (sortingFilterValue === 'az') {
            filteredStudents.sort((a, b) =>
                a.student_details.first_name.localeCompare(b.student_details.first_name)
            );
        }

        // Update the state with the sorted data
        setStudentList(filteredStudents);

    }, [studentRAWList, sortingFilterValue]);


    useEffect(() => {
        let filteredClass = classAndSection.filter((ccs) => {
            const classMatch = sessionFilterValue === 'all' || ccs.session_id == sessionFilterValue;
            return classMatch;
        });
        setClassFilterArray(filteredClass);

        let filteredSection = classAndSection.filter((section) => {
            const sectionMatch = sessionFilterValue === 'all' || section.session_id == sessionFilterValue;
            return sectionMatch;
        });
        setSectionFilterArray(filteredSection);

    }, [sessionFilterValue]);
    useEffect(() => {
        setSessionFilterValue(sessions[0]?.id)
    }, [sessions]);

    useEffect(() => {
        let filteredSection = classAndSection.filter((section) => {
            const sectionMatch = classFilterValue === 'all' || section.class_id == classFilterValue && section.session_id == sessionFilterValue;
            return sectionMatch;
        });
        // console.log(classAndSection)
        setSectionFilterArray(filteredSection);
    }, [classFilterValue]);

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const [selectedRows, setSelectedRows] = useState([]);

    const isSelected = (id) => {
        return selectedRows.some((row) => row.id === id);
    };

    const handleSelectRow = (id) => {
        setSelectedRows((prevSelectedRows) => {
            const isRowSelected = isSelected(id);
            if (isRowSelected) {
                return prevSelectedRows.filter((row) => !(row.id === id));
            } else {
                return [...prevSelectedRows, { id }];
            }
        });
    };

    const handleSelectAllRows = (event) => {
        if (event.target.checked) {
            const selectedIds = studentList.map((row) => ({
                id: row.id,
            }));
            setSelectedRows(selectedIds);
        } else {
            setSelectedRows([]);
        }
    };
    const handleDeleteSelectedRowsRqt = () => {
        setOpenBox2(true)
    }
    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };

    const handleDeleteSelectedRows = () => {
        let errorLE = false;
        try {
            selectedRows.forEach((id) => {
                let data;
                let config = {
                    method: 'DELETE',
                    maxBodyLength: Infinity,
                    url: `student/delete/${id.id}/`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data
                };

                AxiosObj.request(config)
                    .catch((e) => {
                        errorLE = true;
                        try {
                            e.response.data?.Data.map((item) => {
                                toast.error(item || "Something went wrong...!");
                            });
                        } catch (ee) {
                            toast.error(e.response.data?.Data || "Something went wrong...!");
                        }
                        return errorLE = true;
                    })
                    .finally(() => setLoading(false));
            });
        } catch (e) {
            errorLE = true;
            toast.error(e.response.data?.Data || "Something went wrong...!");
            return errorLE = true;
        } finally {
        }
        if (errorLE === false) {
            toast.success("Student have been deleted");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }



    return (
        <>
            <CssBaseline />
            <Box sx={{ width: "100%" }}>
                <Box margin={2}>
                    <Link
                        className="secondary"
                        to={'/students'}
                        style={{ margin: "10px", marginBottom: "0px", display: "flex", cursor: "pointer", alignItems: "center", color: "#3D3D3D", fontSize: "14px", textDecoration: "none" }}
                    >
                        <ArrowBackIosIcon style={{ marginRight: "4px", fontSize: "12px" }} /> Back
                    </Link>
                </Box>
                <TableWrapper>
                    <Box>
                        <Stack direction={'row'} justifyContent='space-between'>
                            <Stack direction={'row'} alignItems={"center"} mx={3} mt={2} mb={1} spacing={1}>
                                <SchoolOutlinedIcon style={{ width: "30px", height: "auto" }} />
                                <Typography fontWeight={'bold'} style={{ marginLeft: "14px" }} variant={'h6'}>Archieve</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                
                    <Stack direction={"row"} alignItems={'center'} mt={1} mb={1} spacing={2} paddingLeft={2}>
                        <Stack style={{ margin: "0px 12px" }}>
                            <FormLabel style={{ color: "#000", fontSize: "16px", fontWeight: 600 }}>Filters</FormLabel>
                        </Stack>
                        <Grid container item spacing={1} lg={9} alignItems={'end'}>

                            <FormControl variant="standard" sx={{ width: '100px', margin: "0px 12px" }}>
                                <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Session</FormLabel>
                                <Select
                                    labelId="session-simple-select-standard-label"
                                    id="session-simple-select-standard"
                                    value={sessionFilterValue}
                                    name="session"
                                    onChange={handleFilterChange}
                                    style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                    label="Session"
                                >
                                    <MenuItem value={"all"}>All</MenuItem>
                                    {sessions.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" sx={{ width: '100px', margin: "0px 12px" }}>
                                <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Class</FormLabel>
                                <Select
                                    labelId="class-simple-select-standard-label"
                                    id="class-simple-select-standard"
                                    value={classFilterValue}
                                    name="class"
                                    onChange={handleFilterChange}
                                    style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                    label="class"
                                >
                                    <MenuItem value={"all"}>All</MenuItem>
                                    {classFilterArray.filter((item, index, self) => self.findIndex((i) => i.class_name === item.class_name) === index)
                                        .map((item) => (
                                            <MenuItem key={item.class_id} value={item.class_id}>{(item.class_name).toUpperCase()}</MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" sx={{ width: '100px', margin: "0px 12px" }}>
                                <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Section</FormLabel>
                                <Select
                                    labelId="section-simple-select-standard-label"
                                    id="section-simple-select-standard"
                                    value={sectionFilterValue}
                                    name="section"
                                    onChange={handleFilterChange}
                                    style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                    label="section"
                                >
                                    <MenuItem value={"all"}>All</MenuItem>
                                    {sectionFilterArray.filter((item, index, self) => self.findIndex((i) => i.section_name === item.section_name) === index)
                                        .map((item) => (
                                            <MenuItem key={item.section_id} value={item.section_id}>{(item.section_name).toUpperCase()}</MenuItem>
                                        ))}
                                </Select>
                            </FormControl>

                        </Grid>
                        {/* <div style={{ display: "flex", justifyContent: "flex-end" }} >
                            {selectedRows.length > 0 && (

                                <Stack style={{ margin: '0px 12px' }}>
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        style={{ background: '#1A73E8', color: '#fff', border: '0', textAlign: 'center' }}
                                        startIcon={<DeleteIcon style={{ margin: '0' }} />}
                                        onClick={handleDeleteSelectedRowsRqt}
                                    >
                                        Restore
                                    </Button>
                                </Stack>
                            )}
                        </div> */}
                        <Grid container alignItems="center" item lg={5} justifyContent={"flex-end"} style={{ marginRight: "12px" }}>
                            <FormControl variant="standard" sx={{ width: '100px', margin: '0px 12px' }}>
                                <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Sorting</FormLabel>
                                <Select
                                    labelId="sorting-simple-select-standard-label"
                                    id="sorting-simple-select-standard"
                                    value={sortingFilterValue}
                                    name="sorting"
                                    onChange={handleFilterChange}
                                    style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                    label="sorting"
                                >
                                    <MenuItem value="none">None</MenuItem>
                                    <MenuItem value="az">A-Z</MenuItem>
                                    <MenuItem value="za">Z-A</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" style={{ margin: "0px 12px", }}>
                                <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Search</FormLabel>
                                <FormControl variant="standard" sx={{ width: '230px', flexDirection: "row", alignItems: "center", borderBottom: "1px solid #BEBEBE" }}>
                                    <input value={studentSearchFilter} onChange={handleStudentSearch} placeholder='Search Student' title="Search Student by Name, Reg No., Class and Section" style={{ border: "0", color: "#BEBEBE", width: "210px" }} /><SearchIcon style={{ border: "0", color: "#BEBEBE", }} />
                                </FormControl>
                            </FormControl>
                        </Grid>
                    </Stack>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        {loading ? (
                            <Loader />
                        ) : (
                            <>
                                <TableContainer component={Paper} sx={{ maxHeight: 600, boxShadow: "none"}}>
                                    <Table stickyHeader sx={{ minWidth: 650 }} aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                {/* <TableCell align="left" style={{ padding: "8px", height: "20px" }}>
                                                    {studentList.length == 0 ? null : (<Checkbox
                                                        indeterminate={selectedRows.length > 0 && selectedRows.length < studentList.length}
                                                        checked={selectedRows.length === studentList.length}
                                                        onChange={handleSelectAllRows}
                                                    />)}
                                                </TableCell> */}
                                                <TableCell align="left" style={{ padding: "8px", height: "20px", paddingLeft:"25px"  }}>
                                                    <Typography variant='body' sx={{ fontSize: "14px", fontWeight: "600" }}>S. No</Typography>
                                                </TableCell>
                                                {columns.map((column, index) => (
                                                    <TableCell align={column === "Name" ? ("left") : ("center")} key={index} style={{ padding: "8px", height: "20px" }}>
                                                        <Typography variant='body' sx={{ fontSize: "14px", fontWeight: "600" }}>
                                                            {column}
                                                        </Typography>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {Array.isArray(studentList) && studentList.length > 0 ? (
                                                studentList.map((row, index) => (
                                                    <TableRow
                                                        key={index}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        {/* <TableCell style={{ padding: "8px", height: "20px" }}>
                                                            <Checkbox
                                                                style={{ paddingTop: "0", paddingBottom: "0" }}
                                                                checked={isSelected(row.id)}
                                                                onChange={() => handleSelectRow(row.id)}
                                                            />
                                                        </TableCell> */}
                                                        <TableCell style={{ padding: "8px", height: "20px", paddingLeft:"25px"  }}>
                                                            {currentPage * rowsPerPage - rowsPerPage + index + 1}
                                                        </TableCell >
                                                        <TableCell style={{ padding: "8px", height: "20px" }} align="left">{row.student_details?.first_name + ' ' + (row.student_details?.middle_name == null ? ("") : (row.student_details?.middle_name)) + ' ' + (row.student_details?.last_name == null ? ("") : (row.student_details?.last_name))}</TableCell>
                                                        <TableCell style={{ padding: "8px", height: "20px" }} align="center">{row.registration_no}</TableCell>
                                                        <TableCell style={{ padding: "8px", height: "20px" }} align="center">{row.session}</TableCell>
                                                        <TableCell style={{ padding: "8px", height: "20px" }} align="center">{`${row?.class_name} ${row?.section}`.toUpperCase()}</TableCell>
                                                        <TableCell style={{ padding: "8px", height: "20px" }} align="center"><Link className="secondary" to={`/student-details/${row?.id}/${row?.change_session_id}`}>View Student</Link></TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={8} align="center">
                                                        No Student
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <Stack spacing={2} direction="row" p={2} alignItems="center" justifyContent="flex-end">
                                    <Stack style={{ width: "10%" }} alignItems="center" direction="row">
                                        <FormLabel>Rows:</FormLabel>
                                        <FormControl variant="standard" sx={{ width: '80%', ml: 2 }}>
                                            <Select
                                                labelId="gender-simple-select-standard-label"
                                                id="gender-simple-select-standard"
                                                value={rowsPerPage}
                                                onChange={handleRowsPerPageChange}
                                            >
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={25}>25</MenuItem>
                                                <MenuItem value={50}>50</MenuItem>
                                                <MenuItem value={100}>100</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                    <Stack style={{ width: "fit-content" }} sx={{ ml: 0 }} direction="row">
                                        {currentPage * rowsPerPage - rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, totalStudent)} of {totalStudent}
                                    </Stack>
                                    <Stack style={{ width: "fit-content" }} gap={2} sx={{ ml: 0 }} direction="row">
                                        <IconButton
                                            disabled={!previousPage}
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                        >
                                            <KeyboardArrowLeftIcon />
                                        </IconButton>
                                        <IconButton
                                            disabled={!nextPage}
                                            onClick={() => setCurrentPage(currentPage + 1)}
                                        >
                                            <KeyboardArrowRightIcon />
                                        </IconButton>
                                    </Stack>
                                </Stack>
                            </>
                        )}
                    </Paper>
                </TableWrapper>
            </Box >
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
                    <Button onClick={handleDeleteSelectedRows} autoFocus>Agree</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
