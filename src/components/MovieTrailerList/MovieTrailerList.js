import React, { useContext, useState, useEffect } from "react";

import { DropdownFilterContext } from "../../store/dropdown-filter-contect";
import Card from "../Card/Card";
import ImageRenderer from "../ImageRenderer/ImageRenderer";
import classes from "./MovieTrailerList.module.css";

//to keep track of selected data from dropdown
let langArray = [];
let genereArray = [];
const MovieTrailerList = (props) => {
  let displayMovieList;
  const dropdownsKeys = ["EventLanguage", "EventGenre"];
  const { filterValue } = useContext(DropdownFilterContext);
  //to store array of movie data from api
  const [trailersData, setTrailersData] = useState(null);
  //to store selected movie trailer and display
  const [displayTrailer, setDisplayTrailer] = useState({
    clicked: false,
    id: null,
    index: null,
    trailer: null,
    generes: null,
    dates: null
  });

  useEffect(() => {
    //extracting movie data from api and storing it in state
    if (props.movieTrailerDataList) {
      let moviesDataArray = { ...props.movieTrailerDataList };
      let movieListArray = Object.values({ ...moviesDataArray.moviesData });
      setTrailersData(movieListArray);
    }
  }, [props.movieTrailerDataList]);

  const onMovieClickHandle = (e, index, movie) => {
    //storing selected movie details in state
    let video = movie.TrailerURL;
    let splitedVideo = video.split("/");
    let videoId = splitedVideo.pop();
    let embededVideoLink = `https://www.youtube-nocookie.com/embed/${videoId}`;
    movie.TrailerURL = embededVideoLink;
    let generes = movie.EventGenre;
    const genereSplit = generes.split("|");
    let movieDate = new Date(movie.ShowDate);
    let shortMonthName = movieDate.toLocaleString("default", {
      month: "short"
    });
    let year = movieDate.getFullYear();
    let mergedDate = [shortMonthName, year];

    setDisplayTrailer({
      clicked: true,
      id: e.currentTarget.id,
      index: index,
      trailer: movie,
      generes: genereSplit,
      dates: mergedDate
    });
  };
  useEffect(() => {
    //placing selected video above the row
    if (displayTrailer.clicked === true) {
      let index = displayTrailer.index;
      let remainder = index % Math.floor(window.innerWidth / 200);
      for (let i = 0; i < remainder; i++) {
        index--;
      }
      let copyData = [...trailersData];
      let selectedMovieVideo = copyData.splice(index, 1);
      let currentEl = document.getElementById(selectedMovieVideo[0].EventCode);
      let parentEl = currentEl.parentNode;
      let videoDivEl = document.getElementById("videoContainer");
      parentEl.insertBefore(videoDivEl, currentEl);
    }
  }, [displayTrailer.id]);

  useEffect(() => {
    if (filterValue.filterValue.type !== "") {
      let moviesDataArray = { ...props.movieTrailerDataList };
      let movieListArray = Object.values({
        ...moviesDataArray.moviesData
      });

      if (dropdownsKeys[0] === filterValue.filterValue.key) {
        //filtering and storing selected language movieTrailer into the state
        if (filterValue.filterValue.checked === true) {
          let copyLangData = [...movieListArray];
          let trailerMovieFilterList = copyLangData.filter(
            (trailer) => trailer.EventLanguage === filterValue.filterValue.type
          );
          trailerMovieFilterList.forEach((list) => {
            langArray.push(list);
          });
          const ids = langArray.map((o) => o.EventCode);
          const filtered = langArray.filter(
            ({ EventCode }, index) => !ids.includes(EventCode, index + 1)
          );
          setTrailersData([...filtered]);
        } else {
          let copyLangData = [...trailersData];
          let trailerMovieFilterList = copyLangData.filter(
            (trailer) => trailer.EventLanguage !== filterValue.filterValue.type
          );
          if (trailerMovieFilterList.length !== 0) {
            setTrailersData((prev) => [...trailerMovieFilterList]);
          } else {
            setTrailersData([...movieListArray]);
          }
        }
      } else {
        //filtering and storing selected genere movieTrailer into the state
        if (filterValue.filterValue.checked === true) {
          let copyGenereData = [...trailersData];
          let trailerMovieFilterList = copyGenereData.filter(function (
            trailer
          ) {
            let generes = trailer.EventGenre.split(/[|-]/g);
            let singleGenere;
            generes.forEach((genere) => {
              if (genere === filterValue.filterValue.type) {
                singleGenere = trailer;
              }
            });
            return singleGenere;
          });
          trailerMovieFilterList.forEach((list) => {
            genereArray.push(list);
          });
          //code to remove duplicate language movie
          const ids = genereArray.map((o) => o.EventCode);
          const filtered = genereArray.filter(
            ({ EventCode }, index) => !ids.includes(EventCode, index + 1)
          );
          setTrailersData([...filtered]);
        } else {
          let copyGenereData = [...trailersData];
          let filterData = [];
          copyGenereData.forEach((_eachGenere, index) => {
            const splitedGeneres = _eachGenere.EventGenre.split(/[|-]/g);
            const isGenereExist = splitedGeneres.find(
              (_genere) => _genere === filterValue.filterValue.type
            );
            if (isGenereExist) {
              filterData.push(_eachGenere);
            }
          });
          //code to remove duplicate genere movie
          const ids = filterData.map((o) => o.EventCode);
          const filtered = copyGenereData.filter(({ EventCode }, index) =>
            ids.includes(EventCode, index + 1)
          );
          if (filtered.length !== 0) {
            setTrailersData((prev) => [...filtered]);
          } else {
            setTrailersData([...movieListArray]);
          }
        }
      }
    }
  }, [filterValue.filterValue.type, filterValue.filterValue.checked]);

  //displaying movietrailers
  if (trailersData !== null) {
    displayMovieList = trailersData.map((movie, index) => {
      return (
        <div
          key={movie.EventCode}
          id={movie.EventCode}
          className={classes.trailerListCard}
          onClick={(e) => onMovieClickHandle(e, index, movie)}
        >
          <ImageRenderer
            key={movie.EventCode}
            url={movie.EventImageUrl}
            thumb={movie.EventImageUrl}
            width="4032"
            height="3024"
            movieItem={movie}
          />
          <p>{movie.EventTitle}</p>
        </div>
      );
    });
  }

  return (
    //displaying movietrailers cards and movie video trailers section
    <Card className={classes.trailerListContainer}>
      {displayMovieList}
      {displayTrailer.clicked ? (
        <div id="videoContainer" className={classes.trailerVideo_card}>
          <div>
            <iframe
              width={window.innerWidth > 620 ? "620" : window.innerWidth - 10}
              height="386"
              scrolling="no"
              className={classes.iframe}
              src={displayTrailer.trailer.TrailerURL}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div
            className={classes.trailer_desc}
            style={{
              width: window.innerWidth > 620 ? "620" : window.innerWidth - 10,
              margin: "0px",
              padding: "0px"
            }}
          >
            <ul>
              <li className={classes.videoTitle}>
                {displayTrailer.trailer.EventTitle}
              </li>
              <li className={classes.videoLang}>
                {displayTrailer.trailer.EventLanguage}
              </li>
              <li className={classes.videoGenere}>
                {displayTrailer.generes.map((_eachGenereList, index) => {
                  return <span key={index}>{_eachGenereList}</span>;
                })}
              </li>
              <li className={classes.votesDate}>
                <span className={classes.totalCntPtg}>
                  <i className="fa fa-thumbs-up">
                    <strong>{displayTrailer.trailer.ratings.wtsPerc}%</strong>{" "}
                    <strong className={classes.votes}>
                      {displayTrailer.trailer.ratings.dwtsCount} Votes
                    </strong>
                  </i>
                </span>
                <span className={classes.dateSapn}>
                  <i className="fa fa-calendar">
                    {displayTrailer.dates.map((date, index) => {
                      return <strong key={index}>{date}</strong>;
                    })}
                  </i>
                </span>
              </li>
              <li className={classes.videoDesc}>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </li>
              <li className={classes.voteFeedback}>
                <span className={classes.thumbsUp}>
                  <i className="fa fa-thumbs-up">
                    {" "}
                    <strong className={classes.thumbsUpvotes}>
                      {displayTrailer.trailer.ratings.dwtsCount}
                    </strong>
                  </i>
                </span>
                <span className={classes.question}>
                  <i className="fa fa-question-circle">
                    {" "}
                    <strong className={classes.thumbsUpvotes}>
                      {displayTrailer.trailer.ratings.maybe}
                    </strong>
                  </i>
                </span>
                <span className={classes.thumbsdown}>
                  <i className="fa fa-thumbs-down">
                    {" "}
                    <strong className={classes.thumbsUpvotes}>
                      {displayTrailer.trailer.ratings.dwtsCount}
                    </strong>
                  </i>
                </span>
              </li>
            </ul>
          </div>
        </div>
      ) : null}
    </Card>
  );
};

export default MovieTrailerList;
