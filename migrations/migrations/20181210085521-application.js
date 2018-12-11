module.exports = {
  up(db) {
    // TODO write your migration here. Return a Promise (and/or use async & await).
    // See https://github.com/seppevs/migrate-mongo/#creating-a-new-migration-script
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});
    var conn = db.createCollection("applications", {
      validator: {
         $jsonSchema: {
            bsonType: "object",
            required: [ "appicationName", "sizeOfApplication" ],
            properties: {
              appicationName: {
                  bsonType: "string",
                  description: "must be a string and is required"
               },
               sizeOfApplication: {
                  bsonType: "string",
                  enum: [ "Large", "Medium" , "Small" ],
                  description: "must be a string and is required"
               },
            }
         }
      }
   });
   db.collection("applications").createIndex({appicationName:1,sizeOfApplication:1},{unique:true})
   return conn;
  },

  down(db) {
    // TODO write the statements to rollback your migration (if possible)
    // Example:
    // return db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
    db.collection("applications").dropIndex("applications");
    return db.collection('applications').drop();
  }
};
