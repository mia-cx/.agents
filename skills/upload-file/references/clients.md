# Desktop client configs

Both point at the same worker as `scripts/upload.sh`. Substitute the worker's `AUTH_KEY` for `<AUTH_KEY>`.

## ShareX (Windows)

Destinations → Custom Uploader Settings → New, or import this `.sxcu`:

```json
{
  "Version": "17.0.0",
  "Name": "i.mia.cx",
  "DestinationType": "ImageUploader, TextUploader, FileUploader",
  "RequestMethod": "POST",
  "RequestURL": "https://i.mia.cx/upload",
  "Parameters": { "filename": "{filename}" },
  "Headers": { "x-auth-key": "<AUTH_KEY>" },
  "Body": "Binary",
  "URL": "{json:image}",
  "DeletionURL": "{json:deleteUrl}"
}
```

Drop the `filename` parameter to have the worker assign a random UUID instead of reusing the capture's name.

## ishare (macOS)

`brew install --cask ishare`, then Settings → Uploaders → import a `.iscu`. ishare uses its own spec, **not** ShareX's `.sxcu`:

```json
{
  "name": "i.mia.cx",
  "requestURL": "https://i.mia.cx/upload",
  "requestBodyType": "binary",
  "headers": { "x-auth-key": "<AUTH_KEY>" },
  "responseURL": "{{image}}",
  "deletionURL": "{{deleteUrl}}",
  "deleteRequestType": "GET"
}
```

Verify this one against a real capture before relying on it: the worker rejects uploads with a 400 unless the client sends both `content-type` and `content-length`, and ishare's binary mode has not been confirmed to set them. If it 400s, the fix belongs in the worker — make those headers optional and fall back to `application/octet-stream`.

ishare has no URL-parameter templating, so uploads from it get a UUID key with no extension. The worker stores the content type on the R2 object, so links still render correctly in a browser.
