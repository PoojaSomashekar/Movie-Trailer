import React, { useContext, useState, useEffect } from "react";
import { useRef } from "react";
import { GenereList } from "../../shared/genereList";
import { DropdownFilterContext } from "../../store/dropdown-filter-contect";
import classes from "./Dropdowns.module.css";

//lang and genere array create to keep track of selected dropdown
let lang = [];
let genere = [];
const Dropdowns = (props) => {
  const node = useRef();
  let languageDataDetails = [];
  // setfilterValue context api is used to store selected data from dropdown and passing to other components
  let { setfilterValue } = useContext(DropdownFilterContext);
  let [dropDownsShow, setdropDownsShow] = useState({
    langShow: false,
    genereShow: false
  });
  let [dropdownData, setdropdownData] = useState({
    languageList: null,
    generelist: null,
    lang: [],
    genere: []
  });
  useEffect(() => {
    //extract the language dropdown keys from api and store it in state
    if (props.movieLanguage !== null) {
      let list = { ...props.movieLanguage };
      let listArray = [...list.languageList];
      listArray.forEach((_eachLang) => {
        languageDataDetails.push({ lang: _eachLang, isChecked: false });
      });
      setdropdownData({
        languageList: [...languageDataDetails],
        generelist: GenereList,
        lang: [],
        genere: []
      });
    }
  }, [props.movieLanguage]);

  const openDropdwn = (e) => {
    //to open dropdown
    e.preventDefault();
    if (e.currentTarget.id === "langdropdwn") {
      setdropDownsShow({
        langShow: (dropDownsShow.langShow = !dropDownsShow.langShow),
        genereShow: false
      });
    }
    if (e.currentTarget.id === "generedropdwn") {
      setdropDownsShow({
        langShow: false,
        genereShow: (dropDownsShow.genereShow = !dropDownsShow.genereShow)
      });
    }
  };

  const onLanguageSelect = (e, index, selectedLang) => {
    //on selecting the vale from dropdown and making checked=true and storing it in state
    let copyLangData = [...dropdownData.languageList];
    let singleLangArray = copyLangData.splice(index, 1);
    let langObj = singleLangArray[0];
    langObj.isChecked = !langObj.isChecked;
    copyLangData.splice(index, 0, langObj);

    if (langObj.isChecked === true) {
      lang.push(langObj.lang);
    } else {
      if (lang.find((language) => language === langObj.lang)) {
        let id = lang.indexOf(langObj.lang);
        lang.splice(id, 1);
      }
    }
    setdropdownData({
      ...dropdownData,
      languageList: copyLangData,
      lang: lang
    });
    setfilterValue({
      filterValue: {
        key: "EventLanguage",
        type: langObj.lang,
        checked: langObj.isChecked
      }
    });
  };
  const onSelectGenere = (e, index, selectedGenere) => {
    //on selecting the vale from dropdown and making checked=true and storing it in state
    let copyGenereData = [...dropdownData.generelist];
    let singleGenereArray = copyGenereData.splice(index, 1);
    let genereObj = singleGenereArray[0];
    genereObj.isChecked = !genereObj.isChecked;
    copyGenereData.splice(index, 0, genereObj);

    if (genereObj.isChecked === true) {
      genere.push(genereObj.genere);
    } else {
      if (genere.find((_genere) => _genere === genereObj.genere)) {
        let id = genere.indexOf(genereObj.genere);
        genere.splice(id, 1);
      }
    }
    setdropdownData({
      ...dropdownData,
      generelist: copyGenereData,
      genere: genere
    });
    setfilterValue({
      filterValue: {
        key: "EventGenre",
        type: genereObj.genere,
        checked: genereObj.isChecked
      }
    });
  };

  const handleClick = (e) => {
    //detecting click inside and outside of dropdown
    if (node.current.contains(e.target)) {
      // inside click
      return;
    }
    // outside click
    setdropDownsShow({
      langShow: false,
      genereShow: false
    });
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [dropDownsShow]);

  return (
    <ul ref={node} className={classes.dropdowns_card}>
      <li>
        <div className={classes.dropdown}>
          <button
            id="langdropdwn"
            onClick={openDropdwn}
            className={`${classes.dropdownBtn} ${classes.langdropdwn}`}
          >
            {dropdownData.lang.length !== 0
              ? [...dropdownData.lang].toString()
              : "All Languages"}
            <i className="fa fa-caret-down"></i>
          </button>
          {dropDownsShow.langShow ? (
            <div className={classes.dropdown_content}>
              <ul>
                {dropdownData.languageList.map((_eachLang, index) => {
                  return (
                    <li key={index}>
                      <input
                        type="checkbox"
                        id={_eachLang.lang}
                        name={_eachLang.lang}
                        checked={_eachLang.isChecked}
                        onChange={(e) => onLanguageSelect(e, index, _eachLang)}
                      />{" "}
                      {_eachLang.lang}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </li>
      <li>
        <div className={classes.dropdown}>
          <button
            id="generedropdwn"
            onClick={openDropdwn}
            className={`${classes.dropdownBtn} ${classes.generedropdwn}`}
          >
            {dropdownData.genere.length !== 0
              ? [...dropdownData.genere].toString()
              : "All Generes"}
            <i className="fa fa-caret-down"></i>
          </button>
          {dropDownsShow.genereShow ? (
            <div className={classes.dropdown_content}>
              <ul>
                {dropdownData.generelist.map((_eachGenere, index) => {
                  return (
                    <li key={index}>
                      <input
                        type="checkbox"
                        id={_eachGenere.genere}
                        name={_eachGenere.genere}
                        checked={_eachGenere.isChecked}
                        onChange={(e) => onSelectGenere(e, index, _eachGenere)}
                      />{" "}
                      {_eachGenere.genere}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </li>
    </ul>
  );
};

export default Dropdowns;
