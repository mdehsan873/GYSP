import React, { useEffect, useState } from "react";
import {
    Button,
    CssBaseline,
    Box,
    Checkbox,
    Stack,
    Grid,
    FormLabel,
    FormControl,
    Select,
    MenuItem,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import { Link } from "react-router-dom";
import TableWrapper from "../../components/wrappers/TableWrapper";
import Paper from "@mui/material/Paper";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { toast } from "react-toastify";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import AxiosObj from "../../axios/AxiosObj";
import { useSelector } from "react-redux";
import secureLocalStorage from "react-secure-storage";
import { resetLocal } from './../../partials/localStorage'

export default function StudentMove() {
    
    useEffect(() => {
        resetLocal("student");
    }, []);

    const { sessions, classAndSection } = useSelector((state) => state.infra);

    const [fromSessionValue, setFromSessionValue] = useState(sessions[0]?.id);
    const [toSessionValue, setToSessionValue] = useState(0);

    const [classFilterValue, setClassFilterValue] = useState(0);
    const [sectionFilterValue, setSectionFilterValue] = useState(0);
    const [studentSearchFilter, setStudentSearchFilter] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingStudent, setLoadingStudent] = useState(false);

    // Student Lists
    const [studentRAWList, setStudentRAWList] = useState([]);
    const [studentFromList, setStudentFromList] = useState([]);
    const [studentToList, setStudentToList] = useState([]);

    // From Class Filter Array
    const [fromClassValue, setFromClassValue] = useState("");
    const [classFilterArray, setClassFilterArray] = useState([]);
    const [sectionFilterArray, setSectionFilterArray] = useState([]);
    const [showFromSection, setShowFromSection] = useState(false);
    const [selectFormClass, setSelectFormClass] = useState(false);

    // To Filter
    const [toClassFilterArray, setToClassFilterArray] = useState([]);
    const [toClassFilterValue, setToClassFilterValue] = useState(0);

    // Selection
    const [selectedRows, setSelectedRows] = useState([]);

    // Move Class Array
    const [showMoveSection, setShowMoveSection] = useState(false);
    const [showMoveSection2, setShowMoveSection2] = useState(false);
    const [moveStudentArray, setMoveStudentArray] = useState([]);



    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === "fromSession") {
            setStudentRAWList([]);
            setStudentFromList([]);
            setSelectedRows([]);
            setClassFilterValue(0);
            setSectionFilterValue(0);
            setToSessionValue(0);
            setFromSessionValue(value);
        }
        if (name === "toSession") {
            setToSessionValue(value);
            setToClassFilterValue(0);
        }
        if (name === "class") {
            setClassFilterValue(value);
            setShowFromSection(true);
        }
        if (name === "section") {
            setSectionFilterValue(value);
        }
        if (name === "toClass") {
            setToClassFilterValue(value);
            setShowMoveSection2(true);
        }
    };

    const isSelected = (id) => {
        return selectedRows.some((row) => row.id === id);
    };

    const handleSelectRow = (id) => {
        setShowMoveSection(true);
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
            setShowMoveSection(true);
            const selectedIds = studentFromList.map((row) => ({
                id: row.id,
            }));
            setSelectedRows(selectedIds);
        } else {
            setSelectedRows([]);
            // setShowMoveSection(false);
        }
    };

    const moveStudentsF = () => {
        if (selectedRows.length === 0) {
            toast.error("Please select the students from class");
            return false;
        }
        if (toClassFilterValue === 0) {
            toast.error("Please select target class");
            return false;
        }

        // Filter studentFromList by selectedRows
        const selectedStudentIds = selectedRows.map((row) => row.id);
        const selectedStudents = studentFromList.filter((student) =>
            selectedStudentIds.includes(student.id)
        );

        // Remove the selected students from studentFromList array
        const updatedStudentList = studentFromList.filter(
            (student) => !selectedStudentIds.includes(student.id)
        );

        // Filter toClassFilterArray by toClassFilterValue (section_id)
        const toClass = toClassFilterArray.find((item) => item.id == toClassFilterValue);

        if (toClass) {
            // Check if toClassFilterValue already exists in moveStudentArray
            const existingClassIndex = moveStudentArray.findIndex(
                (moveStudent) => moveStudent.id == toClassFilterValue
            );

            if (existingClassIndex !== -1) {
                // Update existing class entry in moveStudentArray
                setMoveStudentArray((prevMoveStudentArray) => {
                    const updatedArray = [...prevMoveStudentArray];
                    updatedArray[existingClassIndex].students.push(...selectedStudents);
                    return updatedArray;
                });
            } else {
                // Create a new moveStudentObj and add it to moveStudentArray
                const moveStudentObj = {
                    class_name: toClass.class_name,
                    class_id: toClass.class_id,
                    section_name: toClass.section_name,
                    section_id: toClass.section_id,
                    id: toClass.id,
                    students: selectedStudents,
                };
                setMoveStudentArray((prevMoveStudentArray) => [...prevMoveStudentArray, moveStudentObj]);
            }

            // Update the studentFromList state with the updatedStudentList
            setStudentFromList(updatedStudentList);
            // Empty the selectedRows state
            setSelectedRows([]);
        }
    };

    const handleUpdateStudent = async () => {
        if (fromSessionValue === toSessionValue) {
            toast.error("Can not move students to the same session");
            return false;
        }

        let data = {
            source_session_id: fromSessionValue,
            target_session_id: toSessionValue,
            students: [],
        };

        await moveStudentArray.forEach((classData) => {
            classData.students.forEach(async (student) => {
                // Find the matching class and section details from classAndSection array
                const matchedClassSection = await classAndSection.find(
                    (item) =>
                        item.class_name == student.class_name &&
                        item.section_name == student.section &&
                        item.session_name == student.session
                );
                if (matchedClassSection) {
                    const studentData = {
                        id: student.change_session_id,
                        target_class_id: classData.class_id,
                        target_section_id: classData.section_id,
                        source_class_id: matchedClassSection.class_id,
                        source_section_id: matchedClassSection.section_id,
                    };
                    data.students.push(studentData);
                }
            });
        });

        if (data.students.length === 0) {
            toast.error("Select students and move them to other classes");
            return false;
        }

        const config = {
            method: "POST",
            maxBodyLength: Infinity,
            url: "student/promote-demote/",
            headers: {
                accept: "application/json",
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
            },
            data: data,
        };

        AxiosObj.request(config)
            .then((response) => {
                if (response.data?.Success) {
                    toast.success(response.data.Data || "Students have been moved");
                    if (secureLocalStorage.getItem("countStudent")) {
                        secureLocalStorage.removeItem("countStudent")
                    }
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    response.data?.Data.map((item) => toast.error(item || "Something went wrong...!"));
                }
            })
            .catch((e) => {
                try {
                    e.response.data?.Data.map((item) => toast.error(item || "Something went wrong...!"));
                } catch (e99) {
                    toast.error(e.response.data?.Data || "Something went wrong...!");
                }
            })
            .finally(() => setLoading(false));
    };

    const fetchData2 = async () => {
        setLoadingStudent(true);

        if (classFilterValue == 0 || fromSessionValue == 0) {
            setLoadingStudent(false);
            return null;
        }


        const sessionApiFilter = fromSessionValue !== 0 ? `&session_id=${fromSessionValue}` : "";
        const classApiFilter = classFilterValue !== 0 ? `&class_id=${classFilterValue}` : "";
        const sectionApiFilter = sectionFilterValue !== 0 ? `&section_id=${sectionFilterValue}` : "";
        const searchApiFilter = studentSearchFilter !== "" ? `&search=${studentSearchFilter}` : "";

        try {
            
            const response = await AxiosObj.get(`student/get/all/?${sessionApiFilter}${classApiFilter}${sectionApiFilter}${searchApiFilter}`);
            setStudentRAWList(response.data.results);

            // Filter the students that are not in the moveStudentArray
            const filteredStudents = await response.data.results.filter((student) => {
                return !moveStudentArray.some((classData) => {
                    return classData.students.some((moveStudent) => moveStudent.registration_no == student.registration_no);
                });
            });

            console.log(studentToList)
            // Remove students with the same ID as in studentToList from filteredStudents
            const filteredStudentsWithoutDuplicates = await filteredStudents.filter((student) => !studentToList.has(student.registration_no));

            setStudentFromList(filteredStudentsWithoutDuplicates);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingStudent(false);
        }
    };

    const fetchData3 = async () => {
        setLoadingStudent(true);

        if (toSessionValue == 0) {
            setLoadingStudent(false);
            return null;
        }

        const sessionApiFilter = fromSessionValue !== 0 ? `&session_id=${toSessionValue}` : "";

        try {
            const response = await AxiosObj.get(`student/get/all/?${sessionApiFilter}`);

            // Convert studentToList into a Set of IDs for faster lookup
            const studentToListIds = await new Set(response.data.results.map((studentTo) => studentTo.registration_no));

            setStudentToList(studentToListIds);
            setSelectFormClass(true)

        } catch (error) {
            console.log(error);
        }
    };

    const removeStudentMove = (classSectionID, studentID) => {
        // Find the class and section in the moveStudentArray
        const updatedMoveStudentArray = moveStudentArray.map((row) => {
            if (row.id === classSectionID) {
                // Remove the student with the specified studentID
                const updatedStudents = row.students.filter((student) => {
                    if (student.id === studentID) {
                        // Check if the classFilterValue and sectionFilterValue match with student's class_id and section_id
                        if (classFilterValue == student.class_name_id || sectionFilterValue == student.section_id) {
                            // Move the student from the moveStudentArray to the studentFromList
                            setStudentFromList((prevStudentList) => [...prevStudentList, student]);
                        }
                        // Return false to filter out the student from the updatedStudents array
                        return false;
                    }
                    return true;
                });
                // Update the students array in the class and section
                return { ...row, students: updatedStudents };
            }
            return row;
        });

        // Remove arrays with empty students from updatedMoveStudentArray
        const filteredMoveStudentArray = updatedMoveStudentArray.filter((row) => row.students.length > 0);

        // Update the moveStudentArray state
        setMoveStudentArray(filteredMoveStudentArray);
    };

    useEffect(() => {
        if (toSessionValue !== 0) {
            setSelectedRows([])
            fetchData3();
            setSelectFormClass(false)
            setShowFromSection(false)
            setClassFilterValue(0)
        }
    }, [toSessionValue]);

    useEffect(() => {
        if (classFilterValue !== 0) {
            setSelectedRows([])
            fetchData2();
        }
    }, [sectionFilterValue, studentSearchFilter, classFilterValue, studentToList]);

    useEffect(() => {
        let filteredClass = classAndSection.filter((ccs) => {
            const classMatch = fromSessionValue == "0" || ccs.session_id == fromSessionValue;
            return classMatch;
        });
        setClassFilterArray(filteredClass);
    }, [fromSessionValue]);

    useEffect(() => {
        let filteredSection = classAndSection.filter((section) => {
            const sectionMatch = classFilterValue == "0" || (section.class_id == classFilterValue && section.session_id == fromSessionValue);
            return sectionMatch;
        });
        if (filteredSection.length !== 0) {
            setFromClassValue(filteredSection[0].class_name);
        }
        setSectionFilterArray(filteredSection);
    }, [classFilterValue, fromSessionValue]);

    useEffect(() => {
        let filteredClass = classAndSection.filter((ccs) => {
            const classMatch = toSessionValue == "0" || ccs.session_id == toSessionValue;
            return classMatch;
        });
        setToClassFilterArray(filteredClass);
    }, [toSessionValue]);

    useEffect(() => {
        setClassFilterArray([...classAndSection]);
        // setSectionFilterArray([...classAndSection]);
    }, [classAndSection]);

    const handleStudentSearch = (event) => {
        setStudentSearchFilter(event.target.value);
    };

    useEffect(() => {
        setFromSessionValue(sessions[0]?.id);
    }, [sessions]);

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
                                <Typography fontWeight={'bold'} style={{ marginLeft: "14px" }} variant={'h6'}>Move Students</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                    <Stack
                        direction={'row'}
                        alignItems={'center'}
                        //justifyContent={'space-between'}
                        pb={3}
                        gap={5}
                    >
                        <Stack direction={"row"} spacing={2} sx={{ width: '30%', }} paddingLeft={2}>
                            <FormControl variant="standard" sx={{ width: '100%', margin: "0px 12px" }}>
                                <FormLabel style={{ fontSize: '14px', fontWeight: 600, color: "#3D3D3D", font: "normal normal bold 11px/14px Montserrat", opacity: "1", letterSpacing: "1px", marginBottom: "10px", }}>From Session</FormLabel>
                                <Select
                                    labelId="session-simple-select-standard-label"
                                    id="session-simple-select-standard"
                                    value={fromSessionValue}
                                    name="fromSession"
                                    onChange={handleFilterChange}
                                    style={{ marginTop: 0, fontWeight: 600, fontSize: '14px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px", width: "100%" }}
                                >
                                    <MenuItem disabled={true} value={0}>Select the from session</MenuItem>
                                    {sessions.map((item) => (<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>))}
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack direction={"row"} spacing={2} sx={{ width: '2%', }} paddingLeft={2}>
                            <ArrowForwardIcon style={{ opacity: "0.5", }} sx={{ fontSize: 30 }} />
                        </Stack>
                        <Stack direction={"row"} spacing={2} sx={{ width: '30%', }} paddingLeft={2}>
                            <FormControl variant="standard" sx={{ width: '100%', margin: "0px 12px" }}>
                                <FormLabel style={{ fontSize: '14px', fontWeight: 600, color: "#3D3D3D", font: "normal normal bold 11px/14px Montserrat", opacity: "1", letterSpacing: "1px", marginBottom: "10px", }}>To Session</FormLabel>
                                <Select
                                    labelId="session-simple-select-standard-label"
                                    id="session-simple-select-standard"
                                    value={toSessionValue}
                                    name="toSession"
                                    onChange={handleFilterChange}
                                    style={{ marginTop: 0, fontWeight: 600, fontSize: '14px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px", width: "100%" }}
                                >
                                    <MenuItem disabled={true} value={0}>Select the to session</MenuItem>
                                    {sessions.filter((item) => item.id !== fromSessionValue).map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                        <Stack direction={"row"} spacing={2} sx={{ width: '20%', }} paddingLeft={2}>
                            <Stack style={{ margin: '0px 12px', width: "100%" }}>
                                {moveStudentArray.length == 0 ? (
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        style={{ background: '#00000099', color: '#fff', border: '0', textAlign: 'center', padding: "8px 8px", fontSize: "16px", cursor: "no-drop" }}
                                    >
                                        Move Students
                                    </Button>
                                ) : (
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        style={{ background: '#4FCCD5', color: '#fff', border: '0', textAlign: 'center', padding: "8px 8px", fontSize: "16px", cursor: "pointer" }}
                                        // disabled={!moveStatus}
                                        onClick={handleUpdateStudent}
                                    >
                                        Move Students
                                    </Button>
                                )
                                }

                            </Stack>
                        </Stack>
                    </Stack>
                    {toSessionValue === 0 ? null : (
                        selectFormClass ? (
                            <Stack direction={'row'} alignItems={'center'} gap={5}>
                                <Stack direction={"row"} spacing={2} sx={{ width: '20%', }} mb={4} paddingLeft={2}>
                                    <FormControl variant="standard" sx={{ width: '100%', margin: "0px 12px" }}>
                                        <FormLabel style={{ fontSize: '14px', fontWeight: 600, color: "#3D3D3D", font: "normal normal bold 11px/14px Montserrat", opacity: "1", letterSpacing: "1px", marginBottom: "10px", }}>From Class</FormLabel>
                                        <Select
                                            labelId="class-simple-select-standard-label"
                                            id="class-simple-select-standard"
                                            value={classFilterValue}
                                            name="class"
                                            onChange={handleFilterChange}
                                            style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                            label="class"
                                        >
                                            <MenuItem disabled={true} value={0}>Select the class</MenuItem>
                                            {classFilterArray.filter((item, index, self) => self.findIndex((i) => i.class_name === item.class_name) === index)
                                                .map((item) => (
                                                    <MenuItem key={item.class_id} value={item.class_id}>{item.class_name.toUpperCase()}</MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Stack>
                            </Stack>
                        ) : (<Typography fontWeight={'bold'} style={{ marginLeft: "28px", paddingBottom: "28px" }} variant={'h6'}>Loading...</Typography>)
                    )}
                    <Paper sx={{ width: "100%" }}>
                        {classFilterValue == 0 ? (null) : (
                            <Stack direction={'row'} overflow={"hidden"} gap={2} p={2}>
                                {showFromSection ? (
                                    <Stack component={Paper}>
                                        <TableContainer sx={{ maxHeight: 500, minHeight: 500 }}>
                                            <Grid item container lg={12} p={1} justifyContent={"space-between"} alignItems={"center"}>
                                                <FormControl variant="standard" sx={{ margin: "0px 12px" }}>
                                                    <FormLabel style={{ fontSize: '18px', fontWeight: 600, color: "#000", font: "normal normal bold 11px/14px Montserrat", opacity: "1", letterSpacing: "0.5px", textTransform: "capitalize" }}>{fromClassValue ? (fromClassValue) : (null)}</FormLabel>
                                                </FormControl>
                                                <FormControl variant="standard" sx={{ width: '20%', margin: "0px 12px" }}>
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
                                                        <MenuItem disabled={false} value={0}>All</MenuItem>
                                                        {sectionFilterArray.filter((item, index, self) => self.findIndex((i) => i.section_name === item.section_name) === index)
                                                            .map((item) => (
                                                                <MenuItem key={item.section_id} value={item.section_id}>{(item.section_name).toUpperCase()}</MenuItem>
                                                            ))}
                                                    </Select>
                                                </FormControl>
                                                <FormControl variant="standard" sx={{ alignSelf: "end", width: '45%', margin: "0px 12px", flexDirection: "row", alignItems: "center", borderBottom: "1px solid #BEBEBE" }}>
                                                    <input value={studentSearchFilter} onChange={handleStudentSearch} placeholder='Search Student' title="Search Student by Name, Reg No., Class and Section" style={{ border: "0", color: "#BEBEBE", width: "90%" }} /><SearchIcon style={{ border: "0", color: "#BEBEBE", }} />
                                                </FormControl>
                                            </Grid>
                                            <Table sx={{ minWidth: 450, maxWidth: 450, padding: "10px", paddingTop: "0" }} stickyHeader aria-label="sticky table">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell align="left" style={{ padding: "8px" }}>
                                                            {studentFromList.length == 0 || loadingStudent ? null : (<Checkbox
                                                                indeterminate={selectedRows.length > 0 && selectedRows.length < studentFromList.length}
                                                                checked={selectedRows.length === studentFromList.length}
                                                                onChange={handleSelectAllRows}
                                                            />)}
                                                        </TableCell>
                                                        <TableCell align="left" style={{ padding: "8px" }} >
                                                            <Typography variant='body' sx={{ fontSize: "14px", fontWeight: "600" }}>Name</Typography>
                                                        </TableCell>
                                                        <TableCell align="left" style={{ padding: "8px" }}>
                                                            <Typography variant='body' sx={{ fontSize: "14px", fontWeight: "600" }}>Student Registration</Typography>
                                                        </TableCell>
                                                        <TableCell align="center" style={{ padding: "8px" }}>
                                                            <Typography variant='body' sx={{ fontSize: "14px", fontWeight: "600" }}>Class</Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {loadingStudent ? (
                                                        <TableRow>
                                                            <TableCell colSpan={4} align="center">
                                                                Loading...
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        Array.isArray(studentFromList) && studentFromList.length > 0 ? (
                                                            studentFromList.sort((a, b) => a?.registration_no.localeCompare(b?.registration_no)).map((row, index) => (
                                                                <TableRow
                                                                    key={index}
                                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                >
                                                                    <TableCell style={{ padding: "8px" }}>
                                                                        {studentFromList.length > 0 ? (<Checkbox
                                                                            checked={isSelected(row.id)}
                                                                            onChange={() => handleSelectRow(row.id)}
                                                                        />) : (null)}
                                                                    </TableCell>
                                                                    <TableCell style={{ padding: "8px" }} align="left">
                                                                        {row.student_details?.first_name + ' ' + (row.student_details?.middle_name || '') + ' ' + (row.student_details?.last_name || '')}
                                                                    </TableCell>
                                                                    <TableCell style={{ padding: "8px" }} align="center">
                                                                        {row.registration_no}
                                                                    </TableCell>
                                                                    <TableCell style={{ padding: "8px" }} align="center">
                                                                        {`${row?.class_name} ${row?.section}`.toUpperCase()}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={4} align="center">
                                                                    No Student
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Stack>) : (null)}
                                {showMoveSection ? (
                                    <Stack justifyContent={'center'} sx={{ width: "fit-content" }}>
                                        <Stack direction={"column"}>
                                            <FormControl variant="standard" sx={{ margin: "0px 12px" }}>
                                                <FormLabel style={{ marginBottom: "5px", fontSize: '16px', fontWeight: 600, color: "#000", font: "normal normal bold 11px/14px Montserrat", opacity: "1", letterSpacing: "0.5px" }}>Class</FormLabel>
                                                <Select
                                                    labelId="class-simple-select-standard-label"
                                                    id="class-simple-select-standard"
                                                    value={toClassFilterValue}
                                                    name="toClass"
                                                    onChange={handleFilterChange}
                                                    style={{ marginTop: 0, fontWeight: 600, fontSize: '14px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                                    label="class"
                                                >
                                                    <MenuItem disabled={true} value={0}>Select the class</MenuItem>
                                                    {toClassFilterArray.map(item => <MenuItem key={item.id} value={item.id}>{(item?.class_name + " " + item?.section_name).toUpperCase()}</MenuItem>)}
                                                </Select>
                                            </FormControl>
                                            {toClassFilterValue == 0 ? (<Stack style={{ margin: '30px 12px' }}><Button
                                                color="primary"
                                                variant="outlined"
                                                style={{ background: '#00000099', color: '#fff', border: '0', textAlign: 'center', padding: "8px 8px", fontSize: "14px", cursor: "no-drop" }}
                                            // disabled={true}
                                            >
                                                Move
                                            </Button> </Stack>) : (<Stack style={{ margin: '30px 12px' }}>
                                                {selectedRows.length == 0 ? (<Button
                                                    color="primary"
                                                    variant="outlined"
                                                    style={{ background: '#00000099', color: '#fff', border: '0', textAlign: 'center', padding: "8px 8px", fontSize: "14px", cursor: "no-drop" }}
                                                // disabled={true}
                                                >
                                                    Move
                                                </Button>) : (<Button
                                                    color="primary"
                                                    variant="outlined"
                                                    style={{ background: '#4FCCD5', color: '#fff', border: '0', textAlign: 'center', padding: "8px 8px", fontSize: "14px" }}
                                                    onClick={moveStudentsF}
                                                >
                                                    Move
                                                </Button>)}

                                            </Stack>)}

                                        </Stack>
                                    </Stack>) : (null)}
                                {showMoveSection2 ? (
                                    <Stack direction={"row"} sx={{ width: "227vh", overflowX: "scroll", padding: "0px 12px" }} gap={3}>
                                        {moveStudentArray.length > 0 && Array.isArray(moveStudentArray) ? (
                                            moveStudentArray.map((row, index) => (
                                                row.students.length > 0 && Array.isArray(row.students) ? (
                                                    <TableContainer key={index} component={Paper} sx={{ minWidth: 450, maxWidth: 450, maxHeight: 500, minHeight: 500 }}>
                                                        <Grid item container lg={12} alignItems={"center"} justifyContent={"space-between"} p={1}>
                                                            <FormControl variant="standard" sx={{ margin: "0px 12px" }}>
                                                                <FormLabel style={{ fontSize: '18px', fontWeight: 600, color: "#000", font: "normal normal bold 11px/14px Montserrat", opacity: "1", letterSpacing: "0.5px", textTransform: "capitalize" }}>{row.class_name + " " + row.section_name}</FormLabel>
                                                            </FormControl>
                                                            {/* <FormControl variant="standard" sx={{ width: '45%', margin: "0px 12px", flexDirection: "row", alignItems: "center", borderBottom: "1px solid #BEBEBE" }}>
                                                        <input value={studentSearchFilter} onChange={handleStudentSearch} placeholder='Search Student' title="Search Student by Name, Reg No." style={{ border: "0", color: "#BEBEBE", width: "90%" }} /><SearchIcon style={{ border: "0", color: "#BEBEBE", }} />
                                                    </FormControl> */}
                                                        </Grid>
                                                        <Table sx={{ minWidth: 450, maxWidth: 450, padding: "10px", paddingTop: "0" }} stickyHeader aria-label="sticky table">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell align="left">
                                                                        <Typography variant='body' style={{ padding: "8px" }} sx={{ fontSize: "14px", fontWeight: "600" }}>Name</Typography>
                                                                    </TableCell>
                                                                    <TableCell align="left">
                                                                        <Typography variant='body' style={{ padding: "8px" }} sx={{ fontSize: "14px", fontWeight: "600" }}>Student Registration</Typography>
                                                                    </TableCell>
                                                                    <TableCell align="left">
                                                                        <Typography variant='body' style={{ padding: "8px" }} sx={{ fontSize: "14px", fontWeight: "600" }}>Remove</Typography>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {row.students.length > 0 ? (
                                                                    row.students.sort((a, b) => a.registration_no.localeCompare(b.registration_no)).map((rows, index) => (
                                                                        <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                            <TableCell style={{ padding: "8px" }} align="left">{rows.student_details?.first_name + ' ' + (rows.student_details?.middle_name || '') + ' ' + (rows.student_details?.last_name || '')}</TableCell>
                                                                            <TableCell style={{ padding: "8px" }} align="center">{rows.registration_no}</TableCell>
                                                                            <TableCell style={{ padding: "8px" }} align="center"><CloseIcon style={{ cursor: "pointer" }} onClick={() => { removeStudentMove(row.id, rows.id) }} /></TableCell>
                                                                        </TableRow>
                                                                    ))
                                                                ) : (
                                                                    <TableRow>
                                                                        <TableCell colSpan={4} align="center">
                                                                            No Student
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </TableContainer>
                                                ) : (null)
                                            ))
                                        ) : (null)}

                                    </Stack>
                                ) : (null)}
                            </Stack>
                        )}
                    </Paper>
                </TableWrapper>
            </Box >
        </>
    );
}
