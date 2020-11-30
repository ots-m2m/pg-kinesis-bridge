FROM node:8.2.1-alpine

COPY . .

RUN npm install -g .

CMD pg-kinesis-bridge -c ${CHANNEL} -s ${STREAMNAME}
