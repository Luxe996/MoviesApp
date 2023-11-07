import { Component } from 'react'
import { Rate } from 'antd'
import './MovieDescription.css'

export default class MovieDescription extends Component {
  textAbbreviation = (description) => {
    if (typeof description === 'undefined') {
      return ''
    }
    const indexOfSpaceAfterTruncate = description.indexOf(' ', 200)
    return description.slice(0, indexOfSpaceAfterTruncate).concat('…')
  }
  componentDidUpdate = (prevProps) => {
    const { rating } = this.props
    if (rating !== prevProps.rating) {
      this.setState({
        rating,
      })
    }
  }

  render() {
    const { id, onRate, overview, rating } = this.props

    return (
      <div className="movie-footer movie-stats">
        <p className="movie-description">{this.textAbbreviation(overview)}</p>
        <Rate
          count={10}
          allowHalf
          onChange={(value) => onRate(value, id)}
          value={rating}
          className="movie-rate"
          allowClear={false}
        />
      </div>
    )
  }
}
