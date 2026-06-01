import mongoose from "mongoose";
const url = "mongodb://tp073918_db_user:uyxYQd0nvKVKwy5L@ac-vnzd41h-shard-00-00.6tm3obb.mongodb.net:27017,ac-vnzd41h-shard-00-01.6tm3obb.mongodb.net:27017,ac-vnzd41h-shard-00-02.6tm3obb.mongodb.net:27017/test?ssl=true&authSource=admin&replicaSet=atlas-cvbh26-shard-0&retryWrites=true&w=majority";

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected successfully!");
  process.exit(0);
}).catch((err) => {
  console.error("Connection error:", err);
  process.exit(1);
});
