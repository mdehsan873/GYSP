import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Paper, Stack, Typography, useMediaQuery } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);

export const DoughnutChart = ({ data, max, title, titleDisplay = false, centerText = '', chatHeight = "100px", chatWidth }) => {

    const getOrCreateTooltip = (chart) => {
        let tooltipEl = chart.canvas.parentNode.querySelector('div');

        if (!tooltipEl) {
            tooltipEl = document.createElement('div');
            tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
            tooltipEl.style.borderRadius = '3px';
            tooltipEl.style.color = 'white';
            tooltipEl.style.opacity = 1;
            tooltipEl.style.pointerEvents = 'none';
            tooltipEl.style.position = 'absolute';
            tooltipEl.style.transform = 'translate(-50%, 0)';
            tooltipEl.style.transition = 'all .1s ease';

            const table = document.createElement('table');
            table.style.margin = '0px';

            tooltipEl.appendChild(table);
            chart.canvas.parentNode.appendChild(tooltipEl);
        }

        return tooltipEl;
    };

    const externalTooltipHandler = (context) => {
        // Tooltip Element
        const { chart, tooltip } = context;
        const tooltipEl = getOrCreateTooltip(chart);

        // Hide if no tooltip
        if (tooltip.opacity === 0) {
            tooltipEl.style.opacity = 0;
            return;
        }

        // Set Text
        if (tooltip.body) {
            const titleLines = tooltip.title || [];
            const bodyLines = tooltip.body.map(b => b.lines);

            const tableHead = document.createElement('thead');

            titleLines.forEach(title2 => {
                const tr = document.createElement('tr');
                tr.style.borderWidth = 0;
                tr.style.color = "#000";

                const th = document.createElement('th');
                th.style.borderWidth = 0;
                const text = document.createTextNode(title);
                // console.log(titleLines)
                // const text = document.createTextNode("Marks");

                th.appendChild(text);
                tr.appendChild(th);
                tableHead.appendChild(tr);
            });

            const tableBody = document.createElement('tbody');
            bodyLines.forEach((body, i) => {
                const colors = tooltip.labelColors[i];

                const tr = document.createElement('tr');
                tr.style.backgroundColor = 'inherit';
                tr.style.borderWidth = 0;
                tr.style.color = colors.backgroundColor;

                const td = document.createElement('td');
                td.style.borderWidth = 0;

                // Convert the body to a string
                const text = body.toString();

                // Extract the number from the text
                const matches = text.match(/(\d+(\.\d+)?)$/); // Matches a number at the end of the string
                if (matches) {
                    const number = parseFloat(matches[1]);
                    // Check if the number is 100.23
                    if (number === 100.23) {
                        // Format the text as [subject_name]: Absent
                        const subjectName = titleLines[i] || 'Marks';
                        // console.log()
                        td.textContent = `${subjectName}: Absent`;
                    } else {
                        // Display the original value
                        td.textContent = text;
                    }
                } else {
                    // No match found, display the original text
                    td.textContent = text;
                }

                // td.appendChild(span);
                tr.appendChild(td);
                tableBody.appendChild(tr);
            });

            const tableRoot = tooltipEl.querySelector('table');

            // Remove old children
            while (tableRoot.firstChild) {
                tableRoot.firstChild.remove();
            }

            // Add new children
            tableRoot.appendChild(tableHead);
            tableRoot.appendChild(tableBody);
        }

        // Combine data from all datasets and display in the tooltip
        if (tooltip.dataPoints) {

            const dataIndex = tooltip.dataPoints[0].dataIndex;
            // Display the combined data in the tooltip
            const tableBody2 = tooltipEl.querySelector('tbody');
            // Clear the existing content of tableBody
            const firstTr = tableBody2.querySelector('tr:nth-child(1)');

            // Hide the first tr element
            if (firstTr) {
                firstTr.style.display = 'none';
            }
            while (tableBody2.firstChild) {
                tableBody2.firstChild.remove();
            }
            // Create an array to store the combined data from all datasets
            const combinedData = [];

            // Iterate through all datasets in the chart configuration
            chart.config.data.datasets.forEach((dataset, index) => {
                const datasetLabel = chart.config.data.labels[dataIndex];
                let value = dataset.data[dataIndex];
                if (dataset.data[dataIndex] == "100.23") {
                    value = "Absent";
                }
                // const backgroundColor = dataset.backgroundColor[dataIndex];
                let backgroundColor = "#000";
                if (dataset.backgroundColor && Array.isArray(dataset.backgroundColor)) {
                    backgroundColor = dataset.backgroundColor[dataIndex];
                } else {
                    backgroundColor = dataset.backgroundColor;
                }

                const borderColor = dataset.borderColor;

                // Create an object for each dataset with label, value, and colors
                combinedData.push({
                    label: datasetLabel,
                    value,
                    backgroundColor,
                    borderColor,
                });
            });

            // Display the combined data in the tooltip
            const tableBody = tooltipEl.querySelector('tbody');
            combinedData.forEach((dataPoint, index) => {
                const tr = document.createElement('tr');
                tr.style.backgroundColor = 'inherit';
                tr.style.borderWidth = 0;
                tr.style.color = dataPoint.backgroundColor || "#000";
                // console.log(dataPoint.label,dataPoint.backgroundColor)

                const td = document.createElement('td');
                td.style.borderWidth = 0;

                // Display the dataset label and value
                let llla = dataPoint.label;
                if (dataPoint?.label == "Subjects") {
                    llla = "Marks";
                }
                td.textContent = `${llla}: ${dataPoint.value}`;

                // td.appendChild(span);
                tr.appendChild(td);
                tableBody.appendChild(tr);
            });
        }

        const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

        // Display, position, and set styles for font
        tooltipEl.style.opacity = 1;
        tooltipEl.style.background = "#fff";
        tooltipEl.style.boxShadow = "0px 1px 6px 0px rgba(0,0,0,0.2)";
        tooltipEl.style.left = positionX + tooltip.caretX + 'px';
        tooltipEl.style.top = positionY + tooltip.caretY + 'px';
        tooltipEl.style.font = tooltip.options.bodyFont.string;
        tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
    };

    const mob = useMediaQuery("(max-width:600px)");
    const options = {
        cutout: '80%',
        responsive: true,
        maintainAspectRatio: true,
        // width: "400",
        // height: "100px",
        plugins: {
            tooltip: {
                enabled: false,
                position: 'nearest',
                external: externalTooltipHandler
            },
            legend: {
                position: 'bottom',
                display: titleDisplay,
                labels: {
                    padding: 15,
                },
            },
            datalabels: {
                display: false,
            },
            title: {
                display: false,
                text: title,
                font: {
                    size: 18,
                    color: "#000",
                    family: 'Arial'
                }
            },
        },

    };

    const plugins = [{
        beforeDraw: function (chart) {
            // console.log(chart);
            var width = chart.width,
                height = chart.height,
                ctx = chart.ctx;
            ctx.restore();
            var fontSize = (height / 150).toFixed(2);
            ctx.font = fontSize + "em sans-serif";
            ctx.textBaseline = "top";
            var text = centerText,
                textX = Math.round((width - ctx.measureText(text).width) / 2),
                textY = height / 2.2;
            ctx.fillText(text, textX, textY);
            ctx.save();
        }
    }]
    return (
        <Paper sx={{ padding: 2, my: 0, height: '100%', boxShadow: mob?"0px 1px 3px 0px rgba(0,0,0,0.2)":"0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob?"10px":"15px" }}>
            {/* <Paper sx={{ padding: 2, my: 0, height: '100%', boxShadow: mob?"0px 1px 3px 0px rgba(0,0,0,0.2)":"0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob?"10px":"15px" }}> */}
            <Typography style={{ textAlign: "center", color: "#3D3D3D", fontSize: mob ? "14px" : "18px", fontWeight: "500", marginBottom: "16px", width: "100%" }}>{title}</Typography>
            <div style={{ display: mob ? "flex" : "block", alignItems: mob ? "center" : null }}>
                <div style={{ width: chatWidth, height: null, display: "flex", flexDirection: "column", alignItems: "center", padding: mob ? "5px 5px" : "10px 46px", margin: "auto" }}>
                    <Doughnut data={data} options={options} plugins={plugins} width={"100%"} height={chatHeight} />
                </div>
                <div style={{ marginBottom: mob ? "40px" : null }}>
                    <Stack textAlign={'center'} sx={{ display: "flex", gap: mob ? "20px" : "40px", flexDirection: "row", justifyContent: "flex-start", width: mob ? "90%" : "60%", margin: "35px auto 10px" }}>
                        <Stack sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", width: mob ? "130px" : "125px" }}>
                            <div style={{ width: "12px", height: "12px", background: data.datasets[0].backgroundColor[0] || "#53DCA2" }}></div>
                            <Typography fontSize={mob ? "12px" : null} style={{ color: "#000" }}>{data.labels[0]}</Typography>
                        </Stack>
                        <Typography fontSize={mob ? "12px" : null} style={{ color: "#000" }}> {data.datasets[0].data[0]}%</Typography>
                    </Stack>
                    <Stack textAlign={'center'} marginTop={1} sx={{ display: "flex", gap: mob ? "25px" : "40px", flexDirection: "row", justifyContent: "flex-start", width: mob ? "90%" : "60%", margin: "15px auto 10px" }}>
                        <Stack sx={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px", width: mob ? "130px" : "125px" }}>
                            <div style={{ width: "12px", height: "12px", background: data.datasets[0].backgroundColor[1] || "#43B5C1" }}></div>
                            <Typography fontSize={mob ? "12px" : null} style={{ color: "#000" }}>{data.labels[1]}</Typography>
                        </Stack>
                        <Typography fontSize={mob ? "12px" : null} style={{ color: "#000" }}> {data.datasets[0].data[1]}%</Typography>
                    </Stack>
                </div>
            </div>
        </Paper>
    )
}
