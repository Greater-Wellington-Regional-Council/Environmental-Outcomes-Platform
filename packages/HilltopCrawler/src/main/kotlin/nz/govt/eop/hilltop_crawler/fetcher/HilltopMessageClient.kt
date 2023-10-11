package nz.govt.eop.hilltop_crawler.fetcher

import org.apache.kafka.clients.admin.NewTopic
import org.apache.kafka.clients.producer.ProducerRecord
import org.apache.kafka.clients.producer.internals.BuiltInPartitioner
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Profile
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Component

@Profile("!test")
@Component
class HilltopMessageClient(
    @Qualifier("hilltopRawDataTopic") private val dataTopic: NewTopic,
    private val kafkaSender: KafkaTemplate<HilltopMessageKey, HilltopMessage>
) {
  fun send(message: HilltopMessage) {
    val partitionKey = "${message.councilId}#${message.hilltopBaseUrl}".toByteArray()
    val partition = BuiltInPartitioner.partitionForKey(partitionKey, dataTopic.numPartitions())
    kafkaSender.send(ProducerRecord(dataTopic.name(), partition, message.toKey(), message))
  }
}
