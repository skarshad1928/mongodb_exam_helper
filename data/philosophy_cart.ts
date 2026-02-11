
import { Question, Domain } from '../types';

const generatePhilosophySet = (setNum: number): Question[] => {
  const questions: Question[] = [];
  for (let i = 1; i <= 25; i++) {
    const qId = `PHIL-SET${setNum}-Q${i.toString().padStart(3, '0')}`;
    
    // Scenario mapping based on MongoDB 171v98 Objectives (1.1 - 1.5)
    if (i % 5 === 0) {
      questions.push({
        id: qId,
        domain: Domain.Philosophy,
        objectiveId: "1.2",
        scenario: "An architect is designing a high-frequency trading platform using MongoDB. They need to ensure that updates to a user's portfolio and balance are processed as an atomic unit without multi-document transactions.",
        questionText: "Which schema design pattern guarantees atomicity for this operation? (Select ONE)",
        options: [
          "{ $db: 'finance', coll: 'portfolios', update: { $set: { balance: 100 } } }",
          "Embedding the portfolio array directly within the user document.",
          "Using $out to a temporary collection and renaming.",
          "Linking portfolio items via DBRef to a separate collection."
        ],
        correctAnswers: [1],
        type: 'single',
        selectCount: 1,
        explanation: "MongoDB guarantees atomicity for single-document operations. By embedding the portfolio data, both the balance and the items are updated in one write operation to one document.",
        difficulty: 'High'
      });
    } else if (i % 5 === 1) {
       questions.push({
        id: qId,
        domain: Domain.Philosophy,
        objectiveId: "1.4",
        scenario: "A legacy RDBMS application is being migrated. The 'Users' table has 50 columns, many of which are NULL for most rows. The developer wants to optimize storage and query performance.",
        questionText: "Which MongoDB feature most effectively handles this requirement? (Select TWO)",
        options: [
          "Sparse Indexes for the optional fields.",
          "Fixed-size BSON padding for all documents.",
          "Dynamic Schema where fields only exist if they have a value.",
          "Default value constraints in the storage engine.",
          "Columnar compression for the specific collection."
        ],
        correctAnswers: [0, 2],
        type: 'multiple',
        selectCount: 2,
        explanation: "MongoDB is schemaless/dynamic, meaning null fields don't need to exist. Sparse indexes ensure that only documents with the field are indexed, saving space.",
        difficulty: 'Medium'
      });
    } else if (i % 5 === 2) {
       questions.push({
        id: qId,
        domain: Domain.Philosophy,
        objectiveId: "1.3",
        scenario: "A logging system uses a collection that must never grow beyond 10GB. When the limit is reached, the oldest logs should be automatically overwritten.",
        code: "db.createCollection('app_logs', { ... })",
        questionText: "Which configuration parameters must be passed to createCollection? (Select TWO)",
        options: [
          "{ capped: true, size: 10737418240 }",
          "{ autoIndexId: false, size: 10000 }",
          "{ expireAfterSeconds: 3600 }",
          "{ storageEngine: 'inMemory' }",
          "{ capped: true, max: 500000 }"
        ],
        correctAnswers: [0, 4],
        type: 'multiple',
        selectCount: 2,
        explanation: "Capped collections require 'capped: true' and 'size' in bytes. 'max' (document count) is optional but commonly used to further restrict size.",
        difficulty: 'High'
      });
    } else if (i % 5 === 3) {
       questions.push({
        id: qId,
        domain: Domain.Philosophy,
        objectiveId: "1.1",
        scenario: "You need to store binary files larger than 16MB in MongoDB. The application requires partial updates and random access to file chunks.",
        questionText: "Which architectural component is responsible for chunking files into 'fs.chunks'? (Select ONE)",
        options: [
          "The mongod storage engine.",
          "The MongoDB Driver on the application server.",
          "The mongos query router.",
          "The WiredTiger journal compressor."
        ],
        correctAnswers: [1],
        type: 'single',
        selectCount: 1,
        explanation: "GridFS is a driver-level specification. The driver handles splitting the file into chunks (default 255KB) and assembling them upon retrieval.",
        difficulty: 'Expert'
      });
    } else {
       questions.push({
        id: qId,
        domain: Domain.Philosophy,
        objectiveId: "1.5",
        scenario: "An application requires 'Read-After-Write' consistency across a distributed replica set. A user writes a comment and must see it immediately after the page reloads.",
        questionText: "Which configuration ensures this behavior? (Select TWO)",
        options: [
          "Write Concern { w: 'majority' }",
          "Read Concern { level: 'majority' }",
          "Read Preference 'primary'",
          "Write Concern { j: false }",
          "Read Concern { level: 'local' }"
        ],
        correctAnswers: [0, 2],
        type: 'multiple',
        selectCount: 2,
        explanation: "To guarantee read-after-write consistency, the write must be acknowledged by a majority and the subsequent read must go to the Primary node.",
        difficulty: 'Expert'
      });
    }
  }
  return questions;
};

export const PHILOSOPHY_CART = {
  domain: Domain.Philosophy,
  sets: [
    { setNumber: 1, questions: generatePhilosophySet(1) },
    { setNumber: 2, questions: generatePhilosophySet(2) },
    { setNumber: 3, questions: generatePhilosophySet(3) }
  ]
};
