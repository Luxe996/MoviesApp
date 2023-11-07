export default class TMDBService {
  _apiBase = 'https://api.themoviedb.org/3'
  static apiKey = '0306f6bc89fedd96c5a7c3bf327a104d'

  guestSessionId = null
  async getResource(url) {
    // const res = await fetch(`${this._apiBase}${url}`)
    let res
    try {
      res = await fetch(url)
      if (!res.ok) {
        throw new Error(`Could not fetch ${url}, received ${res.status}`)
      }
    } catch (error) {
      throw new Error(error)
    }
    let request
    try {
      request = await res.json()
    } catch (error) {
      request = error
    }

    return request
  }
  async searchMovies(query, page) {
    const searchUrl = `${this._apiBase}${'/search/movie'}`
    const url = `${searchUrl}?query=${query}&api_key=${TMDBService.apiKey}&page=${page}&include_adult=false&language=en-US`
    const res = await this.getResource(url)
    const results = await res.results
    const totalResults = await res.total_results
    return { moviesSearch: results, totalResults }
  }
  async getAllGenres() {
    const genresUrl = `${this._apiBase}/genre/movie/list`
    const fullUrl = `${genresUrl}?&api_key=${TMDBService.apiKey}`

    return this.getResource(fullUrl)
  }
  async createGuestSession() {
    const guestSessionUrl = `${this._apiBase}/authentication/guest_session/new`
    const fullUrl = `${guestSessionUrl}?&api_key=${TMDBService.apiKey}`

    let response
    try {
      response = await this.getResource(fullUrl)
      if (!response.success) {
        throw new Error('No guest sessions today!')
      }
    } catch (error) {
      return null
    }

    const guestSessionId = response.guest_session_id

    return guestSessionId
  }
  async rate(value, id) {
    const rateUrl = `${this._apiBase}/movie/${id}/rating`
    if (this.guestSessionId === null) {
      this.guestSessionId = await this.createGuestSession()
    }
    const fullUrl = `${rateUrl}?&api_key=${TMDBService.apiKey}&guest_session_id=${this.guestSessionId}`

    const rating = { value }
    const fetchOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify(rating),
    }

    let response
    try {
      response = await fetch(fullUrl, fetchOptions)
      if (!response.ok) {
        throw new Error('Tell me to fix this bug!')
      }

      this.getRatedMovies()
    } catch (error) {
      return error
    }

    return null
  }
  async getRatedMovies() {
    if (this.guestSessionId === null) {
      this.guestSessionId = await this.createGuestSession()
    }

    const getRatingUrl = `${this._apiBase}/guest_session/${this.guestSessionId}/rated/movies`
    const fullUrl = `${getRatingUrl}?&api_key=${TMDBService.apiKey}`

    return this.getResource(fullUrl)
  }
}
