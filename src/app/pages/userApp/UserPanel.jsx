import React, { useState, useEffect, useRef } from 'react'
import { CssBaseline, Tabs, Tab, useTheme, useMediaQuery, Button, Box, Typography, FormControl, Select, MenuItem, Stack } from '@mui/material'
import PropTypes from 'prop-types';
import { ReportFrame } from './tabScreens/ReportFrame';
import Cocurricular from './tabScreens/Cocurricular';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";
import { Overall } from './tabScreens/Overall';
import { useParams } from 'react-router-dom';
import { getAxiosWithToken } from "../../axios/AxiosObj";
import Paper from '@mui/material/Paper';
import SportsSoccerOutlinedIcon from "@mui/icons-material/SportsSoccerOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import BackLink from './backBtn';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import secureLocalStorage from "react-secure-storage";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    const mob = useMediaQuery("(max-width:800px)");
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            style={{ marginTop: mob ? "0px" : "70px" }}
        >
            {value === index && (
                <Box sx={{ p: mob ? (1) : (3), px: mob ? (1) : (0), overflow: "hidden" }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
export default function UserPanel() {
    const navigate = useNavigate();
    const smd = useMediaQuery(useTheme().breakpoints.down('sm'))
    const [selectedSession, setSelectedSession] = useState('')
    const { sessions } = useSelector(state => state.infra)
    const { activeTab } = useParams()
    const [value, setValue] = useState(parseInt(activeTab));
    const [selectedTabValue, setSelectedTabValue] = useState('');

    // THE FRST
    const [firstTab, setFirstTab] = useState(true);

    // UserPanel
    const [pannelTabs, setPannelTabs] = useState([]);

    // Result
    const [resultRAWdata, setResultRAWdata] = useState([]);

    // Result Overall
    const [overallRAWdata, setOverallRAWdata] = useState([]);

    let index2 = 0;
    // Curricular 
    const [curricularRAWdata, setCurricularRAWdata] = useState([]);

    useEffect(() => {
        if (secureLocalStorage.getItem("studentTabSession")) {
            setSelectedSession(secureLocalStorage.getItem("studentTabSession"))
        } else {
            setSelectedSession(sessions[0].id)
        }
    }, [sessions])

    useEffect(() => {
        if (secureLocalStorage.getItem("studentTabSession")) {
            setSelectedSession(secureLocalStorage.getItem("studentTabSession"))
        }
        if (secureLocalStorage.getItem("firstTab")) {
            setFirstTab(false)
        }
    }, [])
    let indexS = 0;
    const getResult = () => {

        setCurricularRAWdata([])
        setResultRAWdata([])
        setOverallRAWdata([])
        setPannelTabs([])
        const Axios = getAxiosWithToken();

        if (secureLocalStorage.getItem("overallRAWdata")) {
            console.log("overall called","hello")
            setOverallRAWdata(secureLocalStorage.getItem("overallRAWdata"))
        } else {
            // Overall
            Axios.get(`result/get/result/overall/?session_id=${selectedSession}`).then((res) => {
                if (res.data?.Success) {
                    setOverallRAWdata(res.data)
                    if (res.data.Data.length !== 0) {
                        secureLocalStorage.setItem('overallRAWdata', res.data)
                    }
                }
            }).catch((e) => {
                if (e.response.status === 401) {
                    window.location.reload(true);
                }
                setOverallRAWdata([])
            }).finally();
        }
        if (secureLocalStorage.getItem("resultRAWdata")) {
            setResultRAWdata(secureLocalStorage.getItem("resultRAWdata"))
        } else {
            // test Pattern
            Axios.get(`result/get/acadmics/obtained/marks/?session_id=${selectedSession}`).then((res) => {
                if (res.data?.Success) {
                    setResultRAWdata(res.data.Data)
                    if (res.data.Data.length !== 0) {
                        secureLocalStorage.setItem('resultRAWdata', res.data.Data)
                    }
                }
            }).catch((e) => {
                if (e.response.status === 401) {
                    window.location.reload(true);
                }
            }).finally();
        }
        
        if (secureLocalStorage.getItem("curricularRAWdata")) {
            console.log("clalled")
            setCurricularRAWdata(secureLocalStorage.getItem("curricularRAWdata"))
        } else {
            console.log("clalled")
            // Cocurricular 
            Axios.get(`result/get/cocurricular/?session_id=${selectedSession}`)
                .then(async (res) => {
                    if (res.data?.Success) {
                        setCurricularRAWdata(res.data.Data)
                        if (res.data.Data?.co_data.length !== 0) {
                            secureLocalStorage.setItem('curricularRAWdata', res.data.Data)
                            secureLocalStorage.setItem('studentTabSession', selectedSession)
                        }
                        if (!secureLocalStorage.getItem("studentTabSession")) {
                            if (res.data.Data?.co_data.length == 0) {
                                indexS = indexS + 1;
                                const foundItem2 = await sessions.find(item => item.id == selectedSession);
                                if (secureLocalStorage.getItem("firstTab")) {
                                    setFirstTab(false)
                                    secureLocalStorage.setItem('firstTab', false)
                                } else if (firstTab) {
                                    console.log(indexS)
                                    // secureLocalStorage.setItem('studentTabSession', sessions[indexS].id)
                                    setSelectedSession(sessions[indexS].id)
                                    // setFirstTab(true)
                                    if (secureLocalStorage.getItem("overallRAWdata")) {
                                        secureLocalStorage.removeItem("overallRAWdata")
                                    }
                                    if (secureLocalStorage.getItem("resultRAWdata")) {
                                        secureLocalStorage.removeItem("resultRAWdata")
                                    }
                                    if (secureLocalStorage.getItem("curricularRAWdata")) {
                                        secureLocalStorage.removeItem("curricularRAWdata")
                                    }
                                }
                            } else {
                                setFirstTab(false)
                                secureLocalStorage.setItem('firstTab', false)
                            }
                        }
                    }
                })
                .catch((e) => {
                    if (e.response.status === 401) {
                        window.location.reload(true);
                    }
                })
                .finally();
        }
    }

    useEffect(() => {
        // result/get/result/overall/?session_id=4
        getResult();
    }, [selectedSession])


    const handleChangeTheInput = (e) => {

        const { name, value } = e.target;
        if (name == "session") {
            secureLocalStorage.setItem('studentTabSession', value)
            if (secureLocalStorage.getItem("setEventTab")) {
                secureLocalStorage.removeItem("setEventTab")
            }
            if (secureLocalStorage.getItem("setWorkShopTab")) {
                secureLocalStorage.removeItem("setWorkShopTab")
            }
            if (secureLocalStorage.getItem("overallRAWdata")) {
                secureLocalStorage.removeItem("overallRAWdata")
            }
            if (secureLocalStorage.getItem("resultRAWdata")) {
                secureLocalStorage.removeItem("resultRAWdata")
            }
            if (secureLocalStorage.getItem("curricularRAWdata")) {
                secureLocalStorage.removeItem("curricularRAWdata")
            }
            setSelectedSession(value)
        }
    }

    const SelectSession = () => {
        return (
            <>
                <FormControl variant="standard" sx={{ padding: 2 }}>
                    <Select
                        labelId="session-simple-select-standard-label"
                        id="session-simple-select-standard"
                        value={selectedSession}
                        onChange={handleChangeTheInput}
                        name="session"
                        variant='outlined'
                        sx={{
                            background: "#fff", border: "none", padding: "0", maxHeight: "38px", boxShadow: "1px 1px 6px -1px #00000029", "& fieldset": {
                                border: "none", // Remove border for the fieldset element
                            }
                        }}
                    >

                        {sessions.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                    </Select>
                </FormControl>
            </>
        )
    }

    const SelectSession2 = () => {
        return (
            <>
                <FormControl variant="standard" sx={{ paddingX: 0, paddingY: 0, paddingLeft: "0px" }}>
                    <Select
                        labelId="session-simple-select-standard-label"
                        id="session-simple-select-standard"
                        value={selectedSession}
                        onChange={handleChangeTheInput}
                        name="session"
                        // label="Session"
                        variant='outlined'
                        sx={{
                            background: "#fff", border: "none", padding: "0", maxHeight: "38px", boxShadow: "0px 2px 3px -1px #00000029", "& fieldset": {
                                border: "none", // Remove border for the fieldset element
                            }
                        }}
                    >

                        {sessions.map((item) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
                    </Select>
                </FormControl>
            </>
        )
    }

    const TabButton2 = () => {
        return (
            <>
                <Stack style={{ width: "90px" }}>
                    <FormControl variant="standard" sx={{ paddingX: 2, paddingLeft: "0px", width: "85px" }}>
                        <Button
                            color="primary"
                            variant="outlined"
                            onClick={handleClickOverAll}
                            ref={overAllBtn}
                            style={overAllStyles}
                        >
                            {"Overall"}
                        </Button>
                    </FormControl>
                </Stack>
            </>
        )
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
        secureLocalStorage.setItem("setNavBarTab", newValue)

        if (secureLocalStorage.getItem("setEventTab")) {
            secureLocalStorage.removeItem("setEventTab")
        }
        if (secureLocalStorage.getItem("setWorkShopTab")) {
            secureLocalStorage.removeItem("setWorkShopTab")
        }
        if (newValue == (pannelTabs.length + 1)) {
            setSelectedTabValue("Select")
            secureLocalStorage.setItem("setNavBarTab", "Select")

        } else {
            setSelectedTabValue(pannelTabs[newValue - 1])
        }
    };

    const tabstyle = { textTransform: 'capitalize', borderRadius: "10px", backgroundColor: "#FFFFFF", opacity: "1", fontSize: 14, color: "#000", fontWeight: 'bolder', padding: "4px 14px", maxHeight: "38px", minHeight: "38px", border: "none", boxShadow: "1px 1px 6px -1px #00000029" }
    const tabstyle2 = { textTransform: 'uppercase', borderRadius: "10px", backgroundColor: "#FFFFFF", opacity: "1", fontSize: 14, color: "#000", fontWeight: 'bolder', padding: "4px 14px", maxHeight: "38px", minHeight: "38px", border: "none", boxShadow: "1px 1px 6px -1px #00000029" }

    const mob = useMediaQuery("(max-width:800px)");

    const [openTabMenu, setOpenTabMenu] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setOpenTabMenu(open)
    };

    // Tabs Function

    useEffect(() => {
        if (resultRAWdata && Array.isArray(resultRAWdata) && resultRAWdata.length !== 0) {
            if (secureLocalStorage.getItem("pannelTabs")) {
                setPannelTabs(secureLocalStorage.getItem("pannelTabs"))
            } else {
                setPannelTabs(resultRAWdata.map(item => item.test))
                secureLocalStorage.setItem("pannelTabs", resultRAWdata.map(item => item.test))
            }
        } else {
            setPannelTabs([])
            // navigate('/');
        }
    }, [resultRAWdata])
    // Mobile Tabs

    // Tabs Function

    const [coCurricularBtnStyles, setCoCurricularBtnStyles] = useState({
        width: "180px",
        flexDirection: "row",
        alignItems: "center",
        gap: "15px",
        marginRight: "20px",
        marginLeft: "20px",
        border: "none",
        boxShadow: "0px 2px 3px -1px #00000029",
    });

    const [academicsStyles, setAcademicsStyles] = useState({
        width: "180px",
        flexDirection: "row",
        alignItems: "center",
        gap: "15px",
        marginRight: "20px",
        marginLeft: "20px",
        border: "none",
        boxShadow: "0px 2px 3px -1px #00000029",
    });

    const [overAllStyles, setOverAllStyles] = useState({ background: "#fff", border: "none", padding: "0", maxHeight: "38px", maxWidth: "85px", width: "85px", border: '0', textAlign: 'center', padding: "8px 12px", fontSize: "14px", cursor: "no-drop", boxShadow: "0px 2px 3px -1px #00000029" });

    const cahnge = async () => {
        let numPanel = await pannelTabs.length;

        if (value === 0) {
            if (pannelTabs.length > 0) {
                await setSelectedTabValue(pannelTabs[0])
            }
            setCoCurricularBtnStyles({
                ...coCurricularBtnStyles,
                background: "#53DCA2",
                color: "#fff",
            });
        } else {
            // Reset the styles to their default values or any other desired style
            setCoCurricularBtnStyles({
                width: "180px",
                flexDirection: "row",
                alignItems: "center",
                gap: "15px",
                marginRight: "20px",
                marginLeft: "20px",
                border: "none",
                boxShadow: "0px 2px 3px -1px #00000029",
            });
        }
        if (value == numPanel + 1) {
            setOverAllStyles({
                ...overAllStyles,
                background: "#53DCA2",
                color: "#fff",
            });
        } else {
            setOverAllStyles({ background: "#fff", border: "none", padding: "0", maxHeight: "38px", maxWidth: "85px", width: "85px", border: '0', textAlign: 'center', padding: "8px 12px", fontSize: "14px", cursor: "no-drop", boxShadow: "0px 2px 3px -1px #00000029" })
        }

        if (value > 0 && value < numPanel + 1) {
            setAcademicsStyles({
                ...academicsStyles,
                background: "#53DCA2",
                color: "#fff",
            });
        } else {
            setAcademicsStyles({
                width: "170px",
                flexDirection: "row",
                alignItems: "center",
                gap: "15px",
                marginRight: "20px",
                marginLeft: "20px",
                border: "none",
                boxShadow: "0px 2px 3px -1px #00000029",
            })
        }

    }
    useEffect(() => {
        cahnge();
    }, [value, selectedSession])

    useEffect(() => {
        if (pannelTabs.length > 0) {
            setSelectedTabValue(pannelTabs[0])
        }
    }, [pannelTabs])

    useEffect(() => {
        if (pannelTabs.length > 0) {
            if (secureLocalStorage.getItem("setNavBarTab")) {
                setValue(secureLocalStorage.getItem("setNavBarTab"))
                setSelectedTabValue(pannelTabs[secureLocalStorage.getItem("setNavBarTab") - 1])
            }
        } else {
            setValue(0)
            if (!secureLocalStorage.getItem("setNavBarTab")) {
                setSelectedTabValue(pannelTabs[0])
            }
        }
    }, [pannelTabs])

    // overAllBtn Click
    const overAllBtn = useRef(null);
    const overAllBtnClick = useRef(null);
    const handleClickOverAll = () => {
        if (overAllBtn.current && overAllBtnClick.current) {
            overAllBtnClick.current.click(); // Simulate click on Button1 after a delay
            // setSelectedTabValue(pannelTabs[0])
            setSelectedTabValue("Select")
            secureLocalStorage.setItem("setNavBarTab", "Select")
        }
    };

    // coCurricularBtn Click
    const coCurricularBtn = useRef(null);
    const coCurricularBtnClick = useRef(null);
    const handleClickCurricular = () => {
        console.log("iski maa")
        if (coCurricularBtn.current && coCurricularBtnClick.current) {
            coCurricularBtnClick.current.click(); // Simulate click on Button1 after a delay
        }
    };

    // academicsBtn Click
    const academicsBtn = useRef(null);
    const academicsBtnClick = useRef(null);
    const handleClickAcademics = () => {
        // if (academicsBtn.current && academicsBtnClick.current) {
        if (academicsBtn.current) {
            // academicsBtnClick.current.click(); // Simulate click on Button1 after a delay
            if (pannelTabs.length > 0) {
                setSelectedTabValue(pannelTabs[0])
                setValue(1)
                secureLocalStorage.setItem("setNavBarTab", 1)
                secureLocalStorage.setItem("setNavBarTab", pannelTabs[0])
            }
        }
    };


    return (
        <>
            <CssBaseline />
            {mob ?
                (
                    <Stack direction={'row'} sx={{ width: '100%', py: 2, px: "10px", zIndex: "1000", background: "#f4f7fc", marginTop: "45px" }} gap={"5px"} justifyContent={value == 0 ? null : "space-between"} position={"fixed"} >
                        <Link
                            className="secondary"
                            to={'/'}
                            style={{ margin: "0px", marginBottom: "0px", display: "flex", cursor: "pointer", alignItems: "center", color: "#3D3D3D", fontSize: "12px", marginLeft: "0px" }}
                        >
                            <ArrowBackIcon style={{ marginRight: "4px", fontSize: "22px" }} />
                        </Link>
                        <SelectSession2 />
                        {value == 0 ? (null) : (
                            <Stack style={{ maxWidth: "200px", width: mob ? "120px" : "150px" }}>
                                {pannelTabs && pannelTabs.length > 0 ? (<FormControl variant="standard" onClick={toggleDrawer(true)} sx={{ paddingX: 1, display: "flex", justifyContent: "space-between", alignItems: "center", borderRadius: "5px", flexDirection: "row", paddingLeft: "0px", width: mob ? "120px" : "150px", background: "#fff", boxShadow: "0px 2px 3px -1px #00000029" }}>
                                    <Button
                                        color="primary"
                                        variant="outlined"
                                        style={{ textAlign: "center", textTransform: "uppercase", background: "#fff", border: "none", padding: "0", maxHeight: "38px", width: mob ? "120px" : "150px", textAlign: 'center', padding: "8px 12px", fontSize: "14px", cursor: "no-drop", textOverflow:"ellipsis", whiteSpace:"nowrap" }}
                                    >
                                        {selectedTabValue}
                                    </Button>
                                    <KeyboardArrowDownIcon style={{ marginLeft: "0px" }} />
                                </FormControl>) : (null)}
                            </Stack>
                        )}

                        <SwipeableDrawer
                            anchor={"bottom"}
                            open={openTabMenu}
                            onClose={toggleDrawer(false)}
                            onOpen={toggleDrawer(true)}
                            style={{ borderRadius: "15px 15px 0 0" }}
                        >
                            <Box
                                // style={{ width: "auto", borderRadius: "10px" }}
                                style={{ borderRadius: "15px 15px 0 0" }}
                                role="presentation"
                                onClick={toggleDrawer(false)}
                                onKeyDown={toggleDrawer(false)}
                            >
                                <Tabs
                                    variant="standard"
                                    textColor='inherit'
                                    orientation="vertical"
                                    style={{ borderRadius: "15px 15px 0 0" }}
                                    sx={{ padding: "15px" }}
                                    indicatorColor='secondary' value={value} onChange={handleChange} aria-label="basic tabs example">

                                    <Tab sx={tabstyle}
                                        label="Co-curricular activities"
                                        {...a11yProps(0)}
                                        ref={coCurricularBtnClick}
                                        style={{ marginRight: "30px", padding: "10px 40px", display: "none" }}
                                    />
                                    {resultRAWdata && pannelTabs && Array.isArray(pannelTabs) ? (
                                        pannelTabs.map((item, index) => {
                                            index2 = index + 1; // Define index2 here
                                            return (
                                                <Tab
                                                    sx={tabstyle2}
                                                    label={item} // Use the array value as the label
                                                    {...a11yProps(`${index + 1}`)}
                                                    key={index}
                                                />
                                            );
                                        })
                                    ) : null}
                                    <Tab sx={tabstyle}
                                        label="Overall"
                                        ref={overAllBtnClick}
                                        style={{ marginLeft: "30px", display: "none" }}
                                        {...a11yProps(index2 + 1)}
                                    />
                                </Tabs>
                            </Box>
                        </SwipeableDrawer>
                        {value == 0 ? (null) : (<TabButton2 />)}
                    </Stack>
                )
                :
                (
                    <Stack direction={'column'} sx={{ width: '84%', zIndex: "1000", pt: 4, ml: "8px", background: "#f4f7fc" }} position={"fixed"}>
                        <BackLink />
                        <Stack direction={'row'} sx={{ width: '100%', zIndex: "1000", pt: 0, ml: "8px", background: "#f4f7fc" }} justifyContent={"space-between"}>
                            <SelectSession />
                            <Tabs
                                variant="standard"
                                allowScrollButtonsMobile
                                textColor='inherit'
                                sx={{ padding: "15px", height: "78px" }}
                                TabIndicatorProps={{
                                    style: { transition: 'none' }
                                }}
                                indicatorColor='secondary' value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab sx={tabstyle}
                                    label="Co-curricular activities"
                                    {...a11yProps(0)}
                                    // name="sd"
                                    style={{ marginRight: "30px", padding: "10px 40px" }}
                                />
                                {resultRAWdata && pannelTabs && Array.isArray(pannelTabs) ? (
                                    pannelTabs.map((item, index) => {
                                        index2 = index + 1; // Define index2 here
                                        return (
                                            <Tab
                                                sx={tabstyle}
                                                style={{ textTransform: "uppercase", }}
                                                label={item} // Use the array value as the label
                                                {...a11yProps(`${index + 1}`)}
                                                key={index}
                                            />
                                        );
                                    })
                                ) : null}
                                <Tab sx={tabstyle}
                                    label="Overall"
                                    style={{ marginLeft: "30px" }}
                                    {...a11yProps(index2 + 1)}
                                />
                            </Tabs>
                        </Stack>
                    </Stack>
                )}

            <TabPanel value={value} index={0}  >
                <Cocurricular datas={curricularRAWdata} />
            </TabPanel>

            {resultRAWdata && pannelTabs && Array.isArray(pannelTabs) && (
                pannelTabs.map((item, index) => (
                    <TabPanel value={value} index={index + 1}>
                        <ReportFrame datas={resultRAWdata} indexR={index} tabName={item} />
                    </TabPanel>
                ))
            )}
            <TabPanel value={value} index={pannelTabs.length + 1}>
                <Overall datas={overallRAWdata} sessionID={selectedSession} />
            </TabPanel>

            {mob ? (
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={2}>
                    <Stack direction="row" spacing={0.5} my={mob ? 2 : 2} alignItems="center">
                        <Stack onClick={handleClickCurricular} ref={coCurricularBtn} direction="row" alignItems="center" sx={tabstyle} style={coCurricularBtnStyles}>
                            <SportsSoccerOutlinedIcon style={{ width: "25px", height: "auto", marginBottom: "0" }} />
                            <Typography>Co-curricular</Typography>
                        </Stack>
                        <Stack direction="row" onClick={handleClickAcademics} ref={academicsBtn} alignItems="center" sx={tabstyle} style={academicsStyles}>
                            <SchoolOutlinedIcon style={{ width: "25px", height: "auto", marginBottom: "0" }} />
                            <Typography>Academics</Typography>
                        </Stack>
                    </Stack>
                </Paper>
            ) : (null)
            }
        </>
    )
}