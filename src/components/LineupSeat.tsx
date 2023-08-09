import { Active, Over } from "@dnd-kit/core";
import LineupSpot from "./LineupSpot";
import { ActiveLineupData } from "../interfaces/EntityData";

interface LineupSeatProps {
  seat: number;
  row?: ActiveLineupData[];
  overId: Over | string | number;
  activeId: Active | string | number;
}

const LineupSeat = ({ seat, row, overId, activeId }: LineupSeatProps) => {
  return (
    <div className="flex mx-auto w-fit">
      {row?.map(({ athlete, position }: ActiveLineupData) => {
        return (
          <LineupSpot
            key={athlete.id}
            seat={seat}
            position={position}
            athlete={athlete}
            overId={overId}
            activeId={activeId}
          />
        );
      })}
    </div>
  );
};

export default LineupSeat;
