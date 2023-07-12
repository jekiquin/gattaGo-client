import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import AuthContext, { AuthContextTypes } from "../contexts/AuthContext";
import useWindowSize from "../hooks/useWindowSize";
import useAxiosPrivate from "../hooks/usePrivateInterceptors";
import useLogoutRedirect from "../hooks/useLogoutRedirect";
import RosterItem from "../components/RosterItem";
import { RosterData } from "../interfaces/EntityData";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
import chevronUpIcon from "../assets/icons/chevron-up.svg";
import { paddlerSkillsArr } from "../data/paddlerSkillsArr";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { convertPaddlerSkillToField } from "../utils/convertPaddlerSkillToField";

const RosterPage = (): JSX.Element => {
  const { accessToken }: AuthContextTypes = useContext(AuthContext)!;
  const [roster, setRoster] = useState<RosterData[]>([]);
  const [sortableRoster, setSortableRoster] = useState<RosterData[]>([]);
  const [isNameOrderDesc, setIsNameOrderDesc] = useState<boolean>(false);
  const [isWeightOrderDesc, setIsWeightOrderDesc] = useState<boolean>(false);
  const [isFilterPanelVisible, setIsFilterPanelVisible] =
    useState<boolean>(false);
  const { teamId } = useParams<string>();
  const { width } = useWindowSize();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const logoutRedirect = useLogoutRedirect();

  //  Filter flags - contains all filter types
  const [filterFlags, setFilterFlags] = useState({
    isAvailable: false,
    isUnavailable: false,
    isOpen: false,
    isWomen: false,
    isLeft: false,
    isRight: false,
    isBoth: false,
    isNone: false,
    isSteers: false,
    isDrummer: false,
    isStroker: false,
    isCaller: false,
    isBailer: false,
    is200m: false,
    is500m: false,
    is1000m: false,
    is2000m: false,
    isVeteran: false,
    isSteadyTempo: false,
    isVocal: false,
    isTechnicallyProficient: false,
    isLeader: false,
    isNewbie: false,
    isRushing: false,
    isLagging: false,
    isTechnicallyPoor: false,
    isInjuryProne: false,
    isLoadManaged: false,
    isPacer: false,
    isEngine: false,
    isRocket: false,
  });

  useEffect(() => {
    const getAthletes = async () => {
      try {
        const headers = { Authorization: `Bearer ${accessToken}` };
        const { data } = await axiosPrivate.get(`/teams/${teamId}/athletes`, {
          headers,
          withCredentials: true,
        });
        setRoster(data);
        setSortableRoster(data);
      } catch (err) {
        console.log(err);
        logoutRedirect("/login");
      }
    };

    getAthletes();
  }, []);

  useEffect(() => {
    if (!Object.values(filterFlags).includes(true)) {
      setSortableRoster(roster);
    } else {
      setSortableRoster(
        roster
          .filter((paddler) => {
            //  Filter by availability
            if (!filterFlags.isAvailable && !filterFlags.isUnavailable)
              return true;
            if (paddler.athlete.isAvailable && filterFlags.isAvailable)
              return true;
            if (!paddler.athlete.isAvailable && filterFlags.isUnavailable)
              return true;
            return false;
          })
          .filter((paddler) => {
            //  Filter by eligibility
            if (!filterFlags.isOpen && !filterFlags.isWomen) return true;
            if (paddler.athlete.eligibility === "O" && filterFlags.isOpen)
              return true;
            if (paddler.athlete.eligibility === "W" && filterFlags.isWomen)
              return true;
            return false;
          })
          .filter((paddler) => {
            //  Filter by paddle side
            if (
              !filterFlags.isLeft &&
              !filterFlags.isRight &&
              !filterFlags.isBoth &&
              !filterFlags.isNone
            )
              return true;
            if (paddler.athlete.paddleSide === "L" && filterFlags.isLeft)
              return true;
            if (paddler.athlete.paddleSide === "R" && filterFlags.isRight)
              return true;
            if (paddler.athlete.paddleSide === "B" && filterFlags.isBoth)
              return true;
            if (paddler.athlete.paddleSide === "N/A" && filterFlags.isNone)
              return true;
          })
          .filter((paddler: any) => {
            const newFlags = {
              ...filterFlags,
              isAvailable: false,
              isUnavailable: false,
              isOpen: false,
              isWomen: false,
              isLeft: false,
              isRight: false,
              isBoth: false,
              isNone: false,
            };

            let flag = false;
            const foundFlags: any[] = Object.keys(newFlags).filter((flag) => {
              //  @ts-ignore
              if (newFlags[flag] === true) return flag;
            });

            if (foundFlags.length === 0) return true;

            foundFlags.forEach((foundFlag) => {
              if (
                //  @ts-ignore
                newFlags[foundFlag] &&
                paddler.athlete.paddlerSkills[0][foundFlag]
              ) {
                flag = true;
              }
            });

            return flag;
          })
      );
    }
  }, [filterFlags]);

  const handleEditAthlete = async (athleteId: string) => {
    navigate(`/:userId/roster/${teamId}/edit/${athleteId}`);
  };

  const handleDeleteAthlete = async (athleteId: string) => {
    try {
      const headers = { Authorization: `Bearer ${accessToken}` };
      await axiosPrivate.delete(`/athletes/${athleteId}`, {
        headers,
        withCredentials: true,
      });
      const rosterAfterDelete = roster.filter((data) => {
        return athleteId !== data.athleteId;
      });

      setRoster(rosterAfterDelete);
      setSortableRoster(rosterAfterDelete);
    } catch (err) {
      console.log(err);
      logoutRedirect("/login");
    }
  };

  //  Sorting

  const handleSortByName = async () => {
    setIsNameOrderDesc((prev) => !prev);
    setSortableRoster((prevRoster) =>
      prevRoster
        .sort((a, b) => {
          if (a.athlete.firstName > b.athlete.firstName)
            return isNameOrderDesc ? -1 : 1;
          if (a.athlete.firstName < b.athlete.firstName)
            return isNameOrderDesc ? 1 : -1;
          return 0;
        })
        .map((paddler) => paddler)
    );
  };

  const handleSortByWeight = async () => {
    setIsWeightOrderDesc((prev) => !prev);
    setSortableRoster((prevRoster) =>
      prevRoster
        .sort((a, b) => {
          if (a.athlete.weight > b.athlete.weight)
            return isWeightOrderDesc ? -1 : 1;
          if (a.athlete.weight < b.athlete.weight)
            return isWeightOrderDesc ? 1 : -1;
          return 0;
        })
        .map((paddler) => paddler)
    );
  };

  //  Filtering

  const handleToggleFilterPanel = () => {
    setIsFilterPanelVisible((prev) => !prev);
  };

  const handleSetFilterFlags = async (event: any) => {
    const { checked, value } = event.target;

    switch (value) {
      //  Availability
      case "filter-available":
        setFilterFlags({
          ...filterFlags,
          isAvailable: checked,
        });
        break;
      case "filter-unavailable":
        setFilterFlags({
          ...filterFlags,
          isUnavailable: checked,
        });
        break;
      //  Eligibility
      case "filter-open":
        setFilterFlags({
          ...filterFlags,
          isOpen: checked,
        });
        break;
      case "filter-women":
        setFilterFlags({
          ...filterFlags,
          isWomen: checked,
        });
        break;
      //  PaddleSide
      case "filter-left":
        setFilterFlags({
          ...filterFlags,
          isLeft: checked,
        });
        break;
      case "filter-right":
        setFilterFlags({
          ...filterFlags,
          isRight: checked,
        });
        break;
      case "filter-both":
        setFilterFlags({
          ...filterFlags,
          isBoth: checked,
        });
        break;
      case "filter-none":
        setFilterFlags({
          ...filterFlags,
          isNone: checked,
        });
        break;
      default:
        break;
    }
  };

  const handleSetSkillFlags = async (event: any) => {
    const { checked, value } = event.target;

    setFilterFlags({
      ...filterFlags,
      [value]: checked,
    });
  };

  return (
    <>
      <div className="flex flex-wrap justify-between items-center max-w-[448px] tablet:max-w-full desktop:max-w-[1280px] mx-auto my-4 tablet:mb-0 overflow-hidden">
        <div className="mb-4">
          <h1>Roster</h1>
          <p className="text-black">
            Total: {roster.length} paddler{roster.length !== 1 && `s`}
          </p>
        </div>

        <Link
          to={`../:userId/roster/${teamId}/new`}
          className="bg-green-light hover:bg-green-dark p-2 rounded border border-green-dark text-white"
        >
          Add Paddler
        </Link>
      </div>

      {/* Filter Panel */}

      <div className="flex flex-col mb-4 p-2 tablet:p-6 max-w-[448px] tablet:max-w-full desktop:max-w-[1280px] mx-auto bg-white border border-gray-border rounded-t w-full shadow-sm">
        <div
          onClick={handleToggleFilterPanel}
          className="flex space-x-2 cursor-pointer w-fit"
        >
          <h3 className="text-blue-light">Filter Panel</h3>
          {isFilterPanelVisible ? (
            <img src={chevronUpIcon} alt="Chevron Up" className="w-4" />
          ) : (
            <img src={chevronDownIcon} alt="Chevron Down" className="w-4" />
          )}
        </div>

        {isFilterPanelVisible && (
          <>
            <h3 className="text-black mt-2">General</h3>
            <div className="w-full flex flex-wrap tablet:flex-nowrap">
              {/* Availability */}
              <div className="flex flex-col w-[50%] mb-4">
                <h3>Status</h3>
                <div className="flex">
                  <input
                    type="checkbox"
                    id="filter-available"
                    value="filter-available"
                    onChange={handleSetFilterFlags}
                    checked={filterFlags.isAvailable}
                    className="mr-2 tablet:mr-4"
                  />
                  <label htmlFor="filter-available" className="truncate">
                    Available
                  </label>
                </div>
                <div className="flex">
                  <input
                    type="checkbox"
                    id="filter-unavailable"
                    value="filter-unavailable"
                    onChange={handleSetFilterFlags}
                    checked={filterFlags.isUnavailable}
                    className="mr-2 tablet:mr-4"
                  />
                  <label htmlFor="filter-unavailable" className="truncate">
                    Unavailable
                  </label>
                </div>
              </div>

              {/* Eligibility */}
              <div className="flex flex-col w-[50%] mb-4">
                <h3>Eligibility</h3>
                <div className="flex">
                  <input
                    type="checkbox"
                    id="filter-open"
                    value="filter-open"
                    onChange={handleSetFilterFlags}
                    checked={filterFlags.isOpen}
                    className="mr-2 tablet:mr-4"
                  />
                  <label htmlFor="filter-open">Open</label>
                </div>
                <div className="flex">
                  <input
                    type="checkbox"
                    id="filter-women"
                    value="filter-women"
                    onChange={handleSetFilterFlags}
                    checked={filterFlags.isWomen}
                    className="mr-2 tablet:mr-4"
                  />
                  <label htmlFor="filter-women">Women</label>
                </div>
              </div>

              {/* Paddle Side */}
              <div className="flex flex-col w-[50%] mb-4">
                <h3>Paddle Side</h3>
                <div className="flex">
                  <input
                    type="checkbox"
                    id="filter-left"
                    value="filter-left"
                    onChange={handleSetFilterFlags}
                    checked={filterFlags.isLeft}
                    className="mr-2 tablet:mr-4"
                  />
                  <label htmlFor="filter-left">Left</label>
                </div>
                <div className="flex">
                  <input
                    type="checkbox"
                    id="filter-right"
                    value="filter-right"
                    onChange={handleSetFilterFlags}
                    checked={filterFlags.isRight}
                    className="mr-2 tablet:mr-4"
                  />
                  <label htmlFor="filter-right">Right</label>
                </div>
                <div className="flex">
                  <input
                    type="checkbox"
                    id="filter-both"
                    value="filter-both"
                    onChange={handleSetFilterFlags}
                    checked={filterFlags.isBoth}
                    className="mr-2 tablet:mr-4"
                  />
                  <label htmlFor="filter-both">Both</label>
                </div>
                <div className="flex">
                  <input
                    type="checkbox"
                    id="filter-none"
                    value="filter-none"
                    onChange={handleSetFilterFlags}
                    checked={filterFlags.isNone}
                    className="mr-2 tablet:mr-4"
                  />
                  <label htmlFor="filter-none">None</label>
                </div>
              </div>
            </div>
            <h3 className="text-black mt-2">Paddle Skills</h3>{" "}
            <div className="flex flex-wrap tablet:flex-nowrap">
              {paddlerSkillsArr.map(({ category, fields }, index) => {
                return (
                  <div className="w-[50%] flex flex-col" key={index}>
                    <h3 className="w-full">
                      {capitalizeFirstLetter(
                        convertPaddlerSkillToField(category, 0)
                      )}
                    </h3>
                    {fields.map((skill, index) => {
                      return (
                        <div key={index} className="mr-2">
                          <input
                            type="checkbox"
                            id={`paddlerSkills-${skill}`}
                            value={skill}
                            onChange={handleSetSkillFlags}
                            // @ts-ignore
                            checked={filterFlags[skill]}
                            className="mr-2 tablet:mr-4"
                          />
                          <label htmlFor={`paddlerSkills-${skill}`}>
                            {convertPaddlerSkillToField(skill, 2)}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {roster.length !== 0 && (
        <>
          <div className="hidden bg-gray-border tablet:flex w-full max-w-[1280px] mx-auto py-2 justify-between text-black font-semibold border border-b-0 border-black rounded-t-xl">
            <div className="flex flex-row w-[448px] pl-16">
              <div
                onClick={handleSortByName}
                className="w-auto mr-[70px] flex space-x-2 items-center cursor-pointer"
              >
                <h2>Name</h2>
                <span>&#8645;</span>
              </div>
              <h2 className="mx-2">Status</h2>
              <h2 className="w-auto mx-3.5">Side</h2>
              <h2 className="mx-2">Elig.</h2>
              <h2
                onClick={handleSortByWeight}
                className="ml-2.5 mr-2 cursor-pointer text-center"
              >
                Wt. {` `}
                <span>&#8645;</span>
              </h2>
            </div>
            <h2 className="self-start">Skills</h2>
            <h2 className="w-[142px] text-center">Edit / Delete</h2>
          </div>

          <div className="tablet:border-x tablet:border-b border-black rounded-b-2xl max-w-[1280px] mx-auto">
            {sortableRoster.map((paddler) => {
              return (
                <RosterItem
                  key={paddler.athleteId}
                  athleteId={paddler.athleteId}
                  athlete={paddler.athlete}
                  width={width}
                  handleDeleteAthlete={handleDeleteAthlete}
                  handleEditAthlete={handleEditAthlete}
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default RosterPage;
