import MovieCard from '../MovieCard/MovieCard'
import './MoviesList.css'

const MoviesList = ({ moviesList, onRate }) => {
  const movies = moviesList.map((movie) => {
    return <MovieCard key={movie.id} onRate={onRate} {...movie} />
  })

  return <ul className="list">{movies}</ul>
}

export default MoviesList
