import React from "react";
import { useEditProfilePageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import {
  IconButton,
  Button,
  Hidden,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import ProfilePicture from "../components/shared/ProfilePicture";
import { UserContext } from "../App";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_EDIT_USER_PROFILE } from "../graphql/queries";
import LoadingScreen from "../components/shared/LoadingScreen";
import { useForm, handleSubmit } from "react-hook-form";
import isURL from "validator/lib/isURL";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from 'validator/lib/isMobilePhone'
import { EDIT_USER } from "../graphql/mutations";

function EditProfilePage({ history }) {
  const { currentUserId } = React.useContext(UserContext);
  const variables = { id: currentUserId };
  const { data, loading } = useQuery(GET_EDIT_USER_PROFILE, { variables });
  const classes = useEditProfilePageStyles();
  const path = history.location.pathname;
  const [showDrawer, setDrawer] = React.useState(false);

  function handleToggleDrawer() {
    setDrawer((prev) => !prev);
  }

  function handleSelected(index) {
    switch (index) {
      case 0:
        return path.includes("edit");
      default:
        break;
    }
  }

  function handleListClick(index) {
    switch (index) {
      case 0:
        history.push("/accounts/edit");
        break;
      default:
        break;
    }
  }

  const options = [
    "Edit Profile",
    "Change Password",
    "Apps and Websites",
    "Email and SMS",
    "Push Notifications",
    "Manage Contacts",
    "Privacy and Security",
    "Login Activity",
    "Emails from Instagram",
  ];
  if (loading) return <LoadingScreen />;

  const drawer = (
    <List>
      {options.map((option, index) => (
        <ListItem
          key={option}
          button
          selected={handleSelected(index)}
          onClick={() => handleListClick(index)}
          classes={{
            selected: classes.listItemSelected,
            button: classes.listItemButton,
          }}
        >
          <ListItemText primary={option} />
        </ListItem>
      ))}
    </List>
  );
  return (
    <Layout title="Edit Profile">
      <section className={classes.section}>
        <IconButton
          edge="start"
          onClick={handleToggleDrawer}
          className={classes.menuButton}
        >
          <Menu />
        </IconButton>
        <nav>
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor="left"
              open={showDrawer}
              onClose={handleToggleDrawer}
              classes={{ paperAnchorLeft: classes.temporaryDrawer }}
            >
              {drawer}
            </Drawer>
          </Hidden>
          <Hidden
            xsDown
            implementation="css"
            className={classes.permanentDrawerRoot}
          >
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.permanentDrawerPaper,
                root: classes.permanentDrawerRoot,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main>
          {path.includes("edit") && <EditUserInfo user={data.users_by_pk} />}
        </main>
      </section>
    </Layout>
  );
}

function EditUserInfo({ user }) {
  const { register, handleSubmit } = useForm({ mode: "blur" });
  const classes = useEditProfilePageStyles();
  const [editUser] = useMutation(EDIT_USER)

  async function onSubmit(data) {
    try{
      const variables = { ...data, id: user.id }
      await editUser({ variables })

    }catch(error){

    }
  }
  return (
    <section className={classes.container}>
      <div className={classes.pictureSectionItem}>
        <ProfilePicture size={38} image={user.profile_image} />
        <div className={classes.justifySelfStart}>
          <Typography className={classes.typography}>
            {user.username}
          </Typography>
          <Typography
            color="primary"
            variant="body2"
            className={classes.typographyChangePic}
          >
            Change Profile Photo
          </Typography>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <SectionItem
          name="name"
          inputRef={register({
            required: true,
            minLength: 5,
            maxLength: 20,
          })}
          text="Name"
          formItem={user.name}
        />
        <SectionItem
          name="username"
          inputRef={register({
            required: true,
            pattern: /^[a-zA-Z0-9_.]*$/,
            minLength: 5,
            maxLength: 20,
          })}
          text="Username"
          formItem={user.username}
        />
        <SectionItem
          name="website"
          inputRef={register({
            validate: (input) =>
              Boolean(input)
                ? isURL(input, {
                    protocols: ["http", "https"],
                    require_protocols: true,
                  })
                : true,
          })}
          text="Website"
          formItem={user.website}
        />
        <div className={classes.sectionItem}>
          <aside>
            <Typography className={classes.bio}>Bio</Typography>
          </aside>
          <TextField
            name="bio"
            inputRef={register({
              maxLength: 120,
            })}
            variant="outlined"
            multiline
            rowsMax={3}
            rows={3}
            fullWidth
            defaultValue={user.bio}
          />
        </div>
        <div className={classes.sectionItem}>
          <div />
          <Typography
            color="textSecondary"
            className={classes.justifySelfStart}
          >
            Personal information
          </Typography>
        </div>
        <SectionItem
          name="email"
          inputRef={register({
            required: true,
            validate: (input) => isEmail(input),
          })}
          text="Email"
          formItem={user.email}
          type="email"
        />
        <SectionItem
          name="phoneNumber"
          inputRef={register({
            validate: input => Boolean(input) ? isMobilePhone(input) : true,
          })}
          text="Phone Number"
          formItem={user.phone_number}
        />
        <div className={classes.sectionItem}>
          <div />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.justifySelfStart}
          >
            Submit
          </Button>
        </div>
      </form>
    </section>
  );
}

function SectionItem({ type = "text", text, formItem, inputRef, name }) {
  const classes = useEditProfilePageStyles();
  return (
    <div className={classes.sectionItemWrapper}>
      <aside>
        <Hidden xsDown>
          <Typography className={classes.typography} align="right">
            {text}
          </Typography>
        </Hidden>
        <Hidden smUp>
          <Typography className={classes.typography}>{text}</Typography>
        </Hidden>
      </aside>
      <TextField
        name={name}
        inputRef={inputRef}
        variant="outlined"
        fullWidth
        defaultValue={formItem}
        type={type}
        className={classes.textField}
        inputProps={{
          className: classes.textFieldInput,
        }}
      />
    </div>
  );
}

export default EditProfilePage;
