/* interface to send emails */
export interface RequestSendEmailsInterface {
  from: string;
  to: string;
  message: string;
  type: string;
  subject: string;
}
