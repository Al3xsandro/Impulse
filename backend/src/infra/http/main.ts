import { serverHttp } from "../http/app";

const port = 4000 || process.env.PORT;

serverHttp.listen(port, () => {
    console.log(`🚀 server is running on port ${port}`);
});