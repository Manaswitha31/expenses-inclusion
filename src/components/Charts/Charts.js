import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './Charts.css';
import Header from '../Header/Header';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function Charts() {
    const [expenses, setExpenses] = useState([]);
    const [categoryChartData, setCategoryChartData] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedMonthYear, setSelectedMonthYear] = useState('');
    const [chartTitle, setChartTitle] = useState('Expenses Overview');

    // Fetch expenses from the backend for a specific month and year
    const fetchExpenses = async (monthYear) => {
        try {
            const response = await axios.get('http://localhost:5000/api/expenses', {
                params: { monthYear } // Send the month and year as string to the backend
            });
            setExpenses(response.data);
        } catch (error) {
            console.log("Error fetching expenses:", error);
        }
    };


    // Process and aggregate data by category for the pie chart
    const processCategoryData = () => {
        const categoryTotals = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        setCategoryChartData({
            labels: Object.keys(categoryTotals),
            datasets: [
                {
                    data: Object.values(categoryTotals),
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
        setSelectedMonthYear(monthYear);
        setChartTitle(`Expenses for ${monthYear}`);
        fetchExpenses(monthYear);  // Fetch expenses by selected "Month Year"
    }, [selectedDate]);

    // Re-process data when expenses data is updated
    useEffect(() => {
        if (expenses.length > 0) processCategoryData();
    }, [expenses]);

    return (
        <>
        <Header />
        <div className="pie-chart-container">
            <h2>{chartTitle}</h2>
            <div className="date-picker-container">
                <label>Select Month and Year: </label><br></br><br></br>
                <DatePicker className='date-picker'
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="MMMM yyyy" // Display only month and year
                    showMonthYearPicker // Only allow selection of month and year
                />
            </div>
            {Object.keys(categoryChartData).length > 0 ? (
                <Pie className='pie1'
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
                <h1>Loading data...</h1>
            )}
        </div>
        </>
    );
}

export default Charts;
