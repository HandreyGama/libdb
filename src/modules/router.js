import Navigo from "navigo";
import { loadLogin } from "../../public/templates/login/login";
import { loadHome } from "../../public/templates/home/home";
const router = new Navigo('/',{hash:true});


router
    .on('/login',() => loadLogin())
    .on('/home',() => loadHome())
    .notFound(() => router.navigate('/login'))
router.resolve()
export {router}