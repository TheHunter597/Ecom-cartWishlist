import { BaseConsumer, MainEvent, Topics } from "@mainmicro/jscommonlib";
import {
  EventsEnum,
  CartGroups,
} from "@mainmicro/jscommonlib/dist/kafka/types";
import { Consumer, Kafka } from "kafkajs";
import { Client } from "../../prisma/client";
import KafkaClientInstance from "../KafkaClient";

class UserCreatedConsumer extends BaseConsumer<EventsEnum["USER_CREATED"]> {
  protected topic: Topics.USER_CREATED = Topics.USER_CREATED;
  protected groupId: CartGroups.CART_USER_CREATED_GROUP =
    CartGroups.CART_USER_CREATED_GROUP;
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
          await Client.cart.create({
            data: {
              owner: message.value.toString(),
            },
          });
        } catch (e) {
          console.log(e);
        }
      },
    });
  }
}

let UserCreatedConsumerInstance: UserCreatedConsumer = new UserCreatedConsumer(
  KafkaClientInstance
);
UserCreatedConsumerInstance.consume();

export default UserCreatedConsumerInstance;
