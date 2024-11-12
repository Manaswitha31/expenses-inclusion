import './Home.css';

function Home(){
    return(
        <>
        <div className='header'>
            <h1>Expenses Computation</h1>
        </div>
        <div className='name-box'>
            <div className='name-header'></div>
            <div className='name-body'>
                <label>Name:</label><br></br>
                <input type='text' className='input-field' required></input>
                <label>Email id:</label><br></br>
                <input type='text' className='input-field' required></input>
                <label>Contact:</label><br></br>
                <input type='number' className='input-field' required></input>
                <input type='submit' className='submit input-field'></input>
            </div>
        </div>
        </>
    );
}

export default Home;