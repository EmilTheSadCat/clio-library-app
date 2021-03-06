import React from 'react';
import { connect } from "react-redux";
import { Formik } from "formik";
import * as Yup from "yup";

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import makeStyles from '@material-ui/core/styles/makeStyles';
import Container from '@material-ui/core/Container';


import { login } from "../actions/auth";

const useStyles = makeStyles(theme => ({
    '@global': {
      body: {
        backgroundColor: theme.palette.common.white,
      },
    },
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    avatar: {
      margin: theme.spacing(1),
      backgroundColor: theme.palette.secondary.main,
    },
    form: {
      width: '100%', // Fix IE 11 issue.
      marginTop: theme.spacing(1),
    },
    submit: {
      margin: theme.spacing(3, 0, 2),
    },
  }));

  const required = 'Required field'


const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required(required),
    password: Yup.string().required(required)

})


const Login = (props) => {
    const classes = useStyles();
    const errorMessage = props.errorMessage;
    const handleSubmit = (values) => {
       props.login(values, props.history)
    };
    

        return (
            <>
                {props.isAuthenticated ? (
                    <p>You are already logged in.</p>
                ) : (
                    <Container component="main" maxWidth="xs">
                        <div className={classes.paper}>
                            <Typography component="h1" variant="h5">
                                Sign in
                            </Typography>

                            <Formik
                                enableReinitialize
                                initialValues={{
                                    email: "",
                                    password: ""
                                }}
                                validationSchema={LoginSchema}
                                onSubmit={(values, actions) => {
                                    handleSubmit(values);
                                    actions.setSubmitting(false);
                                    actions.resetForm();
                                }}
                                render={props => (
                                    <form
                                        className={classes.form}
                                        onSubmit={props.handleSubmit}
                                    >
                                        <TextField
                                            onChange={
                                                props.handleChange
                                            }
                                            onBlur={props.handleBlur}
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            id="email"
                                            error={
                                                props.errors.email &&
                                                props.touched.email
                                            }
                                            helperText={
                                                props.errors.email &&
                                                props.touched.email
                                                    ? props.errors.email
                                                    : null
                                            }
                                            label="Email Address"
                                            value={props.values.email}
                                            name="email"
                                            autoComplete="email"
                                            autoFocus
                                        />
                                        <TextField
                                            onChange={
                                                props.handleChange
                                            }
                                            onBlur={props.handleBlur}
                                            value={
                                                props.values.password
                                            }
                                            error={
                                                props.errors.password &&
                                                props.touched.password
                                            }
                                            helperText={
                                                props.errors.password &&
                                                props.touched.password
                                                    ? props.errors.password
                                                    : null
                                            }
                                            variant="outlined"
                                            margin="normal"
                                            required
                                            fullWidth
                                            name="password"
                                            label="Password"
                                            type="password"
                                            id="password"
                                            autoComplete="current-password"
                                        />
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            className={classes.submit}
                                        >
                                            Sign in
                                        </Button>
                                    </form>
                                )}
                            />

                            {errorMessage && <p>{errorMessage}</p>}

                        </div>
                    </Container>
                )
                }
            </>
        );

}

const mapStateToProps = state => {
    return {
        errorMessage: state.auth.error,
        isAuthenticated: !!state.auth.authenticated
    }
}

export default connect(mapStateToProps, { login })(Login);