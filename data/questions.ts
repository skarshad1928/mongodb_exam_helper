
import { Question, Domain } from '../types';

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: "q-phil-001",
    domain: Domain.Philosophy,
    objectiveId: "1.1",
    scenario: "You are designing a schema for a high-throughput e-commerce application. You have 'Orders' and 'LineItems'.",
    questionText: "Under which condition is 'Embedding' LineItems inside the Order document preferred over 'Referencing'? (Select ONE)",
    options: [
      "When LineItems are frequently updated independently of the Order.",
      "When the number of LineItems per Order is unbounded and could exceed 16MB.",
      "When the application always retrieves LineItems whenever an Order is viewed.",
      "When you need to perform complex joins across multiple Orders for reporting."
    ],
    correctAnswers: [2],
    type: 'single',
    // Fix: Added missing selectCount for single choice question
    selectCount: 1,
    explanation: "Embedding is preferred for 'contains' relationships where the data is small, bounded, and usually accessed together. It avoids the overhead of application-level joins.",
    difficulty: 'High'
  },
  {
    id: "q-crud-001",
    domain: Domain.CRUD,
    objectiveId: "2.12",
    scenario: "You have a 'catalog' collection with documents containing an array of 'prices'. You need to find products that have at least one price object where 'amount' is greater than 100 AND 'currency' is 'USD'.",
    code: "db.catalog.insertMany([\n  { name: 'A', prices: [{amount: 50, currency: 'USD'}, {amount: 150, currency: 'EUR'}] },\n  { name: 'B', prices: [{amount: 120, currency: 'USD'}, {amount: 80, currency: 'GBP'}] }\n])",
    questionText: "Which query correctly identifies documents where a single element in the prices array satisfies both conditions?",
    options: [
      "db.catalog.find({ 'prices.amount': { $gt: 100 }, 'prices.currency': 'USD' })",
      "db.catalog.find({ prices: { $elemMatch: { amount: { $gt: 100 }, currency: 'USD' } } })",
      "db.catalog.find({ prices: { $all: [{ amount: { $gt: 100 } }, { currency: 'USD' }] } })",
      "db.catalog.find({ 'prices': { $in: [{ amount: { $gt: 100 }, currency: 'USD' }] } })"
    ],
    correctAnswers: [1],
    type: 'single',
    // Fix: Added missing selectCount for single choice question
    selectCount: 1,
    explanation: "$elemMatch is required to match multiple criteria against a single element in an array. Using 'prices.amount' and 'prices.currency' separately (Option 1) could match across different elements (one satisfying amount, another satisfying currency).",
    difficulty: 'High'
  },
  {
    id: "q-idx-001",
    domain: Domain.Indexes,
    objectiveId: "3.5",
    scenario: "Review the following partial .explain('executionStats') output for a query on the 'orders' collection.",
    code: "\"executionStats\": {\n  \"nReturned\": 500,\n  \"totalKeysExamined\": 500,\n  \"totalDocsExamined\": 50000,\n  \"executionStages\": {\n    \"stage\": \"FETCH\",\n    \"inputStage\": {\n      \"stage\": \"IXSCAN\",\n      \"indexName\": \"status_1\"\n    }\n  }\n}",
    questionText: "What is the primary performance issue indicated by this output? (Select ONE)",
    options: [
      "The query is performing a COLLSCAN despite having an index.",
      "The index is not selective enough, leading to excessive document fetches.",
      "The index used is a multikey index which slows down execution.",
      "The totalKeysExamined is higher than nReturned."
    ],
    correctAnswers: [1],
    type: 'single',
    // Fix: Added missing selectCount for single choice question
    selectCount: 1,
    explanation: "totalDocsExamined (50,000) is much higher than totalKeysExamined (500) and nReturned (500). This indicates the index is being used (IXSCAN), but it's not covering enough of the filter, forcing the engine to fetch many documents to check additional fields.",
    difficulty: 'Expert'
  },
  {
    id: "q-admin-001",
    domain: Domain.ServerAdmin,
    objectiveId: "4.2",
    scenario: "You need to change the 'bindIp' configuration on a running production mongod instance to allow connections from a new internal subnet.",
    questionText: "What is the safest way to apply this change? (Select ONE)",
    options: [
      "Use db.adminCommand({ setParameter: 1, bindIp: '...' }) in mongosh.",
      "Update the mongod.conf file and perform a rolling restart of the replica set.",
      "The bindIp parameter cannot be changed after initial startup.",
      "Use the 'rs.reconfig()' command to update network settings across the cluster."
    ],
    correctAnswers: [1],
    type: 'single',
    // Fix: Added missing selectCount for single choice question
    selectCount: 1,
    explanation: "Network binding parameters (bindIp) are generally not dynamic and require a process restart. In a replica set, a rolling restart (Secondary -> Primary) ensures zero downtime.",
    difficulty: 'High'
  },
  {
    id: "q-mon-001",
    domain: Domain.Monitoring,
    objectiveId: "5.4",
    scenario: "You observe high 'queues' (r/w) in the output of the 'mongostat' utility.",
    questionText: "What is the most likely cause of high operation queues in MongoDB? (Select ONE)",
    options: [
      "The WiredTiger cache is too small for the working set.",
      "The network latency between nodes is too high.",
      "Storage I/O cannot keep up with the incoming request volume.",
      "There are too many open connections from the application pool."
    ],
    correctAnswers: [2],
    type: 'single',
    // Fix: Added missing selectCount for single choice question
    selectCount: 1,
    explanation: "High queues typically indicate that operations are waiting on the storage engine, often caused by I/O saturation or disk latency.",
    difficulty: 'High'
  },
  {
    id: "q-sec-001",
    domain: Domain.Security,
    objectiveId: "6.3",
    scenario: "A junior admin created a custom role with the following privileges. You need to identify why the user with this role cannot run listCollections.",
    code: "db.createRole({\n  role: \"restrictedReader\",\n  privileges: [\n    { resource: { db: \"reporting\", collection: \"sales\" }, actions: [ \"find\" ] }\n  ],\n  roles: []\n})",
    questionText: "To allow the user to list all collections in the 'reporting' database, which privilege MUST be added? (Select ONE)",
    options: [
      "{ resource: { db: \"reporting\", collection: \"\" }, actions: [ \"listCollections\" ] }",
      "{ resource: { cluster: true }, actions: [ \"listCollections\" ] }",
      "{ resource: { db: \"admin\", collection: \"\" }, actions: [ \"listCollections\" ] }",
      "{ resource: { db: \"reporting\", collection: \"system.namespaces\" }, actions: [ \"find\" ] }"
    ],
    correctAnswers: [0],
    type: 'single',
    // Fix: Added missing selectCount for single choice question
    selectCount: 1,
    explanation: "The listCollections action must be granted on the database level (empty collection string) to allow listing collections within that specific database.",
    difficulty: 'High'
  },
  {
    id: "q-repl-001",
    domain: Domain.Replication,
    objectiveId: "7.6",
    scenario: "You have a 3-node replica set. An application performs a write with { writeConcern: { w: 'majority', wtimeout: 5000 } }.",
    questionText: "Which statement accurately describes the behavior if one secondary is currently down? (Select TWO)",
    options: [
      "The write will succeed if the primary and the remaining secondary acknowledge it.",
      "The write will fail immediately with a ReplicaSetNoPrimary error.",
      "The write will time out after 5 seconds but the data may still be written to the primary.",
      "The write will return a 'success' status because majority of 3 is 2, and 2 nodes are up.",
      "The write will fail because 3 nodes are required for majority writes in a 3-node set."
    ],
    correctAnswers: [0, 2],
    type: 'multiple',
    // Fix: Added missing selectCount for multiple choice question
    selectCount: 2,
    explanation: "Majority of 3 is 2. If one node is down, the primary and one secondary (2 nodes) still constitute a majority. However, if the secondary is lagging or slow, it might timeout, but the primary has already committed the data.",
    difficulty: 'High'
  },
  {
    id: "q-back-001",
    domain: Domain.Backup,
    objectiveId: "8.1",
    scenario: "You are planning a backup strategy for a 10TB sharded cluster.",
    questionText: "Which backup method is most suitable for minimizing recovery time objective (RTO) and ensuring consistency across shards? (Select ONE)",
    options: [
      "Running 'mongodump' on the mongos router instance.",
      "Filesystem snapshots (LVM/EBS) taken across all nodes simultaneously.",
      "MongoDB Cloud Manager / Ops Manager with Continuous Backup.",
      "Running 'cp -r' on the data directories while the nodes are running."
    ],
    correctAnswers: [2],
    type: 'single',
    // Fix: Added missing selectCount for single choice question
    selectCount: 1,
    explanation: "Cloud Manager/Ops Manager handles the complexity of sharded cluster consistency and point-in-time recovery, which is very difficult to achieve manually with raw snapshots or mongodump at that scale.",
    difficulty: 'High'
  }
];
