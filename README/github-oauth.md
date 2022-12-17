# GitHub OAuth Authentication
According to the project requirements, the user should be able to signup/login using **at least two** different [OAuth](https://en.wikipedia.org/wiki/OAuth) strategies (being **42** one of them). Here we'll explain how we implemented the **GitHub strategy** (the second strategy was optional).

## Authorizing our Application in GitHub
First step is to authorize our **hypertube** application to use the GitHub API to authenticate our users. In order to do that, one of the team members must authorize the app to use the GitHub API. In order to do that he must:

1. Navigate to the [profile settings](https://github.com/settings/profile).
2. Then click on [Developer settings](https://github.com/settings/apps) (at the time of writing this, way down at the bottom)
3. Then click on [OAuth Apps](https://github.com/settings/developers)
4. Finally click on the [New OAuth App](https://github.com/settings/applications/new) button.

Once there, we must register a new OAuth application by entering some information, like:

* Application name
* Homepage URL (The full URL to your application homepage.)
* Authorization callback URL (Our application’s callback URL. Read our [OAuth documentation](https://docs.github.com/v3/oauth/) for more information.)

The only problematic field is the **Authorization callback URL**; what the fuck do we enter here? Enter ``http://localhost:3000`` for now.

> Do **not** tick the **Enable Device Flow** checkbox.

Once you click on the **Register Application** button, we'll be taken to a screen where we can update all the information we just entered, and even upload a **logo** for our application. We can also check the **client ID** of our application as well as generate **client secrets**.

## Client ID and Client Secrets
Once we click on **Generate a new client secret** button, we'll be prompted to introduce our GitHub account passport again. After doing that, we just gotta copy two pieces of information:

* **Client ID**: this number will be available to the clients of **hypertube**.
* **Client Secret**: this number will only be available in our backend, where we'll use it to make API requests.

> **Important!** Make sure you copy the **client secret** and paste it in our ``.env`` file. Otherwise we'll have to generate a new one (Once we click on the **Update Application** button, the client secret will be hidden from us!) 

## Web Application Flow
The GitHub documentation contains a description of the [Web Application Flow](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps#web-application-flow), meaning the process to authenticate a user through the GitHub OAuth API. It works as follows:


1. In our front-end's **login page**, we'll set up a link with the GitHub logo and all.

2. When the user clicks the link, she's taken to a page where she authorizes **hypertube** to use her GitHub account to be used as an OAuth provider to authenticate herself into **hypertube**.

3. Once she clicks on **Authorize Karen** button (let's assume her name is Karen, why not, beautiful name), the github API will issue a request (using the ``GET`` method) to a particular URL in the **hypertube** domain. So in our backend, we'll have to handle this request in order to extract the included temporal **code** (valid for just 10 minutes) and other information included in the query string (this information will depend on the ``scope`` we selected when setting up the link in **step 1**)

4. In our backend, we must make a ``POST`` request to https://github.com/login/oauth/access_token, sending
  as parameters:
  * GitHub client id.
  * GitHub client secret.
  * The code.
  * A ``redirect_uri`` where the user should be send when authorized. It must be the same that the callback URL we set before!
    
  The **response** should look something like (assuming we set the ``Accept: application/json`` header in our request):
  ```
  {
    "access_token":"gho_16C7e42F292c6912E7710c838347Ae178B4a",
    "scope":"repo,gist",
    "token_type":"bearer"
  }
  ```

  We could use this GitHub access_token to hit the API and get user info, like for example the **email**.

5. Then we can use this email to check if the user already exists in our database:

  * If it exists, we pull her information and send it in our response, along with a hypertube JWT.
  * If it doesn't, we create a new user with that email in our database. Then we issue a JWT and send them to the user.

  A good idea could be to redirect in our front-end to the settings page, so that the user could fill information like the **username**, and optionally **first name** and **last name**.

### The OAuth link
Everything starts setting up a link in the front-end of our application. So in our **login page**, we'll set up a link with several segments in the query string:

* Basic URL: https://github.com/login/oauth/authorize
* Then the query string with the following parameters:

    * ``scope=user:email``
    * ``client_id=2bccde70e362bb130455``

> Remember that the beginning of a query string starts with ``?``, and the key/value pairs are separated with ``&``.

The whole enchilada looks like this:
https://github.com/login/oauth/authorize?scope=user:email&client_id=2bccde70e362bb130455

## The Authorization callback URL
Remember in **step 3** that request that GitHub API makes when the Karen clicks the juicy green button? Give it a go to see what happens. What happens is that the GitHub API makes a request to some URL in our **hypertube** domain. Yeah but what URL exactly? The one we choose when setting up the thing at the beginning, aka the **Authorization callback URL**. So if we left it as ``http://localhost:3000``, when the user click the green button, a request to ``http://localhost:3000/?code=8e47f8f432acc4a42afd`` is made. 

> Notice the **code** in the query string 😉

That URL doesn't make much sense. Since we're handling the user authentication in ``/api/sessions``, it makes sense to use as callback URL something more descriptive like:

http://localhost:3000/api/sessions/oauth/github

Daim, but we already set up the **Authorization callback URL** at the beginning right? dafuck do we do now? Easy:

1. Navigate to your GitHub [profile settings](https://github.com/settings/profile).
2. Then click on [Applications](https://github.com/settings/installations) (at the time of writing this, it's under **integrations**).
3. Then click on the [Authorized OAuth Apps](https://github.com/settings/applications)

> We can go there any time to confirm that our App has been authorized.

Change the URL and click on **Update application**.

## Our Backend
To recap, the URL we just mentioned it's where GitHub API will redirect the user, once she authorize **hypertube** to access her GitHub account (again, with the goal of authenticating her in hypertube). So in our Express app we'll set up an endpoint to handle ``GET`` requests against ``/api/sessions/oauth/github``.

1. First thing we gotta do there is to grab the **code** from the query string, and use it to make a ``POST`` request against the GitHub API to verify the code, and get details about the user (whatever we set in the ``scope`` in the original link).

> If we change the ``scope`` to ``user:profile``, we get all the information available in the user's GitHub profile. But, this could be nothing, if the user has an empty profile 😉.

2. We'll have to include the **Client Secret** (hopefully stored in ``.env``) in our request, so that GitHub allows it.
3. Extract the user information from the response (just email in this case), and authenticate the user sending her a JWT.
