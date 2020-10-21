require('dotenv').config();
require('./src/db/mongoose');
const app = require('./src/server');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`** Server running on port: ${PORT} **`));