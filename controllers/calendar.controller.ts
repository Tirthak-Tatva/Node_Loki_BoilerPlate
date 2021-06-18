import { Response, Request, NextFunction } from "express";

import MongoClient, { ObjectId } from "mongodb";
import { config } from "../config/const";
import { Events, GetEventsRequestModel } from "../models/calendar.request";
import { events, lokiDB } from "../utils/database";

export const addEvents = async (req: Request, res: Response) => {
  try {
    const event: Events = req.body;
    const data = events.insertOne(event);
    return res.json({ message: "Data Inserted Successfully!!", data: data });
  } catch (error) {
    return res.status(500).send({ Error: error });
  }
};

export const getEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestBody: GetEventsRequestModel = req.body;
  const perPage = requestBody.pageSize || 5,
  page = parseInt(Math.max(0, requestBody.pageNum - 1).toString());
  const client = await MongoClient.connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const eventsCollection = lokiDB.getCollection<Events>('events');
  const result = eventsCollection.chain().limit(perPage).offset(perPage * page).data({
    removeMeta: true
  });
  // if (requestBody.orderBy) {
  //   var sort: any = [
  //     requestBody.orderBy,
  //     requestBody.orderDirection == "asc" ? 1 : -1,
  //   ];
  // }

  // let events: Events[] = [];
  // events = await eventsCollection
  //   .find()
  //   .skip(perPage * page)
  //   .limit(perPage)
  //   .sort([sort])
  //   .toArray();
  const totalCount = eventsCollection.data.length;
  client.close();
  return res.json({ totalCount, events: result, nextPageId: requestBody.pageNum + 1 });
};

export const getEventByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const client = await MongoClient.connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("OctopusMock");

  const eventsCollection = db.collection("calendar_events");
  let event: Events;
  try {
    event = await eventsCollection.findOne({
      _id: new ObjectId(req.params.eventId.toString()),
    });
  } catch (error) {
    return res.status(404).json({ message: "Event Not Found" });
  }

  return res.json({ event });
};

export const updateEventByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const client = await MongoClient.connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("OctopusMock");

  const eventsCollection = db.collection("calendar_events");
  let event: Events;
  try {
    await eventsCollection.updateOne(
      {
        _id: new ObjectId(req.params.eventId.toString()),
      },
      { $set: { ...req.body } }
    );

    event = await eventsCollection.findOne({
      _id: new ObjectId(req.params.eventId.toString()),
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Event Not Found" });
  }

  return res.json({ event });
};

export const deleteEventByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const client = await MongoClient.connect(config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("OctopusMock");

  const eventsCollection = db.collection("calendar_events");
  let event: Events;
  try {
    await eventsCollection.updateOne(
      {
        _id: new ObjectId(req.params.eventId.toString()),
      },
      { $set: { event_status: "DELETED" } }
    );

    event = await eventsCollection.findOne({
      _id: new ObjectId(req.params.eventId.toString()),
    });
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "Event Not Found" });
  }

  return res.json({ event });
};
