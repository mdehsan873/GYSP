import { Button, CssBaseline, Box, Checkbox, IconButton, Stack, Grid, FormLabel, FormControl, Select, MenuItem, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import TableWrapper from "../../components/wrappers/TableWrapper";
import Paper from "@mui/material/Paper";
import AddStudentDialog from "../../components/dialogs/students/AddStudentDialog";
import AxiosObj from "../../axios/AxiosObj";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import EditStudentDialog from "../../components/dialogs/students/EditStudentDialog";
import AddBulkStudent from "../../components/dialogs/AddBulkStudent";
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
// import TablePagination from '@mui/material/TablePagination';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { getAxiosWithToken } from "../../axios/AxiosObj";
import { toast } from 'react-toastify';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import * as XLSX from 'xlsx';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import ExcelListing from '../../components/dialogs/ExcelListing';
import secureLocalStorage from "react-secure-storage";
import { resetLocal } from './../../partials/localStorage'
import CloseIcon from '@mui/icons-material/Close';

export default function Students() {
    const { sessions, classAndSection } = useSelector((state) => state.infra);

    const [open, setOpen] = useState(false);
    const [openBox2, setOpenBox2] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const [secId, setSecId] = useState(0);
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
    // const [totalPage, setTotalPage] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [studentList, setStudentList] = useState([]);
    const [studentRAWList, setStudentRAWList] = useState([]);

    const [viewDetails, setViewDetails] = useState('');
    const [openViewBox, setOpenViewBox] = useState(false);

    const columns = [
        "Name",
        "Reg no",
        "Session",
        "Class",
        "View",
        "Edit",
    ];

    const fetchData2 = async (page, limit) => {
        setLoading(true)
        setNextPage(null)
        setPreviousPage(null)
        let sessionApiFilter = '';
        let classApiFilter = '';
        let searchApiFilter = '';
        let sectionApiFilter = '';
        let pagel = '';

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
        if (page != "0") {
            pagel = `page=${currentPage}`
        }

        try {

            let config = {
                method: 'GET',
                maxBodyLength: Infinity,
                url: `student/get/all/?${pagel}&limit=${limit}${sessionApiFilter}${classApiFilter}${sectionApiFilter}${searchApiFilter}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                },
            };
            const AxiosObj = getAxiosWithToken();

            const response = await AxiosObj.request(config);
            // const response = await AxiosObj.get();
            setStudentRAWList(response.data.results);
            setNextPage(response.data.next);
            setPreviousPage(response.data.previous);
            setTotalStudent(response.data.count);
            if (response.data.count == 0) {
                setCurrentPage(1)
            }
            setLoading(false)
            // setTotalPage(Math.ceil(response.data.count / limit));
        } catch (error) {
            console.log(error);
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchData2(currentPage, rowsPerPage);
    }, [currentPage, rowsPerPage, sessionFilterValue, classFilterValue, sectionFilterValue, openEdit]);

    useEffect(() => {
        fetchData2(1, rowsPerPage);
        setCurrentPage(1);
    }, [studentSearchFilter]);

    const handleClose = () => {
        setOpenBox2(false)
    };

    const handleStudentSearch = (event) => {
        setStudentSearchFilter(event.target.value);
        setCurrentPage(1)
    };

    const handleFilterChange = async (e) => {
        const { name, value } = e.target;
        if (name === "session") {
            secureLocalStorage.setItem("studentSessionFilter", value);
            secureLocalStorage.setItem("studentCurrentPage", 1)
            setSessionFilterValue(value);
            setCurrentPage(1)
        }

        if (name === "class") {
            secureLocalStorage.setItem("studentClassFilter", value);
            secureLocalStorage.setItem("studentCurrentPage", 1)
            setClassFilterValue(value);
            setCurrentPage(1)
        }

        if (name === "section") {
            secureLocalStorage.setItem("studentSectionFilter", value);
            secureLocalStorage.setItem("studentCurrentPage", 1)
            setSectionFilterValue(value);
            setCurrentPage(1)
        }

        if (name == 'sorting') {
            setCurrentPage(1)
            secureLocalStorage.setItem("studentSortingFilter", value);
            secureLocalStorage.setItem("studentCurrentPage", 1)
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

        if (sortingFilterValue == 'za') {
            filteredStudents.sort((a, b) =>
                b?.student_details?.first_name?.localeCompare(a?.student_details?.first_name)
            );
        } else if (sortingFilterValue == 'az') {
            filteredStudents.sort((a, b) =>
                a?.student_details?.first_name?.localeCompare(b?.student_details?.first_name)
            );
        } else {
            filteredStudents.sort((a, b) =>
                a?.student_details?.first_name?.localeCompare(b?.id)
            );
        }

        // Update the state with the sorted data
        setStudentList(filteredStudents.sort((a, b) => {
            // Create a copy of the array to avoid mutating the original
            // Compare by class_name first
            const classA = parseInt(a.class_name, 10);
            const classB = parseInt(b.class_name, 10);

            if (classA < classB) return -1;
            if (classA > classB) return 1;

            // If class_names are equal, compare by student_details.first_name
            if (a.student_details) {
                if (a.student_details.first_name < b.student_details.first_name) return -1;
                if (a.student_details.first_name > b.student_details.first_name) return 1;
            } else {
                if (a.first_name < b.first_name) return -1;
                if (a.first_name > b.first_name) return 1;
            }

            return 0; // Elements are equal
        }));

    }, [studentRAWList, sortingFilterValue]);

    useEffect(() => {
        resetLocal("student");
    }, []);

    useEffect(() => {
        let filteredClass = classAndSection.filter((ccs) => {
            const classMatch = 'all';
            return classMatch;
        });
        setClassFilterArray(filteredClass);

        let filteredSection = classAndSection.filter((section) => {
            const sectionMatch = 'all' ;
            return sectionMatch;
        });
        setSectionFilterArray(filteredSection);

    }, [sessionFilterValue]);
    useEffect(() => {
        setSessionFilterValue(sessions[0]?.id)
    }, [sessions]);

    useEffect(() => {
        let filteredSection = classAndSection.filter((section) => {
            const sectionMatch = classFilterValue === 'all' || section.class_id == classFilterValue;
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
        secureLocalStorage.setItem("studentPerPage", parseInt(event.target.value, 10))
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
        setLoading(true)
        let errorLE = false;
        try {
            selectedRows.forEach((id) => {
                let data;
                let config = {
                    method: 'DELETE',
                    maxBodyLength: Infinity,
                    url: `student/delete/${id.id}/`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
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
            if (secureLocalStorage.getItem("countStudent")) {
                secureLocalStorage.removeItem("countStudent")
            }
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }
    // Download
    // Helper function to convert a string to an ArrayBuffer
    const s2ab = (s) => {
        const buf = new ArrayBuffer(s.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
    };

    const handleDownloadSelectedRows = async () => {

        // const selectedIds = selectedRows.map((item) => item.id);
        // const filteredData = studentRAWList.filter((item) =>
        //     selectedIds.includes(item.id)
        // );

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
            let config = {
                method: 'GET',
                maxBodyLength: Infinity,
                url: `student/get/all/?${sessionApiFilter}${classApiFilter}${sectionApiFilter}${searchApiFilter}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                },
            };
            const AxiosObj = getAxiosWithToken();

            const response = await AxiosObj.request(config);

            const extractedData = response.data.results.map((item, index = 0) => ({
                'First Name': item.student_details.first_name,
                'Middle Name': item.student_details.middle_name,
                'Last Name': item.student_details.last_name,
                'Date Of Birth': formatDate(item.student_details.dob),
                'Email': item.student_details.email,
                'Registration Number': item.registration_no,
                'Father Name': item.student_details.father_name,
                'Mother Name': item.student_details.mother_name,
                'Phone Number': item.student_details.phone_no,
                'Address Line 1': item.student_details.address_line1,
                'Address Line 2': item.student_details.address_line2,
                'City': item.student_details.city,
                'State': item.student_details.state,
                'Country': item.student_details.country,
                'Pincode': item.student_details.pincode,
                'Gender': item.student_details.gender,
                'Session': item.session,
                'Class': (item.class_name).toUpperCase(),
                'Section': (item.section).toUpperCase(),
            }));

            // Create a new workbook and worksheet
            const workbook = XLSX.utils.book_new();
            const worksheet = XLSX.utils.json_to_sheet(extractedData);

            // Add the worksheet to the workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

            // Generate a binary string from the workbook
            const excelBinaryString = XLSX.write(workbook, {
                type: 'binary',
                bookType: 'xlsx',
            });

            // Convert the binary string to a Blob
            const excelBlob = new Blob([s2ab(excelBinaryString)], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });

            // Create a download link
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL(excelBlob);
            downloadLink.download = 'Student Details.xlsx';

            // Simulate a click to trigger the download
            downloadLink.click();
        } catch (error) {
            console.log(error);
        }
    }

    // const viewStudentPage = (id, change_session_id) => {
    //     setViewDetails({
    //         "id": id,
    //         "change_session_id": change_session_id,
    //     });
    //     setOpenViewBox(true);
    // };

    const viewStudentPage2 = (id, cid) => {
        // Construct the new URL with query parameters
        const newUrl = `?id=${id}&cid=${cid}`;

        // Change the URL without refreshing the page
        window.history.pushState(null, '', newUrl);

        // Trigger any additional logic you want based on the updated URL
    };

    const [excelApiUrl, setExcelApiUrl] = useState('');
    const [excelType, setExcelType] = useState('');
    const [openViewExcelBox, setOpenViewExcelBox] = useState(false);

    const viewStudentExcel = () => {
        setExcelApiUrl('student/get/csv/');
        setExcelType('student');
        setOpenViewExcelBox(true);
    };

    // useEffect(() => {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const id = urlParams.get('id');
    //     const cid = urlParams.get('cid');

    //     if (id && cid) {  // Use '&&' instead of '&'
    //         viewStudentPage(id, cid);
    //     } else {
    //         setViewDetails('');
    //         setOpenViewBox(false);
    //     }
    // }, [window.location]);

    useEffect(() => {
        if (secureLocalStorage.getItem("studentSortingFilter")) {
            setSortingFilterValue(secureLocalStorage.getItem("studentSortingFilter"))
        }
        if (secureLocalStorage.getItem("studentSectionFilter")) {
            setSectionFilterValue(secureLocalStorage.getItem("studentSectionFilter"))
        }
        if (secureLocalStorage.getItem("studentClassFilter")) {
            setClassFilterValue(secureLocalStorage.getItem("studentClassFilter"))
        }
        if (secureLocalStorage.getItem("studentSessionFilter")) {
            setSessionFilterValue(secureLocalStorage.getItem("studentSessionFilter"))
        }
        if (secureLocalStorage.getItem("studentCurrentPage")) {
            setCurrentPage(secureLocalStorage.getItem("studentCurrentPage"))
        }
        if (secureLocalStorage.getItem("studentPerPage")) {
            setRowsPerPage(secureLocalStorage.getItem("studentPerPage"))
        }
    }, []);

    const clearSearchFlied = () => {
        if (studentSearchFilter.length !== 0) {
            setStudentSearchFilter('')
        }
    }


    return (
        <>
            <CssBaseline />
            <Box sx={{ width: "100%" }} >
                <Box margin={2}>
                    <Link
                        className="secondary"
                        to={'/'}
                        style={{ margin: "10px", marginBottom: "0px", display: "flex", cursor: "pointer", alignItems: "center", color: "#3D3D3D", fontSize: "12px" }}
                    >
                        <ArrowBackIosIcon style={{ marginRight: "4px", fontSize: "12px" }} /> Back
                    </Link>
                </Box>
                <TableWrapper>
                    <Box>
                        <Stack direction={'row'} justifyContent='space-between'>
                            <Stack direction={'row'} alignItems={"center"} mx={3} mt={2} mb={1} spacing={1}>
                                <SchoolOutlinedIcon style={{ width: "30px", height: "auto" }} />
                                <Typography fontWeight={'bold'} style={{ marginLeft: "14px" }} variant={'h6'} >Students</Typography>
                            </Stack>
                            <Stack direction={'row'} alignItems={"center"} mx={3} mt={2} mb={1} spacing={1}>
                                <Stack direction={'row'} alignItems={"center"} mx={1}>
                                    <FilePresentIcon style={{ width: "20px", height: "auto" }} />
                                    <Button onClick={viewStudentExcel} style={{ marginRight: "10px", color: "#3D3D3D", fontSize: "13px", fontWeight: "600" }}>View Uploaded Excel</Button>
                                </Stack>
                                <Stack direction={'row'} alignItems={"center"} mx={1}>
                                    <svg style={{ width: "20px", height: "auto" }} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M480-313 287-506l43-43 120 120v-371h60v371l120-120 43 43-193 193ZM220-160q-24 0-42-18t-18-42v-143h60v143h520v-143h60v143q0 24-18 42t-42 18H220Z" /></svg>
                                    <Button onClick={handleDownloadSelectedRows} style={{ marginRight: "10px", color: "#3D3D3D", fontSize: "13px", fontWeight: "600" }}>Download Students</Button>
                                </Stack>
                                <Stack direction={'row'} alignItems={"center"} mx={1}>
                                    <svg style={{ width: "20px", height: "auto" }} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M180-120q-24 0-42-18t-18-42v-523q0-15 3-25.5t11-19.5l56-76q8-9 18.5-12.5t24.886-3.5h493.228Q741-840 751-836.5t18 12.5l57 76q8 9 11 19.5t3 25.5v523q0 24-18 42t-42 18H180Zm17-614h565l-36.409-46H233l-36 46Zm-17 60v494h600v-494H180Zm300 404 156-156-40-40-86 86v-201h-60v201l-86-86-40 40 156 156Zm-300 90h600-600Z" /></svg>
                                    <Button component={Link} style={{ marginRight: "10px", color: "#3D3D3D", fontSize: "13px", fontWeight: "600" }} to={'/students-move'}>Move Students</Button>
                                </Stack>
                                <Stack direction={'row'} alignItems={"center"} mx={1}>
                                    <svg style={{ width: "20px", height: "auto" }} xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M260-200q-24 0-42-18t-18-42v-160h60v160h560v-500H260v160h-60v-220q0-24 18-42t42-18h560q24 0 42 18t18 42v560q0 24-18 42t-42 18H260ZM140-80q-24 0-42-18t-18-42v-620h60v620h620v60H140Zm360-264-42-42 93-94H200v-60h351l-93-94 42-42 166 166-166 166Z" /></svg>
                                    <Button component={Link} style={{ marginRight: "10px", color: "#3D3D3D", fontSize: "13px", fontWeight: "600" }} to={'/archieved-students'}>Achieve List</Button>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>
                    <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                        <Stack direction={"row"} spacing={2} paddingLeft={2}>
                            <Button
                                color="info"
                                onClick={() => {
                                    setOpen(!open);
                                }}
                            >
                                {open ? "Close Form" : "+ Add Student"}
                            </Button>
                            <Button color="info" onClick={() => setOpenBulkUpload(true)}>
                                + Add Bulk Student
                            </Button>
                        </Stack>
                    </Stack>
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
                        <div style={{ display: "flex", justifyContent: "flex-end" }} >
                            {selectedRows.length > 0 && (

                                <Stack style={{ margin: '0px 12px' }}>
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        style={{ background: 'red', color: '#fff', border: '0', textAlign: 'center' }}
                                        startIcon={<DeleteIcon style={{ margin: '0' }} />}
                                        onClick={handleDeleteSelectedRowsRqt}
                                    >
                                        Delete
                                    </Button>
                                </Stack>
                            )}
                        </div>
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
                                    <input value={studentSearchFilter} onChange={handleStudentSearch} placeholder='Search Student' title="Search Student by Name, Reg No., Class and Section" style={{ border: "0", color: "#BEBEBE", width: "210px" }} />
                                    {
                                        studentSearchFilter.length == 0 ? (
                                            <SearchIcon style={{ border: "0", color: "#BEBEBE", }} />) : (
                                            <CloseIcon style={{ border: "0", color: "#BEBEBE", cursor: "pointer" }} onClick={clearSearchFlied} />
                                        )
                                    }
                                </FormControl>
                            </FormControl>
                        </Grid>
                    </Stack>
                    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: "none" }}>
                        {loading ? (
                            <Loader />
                        ) : (
                            <>
                                <TableContainer component={Paper} sx={{ maxHeight: 600, boxShadow: "none" }}>
                                    <Table stickyHeader sx={{ minWidth: 650 }} aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell align="left" style={{ padding: "8px", height: "20px" }}>
                                                    {studentList.length == 0 ? null : (<Checkbox
                                                        indeterminate={selectedRows.length > 0 && selectedRows.length < studentList.length}
                                                        checked={selectedRows.length === studentList.length}
                                                        onChange={handleSelectAllRows}
                                                    />)}
                                                </TableCell>
                                                <TableCell align="left" style={{ padding: "8px", height: "20px" }}>
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
                                                studentList.sort((a, b) => {
                                                    // Create a copy of the array to avoid mutating the original
                                                    // Compare by class_name first
                                                    const classA = parseInt(a.class_name, 10);
                                                    const classB = parseInt(b.class_name, 10);

                                                    if (classA < classB) return -1;
                                                    if (classA > classB) return 1;

                                                    // If class_names are equal, compare by student_details.first_name
                                                    if (a.student_details) {
                                                        if (a.student_details.first_name < b.student_details.first_name) return -1;
                                                        if (a.student_details.first_name > b.student_details.first_name) return 1;
                                                    } else {
                                                        if (a.first_name < b.first_name) return -1;
                                                        if (a.first_name > b.first_name) return 1;
                                                    }

                                                    return 0; // Elements are equal
                                                }).map((row, index) => (
                                                    <TableRow
                                                        key={index}
                                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                    >
                                                        <TableCell style={{ padding: "8px", height: "20px" }}>
                                                            <Checkbox
                                                                style={{ paddingTop: "0", paddingBottom: "0" }}
                                                                checked={isSelected(row.id)}
                                                                onChange={() => handleSelectRow(row.id)}
                                                            />
                                                        </TableCell>
                                                        <TableCell style={{ padding: "8px", height: "20px" }}>
                                                            {currentPage * rowsPerPage - rowsPerPage + index + 1}
                                                        </TableCell >
                                                        <TableCell style={{ padding: "8px", height: "20px" }} align="left">{row.student_details?.first_name + ' ' + (row.student_details?.middle_name == null ? ("") : (row.student_details?.middle_name)) + ' ' + (row.student_details?.last_name == null ? ("") : (row.student_details?.last_name))}</TableCell>
                                                        <TableCell style={{ padding: "8px", height: "20px" }} align="center">{row.registration_no}</TableCell>
                                                        <TableCell style={{ padding: "8px", height: "20px" }} align="center">{row.session}</TableCell>
                                                        <TableCell style={{ padding: "8px", height: "20px" }} align="center">{`${row?.class_name} ${row?.section}`.toUpperCase()}</TableCell>
                                                        <TableCell style={{ padding: "8px" }} align="center"><Link className="secondary" to={`/student-details/${row?.id}/${row?.change_session_id}`}>View Student</Link></TableCell>
                                                        <TableCell style={{ padding: "8px", height: "20px" }} align="center">
                                                            <Button
                                                                color="info"
                                                                onClick={() => {
                                                                    setSelectedId(row?.id.toString());
                                                                    setSecId(row?.change_session_id.toString());
                                                                    setOpenEdit(true);
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                        </TableCell>
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
                                    {/* <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, 50]}
                                    component="div"
                                    count={studentList.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handlePageChange}
                                    onRowsPerPageChange={handleRowsPerPageChange}
                                /> */}
                                </TableContainer>
                                <Stack spacing={2} direction="row" p={2} alignItems="center" justifyContent="flex-end">
                                    <Stack style={{ width: "10%", fontSize: "12px" }} alignItems="center" direction="row">
                                        <FormLabel style={{ fontSize: "12px" }}>Rows per page:</FormLabel>
                                        <FormControl variant="standard" sx={{ width: '38%', ml: 2 }}>
                                            <Select
                                                labelId="gender-simple-select-standard-label"
                                                id="gender-simple-select-standard"
                                                value={rowsPerPage}
                                                style={{ fontSize: "12px" }}
                                                onChange={handleRowsPerPageChange}
                                            >
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={25}>25</MenuItem>
                                                <MenuItem value={50}>50</MenuItem>
                                                <MenuItem value={100}>100</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                    <Stack style={{ width: "fit-content", fontSize: "12px" }} sx={{ ml: 0 }} direction="row">
                                        {currentPage * rowsPerPage - rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, totalStudent)} of {totalStudent}
                                    </Stack>
                                    <Stack style={{ width: "fit-content" }} gap={2} sx={{ ml: 0 }} direction="row">
                                        <IconButton
                                            disabled={!previousPage}
                                            onClick={() => {
                                                setCurrentPage(currentPage - 1)
                                                secureLocalStorage.setItem("studentCurrentPage", currentPage - 1)
                                            }}
                                        >
                                            <KeyboardArrowLeftIcon />
                                        </IconButton>

                                        <IconButton
                                            disabled={!nextPage}
                                            onClick={() => {
                                                setCurrentPage(currentPage + 1)
                                                secureLocalStorage.setItem("studentCurrentPage", currentPage + 1)
                                            }}
                                        >
                                            <KeyboardArrowRightIcon />
                                        </IconButton>
                                    </Stack>
                                </Stack>
                            </>
                        )}
                    </Paper>
                    <AddStudentDialog open={open} setOpen={setOpen} />
                    <EditStudentDialog open={openEdit} setOpen={setOpenEdit} id={selectedId} secId={secId} />
                    <AddBulkStudent open={openBulkUpload} setOpen={setOpenBulkUpload} />
                </TableWrapper>
            </Box >
            <ExcelListing open={openViewExcelBox} setOpen={setOpenViewExcelBox} apiUrl={excelApiUrl} type={excelType} />
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
