import { useState, useContext, useEffect } from "react";
import axios from "axios";
import AuthContext, { AuthContextTypes } from "../contexts/AuthContext";
import userProfileIcon from "../assets/icons/user-profile.svg";
import checkCircleIcon from "../assets/icons/check-circle.svg";
import xCircleIcon from "../assets/icons/x-circle.svg";
import leftHandUnfilledIcon from "../assets/icons/left-hand-unfilled.svg";
// import leftHandFilledIcon from "../assets/icons/left-hand-filled.svg";
import rightHandUnfilledIcon from "../assets/icons/right-hand-unfilled.svg";
// import rightHandFilledIcon from "../assets/icons/right-hand-filled.svg";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
import chevronUpIcon from "../assets/icons/chevron-up.svg";
import editIcon from "../assets/icons/edit-entity.svg";
import deleteIcon from "../assets/icons/delete-entity.svg";

interface RosterItemProps {
  athleteId: string;
}

interface AthleteData {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
  paddleSide: string;
  notes: string;
  isAvailable: boolean;
  email: string;
  isManager: boolean;
  phone: string;
  weight: number;
  birthDate: Date;
}

const RosterItem = ({ athleteId }: RosterItemProps): JSX.Element => {
  const { accessToken }: AuthContextTypes = useContext<AuthContextTypes | null>(
    AuthContext
  )!;
  // const [isEditable, setIsEditable] = useState<boolean>(false);   //  toggle to edit item
  const [athlete, setAthlete] = useState<AthleteData | null>(null);
  const [isNotesVisible, setIsNotesVisible] = useState<boolean>(false);

  useEffect(() => {
    const getAthleteDetails = async () => {
      try {
        const headers = { Authorization: `Bearer ${accessToken}` };
        const { data } = await axios.get(
          `http://localhost:8888/athletes/${athleteId}`,
          {
            headers,
            withCredentials: true,
          }
        );
        setAthlete(data);
      } catch (err) {
        console.log(err);
      }
    };

    getAthleteDetails();
  }, []);

  const handleToggleNotes = () => {
    setIsNotesVisible((isNotesVisible) => !isNotesVisible);
  };

  const handleEditAthlete = async () => {
    console.log("Edit");
  };
  const handleDeleteAthlete = async () => {
    console.log("Delete");
  };

  return (
    <article className="flex flex-col w-full mx-auto max-w-[448px] desktop:max-w-[1280px] border border-black mb-4 rounded-xl">
      <div className="flex justify-between bg-gray-border border-b border-black rounded-t-xl">
        <div className="flex items-center m-2 space-x-2">
          <img
            src={athlete?.isAvailable ? checkCircleIcon : xCircleIcon}
            alt={athlete?.isAvailable ? "Available" : "Unavailable"}
            className="w-6"
          />
          <h3 className="text-blue-light">
            {athlete?.firstName} {athlete?.lastName.slice(0, 1)}.{" "}
          </h3>
        </div>
        <div className="flex m-2">
          <img
            src={leftHandUnfilledIcon}
            alt="Left Side Unfilled"
            className="w-6"
          />
          <img
            src={rightHandUnfilledIcon}
            alt="Right Side Unfilled"
            className="w-6"
          />
        </div>
      </div>

      <div className="flex">
        <img
          src={userProfileIcon}
          alt="Placeholder Profile Picture"
          className="w-20 self-start my-2"
        />
        <div className="flex flex-wrap p-2">
          <div>
            <p className="my-0">
              {athlete?.weight} asdfja;sdjfasl asdfja;sdjfasl asdfja;sdjfasl
              asdfja;sdjfasl asdfja;sdjfasl asdfja;sdjfasl asdfja;sdjfasl
              asdfja;sdjfasl asdfja;sdjfasl asdfja;sdjfasl
            </p>
          </div>
        </div>
      </div>

      <div className="p-2">
        <div className="flex space-x-1 items-center">
          <span
            onClick={handleToggleNotes}
            className="flex space-x-1 items-center cursor-pointer"
          >
            <h4>Notes</h4>
            <img
              src={isNotesVisible ? chevronUpIcon : chevronDownIcon}
              alt={isNotesVisible ? "Chevron Up" : "Chevron Down"}
              className="w-4"
            />
          </span>
        </div>
        {isNotesVisible && <p>{athlete?.notes}</p>}
      </div>

      <div className="flex justify-end rounded-b-xl">
        <img
          src={editIcon}
          alt="Edit"
          onClick={handleEditAthlete}
          className="m-2 w-6 cursor-pointer"
        />
        <img
          src={deleteIcon}
          alt="Delete"
          onClick={handleDeleteAthlete}
          className="m-2 w-6 cursor-pointer"
        />
      </div>
    </article>
  );
};

export default RosterItem;
