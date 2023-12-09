import { useState } from "react";

// Contains type of info stored in our event box.
type BoxProps = {
  eventTitle: string;
  startDate: string; // Wanted to use the Date type, but had issues, will alter based off what the backend is
  endDate: string;
  description: string;
  imagePath: string;
  handleClick?: () => void;
  // Add other data as required
  // Add image stuff later once figure it out / if theres even an image that will be returned
}

const Box = ({
  eventTitle,
  startDate,
  endDate,
  description,
  imagePath,
}: BoxProps) => {

  const [expanded, setExpanded] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleClick = () => {
    if (isButtonDisabled) return;
    setExpanded(!expanded);
    setIsButtonDisabled(true);
    setTimeout(() => setIsButtonDisabled(false), 500);
  }

  return (
    <div className="flex mx-5 flex-row mt-4 items-right text-xs rounded-lg
     bg-slate-200 shadow-lg"
      role='button'
      tabIndex={0}
      onKeyDown={handleClick}
      onClick={handleClick}>
      {/* <span className="flex-none">
        <Image
          src={imagePath}
          alt="event image"
          width={500}
          height={500}
          className="w-20 h-20 ml-1 rounded-full scale-75"
        />
      </span> */}
      <div className="flex flex-col ml-2 mr-2">
        <span className="font-bold text-sm pt-2">
          {eventTitle}
        </span>
        <div className="pt-1 italic border-spacing-2">
          {startDate} - {endDate}
        </div>

        <div className={`pt-1 ${!expanded && "line-clamp-1"} relative mb-2`}>
          {description}
        </div>

      </div>

      <div className="items-right mr-2 -mt-1">
        <svg fill="None" viewBox="0 0 30 30" strokeWidth={1.5}
          stroke="black" className="w-7 h-7 mt-8">;
          <path
            // Used icons from https://heroicons.com/
            // Open source, MIT license. 
            d={expanded ? "M4.5 15.75l7.5-7.5 7.5 7.5"
              : "M19.5 8.25l-7.5 7.5-7.5-7.5"
            }




          




          />
        </svg>
      </div>

    </div>
  );
};

export default Box;