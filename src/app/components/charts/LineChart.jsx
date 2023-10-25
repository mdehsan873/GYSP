import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,   
    LineElement,
    Title,
    Tooltip,
    Legend,
    registerables as registerablesJS
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { Paper, Typography, useMediaQuery } from '@mui/material';

ChartJS.register(...registerablesJS);

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


export const LineChart = ({ data, max, title, chatHight = null, chatWeight = null, fontSiziize = 12, barWidth =10 }) => {

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

            titleLines.forEach(title => {
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

                // const span = document.createElement('span');
                // span.style.background = colors.backgroundColor;
                // span.style.borderColor = colors.borderColor;
                // span.style.borderWidth = '2px';
                // span.style.marginRight = '10px';
                // span.style.height = '10px';
                // span.style.width = '10px';
                // span.style.display = 'inline-block';

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
                    if (number == 100.23 || number == "100.23") {
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
                const datasetLabel = dataset.label;
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
                // if (index == 0) {
                //     return "";
                // }
                // const span = document.createElement('span');
                // span.style.background = dataPoint.backgroundColor;
                // span.style.borderColor = dataPoint.borderColor;
                // span.style.borderWidth = '2px';
                // span.style.marginRight = '10px';
                // span.style.height = '10px';
                // span.style.width = '10px';
                // span.style.display = 'inline-block';

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
            const firstTr2 = tableBody.querySelector('tr:nth-child(3)');

            // Hide the first tr element
            if (firstTr2) {
                firstTr2.style.display = 'none';
            }
            while (tableBody.firstTr2) {
                tableBody.firstTr2.remove();
            }
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

    const mob = useMediaQuery("(max-width:800px)");
    const options = {
        responsive: true,
        layout: {
            padding: {
                top: 0
            }
        },
        plugins: {
            tooltip: {
                enabled: false,
                position: 'nearest',
                external: externalTooltipHandler
            },
            datalabels: {
                display: true,
                color: "#000",
                anchor: "end",
                offset: -5,
                align: "end",
                formatter: (value, context) => {

                    // Hide the data label for a specific index (e.g., hide index 1)
                    if (value == "100.23" || value == 100.23)  {
                        // return "Absent";
                        return "AB";
                    }

                    // Display the data label for other indices
                    return value;
                },
            },
            legend: {
                position: "top",
                align: "end",
                labels: {
                    padding: mob ? 8 : 10,
                    layout: 'ver',
                    // padding: {
                    //     left: 50,
                    //     right: 130,
                    //     top: 0,
                    //     bottom: 0
                    // },
                    boxWidth: mob ? 10 : 20, // Adjust the width of the colored box
                    boxHeight: 2, // Adjust the width of the colored box
                    // usePointStyle: true, // Use a circular colored box
                },

                width: mob ? 10 : 150, // Adjust the total width of the legend
                filter: (legendItem, chartData) => {
                    return legendItem.datasetIndex !== chartData.datasets.findIndex(dataset => dataset.type === 'bar');
                },
            },
            title: {
                display: false,
                text: title,
            },
        },
        scales: {
            x: {
                min: 0,
                max: 100,
                stepSize: 2,
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: fontSiziize,
                    },
                },
            },
            y: {
                min: 0,
                max: 100,
                stepSize: 10,
                ticks: {
                    font: {
                        size: 10,
                    },
                },
            },
        },
        barThickness: barWidth,
    };

    const plugin = {
        beforeInit(chart) {
            // Get a reference to the original fit function
            const originalFit = chart.legend.fit;

            // Override the fit function
            chart.legend.fit = function fit() {
                // Call the original function and bind scope in order to use `this` correctly inside it
                originalFit.bind(chart.legend)();
                // Change the height as suggested in other answers
                this.height += 15;
            }
        }
    }

    return (
        <Paper sx={{ padding: 1.5, paddingBottom: mob ? 2 : 4, my: 0, height: '100%', boxShadow: mob ? "0px 1px 3px 0px rgba(0,0,0,0.2)" : "0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob?"10px":"15px" }}>
            <Typography style={{ textAlign: "center", color: "#3D3D3D", fontSize: "18px", fontWeight: "500", marginBottom: "0px" }}>{title}</Typography>
            <Chart data={data} type='bar' options={options} plugins={[plugin]} height={mob ? "100px" : null} width={'100%'} />
        </Paper>
    )
}