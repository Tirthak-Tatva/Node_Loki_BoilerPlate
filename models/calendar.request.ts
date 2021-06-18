export interface AddEventRequest {
  title: string;
  description: string;
  location?: string;
  type?: string;
  recurring?: boolean;
  recurrence_pattern?: string;
  is_fullDay?: boolean;
  start_date: Date;
  end_date: Date;
  private?: boolean;
  reminder_enable?: boolean;
  reminders?: Array<ReminderDurationSetting>;
  is_private?: boolean;
  sub_types?: Array<string>;
}

export interface Events extends AddEventRequest {
  event_status: "UNCONFIRMED" | "UPDATED" | "DELETED" | "CONFIRMED";
  version?: number;
}

export interface ReminderDurationSetting {
  hour: number;
  minutes: number;
}

export interface GetEventsRequestModel {
  /**
   * Used For Pagination/Lazy Loading. If not provided by default will be taken from backend
   * @example 1
   */
  pageNum: number;

  /**
   * Used For Pagination/Lazy Loading. If not provided by default all events sent from the backend
   * @example 10
   */
  pageSize?: number;

  /**
   * Search events with title
   * @example Doctor's Appointment
   */
  searchParam?: string;

  /**
   * Order By field of event (eg. StartDate/EndDate or title)
   * @example title
   */
  orderBy?: string;

  /** Order Direction Either ASC or DESC */
  orderDirection?: "asc" | "desc";
}
