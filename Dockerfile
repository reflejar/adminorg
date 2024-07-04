#####################
# Construcción de Api y Front
#####################
FROM python:3.7

ENV PYTHONUNBUFFERED=1

RUN apt-get update && \
    apt-get install -y --fix-missing netcat-openbsd npm

ADD api/requirements.txt /api/requirements.txt
RUN pip install -r /api/requirements.txt

ADD api /api 
RUN chmod +x /api

RUN mkdir -p /api/media 
RUN chmod +x /api/media

WORKDIR /front

COPY front/package*.json ./
RUN npm install
COPY front .
RUN npm run build

EXPOSE 8000 3000

ADD wait-for-mysql.sh /wait-for-mysql.sh
RUN chmod +x /wait-for-mysql.sh

COPY run-prod.sh /run-prod.sh
RUN chmod +x /run-prod.sh

COPY run-dev.sh /run-dev.sh
RUN chmod +x /run-dev.sh

ARG BUILD_DATE
ARG REVISION
ARG VERSION
LABEL maintainer "marianovaldez92@protonmail.com"
LABEL created $BUILD_DATE
LABEL version $VERSION
LABEL revision $REVISION
LABEL title "AdminOrg"

ENTRYPOINT ["/wait-for-mysql.sh"]
CMD ["/run-prod.sh"]