import { Response, Request, } from 'express';
import { Chance } from 'chance';
import { expect } from 'chai';
import proxyquire from 'proxyquire';
import { describe, it } from 'mocha';
import * as httpMocks from 'node-mocks-http';
import loki from "lokijs";
import { Events, GetEventsRequestModel } from "../models/calendar.request";

const chance: Chance.Chance = new Chance();

const lokiDBMock = new loki(chance.string());
const eventsMock = lokiDBMock.addCollection<Events>("events",{autoupdate: true});

const testCalendarController = proxyquire('../controllers/calendar.controller', {
    '../utils/database': {
        events: eventsMock,
        lokiDB: lokiDBMock
    }
});

const requestMock = httpMocks.createRequest();
const responseMock = httpMocks.createResponse();

const HttpStatusCode = {
    Ok: 200,
    InternalServerError: 500,
    NotFound: 404
};

describe('Calendar Controller', () => {
    let addEventsMethods: (req: Request, res: Response) => Promise<Response>;
    let getEventsMethods: (req: Request, res: Response) => Promise<Response>;
    let getEventByIDMethods: (req: Request, res: Response) => Promise<Response>;
    let updateEventByIDMethods: (req: Request, res: Response) => Promise<Response>;
    let deleteEventByIDMethods: (req: Request, res: Response) => Promise<Response>;
    
    let eventsRequest: Events;
    let eventsResponse: Events & LokiObj;
    let getEventsRequestModel: GetEventsRequestModel;

    beforeEach(() => {
        addEventsMethods = testCalendarController.addEvents;
        getEventsMethods = testCalendarController.getEvents;
        getEventByIDMethods = testCalendarController.getEventByID;
        updateEventByIDMethods = testCalendarController.updateEventByID;
        deleteEventByIDMethods = testCalendarController.deleteEventByID;
        eventsRequest = {
            title: chance.string(),
            description: chance.string(),
            start_date: chance.date(),
            end_date: chance.date()
        } as Events;

        eventsResponse = {
            ...eventsRequest,
            $loki: chance.integer(),
            meta: {
                created: chance.integer(),
                revision: chance.integer(),
                updated: chance.integer(),
                version: chance.integer()
            }
        } as Events & LokiObj;

        getEventsRequestModel = {
            pageNum: chance.integer()
        } as GetEventsRequestModel;
    });

    describe('Add Events', () => {
        it('Should return data insert success', async () => {
            eventsMock.insertOne = (): (Events & LokiObj)  => {
                return eventsResponse;
            };

            requestMock.body = eventsRequest;
            await addEventsMethods(requestMock, responseMock);
            expect(responseMock.statusCode).to.equal(HttpStatusCode.Ok);
        });

        it('Should return internal server error', async () => {
            eventsMock.insertOne = (): (Events & LokiObj)  => {
                throw new Error();
            };

            requestMock.body = eventsRequest;
            await addEventsMethods(requestMock, responseMock);
            expect(responseMock.statusCode).to.equal(HttpStatusCode.InternalServerError);
        });
    });

    describe('Get Events', () => {
        it('Should return get events success', async () => {
            lokiDBMock.getCollection = <F extends object = any>(): loki.Collection<F> => {
                return eventsMock as any;
            };

            requestMock.body = getEventsRequestModel;
            await getEventsMethods(requestMock, responseMock);

            expect(responseMock.statusCode).to.equal(HttpStatusCode.Ok);
        });
    });

    describe('Get Event By ID', () => {
        it('Should return get event by id success', async () => {
            eventsMock.findOne = () : (LokiObj & Events) | null => {
                return eventsResponse;
            };

            lokiDBMock.getCollection = <F extends object = any>(): loki.Collection<F> => {
                return eventsMock as any;
            };

            await getEventByIDMethods(requestMock, responseMock);

            expect(responseMock.statusCode).to.equal(HttpStatusCode.Ok);
        });

        it('Should return not found response for get event by id', async () => {
            eventsMock.findOne = () : (LokiObj & Events) | null => {
                return null;
            };

            lokiDBMock.getCollection = <F extends object = any>(): loki.Collection<F> => {
                return eventsMock as any;
            };

            await getEventByIDMethods(requestMock, responseMock);

            expect(responseMock.statusCode).to.equal(HttpStatusCode.NotFound);
        });
    });

    describe('Update Event By ID', () => {
        it('Should return event update success', async () => {
            eventsMock.findOne = () : (LokiObj & Events) | null => {
                return eventsResponse;
            };

            eventsMock.findAndUpdate = () : void => { /* Do Nothing */ };

            lokiDBMock.getCollection = <F extends object = any>(): loki.Collection<F> => {
                return eventsMock as any;
            };

            await updateEventByIDMethods(requestMock, responseMock);

            expect(responseMock.statusCode).to.equal(HttpStatusCode.Ok);
        });

        it('Should return not found response for event update', async () => {
            eventsMock.findOne = () : (LokiObj & Events) | null => {
                return null;
            };

            lokiDBMock.getCollection = <F extends object = any>(): loki.Collection<F> => {
                return eventsMock as any;
            };

            await updateEventByIDMethods(requestMock, responseMock);

            expect(responseMock.statusCode).to.equal(HttpStatusCode.NotFound);
        });
    });

    describe('Delete Event By ID', () => {
        it('Should return event delete success', async () => {
            eventsMock.findOne = () : (LokiObj & Events) | null => {
                return eventsResponse;
            };

            eventsMock.findAndRemove = () : void => { /* Do Nothing */ };

            lokiDBMock.getCollection = <F extends object = any>(): loki.Collection<F> => {
                return eventsMock as any;
            };

            await deleteEventByIDMethods(requestMock, responseMock);

            expect(responseMock.statusCode).to.equal(HttpStatusCode.Ok);
        });

        it('Should return not found response for event delete', async () => {
            eventsMock.findOne = () : (LokiObj & Events) | null => {
                return null;
            };

            lokiDBMock.getCollection = <F extends object = any>(): loki.Collection<F> => {
                return eventsMock as any;
            };

            await deleteEventByIDMethods(requestMock, responseMock);

            expect(responseMock.statusCode).to.equal(HttpStatusCode.NotFound);
        });
    });
});