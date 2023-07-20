import { Magic } from "@/features/magic/mod.ts";
import { lit } from "litdoc";

/** MAIN **/

const { md, doc } = lit();
export default doc;

md`
# :folder: [Magic](#magic)

Here be viz arts.

${<Magic />}
`;
