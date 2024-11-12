import './Dashboard.css';
import '../Header/Header';
import Header from '../Header/Header';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function Dashboard() {
    const [expenses, setExpenses] = useState([]);
    const [balance, setBalance] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedMonthYear, setSelectedMonthYear] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    // Function to fetch balance
    const fetchBalance = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/balance');
            setBalance(response.data.balance);
        } catch (error) {
            console.error("Error fetching balance:", error);
        }
    };

    // Function to fetch expenses
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

    useEffect(() => {
        const monthYear = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' }); // Get "Month Year"
        setSelectedMonthYear(monthYear); // Save the formatted "Month Year"
        fetchExpenses(monthYear); // Fetch expenses by formatted "Month Year"
        fetchBalance(); // Fetch balance after expenses
    }, [selectedDate]);

    // Filtered expenses based on type and category
    const filteredExpenses = expenses.filter(exp => {
        return (
            (typeFilter ? exp.type === typeFilter : true) && 
            (categoryFilter ? exp.category === categoryFilter : true)
        );
    });

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/expenses/${id}`);
            setExpenses(expenses.filter(exp => exp._id !== id));
            alert('Expense deleted successfully');
            fetchBalance(); // Update balance after deletion
        } catch (error) {
            console.error('Error deleting expense:', error);
            alert('Failed to delete expense');
        }
    };

    const handleDeleteAll = async () => {
        const confirmation = window.confirm('Are you sure you want to delete all expenses?');
        if (confirmation) {
            try {
                await axios.delete('http://localhost:5000/api/expenses/clear');
                setExpenses([]); // Clear the expenses from the frontend state
                alert('All expenses cleared successfully');
            } catch (error) {
                console.error('Error clearing all expenses:', error);
                alert('Failed to clear all expenses');
            }
        }
    };

    return (
        <>
            <Header />
            <div className='expense-buttons'>
                <div className='flex-items'>
                    <Link to="/add-expense">
                        <input type='submit' className='buttons' value={"+ Add Expense"} />
                    </Link>
                </div>
                <div className='flex-items'>
                    <button type='submit' className='buttons btn2' onClick={handleDeleteAll}>+ Clear Expenses</button>
                </div>
                {/* <div className='flex-items'>
                    <input type='submit' className='buttons' value={"+ Save Expense"} />
                </div> */}
            </div>
            <hr id='hr1' />
            <div className='expense-header'>
                <div className='flex-items'>
                    <h2>Balance: {balance.toFixed(2)}</h2>
                </div>
                <div className='flex-items'>
                    <h2>Month: <br></br>
                        <DatePicker className='date-picker'
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="MMMM yyyy" // This formats the date as "Month Year" (e.g., January 2024)
                            showMonthYearPicker // Only show month and year
                        />
                    </h2>
                </div>
            </div>
            <hr id='hr2' />
            <div className='exp-table'>
                <table>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Amount</th>
                            <th>Category <br></br> <br></br>
                            <select value={categoryFilter} className='filter' onChange={(e) => setCategoryFilter(e.target.value)}>
                                    <option value="">All Categories</option>
                                    <option value="Food">Food</option>
                                    <option value="Parents">Parents</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Investment">Investment</option>
                                    <option value="Rent">Rent</option>
                                    <option value="Salary">Salary</option>
                                    <option value="Parties & Other activities (Gifts)">Parties & Other activities (Gifts)</option>
                                    <option value="Friends">Friends</option>
                                </select>
                            </th>
                            <th>Date & Time</th>
                            <th>Month & Year</th>
                            <th> Type <br></br> <br></br>
                                <select value={typeFilter} className='filter' onChange={(e) => setTypeFilter(e.target.value)}>
                                    <option value="">All</option>
                                    <option value="Debit">Debit</option>
                                    <option value="Credit">Credit</option>
                                </select>
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map((exp, index) => (
                            <tr key={exp._id}>
                                <td>{index + 1}</td>
                                <td>{exp.amount}</td>
                                <td>{exp.category}</td>
                                <td>{exp.date}</td>
                                <td>{exp.monthYear}</td>
                                <td style={{ color: exp.type === 'Debit' ? 'red' : 'green' }}>{exp.type}</td>
                                <td>
                                    <button onClick={() => handleDelete(exp._id)} className='delete-btn'>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default Dashboard;
