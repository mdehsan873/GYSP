import *  as React from 'react';
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { toast } from 'react-toastify';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Image } from 'react-bootstrap'
import secureLocalStorage from "react-secure-storage";
import { Divider, FormControl, FormLabel, Grid, Input, MenuItem, Select, Stack, Typography, ListItemText, ListItemIcon, Checkbox, } from '@mui/material';
import AxiosObj from '../../../axios/AxiosObj';
import Loader from '../../Loader';
import { useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import TablePagination from '@mui/material/TablePagination';
import CloseIcon from '@mui/icons-material/Close';

export default function AddCocurricularWorkshopDialog({ open, setOpen, }) {
    const { classAndSection, sessions } = useSelector(state => state.infra)

    const [loading, setLoading] = useState(false)

    // Select Function
    const [selectedRemoveRows, setSelectedRemoveRows] = useState([]);

    const [errorMsg, setErrorMsg] = useState('');
    const [studentRAWList, setStudentRAWList] = useState([]);
    const [studentList, setStudentList] = useState([]);
    const [studentList2, setStudentList2] = useState([]);
    const [addStudentRow, setAddStudentRow] = useState([]);
    const [eventCatergorys, setEventCatergorys] = useState([]);

    // Add Event Details
    const [eventName, setEventName] = useState('')
    const [eventCatergoryID, setEventCatergoryID] = useState('');
    const [eventType, setEventType] = useState('');
    const [participationType, setParticipationType] = useState('');
    const [dateOfEvent, setDateOfEvent] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [sessionID, setSessionID] = useState('');
    const [classSectionID, setClassSectionID] = useState([]);

    const [classSectionArray, setclassSectionArray] = useState([]);

    useEffect(() => {
        setclassSectionArray([...classAndSection])
    }, [classAndSection]);

    useEffect(() => {
        let filteredClass = classAndSection.filter((cc) => {
            const classMatch = sessionID == '' || cc.session_id == sessionID;
            return classMatch;
        });
        setclassSectionArray(filteredClass);
    }, [sessionID, sessions]);

    useEffect(() => {
        if(open == true){
            setSessionID(sessions[0].id);
        }
    }, [sessions, open]);
    
    let [activity, setActivity] = useState({
        all: false,
        concentration: false,
        creativity: false,
        teamWork: false,
        presentation: false,
        logicApproach: false,
        confidence: false,
        socialSkill: false,
        motorSkill: false,
        patience: false,
    });
    const handleClose = () => {
        setOpen(false);
        setLoading(false);
        setErrorMsg('')
        setEventCatergoryID('')
        setEventName('')
        setEventDescription('')
        setClassSectionID([])
        setEventType('')
        setDateOfEvent('')
        setStudentSearchFilter('')
        setParticipationType('')
        setStudentRAWList([])
        setStudentList([])
        setStudentList2([])
        setAddStudentRow([])
        setEventCatergorys([])
        setActivity2([])
        setclassSectionArray([])
        setPage(0)

        setSessionID('')
        setStudentSearchFilter('')
        setPage(0)
        setRowsPerPage(10)
        setClassFilterArray([])
        setSectionFilterArray([])
        setSelectedAddRows([])
        setSelectedRemoveRows([])
    };
    const capitalizeWords = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const [studentSearchFilter, setStudentSearchFilter] = useState("");

    const handleAddEvent = async () => {
        setErrorMsg('')
        if (
            eventName === "" ||
            eventCatergoryID === "" ||
            eventType === "" ||
            participationType === "" ||
            dateOfEvent === "" ||
            eventDescription === "" ||
            sessionID === "" ||
            classSectionID.length === 0) {
            setErrorMsg("Fill the required fields");
            toast.error("Fill the required fields");
            return null;
        }


        const eligibleClasses = classSectionID.map((itemId) => {
            const foundItem = classAndSection.find((item) => item.id === itemId);
            if (foundItem) {
                return {
                    class_id: foundItem.class_id,
                    section_id: foundItem.section_id,
                };
            }
            return null;
        });


        // Remove any null values from the eligibleClasses array
        const filteredEligibleClasses = eligibleClasses.filter((item) => item !== null);

        if (filteredEligibleClasses) {

            // setLoading(true)
            let data = JSON.stringify({
                "event_name": eventName,
                "event_category_id": eventCatergoryID,
                "event_type": eventType,
                "participaton_type": participationType,
                "date_of_event": dateOfEvent,
                "description": eventDescription,
                "session_id": sessionID,
                "concentration": activity.concentration,
                "creativity": activity.creativity,
                "team_work": activity.teamWork,
                "presentation": activity.presentation,
                "logical_approach": activity.logicApproach,
                "confidence": activity.confidence,
                "social_skil": activity.socialSkill,
                "motorSkill": activity.motorSkill,
                "patience": activity.patience,
                "eligible_class": filteredEligibleClasses,
                "data": generateDataArray(addStudentRow)
            });

            function generateDataArray(addStudentRow) {
                const dataMap = {};

                // Group students based on class_id and section_id
                addStudentRow.forEach((student) => {
                    const { class_name_id, section_id } = student;
                    const key = `${class_name_id}-${section_id}`;

                    if (dataMap[key]) {
                        dataMap[key].push(student);
                    } else {
                        dataMap[key] = [student];
                    }
                });

                // Generate the final data array
                const dataArray = [];
                Object.entries(dataMap).forEach(([key, students]) => {
                    const [class_name_id, section_id] = key.split('-');

                    const studentData = {};
                    students.forEach((student) => {
                        const { id, rank } = student;
                        studentData[id] = rank;
                    });

                    dataArray.push({
                        class_id: class_name_id,
                        section_id,
                        students: studentData
                    });
                });

                return dataArray;
            }

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'event/add/workshop/',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),
                },
                data: data
            };

            AxiosObj.request(config)
                .then((response) => {
                    if (response.data?.Success) {
                        toast.success(response.data.Data[0] || "Workshop has been added");
                        // Reload the window after 2 seconds
                        if (secureLocalStorage.getItem("eventRAWList")) {
                            secureLocalStorage.removeItem("eventRAWList")
                        }
                        if (secureLocalStorage.getItem("countEvent")) {
                            secureLocalStorage.removeItem("countEvent")
                        }
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else {
                        toast.error(response.data.Data || "Something went wrong...!");
                    }
                })
                .catch((e) => {
                    try {
                        e.response.data?.Data.map(item => (
                            toast.error(capitalizeWords(item) || "Something went wrong...!")
                        ))
                    } catch (ed) {
                        toast.error(capitalizeWords(e.response.data?.Data) || "Something went wrong...!")
                    }
                })
                .finally(() => setLoading(false));

        }
    }

    const fetchData = async () => {
        setLoading(true)
        let config2 = {
            method: 'get',
            maxBodyLength: Infinity,
            url: "event/get/event/categories/",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
            },
        };

        AxiosObj.request(config2).then((res) => { setEventCatergorys(res.data.Data); }).catch((e) => console.log(e)).finally(() => { setLoading(false) })
    };

    useEffect(() => {
        if (open && open == true) {
            fetchData();
        }
    }, [open]);
    const clearSearchFlied = () => {
        if (studentSearchFilter.length !== 0) {
            setStudentSearchFilter('')
        }
    }
    const fetchData2 = async () => {
        let sessionApiFilter = '';

        const uniqueClassSectionIDs = [...new Set(classSectionID)];

        const eligibleClasses = uniqueClassSectionIDs.map((itemId) => {
            const foundItem = classAndSection.find((item) => item.id === itemId);
            if (foundItem) {
                return {
                    class_id: foundItem.class_id,
                    class_name: foundItem.class_name,
                    section_id: foundItem.section_id,
                    section_name: foundItem.section_name,
                };
            }
            return null;
        });

        setClassFilterArray(eligibleClasses)
        setSectionFilterArray(eligibleClasses)

        if (sessionID !== "all") {
            sessionApiFilter = `&session_id=${sessionID}`;
        }

        try {
            const responsePromises = eligibleClasses.map(async (cs) => {
                let config2 = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: `student/get/all/?${sessionApiFilter}&class_id=${cs.class_id}&section_id=${cs.section_id}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                    },
                };
                const response = await AxiosObj.request(config2);
                return response.data.results;
            });

            const responseResults = await Promise.all(responsePromises);
            let allStudentData = responseResults.flat();

            setStudentRAWList(allStudentData);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData2();
    }, [classSectionID, sessionID]);

    // Filter the stduent with pagination
    const [classFilterValue, setClassFilterValue] = useState("all");
    const [sectionFilterValue, setSectionFilterValue] = useState("all");

    // Filter Array
    const [classFilterArray, setClassFilterArray] = useState([]);
    const [sectionFilterArray, setSectionFilterArray] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleFilterChange = async (e) => {
        const { name, value } = e.target;

        if (name === "class") {
            setClassFilterValue(value);
        }

        if (name === "section") {
            setSectionFilterValue(value);
        }

    };

    const handleStudentSearch = (event) => {
        setStudentSearchFilter(event.target.value);
        setPage(0); // Set teacherPage to 0 when search filter changes
    };


    useEffect(() => {
        const filteredStudents = studentRAWList.filter((student) => {
            const classMatch =
                classFilterValue === 'all' || student.class_name == classFilterValue;
            const sectionMatch =
                sectionFilterValue === 'all' || student.section == sectionFilterValue;
            const nameMatch =
                studentSearchFilter.trim() === '' ||
                student.student_details?.first_name
                    ?.toLowerCase()
                    .includes(studentSearchFilter.toLowerCase().trim()) ||
                student.student_details?.middle_name
                    ?.toLowerCase()
                    .includes(studentSearchFilter.toLowerCase().trim()) ||
                student.student_details?.last_name
                    ?.toLowerCase()
                    .includes(studentSearchFilter.toLowerCase().trim()) ||
                student?.registration_no
                    ?.toLowerCase()
                    .includes(studentSearchFilter.toLowerCase().trim()) ||
                `${student.class_name} ${student.section}`
                    .toLowerCase()
                    .includes(studentSearchFilter.toLowerCase().trim()) ||
                `${student.student_details?.first_name} ${student.student_details?.last_name}`
                    ?.toLowerCase()
                    .includes(studentSearchFilter.toLowerCase().trim());

            return classMatch && sectionMatch && nameMatch;
        });

        // Remove objects with IDs from addStudentRow array
        const filteredStudentList = filteredStudents.filter(
            (student) => !addStudentRow.some((row) => row.id === student.id)
        );

        setStudentList(filteredStudentList.sort((a, b) => {
            const classA = parseInt(a.class_name) || 0;
            const classB = parseInt(b.class_name) || 0;

            if (classA !== classB) {
                return classA - classB;
            }

            const sectionA = a.section.charCodeAt(0) || 0;
            const sectionB = b.section.charCodeAt(0) || 0;

            if (sectionA !== sectionB) {
                return sectionA - sectionB;
            }

            const firstNameA = a?.student_details?.first_name || a?.first_name || '';
            const firstNameB = b?.student_details?.first_name || b?.first_name || '';

            return firstNameA.localeCompare(firstNameB);
        }));
    }, [classFilterValue, sectionFilterValue, studentSearchFilter, classSectionID, studentRAWList, addStudentRow]);

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageStudenChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedStudents = studentList.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const uniqueStudentRows = [];
    const seenIDs = new Set();

    paginatedStudents.forEach((item) => {
        if (!seenIDs.has(item.id)) {
            seenIDs.add(item.id);
            uniqueStudentRows.push(item);
        }
    });

    const addStudentInPat = async (id) => {
        // Check if the id exists in selectedAddRows
        const updateNer = await selectedAddRows.filter(row => row.id !== id);
        setSelectedAddRows(updateNer)

        const student = studentRAWList.find((item) => item.id === id);
        if (student) {
            // const { id, class_name, section } = student;
            // let class_id;
            let classSectionIDA;
            const foundItem = classAndSection.find(item => item.class_id == student.class_name_id && item.section_id == student.section_id && item.session_id == sessionID);

            if (foundItem) {
                classSectionIDA = foundItem.id
            }

            const updatedStudent = {
                ...student, // Copy all the fields from the original student object
                rank: "Participated", // Add the rank field
                classSectionIDA: classSectionIDA, // Add the rank field
            };

            setAddStudentRow((prevRows) => [...prevRows, updatedStudent]);
            setStudentList((prevList) => prevList.filter((item) => item.id !== id));
        }
    };

    const removeStudentInPat = async (id) => {// Check if the id exists in selectedAddRows
        const updateNer = await selectedRemoveRows.filter(row => row.id !== id);
        setSelectedRemoveRows(updateNer)
        const student = addStudentRow.find((item) => item.id === id);
        if (student) {
            const { id, first_name, class_name, section, session, profile_image } = student;
            // const updatedStudent = {
            //     id,
            //     profile_image,
            //     first_name,
            //     class_name,
            //     section,
            //     session,
            // };
            const updatedStudent = student;

            setStudentList((prevList) => [...prevList, updatedStudent]);
            setAddStudentRow((prevRows) => prevRows.filter((item) => item.id !== id));
        }
    };

    const SelectSession = () => {
        return (
            <>
                {/* <InputLabel id="session-simple-select-standard-label">Session</InputLabel> */}
                <FormControl variant="standard" sx={{ width: '100%' }}>
                    <Select
                        labelId="session-simple-select-standard-label"
                        id="session-simple-select-standard"
                        value={sessionID}
                        onChange={(e) => {
                            setSessionID(e.target.value)
                            setClassSectionID([])
                            setAddStudentRow([])
                        }}
                        label="Session"
                    >
                        {sessions.map(item => <MenuItem key={item?.id} value={item?.id}>{item?.name}</MenuItem>)}
                    </Select>
                </FormControl>
            </>
        )
    }
    const selectedClassAndSection = classAndSection.filter(item => classSectionID.includes(item.id));

    const [classAlertOpen, setClassAlertOpen] = useState(false);
    const [classDataAlert, setClassDataAlert] = useState('');

    const classAlertFun = (data) => {
        setClassDataAlert(data)
        setClassAlertOpen(true)
    }

    const handleClassAlertClose = () => {
        setClassAlertOpen(false)
        setClassDataAlert('')
    }
    const handleChange = async (event) => {
        const value = event.target.value;

        let valueArray = await value;

        if (value.includes("all")) {
            valueArray = [...classSectionArray.map((item) => item.id)];
        }

        for (const item of addStudentRow) {
            if (!valueArray.includes(item.classSectionIDA)) {
                classAlertFun(`Some students from ${item.class_name.toUpperCase() + " " + item.section.toUpperCase()} are participants. Please remove those students first.`)
                return null; // or return false, depending on your requirement
            }
        }
        const foundIDs = [];
        if (value.includes("all")) {
            // If "Select All" is selected, set classSectionID to contain all class and section IDs
            if (classSectionID.length === classSectionArray.length) {
                setClassSectionID([]);

                for (const item of valueArray) {
                    const foundStudent = await addStudentRow.find((student) => student.classSectionIDA === item);

                    if (foundStudent) {
                        foundIDs.push(foundStudent.classSectionIDA);
                    }
                }

                if (foundIDs.length > 0) {
                    let foundClassArry = [];
                    for (const item of foundIDs) {
                        const foundClass = await classSectionArray.find((classSec) => classSec.id === item);

                        if (foundClass) {
                            foundClassArry.push(`${foundClass.class_name + " " + foundClass.section_name}`);
                        }

                    }
                    classAlertFun(`Some students from ${foundClassArry.join(', ').toLocaleUpperCase()} are participants. Please remove those students first.`)

                }

                setClassSectionID(foundIDs);
                setPage(0)
            } else {
                setClassSectionID(classSectionArray.map((item) => item.id));
            }
            return;
        }


        setClassSectionID(value);
        setPage(0)
    };

    const [activity2, setActivity2] = useState([]);

    const handleActivityChange = (event) => {
        const { value } = event.target;

        const updatedActivity = {
            all: false,
            concentration: false,
            creativity: false,
            teamWork: false,
            presentation: false,
            logicApproach: false,
            confidence: false,
            socialSkill: false,
            motorSkill: false,
            patience: false,
        };

        value.forEach((activityType) => {
            updatedActivity[activityType] = true;
        });

        if (value.includes("all")) {
            updatedActivity.all = true;
            setActivity((prevActivity) => ({
                ...prevActivity,
                all: true,
                concentration: true,
                creativity: true,
                teamWork: true,
                presentation: true,
                logicApproach: true,
                confidence: true,
                socialSkill: true,
                motorSkill: true,
                patience: true,
            }));
            setActivity2(["all"]);
            if (value.length != 2) {
                return false;
            }
        } else if (value.length === 9) {
            updatedActivity.all = true;
        } else {
            setActivity((prevActivity) => ({
                ...prevActivity,
                all: false,
                concentration: value.includes("concentration"),
                creativity: value.includes("creativity"),
                teamWork: value.includes("teamWork"),
                presentation: value.includes("presentation"),
                logicApproach: value.includes("logicApproach"),
                confidence: value.includes("confidence"),
                socialSkill: value.includes("socialSkill"),
                motorSkill: value.includes("motorSkill"),
                patience: value.includes("patience"),
            }));
            setActivity2(value.filter((item) => item !== "all"));
        }

        setActivity(updatedActivity);
        setActivity2(value.filter((item) => item !== "all"));
    }

    const SelectEventType = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                {/* <InputLabel id="selectClass-simple-select-standard-label">Class</InputLabel> */}
                <Select
                    labelId="selectEventType-simple-select-standard-label"
                    id="selectEventType-simple-select-standard"
                    value={eventType}
                    onChange={(e) => { setEventType(e.target.value) }}
                    label="selectEventType"
                >
                    <MenuItem value={'inschool'}>School Level</MenuItem>
                    <MenuItem value={'inter_school'}>Inter-School Level</MenuItem>
                    <MenuItem value={'state'}>State Level</MenuItem>
                    <MenuItem value={'inter_state'}>Inter-State Level</MenuItem>
                    <MenuItem value={'national'}>National Level</MenuItem>
                    <MenuItem value={'inter_nation'}>Inter-National Level</MenuItem>
                </Select>
            </FormControl>
        )
    }

    const SelectParticipationType = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                {/* <InputLabel id="selectClass-simple-select-standard-label">Class</InputLabel> */}
                <Select
                    labelId="selectParticipationType-simple-select-standard-label"
                    id="selectParticipationType-simple-select-standard"
                    value={participationType}
                    onChange={(e) => { setParticipationType(e.target.value) }}
                    label="selectParticipationType"
                >
                    <MenuItem value={'solo'}>Solo</MenuItem>
                    <MenuItem value={'team'}>Team</MenuItem>
                </Select>
            </FormControl>
        )
    }

    const SelectCategory = () => {
        return (
            <FormControl variant="standard" sx={{ width: '100%' }}>
                <Select
                    labelId="selectCategory-simple-select-standard-label"
                    id="selectCategory-simple-select-standard"
                    value={eventCatergoryID}
                    onChange={(e) => { setEventCatergoryID(e.target.value) }}
                    label="selectCategory"
                // def
                >
                    {eventCatergorys.map(item => <MenuItem key={item?.id} value={item?.id}>{item?.name}</MenuItem>)}
                </Select>
            </FormControl>
        )
    }

    // const columnsR = ['S. No', 'Name', 'Class', 'Session', 'Action'];
    const columnsR = ['S. No', 'Name', 'Class', 'Student Registration', 'Action'];

    const columns = ['S. no', 'Name', 'Class', 'Result', 'Action']

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
            const selectedIds = uniqueStudentRows.map((row) => ({
                id: row.id,
            }));
            setSelectedAddRows(selectedIds);
        } else {
            setSelectedAddRows([]);
        }
    };

    // Add Function For multi
    const handleAddSelectedRows = async () => {
        const promises = selectedAddRows.map((item) => addStudentInPat(item?.id));
        await Promise.all(promises);
        setSelectedAddRows([]);
    };

    const isRemoveSelected = (id) => {
        return selectedRemoveRows.some((row) => row.id === id);
    };

    const handleSelectRemoveRow = (id) => {
        setSelectedRemoveRows((prevselectedRemoveRows) => {
            const isRowSelected = isRemoveSelected(id);
            if (isRowSelected) {
                return prevselectedRemoveRows.filter((row) => !(row.id === id));
            } else {
                return [...prevselectedRemoveRows, { id }];
            }
        });
    };

    const handleSelectAllRemoveRows = (event) => {
        if (event.target.checked) {
            const selectedIds = addStudentRow.map((row) => ({
                id: row.id,
            }));
            setSelectedRemoveRows(selectedIds);
        } else {
            setSelectedRemoveRows([]);
        }
    };

    // Add Function For multi

    const handleRemoveSelectedRows = () => {
        selectedRemoveRows.map((item) => {
            removeStudentInPat(item?.id)
        })
        setSelectedRemoveRows([])
    }


    return (
        <div>
            <Dialog fullWidth={true} maxWidth='xl' open={open} onClose={handleClose} >
                <DialogTitle variant='h5' >Add Workshop</DialogTitle>
                <DialogContent >
                    <form  >
                        <Stack spacing={2} >
                            <Grid container justifyContent='space-around' alignItems={'center'} >
                                <Grid item lg={4} xs={12} flexDirection='column' paddingX={2}>
                                    <FormLabel>Workshop Name*</FormLabel>
                                    <Input sx={{ display: 'block' }} placeholder='Workshop Name*' value={eventName} onChange={e => setEventName(e.target.value)} />
                                </Grid>
                                <Grid item lg={4} xs={12} flexDirection='column' paddingX={2}>
                                    <FormLabel>Workshop Description*</FormLabel>
                                    <Input sx={{ display: 'block' }} placeholder='Workshop Description*' value={eventDescription} onChange={e => setEventDescription(e.target.value)} />
                                </Grid>
                                <Grid item lg={4} xs={12} flexDirection='column' paddingX={2}>
                                    <FormLabel>Workshop Date*</FormLabel>
                                    <Input sx={{ display: 'block' }} placeholder='28-06-2000' type='date' value={dateOfEvent} onChange={e => setDateOfEvent(e.target.value)} />

                                </Grid>
                            </Grid>
                            <Grid container justifyContent='space-around' alignItems={'center'} >
                                <Grid item lg={4} xs={12} paddingX={2}>
                                    <FormLabel>Session*</FormLabel>
                                    <SelectSession />
                                </Grid>
                                <Grid item lg={4} xs={12} flexDirection='column' paddingX={2}>
                                    <FormLabel>Eligible Class*</FormLabel>
                                    <FormControl variant="standard" sx={{ width: '100%' }}>
                                        <Select
                                            multiple
                                            value={classSectionID}
                                            onChange={handleChange}
                                            onClick={(e) => {
                                                if (e.key !== "Escape") {
                                                    // Prevents autoselecting item while typing (default Select behavior)
                                                    e.stopPropagation();
                                                }
                                                e.stopPropagation();
                                            }}
                                            MenuProps={{
                                                getcontentanchorel: null,
                                            }}
                                            renderValue={(selected) => {
                                                if (selected.includes("all")) {
                                                    return "Select All";
                                                }
                                                return selected.map(id => {
                                                    const item = classAndSection.find(section => section.id === id);
                                                    return (item?.class_name + " " + item?.section_name).toUpperCase();
                                                }).join(", ");
                                            }}
                                        >
                                            {classSectionArray.length > 0 ? (
                                                <MenuItem value="all">
                                                    <ListItemIcon>
                                                        <Checkbox
                                                            checked={classSectionID.length === classAndSection.length}
                                                            indeterminate={classSectionID.length > 0 && classSectionID.length < classAndSection.length}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText primary="Select All" />
                                                </MenuItem>
                                            ) : null}

                                            {classSectionArray.map((item) => (
                                                <MenuItem key={item.id} value={item.id}>
                                                    <ListItemIcon>
                                                        <Checkbox checked={classSectionID.includes(item.id)} />
                                                    </ListItemIcon>
                                                    <ListItemText primary={(item?.class_name + " " + item?.section_name).toUpperCase()} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item lg={4} xs={12} flexDirection='column' paddingX={2}>
                                    <FormLabel>Workshop Type*</FormLabel>
                                    <SelectEventType />
                                </Grid>
                            </Grid>
                            <Grid container alignItems={'center'} >
                                <Grid item lg={4} xs={12} paddingX={2}>
                                    <FormLabel>Category*</FormLabel>
                                    <SelectCategory />
                                </Grid>
                                <Grid item lg={4} xs={12} flexDirection='column' paddingX={2}>
                                    <FormLabel>Participation Type*</FormLabel>
                                    <SelectParticipationType />
                                </Grid>
                                <Grid item lg={4} xs={12} flexDirection='column' paddingX={2}>
                                    <FormLabel>Outcomes</FormLabel>
                                    <FormControl variant="standard" sx={{ width: '100%' }}>
                                        <Select
                                            multiple
                                            value={activity2}
                                            onChange={handleActivityChange}
                                            renderValue={(selected) => {
                                                if (selected.includes("all")) {
                                                    return "Select All";
                                                }
                                                const selectedActivities = selected.map((value) => {
                                                    switch (value) {
                                                        case "concentration":
                                                            return "Concentration";
                                                        case "creativity":
                                                            return "Creativity";
                                                        case "teamWork":
                                                            return "Team Work";
                                                        case "presentation":
                                                            return "Presentation";
                                                        case "logicApproach":
                                                            return "Logical Approach";
                                                        case "confidence":
                                                            return "Confidence";
                                                        case "socialSkill":
                                                            return "Social Skill";
                                                        case "motorSkill":
                                                            return "Motor Skill";
                                                        case "patience":
                                                            return "Patience";
                                                        default:
                                                            return "";
                                                    }
                                                });
                                                return selectedActivities.join(", ");
                                            }}
                                        >
                                            <MenuItem value="all">
                                                <ListItemIcon>
                                                    <Checkbox checked={activity.all} />
                                                </ListItemIcon>
                                                <ListItemText primary="Select All" />
                                            </MenuItem>
                                            <MenuItem value="concentration">
                                                <ListItemIcon>
                                                    <Checkbox checked={activity.concentration} />
                                                </ListItemIcon>
                                                <ListItemText primary="Concentration" />
                                            </MenuItem>
                                            <MenuItem value="creativity">
                                                <ListItemIcon>
                                                    <Checkbox checked={activity.creativity} />
                                                </ListItemIcon>
                                                <ListItemText primary="Creativity" />
                                            </MenuItem>
                                            <MenuItem value="teamWork">
                                                <ListItemIcon>
                                                    <Checkbox checked={activity.teamWork} />
                                                </ListItemIcon>
                                                <ListItemText primary="Team Work" />
                                            </MenuItem>
                                            <MenuItem value="presentation">
                                                <ListItemIcon>
                                                    <Checkbox checked={activity.presentation} />
                                                </ListItemIcon>
                                                <ListItemText primary="Presentation" />
                                            </MenuItem>
                                            <MenuItem value="logicApproach">
                                                <ListItemIcon>
                                                    <Checkbox checked={activity.logicApproach} />
                                                </ListItemIcon>
                                                <ListItemText primary="Logical Approach" />
                                            </MenuItem>
                                            <MenuItem value="confidence">
                                                <ListItemIcon>
                                                    <Checkbox checked={activity.confidence} />
                                                </ListItemIcon>
                                                <ListItemText primary="Confidence" />
                                            </MenuItem>
                                            <MenuItem value="socialSkill">
                                                <ListItemIcon>
                                                    <Checkbox checked={activity.socialSkill} />
                                                </ListItemIcon>
                                                <ListItemText primary="Social Skill" />
                                            </MenuItem>
                                            <MenuItem value="motorSkill">
                                                <ListItemIcon>
                                                    <Checkbox checked={activity.motorSkill} />
                                                </ListItemIcon>
                                                <ListItemText primary="Motor Skill" />
                                            </MenuItem>
                                            <MenuItem value="patience">
                                                <ListItemIcon>
                                                    <Checkbox checked={activity.patience} />
                                                </ListItemIcon>
                                                <ListItemText primary="Patience" />
                                            </MenuItem>
                                        </Select>

                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Stack>
                    </form>
                    <Divider sx={{ marginY: 2 }} />
                    <Stack direction={'row'} justifyContent={"space-between"} alignItems='center' spacing={2}>
                        <Typography variant='h5'>Add Participants</Typography>
                        {selectedRemoveRows.length > 0 && (
                            <Stack style={{ margin: '0px 0px' }}>
                                <Button
                                    color="primary"
                                    variant="outlined"
                                    style={{ background: 'red', color: '#fff', border: '0', textAlign: 'center' }}
                                    onClick={handleRemoveSelectedRows}
                                >
                                    Remove{" (" + selectedRemoveRows.length + ")"}
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" style={{ padding: "8px" }}>
                                        {addStudentRow.length == 0 ? null : (<Checkbox
                                            indeterminate={selectedRemoveRows.length > 0 && selectedRemoveRows.length < addStudentRow.length}
                                            checked={selectedRemoveRows.length === addStudentRow.length}
                                            onChange={handleSelectAllRemoveRows}
                                        />)}
                                    </TableCell>
                                    {columns.map((column) => (
                                        <TableCell key={column} align={column === "Name" ? ("left") : ("center")}>
                                            {column}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(addStudentRow) && addStudentRow.length > 0 ? (
                                    addStudentRow.sort((a, b) => {
                                        const classA = parseInt(a.class_name) || 0;
                                        const classB = parseInt(b.class_name) || 0;

                                        if (classA !== classB) {
                                            return classA - classB;
                                        }

                                        const sectionA = a.section.charCodeAt(0) || 0;
                                        const sectionB = b.section.charCodeAt(0) || 0;

                                        if (sectionA !== sectionB) {
                                            return sectionA - sectionB;
                                        }

                                        const firstNameA = a?.student_details?.first_name || a?.first_name || '';
                                        const firstNameB = b?.student_details?.first_name || b?.first_name || '';

                                        return firstNameA.localeCompare(firstNameB);
                                    }).map((item, n = 0, index) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={item.id}>
                                                <TableCell align={'center'} style={{ padding: "8px" }}>
                                                    <Checkbox
                                                        checked={isRemoveSelected(item.id)}
                                                        onChange={() => handleSelectRemoveRow(item?.id)}
                                                    />
                                                </TableCell>
                                                <TableCell align={'center'} style={{ padding: "8px" }}>
                                                    {n + 1}
                                                </TableCell>
                                                <TableCell align={'center'} style={{ padding: "8px", height: "55px" }} sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    {item?.profile_image == "" || item?.profile_image == undefined || item?.profile_image == null ? (<Image src={require('../../../assets/Images/profile.png')} width={'35'} height={"35"} style={{ borderRadius: "50px" }} />) : (<Image src={"https://cyber-tutor-x-backend.vercel.app/" + item?.profile_image} width={'35'} height={"35"} style={{ borderRadius: "50px" }} />)}
                                                    {`${item?.student_details?.first_name ?? ''} ${item?.student_details?.middle_name ?? ''} ${item?.student_details?.last_name ?? ''}`}
                                                </TableCell>
                                                <TableCell align={'center'} style={{ padding: "8px" }} >
                                                    {(item?.class_name + " " + item?.section).toUpperCase()}
                                                </TableCell>
                                                <TableCell align={'center'} style={{ padding: "8px" }} >
                                                    {item?.rank}
                                                </TableCell >
                                                <TableCell key={'action'} align={'center'} style={{ padding: "8px" }} >
                                                    <Button
                                                        color="info"
                                                        onClick={() => { removeStudentInPat(item?.id) }}
                                                    >
                                                        Remove
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            No Student (Add the student)
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Divider sx={{ margin: "20px 0px", background: "#000" }} />
                    <Stack direction={'row'} alignItems={"flex-end"} justifyContent={"space-between"} mx={3} mt={5} mb={1} spacing={1}>
                        <Stack direction={'row'} gap={2} alignItems={"flex-end"} spacing={1}>
                            <Typography variant='h6'>Search students</Typography>
                            <FormControl variant="standard" sx={{ width: '150px', margin: "0px 12px", flexDirection: "row", alignItems: "center", borderBottom: "1px solid #BEBEBE" }}>
                                <input value={studentSearchFilter} onChange={handleStudentSearch} placeholder='Search Student' style={{ border: "0", color: "#BEBEBE", width: "130px" }} />
                                {
                                    studentSearchFilter.length == 0 ? (
                                        <SearchIcon style={{ border: "0", color: "#BEBEBE", }} />) : (
                                        <CloseIcon style={{ border: "0", color: "#BEBEBE", cursor: "pointer" }} onClick={clearSearchFlied} />
                                    )
                                }
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
                                    {sectionFilterArray.filter((item, index, self) => self.findIndex((i) => i.section_name === item.section_name) === index)
                                        .map((item) => (
                                            <MenuItem key={item.section_id} value={item.section_name}>{(item.section_name).toUpperCase()}</MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                        </Stack>
                        {selectedAddRows.length > 0 && (
                            <Stack style={{ margin: '0px 0px' }}>
                                <Button
                                    color="primary"
                                    variant="outlined"
                                    style={{ background: '#1a73e8', color: '#fff', border: '0', textAlign: 'center' }}
                                    onClick={handleAddSelectedRows}
                                >
                                    Add{" (" + selectedAddRows.length + ")"}
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" style={{ padding: "8px" }}>
                                        {uniqueStudentRows.length == 0 ? null : (<Checkbox
                                            indeterminate={selectedAddRows.length > 0 && selectedAddRows.length < uniqueStudentRows.length}
                                            checked={selectedAddRows.length === uniqueStudentRows.length}
                                            onChange={handleSelectAllRows}
                                        />)}
                                    </TableCell>
                                    {columnsR.map((column) => (
                                        <TableCell
                                            key={column}
                                            align={column === "Name" ? ("left") : ("center")}
                                        >
                                            {column}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(uniqueStudentRows) && uniqueStudentRows.length > 0 ? (
                                    uniqueStudentRows.sort((a, b) => {
                                        const classA = parseInt(a.class_name) || 0;
                                        const classB = parseInt(b.class_name) || 0;

                                        if (classA !== classB) {
                                            return classA - classB;
                                        }

                                        const sectionA = a.section.charCodeAt(0) || 0;
                                        const sectionB = b.section.charCodeAt(0) || 0;

                                        if (sectionA !== sectionB) {
                                            return sectionA - sectionB;
                                        }

                                        const firstNameA = a?.student_details?.first_name || a?.first_name || '';
                                        const firstNameB = b?.student_details?.first_name || b?.first_name || '';

                                        return firstNameA.localeCompare(firstNameB);
                                    }).map((item, n = 0, index) => {
                                        return (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={item.id}>
                                                <TableCell align={'center'} style={{ padding: "8px" }}>
                                                    <Checkbox
                                                        checked={isAddSelected(item.id)}
                                                        onChange={() => handleSelectRow(item?.id)}
                                                    />
                                                </TableCell>
                                                <TableCell align={'center'} style={{ padding: "8px" }}>
                                                    {page * rowsPerPage + n + 1}
                                                </TableCell>
                                                <TableCell align={'center'} style={{ padding: "8px", height: "55px" }} sx={{ fontSize: "12px", fontWeight: "600", display: "flex", alignItems: "center", gap: "10px" }}>
                                                    {/* {item.student_details?.first_name + " " + (item.student_details?.middle_name != null ? (item.student_details?.middle_name) : ('')) + " " + (item.student_details?.last_name != null ? (item.student_details?.last_name) : ('')) || item?.first_name} */}
                                                    {item?.profile_image == "" || item?.profile_image == undefined || item?.profile_image == null ? (<Image src={require('../../../assets/Images/profile.png')} width={'35'} style={{ borderRadius: "50px" }} />) : (<Image src={"https://cyber-tutor-x-backend.vercel.app/" + item?.profile_image} width={'35'} style={{ borderRadius: "50px" }} />)}
                                                    {item?.student_details ? (item.student_details?.first_name + " " + (item.student_details?.middle_name != null ? (item.student_details?.middle_name) : ('')) + " " + (item.student_details?.last_name != null ? (item.student_details?.last_name) : (''))) : (item?.first_name)}
                                                </TableCell>
                                                <TableCell align={'center'} style={{ padding: "8px" }}>
                                                    {(item?.class_name + " " + item?.section).toUpperCase()}
                                                </TableCell>
                                                <TableCell align={'center'} style={{ padding: "8px" }}>
                                                    {item?.registration_no}
                                                </TableCell>
                                                <TableCell key={'action'} align={'center'} style={{ padding: "8px" }}>
                                                    <Button
                                                        color="info"
                                                        onClick={() => { addStudentInPat(item?.id) }}
                                                    >
                                                        Add
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">
                                            No Student (Select the class)
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50, 100]}
                            component="div"
                            count={studentList.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageStudenChange}
                        />
                    </TableContainer>
                </DialogContent>
                <Typography color='red' textAlign={'center'}>{errorMsg}</Typography>
                {loading ? <Loader /> : <Button variant='contained' color='warning' sx={{ padding: 1.5, paddingRight: 6, paddingLeft: 6, margin: 'auto', width: 'fit-content' }} onClick={handleAddEvent} >Add Workshop</Button>}
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={classAlertOpen}
                onClose={handleClassAlertClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Class Alert"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" style={{ fontSize: "14px", color: "#000" }}>{classDataAlert}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClassAlertClose} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}