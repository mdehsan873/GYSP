import {
    Button,
    Stack,
    Grid, Box,
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
    TablePagination,
} from '@mui/material';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { useSelector } from 'react-redux';
import AxiosObj from '../../axios/AxiosObj';
import { handleArchieve } from '../../utils';
import Loader from '../../components/Loader';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import TableWrapper from '../../components/wrappers/TableWrapper'
import AlertDialog from '../../components/dialogs/confimationBox';
import SportsSoccerOutlinedIcon from "@mui/icons-material/SportsSoccerOutlined";
import AddCocurricularEventDialog from '../../components/dialogs/cocurricular/AddCocurricularEventDialog';
import AddCocurricularWorkshopDialog from '../../components/dialogs/cocurricular/AddCocurricularWorkshopDialog';
import EditCocurricularEventDialog from '../../components/dialogs/cocurricular/EditCocurricularEventDialog';
import { resetLocal } from './../../partials/localStorage'
import secureLocalStorage from "react-secure-storage";
import CloseIcon from '@mui/icons-material/Close';

export default function Cocurricular() {

    useEffect(() => {
        resetLocal("cocurricular");
    }, []);

    const { sessions } = useSelector(state => state.infra)

    const columns = ['Name', 'Description', 'Category', 'Type', 'Date of Event', 'Session', 'View', 'Edit', 'Delete']

    const [open, setOpen] = useState(false)
    const [openWorkShop, setOpenWorkShop] = useState(false)
    const [eventList, setEventList] = useState([])
    const [eventRAWList, setEventRAWList] = useState([])
    const [loading, setLoading] = useState(false)

    const [sessionFilterValue, setSessionFilterValue] = useState('all');
    const [catergoryFilterValue, setCatergoryFilterValue] = useState('all');
    const [monthFilterValue, setMonthFilterValue] = useState('all');
    const [sortingFilterValue, setSortingFilterValue] = useState('none');
    const [typeFilterValue, setTypeFilterValue] = useState('all');
    const [eventTypeFilterValue, setEventTypeFilterValue] = useState('all');


    const [eventSearchFilter, setEventSearchFilter] = useState("");

    const [catergoryList, setCatergoryList] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
    const [deleteData, setDeleteData] = useState("")
    const handleDeleteOpen = (apiEndPoint) => {
        setOpenDeleteAlert(true);
        setDeleteData({
            "apiEndPoint": apiEndPoint,
            "apiData": undefined
        })
    };

    const archieve = (id) => {
        handleArchieve(id, "event/event-update");
        setEventList(prev => prev.filter((e) => e[0] !== id));
    }

    const fetchEventList = async () => {
        setLoading(true);
        if (secureLocalStorage.getItem("eventRAWList")) {
            setEventRAWList(secureLocalStorage.getItem("eventRAWList"));
            setLoading(false);
        } else {
            let config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: "event/get/events/",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                },
            };
            AxiosObj.request(config).then((res) => {
                setEventRAWList(res?.data?.Data);
                if (res.data.Data && res.data.Data.length !== 0) {
                    secureLocalStorage.setItem("eventRAWList", res?.data?.Data)
                }
            }).catch((e) => console.log(e)).finally(() => { setLoading(false); });
        }

        if (secureLocalStorage.getItem("catergoryList")) {
            setCatergoryList(secureLocalStorage.getItem("catergoryList"));
            setLoading(false);
        } else {
            let config2 = {
                method: 'get',
                maxBodyLength: Infinity,
                url: "event/get/event/categories/",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + secureLocalStorage.getItem('access')
                },
            };
            AxiosObj.request(config2).then((res) => {

                setCatergoryList(res.data.Data);
                if (res.data.Data && res.data.Data.length !== 0) {
                    secureLocalStorage.setItem("catergoryList", res?.data?.Data)
                }

            }).catch((e) => console.log(e)).finally(() => { setLoading(false) })
        }

    };


    const handleFilterChange = async (e) => {
        const { name, value } = e.target;
        if (name === "session") {
            secureLocalStorage.setItem("cocurricularSessionFilter", value);
            secureLocalStorage.setItem("cocurricularCurrentPage", 0)
            setPage(0); // Set teacherPage to 0 when search filter changes
            setSessionFilterValue(value);
        }

        if (name === "catergory") {
            secureLocalStorage.setItem("cocurricularCatergoryFilter", value);
            secureLocalStorage.setItem("cocurricularCurrentPage", 0)
            setPage(0); // Set teacherPage to 0 when search filter changes
            setCatergoryFilterValue(value);
        }

        if (name === "month") {
            secureLocalStorage.setItem("cocurricularMonthFilter", value);
            secureLocalStorage.setItem("cocurricularCurrentPage", 0)
            setPage(0); // Set teacherPage to 0 when search filter changes
            setMonthFilterValue(value);
        }

        if (name === "sorting") {
            secureLocalStorage.setItem("cocurricularSortingFilter", value);
            secureLocalStorage.setItem("cocurricularCurrentPage", 0)
            setPage(0); // Set teacherPage to 0 when search filter changes
            setSortingFilterValue(value);
        }
        if (name === "type") {
            secureLocalStorage.setItem("cocurricularTypeFilter", value);
            secureLocalStorage.setItem("cocurricularCurrentPage", 0)
            setPage(0); // Set teacherPage to 0 when search filter changes
            setTypeFilterValue(value);
        }
        if (name === "eventType") {
            secureLocalStorage.setItem("cocurricularEventTypeFilter", value);
            secureLocalStorage.setItem("cocurricularCurrentPage", 0)
            setPage(0); // Set teacherPage to 0 when search filter changes
            setEventTypeFilterValue(value);
        }
    };

    const handleEventSearch = (event) => {
        setEventSearchFilter(event.target.value);
        secureLocalStorage.setItem("cocurricularCurrentPage", 0)
        setPage(0); // Set teacherPage to 0 when search filter changes
    };

    useEffect(() => {
        setSessionFilterValue(sessions[0]?.name)
        fetchEventList()
    }, [])

    const formatDate = (dateString) => {
        const dateObj = new Date(dateString);
        const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
        return formattedDate;
    };

    useEffect(() => {
        setSessionFilterValue(sessions[0]?.name)
    }, [sessions]);

    useEffect(() => {
        let filteredEvents = eventRAWList.filter((event) => {
            const sessionMatch = sessionFilterValue === 'all' || event.session_name === sessionFilterValue;
            const categoryMatch = catergoryFilterValue === 'all' || event.category_name === catergoryFilterValue;
            const typeMatch = typeFilterValue === 'all' || (typeFilterValue === 'event' && !event.is_workshop) || (typeFilterValue === 'workshop' && event.is_workshop);
            const eventTypeMatch = eventTypeFilterValue === 'all' || event.event_type === eventTypeFilterValue;
            const nameMatch = eventSearchFilter.trim() === '' || event.event_name?.toLowerCase().includes(eventSearchFilter.toLowerCase().trim());

            if (monthFilterValue === 'all') {
                return sessionMatch && categoryMatch && typeMatch && eventTypeMatch && nameMatch;
            } else {
                const eventDate = new Date(event.date_of_event);
                const eventMonth = eventDate.getMonth() + 1; // getMonth() returns 0-11, so adding 1 to match the value
                return sessionMatch && categoryMatch && typeMatch && eventTypeMatch && nameMatch && eventMonth.toString() === monthFilterValue;
            }
        });

        if (sortingFilterValue === 'a-z') {
            filteredEvents = filteredEvents.sort((a, b) => a.date_of_event.localeCompare(b.date_of_event));
        } else if (sortingFilterValue === 'z-a') {
            filteredEvents = filteredEvents.sort((a, b) => b.date_of_event.localeCompare(a.date_of_event));
        } else {
            filteredEvents = filteredEvents.sort((a, b) => b.date_of_event.localeCompare(a.date_of_event));
        }

        setEventList(filteredEvents);
    }, [sessionFilterValue, catergoryFilterValue, eventRAWList, monthFilterValue, sortingFilterValue, typeFilterValue, eventTypeFilterValue, eventSearchFilter]);


    const handlePageChange = (event, newPage) => {
        setPage(newPage);
        secureLocalStorage.setItem("cocurricularCurrentPage", newPage)
    };

    const handleRowsPerPageChange = (event) => {
        secureLocalStorage.setItem("cocurricularCurrentPage", 0)
        setRowsPerPage(parseInt(event.target.value, 10));
        secureLocalStorage.setItem("cocurricularPerPage", parseInt(event.target.value, 10))
        setPage(0);
    };

    const paginatedEvents = eventList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    // Event edit

    const [openEdit, setOpenEdit] = useState(false)
    const [editEventDetails, setEditEventDetails] = useState(0)
    const editEvent = (id) => {
        setEditEventDetails(id)
        setOpenEdit(true)
    }

    useEffect(() => {

        if (secureLocalStorage.getItem("cocurricularMonthFilter")) {
            setMonthFilterValue(secureLocalStorage.getItem("cocurricularMonthFilter"))
        }

        if (secureLocalStorage.getItem("cocurricularSortingFilter")) {
            setSortingFilterValue(secureLocalStorage.getItem("cocurricularSortingFilter"))
        }

        if (secureLocalStorage.getItem("cocurricularTypeFilter")) {
            setTypeFilterValue(secureLocalStorage.getItem("cocurricularTypeFilter"))
        }

        if (secureLocalStorage.getItem("cocurricularEventTypeFilter")) {
            setEventTypeFilterValue(secureLocalStorage.getItem("cocurricularEventTypeFilter"))
        }
        if (secureLocalStorage.getItem("cocurricularCurrentPage")) {
            setPage(secureLocalStorage.getItem("cocurricularCurrentPage"))
        }
        if (secureLocalStorage.getItem("cocurricularPerPage")) {
            setRowsPerPage(secureLocalStorage.getItem("cocurricularPerPage"))
        }

    }, []);

    useEffect(() => {
        if (secureLocalStorage.getItem("cocurricularSessionFilter")) {
            setSessionFilterValue(secureLocalStorage.getItem("cocurricularSessionFilter"))
        }
    }, [sessions]);

    useEffect(() => {
        if (secureLocalStorage.getItem("cocurricularCatergoryFilter")) {
            setCatergoryFilterValue(secureLocalStorage.getItem("cocurricularCatergoryFilter"))
        }
    }, [catergoryList]);

    const clearSearchFlied = () => {
        if (eventSearchFilter.length !== 0) {
            setEventSearchFilter('')
        }
    }

    return (
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
            <TableWrapper >
                <Box>
                    <Stack direction={'row'} justifyContent='space-between'>
                        <Stack direction={'row'} alignItems={"center"} mx={2} mt={2} mb={1} spacing={1}>
                            <SportsSoccerOutlinedIcon style={{ width: "26px", height: "auto" }} />
                            <Typography fontWeight={'bold'} style={{ marginLeft: "12px" }} variant={'h6'}>Co-curricular</Typography>
                        </Stack>
                    </Stack>
                </Box>
                <Stack direction={'row'} mb={2} alignItems={'center'} gap={1}>
                    <Stack direction={"row"} spacing={2} paddingLeft={2}>
                        <Button color='info' sx={{ textTransform: 'capitalize' }} onClick={() => { open ? setOpen(false) : setOpen(true) }}>+Add Event</Button>
                    </Stack>

                    <Stack direction={"row"} spacing={2} paddingLeft={2}>
                        <Button color='info' sx={{ textTransform: 'capitalize' }} onClick={() => { openWorkShop ? setOpenWorkShop(false) : setOpenWorkShop(true) }}>+Add Workshop</Button>
                    </Stack>
                </Stack>
                <Stack direction={"row"} alignItems={'center'} justifyContent={"space-between"} mt={0} mb={1} ml={2} spacing={2} paddingLeft={1}>
                    <Grid container alignItems="center">
                        <Stack style={{ margin: "0px 12px" }}>
                            <FormLabel style={{ color: "#000", fontSize: "14px", fontWeight: 600 }}>Filters</FormLabel>
                        </Stack>
                        <FormControl variant="standard" sx={{ width: '100px', margin: '0px 12px' }}>
                            <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Session</FormLabel>
                            <Select
                                // IconComponent={() => (
                                //     <UnfoldMoreIcon />
                                // )}
                                labelId="session-simple-select-standard-label"
                                id="session-simple-select-standard"
                                value={sessionFilterValue}
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
                            <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Type</FormLabel>
                            <Select
                                labelId="type-simple-select-standard-label"
                                id="type-simple-select-standard"
                                value={typeFilterValue}
                                name="type"
                                onChange={handleFilterChange}
                                style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                label="type"
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="event">Event</MenuItem>
                                <MenuItem value="workshop">Workshop</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ width: '100px', margin: '0px 12px' }}>
                            <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Catergory</FormLabel>
                            <Select
                                // IconComponent={() => (
                                //     <UnfoldMoreIcon />
                                // )}
                                labelId="catergory-simple-select-standard-label"
                                id="catergory-simple-select-standard"
                                value={catergoryFilterValue}
                                name="catergory"
                                onChange={handleFilterChange}
                                style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                label="catergory"
                            >
                                <MenuItem value="all">All</MenuItem>
                                {catergoryList.map((item) => (<MenuItem key={item.id} value={item.name}>{item.name}</MenuItem>))}
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ width: '100px', margin: '0px 12px' }}>
                            <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Month</FormLabel>
                            <Select
                                // IconComponent={() => (
                                //     <UnfoldMoreIcon />
                                // )}
                                labelId="month-simple-select-standard-label"
                                id="month-simple-select-standard"
                                value={monthFilterValue}
                                name="month"
                                onChange={handleFilterChange}
                                style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                label="month"
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value="1">Jan</MenuItem>
                                <MenuItem value="2">Feb</MenuItem>
                                <MenuItem value="3">Mar</MenuItem>
                                <MenuItem value="4">Apr</MenuItem>
                                <MenuItem value="5">May</MenuItem>
                                <MenuItem value="6">Jun</MenuItem>
                                <MenuItem value="7">Jul</MenuItem>
                                <MenuItem value="8">Aug</MenuItem>
                                <MenuItem value="9">Sept</MenuItem>
                                <MenuItem value="10">Oct</MenuItem>
                                <MenuItem value="11">Nov</MenuItem>
                                <MenuItem value="12">Dec</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" sx={{ width: '100px', margin: '0px 12px' }}>
                            <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Event Type</FormLabel>
                            <Select
                                labelId="eventType-simple-select-standard-label"
                                id="eventType-simple-select-standard"
                                value={eventTypeFilterValue}
                                name="eventType"
                                onChange={handleFilterChange}
                                style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                                label="eventType"
                            >
                                <MenuItem value="all">All</MenuItem>
                                <MenuItem value={'inschool'}>School Level</MenuItem>
                                <MenuItem value={'inter_school'}>Inter-School Level</MenuItem>
                                <MenuItem value={'state'}>State Level</MenuItem>
                                <MenuItem value={'inter_state'}>Inter-State Level</MenuItem>
                                <MenuItem value={'national'}>National Level</MenuItem>
                                <MenuItem value={'inter_nation'}>Inter-National Level</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid alignItems="center" justifyContent={"flex-end"} style={{ marginRight: "12px", display:"flex" }}>
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
                                <MenuItem value="a-z">Oldest</MenuItem>
                                <MenuItem value="z-a">Latest</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl variant="standard" style={{ margin: "0px 12px", }}>
                            <FormLabel style={{ fontSize: '12px', fontWeight: 600, color: "#03014c", font: "normal normal bold 11px/14px Montserrat", opacity: "0.5", letterSpacing: "0.5px" }}>Search</FormLabel>
                            <FormControl variant="standard" sx={{ width: '230px', flexDirection: "row", alignItems: "center", borderBottom: "1px solid #BEBEBE" }}>
                                <input value={eventSearchFilter} onChange={handleEventSearch} placeholder='Search Event' style={{ border: "0", color: "#BEBEBE", width: "210px", paddingLeft: "0" }} />
                                {
                                    eventSearchFilter.length == 0 ? (
                                        <SearchIcon style={{ border: "0", color: "#BEBEBE", }} />) : (
                                        <CloseIcon style={{ border: "0", color: "#BEBEBE", cursor: "pointer" }} onClick={clearSearchFlied} />
                                    )
                                }
                            </FormControl>
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
                                        {columns.map((column, index) => (
                                            <TableCell align={column === "Name" || column == "Description" ? ("left") : ("center")} key={index} style={{ padding: "8px", height: "20px" }}>
                                                <Typography variant='body' sx={{ fontSize: "14px", fontWeight: "600" }}>
                                                    {column}
                                                </Typography>
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Array.isArray(paginatedEvents) && paginatedEvents.length > 0 ? (
                                        paginatedEvents.map((row, index) => (
                                            <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell align="center" style={{ paddingTop: '12px', paddingBottom: '12px', width: "75px", }}>{index + 1}</TableCell>
                                                <TableCell align="left" style={{ paddingTop: '12px', paddingBottom: '12px', paddingLeft: "8px", width: "220px", }}><Typography style={{ width: "180px", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", overflow: "hidden", margin: "auto", marginLeft: "0" }}>{row.event_name}</Typography></TableCell>
                                                <TableCell align="left" style={{ paddingTop: '12px', paddingBottom: '12px', paddingLeft: "8px", width: "275px", }}><Typography style={{ width: "275px", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", overflow: "hidden", margin: "auto", marginLeft: "0" }}>{row.description}</Typography> </TableCell>
                                                <TableCell align="center" style={{ paddingTop: '12px', paddingBottom: '12px' }}>{row.category_name}</TableCell>
                                                <TableCell align="center" style={{ paddingTop: '12px', paddingBottom: '12px' }}>{row.is_workshop ? ("Workshop") : ("Event")}</TableCell>
                                                <TableCell align="center" style={{ paddingTop: '12px', paddingBottom: '12px', paddingRight: "0px", paddingLeft: "0px" }}>{formatDate(row.date_of_event)}</TableCell>
                                                <TableCell align="center" style={{ paddingTop: '12px', paddingBottom: '12px', paddingLeft: "0px" }}>{row.session_name}</TableCell>
                                                <TableCell align="center" style={{ paddingTop: '12px', paddingBottom: '12px' }}><Link className='secondary' to={'/event-details/' + row?.id}>View</Link></TableCell>
                                                <TableCell align="center" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                                                    <EditIcon
                                                        onClick={() => {
                                                            editEvent(row?.id);
                                                        }}
                                                        style={{ height: '15px', width: '15px', cursor: 'pointer' }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center" style={{ paddingTop: '12px', paddingBottom: '12px' }}><DeleteIcon style={{ height: '15px', width: '15px', cursor: 'pointer' }} onClick={() => handleDeleteOpen(`event/delete/event/${row?.id}`)} /></TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={10} align="center">
                                                No Event
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, 50, 100]}
                                component="div"
                                count={eventList.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleRowsPerPageChange}
                            />
                        </TableContainer>
                    )}
                </Paper>
                <AddCocurricularEventDialog open={open} setOpen={setOpen} />
                <AddCocurricularWorkshopDialog open={openWorkShop} setOpen={setOpenWorkShop} />
                <EditCocurricularEventDialog open={openEdit} setOpen={setOpenEdit} id={editEventDetails} />
                <AlertDialog openBox={openDeleteAlert} setOpen={setOpenDeleteAlert} data={deleteData} />
            </TableWrapper>
        </Box>
    )
}
