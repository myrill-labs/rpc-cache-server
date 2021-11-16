npm install
tsc

READER_PORT=3000
WRITER_PORT=3001
READER_CONTAINER_IMAGE_REPO_URL=071148791710.dkr.ecr.eu-central-1.amazonaws.com/rpc-cache-reader
WRITER_CONTAINER_IMAGE_REPO_URL=071148791710.dkr.ecr.eu-central-1.amazonaws.com/rpc-cache-writer


AWS_REGION=eu-central-1

sudo docker build --build-arg port=$READER_PORT -t rpc-cache-reader -f rpc-cache-reader/Dockerfile .
sudo docker tag rpc-cache-reader:latest $READER_CONTAINER_IMAGE_REPO_URL
aws ecr get-login-password --region $AWS_REGION | sudo docker login --username AWS --password-stdin $READER_CONTAINER_IMAGE_REPO_URL
sudo docker push $READER_CONTAINER_IMAGE_REPO_URL



sudo docker build --build-arg port=$WRITER_PORT -t rpc-cache-writer -f rpc-cache-writer/Dockerfile .;
sudo docker tag rpc-cache-writer:latest $WRITER_CONTAINER_IMAGE_REPO_URL
aws ecr get-login-password --region $AWS_REGION | sudo docker login --username AWS --password-stdin $WRITER_CONTAINER_IMAGE_REPO_URL
sudo docker push $WRITER_CONTAINER_IMAGE_REPO_URL

#READER="https://$READER_CONTAINER_IMAGE_REPO_URL:latest"
#WRITER="https://$WRITER_CONTAINER_IMAGE_REPO_URL:latest"

READER="$READER_CONTAINER_IMAGE_REPO_URL:latest"
WRITER="$WRITER_CONTAINER_IMAGE_REPO_URL:latest"

aws cloudformation create-stack --stack-name rpc-cache-service --template-body file://cloudformation/rpc-cache-service.yml --capabilities CAPABILITY_NAMED_IAM --parameters ParameterKey=StackName,ParameterValue=rpc-cache-network ParameterKey=WriterImageUrl,ParameterValue=$WRITER ParameterKey=ReaderServiceName,ParameterValue=rpc-reader-service ParameterKey=WriterServiceName,ParameterValue=rpc-writer-service ParameterKey=ReaderImageUrl,ParameterValue=$READER