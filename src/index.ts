import app from "./app";
import ProductCreatedConsumerInstance from "./kafka/products/ProductCreatedConsumer";
import ProductDeletedConsumerInstance from "./kafka/products/ProductDeletedConsumer";
import ProductUpdatedConsumerInstance from "./kafka/products/ProductUpdatedConsumer";
import UserCreatedConsumerInstance from "./kafka/users/UserCreatedConsumer";

const port = 4001;

app.listen(port, async () => {
  console.log("Connected to redis");
  console.log("Connected to kafka");
  console.log(`Server is running on port ${port}`);
});

process.on("SIGTERM", () => {
  // Handle shutdown
  UserCreatedConsumerInstance.gracefulShutdown();
  ProductCreatedConsumerInstance.gracefulShutdown();
  ProductUpdatedConsumerInstance.gracefulShutdown();
  ProductDeletedConsumerInstance.gracefulShutdown();
});

process.on("SIGINT", () => {
  // Handle shutdown
  UserCreatedConsumerInstance.gracefulShutdown();
  ProductCreatedConsumerInstance.gracefulShutdown();
  ProductUpdatedConsumerInstance.gracefulShutdown();
  ProductDeletedConsumerInstance.gracefulShutdown();
});
