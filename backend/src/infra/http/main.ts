import { serverHttp } from "../http/app";

const port = process.env.PORT || 4000;

serverHttp.listen(port, () => {
    console.log(`🚀 server is running on port ${port}`);
});