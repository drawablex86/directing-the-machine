## Project 10 — Character Design System (Month 7)

**Type:** Visual
**Duration:** 4 weeks
**Estimated workload:** 20–25 hrs/week
**Prerequisites:** All intensive phases

### Goal

Produce a character design system — a consistent character across 20 variations, supported by a trained LoRA and three case studies. The project must demonstrate that consistency is not the same as repetition.

### Brief

You are directing a character for a narrative project of your choice. The character must hold identity across pose, angle, lighting, context, and expression. The system must produce 20 variations, with at least three documented case studies showing how the system was built and where it failed.

### Deliverables

| Deliverable | Specification |
|---|---|
| **Working brief** | Intention, constraints, references, acceptance criteria, rejection conditions, risk assessment |
| **Character bible** | Identity block (facial structure, proportions, wardrobe, distinctive features), negative identity rules (what must not change), reference set |
| **Trained LoRA** | With training set documentation (images, captions, rank, trigger word) |
| **Pipeline documentation** | ComfyUI node graph with LoRA, ControlNet, and IP-Adapter integration, with every node explained |
| **20 variations** | Same character across pose, angle, lighting, context, and expression |
| **Three case studies** | Each one page: brief, decisions, failures, recovery, accepted output |
| **Decision log** | Minimum 20 entries |
| **Written defense** | One page, naming the visual level, the decision, and the alternative |
| **Refusal** | One visual refusal — a variation the system could produce that the director refuses to deliver |
| **External critique record** | One structured critique session on character consistency |

### LoRA Requirements

The LoRA must be trained with:

- A curated training set of 15–30 images.
- Precise captions that separate identity from background.
- A unique trigger token.
- Low rank to avoid overfitting.
- Documentation of what the LoRA encodes and what it misses.

### Character Bible Requirements

The bible must include:

- Identity block: "fictional adult woman, oval face, wide-set dark brown eyes, short wavy black bob, small mole below left eye, warm medium skin, dark green field jacket" — or equivalent.
- Negative identity rules: no beard, no glasses, no different hair length, no age shift.
- Reference set: face, full body, profile, three-quarter, design details.

### Case Study Requirements

Each case study must document:

- The brief for that variation.
- The pipeline configuration.
- The decision that produced the variation.
- The failure (if any).
- The recovery procedure.
- The accepted output.
- What the case study demonstrates about the system.

### Standing Inquiry Integration

- **Weekly:** One sentence in the decision log.
- **Monthly:** One page answering "What is this work for?"

### Mastery Gate

The project is complete when:

- The brief scores 3 or higher on the Intent Architecture rubric.
- The LoRA produces identity across at least 15 variations.
- The character bible names at least five identity features and three negative rules.
- Three case studies are documented, each with failures and recoveries.
- The decision log reconstructs every major decision.
- The written defense names the visual level, the decision, and the alternative.
- The refusal is specific and grounded.
- The external critique is logged and diagnosed.

### Common Failure Modes

- **Overfitting.** The LoRA can only produce the training set. Fix: low rank, few images, precise captions.
- **Identity drift.** The character changes across variations. Fix: re-inject the identity block at every step. Test the LoRA across a new pose.
- **No failure documentation.** The case studies only show successes. Fix: the failures are the teaching. Document what broke and how it was repaired.
- **No negative rules.** The character bible does not specify what must not change. Fix: negative identity rules are as important as positive ones.
- **Consistency as repetition.** All 20 variations look identical. Fix: consistency is identity across variation. Test: can you identify the character in a new pose, in a new context, under different lighting?

---
