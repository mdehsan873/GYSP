import { Box, Button, Container, Divider, Grid, Paper, Stack, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { Image } from "react-bootstrap";
import Zoom from "react-medium-image-zoom";
import { Colors } from "../../../utils/colors";
import { Horizontalchart } from "../../../components/charts/Horizontalchart";
import { DoughnutChart } from "../../../components/charts/DoughnutChart";
import { VerticalChart } from "../../../components/charts/VerticalChart";
import { VerticalChart2 } from "../../../components/charts/VerticalChart2";
import MUIDataTable from "mui-datatables";
import { options2, outcomeTableOptions } from "../../../utils/variables";
import { useState } from "react";
import { useEffect } from "react";
import CocurricularTabs from "./cocurricularComponents/CocurricularTabs";

export default function Cocurricular({ datas }) {

    const mob = useMediaQuery("(max-width:800px)");
    const participationCategoriesArr = ['Sports', 'Science & Technology', 'Fine Arts', 'Music', 'Entertainment', 'Communication']
    const [cocurricularRAWData, setCocurricularRAWData] = useState([])
    const [cocurricularGrading, setCocurricularGrading] = useState({})
    const [outcomeMuiArr, setOutcomeMuiArr] = useState([])
    const outcomeDataArr = ['Concentration', 'Creativity', 'Leadership', 'Presentation', 'Logical Approach', 'Confidence']

    // Categories Data
    const [categoriesGradingLabel, setCategoriesGradingLabel] = useState(['0'])
    const [categoriesGradingValue, setCategoriesGradingValue] = useState([0])

    const categoriesData = {
        labels: categoriesGradingLabel,
        datasets: [
            {
                // label: 'Categories',
                data: categoriesGradingValue,
                backgroundColor: Colors.green700,
                categoryPercentage: 0.4
            }
        ],

    };

    const dummyoutcomMapping = () => {
        const Btn = ({ title }) => <Button variant="outlined" sx={{ borderRadius: 4 }}>{title}</Button>
        setOutcomeMuiArr(outcomeDataArr.map((item, index) => [outcomeDataArr[index], <Btn title={'1'} />, <Btn title={'1'} />, <Btn title={'1'} />, <Btn title={'1'} />, <Btn title={'1'} />, <Btn title={'1'} />]))
    }
    useEffect(() => dummyoutcomMapping(), [])

    useEffect(() => {
        setCocurricularRAWData(datas?.co_data)
        setCocurricularGrading(datas?.grading)
    }, [datas])

    useEffect(() => {
        if (cocurricularGrading) {
            // Map the categories based on participationCategoriesArr order
            const sortedCategories = participationCategoriesArr.map(category => {
                return {
                    label: category,
                    value: parseFloat(cocurricularGrading[category]),
                };
            });

            // Separate the labels and values into separate arrays

            let sortedLabels = sortedCategories.map(category => category.label);
            if (mob) {
                sortedLabels = sortedCategories?.map(category => {
                    const label = category.label;
                    if (label.includes(' ') || label.includes('_')) {
                        return label.split(/[\s_]+/);
                    } else {
                        return label;
                    }
                });
            }

            const sortedValues = sortedCategories.map(category => category.value.toFixed(1));

            // Update the state with the sorted arrays
            setCategoriesGradingLabel(sortedLabels);
            setCategoriesGradingValue(sortedValues);
        }
    }, [cocurricularGrading])


    // Achicvement
    const [achivemnetData, setAchivemnetData] = useState([])

    const [eventCatergory, setEventCatergory] = useState([])

    // Outcomes Data
    const [outComesLabel, setOutComesLabel] = useState(['0'])

    // Participation
    const [outComesValue1, setOutComesValue1] = useState([0])
    // Event Occurred
    const [outComesValue2, setOutComesValue2] = useState([0])
    const [outComesHighValue, setOutComesHighValue] = useState(15)

    const outcomeData = {
        labels: outComesLabel,
        datasets: [
            {
                label: 'Participated',
                data: outComesValue1,
                backgroundColor: Colors.green700,
                borderColor: "rgb(101 215 255 / 10%)",
                barPercentage: 0.8,
                borderWidth: 1,
                categoryPercentage: 0.4
            },
            {
                label: 'Event occured',
                data: outComesValue2,
                backgroundColor: "#43B5C1",
                barPercentage: 0.8,
                borderColor: "rgb(101 215 255 / 10%)",
                borderWidth: 1,
                categoryPercentage: 0.4
            }
        ],
    };

    // Event vs Participation 
    const [eventVsParticipationLabel, setEventVsParticipationLabel] = useState(['Sports', ['Science'], ['& Technology'], 'Fine Arts', 'Music', 'Entertainment', 'Communication'])

    // Participation
    const [eVsPValue1, setEVsPValue1] = useState([0])
    // Event Occurred
    const [eVsPValue2, setEVsPValue2] = useState([0])
    // The high count
    const [EPhighCount, setEPHighCount] = useState(15)

    const eventVsParticipationData = {
        labels: eventVsParticipationLabel,
        datasets: [
            {
                label: 'Participation',
                data: eVsPValue1,
                backgroundColor: Colors.green700,
                borderColor: "rgb(101 215 255 / 10%)",
                borderWidth: 1,
                barPercentage: 0.9,
                categoryPercentage: 0.5,
            },
            {
                label: 'Event Occurred',
                data: eVsPValue2,
                borderColor: "rgb(101 215 255 / 10%)",
                borderWidth: 1,
                backgroundColor: Colors.blue700,
                barPercentage: 0.9,
                categoryPercentage: 0.5,
            }
        ],
    };

    // Events Participation
    const [eventParticipationLabel, setEventParticipationLabel] = useState(['Participated', 'Not-Participated'])
    const [eventParticipationValue, setEventParticipationValue] = useState([])
    const [eventParticipationArv, setEventParticipationArv] = useState(null)

    const data = {
        labels: eventParticipationLabel,
        datasets: [
            {
                label: eventParticipationLabel,
                data: eventParticipationValue,
                backgroundColor: [
                    "#53DCA2",
                    "#43B5C1",
                ],
                // borderColor: [
                //     Colors.green800,
                //     Colors.blue800

                // ],
                borderWidth: 0,
            },
        ],
    };

    // Total Event
    const [totalEvent, setTotalEvent] = useState(0)
    const [partEvent, setPartEvent] = useState(0)

    const [partCatergoryRAWData, setPartCatergoryRAWData] = useState({})

    const [eventListingRAWData, setEventListingRAWData] = useState({})
    const [workshopListingRAWData, setWorkshopListingRAWData] = useState([])


    useEffect(() => {

        if (cocurricularRAWData && Array.isArray(cocurricularRAWData) && cocurricularRAWData.length !== 0) {

            // Achivement
            // Filter cocurricularRAWData based on the condition
            const filteredAchievements = cocurricularRAWData.filter(item => item.rank !== null);

            // Extract desired properties and store in AchivemnetData
            const newAchievementData = filteredAchievements.map(item => ({
                type_of_event: item.type_of_event,
                name: item.name,
                date: item.date,
                description: item?.description || "description",
                category: item.category,
                rank: item.rank,
                images: item.images
            }));
            // Update the state with the new data
            setAchivemnetData(newAchievementData);

            // Chart 2
            // Filter cocurricularRAWData based on the condition
            const partEventRAWData = cocurricularRAWData.filter(item => item.participated == true);
            setTotalEvent(cocurricularRAWData.length)
            setPartEvent(partEventRAWData.length)

            const cocurricularLength = cocurricularRAWData.length;
            const partEventLength = partEventRAWData.length;

            const nonPartValue = cocurricularLength - partEventLength;

            const averagePartEvent = (partEventLength / cocurricularLength) * 100;
            const averageNonPartValue = (nonPartValue / cocurricularLength) * 100;

            setEventParticipationValue([averagePartEvent.toFixed(1), averageNonPartValue.toFixed(1)])

            setEventParticipationArv(`${partEventLength}/${cocurricularLength}`)

            // Participation Catergroy
            const categoriesCount = {};
            const participatedCategoriesCount = {};

            // Initialize category counts
            for (const category of participationCategoriesArr) {
                categoriesCount[category] = 0;
                participatedCategoriesCount[category] = 0;
            }

            // Count categories and participated categories
            cocurricularRAWData.forEach(item => {
                if (participationCategoriesArr.includes(item.category)) {
                    categoriesCount[item.category]++;
                    if (item.participated) {
                        participatedCategoriesCount[item.category]++;
                    }
                }
            });

            // Create an array of category counts
            const categoryCountsArray = participationCategoriesArr.map(category => ({
                [category]: categoriesCount[category]
            }));

            // Create an array of participated category counts
            const participatedCategoryCountsArray = participationCategoriesArr.map(category => ({
                [category]: participatedCategoriesCount[category]
            }));


            // Calculate average participation percentage
            const averageNumFrom100 = {};
            participationCategoriesArr.forEach(category => {
                const total = categoriesCount[category];
                const participated = participatedCategoriesCount[category];
                averageNumFrom100[category] = total === 0 ? 0 : (participated / total) * 100;
            });

            setPartCatergoryRAWData(averageNumFrom100)

            // Part Vs Event
            let markArry2 = ['Sports', 'Science & Technology', 'Fine Arts', 'Music', 'Entertainment', 'Communication'];
            if (mob) {
                markArry2 = ['Sports', [['Science'], ['& Technology']], [['Fine'], ['Arts']], 'Music', 'Entertainment', 'Communication'];
            }
            let markArry = markArry2;
            //             if (mob) {
            //                 markArry = markArry2?.map(item => {
            //                     const subject = item;
            //                     if (subject.includes(' ') || subject.includes('_')) {
            //                         return subject.split(/[\s_]+/);
            //                     } else {
            //                         return subject;
            //                     }
            //                 });
            //             }
            // console.log(markArry)
            setEventVsParticipationLabel(markArry)
            const participatedCounts = participatedCategoryCountsArray.map(categoryObj => {
                const key = Object.keys(categoryObj)[0]; // Get the category key
                return categoryObj[key]; // Get the value associated with the category
            });

            const totalEventCounts = categoryCountsArray.map(categoryObj => {
                const key = Object.keys(categoryObj)[0]; // Get the category key
                return categoryObj[key]; // Get the value associated with the category
            });

            setEVsPValue1(participatedCounts)
            setEVsPValue2(totalEventCounts)
            // Combine the arrays
            const combinedCounts = totalEventCounts.concat(participatedCounts);

            // Find the highest count using Math.max()
            const highestCount = Math.max(...combinedCounts);

            setEPHighCount(highestCount + 3);
            // Outcomes
            // Collect all unique outcome keys
            const outcomeKeys = [...new Set(cocurricularRAWData.flatMap(item => Object.keys(item.out_comes)))];

            // Create the "first" const with keys as-is
            const firstConst = outcomeKeys;

            // Create the "second" const with keys transformed
            const secondConst = outcomeKeys.map(key => {
                const words = key.split('_');
                const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
                return capitalizedWords.join(' ');
            });

            setOutComesLabel(secondConst);

            // Initialize arrays to hold the counts
            const firstArray = new Array(firstConst.length).fill(0);
            const secondArray = new Array(firstConst.length).fill(0);

            // Count occurrences
            cocurricularRAWData.forEach(item => {
                Object.keys(item.out_comes).forEach((key, index) => {
                    if (firstConst.includes(key)) {
                        if (item.out_comes[key]) {
                            firstArray[index]++;
                            if (item.participated) {
                                secondArray[index]++;
                            }
                        }
                    }
                });
            });

            setOutComesValue1(secondArray);
            setOutComesValue2(firstArray);

            const combinedOutComesCounts = secondArray.concat(firstArray);

            // Find the highest count using Math.max()
            const highestCountOutComes = Math.max(...combinedOutComesCounts);

            setOutComesHighValue(highestCountOutComes + 3);

            // Events
            const filteredEvent = cocurricularRAWData.filter(item => item.participated == true);

            // Extract desired properties and store in AchivemnetData
            const newEventData = filteredEvent.map(item => ({
                type_of_event: item.type_of_event,
                name: item.name,
                date: item.date,
                description: item?.description || "description",
                category: item.category,
                rank: item.rank,
                id: item.school_event
            }));

            // Update the state with the new data
            setEventListingRAWData(newEventData);

            const filteredWorkshop = cocurricularRAWData.filter(item => item.is_workshop == true);

            // Extract desired properties and store in AchivemnetData
            const newWorkshopData = filteredWorkshop.map(item => ({
                type_of_event: item.type_of_event,
                name: item.name,
                date: item.date,
                description: item?.description || "description",
                category: item.category,
                rank: item.rank,
                id: item.school_event
            }));

            // Update the state with the new data
            setWorkshopListingRAWData(newWorkshopData);

        }

    }, [cocurricularRAWData])

    const ParticipationData = ({ data }) => {

        const [partTableData, setPartTableData] = useState({})

        useEffect(() => {
            setPartTableData(data)
        }, [data])

        return (
            <Paper sx={{ p: 1, m: mob ? 0 : 0, height: '100%', pt: 3, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px" }}>
                <Stack textAlign={'center'}>
                    <Typography variant="h5" fontWeight={500} fontSize={mob ? "14px" : "18px"}>{"Participation"}</Typography>
                    <Stack px={2}>
                        <Stack justifyContent={'space-between'} p={1} mt={3} direction={'row'}>
                            <Typography variant="h5" fontWeight={"600"} fontSize={mob ? "14px" : "16px"}>{"Categories"}</Typography>
                            <Typography variant="h5" fontSize={mob ? "14px" : "16px"} fontWeight={"600"} >{"Participation"}</Typography>
                        </Stack>
                        <Divider />
                    </Stack>
                    <Stack px={1.5}>
                        {partTableData && typeof partTableData === 'object' && Object.keys(partTableData).length > 0 ? (
                            Object.keys(partTableData).map((category, index) => (
                                <React.Fragment key={index}>
                                    <Stack justifyContent={'space-between'} p={1} px={1.5} py={2.5} direction={'row'}>
                                        <Typography variant="h6" textAlign={"start"} fontWeight={500} fontSize={mob ? "12px" : "17px"}>
                                            {category}
                                        </Typography>
                                        <Typography fontSize={mob ? "12px" : "18px"} fontWeight={600}>
                                            {partTableData[category].toFixed(1)}{"%"}
                                        </Typography>
                                    </Stack>
                                    <Divider />
                                </React.Fragment>
                            ))
                        ) : (
                            <Typography fontWeight={600} fontSize={"18px"}>No Data</Typography>
                        )}
                    </Stack>
                </Stack>
            </Paper>
        )
    }
    const Achievement = ({ rank, sup, eventName, eventDesc, eventType, achievementImgs, category, date, certificate, }) => {

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
        const RankBox = () => {
            return (
                <Stack
                    px={2}
                    pl={0}
                    width={"min-content"}
                    m={"auto"}
                    sx={{ border: mob ? null : "2px solid white", borderRightColor: mob ? null : "gray" }}
                >
                    <Typography fontWeight={mob ? (600) : (600)} fontSize={mob ? ("12px") : ("18px")}>Rank</Typography>
                    <Stack direction={"row"}>
                        <Typography variant="h4" fontSize={mob ? ("24px") : ("36px")}>{rank == null ? ("P") : (rank)}</Typography>
                        <Typography variant="h6" fontSize={mob ? ("12px") : ("18px")}>{sup}</Typography>
                    </Stack>
                </Stack>
            );
        };
        const CImage = ({ src }) => (
            <Zoom>
                <img alt="event" style={{ cursor: "pointer" }} src={src} width={mob ? "60" : "70"} />
            </Zoom>
        );
        return (<>
            {mob ? (
                <Stack gap={1} mb={2} style={{ display: "flex", flexDirection: "row" }}>
                    <Grid item lg={0.5} marginRight={0} marginLeft={0.5} sx={{ border: "2px solid white", borderRightColor: "gray" }}>
                        <RankBox rank={rank} sup={sup} />
                    </Grid>
                    <Stack gap={0} mb={2} style={{ display: "flex", flexDirection: "column" }}>
                        <Stack gap={1} mb={2} style={{ display: "flex", flexDirection: "row" }}>
                            <Grid item md={2} pl={0} style={{ width: mob ? "150px" : null }}>
                                <Typography variant="h6" style={{ fontSize: mob ? "14px" : "16px", lineHeight: 1.5, marginTop: mob ? "0px" : "12px", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", overflow: "hidden", }}>{eventName}</Typography>
                                <Typography variant="caption" style={{ fontSize: mob ? "10px" : "12px", lineHeight: 1.3, marginTop: "2px", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", overflow: "hidden", }}>{eventDesc}</Typography>
                                <Typography variant="h6" style={{ fontSize: mob ? "10px" : "12px", lineHeight: 3 }}>{formatEventType(eventType)}</Typography>
                            </Grid>
                            <Stack style={{ display: "flex", flexDirection: "column" }}>
                                <div style={{ width: "100px", margin: "auto", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", overflow: "hidden", marginTop: "0" }}>
                                    <Typography variant="caption" style={{ width: "100px", margin: "auto", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", overflow: "hidden", }} fontSize={mob ? ("11px") : ("14px")}>Category</Typography>
                                    <Typography variant="h6" style={{ width: "100px", margin: "auto", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", overflow: "hidden", }} fontSize={mob ? ("8px") : ("18px")}>{category}</Typography>
                                </div>
                                <div style={{ width: "100px", margin: "auto", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", overflow: "hidden", marginTop: "0" }}>
                                    <Typography variant="caption" style={{ width: "100px", margin: "auto", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", overflow: "hidden", }} fontSize={mob ? ("11px") : ("14px")}>Date of Event:</Typography>
                                    <Typography variant="h6" style={{ width: "100px", margin: "auto", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", overflow: "hidden", }} fontSize={mob ? ("8px") : ("18px")}>{date}</Typography>
                                </div>
                            </Stack>
                        </Stack>
                        <Stack style={{ display: "flex", flexDirection: "row", alignItems: "flex-end" }}>
                            <div style={{ width: "min-content", marginLeft: "8px" }} >
                                <Typography variant="caption" fontSize={mob ? ("12px") : ("14px")}>Certificate</Typography>
                                <Zoom>
                                    <Image src={certificate} style={{ cursor: "pointer" }} width={mob ? "45px" : "40px"} />
                                </Zoom>
                            </div>
                            <Stack direction={"row"} flexWrap={"wrap"} spacing={1} justifyContent={"center"}>
                                {Object.keys(achievementImgs).map((key) => (
                                    achievementImgs[key] && <CImage key={key} src={`https://cyber-tutor-x-backend.vercel.app/${achievementImgs[key]}` || require("../../../assets/Images/cocurricular/Image 3.png")} />
                                ))}
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>

            ) : (<Grid container spacing={0} gap={3} mb={2}>
                <Grid item lg={0.5} marginRight={0} marginLeft={3}>
                    <RankBox rank={rank} sup={sup} />
                </Grid>
                <Grid item lg={2} pl={0} style={{ width: mob ? "100%" : null }}>
                    <Typography variant="h6" style={{ fontSize: "16px", lineHeight: 1, marginTop: "12px", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", overflow: "hidden", }}>{eventName}</Typography>
                    <Typography variant="caption" style={{ fontSize: "12px", lineHeight: 1, marginTop: "2px", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block", overflow: "hidden", }}>{eventDesc}</Typography>
                    <Typography variant="h6" style={{ fontSize: "12px", lineHeight: 3 }}>{formatEventType(eventType)}</Typography>
                </Grid>
                <Grid item lg={1.5}>
                    <div style={{ width: "175px", margin: "auto" }}>
                        <Typography variant="caption" fontSize={mob ? ("12px") : ("14px")}>Category</Typography>
                        <Typography variant="h6" fontSize={mob ? ("16px") : ("18px")}>{category}</Typography>
                    </div>
                </Grid>
                <Grid item lg={2}>
                    <div style={{ width: "175px", margin: "auto" }}>
                        <Typography variant="caption" fontSize={mob ? ("12px") : ("14px")}>Date of Event:</Typography>
                        <Typography variant="h6" fontSize={mob ? ("16px") : ("16px")}>{date}</Typography>
                    </div>
                </Grid>
                <Grid item lg={1}>
                    <div style={{ width: "min-content", margin: "auto" }}>
                        <Typography variant="caption" fontSize={mob ? ("12px") : ("14px")}>Certificate</Typography>
                        <Zoom>
                            <Image src={certificate} style={{ cursor: "pointer" }} width={"40px"} />
                        </Zoom>
                    </div>
                </Grid>
                <Grid item lg={3.5} spacing={1}>
                    <Stack direction={"row"} flexWrap={"wrap"} spacing={1} justifyContent={"center"}>
                        {Object.keys(achievementImgs).map((key) => (
                            achievementImgs[key] && <CImage key={key} src={`https://cyber-tutor-x-backend.vercel.app/${achievementImgs[key]}` || require("../../../assets/Images/cocurricular/Image 3.png")} />
                        ))}
                    </Stack>
                </Grid>
            </Grid>)}
        </>
        );
    };

    // Define the getOrdinalSuffix function
    function getOrdinalSuffix(number) {
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const remainder = number % 100;

        return (suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]);
    }

    function formatDateToReadable(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        const ordinalSuffix = (day) => {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };
        return `${day}${ordinalSuffix(day)} ${month} ${year}`;

    }


    const smallView = useMediaQuery("(max-width:1550px)");


    return (
        <Container maxWidth="xxl" sx={{ padding: mob ? 0 : 3, mb: mob ? 9 : 2, mt: mob ? 13 : 1, pt: mob ? 0 : 2 }}>
            {cocurricularRAWData && Array.isArray(cocurricularRAWData) && cocurricularRAWData.length !== 0 ? (
                <>
                    <Stack p={mob ? 1 : 2}>
                        <Typography variant="h6" fontSize={mob ? (14) : ("18px")} mb={1}>Why co-curricular activities are important?</Typography>
                        <Typography fontSize={mob ? (12) : (16)}>
                            Co-curricular activities are intended to bring social & intellectual
                            skills, moral, cutural & ethical values, presonality development, and
                            character advancement in students. It includes atheletics, social
                            occasions, Library activities, science lab activities, classroom{" "}
                            {"(study hall)"} activities, creative arts, and so on.
                        </Typography>
                    </Stack>
                    {/* Achievements */}
                    {achivemnetData && achivemnetData?.length !== 0 ? (
                        <Paper
                            sx={{
                                padding: mob ? 1 : 2,
                                m: 0,
                                mt: 1,
                                boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)",
                                borderRadius: mob ? "10px" : "15px",
                                paddingLeft: mob ? 2 : 3,
                            }}
                        >
                            <Typography
                                fontSize={mob ? "14px" : "18px"}
                                fontWeight={mob ? 600 : 600}
                                mb={mob ? 1 : 2}
                            >
                                Achievements
                            </Typography>
                            <Stack>
                                {achivemnetData.sort((a, b) => {
                                    // Convert rank to numbers for comparison (assuming rank is numeric or null)
                                    const rankA = parseInt(a.rank) || 0;
                                    const rankB = parseInt(b.rank) || 0;

                                    // Compare the ranks
                                    return rankA - rankB;
                                }).map((achievement, index) => (
                                    <React.Fragment key={index}>
                                        <Achievement
                                            key={index}
                                            date={formatDateToReadable(achievement?.date)}
                                            category={achievement.category}
                                            eventName={achievement?.name}
                                            eventDesc={achievement?.description}
                                            eventType={achievement?.type_of_event}
                                            rank={achievement?.rank}
                                            sup={achievement.rank ? getOrdinalSuffix(achievement?.rank) : ""}
                                            certificate={require("../../../assets/Images/acheivements/achieve1.png")}
                                            achievementImgs={achievement.images}
                                        />
                                    </React.Fragment>
                                ))}
                            </Stack>
                        </Paper>
                    ) : null}
                    <Grid container spacing={2} mt={mob ? 0 : 0} >
                        <Grid item lg={8} md={12} sm={12} style={{ width: "100%", paddingTop: mob ? "10px" : null }} p={0}>
                            <Horizontalchart data={categoriesData} fonTTSiz={mob ? 10 : 14} max={100} title={'Categories Grading'} />
                        </Grid>
                        <Grid item lg={4} md={12} sm={12} style={{ width: "100%", paddingLeft: "16px", paddingTop: mob ? "10px" : null }} p={0}>
                            {eventParticipationValue && eventParticipationValue.length > 0 ? (
                                // If eventParticipationValue is defined and has length greater than 0
                                eventParticipationArv ? (
                                    // If eventParticipationArv is defined
                                    <DoughnutChart
                                        data={data}
                                        title={'Events Participation'}
                                        centerText={eventParticipationArv}
                                        chatHeight={"100px"}
                                        chatWidth={smallView ? "100%" : "75%"}
                                    />
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
                                            Events Participation
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
                                                No Data
                                            </Typography>
                                        </div>
                                    </Paper>
                                )
                            ) : (
                                // If eventParticipationValue is not defined or has a length of 0
                                null
                            )}

                        </Grid>
                    </Grid>

                    <Grid container mt={mob ? 0 : 0} spacing={2}>
                        <Grid item lg={3} md={12} sm={12} style={{ width: "100%", paddingTop: mob ? "10px" : null }}>
                            <ParticipationData data={partCatergoryRAWData} />
                        </Grid>
                        <Grid item lg={9} md={12} sm={12} style={{ width: "100%", paddingLeft: "16px", paddingTop: mob ? "10px" : null }}>
                            <VerticalChart data={eventVsParticipationData} fontSiziize={mob ? 10 : 12} max={EPhighCount} barWidth={mob ? 10 : 16} stepStick={1} title={'Events vs Participations'} chatHeight={mob ? "100px" : (smallView ? '65%' : null)} />
                        </Grid>
                    </Grid>
                    <Grid item style={{ marginTop: mob ? "10px" : "16px" }} p={0} spacing={2}>
                        <CocurricularTabs p={0} CocurricularTabss={"Event Details"} categoryTabs={eventVsParticipationLabel} data={eventListingRAWData} />
                        <CocurricularTabs CocurricularTabss={"Workshop Details"} categoryTabs={eventVsParticipationLabel} data={workshopListingRAWData} />
                    </Grid>
                    <Grid item lg={12} style={{ marginTop: mob ? "10px" : "16px" }} p={0}>
                        <Paper sx={{ mt: mob ? "10px" : "16px", p: mob ? 0 : 2, boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob ? "10px" : "15px", pt: 0 }}>
                            <VerticalChart2 data={outcomeData} fontSiziize={mob ? 10 : null} boxShadowT={false} chatHeight={mob ? "50px" : null} chatMobWight={mob ? "1000px" : null} barWidth={mob ? 10 : 16} max={outComesHighValue} scale={2} title={'Outcomes Mapping'} stepStick={1} titleDisplay={true} />
                        </Paper>
                    </Grid>
                </>
            ) : (
                <Grid container spacing={2} justifyContent={"center"} alignItems={"center"} mt={5} style={{ height: "74vh" }}>
                    <Typography variant='h5' fontWeight={500} textAlign={"center"} fontSize={mob ? ("24px") : ("18px")} pb={2}>No data available</Typography>
                </Grid>
            )}

        </Container>
    );
}