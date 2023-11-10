import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import JobCard from '../JobCard'
import './index.css'

const userProfileStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    userProfileStatus: userProfileStatusConstants.initial,
    userProfile: '',
    jobsListStatus: userProfileStatusConstants.initial,
    jobsList: [],
    searchInput: '',
    salaryRangeId: '',
    employmentTypeId: [],
  }

  componentDidMount = () => {
    this.getJobProfile()
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const {searchInput, employmentTypeId, salaryRangeId} = this.state
    this.setState({jobsListStatus: userProfileStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypeId}&minimum_package=${salaryRangeId}&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const UpdatedJobsList = data.jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))
      this.setState({
        jobsList: UpdatedJobsList,
        jobsListStatus: userProfileStatusConstants.success,
      })
    } else {
      this.setState({jobsListStatus: userProfileStatusConstants.failure})
    }
  }

  getJobProfile = async () => {
    this.setState({userProfileStatus: userProfileStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const profileResponse = await fetch(apiUrl, options)
    const data = await profileResponse.json()
    if (profileResponse.ok) {
      const profileDetails = {
        profileImageUrl: data.profile_details.profile_image_url,
        name: data.profile_details.name,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        userProfileStatus: userProfileStatusConstants.success,
        userProfile: profileDetails,
      })
    } else {
      this.setState({userProfileStatus: userProfileStatusConstants.failure})
    }
  }

  renderJobsListSuccessView = () => {
    const {jobsList} = this.state
    const shouldShowJobsList = jobsList.length > 0
    return shouldShowJobsList ? (
      <ul className="jobs-list-container">
        {jobsList.map(each => (
          <JobCard jobDetails={each} key={each.id} />
        ))}
      </ul>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-products-img"
          alt="no jobs"
        />
        <h1 className="no-products-heading">No Jobs Found</h1>
        <p className="no-products-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderJobsListFailureView = () => (
    <div className="notfound-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.onClickRetryBtn2}
      >
        Retry
      </button>
    </div>
  )

  onClickRetryBtn2 = () => this.getJobDetails()

  renderJobsListView = () => {
    const {jobsListStatus} = this.state
    switch (jobsListStatus) {
      case userProfileStatusConstants.success:
        return this.renderJobsListSuccessView()
      case userProfileStatusConstants.failure:
        return this.renderJobsListFailureView()
      case userProfileStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderUserProfile = () => {
    const {userProfileStatus} = this.state
    switch (userProfileStatus) {
      case userProfileStatusConstants.success:
        return this.renderUserProfileSuccessView()
      case userProfileStatusConstants.failure:
        return this.renderUserProfileFailureView()
      case userProfileStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onClickRetryBtn1 = () => this.getJobProfile()

  renderUserProfileFailureView = () => (
    <div>
      <button
        className="retry-btn"
        type="button"
        onClick={this.onClickRetryBtn1}
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

  renderUserProfileSuccessView = () => {
    const {userProfile} = this.state
    const {profileImageUrl, name, shortBio} = userProfile
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" />
        <h1 className="name-text">{name}</h1>
        <p className="position">{shortBio}</p>
      </div>
    )
  }

  addId = id => {
    this.setState(
      prevState => ({
        employmentTypeId: [...prevState.employmentTypeId, id],
      }),
      this.getJobDetails,
    )
    // console.log(employmentTypeId)
  }

  removeId = id => {
    const {employmentTypeId} = this.state
    const newId = employmentTypeId.filter(each => each !== id)
    this.setState({employmentTypeId: newId}, this.getJobDetails)
  }

  onChangeEmploymentType = event => {
    const {employmentTypeId} = this.state
    return employmentTypeId.includes(event.target.value)
      ? this.removeId(event.target.value)
      : this.addId(event.target.value)
  }

  onChangeSalaryRanges = event => {
    this.setState({salaryRangeId: event.target.value}, this.getJobDetails)
  }

  renderFilterJobsView = () => (
    <div className="filter-container">
      <h1 className="heading">Type of employment</h1>
      <ul className="uo-container">
        {employmentTypesList.map(eachType => (
          <li className="input-cont" onChange={this.onChangeEmploymentType}>
            <label id={eachType.employmentTypeId} className="fulltime-text">
              <input
                htmlFor={eachType.employmentTypeId}
                value={eachType.employmentTypeId}
                type="checkbox"
              />
              {eachType.label}
            </label>
          </li>
        ))}
      </ul>
      <hr />
      <h1 className="heading">Salary ranges</h1>
      <ul className="uo-container">
        {salaryRangesList.map(eachRange => (
          <li className="input-cont" onChange={this.onChangeSalaryRanges}>
            <label id={eachRange.salaryRangeId}>
              <input
                type="radio"
                htmlFor={eachRange.salaryRangeId}
                value={eachRange.salaryRangeId}
                name="radio"
              />
              {eachRange.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchBtn = () => {
    this.getJobDetails()
  }

  render() {
    const {searchInput} = this.state

    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <div className="job-bg-container">
        <Header />
        <div className="job-container">
          <div className="profile-filter-container">
            {this.renderUserProfile()}
            <hr />
            {this.renderFilterJobsView()}
          </div>
          <div className="job-details-container">
            <div className="search-container">
              <input
                type="search"
                placeholder="Search"
                className="search-element"
                onChange={this.onChangeSearchInput}
                value={searchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-btn"
                onClick={this.onClickSearchBtn}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsListView()}
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
