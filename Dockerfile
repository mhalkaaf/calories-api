FROM python:3.7

RUN pip install tensorflow==1.15.0 tensorflow-hub==0.7.0 tensorflowjs

WORKDIR /app
COPY . /app

CMD ["bash"]