import { Component } from 'react'

import MovieCard from '../MovieCard/MovieCard'
import TMDBService from '../../services/services'
import './MoviesList.css'

export default class MoviesList extends Component {
  tmdbService = new TMDBService()
  state = {
    moviesList: [],
  }

  componentDidMount() {
    this.updateFilms()
  }

  updateFilms = () => {
    this.tmdbService.getFilms().then(({ moviesSearch }) => {
      this.setState({
        moviesList: moviesSearch,
      })
    })
  }

  renderFilms = (moviesList) => {
    return moviesList.map((movie) => {
      const {
        id: filmID,
        title: filmTitle,
        release_date: filmReleaseDate,
        poster_path: filmPosterPath,
        overview: filmOverview,
        // vote_average: filmVoteAverage,
        genre_ids: filmGenres,
        rating: filmRating = 0,
      } = movie
      return (
        <MovieCard
          key={filmID}
          filmTitle={filmTitle}
          filmOverview={filmOverview}
          filmReleaseDate={filmReleaseDate}
          filmPosterPath={filmPosterPath}
          filmGenres={filmGenres}
          filmRating={filmRating}
        />
      )
    })
  }
  render() {
    const { moviesList } = this.state
    const movies = this.renderFilms(moviesList)
    return <ul className="list">{movies}</ul>
  }
}
