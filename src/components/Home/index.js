import Cookies from 'js-cookie'
import {Redirect, Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

const Home = () => {
  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken === undefined) {
    return <Redirect to="/login" />
  }
  return (
    <div className="bg-container">
      <Header />
      <div className="home-container">
        <h1 className="heading">
          Find The Job That <br />
          Fits Your Life
        </h1>
        <p className="description">
          Millions of people are searching for jobs,salary <br />
          information,company reviews.Find the job that fits your
          <br /> abilities and potential.
        </p>
        <Link to="/jobs">
          <button type="button" className="jobs-btn">
            Find Jobs
          </button>
        </Link>
      </div>
    </div>
  )
}
export default Home
