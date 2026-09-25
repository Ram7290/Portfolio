/**
 * Browser events that keep admin UI in sync without reloading the page.
 */

/** The admin changed messages in this tab (read/unread, delete). */
export const MESSAGES_CHANGED_EVENT = "admin:messages-changed";

/** A new contact message was pushed from the server (or the live stream reconnected). */
export const MESSAGE_RECEIVED_EVENT = "admin:message-received";
