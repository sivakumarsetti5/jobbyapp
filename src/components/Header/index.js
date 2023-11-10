import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <ul className="nav-container">
      <li>
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo-img"
          />
        </Link>
      </li>

      <li className="home-job-cont">
        <Link to="/" className="home-text">
          Home
        </Link>
        <Link to="/jobs" className="home-text">
          Jobs
        </Link>
      </li>
      <li>
        <button type="button" className="logout-btn" onClick={onClickLogout}>
          Logout
        </button>
      </li>
    </ul>
  )
}
export default withRouter(Header)
