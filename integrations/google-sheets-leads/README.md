# Website appointment intake

Flow: submit name + telephone + consent → append to a private Google Sheet →
return a receipt → open a WhatsApp draft addressed to +7 700 360 01 80.
The visitor sends the WhatsApp message. A click is not a confirmed appointment.

## Destination

Create/use a private spreadsheet with the tab `Заявки с сайта`. Row 1 must match
`LEAD_HEADERS` in `Code.gs`, in that exact order. No patient records are public.
Set the Apps Script property `SPREADSHEET_ID` to the destination ID.

Deploy the reviewed script as a Web App, executing as the deploying account,
available to anonymous visitors. The app only appends validated requests and
returns a request-ID receipt; GET never returns sheet contents. Google Sheets
authorization must be completed by the owner before the app can store requests.

Put the verified `/exec` deployment URL in `js/lead-form-config.js`. Keep the
endpoint empty until an end-to-end synthetic request has appeared in the sheet
and its receipt has been received by the frontend.

## Verify before enabling

1. Submit an explicitly labelled synthetic request with consent.
2. Verify exactly one row with the request ID in the private sheet.
3. Retry the same ID and verify no duplicate row is added.
4. Confirm the visitor receives a save receipt and a WhatsApp draft containing
   the submitted name, phone, service, city and request ID.
5. Test rejection/timeout: show an error, retain inputs, no success conversion.
6. Check the five RU/KK pages and the mobile layout. Google Ads is recorded only
   after a positive save receipt, with the request ID for deduplication.

The public frontend contains no credentials or spreadsheet-reading capability.
Requests include attribution fields only in the private sheet, never patient
contact details in the analytics event. This module deliberately does not collect
medical notes, documents, or diagnoses from the visitor.
