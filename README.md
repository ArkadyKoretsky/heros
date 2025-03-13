# Overview

This monorepo contains 3 microservices:

- Superheroes - Responsible for managing superheroes DB.
- Timers - Responsible for managing scheduled tasks in DB that related to superhero.
- Schedulers - Responsible for managing the tasks queue and executing them in the needed time.

# How to Run Locally

## Pre Conditions

Please make sure you have node >= 20 installed on your machine.

Within the mail, you received yaml files that contain the relevant configurations for each microservice. Each yaml file named as the microservice name described above. In order to run the applications, each file should be renamed to `config.yaml` and placed under `config` folder within the related microservice.

For example: `superheroes.yaml` need to be renamed to `config.yaml` and it's path should be `apps/superheroes/config/config.yaml`. Apply the same logic for the other files. Please notice that the config folder of each microservice is at the same level of the `src` folder, not inside the `src` folder.

## Running the Microservices

Open the terminal(s) at the path of `package.json` file (should be the folder you cloned the repo), no need to `cd` to the microservices folders. Each microservice has it's own start script. So for example, in order to start the superheroes microservice, run in your terminal `npm run start:superheroes` or `npm run start:dev:superheroes` if you want to run it in watch mode.
The ports are: superheroes - 3000, timers - 3001, schedulers - 3002.

## Using the APIs

If everything went well and you won't see any error logs on microservice bootstrap, you would be able to open the microservice within the browser at the address `localhost:<port-nuber>`. Each microservice has also it's own swagger, in order to open the swagger, concatenate to the address `/api` suffix. For example, to open superheros swagger, you should open in your browser this address: `localhost:3000/api`. Each endpoint in the swagger should include a short description of the business it serving.
