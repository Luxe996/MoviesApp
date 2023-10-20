import './MovieCard.css'
import { format } from 'date-fns'
const MovieCard = (props) => {
  const {
    filmTitle,
    filmOverview,
    filmReleaseDate,
    filmPosterPath,
    filmVoteAverage,
    // filmGenres,
    // filmChangeRating,
    // filmRating,
  } = props

  const filmPoster = `https://image.tmdb.org/t/p/original${filmPosterPath}`

  let dateFormatted
  try {
    dateFormatted = format(new Date(filmReleaseDate), 'MMMM d, yyyy')
  } catch (error) {
    dateFormatted = ''
  }

  const textAbbreviation = (description) => {
    if (typeof description === 'undefined') {
      return ''
    }
    const indexOfSpaceAfterTruncate = description.indexOf(' ', 100)
    return description.slice(0, indexOfSpaceAfterTruncate).concat('…')
  }

  return (
    <li className="card">
      <img className="card__poster" src={filmPosterPath ? filmPoster : 'noFilmPoster'} alt="Постер фильма" />
      <div className="card__info">
        <h3 className="info__title">{filmTitle}</h3>
        <p className="info__date">{dateFormatted}</p>
        <ul className="info__genres"></ul>
        <p className="info__description">{textAbbreviation(filmOverview)}</p>
        <span className="info__rating"> {filmVoteAverage}</span>
      </div>
    </li>
  )
}

export default MovieCard
