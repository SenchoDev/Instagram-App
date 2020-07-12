import React from "react";
import { useProfilePictureStyles } from "../../styles";
import { Person } from "@material-ui/icons";
import { useMutation } from "@apollo/react-hooks";
import handleImageUpload from '../../utils/handleImageUpload';
import { EDIT_USER_AVATAR } from "../../graphql/mutations";
import { UserContext } from "../../App";


function ProfilePicture({
  size,
  image = "https://instagram.com/static/images/anonymousUser.jpg/23e7b3b2a737.jpg",
  isOwner,
}) {
  const { currentUserId } = React.useContext(UserContext);
  const classes = useProfilePictureStyles({ size, isOwner });
  const inputRef = React.useRef();
  const [editUserAvatar] = useMutation(EDIT_USER_AVATAR);
  const [img, setImg] = React.useState(image);

  function openFileInput(){
    inputRef.current.click();
  }

  async function handleUpdateProfilePic(event) {
    const url = await handleImageUpload(event.target.files[0]);
    const variables = { id: currentUserId, profileImage: url};
    await editUserAvatar({variables});
    setImg(url);
  }

  return (
    <section className={classes.section}>
      <input 
      style={{ display: 'none' }}
      ref={inputRef}
      type="file"
      onChange={handleUpdateProfilePic}
    />
      {image ? (
        <div className={classes.wrapper} onClick={isOwner ? openFileInput : () => null}>
          <img src={img} alt="User Profile" className={classes.image} />
        </div>
      ) : (
        <div className={classes.wrapper}>
          <Person className={classes.person} />
        </div>
      )}
    </section>
  );
}

export default ProfilePicture;
