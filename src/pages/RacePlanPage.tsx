import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import useWindowSize from "../hooks/useWindowSize";
import RaceSectionItem from "../components/RaceSectionItem";
import RaceOrderItem from "../components/RaceOrderItem";
import PlanBuilderModalButton from "../components/PlanBuilderModalButton";
import EmptyRacePlan from "../components/EmptyRacePlan";
import PlanViewSection from "../components/PlanViewSection";
import checkIcon from "../assets/icons/check.svg";
import clearIcon from "../assets/icons/cube-transparent.svg";
import shareIcon from "../assets/icons/share.svg";
import deleteWhiteIcon from "../assets/icons/delete-white-fill.svg";

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

interface LineupSectionData {
  id: string;
  lineupName: string;
  boatOrder: (string | null)[];
}

interface EventSectionData {
  id: string;
  eventName: string;
  eventDistance: string;
  eventLane: string;
  eventTime: Date;
}

interface NotesSectionData {
  id: string;
  notes: string;
}

const RacePlanPage = () => {
  const planSections = [
    "Regatta",
    "Weather",
    "Map",
    "Event",
    "Lineup",
    "Notes",
  ];
  const { width } = useWindowSize();
  const [planOrder, setPlanOrder] = useState<PlanOrderData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [_regattaSectionArr, setRegattaSectionArr] = useState<
    RegattaSectionData[] | []
  >([]);
  const [_eventSectionArr, setEventSectionArr] = useState<
    EventSectionData | []
  >([]);
  const [_lineupSectionArr, setLineupSectionArr] = useState<
    LineupSectionData | []
  >([]);
  const [_notesSectionArr, setNotesSectionArr] = useState<
    NotesSectionData | []
  >([]);

  //  useEffect to fetch current race plans

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPlanOrder((plans) => {
        const oldIndex = plans.map((plan) => plan.id).indexOf(active.id);
        const newIndex = plans.map((plan) => plan.id).indexOf(over.id);
        return [...arrayMove(plans, oldIndex, newIndex)];
      });
    }
  };

  const handleToggleModal = () => {
    // if (isSaving || isDeleting || isFetching) return;
    setIsModalOpen((prev) => !prev);
  };

  //  Save Plan Function
  const handleSavePlan = async () => {
    //  Create or update plan
    console.log('saving plan...')
  };

  //  Share Plan Function
  const handleSharePlan = async () => {
    //  Create or update plan
    console.log('sharing plan...')
  };

  //  Delete Plan Function
  const handleDeletePlan = async () => {
    //  Create or update plan
    console.log('deleting plan...')
    
  };


  return (
    <>
      <div className="w-full h-[100%]">
        <div className="flex flex-wrap justify-between items-center desktop:max-w-[1280px] mx-auto my-2 overflow-hidden">
          <div className="mb-2">
            <h1>Race Plans</h1>
            {/* Hardcoded plan number */}
            <p className="text-black">{`Total: 0 Plans`}</p>
          </div>
          <div className="flex space-x-2 tablet:space-x-4 text-center">
            {/* Save Plan Button  */}
            <div
              onClick={handleSavePlan}
              className="flex items-center bg-green-light text-white p-1 midMobile:p-2 rounded border hover:bg-green-dark cursor-pointer"
            >
              {width! >= 768 && (
                <p className="mr-2 text-lg">Save {width! >= 1280 && "Plan"}</p>
              )}
              <img src={checkIcon} alt="Save Plan" className="h-6" />
            </div>

            {/* Clear Plan Button  */}
            <div
              onClick={() => {
                if (planOrder.length === 0) return;
                setPlanOrder([]);
                setRegattaSectionArr([]);
                setLineupSectionArr([]);
                setEventSectionArr([]);
                setNotesSectionArr([]);
              }}
              className={`flex items-center  text-white p-1 midMobile:p-2 rounded border  
              ${
                planOrder.length === 0
                  ? "bg-gray-border cursor-not-allowed"
                  : "bg-orange-light hover:bg-orange-dark cursor-pointer"
              }`}
            >
              {width! >= 768 && (
                <p className="mr-2 text-lg">Clear {width! >= 1280 && "Plan"}</p>
              )}
              <img src={clearIcon} alt="Clear Plan" className="h-6" />
            </div>

            {/* Share Plan Button  */}
            <div className="flex items-center bg-blue-light text-white p-1 midMobile:p-2 rounded border hover:bg-blue-dark cursor-pointer">
              {width! >= 768 && (
                <p className="mr-2 text-lg">Share {width! >= 1280 && "Plan"}</p>
              )}
              <img src={shareIcon} alt="Share Plan" className="h-6" />
            </div>

            {/* Delete Plan Button  */}
            <div className="flex items-center bg-red-dark text-white p-1 midMobile:p-2 rounded border hover:bg-red-600 cursor-pointer">
              {width! >= 768 && (
                <p className="mr-2 text-lg">
                  Delete {width! >= 1280 && "Plan"}
                </p>
              )}
              <img src={deleteWhiteIcon} alt="Share Plan" className="h-6" />
            </div>
          </div>
        </div>

        <div className="flex justify-between desktop:max-w-[1280px] tablet:mx-auto my-2 overflow-auto h-full">
          {/* Component Section - Side Panel in mobile, Visible in tablet onwards */}
          {(isModalOpen || width! >= 768) && (
            <div className="bg-slate-200 midMobile:min-w-[20rem] tablet:w-[30%] h-[75%] mr-2 px-2 z-30 overflow-auto fixed left-0 tablet:static w-[calc(100%-1.5rem)] border-gray-border border shadow-md">
              <h1>Plan Builder</h1>
              <h2 className="">
                {planOrder.length} Section{planOrder.length !== 1 && "s"}
              </h2>
              {/* Plan Components */}
              <div className="flex flex-col">
                <h2 className="mt-4 mb-1 text-center">
                  Click a section below to add to your plan!
                </h2>

                <div className="flex flex-col">
                  {planSections.map((planSection, index) => {
                    return (
                      <RaceSectionItem
                        key={index}
                        section={planSection}
                        setPlanOrder={setPlanOrder}
                        setRegattaSectionArr={setRegattaSectionArr}
                        setEventSectionArr={setEventSectionArr}
                        setLineupSectionArr={setLineupSectionArr}
                        setNotesSectionArr={setNotesSectionArr}
                      />
                    );
                  })}
                </div>
              </div>
              {planOrder.length === 0 ? (
                <h2 className="my-4 text-center">
                  Select a component above to start building your race plan!
                </h2>
              ) : (
                <>
                  <h2 className="mt-4 text-center">
                    Drag-and-drop to change plan order!
                  </h2>
                  <div className="overflow-auto">
                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleDragEnd}
                      modifiers={[
                        restrictToParentElement,
                        restrictToVerticalAxis,
                      ]}
                    >
                      <SortableContext
                        items={planOrder}
                        strategy={verticalListSortingStrategy}
                      >
                        {planOrder.map((planSection) => {
                          return (
                            <RaceOrderItem
                              key={planSection.id}
                              id={planSection.id}
                              section={planSection.section}
                              planOrder={planOrder}
                              setPlanOrder={setPlanOrder}
                              setRegattaSectionArr={setRegattaSectionArr}
                              setEventSectionArr={setEventSectionArr}
                              setLineupSectionArr={setLineupSectionArr}
                              setNotesSectionArr={setNotesSectionArr}
                            />
                          );
                        })}
                      </SortableContext>
                    </DndContext>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Modal Overlay */}
          {isModalOpen && (
            <div
              className={`${
                width! < 768
                  ? "bg-black opacity-20 fixed top-0 left-0 w-screen h-screen"
                  : ""
              }`}
              onClick={() => {
                setIsModalOpen(false);
              }}
            ></div>
          )}

          {/* Plan Section - Viewable/Editable components */}
          <div className="bg-red-light w-full min-h-full">
            {planOrder.length === 0 ? (
              <EmptyRacePlan />
            ) : (
              <PlanViewSection
                planOrder={planOrder}
                setRegattaSectionArr={setRegattaSectionArr}
                setEventSectionArr={setEventSectionArr}
                setLineupSectionArr={setLineupSectionArr}
                setNotesSectionArr={setNotesSectionArr}
              />
            )}
          </div>
        </div>
      </div>
      <PlanBuilderModalButton
        width={width}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        handleToggleModal={handleToggleModal}
        // isSaving={isSaving}
        // isDeleting={isDeleting}
        // isFetching={isFetching}
      />
    </>
  );
};

export default RacePlanPage;
