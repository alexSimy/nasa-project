FROM node:lts-alpine

#creating a folder for the app
WORKDIR /app

#copying only the package.json files because they are the only one needed in order to install dependencies
COPY package*.json ./

#breaking down command will help with docker caching and creating another layer only when the files are actually changing
COPY client/package*.json client/
#install only production dependecies without the devDepedencies
RUN npm run install-client --omit=dev

COPY server/package*.json server/
RUN npm run install-server --omit=dev

#copy only client code because at this stage we're building only the client
COPY client/ client/
#building the client-side app and exporting it to server/public
RUN BUILD_PATH=../server/public npm run build --prefix client

#copy the server in order to be able to start the app
COPY server/ server/

#setting a node user that has less privilegdes
USER node

#run cmd when docker container starts
CMD [ "npm", "start", "--prefix", "server" ]

#expose the port to outside interactions
EXPOSE 5000