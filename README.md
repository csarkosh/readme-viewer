# [csarko.sh](https://csarko.sh) &middot; [![CircleCI](https://img.shields.io/circleci/build/github/csarkosh/csarko.sh.svg)](https://circleci.com/gh/csarkosh/csarko.sh) [![Dockerhub Status](https://img.shields.io/docker/cloud/build/csarko/node_terraform_awscli?label=ci%20image%20build)](https://hub.docker.com/r/csarko/node_terraform_awscli/builds) [![Mozilla Observability](https://img.shields.io/mozilla-observatory/grade/csarko.sh?label=mozilla%20observatory&publish)](https://observatory.mozilla.org/analyze/csarko.sh) [![Website Status](https://img.shields.io/website/https/csarko.sh.svg)](https://csarko.sh)

The purpose of this project is to demonstrate my cdn-serverless hybrid architecture, provide a custom web interface overview of my public GitHub projects, and showcase my ability to build web applications.

* **Fully Automated:** Builds and deployments are fully automated and are intiated from code changes pushed to the master branch at this git origin. The automated builds and deployments include a container image for [CircleCI](https://circleci.com/) to run builds and deployments, a [create-react-app](https://facebook.github.io/create-react-app/) build and deploy for the web interface, and various lambdas for serving HTTP requests and scraping web data.

* **Immutable Infrastructure:** All cloud infrastructure was developed and committed as code using [terraform](https://www.terraform.io/). This, paired with [git](https://git-scm.com/), was the development method used for building this application.

* **Responsive & Accessible:** The web interface is fully keyboard accessible, and the desktop view collapses into a native-looking, mobile view. This was done by using [create-react-app](https://facebook.github.io/create-react-app/) for desktop/mobile tooling and [material-ui](https://material-ui.com/) for prebuilt, accessible, web components.


[View this application's publically-available, web interface.](https://csarko.sh)
