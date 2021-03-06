import React, { Component } from 'react';
import axios from 'axios';

import Search from '../components/Search';
import Results from '../components/Results';
import { connect } from 'react-redux';
import Typography from "@material-ui/core/Typography";

class MainPage extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { results: {}, query: '', genres: [], error: '', message: '' };
  }
  componentDidMount() {
    axios({
      method: 'GET',
      url: `${process.env.API_URL ? process.env.API_URL : ''}/api/getAllGenres`
    })
      .then(res => {
        this.setState(state => ({
          ...state,
          genres: res.data
        }));
      })
      .catch(err => {
        this.setState(state => ({
          ...state,
          error: 'Something went wrong'
        }));
      });

    if (this.props.actualQuery.query) {
      const {
        value,
        searchIn,
        searchBy,
        yearStart,
        yearEnd,
        titlesOrderBy,
        authorsOrderBy,
        genre
      } = this.props.actualQuery.query;
      const isSearchInAuthors = searchIn === 'a' ? true : false;
      const searchByParam = isSearchInAuthors ? 'author' : searchBy;
      const order = isSearchInAuthors ? authorsOrderBy : titlesOrderBy;
      axios(
        {
          method: 'get',
          url: `${process.env.API_URL ? process.env.API_URL : ''}/api/search`,
          params: {
            query: searchIn,
            [searchByParam]: value,
            yearStart: yearStart,
            yearEnd: yearEnd,
            order: order,
            genreId: genre
          }
        },
        []
      )
        .then(res => {
          if (res.config.params.query === 'a' && res.data.message) {
            this.setState(state => ({
              ...state,
              error: 'Author not found'
            }));
          } else {
            this.setState(state => {
              return {
                ...state,
                results: res.data,
                query: res.config.params.query
              };
            });
          }
        })
        .catch(err => {
          this.setState(state => ({
            ...state,
            error: 'Book not found'
          }));
        });
    }
  }

  handleSubmit(values) {
    const isSearchInAuthors = values.searchIn === 'a' ? true : false;
    const searchByParam = isSearchInAuthors ? 'author' : values.searchBy;
    const order = isSearchInAuthors
      ? values.authorsOrderBy
      : values.titlesOrderBy;
    axios({
      method: 'get',
      url: `${process.env.API_URL ? process.env.API_URL : ''}/api/search`,
      params: {
        query: values.searchIn,
        [searchByParam]: values.value,
        yearStart: values.yearStart,
        yearEnd: values.yearEnd,
        order,
        genreId: values.genre
      }
    })
      .then(res => {
        if (res.config.params.query === 'a' && res.data.message) {
          this.setState(state => ({
            ...state,
            error: 'Author not found'
          }));
        } else {
          this.setState(state => {
            return {
              ...state,
              results: res.data
            };
          });
        }
      })
      .catch(err => {
        this.setState(state => ({
          ...state,
          error: 'Book not found'
        }));
      });
  }

  render() {
    return (
      <>
      <Typography variant="overline">
        Search in catalogue:
      </Typography>
        <Search
          handleSubmit={this.handleSubmit}
          genreSelectOptions={this.state.genres}
        />
        <Results
          results={Array.isArray(this.state.results) && this.state.results}
        />
        {this.state.error && <p>{this.state.error}</p>}
        {this.state.message && <p>{this.state.message}</p>}
      </>
    );
  }
}
const mapStateToProps = state => ({
  actualQuery: state.actualQuery
});

export default connect(mapStateToProps)(MainPage);
