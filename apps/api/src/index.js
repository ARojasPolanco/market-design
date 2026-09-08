import 'dotenv/config';
import app from './app.js';
import { envs } from './config/enviroments.js';

const PORT = envs.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${envs.NODE_ENV}`);
});
