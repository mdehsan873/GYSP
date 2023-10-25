import { Box, Container, Divider, Grid, Paper, Stack, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import ProgressBar from '../tabScreens/components/ProgressBar/ProgressBar';
import { LineChart } from '../../../components/charts/LineChart'
import { Colors } from '../../../utils/colors';
import { useState } from "react";
import { useEffect } from "react";
import { VerticalChart } from '../../../components/charts/VerticalChart';
import { DoughnutChart } from '../../../components/charts/DoughnutChart';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import LensRoundedIcon from '@mui/icons-material/LensRounded';

export const Overall = ({ datas }) => {


    // Attendance Data Label 
    const [attendanceLabel, setAttendanceLabel] = useState(['Present', 'Absent'])

    // Average Marks
    const [attendanceValue, setAttendanceValue] = useState([0, 0])

    const [attendanceCenterText, setAttendanceCenterText] = useState(null)

    const attendanceData = {
        labels: attendanceLabel,
        datasets: [
            {
                label: attendanceLabel,
                data: attendanceValue,
                backgroundColor: [
                    Colors.green700,
                    "#FF7A7A",
                ],
                borderColor: [
                    Colors.green800,
                    Colors.orange800
                ],
                borderWidth: 0,
            },
        ],
    };

    const SubjectWiseRankTable = ({ data }) => {


        // Define the getOrdinalSuffix function
        function getOrdinalSuffix(number) {
            const suffixes = ['th', 'st', 'nd', 'rd'];
            const remainder = number % 100;

            return (suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]);
        }
        const [subjectWiseRank, setSubjectWiseRank] = useState({})

        useEffect(() => {
            setSubjectWiseRank(data)
        }, [data])

        return (
            <Paper sx={{ p: 2, m: 0, height: '100%', pt: 3, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px" }}>
                <Stack textAlign={'center'}>
                    <Typography variant="h5" fontWeight={500} fontSize={mob ? "16px" : "18px"}>{subjectWiseRank?.heading}</Typography>
                    <Stack justifyContent={'space-between'} p={1} mt={3} direction={'row'}>
                        <Typography variant="h5" fontWeight={"600"} fontSize={mob ? "16px" : "20px"}>{subjectWiseRank?.columnHeading1}</Typography>
                        <Typography variant="h5" fontWeight={"600"} fontSize={mob ? "16px" : "20px"}>{subjectWiseRank?.columnHeading2}</Typography>
                    </Stack>
                    <Divider />
                    {subjectWiseRank && subjectWiseRank.tableData && Array.isArray(subjectWiseRank.tableData) && (
                        subjectWiseRank.tableData.map((item, index) => (
                            <React.Fragment key={index}>
                                <Stack justifyContent={'space-between'} p={1} px={mob ? 2 : 3} py={1.5} direction={'row'}>
                                    <Typography variant="h6" fontWeight={500} textAlign={"start"} fontSize={mob ? "13px" : "19px"}>
                                        {Object.keys(item)[0]}
                                    </Typography>
                                    <Typography fontSize={mob ? "14px" : "18px"} fontWeight={600}>
                                        {item[Object.keys(item)[0]]}<sup>{getOrdinalSuffix(item[Object.keys(item)[0]])}</sup>
                                    </Typography>
                                </Stack>
                                <Divider />
                            </React.Fragment>
                        ))
                    )}
                </Stack>
            </Paper>
        )
    }

    const mob = useMediaQuery("(max-width:800px)");

    const CoScholasticActivities = ({ data }) => {

        // Rank Data
        const [coscholasticArr, setCoscholasticArr] = useState([])
        const [hasNonNullGrade, setHasNonNullGrade] = useState(false)

        // let hasNonNullGrade;

        useEffect(() => {
            if (data && Array.isArray(data) && data.length !== 0) {
                if (data) {
                    setCoscholasticArr(data);
                }
            }
        }, [data]);

        useEffect(() => {
            if (coscholasticArr && Array.isArray(coscholasticArr) && coscholasticArr.length !== 0) {
                let hasNonNullGrade1 = coscholasticArr.some(item => item.grade != null);
                setHasNonNullGrade(hasNonNullGrade1)
            }
        }, [coscholasticArr]);

        return (
            <Paper sx={{ p: 2, m: 0, height: '100%', boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px" }}>
                <Stack textAlign={'center'} style={{ height: "100%" }}>
                    <Typography variant="h5" fontWeight={500} fontSize={mob ? "14px" : "18px"}>Co-Scholastic Activities</Typography>
                    <Stack justifyContent={'space-between'} p={1} mt={2} direction={'row'}>
                        <Typography variant="h5" fontWeight={"600"} fontSize={mob ? "14px" : "20px"}>Activities</Typography>
                        <Typography variant="h5" fontWeight={"600"} fontSize={mob ? "14px" : "20px"}>Grade</Typography>
                    </Stack>
                    <Divider />
                    {hasNonNullGrade ? (
                        coscholasticArr.map((item, index) => (
                            item.grade !== null && (
                                <React.Fragment key={index}>
                                    <Stack justifyContent={'space-between'} p={1} px={2} py={1.5} direction={'row'}>
                                        <Typography variant="h6" fontWeight={500} fontSize={mob ? "12px" : "16px"}>{item.subject_name}</Typography>
                                        <Typography fontWeight={600} fontSize={mob ? "14px" : "18px"}>{item.grade || "NOT"}</Typography>
                                    </Stack>
                                    <Divider />
                                </React.Fragment>
                            )
                        ))
                    ) : (
                        <Stack justifyContent={'center'} alignItems={"center"} style={{ height: "100%" }} p={1} px={2} py={1.5} direction={'row'}>
                            <Typography fontWeight={500} fontSize={"18px"}>No data available</Typography>
                        </Stack>
                    )}
                </Stack>
            </Paper>
        )
    }

    const Overview = ({ data, seData, peData }) => {

        // Participation
        const [rankData, setRankData] = useState({})
        const [totalMarkData, setTotalMarkData] = useState({})
        const [percentageData, setPercentageData] = useState({})
        const [percentage, setPercentage] = useState(0)

        useEffect(() => {
            setRankData(data)
        }, [data])

        useEffect(() => {
            // Calculate the percentage based on primary_text and secondary_text
            const primaryValue = seData?.primary_text;
            const secondaryValue = seData?.secondary_text;
            // const calculatedPercentage = ((primaryValue / secondaryValue) * 100);
            // setPercentage(calculatedPercentage)
            setTotalMarkData(seData)
        }, [seData])

        useEffect(() => {
            // Calculate the percentage based on primary_text and secondary_text
            const primaryValue = seData?.primary_text;
            const secondaryValue = seData?.secondary_text;
            // const calculatedPercentage = ((primaryValue / secondaryValue) * 100);
            // setPercentage(calculatedPercentage)
            setPercentageData(peData)
        }, [peData])

        const mob = useMediaQuery("(max-width:800px)");

        return (
            <Grid container spacing={2} mt={1} pl={mob ? null : 1}>
                <Grid item lg={8} md={12} sm={12} sx={{ width: "100%" }}>
                    <Paper sx={{ p: 2, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px" }}>
                        <ProgressBar data={rankData} />
                    </Paper>
                </Grid>
                <Grid item lg={2} sm={6} md={4} style={{ width: "50%", paddingTop: mob ? "10px" : null }}>
                    <Paper sx={{ p: 2.5, py: mob ? 2.5 : 4.9, pt: mob ? 2 : 3.7, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px" }}>
                        <Typography variant='h5' fontWeight={500} fontSize={mob ? ("16px") : ("18px")} pb={mob ? 1 : 2}>{totalMarkData?.heading_text}</Typography>
                        <Stack direction={"row"} flexWrap={"wrap"} alignItems={"flex-end"}>
                            <Typography variant='h4' fontSize={mob ? ("22px") : ("30px")}>{totalMarkData?.primary_text?.toFixed(1)}/</Typography>
                            <Typography variant='h5' fontSize={mob ? ("16px") : (null)}>{totalMarkData?.secondary_text}</Typography>
                        </Stack>
                    </Paper>
                </Grid>
                <Grid item lg={2} sm={6} md={5} style={{ width: "50%", paddingTop: mob ? "10px" : null, paddingLeft: mob ? "10px" : null }}>
                    <Paper sx={{ p: 3, py: mob ? 2.5 : 4.5, pt: mob ? 2 : 3.5, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px" }}>
                        <Typography variant='h5' fontWeight={500} fontSize={mob ? ("16px") : ("18px")} pb={mob ? 1 : 2}>{percentageData?.heading_text}</Typography>
                        <Typography variant='h4' fontSize={mob ? ("22px") : ("34px")}>{percentageData?.primary_text?.toFixed(1)}%</Typography>
                    </Paper>
                </Grid>
            </Grid>
        )
    }


    // Below list

    function PinnedSubheaderList({ data }) {

        const [dataArray, setDataArray] = useState([])

        useEffect(() => {

            if (data && data !== null && data !== "") {
                let heading_text = data;
                let heading_array = heading_text.split(',');
                setDataArray(heading_array); // Convert the third element into an array
            } else {
                setDataArray([]);
            }

        }, [data])


        return (
            <List
                sx={{
                    width: '100%',
                    maxWidth: 360,
                    bgcolor: 'background.paper',
                    position: 'relative',
                    overflow: 'auto',
                    maxHeight: 450,
                    height: "100%",
                    '& ul': { padding: 0 },
                    "&::-webkit-scrollbar": { width: 0, height: 0 },
                }}
            >
                {dataArray && Array.isArray(dataArray) && dataArray.length > 0 ? (
                    dataArray.map((item, index) => (
                        <ListItem key={`item-${index}-${item}`} style={{ padding: "0" }}>
                            <LensRoundedIcon style={{ width: "10px", marginRight: "10px" }} />
                            <ListItemText primary={`${item}`} />
                        </ListItem>
                    ))
                ) : (<ListItem style={{ padding: "0", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}><Typography fontWeight={500} fontSize={mob ? "14px" : "18px"}>No subjects with below average score</Typography></ListItem>)}
            </List>
        );
    }

    // Outcomes Data
    const [reportFrameData, setReportFrameData] = useState({})
    const [reportFrameRAWData, setReportFrameRAWData] = useState({})

    // Remark Data
    const [remarkData, setRemarkData] = useState({})

    // Above Average
    const [aboveAverage, setAboveAverage] = useState({})

    // Below Average
    const [belowAverage, setBelowAverage] = useState({})

    // Marks Obtained vs Average Marks vs Top 10 Average
    // Labels
    const [mobbWight, setMobbWight] = useState('700px')
    const [marksTopLabel, setMarksTopLabel] = useState(['Maths', 'Science', 'Social Science', 'English'])

    const [mobbWight2, setMobbWight2] = useState('700px')
    // Marks Obtained
    const [marksTopValue1, setMarksTopValue1] = useState([0])
    // Average Marks
    const [marksTopValue2, setMarksTopValue2] = useState([0])
    // Top 10 Average Marks
    const [marksTopValue3, setMarksTopValue3] = useState([0])


    const [marksObtainedBarColor, setMarksObtainedBarColor] = useState(["#53DCA2"])

    const marksObtainedVsTop10Data = {
        labels: marksTopLabel,
        datasets: [
            {
                label: 'Marks Obtained',
                data: marksTopValue1,
                backgroundColor: marksObtainedBarColor,
                barPercentage: 0.8,
                borderColor: "rgb(101 215 255 / 10%)",
                borderWidth: 1,
                categoryPercentage: 0.5
            },
            {
                label: 'Average Marks',
                data: marksTopValue2,
                backgroundColor: "#65D7FF",
                barPercentage: 0.8,
                borderColor: "rgb(101 215 255 / 10%)",
                borderWidth: 1,
                categoryPercentage: 0.5
            },
            {
                label: 'Top 10 Average Marks',
                data: marksTopValue3,
                backgroundColor: "#6395BC",
                barPercentage: 0.8,
                borderColor: "rgb(101 215 255 / 10%)",
                borderWidth:1,
                categoryPercentage: 0.5
            },
        ],
    };
    const marksObtainedVsTop10Data2 = {
        labels: marksTopLabel,
        datasets: [
            {
                label: 'Marks Obtained',
                data: marksTopValue1,
                backgroundColor: marksObtainedBarColor,
                barPercentage: 0.8,
                borderColor: "rgb(101 215 255 / 10%)",
                borderWidth: 1,
                categoryPercentage: 0.5
            },
            {
                label: 'Average Marks',
                data: marksTopValue2,
                backgroundColor: "#65D7FF",
                barPercentage: 0.8,
                borderColor: "rgb(101 215 255 / 10%)",
                borderWidth: 1,
                categoryPercentage: 0.5
            }
        ],
    };

    const smallView = useMediaQuery("(max-width:1550px)");
    // Top 10 Average Marks
    const [rankData, setRankData] = useState({})
    const [totalMarksData, setTotalMarksData] = useState({})
    const [percentageData, setPercentageData] = useState({})

    // Subject List
    const [subjectListData, setSubjectListData] = useState([])

    useEffect(() => {

        // Marks Obtained vs Average Marks vs Top 10 Average
        if (reportFrameRAWData !== undefined && reportFrameRAWData?.length !== 0) {
            if (reportFrameRAWData?.data?.obtained_average_top !== undefined && reportFrameRAWData?.data?.obtained_average_top?.length !== 0) {


                let sortedLabelssubject = reportFrameRAWData?.data?.obtained_average_top.map(item => item?.subject);
                if (mob) {
                    sortedLabelssubject = reportFrameRAWData?.data?.obtained_average_top?.map(item => {
                        const label = item.subject;
                        if (label.includes(' ') || label.includes('_')) {
                            return label.split(/[\s_]+/);
                        } else {
                            return label;
                        }
                    });
                }
                setMarksTopLabel(sortedLabelssubject);

                let leghtValuee = reportFrameRAWData?.data?.obtained_average_top.length;
                leghtValuee = leghtValuee + "00"
                setMobbWight(leghtValuee)

                setMarksTopValue1(
                    reportFrameRAWData?.data?.obtained_average_top.map(item =>
                        typeof item.obtainedMarks === 'number'
                            ? item.obtainedMarks.toFixed(0)
                            : 100.23
                    )
                );

                setMarksTopValue2(
                    reportFrameRAWData?.data?.obtained_average_top.map(item =>
                        typeof item.averageMarks === 'number'
                            ? item.averageMarks.toFixed(0)
                            : item.averageMarks
                    )
                );

                setMarksTopValue3(
                    reportFrameRAWData?.data?.obtained_average_top.map(item =>
                        typeof item.topTenAverageMarks === 'number'
                            ? item.topTenAverageMarks.toFixed(0)
                            : item.topTenAverageMarks
                    )
                );

                // Define a function to determine the color based on the conditions
                const getColor = (obtained_mark, min_mark) => {
                    if (obtained_mark == "AB") {
                        return "#ed791a"; // Abset
                    } else if (obtained_mark < min_mark) {
                        return "#FA8072"; // fail
                    } else {
                        return "#53DCA2";
                    }
                };

                // Map through resultRAWData.marks to generate the color array
                const newMarksObtainedBarColor = reportFrameRAWData?.data?.obtained_average_top.map((mark) =>
                    getColor(mark.obtainedMarks, mark.min_mark)
                );

                // console.log()
                // Set the state with the new color array
                setMarksObtainedBarColor(newMarksObtainedBarColor);

            }
        }

        setRemarkData(reportFrameRAWData?.data?.remarkData);
        setAboveAverage(reportFrameRAWData?.data?.excellenceData);
        setBelowAverage(reportFrameRAWData?.data?.improvementData);

        let rankData = {
            myRank: reportFrameRAWData?.data?.rankData?.myRank,
            totalStudent: reportFrameRAWData?.data?.rankData?.totalRank
        }
        setRankData(rankData);
        setTotalMarksData(reportFrameRAWData?.data?.totalMarksData);
        setPercentageData(reportFrameRAWData?.data?.percentageData);

        const averageAttendance = (reportFrameRAWData?.data?.total_present / reportFrameRAWData?.data?.total_days) * 100;

        setAttendanceValue([parseFloat(averageAttendance).toFixed(0), 100 - parseFloat(averageAttendance).toFixed(0)]);

        // Line Garph
        if (reportFrameRAWData && reportFrameRAWData.subjectData && reportFrameRAWData.subjectData.length > 0) {
            let subjectRAWData = reportFrameRAWData.subjectData

            // Extracting subject names and test names
            const subjectNames = subjectRAWData.map(subject => subject.subject);
            const testNames = subjectRAWData[0].stats.map(stat => stat.name);

            // Extracting marks obtained and average marks for each subject and test
            const obtainedMarks = subjectRAWData.map(subject => subject.stats.map(stat => stat.marksObtained));
            const averageMarks = subjectRAWData.map(subject => subject.stats.map(stat => stat.averageMarks));

            // Setting the state variables
            // setSubjectListData(subjectNames);
            // setTestListData(testNames);
            // setObtainedMarkData(obtainedMarks);
            // setAverageMarkData(averageMarks);

            // Initialize an empty object to store the subject data
            const subjectData = {};
            const getColor = (obtained_mark, min_mark) => {
                if (obtained_mark == null || obtained_mark == "AB" || obtained_mark == 100.23 || obtained_mark == "100.23") {
                    return "#ed791a"; // Abset
                } else if (obtained_mark < min_mark) {
                    return "#FA8072"; // fail
                } else {
                    return "#53DCA2";
                }
            };

            // Iterate through each subject in subjectRAWData
            subjectRAWData.forEach(subject => {
                const subjectName = subject.subject;

                let testNames = subject.stats?.map(stat => {
                    if (stat?.marksObtained == "Optional") {
                        return null;
                    }

                    return stat.name.toUpperCase();
                })
                // let testNames = subject.stats?.map(stat => stat.name.toUpperCase());

                if (mob) {
                    testNames = subject.stats?.map(stat => {
                        if (stat?.marksObtained == "Optional") {
                            return;
                        }
                        const stats = stat.name.toUpperCase();
                        if (stats.includes(' ') || stats.includes('_')) {
                            return stats.split(/[\s_]+/);
                        } else {
                            return stats;
                        }
                    });
                }


                let leghtValuee = subject.stats.length;
                if (leghtValuee < 5) {
                    leghtValuee = 5
                }
                if (leghtValuee > 8) {
                    leghtValuee = 8
                }
                leghtValuee = leghtValuee + "00px"
                setMobbWight2(leghtValuee)

                const obtainedMarks = subject.stats.map(stat => {
                    if (stat.marksObtained == "Optional") {
                        return null;
                    }

                    const marksObtained = parseFloat(stat.marksObtained);


                    // Check if marksObtained is a valid number, if not, set it to null
                    return isNaN(marksObtained) ? 100.23 : marksObtained?.toFixed(0);
                });
                const averageMarks = subject.stats.map(stat => {
                    if (stat.averageMarks === null) {
                        return null;
                    }
                    return parseFloat(stat.averageMarks?.toFixed(0))
                });
                // console.log("obtainedMarks", obtainedMarks)
                // console.log("averageMarks", averageMarks)
                // console.log("testNames", testNames)
                // console.log(subject.stats)

                let colorBar = "#53DCA2";
                // Map through resultRAWData.marks to generate the color array
                const newMarksObtainedBarColor = subject.stats.map((mark) =>
                    getColor(mark.marksObtained, mark.min_mark)
                );

                // Create datasets for line and bar charts
                const lineDatasets = [
                    {
                        type: 'line',
                        label: 'Obtained Marks',
                        data: obtainedMarks,
                        borderColor: newMarksObtainedBarColor,
                        backgroundColor: newMarksObtainedBarColor,
                        lineTension: 0.4,
                        radius: 1
                    },
                    {
                        type: 'line',
                        label: 'Average Marks',
                        data: averageMarks,
                        borderColor: "#6D47EF",
                        backgroundColor: "#6D47EF",
                        lineTension: 0.4,
                        radius: 1
                    },
                    {
                        type: 'bar',
                        label: 'Bar',
                        data: obtainedMarks,
                        backgroundColor: newMarksObtainedBarColor,
                        barPercentage: 0.4,
                        borderWidth: 0,
                        categoryPercentage: 0.4,
                        datalabels: {
                            display: false,
                        },
                    }
                ];

                // Create the data structure for the subject
                subjectData[subjectName] = {
                    data: {
                        labels: testNames,
                        datasets: lineDatasets,
                    }
                };

            });
            setSubjectListData(subjectData)
            // console.log(subjectData)

        }

    }, [reportFrameRAWData])

    useEffect(() => {
        setReportFrameData(datas?.Data)
        if (datas?.Data && Array.isArray(datas?.Data) && datas?.Data.length !== 0) {
            setReportFrameRAWData(datas?.Data[0])
        }
    }, [datas])


    const centerTTExt = async () => {
        if (reportFrameRAWData && typeof reportFrameRAWData === "object") {
            const data = await reportFrameRAWData.data;

            const day = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(data?.total_present);
                }, 50); // Wait for 1 second (1000 milliseconds)
            });
            const day2 = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(data?.total_days);
                }, 50); // Wait for 1 second (1000 milliseconds)
            });
            // Check if both day and day2 are defined before setting the text
            if (day !== undefined && day2 !== undefined) {
                await setAttendanceCenterText(`${day}/${day2}`);
            }
        }
    };

    useEffect(() => {
        centerTTExt();
    }, [attendanceValue])

    return (
        <Container maxWidth='xxl' sx={{ padding: mob ? 0 : 3, mb: mob ? 9 : 0, mt: mob ? 13 : 1, pt: mob ? 0 : 2, paddingLeft: mob ? null : "18px" }}>
            {reportFrameData && Array.isArray(reportFrameData) && reportFrameData.length !== 0 ? (
                <>
                    <Overview data={rankData} seData={totalMarksData} peData={percentageData} />
                    <Grid container>
                        {Object.keys(subjectListData).map((subjectName, index) => (
                            <Grid item lg={6} sm={12} md={12} key={index} style={{ width: "100%" }} padding={mob ? 0 : "0px 8px"}>
                                <Box style={{ marginTop: mob ? "10px" : "16px" }} pl={mob ? 0 : null} width={'100%'}>
                                    <LineChart data={subjectListData[subjectName].data} barWidth={mob ? 8 : 8}  max={100} title={subjectName} chatHeight={mob ? "75px" : '100%'} chatMobWight={mob ? mobbWight2 : null} fontSiziize={mob ? 10 : null} />
                                </Box>
                            </Grid>
                        ))}
                        <Grid container style={{ marginTop: mob ? "10px" : "16px" }} pl={mob ? null : 1} >
                            <Grid item pr={mob ? 0 : 1} lg={9} sm={12} style={{ width: "100%", marginTop: mob ? "0" : null }}>
                                <VerticalChart data={mob ? marksObtainedVsTop10Data2 : marksObtainedVsTop10Data} fontSiziize={mob ? 9 : null} chatHeight={mob ? "100px" : null} chatMobWight={mob ? mobbWight : null} max={100} barWidth={mob ? 10 : 16} title={mob ? 'Marks Obtained vs Average Marks' : 'Marks Obtained vs Average Marks vs Top 10 Average'} />
                            </Grid>
                            <Grid item lg={3} pl={mob ? 0 : 1} mt={mob ? "16px" : 0} sm={12} style={{ width: "100%", marginTop: mob ? "10px" : null }}>
                                <SubjectWiseRankTable data={reportFrameRAWData?.data?.subjectRankData} />
                            </Grid>
                            <Grid pr={mob ? 0 : 1} my={0} item lg={6} sm={12} style={{ marginTop: mob ? "10px" : "16px", width: "100%" }}>
                                <Stack mt={0}>
                                    <Grid container mt={0} justifyContent={"space-between"} >
                                        <Grid item lg={6} pr={mob ? 0 : 1} sm={12} sx={{ width: "48.5%" }}>
                                            <Paper sx={{ p: 3, m: 0, py: 3, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px", height: "100%" }}>
                                                <Typography variant='h5' fontWeight={600} fontSize={mob ? "14px" : "18px"} pb={0}>{aboveAverage?.heading_text}</Typography>
                                                <PinnedSubheaderList data={aboveAverage?.primary_text} />
                                            </Paper>
                                        </Grid>
                                        <Grid item lg={6} pl={mob ? 0 : 1} sm={12} sx={{ width: "48.5%" }}>
                                            <Paper sx={{ p: 3, m: 0, py: 3, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px", height: "100%" }}>
                                                <Typography variant='h5' fontWeight={600} fontSize={mob ? "14px" : "18px"} pb={0}>{belowAverage?.heading_text}</Typography>
                                                <PinnedSubheaderList data={belowAverage?.primary_text} />
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                    <Paper pl={1} style={{ marginTop: mob ? "10px" : "16px" }} sx={{ p: mob ? 2 : 4, m: 0, py: mob ? 2 : 5, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px" }}>
                                        <Typography variant='h4' fontSize={mob ? "20px" : "26px"}>{remarkData?.heading_text}</Typography>
                                        <Typography py={2} fontSize={16}>{remarkData?.primary_text}</Typography>
                                    </Paper>
                                </Stack>
                            </Grid>
                            <Grid item pl={mob ? 0 : 1} style={{ marginTop: mob ? "10px" : "16px" }} lg={6} sm={12}>
                                <Grid container style={{ height: "100%" }}>
                                    <Grid item pr={mob ? 0 : 1} lg={6} sm={12} sx={{ width: "100%" }}>
                                        <CoScholasticActivities data={reportFrameRAWData?.data?.activitesData?.tableData} />
                                    </Grid>
                                    <Grid item pl={mob ? 0 : 1} lg={6} mt={mob ? "10px" : 0} sm={12} style={{ width: "100%" }}>
                                        {attendanceCenterText ? (
                                            // If eventParticipationArv is defined
                                            <DoughnutChart data={attendanceData} centerText={attendanceCenterText} title={'Attendance'} chatHeight={smallView ? '100%' : "58%"} chatWidth={smallView ? '100%' : "90%"} />

                                        ) : (
                                            // If eventParticipationArv is not defined
                                            <Paper
                                                sx={{
                                                    padding: 2,
                                                    my: 0,
                                                    height: '100%',
                                                    boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)",
                                                    borderRadius: mob ? "10px" : "15px"
                                                }}
                                            >
                                                <Typography
                                                    style={{
                                                        textAlign: "center",
                                                        color: "#3D3D3D",
                                                        fontSize: "18px",
                                                        fontWeight: "500",
                                                        marginBottom: "16px"
                                                    }}
                                                >
                                                    Attendance
                                                </Typography>
                                                <div
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        padding: "10px 46px",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    <Typography
                                                        style={{
                                                            textAlign: "center",
                                                            color: "#3D3D3D",
                                                            fontSize: "18px",
                                                            fontWeight: "500",
                                                            marginBottom: "16px"
                                                        }}
                                                    >
                                                        Loading...
                                                    </Typography>
                                                </div>
                                            </Paper>
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <Grid container spacing={2} justifyContent={"center"} alignItems={"center"} mt={5} style={{ height: "74vh" }}>
                    <Typography variant='h5' fontWeight={500} textAlign={"center"} fontSize={mob ? ("24px") : ("18px")} pb={2}>No data available</Typography>
                </Grid>
            )}
        </Container>
    )
}
