import React, { useEffect, useLayoutEffect, useState } from "react";
import { BarTask } from "../../types/bar-task";
import { GanttContentMoveAction } from "../../types/gantt-task-actions";
import { Bar } from "./bar/bar";
import { BarSmall } from "./bar/bar-small";
import { Milestone } from "./milestone/milestone";

export type TaskItemProps = {
  task: BarTask;
  arrowIndent: number;
  taskHeight: number;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  isDelete: boolean;
  isSelected: boolean;
  rtl: boolean;
  onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent,
    setCurrTask?: React.Dispatch<React.SetStateAction<BarTask>>
  ) => any;
};

export const TaskItem: React.FC<TaskItemProps> = props => {
  const { task, isDelete, isSelected, onEventStart } = {
    ...props,
  };
  const [currTask, setCurrTask] = useState(task);
  const [taskItem, setTaskItem] = useState<JSX.Element>(<div />);

  useLayoutEffect(() => {
    setCurrTask(task);
  }, [task]);

  useEffect(() => {
    switch (currTask.typeInternal) {
      case "milestone":
        setTaskItem(<Milestone {...props} />);
        break;
      case "project":
        setTaskItem(
          <Bar {...props} task={currTask} setCurrTask={setCurrTask} />
        );
        break;
      case "smalltask":
        setTaskItem(<BarSmall {...props} />);
        break;
      default:
        setTaskItem(
          <Bar {...props} task={currTask} setCurrTask={setCurrTask} />
        );
        break;
    }
  }, [currTask, isSelected]);

  return (
    <g
      id={currTask.id}
      onKeyDown={e => {
        switch (e.key) {
          case "Delete": {
            if (isDelete) onEventStart("delete", currTask, e);
            break;
          }
        }
        e.stopPropagation();
      }}
      onMouseEnter={e => {
        onEventStart("mouseenter", currTask, e);
      }}
      onMouseLeave={e => {
        onEventStart("mouseleave", currTask, e);
      }}
      onDoubleClick={e => {
        onEventStart("dblclick", currTask, e);
      }}
      onClick={e => {
        onEventStart("click", currTask, e);
      }}
      onFocus={() => {
        onEventStart("select", currTask);
      }}
    >
      {taskItem}
    </g>
  );
};
