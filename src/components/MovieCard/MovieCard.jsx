import './MovieCard.css'
import { format } from 'date-fns'
import { Component } from 'react'

import MovieInfo from './MovieInfo'
import MovieDescription from './MovieDescription'

export default class MovieCard extends Component {
  componentDidUpdate(prevProps) {
    const { rating } = this.props
    if (rating !== prevProps.rating) {
      this.setState({
        rating,
      })
    }
  }

  render() {
    const { title, overview, release_date, poster_path, vote_average, genre_ids, rating, id, onRate } = this.props

    const filmPoster = `https://image.tmdb.org/t/p/original${poster_path}`

    let dateFormatted
    try {
      dateFormatted = format(new Date(release_date), 'MMMM d, yyyy')
    } catch (error) {
      dateFormatted = ''
    }

    return (
      <li className="movie-container">
        <img className="movie-poster" src={poster_path ? filmPoster : 'noFilmPoster'} alt="Постер фильма" />
        <div className="movie-layout">
          <MovieInfo
            genreIds={genre_ids}
            voteAverage={vote_average}
            releaseDate={dateFormatted}
            originalTitle={title}
          />
          <MovieDescription overview={overview} rating={rating} id={id} onRate={onRate} />
        </div>
      </li>
    )
  }
}
