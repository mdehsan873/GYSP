import React from 'react';
import { Box, Grid, Paper, Stack, Typography, useMediaQuery } from '@mui/material'
// import styles from './ProgressBar.module.scss';
import { useState } from "react";
import { useEffect } from "react";
// interface ProgressBarProps {}

// Define the getOrdinalSuffix function
function getOrdinalSuffix(number) {
	const suffixes = ['th', 'st', 'nd', 'rd'];
	const remainder = number % 100;

	return (suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0]);
}

function ProgressBar({ data }) {

	// Participation
	const [rankData, setRankData] = useState({})
	const [progressBar, setProgressBar] = useState(26)

	useEffect(() => {
		setRankData(data)
		// setRankData({
		// 	myRank:1,
		// 	totalStudent:100
		// })
	}, [data])

	const mob = useMediaQuery("(max-width:800px)");
	const smallView = useMediaQuery("(max-width:1550px)");

	useEffect(() => {
		function calculateProgressPercentage(myRank, totalStudent) {
			// Ensure myRank is within bounds
			const adjustedRank = Math.min(Math.max(myRank, 1), totalStudent);

			// Calculate the progress percentage
			const minPercentage = 26;
			const maxPercentage = mob ? 90 : 69; // Adjust the max percentage for mobile view
			let progressPercentage = minPercentage + ((adjustedRank - 1) / (totalStudent - 1)) * (maxPercentage - minPercentage);

			setProgressBar(progressPercentage)
		}

		calculateProgressPercentage(rankData.myRank, rankData.totalStudent);

	}, [rankData, mob]);

	return (
		<Box sx={{ mt: 0, p: mob ? 0 : 2, width: '100%' }} mt={2}>
			<Stack flexDirection={"row"} gap={mob ? "20px" : (smallView ? null : "40px")} alignItems={"center"}>
				<Stack style={{ width: "85px" }}>
					<Typography variant='h5' fontWeight={500} pb={1} fontSize={mob ? "18px" : null}>Rank</Typography>
					<Stack direction={"row"}>
						<Typography variant="h3" fontSize={mob ? "24px" : null}>{rankData?.myRank}</Typography>
						<Typography variant="h5" fontSize={mob ? "16px" : null}>{getOrdinalSuffix(rankData?.myRank)}</Typography>
					</Stack>
				</Stack>
				<Stack style={{ width: "100%" }}>
					<div style={{ backgroundImage: "linear-gradient(to right, #53DCA2, #58DDA485,#5DDEA71A)", width: "100%", height: "40px", borderRadius: "8px" }}></div>
					<img src={require("../../../../../assets/Images/Indicator.png")} style={{ width: "20px", height: "auto", position: "absolute", top: mob ? "135px" : "175px", left: `${parseFloat(progressBar).toFixed(0)}.3%` }} alt="" />
					<Stack direction={"row"} justifyContent={"space-between"}>
						<Typography variant="h6" fontSize={"14px"}>{"1"}</Typography>
						<Typography variant="56" fontSize={"14px"}>{rankData?.totalStudent}</Typography>
					</Stack>
				</Stack>
			</Stack>
		</Box>
	);
}

export default ProgressBar;
