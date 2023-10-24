import './App.css'
import { Component } from 'react'
import { Spin, Alert } from 'antd'

import MoviesList from '../MoviesList/MoviesList'
import TMDBService from '../../services/services'

export default class App extends Component {
  tmdbService = new TMDBService()
  state = {
    movies: [],
    isLoading: true,
    error: false,
    message: '',
  }

  componentDidMount() {
    this.updateFilms()
  }
  handleError = (error) => {
    this.setState({
      movies: [],
      isLoading: false,
      error: true,
      message: error.message,
    })
  }
  updateFilms = () => {
    this.tmdbService
      .getFilms()
      .then(({ moviesSearch }) => {
        this.setState({
          movies: moviesSearch,
          isLoading: false,
        })
      })
      .catch(this.handleError)
  }

  render() {
    const { movies, isLoading, error, message } = this.state

    const spinner = isLoading ? <Spin /> : null
    const alert = error ? <Alert message={message} type="error" /> : null
    const hasData = !(isLoading || error || movies === [])
    const data = hasData ? <MoviesList moviesList={movies} /> : null
    return (
      <div className="wrapper">
        <header className="header"></header>
        <main className="main">
          {spinner} {data} {alert}
        </main>
      </div>
    )
  }
}
