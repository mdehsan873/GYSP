import {
    Container,
    Box,
    useMediaQuery,
    Button,
    Stack,
    Grid,
    FormLabel,
    FormControl,
    Select,
    MenuItem,
    Typography, Checkbox,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination
} from '@mui/material';
import { Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import { Image } from "react-bootstrap";
import TableSortLabel from '@mui/material/TableSortLabel';
import { visuallyHidden } from '@mui/utils';
import FilePresentIcon from '@mui/icons-material/FilePresent';
// Icons
import EditIcon from '@mui/icons-material/Edit';
import ApartmentIcon from "@mui/icons-material/Apartment";
import AccordionWrapper from "../../components/AccordionWrapper";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DescriptionIcon from "@mui/icons-material/Description";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import { getAxiosWithToken } from "../../axios/AxiosObj";
import { toast } from 'react-toastify';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import React, { useEffect, useState } from "react";
import axios from "axios";
import AxiosObj from "../../axios/AxiosObj";
import Loader from "../../components/Loader";
// Dialogs
import AddSession from "./AddSession";

import AddClass from "./AddClass";
import EditClass from "./EditClass";

import AddSubject from "./AddSubject";
import EditSubject from "./EditSubject";

import AddTestDialog from "./AddTestDialog";
import EditTestDialog from "./EditTestDialog";

import AddTeacher from "./AddTeacher";
import EditTeacher from "./EditTeacher";
import AssignClass from "./AssignClass";

import AddBulkSubject from "./AddBulkSubject";
import AddBulkTeacher from "./AddBulkTeacher";

import EditSchoolLogo from "./EditSchoolILogo";

import { useSelector } from "react-redux";
import AssignSubject from "./AssignSubject";


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ExcelListing from '../../components/dialogs/ExcelListing';

import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import { resetLocal } from './../../partials/localStorage'
import secureLocalStorage from "react-secure-storage";
import CloseIcon from '@mui/icons-material/Close';

export default function Infrastructure() {

    useEffect(() => {
        resetLocal("infra");
    }, []);

    const mob = useMediaQuery("(max-width:600px)");
    const { sessions, school, classAndSection } = useSelector(state => state.infra)

    // Session
    const [openAddSession, setOpenAddSession] = useState(false);
    const [openAddSubject, setOpenAddSubject] = useState(false);

    const [loading, setLoading] = useState(false);

    // Edit Image Logo
    const [editlogoData, setEditlogoData] = useState({});
    const [openEditLogo, setOpenEditLogo] = useState(false);
    const editSchoolImage = (url) => {
        setEditlogoData({
            imgUrl: url
        })
        setOpenEditLogo(true)
    }

    const [selectedId, setSelectedId] = useState("0")

    const [expanded, setExpanded] = useState("");

    const capitalizeWords = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // -------------------------------------- Test Pattern  --------------------------------------
    const [testPatternRAWData, setTestPatternRAWData] = useState([]);
    const [testPatternData, setTestPatternData] = useState([]);
    const [testPatternSessionFilter, setTestPatternSessionFilter] = useState("");

    // Edit Option
    const [addTestPattern, setAddTestPattern] = useState(false);
    const [editTestPattern, setEditTestPattern] = useState(false)
    const [editTestPatternData, seteditTestPatternData] = useState({})
    const editTestPatterndailog = (id, name, tests) => {
        setEditTestPattern(true)
        seteditTestPatternData({
            "id": id,
            "name": name,
            "tests": tests
        })
    }

    useEffect(() => {
        const filteredTestPattern = testPatternRAWData.filter((testP) => {
            const sessionMatch =
                testPatternSessionFilter === "all" ||
                testP.tests.some((test) => test.session_name === testPatternSessionFilter);
            return sessionMatch;
        });

        const filteredTests = filteredTestPattern.map((testP) => {
            const filteredTest = testP.tests.filter(
                (test) => test.session_name === testPatternSessionFilter && test.test_pattern_name === testP.name
            );
            return { ...testP, tests: filteredTest };
        });

        setTestPatternData(filteredTests);
    }, [testPatternSessionFilter, testPatternRAWData]);


    // -------------------------------------- Class Section --------------------------------------

    // Filter Array 
    const [classFilterArrayClass, setClassFilterArrayClass] = useState([]);
    const [sectionFilterArrayClass, setSectionFilterArrayClass] = useState([]);

    const [classSectionData, setClassSectionData] = useState([]);
    const [classSectionRAWData, setClassSectionRAWData] = useState([]);
    const [classSectionSessionFilter, setClassSectionSessionFilter] = useState("all");
    const [classSectionClassFilter, setClassSectionClassFilter] = useState("all");
    const [classSectionSecFilter, setClassSectionSecFilter] = useState("all");

    const [classSectionPage, setClassSectionPage] = useState(0);
    const [classSectionRowsPerPage, setClassSectionRowsPerPage] = useState(10);

    const [sorting, setSorting] = useState({ column: '', order: '' });

    const [classSectionSearchFilter, setClassSectionSearchFilter] = useState("");


    const clearSearchFliedClass = () => {
        if (classSectionSearchFilter.length !== 0) {
            setClassSectionSearchFilter('')
        }
    }
    // Edit Option
    const [openAddClass, setOpenAddClass] = useState(false);
    const [openEditClass, setOpenEditClass] = useState(false);
    const [editClassData, seteditClassData] = useState({})
    const editClassDailog = (id, session) => {
        setOpenEditClass(true)
        seteditClassData({
            "id": id,
            "session": session
        })
    }
    const classColumns = ["Class", "Session", "Edit"]

    const handleClassSearch = (event) => {
        setClassSectionSearchFilter(event.target.value);
        setClassSectionPage(0); // Set teacherPage to 0 when search filter changes
    };

    useEffect(() => {
        let filteredClassSection = classSectionRAWData.filter((classSectionItem) => {
            const sessionMatch = 'all';
            const classMatch = classSectionClassFilter === 'all' || classSectionItem.class_name === classSectionClassFilter;
            const sectionMatch = classSectionSecFilter === 'all' || classSectionItem.section_name === classSectionSecFilter;
            const nameMatch =
                classSectionSearchFilter.trim() === '' ||
                classSectionItem.class_name.toLowerCase().includes(classSectionSearchFilter.toLowerCase().trim()) ||
                classSectionItem.section_name.toLowerCase().includes(classSectionSearchFilter.toLowerCase().trim()) ||
                `${classSectionItem.class_name} ${classSectionItem.section_name}`
                    .toLowerCase()
                    .includes(classSectionSearchFilter.toLowerCase().trim());
            return sessionMatch && classMatch && sectionMatch && nameMatch;
        });

        setClassSectionData(filteredClassSection);
    }, [
        classSectionRAWData,
        classSectionSessionFilter,
        classSectionClassFilter,
        classSectionSecFilter,
        classSectionSearchFilter,
    ]);

    const handleClassSectionPageChange = (event, newPage) => {
        setClassSectionPage(newPage);
        secureLocalStorage.setItem("classSectionPage", newPage)
    };

    const handleClassSectionPerPageChange = (event) => {
        setClassSectionRowsPerPage(parseInt(event.target.value, 10));
        secureLocalStorage.setItem("classSectionRowsPerPage", parseInt(event.target.value, 10))
        setClassSectionPage(0);
    };

    const handleColumnSort = (column) => {
        let order = 'asc';
        if (sorting.column === column && sorting.order === 'asc') {
            order = 'desc';
        }
        setSorting({ column, order });
    };
    let sortedData = [...classSectionData];

    if (sorting.column && sorting.order) {
        sortedData.sort((a, b) => {
            let aValue;
            let bValue;

            if (sorting.column === 'Class') {
                const classA = a.class_name.toLowerCase();
                const classB = b.class_name.toLowerCase();

                // Extract the numeric part of the class name
                const aNumericPart = parseInt(classA);
                const bNumericPart = parseInt(classB);

                // Compare the numeric part first
                if (!isNaN(aNumericPart) && !isNaN(bNumericPart)) {
                    const numericComparison = aNumericPart - bNumericPart;
                    if (numericComparison !== 0) {
                        return sorting.order === 'asc' ? numericComparison : -numericComparison;
                    }
                }

                // Compare the remaining string part of the class name
                const aStringPart = classA.replace(/^\d+/, '').trim();
                const bStringPart = classB.replace(/^\d+/, '').trim();
                aValue = aStringPart;
                bValue = bStringPart;
            } else {
                aValue = a.session_name;
                bValue = b.session_name;
            }

            // Handle undefined values
            if (typeof aValue === 'undefined') return sorting.order === 'asc' ? -1 : 1;
            if (typeof bValue === 'undefined') return sorting.order === 'asc' ? 1 : -1;

            if (sorting.order === 'asc') {
                return aValue.localeCompare(bValue);
            } else {
                return bValue.localeCompare(aValue);
            }
        });
    }

    const paginatedClassSectionData = sortedData.slice(
        classSectionPage * classSectionRowsPerPage,
        classSectionPage * classSectionRowsPerPage + classSectionRowsPerPage
    );

    useEffect(() => {
        setClassFilterArrayClass([...classAndSection]);
        setSectionFilterArrayClass([...classAndSection]);
        setSectionFilterArrayTeacher([...classAndSection]);
        setClassFilterArrayTeacher([...classAndSection]);
        setSectionFilterArraySubject([...classAndSection]);
        setClassFilterArraySubject([...classAndSection]);
        if (sessions.length > 0 && sessions[0]?.name !== undefined) {
            // Call the function only when sessions array is available
            // handleSessionArray(sessions[0].name);
            setTestPatternSessionFilter(sessions[0]?.name);
            setClassSectionSessionFilter(sessions[0]?.name);
        }
    }, [classAndSection]);

    useEffect(() => {
        let filteredClass = classAndSection.filter((cc) => {
            const classMatch = 'all' ;
            return classMatch;
        });
        setClassFilterArrayClass(filteredClass);

        let filteredSection = classAndSection.filter((section) => {
            const sectionMatch = 'all' ;
            return sectionMatch;
        });
        setSectionFilterArrayClass(filteredSection);
    }, [classSectionSessionFilter]);

    useEffect(() => {
        let filteredSection = classFilterArrayClass.filter((section) => {
            const sectionMatch = classSectionClassFilter === 'all' || section.class_name == classSectionClassFilter;
            return sectionMatch;
        });
        setSectionFilterArrayClass(filteredSection);
    }, [classSectionClassFilter]);


    // -------------------------------------- Teacher --------------------------------------

    // Filter Array 
    const [classFilterArrayTeacher, setClassFilterArrayTeacher] = useState([]);
    const [sectionFilterArrayTeacher, setSectionFilterArrayTeacher] = useState([]);

    const [teacherData, setTeacherData] = useState([]);
    const [teacherRAWData, setTeacherRAWData] = useState([]);

    const [teacherSessionFilter, setTeacherSessionFilter] = useState("all");
    const [teacherClassFilter, setTeacherClassFilter] = useState("all");
    const [teacherSectionFilter, setTeacherSectionFilter] = useState("all");
    const [teacherSearchFilter, setTeacherSearchFilter] = useState('');


    const clearSearchFliedTeacher = () => {
        if (teacherSearchFilter.length !== 0) {
            setTeacherSearchFilter('')
        }
    }

    const [teacherPage, setTeacherPage] = useState(0);
    const [teacherRowsPerPage, setTeacherRowsPerPage] = useState(10);

    const [teacherSorting, setTeacherSorting] = useState({
        column: null,
        order: 'asc',
    });

    const teacherColumns = ["Name", "Contact", "Email", "Class Teacher", "Edit"];

    useEffect(() => {
        let filteredSection = classAndSection.filter((section) => {
            const sectionMatch = teacherClassFilter === 'all' || section.class_name == teacherClassFilter;
            return sectionMatch;
        });
        setSectionFilterArrayTeacher(filteredSection);
    }, [teacherClassFilter]);

    useEffect(() => {
        let filteredTeacher = teacherRAWData.filter((teacherItem) => {
            const sessionMatch =
                teacherSessionFilter === "all" ||
                teacherItem.session_name === teacherSessionFilter;
            const classMatch = teacherClassFilter === "all" || (teacherItem.class_teacher && teacherItem.class_teacher.class_name === teacherClassFilter);
            const sectionMatch =
                teacherSectionFilter === "all" ||
                (teacherItem.class_teacher &&
                    teacherItem.class_teacher.section === teacherSectionFilter);

            const nameMatch =
                teacherSearchFilter.trim() === "" ||
                teacherItem.teacher_details.name
                    .toLowerCase()
                    .includes(teacherSearchFilter.toLowerCase().trim()) ||
                teacherItem.teacher_details.email
                    .toLowerCase()
                    .includes(teacherSearchFilter.toLowerCase().trim());
            return sessionMatch && classMatch && sectionMatch && nameMatch;
        });

        setTeacherData(filteredTeacher);

    }, [
        teacherSessionFilter,
        teacherClassFilter,
        teacherSectionFilter,
        teacherSearchFilter,
        teacherRAWData,
    ]);
    const handleTeacherSearch = (event) => {
        setTeacherSearchFilter(event.target.value);
        setTeacherPage(0); // Set teacherPage to 0 when search filter changes
    };


    const handleTeacherPageChange = (event, newPage) => {
        setTeacherPage(newPage);
        secureLocalStorage.setItem("teacherPage", newPage)
    };

    const handleTeacherRowsPerPageChange = (event) => {
        setTeacherRowsPerPage(parseInt(event.target.value, 10));
        secureLocalStorage.setItem("teacherRowsPerPage", parseInt(event.target.value, 10))
        setTeacherPage(0);
    };

    const handleTeacherColumnSort = (column) => {
        setTeacherSorting((prevSorting) => {
            if (prevSorting.column === column) {
                return {
                    column,
                    order: prevSorting.order === 'asc' ? 'desc' : 'asc',
                };
            } else {
                return {
                    column,
                    order: 'asc',
                };
            }
        });
    };

    // Sort the data based on the sorting state
    let sortedTeacherData = [...teacherData];
    if (teacherSorting.column && teacherSorting.order) {
        sortedTeacherData.sort((a, b) => {
            const aValue = a.teacher_details.name;
            const bValue = b.teacher_details.name;

            // Handle undefined values and null values
            if (typeof aValue === 'undefined' || aValue === null) {
                return teacherSorting.order === 'asc' ? -1 : 1;
            }
            if (typeof bValue === 'undefined' || bValue === null) {
                return teacherSorting.order === 'asc' ? 1 : -1;
            }

            if (teacherSorting.order === 'asc') {
                if (aValue < bValue) return -1;
                if (aValue > bValue) return 1;
                return 0;
            } else {
                if (aValue > bValue) return -1;
                if (aValue < bValue) return 1;
                return 0;
            }
        });
    }

    const paginatedTeacherData = sortedTeacherData.slice(teacherPage * teacherRowsPerPage, teacherPage * teacherRowsPerPage + teacherRowsPerPage);

    const [openAssignClassTeacher, setOpenAssignClassTeacher] = useState(false);
    const [assignClassTeacherData, setAssignClassTeacherData] = useState({});

    const assignClassToTeacher = (id, nameS, classSec) => {
        setOpenAssignClassTeacher(true)
        setAssignClassTeacherData({
            "id": id,
            "name": nameS,
            "classSec": classSec,
        })
    }

    const [openBulkTeacherUpload, setOpenBulkTeacherUpload] = useState(false)
    const [openEditTeacher, setOpenEditTeacher] = useState(false)
    const [openAddTeacher, setOpenAddTeacher] = useState(false);

    // Multi Delete

    const [selectedTeacherRows, setSelectedTeacherRows] = useState([]);

    const isTeacherSelected = (id) => {
        return selectedTeacherRows.some((row) => row.id === id);
    };

    const handleTeacherSelectRow = (id) => {
        setSelectedTeacherRows((prevSelectedTeacherRows) => {
            const isRowTeacherSelected = isTeacherSelected(id);
            if (isRowTeacherSelected) {
                return prevSelectedTeacherRows.filter((row) => !(row.id === id));
            } else {
                return [...prevSelectedTeacherRows, { id }];
            }
        });
    };

    const [openTeacherBox2, setOpenTeacherBox2] = useState(false);

    const handleSelectAllTeacherRows = (event) => {
        if (event.target.checked) {
            const selectedTeacherIds = paginatedTeacherData.map((row) => ({
                id: row.id,
            }));
            setSelectedTeacherRows(selectedTeacherIds);
        } else {
            setSelectedTeacherRows([]);
        }
    };

    const handleDeleteSelectedRowsTeacherRqt = () => {
        setOpenTeacherBox2(true)
    }
    const handleTeacherClose = () => {
        setOpenTeacherBox2(false)
    };
    const handleDeleteSelectedTeacherRows = async () => {
        let errorOccurred = false;

        try {
            for (const selectedRow of selectedTeacherRows) {
                const id = selectedRow.id;

                const config = {
                    method: 'DELETE',
                    url: `teacher/delete/teacher/${id}`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),
                    },
                };

                await AxiosObj.request(config);
            }
        } catch (error) {
            errorOccurred = true;
            if (error.response && error.response.data && error.response.data.Data) {
                const errorMessage = error.response.data.Data;
                if (Array.isArray(errorMessage)) {
                    errorMessage.forEach((item) => {
                        toast.error(item || "Something went wrong...!");
                    });
                } else {
                    toast.error(errorMessage || "Something went wrong...!");
                }
            } else {
                toast.error("Something went wrong...!");
            }
        } finally {
            setLoading(false);

            if (!errorOccurred) {
                toast.success("Teachers have been deleted");
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        }
    };

    const [openViewExcelBox, setOpenViewExcelBox] = useState(false);
    const [excelApiUrl, setExcelApiUrl] = useState('');
    const [excelType, setExcelType] = useState('');

    const viewTeacherExcel = () => {
        setExcelApiUrl('teacher/get/csv/')
        setOpenViewExcelBox(true);
        setExcelType('teacher');
    };

    // -------------------------------------- Subject --------------------------------------
    const viewSubjectExcel = () => {
        setExcelApiUrl('subject/get/csv/')
        setOpenViewExcelBox(true);
        setExcelType('subject');
    };

    // Filter Array 
    const [classFilterArraySubject, setClassFilterArraySubject] = useState([]);
    const [sectionFilterArraySubject, setSectionFilterArraySubject] = useState([]);

    const [allsubjectData, setAllSubjectData] = useState([]);
    const [allsubjectRAWData, setAllSubjectRAWData] = useState([]);

    const [subjectSessionFilter, setSubjectSessionFilter] = useState('all');
    const [subjectClassFilter, setSubjectClassFilter] = useState('all');
    const [subjectSectionFilter, setSubjectSectionFilter] = useState('all');
    const [subjectTypeFilter, setSubjectTypeFilter] = useState('all');

    const [subjectPage, setSubjectPage] = useState(0);
    const [subjectRowsPerPage, setSubjectRowsPerPage] = useState(10);
    const [subjectSearchFilter, setSubjectSearchFilter] = useState('');

    // clearSearchFliedSubject

    const clearSearchFliedSubject = () => {
        if (subjectSearchFilter.length !== 0) {
            setSubjectSearchFilter('')
        }
    }

    const subjectColumns = ['Name', 'Class', 'Type', 'Subject Teacher', 'Edit'];
    // const subjectColumns = ['Name', 'Class', 'Subject Teacher', 'Edit'];

    const handleSubjectSearch = (event) => {
        setSubjectSearchFilter(event.target.value);
        setSubjectPage(0); // Set teacherPage to 0 when search filter changes
    };

    useEffect(() => {
        let filteredSubject = allsubjectRAWData.filter((subjectItem) => {
            const sessionMatch = subjectSessionFilter === 'all' || subjectItem.session_name === subjectSessionFilter;
            const classMatch = subjectClassFilter === 'all' || subjectItem.class_name === subjectClassFilter;
            const sectionMatch = subjectSectionFilter === 'all' || subjectItem.section_name === subjectSectionFilter;
            const typeMatch = subjectTypeFilter === 'all' || subjectItem.subject_type === subjectTypeFilter;
            const nameMatch = subjectSearchFilter.trim() === '' || subjectItem.name.toLowerCase().includes(subjectSearchFilter.toLowerCase().trim());
            return sessionMatch && classMatch && sectionMatch && typeMatch && nameMatch;
        });

        setAllSubjectData(filteredSubject);
    }, [subjectSessionFilter, subjectClassFilter, subjectSectionFilter, subjectTypeFilter, allsubjectRAWData, subjectSearchFilter]);

    const handleSubjectPageChange = (event, newPage) => {
        secureLocalStorage.setItem("subjectPage", newPage)
        setSubjectPage(newPage);
    };

    const handleSubjectRowsPerPageChange = (event) => {
        secureLocalStorage.setItem("subjectRowsPerPage", parseInt(event.target.value, 10))
        setSubjectRowsPerPage(parseInt(event.target.value, 10));
        setSubjectPage(0);
    };

    const paginatedSubjectData = allsubjectData.slice(subjectPage * subjectRowsPerPage, subjectPage * subjectRowsPerPage + subjectRowsPerPage);

    // open edit subject box
    const [openBulkSubjectUpload, setOpenBulkSubjectUpload] = useState(false);
    const [openEditSubject, setOpenEditSubject] = useState(false);
    const [editSubjectData, setEditSubjectData] = useState({});

    const editSubjectdailog = (id, name, subjectType, subjectClass, subjectSection, subjectTeacher, isMandatory) => {
        setOpenEditSubject(true);
        setEditSubjectData({
            id,
            name,
            subjectType,
            subjectClass,
            subjectSection,
            subjectTeacher,
            isMandatory,
        });
    };

    const [openAssignSubjectTeacher, setOpenAssignSubjectTeacher] = useState(false);
    const [assignSubjectTeacherData, setAssignSubjectTeacherData] = useState({});

    const [selectedRows, setSelectedRows] = useState([]);

    const isSelected = (subjectId, subjectType) => {
        return selectedRows.some((row) => row.subjectId === subjectId && row.subjectType === subjectType);
    };

    const handleSelectRow = (subjectId, subjectType) => {
        setSelectedRows((prevSelectedRows) => {
            const isRowSelected = isSelected(subjectId, subjectType);
            if (isRowSelected) {
                return prevSelectedRows.filter((row) => !(row.subjectId === subjectId && row.subjectType === subjectType));
            } else {
                return [...prevSelectedRows, { subjectId, subjectType }];
            }
        });
    };

    const handleSelectAllRows = (event) => {
        if (event.target.checked) {
            const selectedIds = paginatedSubjectData.map((row) => ({
                subjectId: row.subject_id,
                subjectType: row.subject_type
            }));
            setSelectedRows(selectedIds);
        } else {
            setSelectedRows([]);
        }
    };

    const [openSubjectBox2, setOpenSubjectBox2] = useState(false);

    const handleDeleteSelectedRowsRqt = () => {
        setOpenSubjectBox2(true)
    }
    const handleSubjectClose = () => {
        setOpenSubjectBox2(false)
    };

    const handleDeleteSelectedRows = () => {
        try {
            selectedRows.forEach((row) => {
                const { subjectId, subjectType } = row;
                let url;
                if (subjectType === 'AcadmicsSubject') {
                    url = `subject/delete/acadmics/${subjectId}/`;
                } else {
                    url = `subject/delete/coscholastic/${subjectId}/`;
                }

                let data;
                let config = {
                    method: 'DELETE',
                    maxBodyLength: Infinity,
                    url,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + secureLocalStorage.getItem('access'),
                    },
                    data
                };

                AxiosObj.request(config)
                    .catch((e) => {
                        try {
                            e.response.data?.Data.map((item) => {
                                toast.error(item || "Something went wrong...!");
                            });
                        } catch (ee) {
                            toast.error(e.response.data?.Data || "Something went wrong...!");
                        }
                    })
                    .finally(() => setLoading(false));
            });
        } catch (e) {
            toast.error(e.response.data?.Data || "Something went wrong...!");
        } finally {
            toast.success("Subjects have been deleted");
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    };


    useEffect(() => {
        let filteredSection = classAndSection.filter((section) => {
            const sectionMatch = subjectClassFilter === 'all' || section.class_name == subjectClassFilter;
            return sectionMatch;
        });
        setSectionFilterArraySubject(filteredSection);
    }, [subjectClassFilter]);

    useEffect(() => {
        let filteredClass = classAndSection.filter((cc) => {
            const classMatch = subjectSessionFilter === 'all' || cc.session_name === subjectSessionFilter;
            return classMatch;
        });
        setClassFilterArraySubject(filteredClass);

        let filteredSection = classAndSection.filter((section) => {
            const sectionMatch = subjectSessionFilter === 'all' || section.session_name == subjectSessionFilter;
            return sectionMatch;
        });
        setSectionFilterArraySubject(filteredSection);
    }, [subjectSessionFilter]);

    // Assign Subject to Teacher
    const assignSubjectToTeacher = (id, name, subjectType, teacherName) => {
        setOpenAssignSubjectTeacher(true);
        setAssignSubjectTeacherData({
            id,
            name,
            subjectType,
            teacherName,
        });
    };

    // Handle Filter change
    const handleFilterChange = async (e) => {
        const { name, value } = e.target;

        // Filter
        // if (name === "testPatternSession") {
        //     secureLocalStorage.setItem("infraTestPatternSession", value);
        //     setTestPatternSessionFilter(value);
        // }

        // Class Section
        if (name === "classSectionSession") {
            secureLocalStorage.setItem("infraClassSectionSession", value);
            setClassSectionSessionFilter(value);
        }
        if (name === "classSectionClass") {
            secureLocalStorage.setItem("infraClassSectionClass", value);
            setClassSectionClassFilter(value);
        }
        if (name === "classSectionSec") {
            secureLocalStorage.setItem("infraClassSectionSec", value);
            setClassSectionSecFilter(value);
        }

        // Teachers
        if (name === "teacherSession") {
            secureLocalStorage.setItem("infraTeacherSession", value);
            setTeacherSessionFilter(value);
        }
        if (name === "teacherClass") {
            secureLocalStorage.setItem("infraTeacherClass", value);
            setTeacherClassFilter(value);
        }
        if (name === "teacherSection") {
            secureLocalStorage.setItem("infraTeacherSection", value);
            setTeacherSectionFilter(value);
        }

        // Subject
        if (name === "subjectSession") {
            secureLocalStorage.setItem("infraSubjectSession", value);
            setSubjectSessionFilter(value);
        }
        if (name === "subjectClass") {
            secureLocalStorage.setItem("infraSubjectClass", value);
            setSubjectClassFilter(value);
        }
        if (name === "subjectSection") {
            secureLocalStorage.setItem("infraSubjectSection", value);
            setSubjectSectionFilter(value);
        }
        if (name === "subjectType") {
            secureLocalStorage.setItem("infraSubjectType", value);
            setSubjectTypeFilter(value);
        }

    };

    // useEffect(() => {
    //     if (secureLocalStorage.getItem("infraTestPatternSession")) {
    //         setTestPatternSessionFilter(secureLocalStorage.getItem("infraTestPatternSession"))
    //     } else {
    //         if (sessions.length > 0 && sessions[0]?.name !== undefined) {
    //             setTestPatternSessionFilter(sessions[0]?.name);
    //         }
    //     }
    //     if (secureLocalStorage.getItem("infraClassSectionSession")) {
    //         setClassSectionSessionFilter(secureLocalStorage.getItem("infraClassSectionSession"))
    //     } else {
    //         if (sessions.length > 0 && sessions[0]?.name !== undefined) {
    //             setClassSectionSessionFilter(sessions[0]?.name);
    //         }
    //     }
    // }, [sessions]);

    // Fetch Data
    const fetchAllData = async () => {
        setLoading(true);
        try {
            const AxiosObj = getAxiosWithToken();
            // Test Pattern
            if (secureLocalStorage.getItem("testPatternFilterRAW")) {
                setTestPatternRAWData(secureLocalStorage.getItem("testPatternFilterRAW"));
                setLoading(false);
            } else {
                let config2 = {
                    method: 'GET',
                    maxBodyLength: Infinity,
                    url: 'result/get/testpattern/',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                    },
                };
                AxiosObj.request(config2).then((res) => {
                    setTestPatternRAWData(res?.data?.Data);
                    if (res.data.Data.length !== 0) {
                        secureLocalStorage.setItem("testPatternFilterRAW", res?.data?.Data)
                    }

                }).catch((e) => console.log(e)).finally(() => { setLoading(false); });
            }

            // teacher
            if (secureLocalStorage.getItem("teacherRAWData")) {
                setTeacherRAWData(secureLocalStorage.getItem("teacherRAWData"));
                setLoading(false);
            } else {
                let config2 = {
                    method: 'GET',
                    maxBodyLength: Infinity,
                    url: `teacher/get/`,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                    },
                };
                const teacherData = await AxiosObj.request(config2);
                setTeacherRAWData(teacherData.data.results)
                if (teacherData.data.results && teacherData.data.results.length !== 0) {
                    secureLocalStorage.setItem("teacherRAWData", teacherData.data.results)
                }
            }

            // subject
            if (secureLocalStorage.getItem("allSubjectRAWData")) {
                setAllSubjectRAWData(secureLocalStorage.getItem("allSubjectRAWData"));
                setLoading(false);
            } else {

                let config3 = {
                    method: 'GET',
                    maxBodyLength: Infinity,
                    url: "subject/get/all/",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                    },
                };
                const subjectData = await AxiosObj.request(config3);
                setAllSubjectRAWData([...subjectData.data.acadmics_subject, ...subjectData.data.co_scholastic_subject]);
                if (subjectData.data.acadmics_subject && subjectData.data.co_scholastic_subject && (subjectData.data.co_scholastic_subject.length !==0 || subjectData.data.acadmics_subject.length !==0)) {
                    secureLocalStorage.setItem("allSubjectRAWData", [...subjectData.data.acadmics_subject, ...subjectData.data.co_scholastic_subject])
                }
            }

        } catch (e) {
            console.log("error :", e)
        } finally {
            setLoading(false)
        };
    };

    useEffect(() => {
        fetchAllData()
    }, [])

    useEffect(() => {
        setClassSectionRAWData([...classAndSection]);
    }, [classAndSection])


    useEffect(() => {
        // if (secureLocalStorage.getItem("infraTestPatternSession")) {
        //     setTestPatternSessionFilter(secureLocalStorage.getItem("infraTestPatternSession"))
        // }

        if (secureLocalStorage.getItem("infraClassSectionSession")) {
            setClassSectionSessionFilter(secureLocalStorage.getItem("infraClassSectionSession"))
        }
        if (secureLocalStorage.getItem("infraClassSectionClass")) {
            setClassSectionClassFilter(secureLocalStorage.getItem("infraClassSectionClass"))
        }
        if (secureLocalStorage.getItem("infraClassSectionSec")) {
            setClassSectionSecFilter(secureLocalStorage.getItem("infraClassSectionSec"))
        }
        if (secureLocalStorage.getItem("classSectionPage")) {
            setClassSectionPage(secureLocalStorage.getItem("classSectionPage"))
        }
        if (secureLocalStorage.getItem("classSectionRowsPerPage")) {
            setClassSectionRowsPerPage(secureLocalStorage.getItem("classSectionRowsPerPage"))
        }

        if (secureLocalStorage.getItem("infraTeacherSession")) {
            setTeacherSessionFilter(secureLocalStorage.getItem("infraTeacherSession"))
        }
        if (secureLocalStorage.getItem("infraTeacherClass")) {
            setTeacherClassFilter(secureLocalStorage.getItem("infraTeacherClass"))
        }
        if (secureLocalStorage.getItem("infraTeacherSection")) {
            setTeacherSectionFilter(secureLocalStorage.getItem("infraTeacherSection"))
        }
        if (secureLocalStorage.getItem("teacherPage")) {
            setTeacherPage(secureLocalStorage.getItem("teacherPage"))
        }
        if (secureLocalStorage.getItem("teacherRowsPerPage")) {
            setTeacherRowsPerPage(secureLocalStorage.getItem("teacherRowsPerPage"))
        }

        if (secureLocalStorage.getItem("subjectSession")) {
            setSubjectSessionFilter(secureLocalStorage.getItem("subjectSession"))
        }
        if (secureLocalStorage.getItem("infraSubjectClass")) {
            setSubjectClassFilter(secureLocalStorage.getItem("infraSubjectClass"))
        }
        if (secureLocalStorage.getItem("subjectSection")) {
            setSubjectSectionFilter(secureLocalStorage.getItem("subjectSection"))
        }
        if (secureLocalStorage.getItem("infraSubjectType")) {
            setSubjectTypeFilter(secureLocalStorage.getItem("infraSubjectType"))
        }
        if (secureLocalStorage.getItem("subjectPage")) {
            setSubjectPage(secureLocalStorage.getItem("subjectPage"))
        }
        if (secureLocalStorage.getItem("subjectRowsPerPage")) {
            setSubjectRowsPerPage(secureLocalStorage.getItem("subjectRowsPerPage"))
        }
    }, []);

    return (
        <Container maxWidth="xxl" sx={{ maxWidth: "100%", border: 0, }}>
            <Link
                className="secondary"
                to={'/'}
                style={{ margin: "10px", marginBottom: "0px", display: "flex", cursor: "pointer", alignItems: "center", color: "#3D3D3D", fontSize: "14px", textDecoration: "none" }}
            >
                <ArrowBackIosIcon style={{ marginRight: "4px", fontSize: "12px" }} /> Back
            </Link>
            {loading ? (
                <Loader />
            ) : (
                <Box
                    sx={{
                        // backgroundColor: "white",
                        padding: 1,
                        marginTop: 0,
                        borderRadius: 2,
                    }}
                >
                    <AccordionWrapper
                        title={"Basic Information"}
                        name={"basicInfo"} setExpanded={setExpanded} expanded={expanded}
                        icon={<ApartmentIcon />}
                    >
                        <table style={{ textAlign: "left" }}>
                            <tr>
                                <th>
                                    <Typography marginY={"auto"}>School Name</Typography>
                                </th>
                                <td>
                                    <span style={{ padding: mob ? 8 : 50 }}></span>
                                </td>
                                <td>
                                    <Typography sx={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                        {school.name} {" "}
                                        <ImageListItem style={{ height: "60px" }}>
                                            {school.logo ? (<Image
                                                src={"https://cyber-tutor-x-backend.vercel.app/" + school.logo || require("../../assets/Logo/noimage.png")}
                                                style={{ width: 65, height: 60, marginLeft: 0, marginRight: 0, borderRadius: "50px" }}
                                            />) : (<Image
                                                src={require("../../assets/Logo/noimage.png")}
                                                style={{ width: 65, height: 60, marginLeft: 0, marginRight: 0, borderRadius: "50px" }}
                                            />)}
                                            <ImageListItemBar
                                                actionPosition='left'
                                                sx={{ width: 65, borderRadius: "0px 0px 75px 75px" }}
                                                className='MuiImageListItemBar-positionBelow'
                                                actionIcon={
                                                    <IconButton
                                                        sx={{ color: 'rgba(255, 255, 255, 0.54)', marginLeft: "15px" }}
                                                        aria-label={`info about `}
                                                    >
                                                        <CameraAltOutlinedIcon style={{ color: "#fff" }} onClick={() => { editSchoolImage(school.logo) }} />
                                                    </IconButton>
                                                }
                                            />
                                        </ImageListItem>
                                    </Typography>
                                </td>
                            </tr>
                            <tr>
                                <th><Typography>Address</Typography></th>
                                <td></td>
                                <td><Typography>{school.address_line1 + " " + school.address_line2}</Typography></td>
                            </tr>
                            <tr>
                                <th><Typography>Registration No.</Typography></th>
                                <td></td>
                                <td><Typography>{school.registration_no}</Typography></td>
                            </tr>
                            <tr>
                                <th><Typography>Board</Typography></th>
                                <td></td>
                                <td><Typography>{school.board}</Typography></td>
                            </tr>
                            <tr>
                                <th><Typography>Contact No. </Typography></th>
                                <td></td>
                                <td><Typography>{school.phone}</Typography></td>
                            </tr>
                            <tr>
                                <th><Typography>Email</Typography></th>
                                <td></td>
                                <td><Typography>{school.email}</Typography></td>
                            </tr>
                        </table>
                    </AccordionWrapper>
                    <AccordionWrapper title="Sessions" name={"sessions"} setExpanded={setExpanded} expanded={expanded} icon={<CalendarMonthIcon />}>
                        <Typography>Sessions</Typography>
                        <Typography variant="h5">{sessions.length}</Typography>
                        <Typography style={{ margin: "20px 0px 0px" }}>Available sessions</Typography>
                        <Grid container >
                            <Grid item mt={2} mb={3}>
                                {sessions.map((item) => {
                                    return <Typography
                                        variant="contained"
                                        px={2}
                                        py={1}
                                        mr={2}
                                        key={item.id}
                                        sx={{
                                            width: "60px",
                                            textAlign: "center",
                                            fontSize: "12px",
                                            background: "#0a6fe2",
                                            color: "#fff",
                                            border: "2px solid #0a6fe2",
                                            borderRadius: "6px"
                                        }}>
                                        {item?.name}
                                    </Typography>
                                }
                                )}
                            </Grid>
                        </Grid>
                        {/* <Button
                            color="info"
                            sx={{ textTransform: "capitalize", marginTop: 3 }}
                            onClick={() => setOpenAddSession(true)}
                        >
                            + Add New Session
                        </Button> */}
                    </AccordionWrapper>
                    <AccordionWrapper title="Test Pattern" name={"test"} expanded={expanded} setExpanded={setExpanded} icon={<DescriptionIcon />}>
                        <Typography>Test Patterns </Typography>
                        <Typography variant="h5">{testPatternData.length || 0}</Typography>
                        <Button
                            color="info"
                            sx={{ textTransform: "capitalize", marginTop: 1 }}
                            onClick={() => setAddTestPattern(true)}
                        >
                            + Add New Test Pattern
                        </Button>
                        <Grid container mt={1} alignItems={'center'}>
                            <Stack margin={2}>
                                <FormLabel style={{ color: "#000", fontSize: "14px", fontWeight: 600 }}>Filters</FormLabel>
                            </Stack>
                            <Stack margin={2}>
                                <FormControl variant="standard" sx={{ width: '100px', margin: '0px 12px' }}>
                                    <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Session</FormLabel>
                                    <Select
                                        // IconComponent={() => (
                                        //     <UnfoldMoreIcon
                                        //         style={{
                                        //             cursor: "pointer",
                                        //         }}
                                        //     />
                                        // )}
                                        labelId="session-simple-select-standard-label"
                                        id="session-simple-select-standard"
                                        value={testPatternSessionFilter}
                                        name="testPatternSession"
                                        onChange={handleFilterChange}
                                        style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                        label="testPatternSession"
                                    >
                                        {sessions.map((item) => (
                                            <MenuItem key={item.id} value={item?.name}>
                                                {item?.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Grid>
                        {Array.isArray(testPatternData) && testPatternData.length > 0 ? (
                            testPatternData?.map((item, index) => (
                                <div key={index} style={{ marginTop: "19px" }}>
                                    <Typography key={item?.test} style={{ textTransform: "capitalize", }}>
                                        {item?.name}  {"  "}
                                        <EditIcon style={{ height: "15px", width: "15px", marginLeft: "10px", cursor: "pointer" }}
                                            onClick={() => {
                                                editTestPatterndailog(item?.test_pattern_id, item?.name, item?.tests);
                                            }} />
                                    </Typography>
                                    <div style={{ display: "flex" }}>
                                        {item.tests.sort((a, b) => a.test_id - b.test_id).map((testItem, index3 = 0) => (
                                            <Typography
                                                variant="body1"
                                                px={2}
                                                py={1}
                                                mr={2}
                                                style={{ marginTop: "6px", width: "fit-content", marginRight: '10px' }}
                                                key={index3 + 1}
                                                sx={{
                                                    textAlign: "center",
                                                    fontSize: "12px",
                                                    background: "#0a6fe2",
                                                    color: "#fff",
                                                    border: "2px solid #0a6fe2",
                                                    borderRadius: "6px"
                                                }}>
                                                {(testItem?.test)?.toUpperCase()}
                                            </Typography>
                                        ))}
                                    </div>
                                </div>
                            ))) : (
                            <Typography>No Test Pattern</Typography>
                        )}

                    </AccordionWrapper>
                    <AccordionWrapper title="Classes" name={"classes"} setExpanded={setExpanded} expanded={expanded} icon={<CoPresentIcon />}>
                        <Typography>Total Classes</Typography>
                        <Typography variant="h5">{classSectionData.length}</Typography>
                        <Button
                            color="info"
                            sx={{ textTransform: "capitalize", marginTop: 1 }}
                            onClick={() => {
                                setOpenAddClass(true);
                            }}
                        >
                            + Add New Class
                        </Button>
                        <Stack direction={"row"} alignItems={'center'} mt={0} mb={1} spacing={2} paddingLeft={1}>
                            <Stack style={{ margin: "0px 12px" }}>
                                <FormLabel style={{ color: "#000", fontSize: "14px", fontWeight: 500 }}>Filters</FormLabel>
                            </Stack>
                            <Grid container alignItems="end">
                                <FormControl variant="standard" sx={{ width: '150px', margin: "0px 12px", flexDirection: "row", alignItems: "center", borderBottom: "1px solid #BEBEBE" }}>
                                    <input value={classSectionSearchFilter} onChange={handleClassSearch} placeholder='Search Class' style={{ border: "0", color: "#000", width: "130px" }} />
                                    {
                                        classSectionSearchFilter.length == 0 ? (
                                            <SearchIcon style={{ border: "0", color: "#BEBEBE", }} />) : (
                                            <CloseIcon style={{ border: "0", color: "#BEBEBE", cursor: "pointer" }} onClick={clearSearchFliedClass} />
                                        )
                                    }
                                </FormControl>
                                
                                <FormControl variant="standard" sx={{ width: '100px', margin: "0px 12px" }}>
                                    <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Class</FormLabel>
                                    <Select
                                        // IconComponent={() => (
                                        //     <UnfoldMoreIcon
                                        //         style={{
                                        //             cursor: "pointer",
                                        //         }}
                                        //     />
                                        // )}
                                        labelId="classSectionClass-simple-select-standard-label"
                                        id="classSectionClass-simple-select-standard"
                                        value={classSectionClassFilter}
                                        name="classSectionClass"
                                        onChange={handleFilterChange}
                                        style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                        label="classSectionClass"
                                    >
                                        <MenuItem value={"all"}>All</MenuItem>
                                        {classFilterArrayClass
                                            .filter((item, index, self) => self.findIndex((i) => i.class_name === item.class_name) === index)
                                            .map((item, index) => (
                                                <MenuItem key={index} value={item.class_name}>{(item.class_name).toUpperCase()}</MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="standard" sx={{ width: '100px', margin: "0px 12px" }}>
                                    <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Section</FormLabel>
                                    <Select
                                        // IconComponent={() => (
                                        //     <UnfoldMoreIcon
                                        //         style={{
                                        //             cursor: "pointer",
                                        //         }}
                                        //     />
                                        // )}
                                        labelId="classSectionSec-simple-select-standard-label"
                                        id="classSectionSec-simple-select-standard"
                                        value={classSectionSecFilter}
                                        name="classSectionSec"
                                        onChange={handleFilterChange}
                                        style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                        label="classSectionSec"
                                    >
                                        <MenuItem value={"all"}>All</MenuItem>
                                        {sectionFilterArrayClass
                                            .filter((item, index, self) => self.findIndex((i) => i.section_name === item.section_name) === index)
                                            .map((item, index) => (
                                                <MenuItem key={index} value={item.section_name}>{(item.section_name).toUpperCase()}</MenuItem>
                                            ))}

                                    </Select>
                                </FormControl>
                            </Grid>
                        </Stack>
                        <Box sx={{ width: mob ? "90%" : "40%" }}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 300 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            {classColumns.map((column, index) => (
                                                <TableCell key={index} align="left">
                                                    {column === 'Edit' ? (
                                                        <Typography variant="body" sx={{ fontSize: '14px', fontWeight: '600' }}>
                                                            {column}
                                                        </Typography>
                                                    ) : (
                                                        <TableSortLabel
                                                            active={sorting.column === column}
                                                            direction={sorting.column === column ? sorting.order : 'asc'}
                                                            onClick={() => handleColumnSort(column)}
                                                        >
                                                            <Typography variant="body" sx={{ fontSize: '14px', fontWeight: '600' }}>
                                                                {column}
                                                            </Typography>
                                                            {sorting.column === column ? (
                                                                <Box component="span" sx={visuallyHidden}>
                                                                    {sorting.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                                </Box>
                                                            ) : null}
                                                        </TableSortLabel>
                                                    )}
                                                </TableCell>
                                            ))}

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.isArray(paginatedClassSectionData) && paginatedClassSectionData.length > 0 ? (
                                            paginatedClassSectionData.map((row, index) => (
                                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell align="left" style={{ paddingTop: '10px', paddingBottom: '10px' }} >{(row.class_name + ' ' + row.section_name).toUpperCase()}</TableCell>
                                                    <TableCell align="left" style={{ paddingTop: '10px', paddingBottom: '10px' }}>{row.session_name}</TableCell>
                                                    <TableCell align="left" style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                                                        <EditIcon
                                                            onClick={() => {
                                                                editClassDailog(row.id, row.session_name);
                                                            }}
                                                            style={{ height: '15px', width: '15px', cursor: 'pointer' }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={3} align="center">
                                                    No Class
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                    component="div"
                                    count={classSectionData.length}
                                    rowsPerPage={classSectionRowsPerPage}
                                    page={classSectionPage}
                                    onPageChange={handleClassSectionPageChange}
                                    onRowsPerPageChange={handleClassSectionPerPageChange}
                                />
                            </TableContainer>
                        </Box>
                    </AccordionWrapper>

                    <AccordionWrapper title="Teachers" name={"teachers"} setExpanded={setExpanded} expanded={expanded} icon={<PeopleAltIcon />}>
                        <Stack direction={"row"} justifyContent={"space-between"}>
                            <Stack>
                                <Typography>Total Teachers</Typography>
                                <Typography variant="h5" mb={1} mx={1}>{teacherRAWData.length}</Typography>
                            </Stack>
                            <Stack direction={'row'} alignItems={"center"} mx={0} mt={2} mb={1} spacing={1}>
                                <Stack direction={'row'} alignItems={"center"} mx={0}>
                                    <FilePresentIcon style={{ width: "20px", height: "auto" }} />
                                    <Button onClick={viewTeacherExcel} style={{ marginRight: "10px", color: "#3D3D3D", fontSize: "13px", fontWeight: "600" }}>View Uploaded Excel</Button>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                            <Stack direction={"row"}>
                                <Button
                                    color="info"
                                    sx={{ textTransform: "capitalize", marginTop: 0 }}
                                    onClick={() => {
                                        setOpenAddTeacher(true);
                                    }}
                                >
                                    + Add Teacher
                                </Button>
                                <Button
                                    color="info"
                                    sx={{ textTransform: "capitalize", marginTop: 0 }}
                                    onClick={() => {
                                        setOpenBulkTeacherUpload(true);
                                    }}
                                >
                                    + Add Bulk Teacher
                                </Button>
                                <FormControl variant="standard" sx={{ width: '150px', margin: "0px 12px", flexDirection: "row", alignItems: "center", borderBottom: "1px solid #BEBEBE" }}>
                                    <input value={teacherSearchFilter} onChange={handleTeacherSearch} placeholder='Search Teacher' style={{ border: "0", color: "#BEBEBE", width: "130px" }} />
                                    {
                                        teacherSearchFilter.length == 0 ? (
                                            <SearchIcon style={{ border: "0", color: "#BEBEBE", }} />) : (
                                            <CloseIcon style={{ border: "0", color: "#BEBEBE", cursor: "pointer" }} onClick={clearSearchFliedTeacher} />
                                        )
                                    }
                                </FormControl>
                                <FormControl variant="standard" sx={{ width: '100px', margin: "0px 12px" }}>
                                    <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Class</FormLabel>
                                    <Select
                                        // IconComponent={() => (
                                        //     <UnfoldMoreIcon
                                        //         style={{
                                        //             cursor: "pointer",
                                        //         }}
                                        //     />
                                        // )}
                                        labelId="teacherClassFilter-simple-select-standard-label"
                                        id="teacherClassFilter-simple-select-standard"
                                        value={teacherClassFilter}
                                        name="teacherClass"
                                        onChange={handleFilterChange}
                                        style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                        label="teacherClassFilter"
                                    >
                                        <MenuItem value={"all"}>All</MenuItem>
                                        {classFilterArrayTeacher
                                            .filter((item, index, self) => self.findIndex((i) => i.class_name === item.class_name) === index)
                                            .map((item) => (
                                                <MenuItem key={item.id} value={item.class_name}>{(item.class_name).toUpperCase()}</MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="standard" sx={{ width: '100px', margin: "0px 12px" }}>
                                    <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Section</FormLabel>
                                    <Select
                                        // IconComponent={() => (
                                        //     <UnfoldMoreIcon
                                        //         style={{
                                        //             cursor: "pointer",
                                        //         }}
                                        //     />
                                        // )}
                                        labelId="teacherSectionFilter-simple-select-standard-label"
                                        id="teacherSectionFilter-simple-select-standard"
                                        value={teacherSectionFilter}
                                        name="teacherSection"
                                        onChange={handleFilterChange}
                                        style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                        label="teacherSectionFilter"
                                    >
                                        <MenuItem value={"all"}>All</MenuItem>
                                        {sectionFilterArrayTeacher.filter((item, index, self) => self.findIndex((i) => i.section_name === item.section_name) === index)
                                            .map((item) => (
                                                <MenuItem key={item.id} value={item.section_name}>{(item.section_name).toUpperCase()}</MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                            </Stack>
                            {selectedTeacherRows.length > 0 && (
                                <Stack style={{ margin: '0px 12px' }}>
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        style={{ background: 'red', color: '#fff', border: '0', textAlign: 'center' }}
                                        startIcon={<DeleteIcon style={{ margin: '0' }} />}
                                        onClick={handleDeleteSelectedRowsTeacherRqt}
                                    >
                                        Delete
                                    </Button>
                                </Stack>
                            )}
                        </Stack>
                        <Box sx={{ width: mob ? "90%" : "100%" }}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">
                                                {paginatedTeacherData.length == 0 ? null : (<Checkbox
                                                    indeterminate={selectedTeacherRows.length > 0 && selectedTeacherRows.length < paginatedTeacherData.length}
                                                    checked={selectedTeacherRows.length === paginatedTeacherData.length}
                                                    onChange={handleSelectAllTeacherRows}
                                                />)}

                                            </TableCell>
                                            <TableCell align="left" style={{ cursor: "no-drop" }}>
                                                <Typography variant="body" sx={{ fontSize: '14px', fontWeight: '600' }}>
                                                    S. No
                                                </Typography>
                                            </TableCell>
                                            {teacherColumns.map((column) => {
                                                // Check if the column is one of the columns where sorting should be disabled
                                                const disableSorting = ["Contact", "Email", "Class Teacher", "Edit"].includes(column);

                                                return (
                                                    <TableCell align="left" key={column}>
                                                        {disableSorting ? (
                                                            <Typography variant="body" sx={{ fontSize: '14px', fontWeight: '600' }}>
                                                                {column}
                                                            </Typography>
                                                        ) : (
                                                            <TableSortLabel
                                                                active={teacherSorting.column === column.toLocaleLowerCase()}
                                                                direction={teacherSorting.order}
                                                                onClick={() => handleTeacherColumnSort(column.toLocaleLowerCase())}
                                                            >
                                                                <Typography variant="body" sx={{ fontSize: '14px', fontWeight: '600' }}>
                                                                    {column}
                                                                </Typography>
                                                                {teacherSorting.column === column.toLocaleLowerCase() ? (
                                                                    <Box component="span" sx={visuallyHidden}>
                                                                        {teacherSorting.order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                                                    </Box>
                                                                ) : null}
                                                            </TableSortLabel>
                                                        )}
                                                    </TableCell>
                                                );
                                            })}

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.isArray(paginatedTeacherData) && paginatedTeacherData.length > 0 ? (
                                            paginatedTeacherData.map((row, index) => (
                                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                                                        <Checkbox
                                                            style={{ paddingTop: '0px', paddingBottom: '0px' }}
                                                            checked={isTeacherSelected(row.id)}
                                                            onChange={() => handleTeacherSelectRow(row.id)}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{(teacherPage * teacherRowsPerPage) + index + 1}</TableCell>
                                                    <TableCell align="left" style={{ paddingTop: '12px', paddingBottom: '12px' }}>{row.teacher_details.name}</TableCell>
                                                    <TableCell align="left" style={{ paddingTop: '12px', paddingBottom: '12px' }}>{row.teacher_details.phone_no}</TableCell>
                                                    <TableCell align="left" style={{ paddingTop: '12px', paddingBottom: '12px' }}>{row.teacher_details.email}</TableCell>
                                                    <TableCell align="left" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                                                        <Button color="info" style={{ textTransform: "uppercase", paddingTop: '0px', paddingBottom: '0px' }} onClick={() => { assignClassToTeacher(row.id, row.teacher_details.name, row.class_teacher) }}>
                                                            {row.class_teacher === null ? ("Assign Class") : ((row.class_teacher.class_name + " " + row.class_teacher.section).toUpperCase())}
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell align="left" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                                                        <Button
                                                            color="info"
                                                            style={{ justifyContent: "flex-start", padding: "0" }}
                                                            onClick={() => {
                                                                setSelectedId(row.id.toString());
                                                                setOpenEditTeacher(true)
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    No Teacher
                                                </TableCell>
                                            </TableRow>
                                        )}

                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                    component="div"
                                    count={teacherData.length}
                                    rowsPerPage={teacherRowsPerPage}
                                    page={teacherPage}
                                    onPageChange={handleTeacherPageChange}
                                    onRowsPerPageChange={handleTeacherRowsPerPageChange}
                                />
                            </TableContainer>
                        </Box>
                    </AccordionWrapper>
                    <AccordionWrapper title="Subjects" name={"subjects"} setExpanded={setExpanded} expanded={expanded} icon={<MenuBookIcon />}>
                        <Stack direction={"row"} justifyContent={"space-between"}>
                            <Stack>
                                <Typography>Total Subject</Typography>
                                <Typography variant="h5" mb={1} mx={1}>{allsubjectData.length}</Typography>
                            </Stack>
                            <Stack direction={'row'} alignItems={"center"} mx={0} mt={2} mb={1} spacing={1}>
                                <Stack direction={'row'} alignItems={"center"} mx={0}>
                                    <FilePresentIcon style={{ width: "20px", height: "auto" }} />
                                    <Button onClick={viewSubjectExcel} style={{ marginRight: "10px", color: "#3D3D3D", fontSize: "13px", fontWeight: "600" }}>View Uploaded Excel</Button>
                                </Stack>
                            </Stack>
                        </Stack>
                        <Stack direction={"row"} >
                            <Button
                                color="info"
                                sx={{ textTransform: "capitalize", marginTop: 1 }}
                                onClick={() => {
                                    setOpenAddSubject(true);
                                }}
                            >
                                + Add Subject
                            </Button>
                            <Button
                                color="info"
                                sx={{ textTransform: "capitalize", marginTop: 1 }}
                                onClick={() => {
                                    setOpenBulkSubjectUpload(true);
                                }}
                            >
                                + Add Bulk Subject
                            </Button>
                        </Stack>
                        <Stack direction={"row"} alignItems={'center'} mt={0} mb={1} spacing={2} paddingLeft={1}>
                            <Stack style={{ margin: "0px 12px" }}>
                                <FormLabel style={{ color: "#000", fontSize: "16px", fontWeight: 600 }}>Filters</FormLabel>
                            </Stack>
                            <Grid container alignItems="end">
                                {/* <FormControl variant="standard" sx={{ width: '100px', margin: "0px 12px" }}>
                                    <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Session</FormLabel>
                                    <Select
                                        IconComponent={() => (
                                            <UnfoldMoreIcon
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                            />
                                        )}
                                        labelId="subjectSession-simple-select-standard-label"
                                        id="subjectSession-simple-select-standard"
                                        value={subjectSessionFilter}
                                        name="subjectSession"
                                        onChange={handleFilterChange}
                                        style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                        label="subjectSession"
                                    >
                                        <MenuItem value={"all"}>All</MenuItem>
                                        {sessions.map((item) => (
                                            <MenuItem key={item.id} value={item.name}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl> */}
                                <FormControl variant="standard" sx={{ width: '100px', margin: "0px 12px" }}>
                                    <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Class</FormLabel>
                                    <Select
                                        // IconComponent={() => (
                                        //     <UnfoldMoreIcon
                                        //         style={{
                                        //             cursor: "pointer",
                                        //         }}
                                        //     />
                                        // )}
                                        labelId="subjectClass-simple-select-standard-label"
                                        id="subjectClass-simple-select-standard"
                                        value={subjectClassFilter}
                                        name="subjectClass"
                                        onChange={handleFilterChange}
                                        style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                        label="subjectClass"
                                    >
                                        <MenuItem value={"all"}>All</MenuItem>
                                        {classFilterArraySubject.filter((item, index, self) => self.findIndex((i) => i.class_name === item.class_name) === index)
                                            .map((item) => (
                                                <MenuItem key={item.id} value={item.class_name}>{(item.class_name).toUpperCase()}</MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="standard" sx={{ width: '100px', margin: "0px 12px" }}>
                                    <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Section</FormLabel>
                                    <Select
                                        // IconComponent={() => (
                                        //     <UnfoldMoreIcon
                                        //         style={{
                                        //             cursor: "pointer",
                                        //         }}
                                        //     />
                                        // )}
                                        labelId="subjectSection-simple-select-standard-label"
                                        id="subjectSection-simple-select-standard"
                                        value={subjectSectionFilter}
                                        name="subjectSection"
                                        onChange={handleFilterChange}
                                        style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                        label="subjectSection"
                                    >
                                        <MenuItem value={"all"}>All</MenuItem>
                                        {sectionFilterArraySubject.filter((item, index, self) => self.findIndex((i) => i.section_name === item.section_name) === index)
                                            .map((item) => (
                                                <MenuItem key={item.id} value={item.section_name}>{(item.section_name).toUpperCase()}</MenuItem>
                                            ))}
                                    </Select>
                                </FormControl>
                                <FormControl variant="standard" sx={{ width: '100px', margin: "0px 12px" }}>
                                    <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Type</FormLabel>
                                    <Select
                                        // IconComponent={() => (
                                        //     <UnfoldMoreIcon
                                        //         style={{
                                        //             cursor: "pointer",
                                        //         }}
                                        //     />
                                        // )}
                                        labelId="subjectType-simple-select-standard-label"
                                        id="subjectType-simple-select-standard"
                                        value={subjectTypeFilter}
                                        name="subjectType"
                                        onChange={handleFilterChange}
                                        style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                        label="subjectType"
                                    >
                                        <MenuItem value={"all"}>All</MenuItem>
                                        <MenuItem value={"AcadmicsSubject"}>Acadmics</MenuItem>
                                        <MenuItem value={"CoScholasticSubject"}>Co-Scholastic</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl variant="standard" sx={{ width: '150px', margin: "0px 12px", flexDirection: "row", alignItems: "center", borderBottom: "1px solid #BEBEBE" }}>
                                    <input value={subjectSearchFilter} onChange={handleSubjectSearch} placeholder='Search Subject' style={{ border: "0", color: "#BEBEBE", width: "130px" }} />
                                    {
                                        subjectSearchFilter.length == 0 ? (
                                            <SearchIcon style={{ border: "0", color: "#BEBEBE", }} />) : (
                                            <CloseIcon style={{ border: "0", color: "#BEBEBE", cursor: "pointer" }} onClick={clearSearchFliedSubject} />
                                        )
                                    }
                                </FormControl>
                            </Grid>
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


                        </Stack>
                        <Box sx={{ width: mob ? "90%" : "100%" }}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 350 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">
                                                {paginatedSubjectData.length == 0 ? null : (<Checkbox
                                                    indeterminate={selectedRows.length > 0 && selectedRows.length < paginatedSubjectData.length}
                                                    checked={selectedRows.length === paginatedSubjectData.length}
                                                    onChange={handleSelectAllRows}
                                                />)}
                                            </TableCell>
                                            <TableCell align="left">
                                                <Typography variant="body" sx={{ fontSize: '14px', fontWeight: '600' }}>
                                                    S. No
                                                </Typography>
                                            </TableCell>
                                            {subjectColumns.map((column) => (
                                                <TableCell align="left" key={column}>
                                                    <Typography variant="body" sx={{ fontSize: '14px', fontWeight: '600' }}>
                                                        {column}
                                                    </Typography>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.isArray(paginatedSubjectData) && paginatedSubjectData.length > 0 ? (
                                            paginatedSubjectData.map((row, index) => (
                                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                                                        <Checkbox
                                                            style={{ paddingTop: '0px', paddingBottom: '0px' }}
                                                            checked={isSelected(row.subject_id, row.subject_type)}
                                                            onChange={() => handleSelectRow(row.subject_id, row.subject_type)}
                                                        />
                                                    </TableCell>
                                                    <TableCell style={{ paddingTop: '12px', paddingBottom: '12px' }}>{subjectPage * subjectRowsPerPage + index + 1}</TableCell>
                                                    <TableCell align="left" style={{ paddingTop: '12px', paddingBottom: '12px' }}>{capitalizeWords(row.name)}</TableCell>
                                                    <TableCell align="left" style={{ paddingTop: '12px', paddingBottom: '12px' }}>{`${row.class_name} ${row.section_name}`.toUpperCase()}</TableCell>
                                                    <TableCell align="left" style={{ paddingTop: '12px', paddingBottom: '12px' }}>{row.subject_type === 'CoScholasticSubject' ? 'Co-scholastic' : 'Acadmics'}</TableCell>
                                                    <TableCell align="left" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                                                        <Button color="info" style={{ paddingTop: '0px', paddingBottom: '0px' }} onClick={() => assignSubjectToTeacher(row.subject_id, row.name, row.subject_type, row.teacher_name)}>
                                                            {row.teacher_name === null ? 'Assign Teacher' : row.teacher_name}
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell align="left" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                                                        <Button
                                                            color="info"
                                                            style={{ justifyContent: 'flex-start', padding: '0' }}
                                                            onClick={() => {
                                                                editSubjectdailog(row?.subject_id, row?.name, row?.subject_type, row?.class_name, row?.section_name, row?.teacher_name, row?.is_mandatory);
                                                            }}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">
                                                    No Subject
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                    component="div"
                                    count={allsubjectData.length}
                                    rowsPerPage={subjectRowsPerPage}
                                    page={subjectPage}
                                    onPageChange={handleSubjectPageChange}
                                    onRowsPerPageChange={handleSubjectRowsPerPageChange}
                                />
                            </TableContainer>
                        </Box>
                    </AccordionWrapper>
                </Box>
            )
            }

            {/* Test Pattern */}
            <AddTestDialog open={addTestPattern} setOpen={setAddTestPattern} />
            <EditTestDialog open={editTestPattern} setOpen={setEditTestPattern} data={editTestPatternData} />

            {/* Class */}
            <AddClass open={openAddClass} setOpen={setOpenAddClass} />
            <EditClass open={openEditClass} setOpen={setOpenEditClass} data={editClassData} />
            <AssignClass open={openAssignClassTeacher} setOpen={setOpenAssignClassTeacher} data={assignClassTeacherData} classSection={classSectionRAWData} />

            {/* Subject */}
            <AddSubject open={openAddSubject} setOpen={setOpenAddSubject} teacherListData={teacherRAWData} />
            <EditSubject open={openEditSubject} setOpen={setOpenEditSubject} data={editSubjectData} teacherListData={teacherRAWData} />
            <AssignSubject open={openAssignSubjectTeacher} setOpen={setOpenAssignSubjectTeacher} data={assignSubjectTeacherData} teacherData={teacherRAWData} />

            <AddSession open={openAddSession} setOpen={setOpenAddSession} />
            <AddTeacher open={openAddTeacher} setOpen={setOpenAddTeacher} />
            <EditTeacher open={openEditTeacher} setOpen={setOpenEditTeacher} id={selectedId} />

            <AddBulkTeacher open={openBulkTeacherUpload} setOpen={setOpenBulkTeacherUpload} />
            <AddBulkSubject open={openBulkSubjectUpload} setOpen={setOpenBulkSubjectUpload} />

            <EditSchoolLogo open={openEditLogo} setOpen={setOpenEditLogo} data={editlogoData} />


            <Dialog
                open={openTeacherBox2}
                onClose={handleTeacherClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle textAlign={"center"} id="alert-dialog-title">{"Delete Alert"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Are you sure want to delete?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleTeacherClose}>Disagree</Button>
                    <Button onClick={handleDeleteSelectedTeacherRows} autoFocus>Agree</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openSubjectBox2}
                onClose={handleSubjectClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle textAlign={"center"} id="alert-dialog-title">{"Delete Alert"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">Are you sure want to delete?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubjectClose}>Disagree</Button>
                    <Button onClick={handleDeleteSelectedRows} autoFocus>Agree</Button>
                </DialogActions>
            </Dialog>

            <ExcelListing open={openViewExcelBox} setOpen={setOpenViewExcelBox} apiUrl={excelApiUrl} type={excelType} />
        </Container >
    );
}
