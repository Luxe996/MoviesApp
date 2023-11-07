import { ServiceConsumer } from '../../service-context'
import './MovieInfo.css'

export const MovieInfo = (props) => {
  const getVoteColorClass = (vote) => {
    if (vote < 3) {
      return 'vote-bad'
    }

    if (vote < 5) {
      return 'vote-poor'
    }

    if (vote < 7) {
      return 'vote-good'
    }

    return 'vote-awesome'
  }

  const getGenreNames = (genreIds, allMovieGenres) => {
    return genreIds.map((id) => {
      return allMovieGenres.map((genre) => {
        if (genre.id === id) {
          return (
            <span key={id} className="movie-genre">
              {genre.name}
            </span>
          )
        }

        return ''
      })
    })
  }

  const { originalTitle, releaseDate, voteAverage, genreIds } = props

  const voteClasses = 'vote-average '.concat(getVoteColorClass(voteAverage))

  return (
    <ServiceConsumer>
      {(allMovieGenres) => {
        return (
          <div className="movie-stats">
            <div className="movie-header">
              <h5 className="title">{originalTitle}</h5>
              <span className={voteClasses}>{voteAverage}</span>
            </div>
            <p className="movie-date">{releaseDate}</p>
            <div className="movie-genres">{getGenreNames(genreIds, allMovieGenres)}</div>
          </div>
        )
      }}
    </ServiceConsumer>
  )
}
