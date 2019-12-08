# A Flyer on the Wall Server

This contains the REST API for A Flyer on the Wall Client. https://github.com/dmac1108/a-flyer-on-the-wall-client

## Prepare for Testing

Create a test database.

Create a .env file with the following environment variables:
NODE_ENV=development
PORT=
DATABASE_URL=
TEST_DATABASE_URL=
CLIENT_ORIGIN=
JWT_SECRET=

Create the tables in the test database by running the script npm run migrate:test.




## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run migration `npm run migration`

Run migration Test `npm run migration:test`

Run the tests `npm test`

## Deploying

When your new project is read for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.