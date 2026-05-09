export interface Template {
  id: string;
  name: string;
  emoji: string;
  description: string;
  systemPromptAddition: string;
}

export const TEMPLATES: Template[] = [
  {
    id: "bug",
    name: "Bug Report",
    emoji: "🐛",
    description: "Reproduce and fix a defect",
    systemPromptAddition: `This is a Bug Report ticket. Structure your output accordingly:
- Description must include: steps to reproduce, expected behavior, actual behavior, and environment details (browser, OS, version, etc.)
- Include any relevant error messages or stack traces
- Note severity or user impact
- Acceptance criteria must confirm the bug is fixed, edge cases are covered, and a regression test exists.`,
  },
  {
    id: "feature",
    name: "Feature Request",
    emoji: "✨",
    description: "Add new product functionality",
    systemPromptAddition: `This is a Feature Request ticket. Structure your output accordingly:
- Description must include: a user story framing ("As a [user], I want..."), business value, and technical implementation scope
- Call out edge cases and explicitly note what is out of scope
- Acceptance criteria must be user-facing, testable end-to-end, and reflect the full feature boundary.`,
  },
  {
    id: "api",
    name: "API Endpoint",
    emoji: "🔌",
    description: "Design or implement an API route",
    systemPromptAddition: `This is an API Endpoint ticket. Structure your output accordingly:
- Description must include: HTTP method and route path, request schema (headers, body, query params), response schema (success and error formats), authentication/authorization requirements, and validation rules
- Note rate limiting and versioning considerations if applicable
- Acceptance criteria must cover contract correctness, error code coverage, input validation, and that the endpoint is documented.`,
  },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}
