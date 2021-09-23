## shSMS
#### Self Hosted Short Message Service

![shSMS](./docs/images/logo-01.png "shSMS")

---

For more information about the project and what it's about, please read the README for the frontend by [clicking here](https://github.com/pywkt/shsms-frontend). The following is an installation guide for setting up the backend server.

## Installation

There are several ways to host your server, shared hosting, private vps, personal server etc. For now we're just going to cover the first one. We're going to set up our server on Heroku and our database on mLab. I personally prefer using a vps, but it requires a little bit more set up and costs a monthly fee, which doesn't thrill me. I've been using Heroku/mLab for a few weeks and the only "issue" I encounter is the startup lag when the app goes to sleep because I don't really like using a service to ping the backend to keep and alive. If you want to do that that's cool, but it's just not my thing. I'm also in the process of testing the server on a Raspberry Pi and if all goes well I'll write instructions for that too, but for now, let's get going with Heroku and mLab.

**Note:** These installation instructions are a pretty lengthy document, but it actually goes pretty quick. Much of the length comes from me deciding to spend a decent amount of time explaining things so people who are unfamiliar with things like this don't feel so lost and doubtful when going through it for the first time, like I do quite often...

---

### mLab

1. Go to mlab.com and click the "Sign Up" button near the top of the screen.

2. Fill out the form to create an account/verify your email

3. Once verified, you'll be asked to fill out a short form about how you intend to use the service, I just put "Learn MongoDB", "Personalization" and "Javascript"

4. The next page should be your product selection. Choose the free one.

5. You'll be presented with some options to configure your database. Notice your server options are Amazon, Google or Microsoft...wonderful. I'm going to stick with Amazon, fuck it. I'm also going to rename my cluster from Cluster0 to `shsms-cluster` just because.

6. Click the "Create Cluster" button and wait a few minutes for the site to do it's thing.

Doing good so far? That last step should take about a minute or two. Next we'll set up our database to connect to our server on heroku

7. On dashboard you will see a button that says "Connect" click that to open a dialog
   
   ![shSMS](./docs/images/mlab-connect.png "Connect button")

8. You should be in the section "Add your current IP Address" when the dialog opens. In the two textfields near the bottom, enter a username/password. Note: this should not be the username/password you signed up to mLab with. This user will be the administrator of the database. I'll make my username `shSMS-admin`

9. Click "Create Database User"

10. Now click the "Allow Access from Anywhere" button in the dialog

11. The "IP Address" field should already be filled out with `0.0.0.0/0`. Click "Add IP Address"

_WHOOOOAAAAAAHHH hol' up bruh!_ Why the eff are we allowing access from anywhere?? Good question! BUT! We're just going to do this for now because we're using Heroku to host the server and the server needs to hit this database allll the time and who knows what IP address/port Heroku is gonna give our app. I haven't actually checked the IP address that Heroku dishes out, but I do know for certain that the port is different/random every time the app starts up so why would they bother giving us a static IP. Don't worry too hard though, once we set up our own server/vps we'll be able to control the IP/port and limit access to our database to only that, buuuut until then...."Abandon hope all ye blah blah whatever"

12. Click "Choose a connection Method"

13. Choose "Connect Your Application"

14. All we want from here is the URI they give us. We're going to take that and throw it in our server .env file after we make a few changes so copy/paste this somewhere for now.

   `mongodb+srv://shSMS-admin:<password>@shsms-cluster.lq31i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

15. On the Dashboad, click the button that says "Browse Collections"

16. Click "Add My Own Data"

17. In the dialog that pops up, enter a name for your database and a name for your first collection. I'm going to name my database name `shSMS` and my collection name `contacts` because shSMS uses that anyway so we may as well save it a step when it loads.

   **Note:** You can think of a collection like a folder in your database. Or a directory/path. shSMS will automatically create four collections if they aren't already there (contacts, messages, settings and media). Any other collections in your database will be ignored.

18. You should now see something like this

   ![shSMS](./docs/images/mlab-collections-empty.png "Empty collections")

And that should be it for setting up mLab! Now we can set up our Heroku account!

---

### Heroku

1. Go to https://heroku.com and sign up for an account. I reccommend using an anonymous email name/email because as you'll see in the first line of the TOS summary (after confirming your email)

> Effective October 1, 2020, you agree that your use of the Heroku Services is governed by the Salesforce Master Subscription Agreement...

The phrase _"Abandon hope all ye who enter here"_ immediatly comes to mind.

2. After accepting your fate, click the Accept button to enter the Heroku dashboard

3. Click the "Create New App" button

4. Give your app a name. I'm going to name mine `shsms-heroku-server-01` and click "Create App"

5. Near the top of the page there should be a horizontal menu, go to the "Settings" page. We need to add our environmental variables from our .env file to Heroku.
   
   ![shSMS](./docs/images/heroku-menu.png "Heroku menu")

6. In the "Config Vars" section, click the button to "Reveal Config Vars" and you should see two text fields. These corrilate to our .env file we made earlier. Let's add all of those now.

   **Protip:** Open a text editor and copy/paste this snippet and edit the information. Then copy/paste them in to Heroku one by one. We're going to use all of these again in a minute anyway. The capitalized value before the equal (=) sign is the KEY and after it is the VALUE, if that wasn't obvious...

   ```env
   TWILIO_ACCOUNT_SID=IE3c56b36c9832678w32df32f1x99c1arb
   TWILIO_AUTH_TOKEN=0re339862f7ef3aq38o2c8ch6km110aa
   TWILIO_PHONE_NUMBER=+12345678900
   MONGO_DB_URI=mongodb+srv://shSMS-admin:dont_hack_me_bro@shsms-cluster.lq31i.mongodb.net/shSMS?retryWrites=true&w=majority
   DEV_SERVER=https://shsms-heroku-server-01.herokuapp.com
   REQ_TOKEN=THIS_IS_YOUR_SECRET_KEY_IT_CAN_BE_ANYTHING
   ```
   Your final Config Vars should look something like this (but with your own values)

   ![shSMS](./docs/images/heroku-env-vars.png "Heroku vars")

7. Install the Heroku CLI because we're going to use this to deploy our project to Heroku. You might be asking yourself "Why aren't we just connecting it to a fork of the repo on Github??". Well, because I personally prefer to connect as little as possible to each other and have total control over where all the pieces are. This may be an extra step, but it allows me to make changes locally without having to send them to Github if I don't want to. To each their own I guess...

   If you're using a Debian based Linux distribution, Snapd should already be installed on your machine. Go to your terminal and install Heroku CLI by typing

   `sudo snap install --classic heroku`

   If you're on an Arch based system, try

   `yay -S heroku-cli`

   Installing the CLI is all we're going to do with it until we're ready to deploy our project. We'll come back to this after we set up Twilio.

---

### Twilio

This section is pretty simple, we're just going to tell Twilio to forward any incoming SMS to our backend.

1. Log in to Twilio and click the "Explore Options" in the left menu

2. Select `Functions` in the Developer Tools section

3. Click the "Create Service" button and name your service whatever you want. Mine will be called `shSMS`.

4. Click the "Add +" button at the top and select "Add Function"

5. This will create a function named something like "path_1". I renamed mine to `shSMS-forwarding`

6. Delete everything in the window on the right and replace it with this (change the value of `baseURL` to match your Heroku URL)

```javascript
    const axios = require('axios');

    exports.handler = function (context, event, callback) {
        const instance = axios.create({
            baseURL: 'https://shsms-heroku-server-01.herokuapp.com',
            timeout: 4000,
            headers: { 
                'X-Custom-Header': 'Twilio',
                "enc": "THIS_IS_YOUR_SECRET_KEY_IT_CAN_BE_ANYTHING"
            },
        });
    
        const mediaArr = [];
        for (const [key, value] of Object.entries(event)) {
            const isMedia = /(MediaUrl)/.test(key)
            if (isMedia) {
                mediaArr.push(value)
            }
        }

        instance.post(`/messages`, {
            date: new Date(),
            phoneNumber: event.From,
            message: event.Body,
            event: event,
            mediaNum: event.NumMedia,
            attachedMedia: mediaArr
        }).catch((error) => {
            console.error(error);
            return callback(error);
        });
    };
```

7. Click "Save"

8. Click the "Dependencies" option (located just above the Deploy All button)

9. In Module, enter `axios` and in Version, enter `0.20.0`

10. Click the "Deploy All" button and wait for it to build

11. Now go back to your Twilio Console and select `Phone Numbers > Manage > Active Numbers`

12. Select the phone number you want to use for shSMS. Make sure it's the same number you've been using for your .env files/heroku/etc

13. At the bottom in the Messaging section, set the following:

   A message comes in - function
   Service - shSMS
   Environment - ui
   Function path - shSMS-forwarding (or whatever you named the function we just made)

14. Click "Save" at the very bottom

That's it for the Twilio section! We're in the final sprint!! We're finally going to clone the backend repo!

---

### Clone Repo

1. Create a directory on your computer to hold the two repos. When we're all done we will have a folder (shSMS) with two folders inside (shsms-frontend and shsms-backend). I'm going to make mine in the home directory (`~`) of my machine. To be like me, open a terminal and type

   `cd ~ && mkdir shSMS && cd shSMS && && git clone https://github.com/pywkt/shsms-backend.git`

2. Go in to the repo folder

   `cd shsms-backend`

3. Create the .env file that will hold our environmental variables.

   `touch .env`

   What's an environmental variable? Glad you asked! It's basically some information that we need to use in our app that is specific to only us and we don't want anyone else to know about it. .env files are not published to the internet and should never be made public.

4. Open the .env file you just created and add the following, **be sure to update these with your own information**

**Note**: Files that begin with "." are hidden by default on many machines. You may need to change your display settings on your operating system to see them in the folder.

Personally, I prefer to just do it all in the terminal because we're already in there, why bother with all that double-clicking 🤷‍♀

Using the terminal:
   * `nano .env`
   * Copy/Paste the sample below
   * Change the values to match your own info
   * `Ctrl + O` (save changes)
   * `Enter` (confirm that you want to overwrite the file)
   * `Ctrl + X` (exit the Nano text editor)
   * `cat .env` (print the file to the screen and make sure your changes are correct and saved)
   * `clear` (clear the terminal in case some shady characters walk past you and want to peek at your screen)

Do not use any kind of quotes/spaces/parenthesis around the values after the equal (=) sign

Add the variables to the project. This should be familiar if you did the frontend. As my product manager would say, "Same shit, different toilet" 😐

Values to add:

   `TWILIO_ACCOUNT_SID` - Your Twilio SID (found on the main page of your Twilio console).

   `TWILIO_AUTH_TOKEN` - This is directly below the SID, but it's hidden. Just click the 'copy' button and paste it in.

   `TWILIO_PHONE_NUMBER` - The Twilio phone number you want to use for this instance of shSMS.

   `MONGO_DB_URI` - That MongoDB thing we copied earlier. Make sure to replace the password and 'database name.

   `DEV_SERVER` - The URL of your Heroku instance.

   `REQ_TOKEN` - Any "password" unique to you. This is used as validation in **all** requests to your server and will be used in several places and you can change it at any time.

   Your final .env file should look something like this:

   ```env
   TWILIO_ACCOUNT_SID=IE3c56b36c9832678w32df32f1x99c1arb
   TWILIO_AUTH_TOKEN=0re339862f7ef3aq38o2c8ch6km110aa
   TWILIO_PHONE_NUMBER=+12345678900
   MONGO_DB_URI=mongodb+srv://shSMS-admin:dont_hack_me_bro@shsms-cluster.lq31i.mongodb.net/shSMS?retryWrites=true&w=majority
   DEV_SERVER=https://shsms-heroku-server-01.herokuapp.com
   REQ_TOKEN=THIS_IS_YOUR_SECRET_KEY_IT_CAN_BE_ANYTHING
   ```

#### Time to deploy!!

1. Make sure you are in the root directory of the backend and log in to Heroku via the CLI by typing 
   
   `heroku login`
   
   It will probably open a browser to confirm/authorize, just go through all that...

2. Make sure you're in the main folder of the shSMS backend (`~/shSMS/shsms-backend`) and init the Heroku CLI/Git to that directory. Make sure to change the name of your Heroku app in the next command if you didn't set it up the same way as I did earlier

   `heroku git:remote -a shsms-heroku-server-01`

Me being the developer I am, I like to watch everything happen. 1. To make sure it's doing what it should. and 2. It makes me feel really good inside knowing it worked and I want to be there for every moment. To view the logs in realtime in Heroku, open up your project on Heroku and click the "More" button near the top and click "View Logs". This will take you to a live stream of what's happening in the app. This is also where you can restart your app if it crashes and won't come back for whatever reason.

   ![shSMS](./docs/images/heroku-more-button.png "Heroku more button")

3. Push the backend project to Heroku and watch the logs (if you did that step)

   `git push heroku master`

If all went well, you should see something like _State changed from starting to up_, _Listening blah blah_ and _Database: Connected > mongodb+srv..._

**_CONGRATS AGAIN!!_** 🎉🎉 The backend server should be all ready for us to connect to it! That really wasn't so bad, right??

[Click Here](https://github.com/pywkt/shsms-frontend) to get the frontend client up and running and build your APK!!
























   
