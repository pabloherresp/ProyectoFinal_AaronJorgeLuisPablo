import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";

// This component allows the scroll to go to the beginning when changing the view,
// otherwise it would remain in the position of the previous view. 
// Investigate more about this React behavior :D 

const ScrollToTop = ({ loc, children }) => {
    const location = useLocation();
    const prevLocation = useRef(location);

    useEffect(() => {
        if (location !== prevLocation.current) {
            window.scrollTo(0, 0);
        }
        prevLocation.current = location;
    }, [location.pathname]);

    return children;
};

export default ScrollToTop;

ScrollToTop.propTypes = {
    location: PropTypes.object,
    children: PropTypes.any
};