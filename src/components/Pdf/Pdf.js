import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './Pdf.css';
import Header from '../Header/Header';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function Pdf() {
    const [expenses, setExpenses] = useState([]);
    const [categoryTotals, setCategoryTotals] = useState({});
    const [categoryChartData, setCategoryChartData] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [chartTitle, setChartTitle] = useState('Expenses Overview');
    const chartRef = useRef(null);

    // Fetch expenses from the backend for a specific month and year
    const fetchExpenses = async (monthYear) => {
        try {
            const response = await axios.get('http://localhost:5000/api/expenses', {
                params: { monthYear }
            });
            setExpenses(response.data);
        } catch (error) {
            console.log("Error fetching expenses:", error);
        }
    };

    // Process and aggregate data by category for the pie chart and table
    const processCategoryData = () => {
        const totals = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});
        
        setCategoryTotals(totals);

        setCategoryChartData({
            labels: Object.keys(totals),
            datasets: [
                {
                    data: Object.values(totals),
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40', '#FFCD56', '#A3A2D1', '#84FF63',
                    ],
                    borderWidth: 1,
                },
            ],
        });
    };

    // Update the title and fetch data based on selected date
    useEffect(() => {
        const monthYear = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        setChartTitle(`${monthYear}`);
        fetchExpenses(monthYear);
    }, [selectedDate]);

    // Re-process data when expenses data is updated
    useEffect(() => {
        if (expenses.length > 0) processCategoryData();
    }, [expenses]);

    // Function to generate the PDF
    const generatePDF = async () => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        let yPosition = 10; // Initial vertical position on the page
    
        try {
            // Capture and add the header
            const header = document.querySelector('.pdf-header');
            const headerCanvas = await html2canvas(header, { scale: 2 });
            const headerImgData = headerCanvas.toDataURL('image/png');
            const headerHeight = (headerCanvas.height * (pageWidth - 20)) / headerCanvas.width;
            
            pdf.addImage(headerImgData, 'PNG', 10, yPosition, pageWidth - 20, headerHeight);
            yPosition += headerHeight + 10; // Update Y position
    
            // Capture and add the expenses table
            const table = document.querySelector('.expenses-table');
            const tableCanvas = await html2canvas(table, { scale: 2 });
            const tableImgData = tableCanvas.toDataURL('image/png');
            const tableHeight = (tableCanvas.height * (pageWidth - 20)) / tableCanvas.width;
    
            if (yPosition + tableHeight > pageHeight) {
                pdf.addPage();
                yPosition = 10;
            }
            pdf.addImage(tableImgData, 'PNG', 10, yPosition, pageWidth - 20, tableHeight);
            yPosition += tableHeight + 10;
    
            // Capture and add the category totals table
            const categoryTotalsTable = document.querySelector('.category-totals-table');
            const categoryTotalsCanvas = await html2canvas(categoryTotalsTable, { scale: 2 });
            const categoryTotalsImgData = categoryTotalsCanvas.toDataURL('image/png');
            const categoryTotalsHeight = (categoryTotalsCanvas.height * (pageWidth - 20)) / categoryTotalsCanvas.width;
    
            if (yPosition + categoryTotalsHeight > pageHeight) {
                pdf.addPage();
                yPosition = 10;
            }
            pdf.addImage(categoryTotalsImgData, 'PNG', 10, yPosition, pageWidth - 20, categoryTotalsHeight);
            yPosition += categoryTotalsHeight + 10;
    
            // Capture and add the pie chart
            const chart = document.querySelector('.pie-chart-container');
            const chartCanvas = await html2canvas(chart, { scale: 2 });
            const chartImgData = chartCanvas.toDataURL('image/png');
            const chartHeight = (chartCanvas.height * (pageWidth - 20)) / chartCanvas.width;
    
            if (yPosition + chartHeight > pageHeight) {
                pdf.addPage();
                yPosition = 10;
            }
            pdf.addImage(chartImgData, 'PNG', 10, yPosition, pageWidth - 20, chartHeight);
    
            // Save the PDF
            pdf.save(`${chartTitle}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
        }
    };
    
    
    
    

    return (
        <>
        <Header />
        <div className="pdf-content" ref={chartRef}>
            <div className='pdf-header'>
                <div className='flex-items'><h4>Manaswitha Saripalli</h4></div>
                <div className='flex-items'><h4>{chartTitle}</h4></div>
            </div>
            
            
            {/* Expenses Table */}
            <div className="expenses-table">
            <h2 style={{textAlign: 'center'}}>Expenses of {chartTitle}</h2>
            <center><div className="date-picker-container">
                <DatePicker className='date-picker'
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="MMMM yyyy"
                    showMonthYearPicker
                />
            </div></center>
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Category</th>
                            <th>Amount (Rs.)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {expenses.map((expense, index) => (
                            <tr key={index}>
                                <td>{new Date(expense.date).toLocaleDateString()}</td>
                                <td>{expense.category}</td>
                                <td>{expense.amount.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Category Totals Table */}
            <div className="category-totals-table">
                <h3 style={{marginTop:'5%',textAlign:'center'}}>Category Totals</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Total (Rs.)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(categoryTotals).map(([category, total], index) => (
                            <tr key={index}>
                                <td>{category}</td>
                                <td>{total.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Pie Chart */}
        <div className="pie-chart-container">
            {Object.keys(categoryChartData).length > 0 ? (
                <Pie 
                    data={categoryChartData} 
                    options={{
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: {
                                    color: '#333',
                                    font: { size: 14 }
                                },
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const label = context.label || '';
                                        const value = context.raw || 0;
                                        return `${label}: Rs.${value.toFixed(2)}`;
                                    }
                                }
                            },
                            title: {
                                display: true,
                                text: chartTitle,
                                font: { size: 18 },
                                color: '#333'
                            },
                        }
                    }} 
                />
            ) : (
                <p>Loading data...</p>
            )}
        </div>

        {/* PDF generation button */}
        <button onClick={generatePDF} className="pdf-button">Download PDF</button>
        </>
    );
}

export default Pdf;
