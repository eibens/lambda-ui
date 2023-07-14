import { parse } from "https://deno.land/std@0.159.0/flags/mod.ts";

type ConvertFormat = "markdown" | "html" | "typescript";

function isConvertFormat(value: unknown): value is ConvertFormat {
  return ["markdown", "html", "typescript"].includes(String(value));
}

function inferFormat(options: {
  path?: unknown;
  format?: string;
}): ConvertFormat {
  const { path, format } = options;

  if (!path && !format) {
    throw new Error("Either path or format must be provided.");
  }

  if (!isConvertFormat(format)) {
    throw new Error(`Unknown format: ${format}`);
  }

  if (!path) {
    return format;
  }

  if (typeof path !== "string") {
    throw new Error(`Path must be a string: ${path}`);
  }

  const map: {
    [ext: string]: ConvertFormat;
  } = {
    md: "markdown",
    ts: "typescript",
    tsx: "typescript",
  };

  const extension = path.split(".").pop();
  const inferredFormat = map[extension ?? ""];

  if (!inferredFormat) {
    throw new Error(`Unable to infer format from path: ${path}`);
  }

  return inferredFormat;
}

const parsers = {
  markdown: async (input: URL) => {
    const source = await Deno.readTextFile(input);
    
  },
};

async function convert(options: {
  source: URL;
  input: ConvertFormat;
  output: ConvertFormat;
}) {
}

export async function cli() {
  console.log("Welcome to the lit-doc CLI.");

  const [command, ...args] = Deno.args;

  if (command === "convert") {
    const flags = parse(args, {
      string: ["input-format", "output-format"],
      alias: {
        i: "input",
        o: "output",
      },
    });

    const inputFormat = inferFormat({
      path: flags._[0],
      format: flags["input-format"],
    });

    const outputFormat = inferFormat({
      path: flags._[1],
      format: flags["output-format"],
    });

    const inputUrl = new URL(String(input), await Deno.realPath("."));
    const result = await convert({
      format,
      input: inputUrl,
    });

    if (output) {
      const outputUrl = new URL(String(output), await Deno.realPath("."));
    }
  } else {
    console.log("Unknown command:", command);
  }

  console.log("Bye!");
}
