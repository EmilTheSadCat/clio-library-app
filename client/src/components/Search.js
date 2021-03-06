import React, { useState } from 'react';
import { Formik } from 'formik';
import { connect } from 'react-redux';
import clsx from 'clsx';

import Select from './Select';
import { setActualQuery } from '../actions/actualQuery';
import utils from '../utils/utils';

import makeStyles from '@material-ui/core/styles/makeStyles';


import SearchIcon from "@material-ui/icons/Search";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelActions from "@material-ui/core/ExpansionPanelActions";

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    maxWidth: '70vw',
    justifyItems: 'center',
    marginTop: theme.spacing(5)
  },
  column: {
    flexBasis: '33.33%'
  },
  filterElement: {
    margin: theme.spacing(2),
    minWidth: 170
  },
  yearFilters: {
    flexBasis: 'none'
  },
  searchField: {
    // marginLeft: theme.spacing(1),
    // marginRight: theme.spacing(1),
    // width: '80vw'
  },
  input: {
    padding: '0px'
  },
  yearField: {
    fontSize: '.8rem',
    padding: '0px'
  },
  dense: {
    marginTop: theme.spacing(2)
  },
  menu: {
    width: 200
  },
  root: {
    width: '100%',
  },
  details: {
      flexWrap: 'wrap'
  }
}));

const Search = props => {
  const classes = useStyles();
  const [genres, setGenres] = useState({
    genres: [
      {
        genre_id: 'all',
        genre_name: 'all'
      }
    ],
    done: false
  });
  if (props.genreSelectOptions.length > 0 && !genres.done) {
    setGenres({
      genres: [...props.genreSelectOptions, ...genres.genres],
      done: true
    });
  }

  const { selectSearchOptions: selectOptions } = utils;

  const isQueryPopulated = () => {
    const actualQueryLength  = Object.entries(props.actualQuery).length;
    if(actualQueryLength > 0) {
      return true
    } else {
      return false
    }
  }
  const { query: actualQuery } = props.actualQuery;

  return (
    <div>
      <Formik
        initialValues={{
          value: isQueryPopulated() ? props.actualQuery.query.value : '' ,
          searchIn: isQueryPopulated() ? actualQuery.searchIn : 'b',
          searchBy: isQueryPopulated() ? actualQuery.searchBy : 'title',
          yearStart: isQueryPopulated() ? actualQuery.yearStart : 1800,
          yearEnd: isQueryPopulated() ? actualQuery.yearEnd : 2019,
          titlesOrderBy: isQueryPopulated() ? actualQuery.titlesOrderBy : 'titleAsc',
          authorsOrderBy: isQueryPopulated() ? actualQuery.authorsOrderBy : 'authorDesc',
          genre: isQueryPopulated() ? actualQuery.genre : 'all'
        }}
        onSubmit={(values, actions) => {
          props.handleSubmit(values);
          props.setActualQuery(values);

          actions.setSubmitting(false);
        }}
        render={props => (
          <form onSubmit={props.handleSubmit}>
            <Grid container direction="column" className={classes.root}>
              <Grid item xs={12}>
                <TextField
                  id="outlined-name"
                  label="Search"
                  className={classes.searchField}
                  value={props.values.value}
                  onChange={props.handleChange}
                  onBlur={props.handleBlur}
                  name="value"
                  margin="dense"
                  fullWidth
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="submit">
                          <SearchIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item>
                <ExpansionPanel>
                  <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1c-content"
                    id="panel1c-header"
                  >
                    <div className={classes.column}>
                      <Typography className={classes.heading}>
                        Filters
                      </Typography>
                    </div>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.details}>
                    <Grid container>
                      <Grid item container xs={12} sm={8}>
                        <Grid item>
                          <Select
                            label="Search by:"
                            name="searchBy"
                            className={classes.filterElement}
                            value={props.values.searchBy}
                            options={selectOptions.searchBy}
                            formikProps={props}
                            disabled={
                              props.values.searchIn === 'a' ? true : false
                            }
                          />
                          <Select
                            label="Search in:"
                            name="searchIn"
                            value={props.values.searchIn}
                            options={selectOptions.searchIn}
                            formikProps={props}
                            className={classes.filterElement}
                          />
                        </Grid>
                        <Grid item>
                          <Select
                            label="Genre:"
                            name="genre"
                            className={classes.filterElement}
                            value={props.values.genre}
                            options={utils.convertToSelectOptions.genres(
                              genres.genres
                            )}
                            formikProps={props}
                            disabled={
                              props.values.searchIn === 'a' ? true : false
                            }
                          />

                          {props.values.searchIn !== 'a' && (
                            <Select
                              label="Order by:"
                              className={classes.filterElement}
                              name="titlesOrderBy"
                              value={props.values.titlesOrderBy}
                              options={selectOptions.titles}
                              formikProps={props}
                            />
                          )}

                          {props.values.searchIn === 'a' && (
                            <Select
                              label="Order by:"
                              className={classes.filterElement}
                              name="authorsOrderBy"
                              value={props.values.authorsOrderBy}
                              options={selectOptions.authors}
                              formikProps={props}
                            />
                          )}
                        </Grid>
                      </Grid>
                    <Grid item container direction="column" xs={12} sm={3}>
                      <TextField
                        id="outlined-name"
                        label="From year"
                        className={clsx(classes.filterElement, classes.yearFilters)}
                        value={props.values.yearStart}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="yearStart"
                        margin="dense"
                        variant="outlined"
                        disabled={props.values.searchIn === 'a' ? true : false}
                      />
                      <TextField
                        id="outlined-name"
                        label="To year"
                        className={classes.filterElement}
                        value={props.values.yearEnd}
                        onChange={props.handleChange}
                        onBlur={props.handleBlur}
                        name="yearEnd"
                        margin="dense"
                        variant="outlined"
                        disabled={props.values.searchIn === 'a' ? true : false}
                      />
                    </Grid>

                    </Grid>
                  </ExpansionPanelDetails>
                  <Divider />
                  <ExpansionPanelActions>
                    <Button size="small" type="submit">
                      Search
                    </Button>
                  </ExpansionPanelActions>
                </ExpansionPanel>
              </Grid>
            </Grid>

          </form>
        )}
      />
    </div>
  );
};

const mapStateToProps = state => ({
  actualQuery: state.actualQuery
})

const mapDispatchToProps = dispatch => ({
  setActualQuery: query => dispatch(setActualQuery(query))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
