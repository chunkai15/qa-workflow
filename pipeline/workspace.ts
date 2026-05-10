import path from "node:path";

export type AutomationLayout = {
  featureKey: string;
  featureRoot: string;
  automationRoot: string;
  inputRoot: string;
  runsRoot: string;
  runRoot: string;
  suiteRoot: string;
  readme: string;
  envExample: string;
  runManifest: string;
  contextBundleJson: string;
  contextBundleMd: string;
  generationPlanJson: string;
  validationReport: string;
  executionReportMd: string;
  executionReportJson: string;
};

function normalizeSegments(inputPath: string): string[] {
  return path.normalize(inputPath).split(path.sep).filter(Boolean);
}

export function isFeatureLocalFeatureFile(featureFile: string): boolean {
  const parts = normalizeSegments(featureFile);
  return parts.length >= 5
    && parts[0] === "features"
    && parts[2] === "automation"
    && parts[3] === "input"
    && parts[4].endsWith(".feature");
}

export function deriveFeatureKeyFromFeatureFile(featureFile: string): string {
  const parts = normalizeSegments(featureFile);

  if (isFeatureLocalFeatureFile(featureFile)) {
    return parts[1];
  }

  const fileName = parts.at(-1);
  if (!fileName?.endsWith(".feature")) {
    throw new Error(`Cannot derive feature key from non-feature path: ${featureFile}`);
  }

  return path.basename(fileName, ".feature");
}

export function getFeatureAutomationLayout(featureFile: string, runId: string): AutomationLayout {
  const featureKey = deriveFeatureKeyFromFeatureFile(featureFile);
  const featureRoot = path.join("features", featureKey);
  const automationRoot = path.join(featureRoot, "automation");
  const inputRoot = path.join(automationRoot, "input");
  const runsRoot = path.join(automationRoot, "runs");
  const runRoot = path.join(runsRoot, runId);
  const suiteRoot = path.join(runRoot, "generated");

  return {
    featureKey: path.normalize(featureKey),
    featureRoot: path.normalize(featureRoot),
    automationRoot: path.normalize(automationRoot),
    inputRoot: path.normalize(inputRoot),
    runsRoot: path.normalize(runsRoot),
    runRoot: path.normalize(runRoot),
    suiteRoot: path.normalize(suiteRoot),
    readme: path.normalize(path.join(runRoot, "README.md")),
    envExample: path.normalize(path.join(runRoot, ".env.example")),
    runManifest: path.normalize(path.join(runRoot, "run-manifest.json")),
    contextBundleJson: path.normalize(path.join(runRoot, "context-bundle.json")),
    contextBundleMd: path.normalize(path.join(runRoot, "context-bundle.md")),
    generationPlanJson: path.normalize(path.join(runRoot, "generation-plan.json")),
    validationReport: path.normalize(path.join(suiteRoot, "validation-report.md")),
    executionReportMd: path.normalize(path.join(suiteRoot, "execution-report.md")),
    executionReportJson: path.normalize(path.join(suiteRoot, "execution-report.json")),
  };
}
