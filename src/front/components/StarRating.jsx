import React, { useEffect, useState } from "react";

const StarRating = ({ rating, onChange = null, precision = 0.5, variable = true, small=false}) => {
	const [hover, setHover] = useState(null);
	const [previous, setPrevious] = useState(null)

	const getStarClass = (index) => {
		const value = hover ?? rating;
		if (value >= index + 1) return "fa-solid fa-star";
		if (value >= index + 0.5) return "fa-solid fa-star-half-stroke";
		return "fa-regular fa-star";
	};

	const handleClick = (index, event) => {
		if(onChange != null){

			const { left, width } = event.currentTarget.getBoundingClientRect();
			const x = event.clientX - left;
			const clickedValue = x < width / 2 ? index + 0.5 : index + 1;
			
			onChange(previous == 0.5 ? 0 : clickedValue);
			setPrevious(previous == 0.5 ? 0 : clickedValue)
		}
	};

	const handleMouseMove = (index, event) => {
		if (variable) {

			const { left, width } = event.currentTarget.getBoundingClientRect();
			const x = event.clientX - left;
			const hoveredValue = x < width / 2 ? index + 0.5 : index + 1;
			setHover(hoveredValue);
		}
	};



	return (
		<div style={{ display: "flex"}}>
			{[...Array(5)].map((item, i) => <i key={i} className={`${getStarClass(i)} TextSecondary RatingStar fs-4`}
				onClick={(e) => handleClick(i, e)}
				onMouseMove={(e) => handleMouseMove(i, e)}
				onMouseLeave={() => setHover(null)}
			/>)}
		</div>
	);
};

export default StarRating;