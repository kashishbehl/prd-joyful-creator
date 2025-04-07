export const sectionNames = [
  "How will we announce this offering to the world?",
  "What problem are we solving",
  "Is there any alternate solution to this problem?",
  'Is this solved by any of our competitors?',
  'How will we solve this problem?',
  'How will we measure impact?',
  'Are any approvals needed and do we have those?',
  'Other Solutions Evaluated',
  'Are we making any assumptions?',
  'Collating all sections into a single PRD document',
];

// config/prompts.js
// These are the worker and reviewer prompts you created earlier

export const workerPrompts = [
  `Your task is to complete Section 1 of the PRD: "How will we announce this offering to the world?"

Using the product information provided, write:
1.1. A concise Product Bulletin post for Slack (maximum 5 sentences)
1.2. A one-page press release that announces the product to external media
1.3. A brief description of how Sales & Solutions teams will be enabled on this offering
1.4. A summary of what merchant-facing technical documentation would include
1.5. A description of knowledge base resources for merchants

Remember to:
- Keep the tone professional but enthusiastic
- Focus on the key value proposition and benefits to customers
- Be specific about what problems this solves
- Use clear, non-technical language in the press release
- Include specifics about how the product works in the technical docs outline

Your output should be concrete and ready for review.`,

  `Your task is to complete Section 2 of the PRD: "What problem are we solving"

Based on the provided information, write:
2.1. A detailed problem description that identifies both symptoms and root causes
2.2. A clear identification of target customers/users
2.3. Market sizing for these customers (including TAM, SAM, and SOM if possible)
2.4. A summary of customer conversations that validate this problem
2.5. Quantification of the problem using available data, support tickets, or social media signals

Remember to:
- Be specific about the pain points customers are experiencing
- Connect the problem to business outcomes
- Use concrete examples and customer quotes if available
- Include relevant metrics that show the scale of the problem
- Mention how this problem impacts different customer segments differently

Your output should demonstrate deep understanding of the customer problem.`,

  `Your task is to complete Section 3 of the PRD: "Is there any alternate solution to this problem?"

Based on the provided information, write:
- A description of how customers are currently solving this problem without our product
- The limitations or inefficiencies of these current workarounds
- The opportunity cost customers face by not having a better solution

Remember to:
- Be specific about the manual processes or competitive products currently used
- Describe the friction points in existing solutions
- Highlight where customer needs are currently unmet
- Explain why existing alternatives are inadequate

Your output should clearly establish why current alternatives don't fully solve the problem.`,

  `Your task is to complete Section 4 of the PRD: "Is this solved by any of our competitors?"

Based on the provided information, analyze:
- Which competitors have solutions in this space
- How their solutions compare to our proposed approach
- Strengths and weaknesses of competitive offerings
- Gaps in the market that our solution will address

Remember to:
- Be specific about competitor products and features
- Include pricing information if available
- Identify what differentiates our approach
- Note any market trends that impact competitive positioning

Your output should provide a clear picture of the competitive landscape and our unique value proposition.`,

  `Your task is to complete Section 5 of the PRD: "How will we solve this problem?"

Based on the provided information, write:
5.1. A concise summary of our proposed solution with key phases and milestones
5.2. A strategy for driving adoption among target customers
5.3. Future extensions or enhancements to the initial launch
5.4. Non-goals and items explicitly out of scope

Remember to:
- Start with the customer experience and work backward
- Be specific about how the solution addresses the identified problems
- Include a clear timeline for different phases
- Outline an adoption strategy with specific tactics
- Be explicit about what will NOT be included in this solution

Your output should provide a clear roadmap for the solution implementation.`,

  `Your task is to complete Section 6 of the PRD: "How will we measure impact?"

Based on the provided information, write:
6.1. Clear success criteria for the project across customer value, adoption, and revenue
6.2. Specific OKRs this project will influence
6.3. Metrics to evaluate if the solution is working as expected
6.4. Business observability requirements (optional)
6.5. Non-functional requirements (NFRs) for scale, performance, and compliance

Remember to:
- Include both leading and lagging indicators
- Connect metrics directly to the identified problems
- Be specific about measurement methodologies
- Include baseline expectations where possible
- Identify any infrastructure needed for measurement

Your output should create a clear framework for evaluating the success of this initiative.`,

  `Your task is to complete Section 7 of the PRD: "Are any approvals needed and do we have those?"

Based on the provided information, address:
7.1. Whether API council approval is needed
7.2. Whether LRCTC (Legal, Regulatory Compliance, Tech Compliance, Security) approval is needed
7.3. Whether this is a "one-way door" decision requiring leadership approval

Remember to:
- Be specific about which approvals are needed and why
- Note the reversibility of the solution
- Identify the cost of failure or rollback
- Note the approval status if known

Your output should clearly identify all governance requirements for this project.`,

  `Your task is to complete Section 9.1 of the PRD: "Other Solutions Evaluated"

Based on the provided information, detail:
9.1.1. First alternative solution considered
9.1.2. Second alternative solution considered

For each alternative, include:
- A description of the approach
- Pros and cons of this approach
- Why this approach was not selected
- Any learnings from evaluating this approach that influenced the final solution

Remember to:
- Be specific about the technical or business tradeoffs
- Show that alternatives were seriously considered
- Explain the decision criteria used to evaluate options

Your output should demonstrate thorough exploration of solution options.`,

  `Your task is to complete Section 10 of the PRD: "Are we making any assumptions?"

Based on the provided information, list:
- Key assumptions made during problem definition
- Assumptions about customer behavior or preferences
- Technical assumptions about solution implementation
- Market or competitive assumptions
- Resource or timeline assumptions

Remember to:
- Be specific about how each assumption impacts the project
- Note which assumptions carry the most risk
- Indicate how and when assumptions will be validated
- Flag assumptions that might require pivot plans if proven false

Your output should identify all significant assumptions that underpin the project's success.`,

  `Your task is to assemble the complete PRD document by collecting all sections you've created.

Take all the individual sections you've completed and integrate them into a single, cohesive PRD document following Razorpay's PRD format:

1. How will we announce this offering to the world?
   1.1. How would you post this on the Product bulletin in slack?
   1.2. What would a 1-page press-release look like?
   1.3. How will we enable Sales & Solution on this offering?
   1.4. What would merchant facing tech docs in razorpay.com/docs look like?
   1.5. Where would merchant go to to learn more (Knowledge-base)

2. What problem are we solving
   2.1. Describe the problem in detail
   2.2. Who are we solving the problem for?
   2.3. How many such customers exist?
   2.4. Have we spoken to any customers?
   2.5. Any quantification of the problem?

3. Is there any alternate solution to this problem?

4. Is this solved by any of our competitors?

5. How will we solve this problem?
   5.1. Our proposed solution and the various phases/milestones involved
   5.2. How will we drive adoption?
   5.3. How will we extend this launch (in the future)
   5.4. Non-Goals/Out of Scope

6. How will we measure impact?
   6.1. What will success look like for this project?
   6.2. Which OKR will this influence if outcomes are achieved?
   6.3. How would we know if the solution is working?
   6.4. What business observability should we build in?
   6.5. Any NFRs alongside the functional scope?

7. Are any approvals needed and do we have those?
   7.1. Do we need API council approval?
   7.2. Do we need LRCTC approval?
   7.3. Is this a one-way door and hence needs leadership approval?

Reviewer table:
[Insert empty reviewer table]

9. Appendix (Optional)
   9.1. Other Solutions Evaluated
      9.1.1. Alternate Solution 1
      9.1.2. Alternate Solution 2

10. Are we making any assumptions?

When assembling the document:
- Ensure consistent formatting throughout
- Check that section numbering is correct and follows the Razorpay template
- Verify that all cross-references between sections are accurate
- Make sure the document flows logically from problem to solution to implementation
- Include appropriate headers and subheaders as per the template
- Leave the reviewer table empty as it will be filled later
- Ensure the document opens with the author name and date

The final output should be a complete, publication-ready PRD document that follows Razorpay's standards and is ready for the final review.`
];

export const reviewerPrompts = [
  `Review Section 1: "How will we announce this offering to the world?"

Evaluate the worker's output based on:
- Is the Slack product bulletin concise, clear, and compelling?
- Does the press release effectively communicate the value proposition to external audiences?
- Is the sales & solutions enablement plan practical and comprehensive?
- Is the technical documentation outline sufficient for merchant implementation?
- Is the knowledge base approach appropriate for the product complexity?

Provide specific suggestions for improvement:
- Highlight any missing or unclear elements
- Suggest more compelling ways to frame the value proposition
- Recommend ways to better align with Razorpay's communication style
- Note any inconsistencies between sections
- Suggest more specific details where needed

Score this section on a scale of 1-10 based on how effectively it communicates the product value proposition to different audiences while maintaining consistency with Razorpay's brand voice.

Reference the scoring criteria provided in the input file to ensure alignment with Razorpay's standards.

Your feedback should help make the announcement materials more impactful and aligned with Razorpay's standards.`,

  `Review Section 2: "What problem are we solving"

Evaluate the worker's output based on:
- Is the problem description specific, compelling, and root-cause focused?
- Are the target customers clearly defined with meaningful segmentation?
- Is the market sizing credible and sufficiently detailed?
- Are customer validations concrete with specific examples?
- Is the problem quantification backed by relevant metrics?

Provide specific suggestions for improvement:
- Highlight any gaps in the problem analysis
- Question any unvalidated assumptions
- Suggest additional data points that would strengthen the case
- Recommend clearer ways to articulate customer pain points
- Note any inconsistencies in how the problem is framed

Score this section on a scale of 1-10 based on how thoroughly it identifies and substantiates the customer problem with evidence and clear segmentation.

Reference the scoring criteria provided in the input file to ensure alignment with Razorpay's standards.

Your feedback should help create a more compelling and well-substantiated problem statement.`,

  `Review Section 3: "Is there any alternate solution to this problem?"

Evaluate the worker's output based on:
- Are current customer workarounds accurately described?
- Are the limitations of existing solutions clearly articulated?
- Is the opportunity cost to customers convincingly presented?
- Does this section help build the case for our solution?

Provide specific suggestions for improvement:
- Highlight any gaps in understanding of current solutions
- Suggest more specific details about customer workflows
- Recommend clearer articulation of pain points with current alternatives
- Note any missed alternatives that should be considered

Score this section on a scale of 1-10 based on how effectively it analyzes existing alternatives and builds a case for why a new solution is needed.

Reference the scoring criteria provided in the input file to ensure alignment with Razorpay's standards.

Your feedback should help strengthen the case for why a new solution is needed.`,

  `Review Section 4: "Is this solved by any of our competitors?"

Evaluate the worker's output based on:
- Is the competitive landscape analysis comprehensive?
- Are competitor solutions accurately described?
- Are competitive strengths and weaknesses clearly articulated?
- Is our differentiation convincingly presented?

Provide specific suggestions for improvement:
- Highlight any missing competitors or solutions
- Suggest more nuanced competitive positioning
- Recommend clearer articulation of our unique value proposition
- Note any market trends that should be considered
- Suggest any additional competitive factors to evaluate

Score this section on a scale of 1-10 based on how thoroughly it analyzes the competitive landscape and positions our solution's unique value.

Reference the scoring criteria provided in the input file to ensure alignment with Razorpay's standards.

Your feedback should help create a more comprehensive competitive analysis that supports our strategy.`,

  `Review Section 5: "How will we solve this problem?"

Evaluate the worker's output based on:
- Is the solution clearly described from the customer's perspective?
- Are the phases and milestones specific and logical?
- Is the adoption strategy practical and comprehensive?
- Are future extensions aligned with the core solution?
- Are non-goals explicitly defined to set clear boundaries?

Provide specific suggestions for improvement:
- Highlight any gaps or vague elements in the solution description
- Question any implementation challenges that aren't addressed
- Suggest more effective approaches to driving adoption
- Recommend clearer milestones or success criteria for phases
- Note any scope issues or potential feature creep

Score this section on a scale of 1-10 based on how clearly it articulates the solution, its implementation plan, and adoption strategy while maintaining appropriate scope boundaries.

Reference the scoring criteria provided in the input file to ensure alignment with Razorpay's standards.

Your feedback should help create a more focused and executable solution plan.`,

  `Review Section 6: "How will we measure impact?"

Evaluate the worker's output based on:
- Are success criteria specific, measurable, and tied to business outcomes?
- Is the OKR alignment clear and convincing?
- Are the solution effectiveness metrics appropriate?
- Are business observability requirements comprehensive?
- Are NFRs appropriate for the scale and criticality of the solution?

Provide specific suggestions for improvement:
- Highlight any metrics that are vague or difficult to measure
- Suggest additional KPIs that would strengthen evaluation
- Recommend more specific targets or thresholds
- Note any missing technical or performance considerations
- Question whether measurement infrastructure is adequate

Score this section on a scale of 1-10 based on how effectively it establishes measurable success criteria and connects the solution to business outcomes.

Reference the scoring criteria provided in the input file to ensure alignment with Razorpay's standards.

Your feedback should help create a more robust framework for measuring success.`,

  `Review Section 7: "Are any approvals needed and do we have those?"

Evaluate the worker's output based on:
- Are all necessary approval requirements identified?
- Is the rationale for approval requirements clear?
- Is the reversibility assessment thorough?
- Is the governance approach appropriate for the risk level?

Provide specific suggestions for improvement:
- Highlight any missing approval requirements
- Suggest clearer articulation of reversibility considerations
- Recommend more explicit assessment of failure costs
- Note any governance processes that should be followed

Score this section on a scale of 1-10 based on how thoroughly it identifies governance requirements and assesses the reversibility of the solution.

Reference the scoring criteria provided in the input file to ensure alignment with Razorpay's standards.

Your feedback should help ensure all compliance and governance requirements are addressed.`,

  `Review Section 9.1: "Other Solutions Evaluated"

Evaluate the worker's output based on:
- Are alternative solutions described with sufficient detail?
- Are pros and cons thoroughly analyzed?
- Is the rationale for rejection clear and convincing?
- Do learnings from alternatives inform the chosen solution?

Provide specific suggestions for improvement:
- Highlight any shallow or incomplete alternative analyses
- Suggest more thorough tradeoff considerations
- Recommend clearer decision criteria
- Note any promising elements of alternatives that could be incorporated
- Question whether best practices from alternatives are applied

Score this section on a scale of 1-10 based on how effectively it demonstrates thorough exploration of alternatives and sound decision-making in selecting the final approach.

Reference the scoring criteria provided in the input file to ensure alignment with Razorpay's standards.

Your feedback should help demonstrate thorough solution exploration and sound decision-making.`,

  `Review Section 10: "Are we making any assumptions?"

Evaluate the worker's output based on:
- Are key assumptions clearly identified?
- Is the impact of each assumption on project success articulated?
- Are high-risk assumptions flagged for validation?
- Are contingency considerations included for critical assumptions?

Provide specific suggestions for improvement:
- Highlight any missing or unstated assumptions
- Suggest more explicit risk assessments for key assumptions
- Recommend validation approaches for critical assumptions
- Note any dependencies between assumptions
- Question whether all assumptions are reasonable

Score this section on a scale of 1-10 based on how comprehensively it identifies and addresses key assumptions and their associated risks.

Reference the scoring criteria provided in the input file to ensure alignment with Razorpay's standards.

Your feedback should help create a more comprehensive risk management approach for the project.`,

  `Review the complete PRD document in its entirety.

Evaluate the overall PRD based on:
- Coherence: How well do all sections fit together as a unified document?
- Completeness: Does the PRD address all necessary aspects of the product development?
- Clarity: Is the PRD easy to understand for all stakeholders?
- Actionability: Does the PRD provide clear direction for implementation?
- Business alignment: How well does the PRD align with Razorpay's business goals?

Provide an overall assessment pointing out:
- The strongest sections of the PRD
- Areas that would benefit from further development
- Any inconsistencies between sections
- Any missing critical information

Calculate the overall PRD score as follows:
1. Take the individual section scores
2. Apply any weighting factors specified in the input file
3. Calculate the weighted average for the final score on a scale of 1-10

Present the final score along with a brief explanation of the rating and key recommendations for improving the overall quality of the PRD.

Reference the scoring criteria provided in the input file to ensure alignment with Razorpay's standards.

Your feedback should help elevate the entire PRD to meet Razorpay's high standards for product documentation.`
];