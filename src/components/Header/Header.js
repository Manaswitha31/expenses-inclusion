//import { Link } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './Header.css';

function Header(){
    return(
        <>
            <div className='header'>
                <nav>
                    <a href='#' id='name'>Manaswitha</a>
                    <Link to='/dashboard'><a>Home</a></Link>
                    <Link to='/charts'><a>Charts</a></Link>
                    <Link to='/pdf'><a>History</a></Link>
                </nav>
            </div>
        </>
    );
}
export default Header;