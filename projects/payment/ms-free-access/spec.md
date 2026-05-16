### Overview
MacroSnap (MS) free access for a coach's own client account. When a client account email matches the Owner/Admin email on a paid Self-Serve workspace, the system automatically grants complementary MacroSnap access — no paid license required. Access is revoked when eligibility is lost (coach removed, plan downgraded, client archived).

### Glossary
| Term | Definition |
|---|---|
| **MS** | MacroSnap |
| **WS** | Workspace |
| **Paid Self-Serve WS** | Pro, Studio, or Accelerator Bundle plan |
| **Complementary MS access** | Free MacroSnap license auto-granted to a coach's own client account (not counted in subscription) |
| **Connected client account** | A client account created by a coach using their own coach email |
| **Starter plan** | Free/unpaid workspace tier |

### Permissions / Business Rules
* Complementary MS access is granted only when the client account email **exactly matches** an active coach/admin email on the same paid Self-Serve workspace
* Eligible WS plans: **Pro, Studio, Accelerator Bundle**
* Ineligible WS plans: **Free Trial, Starter**
* The complementary coach license is **not counted** towards the MS subscription seat count
* The complementary coach license is **not displayed** on the MS management page
* The complementary coach license is **not displayed** in the dropdown for assigning licenses
* White-label (WL) applicability: **Yes**
* Revocation triggers: coach removed from WS, WS downgraded to Starter
* Re-grant trigger: deployment detects existing connected clients with matching active coach email
* If a client account was assigned a license via MS management first, then the client is added as a teammate with the same email → that license **is** counted for the MS subscription. Coach must unassign from MS management/client profile; the client still retains free complementary access.

---

### US1: As the system, I want to automatically grant complementary MacroSnap access when a client account email matches the Owner or Admin email on a paid Self-Serve workspace, and revoke it when eligibility is lost, so that coaches can use MacroSnap on their own test accounts without purchasing a license, and access is always kept in sync with the workspace's paid status.
[PAY-2556](https://everfit.atlassian.net/browse/PAY-2556)

#### AC1: Grant on new client account creation
* Given: A coach creates a new connected client account in a paid Self-Serve WS
* When: The client account's email exactly matches the active coach of WS
* Then:
  * The system grants complementary MacroSnap access to that client account immediately at creation time

#### AC2: Should not count licence of coach to the total license that MS purchase
* Given: MacroSnap access has been granted to a coach account as a client; coach purchased the MS subscription
* When: Coach views MS management and subscription
* Then:
  * The coach license won't be counted towards the MS management and subscription
  * The coach license is not displayed in the MS page
  * The coach license is not displayed in the dropdown for assigning licenses

#### AC3: Unassign license if coach is deleted from the teammates or WS is downgraded to Starter plan
* Given: A client account (coach email) has complementary MacroSnap access
* When: The coach is revoked from the WS **OR** the WS plan is downgraded to Starter
* Then:
  * The system immediately revokes MacroSnap access from that client account

#### AC4: Grant access for all existing connected clients with active coach email
* Given: The coach is active in a paid WS (Pro, Studio, Accelerator Bundle)
* When: System deploys and detects the active coach has connected clients whose email matches the active coach account
* Then:
  * Grant the MS to the client
  * Send an email granting access to the coach (existing connected account behavior) — Subject: **"You now have access to MacroSnap"**
  * If the coach creates/unarchives a connected account **after** deployment, the system should **not** send the email; the coach can discover it by themselves

---

### US2: As a coach, I want to see a contextual callout on the MacroSnap page based on my workspace plan, so that I am aware of the free MacroSnap perk or prompted to upgrade to access it.
[PAY-2557](https://everfit.atlassian.net/browse/PAY-2557)

#### AC1: Show a message callout for paid plan coaches on the MS page
* Given: Coach is on a paid Self-Serve WS (Pro, Studio, or Accelerator Bundle); WS doesn't have an MS subscription; Coach opens the MS page
* When: Coach views the MacroSnap page (with or without purchased licenses)
* Then:
  * A perk awareness callout is displayed **below** the "PURCHASE LICENSES FOR CLIENTS" CTA button
  * Callout message: **"MacroSnap is free on your own client account.** Log in to the Everfit client app with your coach email to try it!"

#### AC2: Show a message callout for Free/Trial plan coaches on the MS page
* Given: Coach is on a Free Trial or Starter plan; WS doesn't have an MS subscription
* When: Coach views the MacroSnap page
* Then:
  * Show message below the CTA button: **"Want to try MacroSnap yourself? Upgrade to a paid plan and your own client account gets MacroSnap for free."**
  * Display an **"Upgrade Everfit plan"** link
  * Click on "Upgrade Everfit plan" → navigate to the Choose my plan page

#### AC3: Disable Assigned license from client profile
* Given: A coach creates a new connected client account in a paid Self-Serve WS
* When: After the MS subscription is purchased
* Then:
  * Disable the Unassign/Assign license button from UI for MS in the client MS page, and set the settings for this client
  * It always shows the assigned status
  * Hover over the button to show the tooltip: **"MacroSnap is free on your own client account.** Log in to the Everfit client app with your coach email to try it!"
  * The button will be hidden when MS is cancelled
  * **Edge case:** If the client account is assigned through MS management first, then the client is added as a teammate with the same email → this license **will be** calculated for the MS subscription. The coach just needs to unassign the license from MS management/client profile; the client still can access MS in the client app and it won't be added to the MS subscription anymore.
