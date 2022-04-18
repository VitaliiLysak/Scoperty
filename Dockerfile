FROM node:10.10-stretch

EXPOSE 4200

RUN apt-get update && \
    rm -rf /var/lib/apt/lists/*

# TODO Copy only necessary files (no README.md for example)
COPY . /app
WORKDIR /app

RUN npm install
RUN npm run build
RUN npm install http-server -g

RUN echo "==========================================================================================================="
RUN npm audit || true
RUN echo "==========================================================================================================="

CMD ["http-server", "./dist", "-p 4200"]
