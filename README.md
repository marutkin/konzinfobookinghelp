# konzinfobookinghelp
Auto fill sensetive data from env file into chrome browser session in single action.

Env fields:
# App info
PORT=3000

# Replace values with your booking info:
USER_NAME=Ivan Ivanov
USER_EMAIL=ivan.ivanov@gmail.com   
USER_PHONE=+381111111111
USER_PASSPORT_NUMBER=761111111
USER_CITIZENSHIP=Russian Federation
USER_JMBG=111111111111

How to start:

1. Replace boilerplate values in .env file.

2. Run script:

    2.1 For Windows start `viza.bat` file.

    2.2 For Unix go to terminal and run: `npm i && node --env-file=.env app.js`
