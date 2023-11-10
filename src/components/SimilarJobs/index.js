import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {IoBagAddOutline} from 'react-icons/io5'

import './index.css'

const SimilarJobs = props => {
  const {similarJobDetails} = props
  // console.log(similarJobDetails)

  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobDetails

  return (
    <li className="similar-job-card-container">
      <div className="company-header">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="logo-image"
        />
        <div>
          <h1 className="title-text">{title}</h1>
          <div className="rating-cont">
            <AiFillStar size={20} color="#fbbf24" />
            <p className="rating-text">{rating}</p>
          </div>
        </div>
      </div>
      <hr />
      <h1 className="description-text">Description</h1>
      <p className="description">{jobDescription}</p>
      <div className="location-package-container">
        <div className="location-container">
          <div className="rating-cont">
            <MdLocationOn />
            <p className="rating-text">{location}</p>
          </div>
          <div className="rating-cont">
            <IoBagAddOutline />
            <p className="rating-text">{employmentType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}
export default SimilarJobs
