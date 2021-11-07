import { useCallback, useEffect, useState } from "react";
import Card from "./components/Card/Card";
import MovieTrailerList from "./components/MovieTrailerList/MovieTrailerList";
import NavBar from "./components/NavBar/NavBar";
import { DropdownFilterContext } from "./store/dropdown-filter-contect";
import "./styles.css";

export default function App() {
  let filteredArray = [];
  const [moviesTrailerData, setMoviesTrailerData] = useState(null);
  const [filterValue, setfilterValue] = useState({
    filterValue: {
      key: "",
      type: "",
      checked: false
    },
    setfilterValue: () => {}
  });

  const [appliedFilter, setAppliedFilters] = useState({
    isApplied: false,
    appliedFilterData: null
  });

  const fetchMoviesData = useCallback(async () => {
    try {
      const response = await fetch(
        "https://peaceful-forest-62260.herokuapp.com/"
      );
      const jsonResponse = await response.json();
      if (jsonResponse) {
        setMoviesTrailerData(jsonResponse);
      }
      console.log(jsonResponse);
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    //storing selected filtered value from dropdown
    if (filterValue.filterValue.checked === true) {
      if (appliedFilter.appliedFilterData === null) {
        let idExist = filteredArray.indexOf(filterValue.filterValue.type) > -1;

        if (!idExist) {
          filteredArray.push(filterValue.filterValue.type);
        }
        setAppliedFilters({
          ...appliedFilter,
          isApplied: true,
          appliedFilterData: [...filteredArray]
        });
      } else {
        let filteredValues = [...appliedFilter.appliedFilterData];
        let idExist = filteredValues.indexOf(filterValue.filterValue.type) > -1;

        if (!idExist) {
          filteredValues.push(filterValue.filterValue.type);
        }
        setAppliedFilters({
          ...appliedFilter,
          isApplied: true,
          appliedFilterData: [...filteredValues]
        });
      }
    }
  }, [filterValue.filterValue.type]);

  useEffect(() => {
    fetchMoviesData();
  }, [fetchMoviesData]);
  //function to cancel selected filter
  const onCancelFilter = (e, index, filterValue) => {
    let filteredData = [...appliedFilter.appliedFilterData];
    filteredData.splice(index, 1);
    if (filteredData.length === 0) {
      setAppliedFilters({
        ...appliedFilter,
        isApplied: false,
        appliedFilterData: filteredData
      });
    } else {
      setAppliedFilters({
        ...appliedFilter,
        appliedFilterData: filteredData
      });
    }
  };

  return (
    <Card className="App">
      <DropdownFilterContext.Provider value={{ filterValue, setfilterValue }}>
        <NavBar movieLanguage={moviesTrailerData} />
        {appliedFilter.isApplied ? (
          <div className="filter_sction">
            Applied Filters:
            <ul>
              {appliedFilter.appliedFilterData.map((_filter, index) => {
                return (
                  <li key={index}>
                    <button onClick={(e) => onCancelFilter(e, index, _filter)}>
                      {_filter} X
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
        <MovieTrailerList movieTrailerDataList={moviesTrailerData} />
      </DropdownFilterContext.Provider>
    </Card>
  );
}
