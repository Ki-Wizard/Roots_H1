const stringSchema = {
  type: "string",
  minLength: 1,
} as const;

const stringArraySchema = {
  type: "array",
  minItems: 1,
  items: stringSchema,
} as const;

export const OPENROUTER_REPORT_RESPONSE_FORMAT = {
  type: "json_schema",
  json_schema: {
    name: "generated_report",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: [
        "axisScores",
        "summary",
        "strengths",
        "cautions",
        "recurringQuestion",
        "opposingView",
        "prescriptions",
        "recommendedPhilosophers",
        "shareText",
        "evidence",
      ],
      properties: {
        axisScores: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: [
              "id",
              "negativeLabel",
              "positiveLabel",
              "score",
              "leaning",
            ],
            properties: {
              id: {
                type: "string",
                enum: [
                  "individualCommunity",
                  "outcomePrinciple",
                  "reasonExperience",
                  "freedomOrder",
                ],
              },
              negativeLabel: stringSchema,
              positiveLabel: stringSchema,
              score: {
                type: "integer",
              },
              leaning: stringSchema,
            },
          },
        },
        summary: stringSchema,
        strengths: stringArraySchema,
        cautions: stringArraySchema,
        recurringQuestion: stringSchema,
        opposingView: stringSchema,
        prescriptions: stringArraySchema,
        recommendedPhilosophers: stringArraySchema,
        shareText: stringSchema,
        evidence: {
          type: "array",
          minItems: 1,
          items: {
            type: "object",
            additionalProperties: false,
            required: [
              "questionId",
              "questionTitle",
              "reason",
              "interpretation",
            ],
            properties: {
              questionId: stringSchema,
              questionTitle: stringSchema,
              reason: stringSchema,
              interpretation: stringSchema,
            },
          },
        },
      },
    },
  },
} as const;
