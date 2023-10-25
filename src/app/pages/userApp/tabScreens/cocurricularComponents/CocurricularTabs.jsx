import React, { useState, useEffect } from 'react'
import { CssBaseline, Paper, Tabs, Tab, useTheme, useMediaQuery, Box, Typography, Stack, FormLabel, FormControl, Select, MenuItem, } from '@mui/material'
import PropTypes from 'prop-types';
import secureLocalStorage from "react-secure-storage";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 0, pt: 3 }}>
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

const Item = ({ title, desc, type, date, result, id }) => {

    const mob = useMediaQuery("(max-width:800px)");
    const handleRedirect = (links) => {
        window.location.href = links;
        // Open the link in a new tab
        // window.open(links, '_blank');
    };
    const formatEventType = (outcomeKey2) => {
        switch (outcomeKey2) {
            case 'inschool':
                return 'School Level';
            case 'inter_school':
                return 'Inter-School Level';
            case 'state':
                return 'State Level';
            case 'inter_state':
                return 'Inter-State Level';
            case 'national':
                return 'National Level';
            case 'inter_nation':
                return 'Inter-National Level';
            // Add more cases for other outcome keys
            // default:
            //     // If the outcome key is not found in the switch cases,
            //     // return the outcome key with the first letter capitalized
            //     return outcomeKey2.charAt(0).toUpperCase() + outcomeKey2.slice(1);
        }
    };

    return (
        <Stack component={Paper} flexDirection={'row'} onClick={(e) => { handleRedirect(`/event-details/${id}`) }} justifyContent={'space-between'} width={mob ? '320px' : '400px'} padding={mob ? 1.5 : 2} m={1} style={{ boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "rgba(0, 0, 0, 0.2) 1px 3px 6px 0px", borderRadius: "10px", cursor: "pointer" }}>
            <Stack px={2} pl={0} width={mob ? "170px" : '230px'}>
                <Typography variant='h5' style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", overflow: "hidden", }} fontSize={mob ? "14px" : null}>{title}</Typography>
                <Typography fontSize={mob ? 10 : 12} style={{ textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", overflow: "hidden", }}>{desc}</Typography>
                <Typography mt={1} fontSize={mob ? 10 : null}>{formatEventType(type)}</Typography>
            </Stack>
            <Stack px={2} pr={0} width={'150px'}>
                <Typography variant='h6' fontSize={mob ? 12 : null}>Date of Event:</Typography>
                <Typography fontSize={mob ? 10 : 12} mt={0}>{date}</Typography>
                <Typography mt={mob ? 1 : 2} fontSize={mob ? 12 : null}>Result: {result}</Typography>
            </Stack>
        </Stack>
    );
}

// Define the getOrdinalSuffix function
function getOrdinalSuffix(number) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const remainder = number % 100;

    return (suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]);
}


export default function CocurricularTabs({ CocurricularTabss, categoryTabs, data }) {
    const [value, setValue] = useState(0);
    // const handleChange = (event, newValue) => {
    //     setValue(newValue);
    //     const { value } = event.target

    //     console.log(value)
    //     if (value) {
    //         // if (CocurricularTabss == "Event Details") {
    //         //     secureLocalStorage.setItem("setEventTab", newValue)
    //         // } else {
    //         //     secureLocalStorage.setItem("setWorkShopTab", newValue)
    //         // }
    //         setValue(value);
    //     }

    //     if (CocurricularTabss == "Event Details") {
    //         secureLocalStorage.setItem("setEventTab", newValue)
    //     } else {
    //         secureLocalStorage.setItem("setWorkShopTab", newValue)
    //     }
    // };

    const handleChange = (event, newValue) => {
        const newValue2 = event.target.value; // Get the new value from the event
        if (mob) {
            setValue(newValue2); // Update the state with the new value
            if (newValue2) {
                // Check if the new value is not empty
                if (CocurricularTabss === "Event Details") {
                    secureLocalStorage.setItem("setEventTab", newValue2);
                } else {
                    secureLocalStorage.setItem("setWorkShopTab", newValue2);
                }
            }
        } else {
            setValue(newValue);
            if (CocurricularTabss == "Event Details") {
                secureLocalStorage.setItem("setEventTab", newValue)
            } else {
                secureLocalStorage.setItem("setWorkShopTab", newValue)
            }
        }

    };

    const [partEventData, setPartEventData] = useState([])
    const [partTableData, setPartTableData] = useState([])

    useEffect(() => {
        setPartTableData(categoryTabs)
        if (CocurricularTabss == "Event Details") {
            if (secureLocalStorage.getItem("setEventTab")) {
                setValue(secureLocalStorage.getItem("setEventTab"));
            }
        } else {
            if (secureLocalStorage.getItem("setWorkShopTab")) {
                setValue(secureLocalStorage.getItem("setWorkShopTab"));
            }
        }
    }, [categoryTabs])


    useEffect(() => {
        setPartEventData(data)
    }, [data])

    const mob = useMediaQuery("(max-width:800px)");
    return (
        <Paper sx={{ mt: 0, p: mob ? 1 : 2, width: '100%', pt: mob ? 2 : 3, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob?"10px":"15px" }} style={{ marginTop: mob ? "10px" : "16px" }}>
            <Typography variant='h5' textAlign={"center"} fontWeight={"500"} fontSize={"18px"}>{CocurricularTabss}</Typography>
            <CssBaseline />
            <Box sx={{ width: '100%', }} mt={2}>
                <Box sx={{ borderBottom: 0, borderColor: 'divider', textAlign: mob ? "center" : null }}>
                    {mob ? (
                        <FormControl variant="standard" sx={{ width: '50%', margin: "auto" }}>
                            <Select
                                labelId="tabPanelTab-simple-select-standard-label"
                                id="tabPanelTab-simple-select-standard"
                                name="tabPanelTab"
                                onChange={handleChange}
                                value={value}
                                style={{ marginTop: 0, fontWeight: 600, fontSize: '12px', color: "#03014c", opacity: "0.5", letterSpacing: "0.5px" }}
                            >
                                {partTableData && partTableData?.length !== 0 ? (
                                    partTableData.map((achievement, index) => (
                                        <MenuItem value={index}>{achievement}</MenuItem>
                                    ))
                                ) : null}
                            </Select>
                        </FormControl>) : (<Tabs
                            variant="standard"
                            textColor='inherit'
                            indicatorColor='primary'
                            value={value} onChange={handleChange} aria-label="basic tabs example">
                            {partTableData && partTableData?.length !== 0 ? (
                                partTableData.map((achievement, index) => (
                                    <Tab
                                        key={index}
                                        style={{ border: "0", background: "#fff", color: "#000", fontSize: "15px", textTransform: "capitalize" }}
                                        label={achievement}
                                        {...a11yProps(index)}
                                    />
                                ))
                            ) : null}
                        </Tabs>)}
                </Box>
            </Box>
            {partTableData && partTableData?.length !== 0 ? (
                partTableData.map((category, index) => {

                    // Make sure partEventData is an array before using filter
                    if (!Array.isArray(partEventData)) {
                        return null; // or handle this case appropriately
                    }

                    const matchingEvents = partEventData.filter(event => event.category === category);

                    return (
                        <TabPanel key={index} value={value} index={index}>
                            <Box sx={{ display: 'flex', overflowX: 'scroll', "&::-webkit-scrollbar": { width: 0, height: 0 }, "&::-webkit-scrollbar-track": { backgroundColor: "orange", }, "&::-webkit-scrollbar-thumb": { backgroundColor: "red", borderRadius: 2 } }}>
                                {matchingEvents.length !== 0 ? (
                                    matchingEvents.map((item, innerIndex) => (
                                        <Item
                                            key={innerIndex}
                                            title={item.name}
                                            desc={item.description}
                                            id={item.id}
                                            type={item.type_of_event}
                                            date={item.date}
                                            result={item.rank ? `${item.rank}${getOrdinalSuffix(item.rank)}` : 'Partipation'}
                                        />
                                    ))
                                ) : (
                                    <Stack flexDirection={'row'} justifyContent={'center'} width={'100%'} padding={2} m={1} style={{ borderRadius: "10px", cursor: "pointer" }}>
                                        <Typography fontWeight={600} fontSize={"18px"}>No Data</Typography>
                                    </Stack>
                                )}
                            </Box>
                        </TabPanel>
                    );
                })
            ) : null}


        </Paper>
    )
}