import MovieCard from '../MovieCard/MovieCard'
import './MoviesList.css'

const MoviesList = ({ moviesList }) => {
  const movies = moviesList.map((movie) => {
    return <MovieCard key={movie.id} {...movie} />
  })

  return <ul className="list">{movies}</ul>
}

export default MoviesList
