import { BaseConsumer, MainEvent, Topics } from "@mainmicro/jscommonlib";
import {
  EventsEnum,
  CartGroups,
} from "@mainmicro/jscommonlib/dist/kafka/types";
import { Consumer, Kafka } from "kafkajs";
import { Client } from "../../prisma/client";
import KafkaClient from "../KafkaClient";
class ProductUpdatedConsumer extends BaseConsumer<
  EventsEnum["PRODUCT_UPDATED"]
> {
  protected topic: Topics.PRODUCT_UPDATED = Topics.PRODUCT_UPDATED;
  protected groupId: CartGroups.CART_PRODUCT_UPDATED_GROUP =
    CartGroups.CART_PRODUCT_UPDATED_GROUP;
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
          console.log("got new one");

          console.log({ data });

          await Client.product.update({
            where: {
              id: data.id,
            },
            data: data.data,
          });
          console.log("Product updated");
        } catch (e) {
          console.log(e);
        }
      },
    });
  }
}

let ProductUpdatedConsumerInstance: ProductUpdatedConsumer =
  new ProductUpdatedConsumer(KafkaClient);
ProductUpdatedConsumerInstance.consume();
export default ProductUpdatedConsumerInstance;
