import './App.css'
import { Component } from 'react'
import { Spin, Alert, Input, Pagination, Tabs } from 'antd'
import { debounce } from 'lodash'

import MoviesList from '../MoviesList/MoviesList'
import TMDBService from '../../services/services'
import { ServiceProvider } from '../service-context'

export default class App extends Component {
  tmdbService = new TMDBService()
  state = {
    searchValue: '',
    currentPage: 1,
    totalResults: 0,
    movies: [],
    ratedMovies: [],
    ratedCount: 0,
    isLoading: false,
    error: false,
    message: '',
  }

  getRatingById = (id) => {
    const { ratedMovies } = this.state
    if (ratedMovies.length === 0) {
      return 0
    }

    const index = ratedMovies.findIndex((movie) => movie.id === id)
    if (index > -1) {
      return ratedMovies[index].id
    }

    return 0
  }

  search = async (page = 1) => {
    const { movies, searchValue } = this.state
    if (!searchValue) {
      this.setState({
        searchValue: '',
        currentPage: page,
        totalResults: 0,
        movies: [],
        isLoading: false,
        error: false,
        message: '',
      })
      return
    }

    this.setState({
      currentPage: page,
      searchValue,
      movies,
      totalResults: 0,
      isLoading: true,
      error: false,
      message: '',
    })

    try {
      const response = await this.tmdbService.searchMovies(searchValue, page)
      const results = await response.moviesSearch
      const totalResults = await response.totalResults
      const moviesWithRating = await results.map((movie) => {
        return {
          ...movie,
          rating: this.getRatingById(movie.id),
        }
      })

      if (totalResults === 0) {
        if (page > 1) {
          this.setState({
            movies: [],
            searchValue,
            currentPage: page,
            totalResults: 0,
            isLoading: false,
            error: false,
            message: '',
          })
        } else {
          this.setState({
            movies: [],
            searchValue,
            currentPage: page,
            totalResults,
            isLoading: false,
            error: true,
            message: 'Sorry, no films match the query!',
          })
        }
      } else {
        this.setState({
          movies: moviesWithRating,
          searchValue,
          currentPage: page,
          totalResults,
          isLoading: false,
          error: false,
        })
      }
    } catch (error) {
      this.handleError(error)
    }
  }
  async componentDidMount() {
    this.tmdbService = new TMDBService()

    this.debSearch = debounce(this.search, 800)
    const allMovieGenresObject = await this.tmdbService.getAllGenres()
    this.allMovieGenres = await allMovieGenresObject.genres
  }

  searchHandler = (e) => {
    if (!e) {
      return
    }

    this.setState({
      currentPage: 1,
      searchValue: e.currentTarget.value,
      totalResults: 0,
    })

    this.debSearch()
  }
  handleError = (error) => {
    this.setState({
      movies: [],
      currentPage: 1,
      totalResults: 0,
      isLoading: false,
      error: true,
      message: error.message,
    })
  }

  findIndexByID = (array, id) => {
    if (typeof array === 'undefined') {
      return null
    }
    return array.findIndex((movie) => movie.id === id)
  }
  changeRating = (value, index, moviesPropertyName) => {
    this.setState((state) => {
      const modifiedMovie = {
        ...state[moviesPropertyName][index],
        rating: value,
      }

      const modifieMovies = [
        ...state[moviesPropertyName].slice(0, index),
        modifiedMovie,
        ...state[moviesPropertyName].slice(index + 1),
      ]

      return {
        [moviesPropertyName]: modifieMovies,
      }
    })
  }

  getMovieById = (id) => {
    const { movies } = this.state
    const index = this.findIndexByID(movies, id)

    return movies[index]
  }

  addRatedMovie = (value, id) => {
    const newRatedMovie = this.getMovieById(id)
    newRatedMovie.rating = value

    this.setState((state) => {
      const newRatedMovies = [...state.ratedMovies, newRatedMovie]

      return {
        ratedMovies: newRatedMovies,
        ratedCount: state.ratedCount + 1,
      }
    })
  }

  handleRate = (value, id) => {
    this.tmdbService.rate(value, id)
    const { ratedMovies, movies } = this.state
    const index = this.findIndexByID(ratedMovies, id)

    if (index === null || index === -1) {
      this.addRatedMovie(value, id)
    } else {
      this.changeRating(value, index, 'ratedMovies')
      const indexInMovies = this.findIndexByID(movies, id)
      this.changeRating(value, indexInMovies, 'movies')
    }
  }

  handleTabChange = async (activeKey) => {
    if (activeKey === '2') {
      const res = await this.tmdbService.getRatedMovies()
      const results = await res.results
      this.setState({
        currentPage: 1,
        movies: [],
        ratedMovies: results,
        isLoading: false,
        error: false,
        message: '',
      })
    }
  }

  render() {
    const { searchValue, currentPage, movies, ratedMovies, ratedCount, isLoading, error, message, totalResults } =
      this.state

    console.log(searchValue)

    const spinner = isLoading ? <Spin /> : null
    const alert = error ? <Alert message={message} type="error" /> : null
    const hasData = !(isLoading || error || movies === [])
    const data = hasData ? <MoviesList moviesList={movies} onRate={this.handleRate} /> : null

    const ratedData = ratedMovies ? <MoviesList onRate={this.handleRate} moviesList={ratedMovies} /> : null

    const { TabPane } = Tabs

    return (
      <div className="wrapper">
        <ServiceProvider value={this.allMovieGenres}>
          <Tabs defaultActiveKey="1" className="center-layout" onChange={this.handleTabChange}>
            <TabPane tab="Search" key="1" className="center-layout">
              <Input.Search
                placeholder="Type to search…"
                value={searchValue}
                onChange={this.searchHandler}
                className="search-bar"
              />
              {spinner} {data} {alert}
              {movies.length > 0 && (
                <Pagination
                  current={currentPage}
                  pageSize={20}
                  responsive
                  onChange={this.search}
                  total={totalResults}
                  showSizeChanger={false}
                />
              )}
            </TabPane>
            <TabPane tab="Rated" key="2" className="center-layout">
              {ratedData}
              {ratedData.length > 0 && (
                <Pagination pageSize={20} responsive total={ratedCount} showSizeChanger={false} />
              )}
            </TabPane>
          </Tabs>
        </ServiceProvider>
      </div>
    )
  }
}
