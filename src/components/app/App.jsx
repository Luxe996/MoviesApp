import './App.css'
import { Component } from 'react'

import MoviesList from '../MoviesList/MoviesList'

export default class App extends Component {
  render() {
    return (
      <div className="wrapper">
        <header className="header"></header>
        <main className="main">
          <MoviesList />
        </main>
      </div>
    )
  }
}
