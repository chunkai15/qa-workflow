**Title:** [Spec] Billing Page | A/B Test Annual vs Monthly Default - Everfit

**Source:** [https://everfit.atlassian.net/wiki/spaces/EV/pages/3686203473/Spec+Billing+Page+A+B+Test+Annual+vs+Monthly+Default](https://everfit.atlassian.net/wiki/spaces/EV/pages/3686203473/Spec+Billing+Page+A+B+Test+Annual+vs+Monthly+Default)

---

# Page Structure Map
```text
[Spec] Billing Page | A/B Test Annual vs Monthly Default - Everfit
├── Overview
├── Background
├── Scope
│   └── In scope (this release)
└── Requirement
    ├── 1\. Pull churn data for monthly vs annual subscribers in the last 6 months
    │   ├── **1A. Get the churn time of the monthly subscription**
    │   └── 1B. Get the churn time of **the** Annual subscription
    ├── 2\. Get the billing cycle during the last 6 months of the new subscription
    ├── 3\. A/B Test Implementation & Measurement: Get data for Free Trial or Starter WSs
    │   ├── 2A. Assign flow A = Experience billing page with Monthly as default
    │   └── 2B. Assign flow B = Experience billing page with Annual as default
    └── 4\. Report (BA task)
```

---

<table data-testid="renderer-table" data-number-column="false" data-table-width="760" data-layout="default"><colgroup><col><col></colgroup><tbody><tr><td rowspan="1" colspan="1" colorname="Light gray" data-colwidth="203" data-cell-background="#f4f5f7"><p data-renderer-start-pos="4" data-local-id="d36406a4d44c"><strong data-renderer-mark="true">Product Owner</strong></p></td><td rowspan="1" colspan="1" colorname="" data-colwidth="556"><p data-renderer-start-pos="21" data-local-id="762411e0b22e">Jon</p></td></tr><tr><td rowspan="1" colspan="1" colorname="Light gray" data-colwidth="203" data-cell-background="#f4f5f7"><p data-renderer-start-pos="30" data-local-id="4d1304c3be78"><strong data-renderer-mark="true">Scrum Master</strong></p></td><td rowspan="1" colspan="1" colorname="" data-colwidth="556"><p data-renderer-start-pos="46" data-local-id="dfa74ff0202e">Hoa Nguyen</p></td></tr><tr><td rowspan="1" colspan="1" colorname="Light gray" data-colwidth="203" data-cell-background="#f4f5f7"><p data-renderer-start-pos="62" data-local-id="ea4f7f3703e1"><strong data-renderer-mark="true"><span data-highlighted="true" data-vc="highlighted-text"><span><span data-testid="definition-highlighter">BA</span></span></span></strong></p></td><td rowspan="1" colspan="1" colorname="" data-colwidth="556"><p data-renderer-start-pos="68" data-local-id="730824155354">@thaovu</p></td></tr><tr><td rowspan="1" colspan="1" colorname="Light gray" data-colwidth="203" data-cell-background="#f4f5f7"><p data-renderer-start-pos="81" data-local-id="6aaf59253051"><strong data-renderer-mark="true">Designer</strong></p></td><td rowspan="1" colspan="1" colorname="" data-colwidth="556"><p data-renderer-start-pos="93" data-local-id="e5b7d6518650"><span data-highlighted="true" data-vc="highlighted-text"><span><span data-testid="definition-highlighter">NA</span></span></span></p></td></tr><tr><td rowspan="1" colspan="1" colorname="Light gray" data-colwidth="203" data-cell-background="#f4f5f7"><p data-renderer-start-pos="101" data-local-id="79e762109e15"><strong data-renderer-mark="true">Development Team</strong></p></td><td rowspan="1" colspan="1" colorname="" data-colwidth="556"><p data-renderer-start-pos="121" data-local-id="086bd83a6cc2">FE: Hieu Le</p></td></tr><tr><td rowspan="1" colspan="1" colorname="Light gray" data-colwidth="203" data-cell-background="#f4f5f7"><p data-renderer-start-pos="138" data-local-id="4f0056edb3c7"><strong data-renderer-mark="true">Product Items</strong></p></td><td rowspan="1" colspan="1" colorname="" data-colwidth="556"><p data-renderer-start-pos="155" data-local-id="20a08c65e7ac">PMT-131: PAY | Billing Page | A/B Test Annual vs Monthly Default</p></td></tr><tr><td rowspan="1" colspan="1" colorname="Light gray" data-colwidth="203" data-cell-background="#f4f5f7"><p data-renderer-start-pos="225" data-local-id="51e1e2284b05"><strong data-renderer-mark="true">Epic</strong></p></td><td rowspan="1" colspan="1" colorname="" data-colwidth="556"><p data-renderer-start-pos="233" data-local-id="8128d39348c0"><span data-testid="smart-link-draggable-inline" data-ssr-placeholder="0vDZ-:EfLS5:z8NN7:qz-Pe:OP-5u-0"><span data-inline-card="true" data-card-url="https://everfit.atlassian.net/browse/PAY-2492" data-annotation-inline-node="true" data-renderer-start-pos="233" data-annotation-mark="true"><span><span><span><span data-testid="hover-card-trigger-wrapper" role="none"><span data-testid="inline-card-icon-and-title"><span data-testid="icon-position-wrapper"><span data-testid="icon-empty-wrapper"></span><span data-testid="icon-wrapper"></span></span><span>PAY-2492: PAY | Billing Page | A/B Test Annual vs Monthly Default</span></span><span data-inline-card-lozenge="true"><span data-testid="inline-card-resolved-view-lozenge"><span data-testid="inline-card-resolved-view-lozenge--text">To Do</span></span></span></span></span></span></span></span></span></p></td></tr></tbody></table>

-   1 Overview
-   2 Background
-   3 Scope
    -   3.1 In scope (this release))
-   4 Requirement
    -   4.1 1\. Pull churn data for monthly vs annual subscribers in the last 6 months
        -   4.1.1 1A. Get the churn time of the monthly subscription
        -   4.1.2 1B. Get the churn time of the Annual subscription
    -   4.2 2\. Get the billing cycle during the last 6 months of the new subscription
    -   4.3 3\. A/B Test Implementation & Measurement: Get data for Free Trial or Starter WSs
        -   4.3.1 2A. Assign flow A = Experience billing page with Monthly as default
        -   4.3.2 2B. Assign flow B = Experience billing page with Annual as default
    -   4.4 4\. Report (BA task))

## Overview

The Everfit WS billing/payment page currently defaults to "Bill Monthly" when a coach opens it to purchase or change a plan. This feature runs a controlled A/B test to determine whether defaulting the toggle to "Bill Annually" instead increases annual plan conversions and improves long-term retention.

## Background

-   Requested by Long Nguyen (May 2, 2026) — Slack thread

-   Long's proposal: run A/B testing to see how likely people will purchase an annual plan when Annual is shown first vs Monthly first

-   Rob (Product Success Lead, Academy) flagged two data prerequisites before running the test:

    1.  Average time to churn from paid plan for monthly vs annual subscribers (how many months)

    2.  Page event tracking data — how many users click the "Bill Annually" toggle

## Scope

### In scope (this release)

1.  **Analytics & Data Prerequisites**

    1.  Data pull: average months-to-churn for monthly vs annual WS paid plan subscribers

    2.  Summary report shared with Long, Rob, and Jon before A/B test is greenlit

2.  **A/B Test Implementation & Measurement**

    -   A/B variant assignment logic: every coach workspace is assigned to Variant A (control — Monthly default) or Variant B (test — Annual default) on the first billing page load

    -   Variant B: toggle default changes to "Bill Annually" on page load; annual prices display in the plan cards and Plan Summary sidebar; the coach can still switch to Monthly freely

    -   Variant A: no change to current behavior (Monthly default)

    -   Data tracking: store in DB and report to an Excel file or a PDF

    -   Post-test: Based on the result, suggest the default display

## Requirement

### 1\. Pull churn data for monthly vs annual subscribers in the last 6 months

#### **1A. Get the churn time of the monthly subscription**

-   Dev: Calculate the lifetime of WS in a monthly subscription and churn within the last 6 months

    -   Get the time that WS has the monthly billing cycle, until they churn or schedule to churn.

#### 1B. Get the churn time of **the** Annual subscription

-   Dev: Calculate the lifetime of WS in an annual subscription and churn within the last 6 months.

    -   Get the time that WS has the annual billing cycle, until they churn or schedule to churn

**Report:** Get the date to the Excel with a template: Billing - A/B testing

### 2\. Get the billing cycle during the last 6 months of the new subscription

-   Get the plan and billing cycle of new WSs to see what they purchased during the last 6 months

Report: Get the date to the Excel with a template: Billing - A/B testing

### 3\. A/B Test Implementation & Measurement: Get data for Free Trial or Starter WSs

#### 2A. Assign flow A = Experience billing page with Monthly as default

-   When the coach belongs to group A, they should see the default display in billing as monthly

-   Record which cycle the coach purchased.

#### 2B. Assign flow B = Experience billing page with Annual as default

-   When the coach belongs to group B, they should see the default display in billing as Annual

-   Record which cycle the coach purchased.

**Report:** Get the date to the Excel with a template: Billing - A/B testing

### 4\. Report (BA task)

-   Before running the test: Report the average months-to-churn for monthly vs annual paid plans

-   Post-test:

    -   Graph to compare the A/B flows with the baseline: bar chart and cycle

    -   Recommend the default billing display