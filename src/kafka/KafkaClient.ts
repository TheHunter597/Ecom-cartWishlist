import { KafkaClientSingleton } from "@mainmicro/jscommonlib";
import { ClientId } from "@mainmicro/jscommonlib/dist/kafka/types";

let KafkaClientInstance = KafkaClientSingleton.getInstance(ClientId.CART);

export default KafkaClientInstance;
