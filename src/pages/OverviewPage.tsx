import { useState, useEffect, useContext } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import AuthContext, { AuthContextTypes } from "../contexts/AuthContext";
import { axiosPrivate } from "../services/axios.service";
import useLogoutRedirect from "../hooks/useLogoutRedirect";
import createNew from "../assets/icons/create-new.svg";
import OverviewTeamItem from "../components/OverviewTeamItem";
import { TeamData } from "../interfaces/EntityData";

const OverviewPage = (): JSX.Element => {
  const { accessToken }: AuthContextTypes = useContext(AuthContext)!;
  const [myTeams, setMyTeams] = useState<TeamData[]>([]);

  const navigate: NavigateFunction = useNavigate();
  const logoutRedirect = useLogoutRedirect();

  useEffect(() => {
    const getAllTeams = async () => {
      const headers = { Authorization: `Bearer ${accessToken}` };
      try {
        const { data } = await axiosPrivate.get("/teams", {
          headers,
          withCredentials: true,
        });
        setMyTeams(data);
      } catch (err) {
        console.log(err);
        logoutRedirect("/login");
      }
    };

    getAllTeams();
  }, []);

  const handleCreateTeam = () => {
    navigate("../userIdPlaceholder/new");
  };

  return (
    <div className="p-4 desktop:w-[1280px] desktop:mx-auto flex flex-col">
      <div className="flex justify-between items-center text-center p-2 tablet:p-6 bg-white border border-gray-border rounded-t w-full">
        <h1 className="tablet:text-4xl">My Teams</h1>
        <h2
          className="hidden bg-gray-border tablet:block border-2 border-black rounded p-4 text-black hover:bg-green-light tablet:text-2xl cursor-pointer"
          onClick={handleCreateTeam}
        >
          Create New Team
        </h2>
      </div>

      {myTeams.map((team) => {
        return (
          <OverviewTeamItem
            key={team.id}
            id={team.id}
            name={team.name}
            myTeams={myTeams}
            setMyTeams={setMyTeams}
          />
        );
      })}

      <div
        className="tablet:hidden flex space-x-2 tablet:space-x-6 items-center p-2 tablet:px-6 bg-white border-x border-b border-gray-border hover:bg-green-light rounded-b cursor-pointer"
        onClick={handleCreateTeam}
      >
        <img
          src={createNew}
          alt="Create New Team"
          className="h-6 tablet:h-10"
        />
        <h4 className="tablet:text-xl">Create new team</h4>
      </div>
    </div>
  );
};

export default OverviewPage;
