
import { Question, Domain } from '../types';

const generateIndexesSet = (setNum: number): Question[] => {
  const questions: Question[] = [];
  for (let i = 1; i <= 25; i++) {
    const qId = `IDX-SET${setNum}-Q${i.toString().padStart(3, '0')}`;
    
    if (i % 5 === 0) {
      questions.push({
        id: qId,
        domain: Domain.Indexes,
        objectiveId: "3.2",
        scenario: "You have a collection 'logs' with a compound index { status: 1, timestamp: -1 }. You run a query: db.logs.find({ status: 'ERR' }).sort({ timestamp: 1 }).",
        questionText: "Will MongoDB use the index for sorting, or will it perform an in-memory sort? (Select ONE)",
        options: [
          "It will use the index because the fields match.",
          "It will perform an in-memory sort because the sort direction (1) is the inverse of the index (-1).",
          "It will use the index because MongoDB can traverse indexes in both directions.",
          "It will use the index only if the query also filters on timestamp."
        ],
        correctAnswers: [2],
        type: 'single',
        selectCount: 1,
        explanation: "MongoDB can traverse an index in either the forward or reverse direction. Therefore, { status: 1, timestamp: -1 } supports both sort({ status: 1, timestamp: -1 }) and its inverse sort({ status: -1, timestamp: 1 }).",
        difficulty: 'High'
      });
    } else if (i % 5 === 1) {
      questions.push({
        id: qId,
        domain: Domain.Indexes,
        objectiveId: "3.8",
        scenario: "An 'orders' collection has an index on { tags: 1 }, where 'tags' is an array of strings. You attempt to create another index on { tags: 1, category: 1 } where 'category' is also an array.",
        questionText: "What will happen when you attempt to create the second index? (Select ONE)",
        options: [
          "The index will be created successfully.",
          "The index creation will fail with a 'Cannot index more than one array' error.",
          "The index will be created but only the first element of 'category' will be indexed.",
          "The index creation will succeed but only for documents where one of the fields is not an array."
        ],
        correctAnswers: [1],
        type: 'single',
        selectCount: 1,
        explanation: "A compound multikey index cannot have more than one field that is an array. This is to prevent a Cartesian product of index entries that would explode the index size.",
        difficulty: 'High'
      });
    } else if (i % 5 === 2) {
      questions.push({
        id: qId,
        domain: Domain.Indexes,
        objectiveId: "3.12",
        scenario: "You want to create an index on the 'email' field in the 'users' collection, but only for documents where the 'status' is 'verified'.",
        questionText: "Which index type should you use? (Select ONE)",
        options: [
          "Sparse Index",
          "Partial Index with partialFilterExpression",
          "Conditional Index",
          "TTL Index with status filter"
        ],
        correctAnswers: [1],
        type: 'single',
        selectCount: 1,
        explanation: "Partial indexes allow you to specify a filter expression (partialFilterExpression) that determines which documents are included in the index, providing more flexibility than sparse indexes.",
        difficulty: 'Medium'
      });
    } else if (i % 5 === 3) {
      questions.push({
        id: qId,
        domain: Domain.Indexes,
        objectiveId: "3.15",
        scenario: "Reviewing explain() output, you see a stage 'IXSCAN' followed by 'FETCH'.",
        questionText: "What does this sequence typically indicate? (Select ONE)",
        options: [
          "The query is fully covered by the index.",
          "The index was used to find document pointers, but the document itself had to be retrieved from disk to satisfy the query/projection.",
          "The query failed to use an index and fell back to a collection scan.",
          "The index is corrupted and requires a rebuild."
        ],
        correctAnswers: [1],
        type: 'single',
        selectCount: 1,
        explanation: "FETCH indicates that the storage engine had to retrieve the full document from the data files because the index didn't contain all the fields required by the query and projection.",
        difficulty: 'Medium'
      });
    } else {
      questions.push({
        id: qId,
        domain: Domain.Indexes,
        objectiveId: "3.4",
        scenario: "You have a large collection where most queries filter by 'userId' and 'createdAt'. You currently have two separate single-field indexes on these fields.",
        questionText: "To optimize these queries for both filtering and sorting, what is the best indexing strategy? (Select ONE)",
        options: [
          "Keep the single-field indexes; MongoDB's index intersection will handle it.",
          "Create a compound index { userId: 1, createdAt: 1 }.",
          "Create a hashed index on userId and a single-field index on createdAt.",
          "Create a text index on userId and createdAt."
        ],
        correctAnswers: [1],
        type: 'single',
        selectCount: 1,
        explanation: "A compound index is almost always more efficient than index intersection for queries filtering on multiple fields, as it allows the query engine to narrow down results in a single scan.",
        difficulty: 'High'
      });
    }
  }
  return questions;
};

export const INDEXES_CART = {
  domain: Domain.Indexes,
  sets: [
    { setNumber: 1, questions: generateIndexesSet(1) },
    { setNumber: 2, questions: generateIndexesSet(2) },
    { setNumber: 3, questions: generateIndexesSet(3) }
  ]
};
