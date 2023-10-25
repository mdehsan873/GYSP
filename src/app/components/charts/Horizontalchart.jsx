import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Paper, Typography,useMediaQuery } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    ChartDataLabels
);

export const Horizontalchart = ({ data, max, title, fonTTSiz = 12 }) => {

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
                td.textContent = `Marks: ${dataPoint.value}`;

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

    const categoriesOptions = {
        indexAxis: 'y',
        elements: {
            bar: {
                borderWidth: 0,
            },
        },
        layout: {
            padding: {
                right: 30
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                enabled: false,
                position: 'nearest',
                external: externalTooltipHandler
            },
            background: {
                color: '#000'
            },
            legend: {
                display: false,
            },
            datalabels: {
                display: true,
                color: "black",
                anchor: "end",
                offset: 0,
                align: "end"
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
        scales: {
            x: {
                min: 0,
                max: max,
                stepSize: 10,
                ticks: {
                    fontColor: "white",
                    font: {
                        size: 12,
                    },
                    stepSize: 10,
                    beginAtZero: true
                },
                grid: {
                    borderDashOffset: 25,
                    borderWidth: 10
                }
            },
            y: {
                ticks: {
                    color: "#000",
                    font: {
                        size: fonTTSiz,
                    },
                    stepSize: 10,
                    beginAtZero: false,
                },
                grid: {
                    display: false
                }
            },
        },
        barThickness: 12,
        borderRadius: 1,
    };
    // Define myPlugin outside of the options object
    const myPlugin = {
        id: 'barPattern',
        beforeDatasetsDraw: (chart, args, pluginOptions) => {
            const { ctx, chartArea: { top, bottom, height }, scales: { x, y } } = chart;

            ctx.save();
            const barWidth = x.width / data.datasets.length; // Calculate bar width based on dataset count
            const xOffset = x.getPixelForValue(0); // Start x-coordinate for drawing

            data.datasets.forEach((dataset, datasetIndex) => {
                const dataPoint = dataset.data[0]; // Assuming you want to draw the pattern at the first data point
                const yCoordinate = y.getPixelForValue(dataPoint); // Convert data value to y-coordinate

                // ctx.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Change color as needed
                // ctx.fillRect(xOffset, yCoordinate - barWidth / 2, height - barWidth, barWidth);

                // xOffset += barWidth;
            });

            ctx.restore();
        }
    };
    const mob = useMediaQuery("(max-width:800px)");
    return (
        <Paper sx={{ p: 2, pr:mob?0:null,pl:mob?1.3:null, my: 0, height: '100%', width: "100%", boxShadow: mob?"0px 1px 3px 0px rgba(0,0,0,0.2)":"0px 1px 6px 0px rgba(0,0,0,0.2)", borderRadius: mob?"10px":"15px" }}>
            <Typography style={{ textAlign: "center", color: "#3D3D3D", fontSize: "18px", fontWeight: "500" }}>{title}</Typography>
            <div style={{ position: 'relative', width: '100%', minHeight: '400px' }}>
                <Bar options={categoriesOptions} data={data} plugins={[myPlugin]} />
            </div>
        </Paper>
    )
}