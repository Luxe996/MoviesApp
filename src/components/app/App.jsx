import './App.css'
import { Component } from 'react'
import { Spin, Alert, Input, Pagination } from 'antd'
import { debounce } from 'lodash'

import MoviesList from '../MoviesList/MoviesList'
import TMDBService from '../../services/services'

export default class App extends Component {
  tmdbService = new TMDBService()
  state = {
    searchValue: '',
    currentPage: 1,
    totalResults: 0,
    movies: [],
    isLoading: false,
    error: false,
    message: '',
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
          // rating: this.getRatingById(movie.id),
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
  componentDidMount() {
    // this.updateFilms()

    this.debSearch = debounce(this.search, 800)
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
  // updateFilms = () => {
  //   this.tmdbService
  //     .getFilms()
  //     .then(({ moviesSearch }) => {
  //       this.setState({
  //         movies: moviesSearch,
  //         isLoading: false,
  //       })
  //     })
  //     .catch(this.handleError)
  // }

  render() {
    const { searchValue, currentPage, movies, isLoading, error, message, totalResults } = this.state

    const spinner = isLoading ? <Spin /> : null
    const alert = error ? <Alert message={message} type="error" /> : null
    const hasData = !(isLoading || error || movies === [])
    const data = hasData ? <MoviesList moviesList={movies} /> : null
    return (
      <div className="wrapper">
        <header className="header">
          <Input.Search
            placeholder="Type to search…"
            value={searchValue}
            onChange={this.searchHandler}
            className="search-bar"
          />
        </header>
        <main className="main">
          {spinner} {data} {alert}
        </main>
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
      </div>
    )
  }
}
