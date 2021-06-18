import loki from "lokijs";
import { Events } from "../models/calendar.request";

const lokiDB = new loki("octopus_db.json", {
  env: "NODEJS",
  persistenceMethod: "memory",
  autosaveInterval: 1000
});


const events = lokiDB.addCollection<Events>("events");

events.insert([
  {
    title: "Event 1",
    description: "First Event Description",
    location: "Tatvasoft",
    start_date: new Date("01/01/2021"),
    end_date: new Date("01/01/2021"),
    event_status: "CONFIRMED",
  },
  {
    title: "Event 2",
    description: "Second Event Description",
    location: "Tatvasoft",
    start_date: new Date("02/01/2021"),
    end_date: new Date("02/01/2021"),
    event_status: "CONFIRMED",
  },
]);

export {lokiDB, events};
