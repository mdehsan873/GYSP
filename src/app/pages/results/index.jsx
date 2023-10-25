import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Button,
    Stack,
    Box,
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
    TableRow,
    Paper,
    TablePagination,
} from '@mui/material';
import { Link } from 'react-router-dom';
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import FilePresentIcon from '@mui/icons-material/FilePresent';
import AxiosObj from '../../axios/AxiosObj';
import { handleDelete } from '../../utils';
import TableWrapper from '../../components/wrappers/TableWrapper';
import Loader from '../../components/Loader';
import AlertDialog from '../../components/dialogs/confimationBox';
import AddBulkResult from './AddBulkResult';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ExcelListing from '../../components/dialogs/ExcelListing';
import secureLocalStorage from "react-secure-storage";
import { resetLocal } from './../../partials/localStorage'

export default function Results() {

    useEffect(() => {
        resetLocal("result");
    }, []);

    const { sessions, classAndSection } = useSelector((state) => state.infra);
    const capitalizeWords = (str) => {
        return str
            .toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };
    const [resultRAWList, setResultRAWList] = useState([]);
    const [resultList, setResultList] = useState([]);
    const [openBulkUpload, setOpenBulkUpload] = useState(false);
    const [loading, setLoading] = useState(false);

    // Filter
    const [sessionFilterValue, setSessionFilterValue] = useState(null);
    const [classFilterValue, setClassFilterValue] = useState('all');
    const [sectionFilterValue, setSectionFilterValue] = useState('all');
    const [sortingFilterValue, setSortingFilterValue] = useState('none');
    const [testFilterValue, setTestFilterValue] = useState('all');
    const [subTestFilterValue, setSubTestFilterValue] = useState('all');

    // Test
    const [testPatternFilterRAW, setTestPatternFilterRAW] = useState([]);
    const [testPatternFilter, setTestPatternFilter] = useState([]);
    const [subTestPatternFilterRAW, setSubTestPatternFilterRAW] = useState([]);
    const [classFilterRAW, setClassFilterRAW] = useState([]);
    const [sectionFilterRAW, setSectionFilterRAW] = useState([]);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const columns = ['Test Name', 'Session', 'Class', 'View'];

    const fetchResultList = async () => {
        setLoading(true);
        if (secureLocalStorage.getItem("resultRAWList")) {
            setResultRAWList(secureLocalStorage.getItem("resultRAWList"));
            setLoading(false);
        } else {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'result/get/all/result/',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                },
            };
            AxiosObj.request(config).then((res) => {
                setResultRAWList(res?.data?.Data);
                if (res.data.Data.length !== 0) {
                    secureLocalStorage.setItem("resultRAWList", res?.data?.Data)
                }
            }).catch((e) => console.log(e)).finally(() => { setLoading(false); });
        }

        if (secureLocalStorage.getItem("testPatternFilterRAW")) {
            setTestPatternFilterRAW(secureLocalStorage.getItem("testPatternFilterRAW"));
            setLoading(false);
        } else {
            let config2 = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'result/get/testpattern/',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                },
            };
            AxiosObj.request(config2).then((res) => {
                setTestPatternFilterRAW(res?.data?.Data);
                if (res.data.Data.length !== 0) {
                    secureLocalStorage.setItem("testPatternFilterRAW", res?.data?.Data)
                }

            }).catch((e) => console.log(e)).finally(() => { setLoading(false); });
        }

    };


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'session') {
            setPage(0);
            secureLocalStorage.setItem("resultCurrentPage", 0)
            secureLocalStorage.setItem("resultSessionFilter", value);
            setSessionFilterValue(value);
        }
        if (name === 'class') {
            setPage(0);
            secureLocalStorage.setItem("resultCurrentPage", 0)
            secureLocalStorage.setItem("resultClassFilter", value);
            setClassFilterValue(value);
        }
        if (name === 'section') {
            setPage(0);
            secureLocalStorage.setItem("resultCurrentPage", 0)
            secureLocalStorage.setItem("resultSectionFilter", value);
            setSectionFilterValue(value);
        }
        if (name === 'test') {
            setPage(0);
            secureLocalStorage.setItem("resultCurrentPage", 0)
            secureLocalStorage.setItem("resultTestFilter", value);
            setTestFilterValue(value);
        }
        if (name === 'sorting') {
            setPage(0);
            secureLocalStorage.setItem("resultCurrentPage", 0)
            secureLocalStorage.setItem("resultSortingFilter", value);
            setSortingFilterValue(value);
        }
        if (name === 'subTest') {
            setPage(0);
            secureLocalStorage.setItem("resultCurrentPage", 0)
            secureLocalStorage.setItem("resultSubTestFilter", value);
            setSubTestFilterValue(value);
        }
    };


    useEffect(() => {
        fetchResultList();
    }, []);

    useEffect(() => {
        setClassFilterRAW([...classAndSection]);
        setSectionFilterRAW([...classAndSection]);
    }, [classAndSection]);


    useEffect(() => {
        if (secureLocalStorage.getItem("resultSessionFilter")) {
            setSessionFilterValue(secureLocalStorage.getItem("resultSessionFilter"))
        } else {
            setSessionFilterValue(sessions[0]?.name)
        }
    }, [sessions]);

    useEffect(() => {
        const filterDAtaArray = async () => {

            let filteredResults = await resultRAWList.filter((result) => {
                const sessionMatch = sessionFilterValue === 'all' || result.session_name === sessionFilterValue;
                const classMatch = classFilterValue === 'all' || result.class_name === classFilterValue;
                const sectionMatch = sectionFilterValue === 'all' || result.section_name === sectionFilterValue;
                const testMatch = testFilterValue === 'all' || result.test_pattern === testFilterValue;
                const subtestMatch = subTestFilterValue === 'all' || result.test_name === subTestFilterValue;
                return sessionMatch && classMatch && sectionMatch && testMatch && subtestMatch;
            });

            if (sortingFilterValue === 'a-z') {
                filteredResults = await filteredResults.sort((a, b) => a.test_name.localeCompare(b.test_name));
            } else if (sortingFilterValue === 'z-a') {
                filteredResults = await filteredResults.sort((a, b) => b.test_name.localeCompare(a.test_name));
            }
            setResultList(filteredResults);
        }
        filterDAtaArray();
    }, [sessionFilterValue, classFilterValue, sectionFilterValue, resultRAWList, sortingFilterValue, subTestFilterValue, testFilterValue]);

    useEffect(() => {
        const filterDAtaArray = async () => {
            // Assuming sessionFilterValue is an async value, await it here if needed.
            const sessionValue = await sessionFilterValue;
            const filteredTest = await testPatternFilterRAW.filter((testPattern) => {
                const testMatch = testFilterValue === 'all' || testPattern.tests.some((test) => test.session_name === sessionValue);
                return testMatch;
            });

            const subTestPattern = await filteredTest.map((testPattern) => {
                const filteredTests = testPattern.tests.filter((test) => test.session_name == sessionFilterValue || 'all' && test.test_pattern_name == testPattern.name || 'all');
                return { ...testPattern, tests: filteredTests };
            });

            setSubTestPatternFilterRAW(subTestPattern[0]?.tests);
            
            if (testFilterValue === "all" && sessionFilterValue == "all") {
                const allTests = await subTestPattern.flatMap(pattern => pattern.tests);
                setSubTestPatternFilterRAW(allTests);
            }
        }

        filterDAtaArray();
    }, [testFilterValue, testPatternFilterRAW, sessionFilterValue]);

    useEffect(() => {

        const filterDAtaArray = async () => {
            let filteredSection = await sectionFilterRAW.filter((section) => {
                const sectionMatch = classFilterValue === 'all' || section.class_name == classFilterValue;
                return sectionMatch;
            });
            setSectionFilterRAW(filteredSection);
        }
        filterDAtaArray();
    }, [classFilterValue]);

    useEffect(() => {
        const filterDataArray = async () => {
            // Assuming sessionFilterValue is an async value, await it here if needed.
            const sessionValue = await sessionFilterValue;

            // Assuming testPatternFilterRAW is an async value, await it here if needed.
            const theTestPattern = await testPatternFilterRAW;

            // Filter the classAndSection array based on sessionFilterValue.
            const filteredClass = classAndSection.filter((cc) => {
                const classMatch = sessionValue === 'all' || cc.session_name === sessionValue;
                return classMatch;
            });

            // Filter the testPatternFilterRAW array based on sessionFilterValue.
            const filteredTestPat = theTestPattern.filter((tp) => {
                const testpMatch = sessionValue === 'all' || tp.tests.some((test) => test.session_name === sessionValue);
                return testpMatch;
            });

            // Filter the classAndSection array again based on sessionFilterValue.
            const filteredSection = classAndSection.filter((section) => {
                const sectionMatch = sessionValue === 'all' || section.session_name === sessionValue;
                return sectionMatch;
            });

            // Set the state variables after filtering.
            setClassFilterRAW(filteredClass);
            setTestPatternFilter(filteredTestPat);
            setSectionFilterRAW(filteredSection);
        };

        filterDataArray();
    }, [sessionFilterValue, classAndSection, testPatternFilterRAW]);


    const handlePageChange = (event, newPage) => {
        setPage(newPage);
        secureLocalStorage.setItem("resultCurrentPage", newPage)
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        secureLocalStorage.setItem("resultPerPage", parseInt(event.target.value, 10))
        setPage(0);
        secureLocalStorage.setItem("resultCurrentPage", 0)
    };

    const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
    const [deleteData, setDeleteData] = useState("")
    const handleDeleteOpen = (apiEndPoint) => {
        setOpenDeleteAlert(true);
        setDeleteData({
            "apiEndPoint": apiEndPoint,
            "apiData": undefined
        })
    };

    const paginatedResults = resultList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const [excelApiUrl, setExcelApiUrl] = useState('');
    const [excelType, setExcelType] = useState('');

    const [openViewExcelBox, setOpenViewExcelBox] = useState(false);
    const viewStudentExcel = () => {
        setExcelApiUrl('result/get/csv/')
        setExcelType('result')
        setOpenViewExcelBox(true);
    };

    useEffect(() => {
        if (secureLocalStorage.getItem("resultSessionFilter")) {
            setSessionFilterValue(secureLocalStorage.getItem("resultSessionFilter"))
        }
        if (secureLocalStorage.getItem("resultClassFilter")) {
            setClassFilterValue(secureLocalStorage.getItem("resultClassFilter"))
        }
        if (secureLocalStorage.getItem("resultSectionFilter")) {
            setSectionFilterValue(secureLocalStorage.getItem("resultSectionFilter"))
        }
        if (secureLocalStorage.getItem("resultTestFilter")) {
            setTestFilterValue(secureLocalStorage.getItem("resultTestFilter"))
        }
        if (secureLocalStorage.getItem("resultSortingFilter")) {
            setSortingFilterValue(secureLocalStorage.getItem("resultSortingFilter"))
        }
        if (secureLocalStorage.getItem("resultSubTestFilter")) {
            setSubTestFilterValue(secureLocalStorage.getItem("resultSubTestFilter"))
        }
        if (secureLocalStorage.getItem("resultPerPage")) {
            setRowsPerPage(secureLocalStorage.getItem("resultPerPage"))
        }
        if (secureLocalStorage.getItem("resultCurrentPage")) {
            setPage(secureLocalStorage.getItem("resultCurrentPage"))
        }

    }, []);


    return (
        <>
            <Box sx={{ width: "100%" }}>
                <Box margin={2}>
                    <Link
                        className="secondary"
                        to={'/'}
                        style={{ margin: "10px", marginBottom: "0px", display: "flex", cursor: "pointer", alignItems: "center", color: "#3D3D3D", fontSize: "14px", textDecoration: "none" }}
                    >
                        <ArrowBackIosIcon style={{ marginRight: "4px", fontSize: "12px" }} /> Back
                    </Link>
                </Box>
                <TableWrapper>
                    <Box>
                        <Stack direction={'row'} justifyContent='space-between'>
                            <Stack direction={'row'} alignItems={"center"} mx={2} mt={2} mb={0} spacing={1}>
                                <AssessmentOutlinedIcon style={{ width: "28px", height: "auto" }} />
                                <Typography fontWeight={'bold'} style={{ marginLeft: "12px" }} variant={'h6'}>Result</Typography>
                            </Stack>
                            <Stack direction={'row'} alignItems={"center"} mx={0} mt={2} mb={1} spacing={1}>
                                <Stack direction={'row'} alignItems={"center"} mx={1}>
                                    <FilePresentIcon style={{ width: "20px", height: "auto" }} />
                                    <Button onClick={viewStudentExcel} style={{ marginRight: "10px", color: "#3D3D3D", fontSize: "13px", fontWeight: "600" }}>View Uploaded Excel</Button>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Box>
                    <Stack direction={'row'} spacing={2} paddingLeft={1}>
                        <Button color="info" sx={{ textTransform: 'capitalize' }} onClick={() => setOpenBulkUpload((prev) => !prev)}>
                            + Add Result
                        </Button>
                    </Stack>
                    <Stack direction={"row"} alignItems={'center'} mt={0} mb={1} spacing={2} paddingLeft={1}>
                        <Stack style={{ margin: "0px 12px" }}>
                            <FormLabel style={{ color: "#000", fontSize: "16px", fontWeight: 600 }}>Filters</FormLabel>
                        </Stack>
                        <Grid container spacing={1} alignItems="center">
                            <FormControl variant="standard" sx={{ width: '100px', margin: '0px 12px' }}>
                                <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Session</FormLabel>
                                <Select
                                    labelId="session-simple-select-standard-label"
                                    id="session-simple-select-standard"
                                    value={sessionFilterValue}
                                    // IconComponent={() => (
                                    //     <UnfoldMoreIcon />
                                    // )}
                                    name="session"
                                    onChange={handleFilterChange}
                                    style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                    label="Session"
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    {sessions.map((item) => (
                                        <MenuItem key={item.id} value={item.name}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl variant="standard" sx={{ width: '100px', margin: '0px 12px' }}>
                                <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Test Pattern</FormLabel>
                                <Select
                                    labelId="test-simple-select-standard-label"
                                    id="test-simple-select-standard"
                                    value={testFilterValue}
                                    // IconComponent={() => (
                                    //     <UnfoldMoreIcon />
                                    // )}
                                    name="test"
                                    onChange={handleFilterChange}
                                    style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                    label="test"
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    {testPatternFilter.map((item) => (
                                        <MenuItem key={item.test_pattern_id} value={item.name}>
                                            {capitalizeWords(item.name)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" sx={{ width: '100px', margin: '0px 12px' }}>
                                <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Test</FormLabel>
                                <Select
                                    labelId="subTest-simple-select-standard-label"
                                    id="subTest-simple-select-standard"
                                    value={subTestFilterValue}
                                    // IconComponent={() => (
                                    //     <UnfoldMoreIcon />
                                    // )}
                                    name="subTest"
                                    onChange={handleFilterChange}
                                    style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                    label="tesubTestst"
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    {subTestPatternFilterRAW?.sort((a, b) => a.test_id - b.test_id).map((item) => (
                                        <MenuItem key={item.test_id} value={item.test}>
                                            {item.test?.toUpperCase()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl variant="standard" sx={{ width: '100px', margin: '0px 12px' }}>
                                <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Class</FormLabel>
                                <Select
                                    labelId="class-simple-select-standard-label"
                                    id="class-simple-select-standard"
                                    value={classFilterValue}
                                    // IconComponent={() => (
                                    //     <UnfoldMoreIcon />
                                    // )}
                                    name="class"
                                    onChange={handleFilterChange}
                                    style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                    label="class"
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    {classFilterRAW.filter((item, index, self) => self.findIndex((i) => i.class_name === item.class_name) === index)
                                        .map((item) => (
                                            <MenuItem key={item.id} value={item.class_name}>{item.class_name.toUpperCase()}</MenuItem>
                                        ))}

                                </Select>
                            </FormControl>
                            <FormControl variant="standard" sx={{ width: '100px', margin: '0px 12px' }}>
                                <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Section</FormLabel>
                                <Select
                                    labelId="section-simple-select-standard-label"
                                    id="section-simple-select-standard"
                                    value={sectionFilterValue}
                                    // IconComponent={() => (
                                    //     <UnfoldMoreIcon />
                                    // )}
                                    name="section"
                                    onChange={handleFilterChange}
                                    style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                    label="section"
                                >
                                    <MenuItem value="all">All</MenuItem>
                                    {sectionFilterRAW.filter((item, index, self) => self.findIndex((i) => i.section_name === item.section_name) === index)
                                        .map((item) => (
                                            <MenuItem key={item.id} value={item.section_name}>{(item.section_name).toUpperCase()}</MenuItem>
                                        ))}
                                </Select>
                            </FormControl>

                            <FormControl variant="standard" sx={{ width: '100px', margin: '0px 12px' }}>
                                <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Sorting</FormLabel>
                                <Select
                                    labelId="sorting-simple-select-standard-label"
                                    id="sorting-simple-select-standard"
                                    value={sortingFilterValue}
                                    // IconComponent={() => (
                                    //     <UnfoldMoreIcon />
                                    // )}
                                    name="sorting"
                                    onChange={handleFilterChange}
                                    style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                    label="sorting"
                                >
                                    <MenuItem value="none">None</MenuItem>
                                    <MenuItem value="a-z">A-Z</MenuItem>
                                    <MenuItem value="z-a">Z-A</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Stack>
                    <Paper sx={{ width: '100%', boxShadow: "none" }}>
                        {loading ? (
                            <Loader />
                        ) : (
                            <TableContainer component={Paper} style={{ boxShadow: "none" }}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell align="left">
                                                <Typography variant="body" sx={{ fontSize: '14px', fontWeight: '600' }}>
                                                    S. No
                                                </Typography>
                                            </TableCell>
                                            {columns.map((column) => (
                                                <TableCell align="center" key={column}>
                                                    <Typography variant="body" sx={{ fontSize: '14px', fontWeight: '600' }}>
                                                        {column}
                                                    </Typography>
                                                </TableCell>
                                            ))}
                                            <TableCell align="center">
                                                <Typography variant="body" sx={{ fontSize: '14px', fontWeight: '600' }}>
                                                    Delete
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Array.isArray(paginatedResults) && paginatedResults.length > 0 ? (
                                            paginatedResults.sort((a, b) => a.id - b.id).map((row, index) => (
                                                <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                    <TableCell style={{ paddingTop: '12px', paddingBottom: '12px' }}>{index + 1}</TableCell>
                                                    <TableCell style={{ paddingTop: '12px', paddingBottom: '12px' }} align="center">{row.test_name}</TableCell>
                                                    <TableCell align="center" style={{ paddingTop: '12px', paddingBottom: '12px' }}>{row.session_name}</TableCell>
                                                    <TableCell align="center" style={{ paddingTop: '12px', paddingBottom: '12px' }}>{`${row?.class_name} ${row?.section_name}`.toUpperCase()}</TableCell>
                                                    <TableCell align="center" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                                                        <Link
                                                            className="secondary"
                                                            to={'/result-details/' + row?.test_id + '/' + (row?.class_id || '') + '/' + (row?.section_id || '')}
                                                        >
                                                            View
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell align="center" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                                                        <Link
                                                            className="secondary"
                                                            onClick={() => handleDeleteOpen(`result/get/result/details/${row?.test_id}/?class_id=${row?.class_id}&section_id=${row?.section_id}`)}
                                                        >
                                                            Delete
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={7} align="center">
                                                    No Results
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                    component="div"
                                    count={resultList.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handlePageChange}
                                    onRowsPerPageChange={handleRowsPerPageChange}
                                />
                            </TableContainer>
                        )}
                    </Paper>
                    <AddBulkResult open={openBulkUpload} setOpen={setOpenBulkUpload} />
                    <AlertDialog openBox={openDeleteAlert} setOpen={setOpenDeleteAlert} data={deleteData} />
                    <ExcelListing open={openViewExcelBox} setOpen={setOpenViewExcelBox} apiUrl={excelApiUrl} type={excelType} />
                </TableWrapper>
            </Box >
        </>
    );
}
