import *  as React from 'react';
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useSelector } from 'react-redux';
import AlertDialog from './confimationBox';
import AxiosObj from '../../axios/AxiosObj';
import SearchIcon from '@mui/icons-material/Search';
import secureLocalStorage from "react-secure-storage";
import TablePagination from '@mui/material/TablePagination';
import { FormControl, FormLabel, Grid, MenuItem, Select, Stack } from '@mui/material';

export default function ExcelListing({ open, setOpen, apiUrl, type }) {
    const { classAndSection, sessions } = useSelector(state => state.infra)

    const [loading, setLoading] = useState(false)
    const [fileRAWList, setFileRAWList] = useState([])
    const [fileList, setFileList] = useState([])

    // Filter the stduent with pagination
    const [studentSearchFilter, setStudentSearchFilter] = useState("");
    const [sessionFilterValue, setSessionFilterValue] = useState(sessions[0]?.name);
    const [classFilterValue, setClassFilterValue] = useState("all");
    const [sectionFilterValue, setSectionFilterValue] = useState("all");
    const [sortingFilterValue, setSortingFilterValue] = useState('none');

    // Filter Array
    const [classFilterArray, setClassFilterArray] = useState([]);
    const [sectionFilterArray, setSectionFilterArray] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleClose = () => {
        setOpen(false);
        setLoading(false);
        setFileList([]);
        setFileRAWList([]);
        setStudentSearchFilter('');
        setSessionFilterValue(sessions[0]?.name);
        setClassFilterValue('');
        setSectionFilterValue('');
        setSortingFilterValue('');
        setClassFilterArray([]);
        setSectionFilterArray([]);
        setPage(0)
        setRowsPerPage(10)
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', options);
    };
    useEffect(() => {
        if (open === true && apiUrl !== '') {
            setSessionFilterValue(sessions[0]?.name)
            fetchData2();
            setClassFilterValue('all')
            setSectionFilterValue('all')
            setSortingFilterValue('none')
        }
    }, [open, apiUrl]);

    useEffect(() => {
        // if (open === true) {
        setSessionFilterValue(sessions[0]?.name)
        // }
    }, [sessions, open]);

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

    const fetchData2 = async () => {
        try {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${apiUrl}`,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                }
            };
            const response = await AxiosObj.request(config);
            setFileRAWList(response.data.Data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        let filteredFile = [];
        const filterArray = async () => {
            if (type == 'result') {
                filteredFile = await fileRAWList.filter((file) => {
                    const sessionMatch = sessionFilterValue === 'all' || file.session == sessionFilterValue;
                    const classMatch = classFilterValue === 'all' || file.class_name == classFilterValue;
                    const sectionMatch = sectionFilterValue === 'all' || file.section_name == sectionFilterValue;
                    const nameMatch = studentSearchFilter.trim() === '' || file.file_name.includes(studentSearchFilter);
                    return sessionMatch && classMatch && sectionMatch && nameMatch;
                });
            }
            if (type == 'student') {
                filteredFile = await fileRAWList.filter((file) => {
                    const sessionMatch = sessionFilterValue === 'all' || file.session == sessionFilterValue;
                    const nameMatch = studentSearchFilter.trim() === '' || file.file_name.includes(studentSearchFilter);
                    return sessionMatch && nameMatch;
                });
            }

            if (type == 'teacher') {
                filteredFile = await fileRAWList.filter((file) => {
                    // const nameMatch = studentSearchFilter.trim() === '' || file.file_name == studentSearchFilter;
                    const nameMatch = studentSearchFilter.trim() === '' || file.file_name.includes(studentSearchFilter);
                    return nameMatch;
                });
            }

            if (type == 'subject') {
                filteredFile = await fileRAWList.filter((file) => {
                    // const nameMatch = studentSearchFilter.trim() === '' || file.file_name == studentSearchFilter;
                    const nameMatch = studentSearchFilter.trim() === '' || file.file_name.includes(studentSearchFilter);
                    return nameMatch;
                });
            }
            setFileList(filteredFile);
        }
        filterArray();

    }, [classFilterValue, sectionFilterValue, studentSearchFilter, fileRAWList, sessionFilterValue]);

    useEffect(() => {
        setSectionFilterArray([...classAndSection])
        setClassFilterArray([...classAndSection])
    }, [classAndSection]);

    useEffect(() => {
        let filteredClass = classAndSection.filter((ccs) => {
            const classMatch = sessionFilterValue === 'all' || ccs.session_name == sessionFilterValue;
            return classMatch;
        });
        setClassFilterArray(filteredClass);

        let filteredSection = classAndSection.filter((section) => {
            const sectionMatch = sessionFilterValue === 'all' || section.session_name == sessionFilterValue;
            return sectionMatch;
        });
        setSectionFilterArray(filteredSection);

    }, [sessionFilterValue])

    useEffect(() => {
        let filteredSection = classAndSection.filter((section) => {
            const sectionMatch = classFilterValue === 'all' || section.class_name == classFilterValue && section.session_name == sessionFilterValue;
            return sectionMatch;
        });
        // console.log(classAndSection)
        setSectionFilterArray(filteredSection);
    }, [classFilterValue]);

    useEffect(() => {
        // Clone the studentRAWList to avoid mutating the original data
        const filteredFile = [...fileRAWList];

        if (sortingFilterValue === 'za') {
            filteredFile.sort((a, b) =>
                b.file_name.localeCompare(a.file_name)
            );
        } else if (sortingFilterValue === 'az') {
            filteredFile.sort((a, b) =>
                a.file_name.localeCompare(b.file_name)
            );
        }

        // Update the state with the sorted data
        setFileList(filteredFile);

    }, [fileRAWList, sortingFilterValue]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageStudenChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedFile = fileList.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const uniqueFileRows = [];
    const seenIDs = new Set();

    paginatedFile.forEach((item) => {
        if (!seenIDs.has(item.csv_id)) {
            seenIDs.add(item.csv_id);
            uniqueFileRows.push(item);
        }
    });



    let columns = ['S. no', 'File name', 'Date of upload', 'Session', "Download", 'Delete']
    if (type == 'teacher' || type == "subject") {
        columns = ['S. no', 'File name', 'Date of upload', "Download", 'Delete']
    }

    // Select Function
    const [selectedAddRows, setSelectedAddRows] = useState([]);

    const isAddSelected = (id) => {
        return selectedAddRows.some((row) => row.id === id);
    };

    const handleSelectRow = (id) => {
        setSelectedAddRows((prevselectedAddRows) => {
            const isRowSelected = isAddSelected(id);
            if (isRowSelected) {
                return prevselectedAddRows.filter((row) => !(row.id === id));
            } else {
                return [...prevselectedAddRows, { id }];
            }
        });
    };

    const handleSelectAllRows = (event) => {
        if (event.target.checked) {
            const selectedIds = uniqueFileRows.map((row) => ({
                id: row.id,
            }));
            setSelectedAddRows(selectedIds);
        } else {
            setSelectedAddRows([]);
        }
    };

    // Regular expression pattern to extract the name from the CSV URL
    const namePattern = /\/result\/csv\/(.*?)\.xlsx/;

    // if (type == "student") {
    //     url = `student/delete/csv/${id}/`
    // }
    // if (type == "result") {
    //     url = `result/delete/csv/${id}/`
    // }
    // if (type == "teacher") {
    //     url = `teacher/delete/csv/${id}/`
    // }
    // if (type == "subject") {
    //     url = `subject/delete/csv/${id}/`
    // }

    // Function to extract the name from the CSV URL
    const extractName = (csvUrl) => {
        const matches = csvUrl.match(namePattern);
        return matches && matches[1] ? matches[1] : "Name not found";
    };

    const getNameFromFileName = (fileName) => {
        const parts = fileName.split('.'); // Split the filename by the dot (.)
        if (parts.length > 1) {
            // If there is at least one dot in the filename
            parts.pop(); // Remove the last part (the file extension)
        }
        const nameWithoutExtension = parts.join('.'); // Join the remaining parts to get the name without extension
        return nameWithoutExtension;
    };

    const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
    const [deleteData, setDeleteData] = useState("")
    const deleteCSVFile = (id) => {
        let url;
        if (type == "student") {
            url = `student/delete/csv/${id}/`
        }
        if (type == "result") {
            url = `result/delete/csv/${id}/`
        }
        if (type == "teacher") {
            url = `teacher/delete/csv/${id}/`
        }
        if (type == "subject") {
            url = `subject/delete/csv/${id}/`
        }
        setDeleteData({
            "apiEndPoint": url,
            "apiData": undefined
        })
        setOpenDeleteAlert(true);
    }

    return (
        <div>
            <Dialog fullWidth={true} maxWidth='xl' open={open} onClose={handleClose} >
                <DialogTitle variant='h5' >View Uploaded Excel</DialogTitle>
                <DialogContent >
                    <Stack direction={"row"} alignItems={'center'} mt={1} mb={1} spacing={2} paddingLeft={0}>
                        <Stack style={{ margin: "0px 12px" }}>
                            <FormLabel style={{ color: "#000", fontSize: "16px", fontWeight: 600 }}>Filters</FormLabel>
                        </Stack>
                        <Grid container item spacing={1} lg={9} alignItems={'end'}>
                            {type == 'student' ? (
                                <>
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
                                            {sessions.map((item) => (<MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>))}
                                        </Select>
                                    </FormControl>
                                </>
                            ) : (null)}
                            {type == 'result' ? (
                                <>
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
                                            {sessions.map((item) => (<MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>))}
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
                                            {classFilterArray.filter((item, index, self) => self.findIndex((i) => i.class_name == item.class_name) == index)
                                                .map((item) => (
                                                    <MenuItem key={item.class_id} value={item.class_name}>{(item.class_name).toUpperCase()}</MenuItem>
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
                                            {sectionFilterArray.filter((item, index, self) => self.findIndex((i) => i.section_name == item.section_name) == index)
                                                .map((item) => (
                                                    <MenuItem key={item.section_id} value={item.section_name}>{(item.section_name).toUpperCase()}</MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </>
                            ) : (null)}
                        </Grid>
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
                                    <input value={studentSearchFilter} onChange={handleStudentSearch} placeholder='Search file' title="Search Student by Name, Reg No., Class and Section" style={{ border: "0", color: "#BEBEBE", width: "210px" }} /><SearchIcon style={{ border: "0", color: "#BEBEBE", }} />
                                </FormControl>
                            </FormControl>
                        </Grid>
                    </Stack>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    {/* <TableCell align="center" style={{ padding: "8px" }}>
                                        {uniqueFileRows.length == 0 ? null : (<Checkbox
                                            indeterminate={selectedAddRows.length > 0 && selectedAddRows.length < uniqueFileRows.length}
                                            checked={selectedAddRows.length === uniqueFileRows.length}
                                            onChange={handleSelectAllRows}
                                        />)}
                                    </TableCell> */}
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column}
                                            align={column == "File name" ? ("left") : ("center")}
                                        >
                                            {column}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(uniqueFileRows) && uniqueFileRows.length > 0 ? (
                                    uniqueFileRows.map((item, n = 0, index) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={item.csv_id}>
                                                {/* <TableCell align={'center'} style={{ padding: "8px" }}>
                                                    <Checkbox
                                                        checked={isAddSelected(item.csv_id)}
                                                        onChange={() => handleSelectRow(item?.csv_id)}
                                                    />
                                                </TableCell> */}
                                                <TableCell align={'center'} style={{ padding: "8px" }}>
                                                    {page * rowsPerPage + n + 1}
                                                </TableCell>
                                                <TableCell align={'center'} style={{ padding: "8px", height: "55px", textTransform: "capitalize" }} sx={{ fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "10px" }}>
                                                    {getNameFromFileName(item?.file_name)}
                                                </TableCell>
                                                <TableCell align={'center'} style={{ padding: "8px" }}>
                                                    {formatDate(item.created_at)}
                                                </TableCell>
                                                {type == "teacher" || type == "subject" ? (null) : (<TableCell align={'center'} style={{ padding: "8px" }}>
                                                    {item?.session}
                                                </TableCell>)}
                                                <TableCell align={'center'} style={{ padding: "8px" }}>
                                                    <a
                                                        color="info" href={`https://cyber-tutor-x-backend.vercel.app/${item?.csv}`}
                                                    >
                                                        Download
                                                    </a>
                                                </TableCell>
                                                <TableCell align={'center'} style={{ padding: "8px" }}>
                                                    <Button
                                                        color="info"
                                                        onClick={() => { deleteCSVFile(item?.csv_id) }}
                                                    >
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            No Excel File
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            component="div"
                            count={fileList.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageStudenChange}
                        />
                    </TableContainer>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>


            <AlertDialog openBox={openDeleteAlert} setOpen={setOpenDeleteAlert} data={deleteData} />
        </div>
    )
}