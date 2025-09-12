import { Link } from "react-router-dom"

function Homepage(){
    return <nav>
        <Link to={'/firstpage'}>First Page</Link>
        <Link to={'/secondpage'}>Second Page</Link>
    </nav>
}

export default Homepage;