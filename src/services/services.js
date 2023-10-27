export default class TMDBService {
  _apiBase = 'https://api.themoviedb.org/3/'

  static apiKey = '0306f6bc89fedd96c5a7c3bf327a104d'
  async getResource(url) {
    const res = await fetch(`${this._apiBase}${url}`)
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, received ${res.status}`)
    }
    return await res.json()
  }

  async searchMovies(query, page) {
    const res = await this.getResource(
      `search/movie?api_key=${TMDBService.apiKey}&language=en-US&query=${query}&page=${page}&include_adult=false`
    )
    const totalResults = await res.total_results
    return { moviesSearch: res.results, totalResults }
  }
}
