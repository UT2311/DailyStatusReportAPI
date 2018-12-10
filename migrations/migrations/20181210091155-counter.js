module.exports = {
  up(db) {
    // TODO write your migration here. Return a Promise (and/or use async & await).
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    var conn = db.createCollection("counter", {
      validator: {
         $jsonSchema: {
            bsonType: "object",
            required: [ "_id", "count" ],
            properties: {
              _id: {
                  bsonType: "string",
                  description: "must be a string and is required"
               },
               count: {
                  bsonType: "number",
                  description: "must be a number and is required"
               },
            }
         }
      }
   });
   return conn;
  },

  down(db) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    return db.collection('counter').drop();
  }
};
