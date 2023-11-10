import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const JobCard = props => {
  const {jobDetails} = props
  // console.log(jobDetails)

  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobDetails
  return (
    <Link to={`/jobs/${id}`} className="link-cont">
      <li className="job-card-container">
        <div className="company-header">
          <img src={companyLogoUrl} alt="company logo" className="logo-image" />
          <div>
            <h1 className="title-text">{title}</h1>
            <div className="rating-cont">
              <AiFillStar size={20} color="#fbbf24" />
              <p className="rating-text">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-package-container">
          <div className="location-container">
            <div className="rating-cont">
              <MdLocationOn />
              <p className="rating-text">{location}</p>
            </div>
            <div className="rating-cont">
              <MdLocationOn />
              <p className="rating-text">{employmentType}</p>
            </div>
          </div>
          <h1 className="description-text">{packagePerAnnum}</h1>
        </div>
        <hr />
        <h1 className="description-text">Description</h1>
        <p className="description">{jobDescription}</p>
      </li>
    </Link>
  )
}
export default JobCard
