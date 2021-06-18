import loki from "lokijs";
import { Events } from "../models/calendar.request";

const lokiDB = new loki("octopus_db.json", {autosave: true,
 autosaveInterval: 100 ,
 autoload: true,
 persistenceMethod: 'localStorage'});


const events = lokiDB.addCollection<Events>("events",{autoupdate: true});

events.insert([
  {
    title: "Event 1",
    description: "First Event Description",
    location: "Tatvasoft 1",
    start_date: new Date("01/01/2021"),
    end_date: new Date("01/01/2021"),
    event_status: "CONFIRMED",
  },
  {
    title: "Event 2",
    description: "Event Description",
    location: "Tatvasoft 2",
    start_date: new Date("02/01/2021"),
    end_date: new Date("02/01/2021"),
    event_status: "CONFIRMED",
  },
  {
    title: "Event 3",
    description: "Event Description",
    location: "Tatvasoft 3",
    start_date: new Date("02/01/2021"),
    end_date: new Date("02/01/2021"),
    event_status: "CONFIRMED",
  },
  {
    title: "Event 4",
    description: "Event Description",
    location: "Tatvasoft 4",
    start_date: new Date("02/01/2021"),
    end_date: new Date("02/01/2021"),
    event_status: "CONFIRMED",
  },
  {
    title: "Event 5",
    description: "Event Description",
    location: "Tatvasoft 5",
    start_date: new Date("02/01/2021"),
    end_date: new Date("02/01/2021"),
    event_status: "CONFIRMED",
  },
  {
    title: "Event 6",
    description: "Event Description",
    location: "Tatvasoft 6",
    start_date: new Date("02/01/2021"),
    end_date: new Date("02/01/2021"),
    event_status: "CONFIRMED",
  },
  {
    title: "Event 7",
    description: "Event Description",
    location: "Tatvasoft 7",
    start_date: new Date("02/01/2021"),
    end_date: new Date("02/01/2021"),
    event_status: "CONFIRMED",
  },
  {
    title: "Event 8",
    description: "Event Description",
    location: "Tatvasoft 8",
    start_date: new Date("02/01/2021"),
    end_date: new Date("02/01/2021"),
    event_status: "CONFIRMED",
  },
  {
    title: "Event 9",
    description: "Event Description",
    location: "Tatvasoft 9",
    start_date: new Date("02/01/2021"),
    end_date: new Date("02/01/2021"),
    event_status: "CONFIRMED",
  },
  {
    title: "Event 10",
    description: "Event Description",
    location: "Tatvasoft 10",
    start_date: new Date("02/01/2021"),
    end_date: new Date("02/01/2021"),
    event_status: "CONFIRMED",
  },
  {
    title: "Event 11",
    description: "Event Description",
    location: "Tatvasoft 11",
    start_date: new Date("02/01/2021"),
    end_date: new Date("02/01/2021"),
    event_status: "CONFIRMED",
  },
  {
    title: "Event 12",
    description: "Event Description",
    location: "Tatvasoft 12",
    start_date: new Date("02/01/2021"),
    end_date: new Date("02/01/2021"),
    event_status: "CONFIRMED",
  }
]);

export {lokiDB, events};
