import { BaseConsumer, MainEvent, Topics } from "@mainmicro/jscommonlib";
import {
  EventsEnum,
  CartGroups,
} from "@mainmicro/jscommonlib/dist/kafka/types";
import { Consumer, Kafka } from "kafkajs";
import { Client } from "../../prisma/client";
import KafkaClient from "../KafkaClient";
class ProductCreatedConsumer extends BaseConsumer<
  EventsEnum["PRODUCT_CREATED"]
> {
  protected topic: Topics.PRODUCT_CREATED = Topics.PRODUCT_CREATED;
  protected groupId: CartGroups.CART_PRODUCT_CREATED_GROUP =
    CartGroups.CART_PRODUCT_CREATED_GROUP;
  protected consumer: Consumer;
  constructor(client: Kafka) {
    super(client);
    this.consumer = this.createConsumer();
  }
  async consume(): Promise<void> {
    console.log("consuming");

    await this.start();
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }: any) => {
        try {
          console.log({ message: JSON.parse(message.value).colors });

          let data = JSON.parse(message.value);
          for (const element of Object.keys(data)) {
            if (element == "colors" || element == "sizes") {
              delete data[element];
            }
          }
          let newProduct = await Client.product.create({
            data,
          });
          let colorsSizesData = JSON.parse(message.value);
          for (const element of Object.keys(colorsSizesData)) {
            if (element == "colors") {
              for (const color of colorsSizesData["colors"]) {
                await Client.productColor.create({
                  data: {
                    name: color.name,
                    hex: color.hex,
                    productId: newProduct.id,
                    id: color.id,
                  },
                });
              }
            } else if (element == "sizes") {
              for (const size of colorsSizesData["sizes"]) {
                await Client.productSize.create({
                  data: {
                    name: size.name,
                    abbreviation: size.abbreviation,
                    productId: newProduct.id,
                    id: size.id,
                  },
                });
              }
            }
          }
          console.log("Product created", newProduct);
        } catch (e) {
          console.log(e);
        }
      },
    });
  }
}

let ProductCreatedConsumerInstance: ProductCreatedConsumer =
  new ProductCreatedConsumer(KafkaClient);

ProductCreatedConsumerInstance.consume();

export default ProductCreatedConsumerInstance;
