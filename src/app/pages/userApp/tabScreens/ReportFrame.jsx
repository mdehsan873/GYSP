
import { Container, Divider, Grid, Paper, Stack, Typography, useMediaQuery } from '@mui/material'
import React from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import LensRoundedIcon from '@mui/icons-material/LensRounded';
import { VerticalChart } from '../../../components/charts/VerticalChart'
import { Colors } from '../../../utils/colors';
import { useState } from "react";
import { useEffect } from "react";
import { DoughnutChart } from '../../../components/charts/DoughnutChart';
import ProgressBar from '../tabScreens/components/ProgressBar/ProgressBar';
import { useNavigate } from "react-router-dom";

const MarksObtainedTable = ({ data }) => {

    const mob = useMediaQuery("(max-width:800px)");

    const [marksObtained, setMarksObtained] = useState({})

    useEffect(() => {
        setMarksObtained(data)
    }, [data])

    return (
        <Paper sx={{ p: 2, m: 0, height: '100%', pt: 4, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px" }}>
            <Stack textAlign={'center'}>
                <Typography variant="h5" fontWeight={500}>Marks Obtained</Typography>
                <Stack justifyContent={'space-between'} p={1} mt={3} px={mob ? 2 : 3} direction={'row'}>
                    <Typography variant="h5" fontWeight={"600"} fontSize={mob ? "18px" : "20px"}>Subject</Typography>
                    <Typography variant="h5" fontWeight={"600"} fontSize={mob ? "18px" : "20px"}>Marks</Typography>
                </Stack>
                <Divider />
                {marksObtained && Array.isArray(marksObtained) ? (
                    marksObtained.map((item, index) => (
                        <React.Fragment key={index}>
                            <Stack justifyContent={'space-between'} p={1} px={mob ? 2 : 3} paddingRight={3} py={1.5} direction={'row'}>
                                <Typography variant="h6" fontWeight={500} textAlign={"start"} fontSize={mob ? "17px" : "19px"}>{item.subject}</Typography>
                                <Typography fontSize={mob ? "16px" : "18px"} fontWeight={600}>{!isNaN(item.obtained_mark) ? (`${item.obtained_mark}/${item.max_mark}`) : ("AB")}</Typography>
                            </Stack>
                            <Divider />
                        </React.Fragment>
                    ))
                ) : (
                    <p>No marks obtained data available.</p>
                )}

            </Stack>
        </Paper>
    )
}

// Define the getOrdinalSuffix function
function getOrdinalSuffix(number) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const remainder = number % 100;

    return (suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]);
}

const SubjectWiseRankTable = ({ data }) => {

    const mob = useMediaQuery("(max-width:800px)");
    const [subjectWiseRank, setSubjectWiseRank] = useState({})

    useEffect(() => {
        setSubjectWiseRank(data)
    }, [data])

    return (
        <Paper sx={{ p: 2, m: 0, height: '100%', pt: 3, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px" }}>
            <Stack textAlign={'center'}>
                <Typography variant="h5" fontWeight={500} fontSize={"18px"}>Subject wise Rank</Typography>
                <Stack justifyContent={'space-between'} p={1} mt={3} px={mob ? 1 : 2} direction={'row'}>
                    <Typography variant="h5" fontWeight={"600"} fontSize={mob ? "18px" : "20px"}>Subject</Typography>
                    <Typography variant="h5" fontWeight={"600"} fontSize={mob ? "18px" : "20px"}>Rank</Typography>
                </Stack>
                <Divider />
                {subjectWiseRank && typeof subjectWiseRank === "object" && Object.keys(subjectWiseRank).length > 0 && (
                    Object.keys(subjectWiseRank).map((subject, index) => (
                        <React.Fragment key={index}>
                            <Stack justifyContent={'space-between'} p={1} px={mob ? 1.5 : 2.5} py={1.5} direction={'row'}>
                                <Typography variant="h6" fontWeight={500} textAlign={"start"} fontSize={mob ? "17px" : "19px"}>
                                    {subject}
                                </Typography>
                                <Typography fontSize={mob ? "16px" : "18px"} fontWeight={600}>
                                    {subjectWiseRank[subject]}<sup>{getOrdinalSuffix(subjectWiseRank[subject])}</sup>
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

const CoScholasticActivities = ({ data }) => {

    const mob = useMediaQuery("(max-width:800px)");
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
                <Typography variant="h5" fontWeight={500} fontSize={mob ? "16px" : "18px"}>Co-Scholastic Activities</Typography>
                <Stack justifyContent={'space-between'} p={1} mt={2} direction={'row'}>
                    <Typography variant="h5" fontWeight={"600"} fontSize={mob ? "18px" : "20px"}>Activities</Typography>
                    <Typography variant="h5" fontWeight={"600"} fontSize={mob ? "18px" : "20px"}>Grade</Typography>
                </Stack>
                <Divider />
                {hasNonNullGrade ? (
                    coscholasticArr.map((item, index) => (
                        item.grade !== null && (
                            <React.Fragment key={index}>
                                <Stack justifyContent={'space-between'} p={1} px={2} py={1.5} direction={'row'}>
                                    <Typography variant="h6" fontWeight={500} fontSize={mob ? "14px" : "16px"}>{item.subject_name}</Typography>
                                    <Typography fontWeight={600} fontSize={mob ? "16px" : "18px"}>{item.grade || "NOT"}</Typography>
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

export const Overview = ({ data }) => {

    // Participation
    const [rankData, setRankData] = useState({})

    useEffect(() => {
        if (data) {
            setRankData(data)
        } else {
            setRankData(data)
        }
    }, [data])


    const mob = useMediaQuery("(max-width:800px)");
    return (
        <Grid container spacing={2} mt={1}>
            <Grid item lg={8} md={12} sm={12} sx={{ width: "100%" }}>
                <Paper sx={{ p: 2, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px" }}>
                    <ProgressBar data={rankData} />
                </Paper>
            </Grid>
            <Grid item lg={2} sm={6} md={4} style={{ width: "50%", paddingTop: mob ? "10px" : null }}>
                <Paper sx={{ p: 3, py: mob ? 2.5 : 4.8, pt: mob ? 2 : 3.5, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px" }}>
                    <Typography variant='h5' fontWeight={500} fontSize={mob ? ("16px") : ("18px")} pb={mob ? 1 : 2}>Total Marks</Typography>
                    <Stack direction={"row"} flexWrap={"wrap"} alignItems={"flex-end"}>
                        <Typography variant='h4' fontSize={mob ? ("22px") : ("32px")}>{data?.myMarks || 'Loading...'}/</Typography>
                        <Typography variant='h5' fontSize={mob ? ("16px") : (null)}>{data?.totalMarks || 'Loading...'}</Typography>
                    </Stack>
                </Paper>
            </Grid>
            <Grid item lg={2} sm={6} md={5} style={{ width: "50%", paddingTop: mob ? "10px" : null }}>
                <Paper sx={{ p: 3, py: mob ? 2.5 : 4.5, pt: mob ? 2 : 3.5, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px" }}>
                    <Typography variant='h5' fontWeight={500} fontSize={mob ? ("16px") : ("18px")} pb={mob ? 1 : 2}>Percentage</Typography>
                    <Typography variant='h4' fontSize={mob ? ("22px") : ("34px")}>{data?.myPercentage || 'Loading...'}%</Typography>
                </Paper>
            </Grid>
        </Grid>
    )
}

export const ReportFrame = ({ datas, indexR, tabName }) => {
    const navigate = useNavigate();

    // Result Data
    const [resultRAWData, setResultRAWData] = useState({})

    // Rank Data
    const [rankData, setRankData] = useState({})


    useEffect(() => {
        if (datas && Array.isArray(datas) && datas.length !== 0) {
            // Find the item in datas array that matches tabName and indexR
            const selectedData = datas.find((item, index) => item.test === tabName && index === indexR);

            if (selectedData) {
                setResultRAWData(selectedData.data);
            }
            // else {
            // console.log("Data not found for the specified tabName and indexR");
            // Handle the case where data is not found
            // }
        } else {
            navigate('/');
        }
    }, [datas, indexR, tabName]);

    useEffect(() => {
        if (resultRAWData && typeof resultRAWData === "object") {

            // rank Data
            let myRank = resultRAWData?.rank || 0;
            let totalStudent = resultRAWData?.total_student || 0;


            let totalMarks = 0;
            let myMarks = 0;
            let myPercentage = 0;

            if (resultRAWData && resultRAWData.marks && Array.isArray(resultRAWData.marks)) {
                // Iterate through the marks array
                resultRAWData.marks.forEach(markData => {
                    if (!isNaN(markData.obtained_mark)) {
                        totalMarks += markData.max_mark; // Accumulate total marks
                        myMarks += markData.obtained_mark; // Accumulate your obtained marks
                    }
                });

                // Calculate your percentage
                if (totalMarks !== 0) {
                    myPercentage = (myMarks / totalMarks) * 100;
                }

                // Round the values
                myMarks = myMarks.toFixed(1);
                totalMarks = totalMarks.toFixed(0);
                myPercentage = myPercentage.toFixed(1);
            }

            setRankData({
                "myRank": myRank,
                "totalStudent": totalStudent,
                "myMarks": myMarks,
                "totalMarks": totalMarks,
                "myPercentage": myPercentage,
            })
        }
    }, [resultRAWData]);

    function PinnedSubheaderList({ data }) {

        const [dataArray, setDataArray] = useState([])

        useEffect(() => {

            if (data && Array.isArray(data) && data.length > 0) {
                setDataArray(data); // Convert the third element into an array
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


    // Marks Obtained vs Average Marks vs Top 10 Average

    // Labels
    const [marksTopLabel, setMarksTopLabel] = useState(['Maths', 'Science', 'Social Science', 'English'])

    // Marks Obtained
    const [marksTopValue1, setMarksTopValue1] = useState([0])
    // Average Marks
    const [marksTopValue2, setMarksTopValue2] = useState([0])
    // Top 10 Average Marks
    const [marksTopValue3, setMarksTopValue3] = useState([0])

    const [marksTopBarColor, setMarksTopBarColor] = useState(['#53DCA2'])
    const [marksTopValue2Color, setMarksTopValue2Color] = useState(["#43B5C1"])
    const [marksTopValue3Color, setMarksTopValue3Color] = useState(["#6395BC"])

    const marksObtainedVsTop10Data = {
        labels: marksTopLabel,
        datasets: [
            {
                label: 'Marks Obtained',
                data: marksTopValue1,
                backgroundColor: marksTopBarColor,
                borderColor: "rgb(101 215 255 / 10%)",
                borderWidth: 1,
                barPercentage: 0.9,
                categoryPercentage: 1,
            },
            {
                label: 'Average Marks',
                data: marksTopValue2,
                backgroundColor: marksTopValue2Color,
                borderColor: "rgb(101 215 255 / 10%)",
                borderWidth: 1,
                barPercentage: 0.9,
                categoryPercentage: 1,
            },
            {
                label: 'Top 10 Average Marks',
                data: marksTopValue3,
                backgroundColor: marksTopValue3Color,
                borderColor: "rgb(101 215 255 / 10%)",
                borderWidth: 1,
                barPercentage: 0.9,
                categoryPercentage: 1,
            },
        ],
    };

    const marksObtainedVsTop10DataMob = {
        labels: marksTopLabel,
        datasets: [
            {
                label: 'Marks Obtained',
                data: marksTopValue1,
                backgroundColor: marksTopBarColor,
                borderColor: "rgb(101 215 255 / 10%)",
                borderWidth: 1,
                barPercentage: 0.9,
                categoryPercentage: 1,
            },
            {
                label: 'Average Marks',
                data: marksTopValue2,
                backgroundColor: marksTopValue2Color,
                borderColor: "rgb(101 215 255 / 10%)",
                borderWidth: 1,
                barPercentage: 0.9,
                categoryPercentage: 1,
            }
        ],
    };

    // Marks Obtained Data
    // Marks Obtained   
    const [marksObtainedLabel, setMarksObtainedLabel] = useState(['Maths', 'Science', 'Social Science', 'English'])

    // Average Marks
    const [marksObtainedValue, setMarksObtainedValue] = useState([0])
    const [marksObtainedBarColor, setMarksObtainedBarColor] = useState(["#53DCA2"])

    const marksObtainedData = {
        labels: marksObtainedLabel,
        datasets: [
            {
                label: 'Subjects',
                data: marksObtainedValue,
                backgroundColor: marksObtainedBarColor,
                barPercentage: 0.8,
                categoryPercentage: 0.5
            }
        ],
    };

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
                    "#53DCA2",
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

    // Co Schoolastic
    const [coSchoolasticData, setCoSchoolasticData] = useState([])

    // Above 
    const [aboveSubjectData, setAboveSubjectData] = useState([])
    const [belowSubjectData, setBelowSubjectData] = useState([])


    useEffect(() => {

        if (resultRAWData && typeof resultRAWData === "object") {
            // Marks Obtained vs Average Marks vs Top 10 Average
            if (resultRAWData?.marks !== undefined && resultRAWData?.marks?.length !== 0) {

                let markArry = resultRAWData?.marks?.map(item => item?.subject);

                if (mob) {

                    markArry = resultRAWData?.marks?.map(item => {
                        const subject = item?.subject;
                        if (subject.includes(' ') || subject.includes('_')) {
                            return subject.split(/[\s_]+/);
                        } else {
                            return subject;
                        }
                    });
                }

                setMarksTopLabel(markArry);
                setMarksTopValue1(resultRAWData?.marks?.map(item => {
                    const marksObtained = parseFloat(item.obtained_percent);

                    // Check if marksObtained is a valid number, if not, set it to null
                    return isNaN(marksObtained) ? "100.23" : marksObtained?.toFixed(0);
                }));
                setMarksTopValue2(resultRAWData?.marks?.map(item => item?.avarage_mark?.toFixed(0)));
                setMarksTopValue3(resultRAWData?.marks?.map(item => item?.top_ten?.toFixed(0)));


                // Define a function to determine the color based on the conditions
                const getColor = (obtained_mark, min_mark) => {
                    if (obtained_mark == null || obtained_mark == "AB" || obtained_mark == 100.23 || obtained_mark == "100.23") {
                        return "#ed791a"; // Abset

                    } else if (obtained_mark < min_mark) {
                        return "#FA8072"; // fail
                    } else {
                        return "#53DCA2";
                    }
                };

                // Map through resultRAWData.marks to generate the color array
                const newMarksObtainedBarColor = resultRAWData?.marks.map((mark) =>
                    getColor(mark.obtained_mark, mark.min_mark)
                );
                const newMarksObtainedBarColor2 = resultRAWData?.marks.map((mark) =>
                    "#43B5C1"
                );
                const newMarksObtainedBarColor3 = resultRAWData?.marks.map((mark) =>
                    "#6395BC"
                );

                // Set the state with the new color array
                setMarksObtainedBarColor(newMarksObtainedBarColor);
                setMarksTopBarColor(newMarksObtainedBarColor);
                setMarksTopValue2Color(newMarksObtainedBarColor2);
                setMarksTopValue3Color(newMarksObtainedBarColor3);

            }

            // Marks Obtained Data
            if (resultRAWData?.marks !== undefined && resultRAWData?.marks?.length !== 0) {

                // const markArry = resultRAWData?.marks?.map(item => item?.subject)
                let markArry = resultRAWData?.marks?.map(item => item?.subject);
                if (mob) {
                    markArry = resultRAWData?.marks?.map(item => {
                        const subject = item?.subject
                        if (subject.includes(' ') || subject.includes('_')) {
                            return subject.split(/[\s_]+/);
                        } else {
                            return subject;
                        }
                    });
                }
                setMarksObtainedLabel(markArry);
                setMarksObtainedValue(resultRAWData?.marks?.map(item => {
                    const marksObtained = parseFloat(item.obtained_percent);

                    // Check if marksObtained is a valid number, if not, set it to null
                    return isNaN(marksObtained) ? "100.23" : marksObtained?.toFixed(0);
                }));

                // Define a function to determine the color based on the conditions
                const getColor = (obtained_mark, min_mark) => {
                    if (obtained_mark === null || obtained_mark == "AB") {
                        return "#ed791a"; // Abset
                    } else if (obtained_mark < min_mark) {
                        return "#FA8072"; // fail
                    } else {
                        return "#53DCA2";
                    }
                };

                // Map through resultRAWData.marks to generate the color array
                const newMarksObtainedBarColor = resultRAWData.marks.map((mark) =>
                    getColor(mark.obtained_mark, mark.min_mark)
                );

                // console.log()
                // Set the state with the new color array
                setMarksObtainedBarColor(newMarksObtainedBarColor);

            }

            // Attendance data
            // Calculate the average attendance percentage
            const averageAttendance = (resultRAWData.attedence / resultRAWData.max_day) * 100;
            // if(resultRAWData.attedence){
            //     setAttendanceCenterText(`${resultRAWData.attedence}/${resultRAWData.max_day}`)
            // }

            setCoSchoolasticData(resultRAWData?.co_schoolastic)

            if (resultRAWData.marks && resultRAWData.marks.length !== 0) {
                // Above Subject
                // Filter subjects with obtained_percent > avarage_mark
                const aboveAverageSubjects = resultRAWData.marks.filter(
                    subject => subject.obtained_percent > subject.avarage_mark
                );

                // Extract subject names from aboveAverageSubjects
                const aboveSubject = aboveAverageSubjects.map(subject => subject.subject);

                // Below Subject
                // Filter subjects with obtained_percent < avarage_mark
                const belowAverageSubjects = resultRAWData.marks.filter(
                    subject => subject.obtained_percent < subject.avarage_mark
                );

                // Extract subject names from belowAverageSubjects
                const belowSubject = belowAverageSubjects.map(subject => subject.subject);

                setAboveSubjectData(aboveSubject);
                setBelowSubjectData(belowSubject);
            }

            // Update the attendanceValue state with the calculated value
            setAttendanceValue([parseFloat(averageAttendance).toFixed(0), 100 - parseFloat(averageAttendance).toFixed(0)]);

        }

    }, [resultRAWData])

    const centerTTExt = async () => {
        if (resultRAWData && typeof resultRAWData === "object") {
            const data = await resultRAWData;
            const day = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(data?.attedence);
                }, 50); // Wait for 1 second (1000 milliseconds)
            });
            const day2 = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve(data?.max_day);
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

    const smallView = useMediaQuery("(max-width:1550px)");
    const mob = useMediaQuery("(max-width:800px)");
    return (
        <Container maxWidth='xxl' sx={{ padding: mob ? 0 : 3, mb: mob ? 9 : 0, mt: mob ? 13 : 1, pt: mob ? 0 : 2 }}>
            <Overview data={rankData} />
            <Grid container my={0} style={{ marginTop: mob ? "10px" : "16px" }} >
                <Grid item lg={9} my={0} pr={mob ? 0 : 1} sm={12} sx={{ width: "100%" }}>
                    <VerticalChart data={marksObtainedData} fontSiziize={mob ? 9 : null} chatHeight={mob ? "100px" : null} chatMobWight={mob ? "600px" : null} titleDisplay={false} max={100} barWidth={mob ? 12 : 32} title={'Marks Obtained'} />
                </Grid>
                <Grid item lg={3} my={0} pl={mob ? 0 : 1} mt={mob ? "10px" : 0} sm={12} sx={{ width: "100%" }}>
                    <MarksObtainedTable data={resultRAWData?.marks} />
                </Grid>
            </Grid>
            <Grid container my={0} style={{ marginTop: mob ? "10px" : "16px" }} >
                <Grid item lg={9} pr={mob ? 0 : 1} sm={12} sx={{ width: "100%" }}>
                    <VerticalChart data={mob ? marksObtainedVsTop10DataMob : marksObtainedVsTop10Data} fontSiziize={mob ? 9 : null} chatHeight={mob ? "100px" : null} chatMobWight={mob ? "600px" : null} barWidth={mob ? 10 : 16} max={100} title={mob ? 'Marks Obtained vs Average Marks' : 'Marks Obtained vs Average Marks vs Top 10 Average'} stepStick={10} />
                </Grid>
                <Grid item lg={3} pl={mob ? 0 : 1} mt={mob ? "10px" : 0} sm={12} sx={{ width: "100%" }}>
                    <SubjectWiseRankTable data={resultRAWData?.subject_rank} />
                </Grid>
                <Grid pr={mob ? 0 : 1} my={0} item lg={6} sm={12} style={{ marginTop: mob ? "10px" : "16px", width: "100%" }} >
                    <Stack mt={0}>
                        <Grid container mt={0} justifyContent={"space-between"} >
                            <Grid item lg={6} pr={mob ? 0 : 1} sm={12} sx={{ width: "48.5%" }}>
                                <Paper sx={{ p: 3, m: 0, py: 3, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px", height: "100%" }}>
                                    <Typography variant='h5' fontWeight={600} fontSize={mob ? "14px" : "18px"} pb={0}>{"Above Average"}</Typography>
                                    <PinnedSubheaderList data={aboveSubjectData} />
                                </Paper>
                            </Grid>
                            <Grid item lg={6} pl={mob ? 0 : 1} sm={12} sx={{ width: "48.5%" }}>
                                <Paper sx={{ p: 3, m: 0, py: 3, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px", height: "100%" }}>
                                    <Typography variant='h5' fontWeight={600} fontSize={mob ? "14px" : "18px"} pb={0}>{"Below Average"}</Typography>
                                    <PinnedSubheaderList data={belowSubjectData} />
                                </Paper>
                            </Grid>
                        </Grid>
                        <Paper pl={mob ? 0 : 1} style={{ marginTop: mob ? "10px" : "16px" }} sx={{ p: mob ? 2 : 4, m: 0, py: mob ? 2 : 5, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px" }}>
                            <Typography variant='h4' fontSize={mob ? "20px" : "26px"}>Remarks</Typography>
                            {resultRAWData?.remark ? (<Typography py={2} fontSize={16}>{resultRAWData?.remark}</Typography>) : (<Typography py={2} fontWeight={500} textAlign={"center"} fontSize={16}>{"No data available"}</Typography>)}
                        </Paper>
                    </Stack>
                </Grid>
                <Grid item pl={mob ? 0 : 1} style={{ marginTop: mob ? "10px" : "16px" }} lg={6} sm={12}>
                    <Grid container style={{ height: "100%" }}>
                        <Grid item pr={mob ? 0 : 1} lg={6} sm={12} sx={{ width: "100%" }}>
                            <CoScholasticActivities data={coSchoolasticData} />
                        </Grid>
                        <Grid item pl={mob ? 0 : 1} mt={mob ? "10px" : 0} lg={6} sm={12} style={{ width: "100%" }}>
                            {attendanceCenterText ? (
                                // If eventParticipationArv is defined
                                <DoughnutChart data={attendanceData} centerText={attendanceCenterText} title={'Attendance'} chatHeight={smallView ? '100%' : "45%"} chatWidth={smallView ? "100%" : "80%"} />

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
        </Container>
    )
}