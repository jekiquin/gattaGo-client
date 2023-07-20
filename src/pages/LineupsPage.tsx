import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useWindowSize from "../hooks/useWindowSize";
import useAxiosPrivate from "../hooks/usePrivateInterceptors";
// import useLogoutRedirect from "../hooks/useLogoutRedirect";
import { LineupData, RosterData } from "../interfaces/EntityData";
import { CreateNewLineupFormData } from "../interfaces/FormData";
import LineupBoatSection from "../components/LineupBoatSection";

const LineupsPage = (): JSX.Element => {
  const [teamLineups, setTeamLineups] = useState<LineupData[] | null>(null);
  const [activeLineup, setActiveLineup] = useState([]);
  const [rosterAthletes, setRosterAthletes] = useState<RosterData[]>([]);
  const { teamId } = useParams<string>();
  const { width } = useWindowSize();
  const axiosPrivate = useAxiosPrivate();
  // const logoutRedirect = useLogoutRedirect();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreateNewLineupFormData>({
    defaultValues: {
      activeLineupId: "new",
      lineupName: "",
    },
  });

  useEffect(() => {
    const getTeamLineups = async () => {
      try {
        const { data } = await axiosPrivate.get(`/teams/${teamId}/lineups`);
        setTeamLineups(data.lineups);
      } catch (err: any) {
        console.log(err);
      }
    };

    const getAthletes = async () => {
      try {
        const { data } = await axiosPrivate.get(`/teams/${teamId}/athletes`);
        setRosterAthletes(data);
      } catch (err: any) {
        console.log(err);
      }
    };

    getTeamLineups();
    getAthletes();
  }, []);

  //  Form submit to create new lineup or update existing lineup
  const handleFormSubmitCreateUpdateLineup = async ({}: // activeLineupId,
  // lineupName,
  CreateNewLineupFormData) => {
    //  Return if no lineup name and no active lineup selected
    console.log("Save function");
    // const getLineupAthletes = async () => {
    //   try {
    //     const { data } = await axiosPrivate.get(`teams/${teamId}/athletes`);
    //     console.log(data);
    //   } catch (err) {
    //     console.log(err);
    //   }

    //   //  Create new lineup
    //   try {
    //     //  when a lineup is chosen in dropdown list, make api request to get all lineup athletes
    //     //  API POST Request
    //   } catch (err) {}

    //   //  Update existing lineup
    //   try {
    //     //  API PUT request
    //   } catch (err) {}
  };

  //  Delete current lineup
  const handleFormSubmitDeleteLineup = async () => {
    const deleteSingleLineup = async (lineupId: string) => {
      try {
        await axiosPrivate.delete(`/teams/${teamId}/lineups/${lineupId}`, {
          withCredentials: true,
        });

        setValue("activeLineupId", "new");
        setValue("lineupName", "");
        setActiveLineup([]);
        setTeamLineups((prevLineups) =>
          prevLineups!.filter((lineup: LineupData) => lineup.id !== lineupId)
        );
      } catch (err: any) {
        console.log(err);
      }
    };

    if (getValues().activeLineupId === "new") return;
    deleteSingleLineup(getValues().activeLineupId);
  };

  //  Fetch single lineup order/athletes
  const handleLineupStatus = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (event.target.value === "new") {
      setValue("lineupName", "");
      setActiveLineup([]);
    } else {
      try {
        const { data } = await axiosPrivate.get(
          `/teams/${teamId}/lineups/${event.target.value}`
        );
        setActiveLineup(data.lineups[0].athletes);
        setValue("lineupName", data.lineups[0].name);
      } catch (err: any) {
        console.log(err);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center desktop:max-w-[1280px] mx-auto my-4 overflow-hidden">
        <div className="mb-4">
          <h1>Lineups</h1>
          {/* @ts-ignore */}
          {teamLineups && (
            <p className="text-black">
              {/* @ts-ignore */}
              Total: {teamLineups.length} lineup
              {/* @ts-ignore */}
              {teamLineups.length !== 1 && `s`}
            </p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <button
            onClick={handleSubmit(handleFormSubmitCreateUpdateLineup)}
            className="bg-green-light hover:bg-green-dark border-green-dark text-white p-2 rounded border"
          >
            Save Lineup
          </button>
          <div
            onClick={handleFormSubmitDeleteLineup}
            className="bg-orange-light hover:bg-orange-dark border-orange-dark text-white p-2 rounded border"
          >
            Delete Lineup
          </div>
        </div>
      </div>

      <form className="flex flex-col midMobile:flex-row p-2 mb-2 tablet:p-6 midMobile:space-x-4 tablet:space-x-6 desktop:max-w-[1280px] mx-auto bg-white border border-gray-border rounded-t w-full">
        <div className="flex flex-col mb-4 midMobile:w-[50%]">
          <label htmlFor="activeLineupId">
            <h3 className="text-blue-light">Active Lineup</h3>
          </label>
          <select
            {...register("activeLineupId")}
            name="activeLineupId"
            id="activeLineupId"
            defaultValue={"select"}
            className="px-2 py-3 bg-white-dark border border-gray-border rounded focus:outline-blue-light"
            onChange={handleLineupStatus}
          >
            <option disabled value="select">
              Select lineup
            </option>
            <option value="new">New lineup</option>
            {teamLineups &&
              // @ts-ignore
              teamLineups.map((lineup) => {
                return (
                  <option key={lineup.id} value={lineup.id}>
                    {lineup.name}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="flex flex-col midMobile:w-[50%]">
          <label htmlFor="lineupName">
            <h3 className="text-blue-light">Lineup Name</h3>
          </label>
          <input
            {...register("lineupName", {
              required: {
                value: true,
                message: "Lineup name field can't be empty!",
              },
            })}
            type="text"
            id="lineupName"
            name="lineupName"
            placeholder="Input lineup name"
            className="px-2 py-2.5 bg-white-dark border border-gray-border rounded focus:outline-blue-light"
          />
          {errors.lineupName && (
            <p className="text-red-500">{errors.lineupName.message}</p>
          )}
        </div>
      </form>

      <LineupBoatSection
        width={width}
        rosterAthletes={rosterAthletes}
        activeLineup={activeLineup}
      />
    </div>
  );
};

export default LineupsPage;
