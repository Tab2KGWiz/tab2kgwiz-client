# Tabular Data to Knowledge Graph Wizard (tab2kgwiz) - Client

This is the frontend for the **Tabular Data to Knowledge Graph Wizard (Tab2KGWiz)** project. It is built using **React** and **Next.js** to cooperate with tab2kgwiz server.

## Features

- **Dynamic Tabular Data Rendering**: Display tabular data seamlessly.
- **Knowledge Graph Integration**: Integration with backend APIs for knowledge graph functionality.
- **Server-Side Rendering** (SSR): Utilizing Next.js for server-side rendering and improved SEO.
- **Dockerized**: Includes Docker support for easy deployment.

## Requirements

To get started, you need to have **Node.js** installed on your machine.

### Node.js

Install **Node.js** which comes with **npm** (Node Package Manager). You can install it from the [official website](https://nodejs.org/).

Check your installed versions by running:

```bash
$ node --version
v21.x.x

$ npm --version
10.x.x
```

If you don’t have Node.js installed, follow the platform-specific instructions below:

#### Installation on macOS

Install Node.js using Homebrew:

```bash
$ brew install node
```

#### Installation on Linux (Ubuntu/Debian)

For Linux (Ubuntu/Debian-based), you can install Node.js using:

```bash
$ sudo apt-get install python-software-properties
$ sudo add-apt-repository ppa:chris-lea/node.js
$ sudo apt-get update
$ sudo apt-get install nodejs
```

#### Installation on Windows

For Windows, download the installer from the [Node.js website](http://nodejs.org/) and follow the instructions.

## Installation

Clone the project repository to your local machine:

```bash
$ git clone https://github.com/Tab2KGWiz/tab2kgwiz-client
$ cd tab2kgwiz-client
```

Install the required dependencies:

```bash
$ npm install
```

## Development Server

To start the development server and run the application locally:

```bash
$ npm start
```

## Production Build

To generate an optimized production build, run:

```bash
$ npm run build
```

This will create a **.next** folder with the production-optimized files.

## Updating Dependencies

To keep the project dependencies up-to-date, you can run the following:

```bash
$ npm prune
$ npm install
```

Alternatively, you can use the custom script to update everything:

```bash
$ npm run pull
```

This will pull the latest changes, prune unused dependencies, and reinstall all packages.

## Dockerization

This project comes with a Dockerfile to make deployment easier by Dockerizing the frontend application.

### 1. Build Docker Image

To build the Docker image, use the following command:

```bash
$ docker build -t frontend .
```

### 2. Run Docker Container

Once the image is built, you can run the frontend inside a Docker container with:

```bash
$ docker run -p 3000:3000 -it frontend
```

This will expose the application at http://localhost:3000 inside your container.

## License

This project is licensed under the MIT License.
