import { nanoid } from "nanoid";

interface PlanOrderData {
  id: string;
  section: string;
}

interface RegattaSectionData {
  id: string;
  regattaName: string;
  regattaStartDate: Date;
  regattaEndDate: Date;
  regattaAddress: string;
  regattaContact: string;
  regattaEmail: string;
  regattaPhone: string;
}

interface NotesSectionData {
  id: string;
  notes: string;
}

interface RaceSectionItemProps {
  section: string;
  setPlanOrder: React.Dispatch<React.SetStateAction<PlanOrderData[]>>;
  setRegattaSectionArr: Function;
  setNotesSectionArr: Function;
}

const RaceSectionItem = ({
  section,
  setPlanOrder,
  setRegattaSectionArr,
  setNotesSectionArr,
}: RaceSectionItemProps) => {
  //  Refactor with switch statement for multiple section types
  const handleSetPlanOrder = () => {
    const id = nanoid();
    console.log(section)
    setPlanOrder((planOrder) => [...planOrder, { id, section }]);

    switch (section) {
      case "Regattas":
        setRegattaSectionArr((regattaSections: RegattaSectionData[]) => {
          return [
            ...regattaSections,
            {
              id,
              regattaName: "",
              regattaStartDate: null,
              regattaEndDate: null,
              regattaAddress: "",
              regattaContact: "",
              regattaEmail: "",
              regattaPhone: "",
            },
          ];
        });
        break;
      case "Notes":
        setNotesSectionArr((noteSections: NotesSectionData[]) => {
          return [
            ...noteSections,
            {
              id,
              notes: "",
            },
          ];
        });
        break;

      default:
        break;
    }
    // setRegattaSectionArr((regattaSections: RegattaSectionData[]) => {
    //   return [
    //     ...regattaSections,
    //     {
    //       id,
    //       regattaName: "",
    //       regattaStartDate: null,
    //       regattaEndDate: null,
    //       regattaAddress: "",
    //       regattaContact: "",
    //       regattaEmail: "",
    //       regattaPhone: "",
    //     },
    //   ];
    // });
  };

  return (
    <div
      onClick={handleSetPlanOrder}
      className="flex justify-center px-2 border border-black rounded-md my-1 p-1 cursor-pointer hover:bg-gray-border"
    >
      <h2 className="text-lg">{section}</h2>
    </div>
  );
};

export default RaceSectionItem;
