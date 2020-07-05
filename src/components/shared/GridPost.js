import React from "react";
import { useGridPostStyles } from "../../styles";
import { Typography } from "@material-ui/core";

function GridPost({ post }) {
  const classes = useGridPostStyles();

  return (
    <div className={classes.gridPostContainer}>
      <div className={classes.gridPostOverlay}>
        <div className={classes.gridPostInfo}>
          <span className={classes.likes}/>
          <Typography >Hello</Typography>
        </div>
      </div> 
    </div>
  )
}

export default GridPost;
