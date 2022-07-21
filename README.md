# Klippo Online Clipboard API

## Submit Entry

```js
// Request
Endpoint: '/'
Method: POST
Body: {
    text: string,
    file: File | null
}
```

The body of the request could be JSON or FormData. FormData would be suitable in cases of uploading a media file.

```js
// Response
Status: 200
Body: {
    code: '###' // code to share,
    file: {
        link: 'link to the file',
        title: "string"
    }
}
```

## Retrieve Entry

```js
// Request
Endpoint: '/:code'
Method: GET

// Response
Status: 200
Body: {
    text: 'the text corresponding to the code',
    file: {
        'included if a file was present'
    }
}
```
