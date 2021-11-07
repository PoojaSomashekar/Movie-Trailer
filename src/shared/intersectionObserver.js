import React, { useEffect } from "react";

let listenerCallbacks = new WeakMap();
let observer;

const handleIntersections = (entries) => {
  entries.forEach((_eachEntry) => {
    if (listenerCallbacks.has(_eachEntry.target)) {
      let callBack = listenerCallbacks.get(_eachEntry.target);
      if (_eachEntry.isIntersecting || _eachEntry.intersectionRatio > 0) {
        observer.unobserve(_eachEntry.target);
        listenerCallbacks.delete(_eachEntry.target);
        callBack();
      }
    }
  });
};

const getIntersectionObserver = () => {
  if (observer === undefined) {
    observer = new IntersectionObserver(handleIntersections, {
      rootMargin: "100px",
      threshold: "0.15"
    });
  }
  return observer;
};

const useIntersection = (el, callback) => {
  useEffect(() => {
    let target = el.current;
    let observer = getIntersectionObserver();
    listenerCallbacks.set(target, callback);
    observer.observe(target);

    return () => {
      listenerCallbacks.delete(target);
      observer.unobserve(target);
    };
  }, []);
};

export default useIntersection;
