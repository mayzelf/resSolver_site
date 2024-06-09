import { match } from "assert";

function removeDuplicates(s: string): string {
  // Split string into array of literals
  let literals = s.slice(1, -1).split(",");

  let seen = new Set();
  let uniqueLiterals = [];
  for (let literal of literals) {
    if (!seen.has(literal)) {
      uniqueLiterals.push(literal);
      seen.add(literal);
    }
  }

  // Convert array of literals back to string
  let result = "{" + uniqueLiterals.join(",") + "}";

  return result;
}

function removeLitAndNegLit(inputString: string): string {
  // Remove curly braces and split string by commas
  inputString = inputString.replace(/[{}]/g, "");
  let literals = inputString.split(",");

  // Initialize sets to store positive and negative literals
  let positiveLiterals = new Set<string>();
  let negativeLiterals = new Set<string>();

  // Separate positive and negative literals
  for (let literal of literals) {
    literal = literal.trim();
    if (literal.startsWith("!")) {
      negativeLiterals.add(literal.slice(1));
    } else {
      positiveLiterals.add(literal);
    }
  }

  // Find pairs and remove them (x, !x)
  let contradictions = new Set(
    [...positiveLiterals].filter((x) => negativeLiterals.has(x))
  );
  let simplifiedLiterals = new Set(
    [...negativeLiterals]
      .filter((x) => !contradictions.has(x))
      .map((x) => `!${x}`)
  );
  for (let literal of [...positiveLiterals].filter(
    (x) => !contradictions.has(x)
  )) {
    simplifiedLiterals.add(literal);
  }

  // Convert set back to string format
  let result = "{" + Array.from(simplifiedLiterals).sort().join(",") + "}";

  return result;
}

export function solve(userInput: string): string[] | string{

    let result = [] as string[];
  let pattern =
    /\(!*\w(?:\s+or\s+!*\w)*\)(?:\s*and\s*\(!*\w(?:\s+or\s+!*\w)*\))*/;

  if (pattern.test(userInput)) {
    console.log("The string is in the correct format.");
  } else {
    return "The string is not in the correct format. Please try again.";
  }

  // Split string at "and"
  let splitStrings = userInput.split("and").map((s) => s.trim());

  // Replace brackets, "or", spaces, and double negations
  splitStrings = splitStrings.map((s) =>
    s
      .replace(/\(/g, "{")
      .replace(/\)/g, "}")
      .replace(/or/g, ",")
      .replace(/ /g, "")
      .replace(/!!/g, "")
  );


  for  (let s in splitStrings){
    result.push(splitStrings[s]);
  }

  class BreakIt extends Error {}

  try {
    for (let i = 0; i < splitStrings.length; i++) {
      for (let j = 0; j < splitStrings.length; j++) {
        if (i !== j) {
          // Split each string into an array of literals
          let literals1 = splitStrings[i].slice(1, -1).split(",");
          let literals2 = splitStrings[j].slice(1, -1).split(",");
          let count = 0;
          for (let literal1 of literals1) {
            if (literals2.includes(`!${literal1}`)) {
              count += 1;
            }
          }
          for (let literal2 of literals2) {
            if (literals1.includes(`!${literal2}`)) {
              count += 1;
            }
          }

          if (count === 1) {
            // Merge literals
            let mergedLiterals = literals1.concat(literals2);

            // Convert array of literals back to string
            let merged = "{" + mergedLiterals.join(",") + "}";

            merged = removeDuplicates(merged);

            merged = removeLitAndNegLit(merged);

            result.push("{" + splitStrings[i] + " and " + splitStrings[j] + "} ==> " + merged);

            if (!splitStrings.includes(merged)) {
              splitStrings.push(merged);
            }

            if (merged === "{}") {
              throw new BreakIt();
            }
          }
        }
      }
    }
  } catch (e) {
    if (e instanceof BreakIt) {
      // Handle the break
    } else {
      throw e;
    }
  }
  let cleanedUp = cleanup(result);
  return cleanedUp;
}

function cleanup(steps: string[]): string[] {
  let neededSteps: string[] = [];
  let lastStepResult = steps[steps.length - 1].split(" ==> ")[1];
  let literals = new Set([lastStepResult]);
  let results = new Set(); // To keep track of unique outcomes

  for (let i = steps.length - 1; i >= 0; i--) {
    let step = steps[i];
    let result = step.split(" ==> ")[1];

    if (literals.has(result) && !results.has(result)) {
      neededSteps.push(step);
      results.add(result); // Add the result to the set of unique outcomes

      let literalsFromStep = step.match(/{.*?}/g);
      if (literalsFromStep) {
        literalsFromStep.forEach(literal => literals.add(literal));
      }
    }
  }

  return neededSteps.reverse();
}
