export async function cli() {
  console.log("Welcome to the lit-doc CLI.");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("Bye!");
}
