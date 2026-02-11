
import { Question, Domain } from '../types';

const generateCRUDSet = (setNum: number): Question[] => {
  const questions: Question[] = [];
  for (let i = 1; i <= 25; i++) {
    const qId = `CRUD-SET${setNum}-Q${i.toString().padStart(3, '0')}`;
    
    if (i % 5 === 0) {
      questions.push({
        id: qId,
        domain: Domain.CRUD,
        objectiveId: "2.5",
        scenario: "You have a collection 'sensor_data' with documents containing an array of measurements: { dev_id: 1, readings: [ { v: 10, t: 'high' }, { v: 5, t: 'low' } ] }. You need to find documents where AT LEAST ONE reading has v > 8 AND t is 'low'.",
        questionText: "Which query correctly implements this requirement? (Select ONE)",
        options: [
          "db.sensor_data.find({ 'readings.v': { $gt: 8 }, 'readings.t': 'low' })",
          "db.sensor_data.find({ readings: { $elemMatch: { v: { $gt: 8 }, t: 'low' } } })",
          "db.sensor_data.find({ readings: { $all: [ { v: { $gt: 8 } }, { t: 'low' } ] } })",
          "db.sensor_data.find({ 'readings': { $in: [ { v: { $gt: 8 }, t: 'low' } ] } })"
        ],
        correctAnswers: [1],
        type: 'single',
        selectCount: 1,
        explanation: "$elemMatch is the only operator that ensures multiple criteria match against the same element within an array.",
        difficulty: 'High'
      });
    } else if (i % 5 === 1) {
      questions.push({
        id: qId,
        domain: Domain.CRUD,
        objectiveId: "2.14",
        scenario: "An aggregation pipeline needs to calculate the average score of students grouped by their class, but only for students who are currently 'active'.",
        questionText: "Which pipeline stages are required to perform this correctly and efficiently? (Select TWO)",
        options: [
          "{ $match: { status: 'active' } }",
          "{ $group: { _id: '$class', avgScore: { $avg: '$score' } } }",
          "{ $project: { class: 1, score: 1, active: 1 } }",
          "{ $filter: { input: '$students', as: 's', cond: { $eq: ['$$s.status', 'active'] } } }",
          "{ $sort: { class: 1 } }"
        ],
        correctAnswers: [0, 1],
        type: 'multiple',
        selectCount: 2,
        explanation: "Efficient aggregation starts with $match to reduce the dataset before $group performs the calculation.",
        difficulty: 'High'
      });
    } else if (i % 5 === 2) {
      questions.push({
        id: qId,
        domain: Domain.CRUD,
        objectiveId: "2.8",
        scenario: "You are performing a bulk update on the 'inventory' collection. You need to increment the 'qty' field by 10 for all items with 'status: A', and set 'lastModified' to the current date.",
        questionText: "Which update operators should be used in the update document? (Select TWO)",
        options: [
          "{ $inc: { qty: 10 } }",
          "{ $currentDate: { lastModified: true } }",
          "{ $set: { qty: { $add: ['$qty', 10] } } }",
          "{ $date: { lastModified: 'now' } }",
          "{ $push: { lastModified: new Date() } }"
        ],
        correctAnswers: [0, 1],
        type: 'multiple',
        selectCount: 2,
        explanation: "$inc is the atomic operator for increments, and $currentDate is the optimized way to set server-side timestamps.",
        difficulty: 'Medium'
      });
    } else if (i % 5 === 3) {
      questions.push({
        id: qId,
        domain: Domain.CRUD,
        objectiveId: "2.22",
        scenario: "A developer is using $lookup to join a 'orders' collection with a 'products' collection. They want to ensure the joined 'product_details' field is an object, not an array, as they know there is a 1-to-1 mapping.",
        questionText: "Which stage should immediately follow the $lookup to flatten the result? (Select ONE)",
        options: [
          "{ $unwind: '$product_details' }",
          "{ $replaceRoot: { newRoot: '$product_details' } }",
          "{ $project: { product_details: { $first: '$product_details' } } }",
          "{ $flatten: '$product_details' }"
        ],
        correctAnswers: [0],
        type: 'single',
        selectCount: 1,
        explanation: "$unwind deconstructs an array field from the input documents to output a document for each element. For 1-to-1 joins, it effectively converts the array into an object.",
        difficulty: 'High'
      });
    } else {
      questions.push({
        id: qId,
        domain: Domain.CRUD,
        objectiveId: "2.18",
        scenario: "You are implementing a high-availability write. You want to ensure the write is written to the journal on a majority of nodes before acknowledging success.",
        questionText: "Which writeConcern configuration provides this level of durability? (Select ONE)",
        options: [
          "{ w: 'majority', j: true }",
          "{ w: 'majority', j: false }",
          "{ w: 3, j: true }",
          "{ w: 1, j: true }"
        ],
        correctAnswers: [0],
        type: 'single',
        selectCount: 1,
        explanation: "w: 'majority' ensures the data is replicated to most nodes, and j: true ensures the data is flushed to the on-disk journal, preventing data loss on power failure.",
        difficulty: 'Expert'
      });
    }
  }
  return questions;
};

export const CRUD_CART = {
  domain: Domain.CRUD,
  sets: [
    { setNumber: 1, questions: generateCRUDSet(1) },
    { setNumber: 2, questions: generateCRUDSet(2) },
    { setNumber: 3, questions: generateCRUDSet(3) }
  ]
};
