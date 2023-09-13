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
import checkIcon from "../assets/icons/check.svg";
import clearIcon from "../assets/icons/cube-transparent.svg";
import shareIcon from "../assets/icons/share.svg";
import deleteWhiteIcon from "../assets/icons/delete-white-fill.svg";
import EmptyRaceDay from "../components/EmptyRaceDay";
import RaceSectionItem from "../components/RaceSectionItem";
import RaceOrderItem from "../components/RaceOrderItem";

//  Modal Button
import PlanBuilderModalButton from "../components/PlanBuilderModalButton";

interface PlanOrderData {
  id: string;
  section: string;
}

const RaceDayPlanBuilderPage = () => {
  const planSections = ["Regatta", "Weather", "Map", "Event", "Lineup", "Note"];
  const [planOrder, setPlanOrder] = useState<PlanOrderData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const { width } = useWindowSize();

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

  // Modal Toggle
  const handleToggleModal = () => {
    // if (isSaving || isDeleting || isFetching) return;
    setIsModalOpen((prev) => !prev);
  };

  return (
    <>
      <div className="w-full">
        <div className="flex flex-wrap justify-between items-center desktop:max-w-[1280px] mx-auto my-2 overflow-hidden">
          <div className="mb-2">
            <h1>Race Day</h1>
            {/* Hardcoded plan number */}
            <p className="text-black">{`Total: 0 Plans`}</p>
          </div>
          <div className="flex space-x-2 tablet:space-x-4 text-center">
            {/* Save Plan Button  */}
            <div className="flex items-center bg-green-light text-white p-1 midMobile:p-2 rounded border hover:bg-green-dark cursor-pointer">
              {width! >= 768 && (
                <p className="mr-2 text-lg">Save {width! >= 1280 && "Plan"}</p>
              )}
              <img src={checkIcon} alt="Save Plan" className="h-6" />
            </div>

            {/* Clear Plan Button  */}
            <div className="flex items-center bg-orange-light text-white p-1 midMobile:p-2 rounded border hover:bg-orange-dark cursor-pointer">
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

        <div className="flex justify-between desktop:max-w-[1280px] tablet:mx-auto my-2 overflow-y-scroll h-full">
          {/* Component Section - Side Panel in mobile, Visible in tablet onwards */}
          {(isModalOpen || width! >= 768) && (
            <div className="bg-slate-200 min-w-[20rem] tablet:w-[30%] h-[75%] mr-2 z-30 fixed overflow-auto tablet:static w-[calc(100%-2rem)] border-gray-border border">
              <h1>Race Plan</h1>
              {/* Plan Components */}
              <div className="flex flex-col">
                <h2 className="mt-4">
                  Click a section below to add to your plan!
                </h2>

                <div className="flex flex-col">
                  {planSections.map((planSection, index) => {
                    return (
                      <RaceSectionItem
                        key={index}
                        section={planSection}
                        setPlanOrder={setPlanOrder}
                      />
                    );
                  })}
                </div>
              </div>
              {planOrder.length === 0 ? (
                <h2 className="mb-4">
                  Select a component above to start building your race plan!
                </h2>
              ) : (
                <>
                  <h2 className="mt-4">Drag-and-drop to change plan order!</h2>
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
                              setPlanOrder={setPlanOrder}
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

          {/* Plan Section - Viewable/Editable components */}
          <div className="bg-red-light w-full">
            {planOrder.length === 0 && <EmptyRaceDay />}
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

export default RaceDayPlanBuilderPage;
