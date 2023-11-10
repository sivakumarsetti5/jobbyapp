import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {IoBagAddOutline} from 'react-icons/io5'
import {FiExternalLink} from 'react-icons/fi'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarJobs from '../SimilarJobs'
import './index.css'

const jobItemStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetailsRoute extends Component {
  state = {
    jobItemStatus: jobItemStatusConstants.initial,
    jobDetails: '',
    skills: [],
    lifeAtCompany: '',
    similarJobs: [],
  }

  componentDidMount = () => {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({jobItemStatus: jobItemStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    // console.log(data)
    if (response.ok) {
      const jobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }
      // console.log(jobDetails)
      const lifeAtCompany = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }
      // console.log(lifeAtCompany)
      const skills = data.job_details.skills.map(each => ({
        name: each.name,
        imageUrl: each.image_url,
      }))
      // console.log(skills)
      const similarJobs = data.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        rating: each.rating,
        title: each.title,
      }))
      // console.log(similarJobs)

      this.setState({
        jobItemStatus: jobItemStatusConstants.success,
        jobDetails,
        lifeAtCompany,
        skills,
        similarJobs,
      })
    } else {
      this.setState({jobItemStatus: jobItemStatusConstants.failure})
    }
  }

  renderJobItemSuccessView = () => {
    const {jobDetails, lifeAtCompany, skills, similarJobs} = this.state
    // console.log(similarJobs)
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="job-item-details-container">
        <div className="job-card-container job-item">
          <div className="company-header">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
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
            <p className="description-text">{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="description-visit-container">
            <h1 className="description-text">Description</h1>
            <div className="visit-cont">
              <a href={jobDetails.companyWebsiteUrl} className="visit-text">
                Visit
              </a>
              <FiExternalLink />
            </div>
          </div>

          <p className="description">{jobDescription}</p>
          <h1 className="skills-text">Skills</h1>
          <ul className="skills-container">
            {skills.map(each => (
              <li className="skill-container">
                <img src={each.imageUrl} alt={each.name} />
                <p className="skill-name">{each.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="skills-text">Life at Company</h1>
          <div className="life-container">
            <p className="description">{description}</p>
            <img src={imageUrl} className="life-image" alt="life at company" />
          </div>
        </div>
        <h1 className="skills-text">Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {similarJobs.map(each => (
            <SimilarJobs similarJobDetails={each} key={each.id} />
          ))}
        </ul>
      </div>
    )
  }

  onClickRetryBtn2 = () => this.getJobItemDetails()

  renderJobItemFailureView = () => (
    <div className="notfound-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.onClickRetryBtn2}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemView = () => {
    const {jobItemStatus} = this.state

    switch (jobItemStatus) {
      case jobItemStatusConstants.success:
        return this.renderJobItemSuccessView()
      case jobItemStatusConstants.failure:
        return this.renderJobItemFailureView()
      case jobItemStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <div className="jobItems-container">
        <Header />
        <div>{this.renderJobItemView()}</div>
      </div>
    )
  }
}
export default JobItemDetailsRoute
