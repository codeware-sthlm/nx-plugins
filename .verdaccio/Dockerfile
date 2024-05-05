# https://github.com/verdaccio/verdaccio/tree/master/docker-examples/v5/plugins/docker-build-install-plugin

# Based on the official Verdaccio image
FROM verdaccio/verdaccio:5

ADD .verdaccio/config-docker.yml /verdaccio/conf/config.yaml

# Needed to install global plugins
USER root

RUN \
  npm i -g verdaccio-static-token && \
  npm i -g verdaccio-auth-memory

# Back to original Verdaccio user
USER $VERDACCIO_USER_UID
