import React from "react";
import Card from "../Card/Card";
import Dropdowns from "../Dropdowns/Dropdowns";

import classes from "./NavBar.module.css";

const NavBar = (props) => {
  return (
    <Card className={classes.navbarCard}>
      <h5>Movie Trailer</h5>
      <div className={classes.dropdowns}>
        <Dropdowns movieLanguage={props.movieLanguage} />
      </div>
    </Card>
  );
};

export default NavBar;
