export const EMAIL_PORT = Symbol('EMAIL_PORT');

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
};

export interface EmailPort {
  send(input: EmailMessage): Promise<void>;
}
