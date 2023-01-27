# 42 OAuth Authentication
Regarding the **42 strategy**, it also works the same way as the one for **GitHub** (it follows the [OAuth](https://en.wikipedia.org/wiki/OAuth) after all).

> The [getting started guide](https://api.intra.42.fr/apidoc/guides/getting_started) it's pretty darn good.

## Create a New Application
First step is to register our application to use the **42 API**. We'll need to set up a few parameters:

* A descriptive name, **hypertube**.
* A **redirect URI**, which is a route in our app, where we'll redirect the user once she's been authenticated using her 42 credentials.
* A setting known as **Public**, in case we want out app to have public visibility in the internet (not needed in this case).
* The **scopes**, which define the information we'll need (the **Access the user public data** scope should be enough to cover the needs of our app).

## Getting our Credentials
Once our application has been registered in the **42 API**, we'll need to get two credentials:

* The **client uid**, an unique identifier for your application.
* The **client secret**, an secret passphrase for your application, which must be kept secret, and only used on server side, where users can't see it.

> Important to notice that the **client secret** has an expiration date of **1 month** after its creation, so we must remember to get a new one if the evaluation exceeds that date.

If your **client secret** expires, you gotta visit your [42 applications page](https://profile.intra.42.fr/oauth/applications), and **Generate new** secret to replace the expired one.

## Redirect users to request 42 access
After we copied the credentials to our ``.env`` files, we're given a URL that we should use as the starting point of the authentication process; meaning the link with the **42 icon** that the user clicks to initiate the OAuth web flow. This link has several parts:

* A base url: ``https://api.intra.42.fr/oauth/authorize``
* Then a **query string** with the following segments:

    * A **key** named ``client_id``, with the **value**... yep, you guessed it.
    * One ``redirect_uri`` key, where we put as a value the **hypertube URL** (a route in our app) where we want to redirect the user once she's been authenticated.
    * A ``response_type=code`` key/value pair.

After the user clicks on the link she's taken to the **42** page where she can **authorize** our app to access 42 information. If she does so, she'll be redirected to the URL we specified in the ``redirect_uri`` parameter of the link.

## Exchange your code for an access token
When the 42 API redirects the user to the ``redirect_uri``, it appends a query string which looks like this:
```
http://localhost/oauth/42?code=fbc166c638629c93e497628734bcd1db151c4b27a3bde5793e192f2bc831f3bb
```

So we gotta extract the value of the ``code`` key, and send it to **our backend**.

> We chose to send it in the **body** of a ``POST`` request, but it's not really important.

Once we've receive the **code** in our backend, we'll have to make a ``POST`` request to 42 (``https://api.intra.42.fr/oauth/token``), using the code, to receive an **access token**. In this request we need to use a **query string** with the following **required parameters**:

* ``grant_type`` with the value of ``authorization_code``
* ``client_id`` with the value of the client id.
* ``client_secret`` with our 42 secret.
* ``code`` with our 42 secret.

> Note that the **client secret** is only available in the backend, where we should store it in some ``.env`` file. In Node.js we would access it using ``process.env.FORTY_TWO_CLIENT_SECRET``.

## Using the Token to pull user data from 42
In order to get user information from the 42 API, we need to make a ``GET`` request to ``/v2/me`` (read [here](https://api.intra.42.fr/apidoc/2.0/users/me.html)), adding the token in an **authorization header**.

We'll use this information (mainly the email) to authenticate the user into **hypertube** using her 42 credentials.
