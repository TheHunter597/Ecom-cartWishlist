import { BaseConsumer, MainEvent, Topics } from "@mainmicro/jscommonlib";
import {
  EventsEnum,
  CartGroups,
} from "@mainmicro/jscommonlib/dist/kafka/types";
import { Consumer, Kafka } from "kafkajs";
import { Client } from "../../prisma/client";
import KafkaClient from "../KafkaClient";
class ProductDeletedConsumer extends BaseConsumer<
  EventsEnum["PRODUCT_DELETED"]
> {
  protected topic: Topics.PRODUCT_DELETED = Topics.PRODUCT_DELETED;
  protected groupId: CartGroups.CART_PRODUCT_DELETED_GROUP =
    CartGroups.CART_PRODUCT_DELETED_GROUP;
  protected consumer: Consumer;
  constructor(client: Kafka) {
    super(client);
    this.consumer = this.createConsumer();
  }
  async consume() {
    await this.start();
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: any) => {
        try {
          let data = JSON.parse(message.value.toString());
          console.log({ data });

          await Client.product.delete({
            where: {
              id: data.id,
            },
          });
          console.log("Product deleted");
        } catch (e) {
          console.log(e);
        }
      },
    });
  }
}

let ProductDeletedConsumerInstance: ProductDeletedConsumer =
  new ProductDeletedConsumer(KafkaClient);
ProductDeletedConsumerInstance.consume();

export default ProductDeletedConsumerInstance;
