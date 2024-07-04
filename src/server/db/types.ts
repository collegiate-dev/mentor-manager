export interface WebhookField {
  label: string;
  value: string | number | string[] | number[];
}

export interface WebhookPayload {
  data: {
    fields: WebhookField[];
  };
}
