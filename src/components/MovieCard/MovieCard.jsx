import './MovieCard.css'
import { format } from 'date-fns'
const MovieCard = (props) => {
  const {
    title,
    overview,
    filmReleaseDate,
    poster_path,
    vote_average,
    // filmGenres,
    // filmChangeRating,
    // filmRating,
  } = props

  console.log(props)

  const filmPoster = `https://image.tmdb.org/t/p/original${poster_path}`

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
      <img className="card__poster" src={poster_path ? filmPoster : 'noFilmPoster'} alt="Постер фильма" />
      <div className="card__info">
        <h3 className="info__title">{title}</h3>
        <p className="info__date">{dateFormatted}</p>
        <ul className="info__genres"></ul>
        <p className="info__description">{textAbbreviation(overview)}</p>
        <span className="info__rating"> {vote_average}</span>
      </div>
    </li>
  )
}

export default MovieCard
