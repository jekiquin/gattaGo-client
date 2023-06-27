import { NavLink } from "react-router-dom";
import homeIcon from "../assets/icons/home-navbar.svg";
import rosterIcon from "../assets/icons/roster-navbar.svg";
import lineupsIcon from "../assets/icons/lineups-navbar.svg";
import scheduleIcon from "../assets/icons/calendar-navbar.svg";

interface NavBarProps {
  teamId: string;
}

const NavBar = ({ teamId }: NavBarProps) => {
  return (
    <div className="flex mx-auto justify-center desktop:max-w-[1280px] text-white border-2 border-blue-dark rounded-b-2xl">
      <NavLink
        to={`../:userId/dashboard/${teamId}`}
        className={`flex flex-col items-center p-2 tablet:p-4 bg-blue-light hover:bg-blue-dark w-[25%] rounded-bl-xl border-r border-blue-dark`}
      >
        <img src={homeIcon} alt="Home" className="w-6 tablet:w-8" />
        <p className="tablet:text-xl">Dashboard</p>
      </NavLink>
      <NavLink
        to={`../:userId/roster/${teamId}`}
        className="flex flex-col items-center p-2 tablet:p-4 bg-blue-light hover:bg-blue-dark w-[25%] border-x border-blue-dark"
      >
        <img src={rosterIcon} alt="Roster" className="w-6 tablet:w-8" />
        <p className="tablet:text-xl">Roster</p>
      </NavLink>
      <NavLink
        to={`../:userId/lineups/${teamId}`}
        className="flex flex-col items-center p-2 tablet:p-4 bg-blue-light hover:bg-blue-dark w-[25%] border-x border-blue-dark"
      >
        <img src={lineupsIcon} alt="Lineups" className="w-6 tablet:w-8" />
        <p className="tablet:text-xl">Lineups</p>
      </NavLink>
      <NavLink
        to={`../:userId/schedule/${teamId}`}
        className="flex flex-col items-center p-2 tablet:p-4 bg-blue-light hover:bg-blue-dark w-[25%] rounded-br-xl border-l border-blue-dark"
      >
        <img src={scheduleIcon} alt="Schedule" className="w-6 tablet:w-8" />
        <p className="tablet:text-xl">Schedule</p>
      </NavLink>
    </div>
  );
};

export default NavBar;
