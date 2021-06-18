import { Response, Request, NextFunction } from 'express';

import { Events, GetEventsRequestModel } from '../models/calendar.request';
import { events, lokiDB } from '../utils/database';

export const addEvents = async (req: Request, res: Response) => {
  try {
    const event: Events = req.body;
    const data = events.insertOne(event);
    return res.json({ message: 'Data Inserted Successfully!!', data: data });
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
  const perPage = requestBody.pageSize || 10,
  page = requestBody.pageNum == 1 ? 0 : requestBody.pageNum - 1;
  const eventsCollection = lokiDB.getCollection<Events>('events');
  const result = eventsCollection
    .chain()
    .offset(perPage * page)
    .limit(perPage)
    .data({
      // removeMeta: true
    });
  const totalCount = eventsCollection.data.length;
  return res.json({
    totalCount,
    events: result
  });
};

export const getEventByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const eventCollections: Collection<Events> =
    lokiDB.getCollection<Events>('events');
  const result: (LokiObj & Events) | null = eventCollections.findOne({
    $loki: { $eq: parseInt(req.params['eventId']) },
  });
  if (result) {
    return res.json({ result });
  } else {
    return res.status(404).json({ message: 'Event Not Found' });
  }
};

export const updateEventByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const eventCollections: Collection<Events> =
    lokiDB.getCollection<Events>('events');
  const event: (LokiObj & Events) | null = eventCollections.findOne({
    $loki: { $eq: parseInt(req.params['eventId']) },
  });
  if (event) {
    const requestBody: Events = req.body;
    eventCollections.findAndUpdate(
      { $loki: { $eq: parseInt(req.params['eventId']) } },
      (event: Events) => {
        event.title = requestBody.title,
        event.description = requestBody.description
        event.start_date = requestBody.start_date
        event.end_date = requestBody.end_date
        event.is_private = requestBody.is_private
        event.event_status = requestBody.event_status
      }
    );
    return res.json({ message: 'Event Updated Successfully!!' });
  } else {
    return res.status(404).json({ message: 'Event Not Found!!' });
  }
};

export const deleteEventByID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const eventCollections: Collection<Events> =
    lokiDB.getCollection<Events>('events');
  const event: (LokiObj & Events) | null = eventCollections.findOne({
    $loki: { $eq: parseInt(req.params['eventId']) },
  });
  if (event) {
    const result = eventCollections.findAndRemove({
      $loki: { $eq: parseInt(req.params['eventId']) },
    });
    return res.json({ message: 'Event Removed Successfully!!' });
  } else {
    return res.status(404).json({ message: 'Event Not Found!!' });
  }
};
