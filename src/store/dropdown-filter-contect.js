import React, { createContext } from "react";

export const DropdownFilterContext = createContext({
  filterValue: {
    key: "",
    type: "",
    checked: false
  },
  setfilterValue: () => {}
});
