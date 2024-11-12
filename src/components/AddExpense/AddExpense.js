import React, { useState, useEffect } from 'react';
import './AddExpense.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AddExpense = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [formData, setFormData] = useState({
        amount: '',
        category: '',
        type: '',
        monthYear: selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' }) // Initialize with the current month and year
    });

    const navigate = useNavigate();

    // Update the monthYear when the user selects a date
    useEffect(() => {
        const monthYear = selectedDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        setFormData((prevState) => ({
            ...prevState,
            monthYear: monthYear,
        }));
    }, [selectedDate]);  // This runs every time selectedDate changes

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/api/form', formData);
            alert('Form submitted successfully');
            navigate('/dashboard');
        } catch (error) {
            alert('Error submitting form');
        }
    };

    return (
        <>
            <div className='add-expense'>
                <form className='exp-form' onSubmit={handleSubmit}>
                    <div className='name-header'><h1>Add Expense</h1></div>
                    <div className='name-body'>
                        <label>Amount:</label><br />
                        <input
                            type='number'
                            name='amount'
                            className='input-field'
                            value={formData.amount}
                            required
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        /><br /><br />
                        
                        <label>Category:</label><br />
                        <select
                            name='category'
                            className='input-field'
                            value={formData.category}
                            required
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option>Select</option>
                            <option>Food</option>
                            <option>Parents</option>
                            <option>Travel</option>
                            <option>Investment</option>
                            <option>Rent</option>
                            <option>Salary</option>
                            <option>Parties & Other activities (Gifts)</option>
                            <option>Friends</option>
                        </select><br /><br />
                        
                        <label>Type:</label><br />
                        <select
                            name='type'
                            className='input-field'
                            value={formData.type}
                            required
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option>Select</option>
                            <option>Debit</option>
                            <option>Credit</option>
                        </select>
                        
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="MMMM yyyy"  // Display month and year only
                            showMonthYearPicker  // Only show month and year
                        />

                        <button type='submit' className='submit input-field'>
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddExpense;
