FROM node:18-slim

# Install necessary system libraries
RUN apt-get update && apt-get install -y \
    libc6 \
    libgcc1 \
    libstdc++6 \
    wget \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install TensorFlow dependencies
RUN apt-get update && apt-get install -y \
    libgomp1 \
    libcurl3-gnutls \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . /app

EXPOSE 3000

ENTRYPOINT ["npm", "run"]
CMD ["start-run"]