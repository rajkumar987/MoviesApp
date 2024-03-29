import {Component} from 'react'
import Cookies from 'js-cookie'
import ReactSlick from '../ReactSlick'
import FailureView from '../FailureView'

import './index.css'
import Loading from '../Loading'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class TrendingNow extends Component {
  state = {
    trendingMoviesList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getTrendingMovies()
  }

  getTrendingMovies = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const TrendingMoviesApi = 'https://apis.ccbp.in/movies-app/trending-movies'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    try {
      const response = await fetch(TrendingMoviesApi, options)
      if (response.ok === true) {
        const fetchedData = await response.json()
        const updatedData = fetchedData.results.map(eachMovie => ({
          id: eachMovie.id,
          posterPath: eachMovie.poster_path,
          title: eachMovie.title,
        }))
        this.setState({
          trendingMoviesList: updatedData,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({
          apiStatus: apiStatusConstants.failure,
        })
      }
    } catch (error) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onClickRetry = () => {
    this.getOriginalsMovies()
  }

  renderFailureView = () => <FailureView onClickRetry={this.onClickRetry} />

  renderLoadingView = () => <Loading />

  renderSuccessView = () => {
    const {trendingMoviesList} = this.state
    return (
      <>
        <ReactSlick moviesList={trendingMoviesList} />
      </>
    )
  }

  renderOriginalsCarousel = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="trending-container">{this.renderOriginalsCarousel()}</div>
    )
  }
}

export default TrendingNow
