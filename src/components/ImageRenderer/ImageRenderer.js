import React, { useRef, useState } from "react";
import classes from "./ImageRenderer.module.css";
import useIntersection from "../../shared/intersectionObserver";

const ImageRenderer = ({ url, thumb, width, height, movieItem }) => {
  const [isLoaded, setIsloaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useIntersection(imgRef, () => {
    setIsInView(true);
  });

  const handleOnLoad = () => {
    setIsloaded(true);
  };
  //adding image to whichever movie image is broken
  const addDefault = (e) => {
    e.target.src =
      "https://in.bmscdn.com/iedb/movies/images/mobile/thumbnail/medium/kavalu-daari-et00067133-13-12-2017-09-37-12.jpg";
  };

  return (
    <div
      className={classes.image_container}
      style={{
        paddingBottom: `${(height / width) * 100}%`,
        width: window.innerWidth < 400 ? "90vw" : "100%"
      }}
      ref={imgRef}
    >
      {isInView && (
        <>
          {isLoaded === true ? (
            <>
              <span className={classes.playIconSpan}>
                <i className="fa fa-play-circle"></i>
              </span>
              <span className={classes.thumbsUpIconSpan}>
                <i className="fa fa-thumbs-up">
                  <strong>{movieItem.wtsPerc}%</strong>{" "}
                  <strong className={classes.votes}>
                    {movieItem.wtsCount}
                  </strong>
                </i>
              </span>
            </>
          ) : null}

          <img
            className={`${classes.image} ${classes.thumb} ${
              isLoaded === false ? classes.isThumLoaded : ""
            }`}
            src={thumb}
            onError={addDefault}
            alt={movieItem.EventName}
          />
          <img
            className={`${classes.image} ${
              isLoaded === true ? classes.isLoaded : ""
            }`}
            alt={movieItem.EventName}
            src={url}
            onError={addDefault}
            onLoad={handleOnLoad}
          />
        </>
      )}
    </div>
  );
};

export default ImageRenderer;
