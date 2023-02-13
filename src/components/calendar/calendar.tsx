import React, { ReactChild } from "react";
import { ViewMode } from "../../types/public-types";
import { TopPartOfCalendar } from "./top-part-of-calendar";
import { getDaysInMonth, getLocalDayOfWeek } from "../../helpers/date-helper";
import { DateSetup } from "../../types/date-setup";
import styles from "./calendar.module.css";
import moment from "moment";

export type CalendarProps = {
  dateSetup: DateSetup;
  locale: string;
  viewMode: ViewMode;
  rtl: boolean;
  headerHeight: number;
  columnWidth: number;
  fontFamily: string;
  fontSize: string;
};

export const CalendarRaw: React.FC<CalendarProps> = ({
  dateSetup,
  locale,
  rtl,
  headerHeight,
  columnWidth,
  fontFamily,
  fontSize,
}) => {
  const topDefaultHeight = headerHeight * 0.4;
  const bottomValueYStart = headerHeight * 0.8;

  const getCalendarValuesForYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];

    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const bottomValue = date.getFullYear();
      bottomValues.push(
        <text
          key={bottomValue}
          y={bottomValueYStart}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (i === 0 || bottomValue !== dateSetup.dates[i - 1].getFullYear()) {
        const topValue = bottomValue.toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + bottomValue + 1) * columnWidth;
        } else {
          xText = (6 + i - bottomValue) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={headerHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForMonth = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];

    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const dateFullYear = date.getFullYear();
      const bottomValue = moment(date).format("MMM");
      bottomValues.push(
        <TopPartOfCalendar
          key={bottomValue + dateFullYear}
          value={`${bottomValue}, ${dateFullYear}`}
          x1Line={columnWidth * i}
          y1Line={0}
          y2Line={headerHeight}
          xText={columnWidth * i + columnWidth * 0.5}
          yText={headerHeight * 0.6}
        />
      );
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForWeek = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    let weeksCount: number = 1;

    const dates = dateSetup.dates;

    for (let i = dates.length - 1; i >= 0; i--) {
      const date = moment(dates[i]);
      let topValue = "";

      const daysInWeek: number[] = [];

      for (let day = 0; day < 7; day++) {
        daysInWeek.push(moment(date).add("day", day).date());
      }

      const weekFragment = columnWidth / 7;
      daysInWeek.forEach((weekDay, index) => {
        bottomValues.push(
          <text
            key={`${date.toDate().getTime()} ${index}`}
            y={bottomValueYStart}
            x={
              columnWidth * i +
              +rtl +
              weekFragment * (index + 1) -
              weekFragment * 0.5
            }
            className={styles.calendarBottomText}
          >
            {weekDay}
          </text>
        );
      });

      if (daysInWeek[0] > daysInWeek[6]) {
        const nextMont = moment(date).add("month", 1);

        if (date.year() === nextMont.year()) {
          topValue = `${date.format("MMM")} - ${nextMont.format(
            "MMM"
          )}, ${date.format("YY")}`;
        } else {
          topValue = `${date.format("MMM")}, ${date.format(
            "YY"
          )} - ${nextMont.format("MMM")}, ${nextMont.format("YY")}`;
        }
      } else {
        topValue = `${date.format("MMM")}, ${date.format("YY")}`;
      }

      if (topValue) {
        // if last day is new month
        if (i !== dates.length - 1) {
          topValues.push(
            <TopPartOfCalendar
              key={`${date.toDate().getTime()} ${topValue}`}
              value={topValue}
              x1Line={columnWidth * i + weeksCount * columnWidth}
              y1Line={0}
              y2Line={headerHeight}
              xText={columnWidth * i + columnWidth * weeksCount * 0.5}
              yText={topDefaultHeight}
            />
          );
        }
        weeksCount = 0;
      }
      weeksCount++;
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];

    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = `${getLocalDayOfWeek(date, locale, "short")}, ${date
        .getDate()
        .toString()}`;

      bottomValues.push(
        <text
          key={date.getTime()}
          y={bottomValueYStart}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (
        i + 1 !== dates.length &&
        date.getMonth() !== dates[i + 1].getMonth()
      ) {
        const dateFullYear = date.getFullYear();
        const topValue = `${moment(date).format("MMM")}, ${dateFullYear}`;

        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * (i + 1)}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={
              columnWidth * (i + 1) -
              getDaysInMonth(date.getMonth(), dateFullYear) * columnWidth * 0.5
            }
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  let topValues: ReactChild[] = [];
  let bottomValues: ReactChild[] = [];
  switch (dateSetup.viewMode) {
    case ViewMode.Year:
      [topValues, bottomValues] = getCalendarValuesForYear();
      break;
    case ViewMode.Month:
      [topValues, bottomValues] = getCalendarValuesForMonth();
      break;
    case ViewMode.Week:
      [topValues, bottomValues] = getCalendarValuesForWeek();
      break;
    case ViewMode.Day:
      [topValues, bottomValues] = getCalendarValuesForDay();
      break;
  }
  return (
    <g className="calendar" fontSize={fontSize} fontFamily={fontFamily}>
      <rect
        x={0}
        y={0}
        width={columnWidth * dateSetup.dates.length}
        height={headerHeight}
        className={styles.calendarHeader}
      />
      {bottomValues} {topValues}
    </g>
  );
};

export const Calendar = React.memo(CalendarRaw, (prev, next) => {
  return (
    prev.columnWidth === next.columnWidth &&
    prev.viewMode === next.viewMode &&
    prev.dateSetup.dates.length === next.dateSetup.dates.length
  );
});
