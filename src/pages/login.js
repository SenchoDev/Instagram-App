import React from "react";
import { useLoginPageStyles } from "../styles";
import SEO from "../components/shared/Seo";
import {
  Card,
  CardHeader,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import FacebookIconBlue from "../images/facebook-icon-blue.svg";
import FacebookIconWhite from "../images/facebook-icon-white.png";
import { AuthContext } from "../auth";
import isEmail from "validator/lib/isEmail";
import { useApolloClient } from "@apollo/react-hooks";
import { GET_USER_EMAIL } from "../graphql/queries"

function LoginPage() {
  const classes = useLoginPageStyles();
  const { register, handleSubmit, watch, formState} = useForm({ mode: "onBlur" });
  const [showPassword, setPasswordVisibility] = React.useState(false);
  const hasPassword = Boolean(watch('password'));
  const { logInWithEmailAndPassword } = React.useContext(AuthContext);

  const history = useHistory();
  const client = useApolloClient()

  async function onSubmit({input, password}) {
    if(!isEmail(input)){
      input = await getUserEmail(input)
    }
    logInWithEmailAndPassword(input, password);
    history.push('/');
  }

  async function getUserEmail(input){
    const variables = { input };
    const response = await client.query({
      query: GET_USER_EMAIL,
      variables
    })
    
    const userEmail = response.data.users[0].email || "no@email.com";
    return userEmail;
  }

  function togglePasswordVisibility(){
    setPasswordVisibility(prev => !prev);
  }

  return (
    <React.Fragment>
      <SEO title="Login" />
      <section className={classes.section}>
        <article>
          <Card className={classes.card}>
            <CardHeader className={classes.cardHeader} />
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                name="input"
                inputRef={register({
                  required: true,
                  minLength: 5,
                })}
                fullWidth
                variant="filled"
                label="Username, email or phone"
                margin="dense"
                className={classes.textField}
                autoComplete="username"
              />
              <TextField
                name="password"
                inputRef={register({
                  required: true,
                  minLength: 5,
                })}
                InputProps={{
                  endAdornment: hasPassword && (
                    <InputAdornment style={{ marginRight: '-10px'}}>
                      <Button onClick={togglePasswordVisibility}>
                        {showPassword ? "Hide" : "Show" }
                      </Button>
                    </InputAdornment>
                  )
                }}
                fullWidth
                variant="filled"
                label="Password"
                margin="dense"
                className={classes.textField}
                autoComplete="current-password"
                type={showPassword ? "text": "password"}
              />
              <Button 
                disabled={!formState.isValid || formState.isSubmitting}
                variant="contained"
                fullWidth
                color="primary"
                className={classes.button}
                type="submit"
              >
                Log In
              </Button>
            </form>
            <div className={classes.orContainer}>
              <div className={classes.orLine} />
              <div>
                <Typography variant="body2" color="textSecondary">
                  OR
                </Typography>
              </div>
              <div className={classes.orLine} />
            </div>
            <LoginWithFacebook color="secondary" iconColor="blue" />
            <Button fullWidth color="secondary">
              <Typography variant="caption">Forgot password?</Typography>
            </Button>
          </Card>
          <Card className={classes.signUpCard}>
            <Typography align="right" variant="body2">
              Don't have an account?
            </Typography>
            <Link to="/accounts/emailsignup">
              <Button color="primary" className={classes.signUpButton}>
                Sign up
              </Button>
            </Link>
          </Card>
        </article>
      </section>
    </React.Fragment>
  );
}

export function LoginWithFacebook({ color, iconColor, variant }) {
  const classes = useLoginPageStyles();
  const facebookIcon =
    iconColor === "blue" ? FacebookIconBlue : FacebookIconWhite;

  return (
    <Button fullWidth color={color} variant={variant}>
      <img
        src={facebookIcon}
        alt="facebook icon"
        className={classes.facebookIcon}
      />
      Log In with Facebook
    </Button>
  );
}

export default LoginPage;
