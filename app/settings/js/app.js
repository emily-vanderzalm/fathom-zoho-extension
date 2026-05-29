// Global Object State Management Schema Blueprint Tracker Layout
let configState = {
    api_key: "",
    sync_own: true,
    sync_team: true,
    sync_external: false,
    sync_all: false,
    capture_transcript: true,
    capture_summary: true,
    capture_actions: true,
    capture_matches: false,
    contact_matching: "email",
    desk_enabled: true,
    desk_department: "Support",
    desk_priority: "Normal",
    setup_complete: false,
    last_sync_timestamp: "",
    webhook_id: "",
    webhook_secret: "",
    account_name: "Woggle Consulting Account"
};

// OAuth Infrastructure Configurations
const clientId = "1000.74A1BT4YA21C75R61O3CBO328AKE2R";
const scopes = "ZohoDesk.tickets.ALL,ZohoDesk.contacts.ALL,ZohoDesk.agents.ALL"; 
const redirectUri = "https://woggleconsulting.github.io/fathom-zoho-extension/wd-oauth-callback";
const delugeRestUrl = "https://plugin-fathomaimeetingnotesintegration0.zohosandbox.com/crm/v7/functions/fathomaimeetingnotesintegration0__exchangeoauthcode/actions/execute?auth_type=apikey&zapikey=1003.0a0d48eb72ca0be4eb70b99e6816b465.b7143d1d0658f626d5ae193057160613";

// Step Flow Tracking Navigation Handler Layer Engine
function moveStep(targetStepInt) {
    clearInlineErrorAlertBanner();
    document.getElementById("wz-stepper-header").style.display = "flex";
    
    for(let i = 1; i <= 3; i++) {
        const node = document.getElementById(`node-${i}`);
        if(node) {
            node.classList.remove("active", "completed");
            if (i < targetStepInt) node.classList.add("completed");
            else if (i === targetStepInt) node.classList.add("active");
        }
    }
    renderUIStatePanelRoute(`panel-step-${targetStepInt}`);
}

// Single Password Mask Field Tracker Connection Validator Gateway Task
function handleTestConnection() {
    clearInlineErrorAlertBanner();
    const keyInputValueStr = document.getElementById("input-api-key").value.trim();
    
    if (!keyInputValueStr) {
        showInlineErrorAlertBanner("Fathom Bearer Token context string cannot be initialized blank.");
        return;
    }

    const btn = document.getElementById("btn-test-connection");
    btn.disabled = true;
    btn.innerHTML = "Validating Access...";

    configState.api_key = keyInputValueStr;

    const payloadData = JSON.stringify({
        "action_type": "test_connection",
        "api_key_override": keyInputValueStr
    });

    const executionBody = {
        "arguments": payloadData
    };

    ZOHO.CRM.FUNCTIONS.execute("fathomaimeetingnotesintegration0__register_fathom_webhook", executionBody)
    .then(function(execData) {
        if (!execData || !execData.details || !execData.details.output) {
            showInlineErrorAlertBanner("Invalid SDK response wrapper structure.");
            btn.disabled = false;
            btn.innerHTML = "Test Connection";
            return;
        }

        const outMap = JSON.parse(execData.details.output);
        btn.disabled = false;
        btn.innerHTML = "Test Connection";

        if (outMap.status === "success") {
            configState.account_name = outMap.account_name || "Verified Fathom User Profile Account";
            
            const stateMessageEl = document.getElementById("connect-state-msg");
            const nextBtnEl = document.getElementById("btn-step1-next");
            const disconnectLinkEl = document.getElementById("link-disconnect");

            if (stateMessageEl) {
                stateMessageEl.innerHTML = `<span style="color:var(--color-success); font-weight:600;">✓ Connected to ${configState.account_name} </span>`;
            }
            if (nextBtnEl) nextBtnEl.disabled = false;
            if (disconnectLinkEl) disconnectLinkEl.style.display = "inline";
            
        } else {
            showInlineErrorAlertBanner(outMap.message || "Invalid API connection parameters. Authentication rejected.");
        }
    }).catch(function(err) {
        btn.disabled = false;
        btn.innerHTML = "Test Connection";
        console.error("Error during connection test execution:", err);
        showInlineErrorAlertBanner("Network infrastructure handshake timed out or query rejected.");
    });
}

function toggleDeskFields(isCheckedBool) {
    const deskFields = document.getElementById("desk-conditional-fields");
    const authBlock = document.getElementById("desk-oauth-auth-block");
    if(deskFields) deskFields.style.display = isCheckedBool ? "flex" : "none";
    if(authBlock) authBlock.style.display = isCheckedBool ? "flex" : "none";
}

// Silent Background Configuration Sequencing Engine Orchestration Layout Layer
function executeBackgroundSetup() {
    clearInlineErrorAlertBanner();
    document.getElementById("wz-stepper-header").style.display = "none";
    renderUIStatePanelRoute("panel-processing");

    const statusLabel = document.getElementById("processing-status-msg");
    
    configState.sync_own = document.getElementById("chk-own").checked;
    configState.sync_team = document.getElementById("chk-team").checked;
    configState.sync_external = document.getElementById("chk-external").checked;
    configState.sync_all = document.getElementById("chk-all").checked;
    configState.capture_transcript = document.getElementById("chk-cap-trans").checked;
    configState.capture_summary = document.getElementById("chk-cap-sum").checked;
    configState.capture_actions = document.getElementById("chk-cap-actions").checked;
    configState.capture_matches = document.getElementById("chk-cap-matches").checked;
    configState.contact_matching = document.getElementById("sel-matching").value;
    configState.desk_enabled = document.getElementById("toggle-desk").checked;
    configState.desk_department = document.getElementById("sel-desk-dept").value;
    configState.desk_priority = document.getElementById("sel-desk-priority").value;

    statusLabel.textContent = "Creating Meeting Notes database system layout module metadata...";
    
    setTimeout(() => {
        statusLabel.textContent = "Configuring pipeline filtering parameters schemas criteria...";
        
        setTimeout(() => {
            statusLabel.textContent = "Connecting to Fathom Secure Endpoint Gateway Webhook loops...";
            
            const payloadData = {
                "action_type": "register_webhook",
                "config_payload_string": configState
            };
            let executionBody = {
                "arguments": JSON.stringify(payloadData)
            };

            ZOHO.CRM.FUNCTIONS.execute("fathomaimeetingnotesintegration0__register_fathom_webhook", executionBody)
            .then(function(serverResultData) {
                try {
                    const finalResultMap = JSON.parse(serverResultData.details.output);
                    if (finalResultMap.status === "success") {
                        configState.webhook_id = finalResultMap.webhook_id;
                        configState.webhook_secret = finalResultMap.webhook_secret;
                        configState.setup_complete = true;

                        statusLabel.textContent = "Almost done... finalizing tracking indexes.";
                        setTimeout(() => {
                            document.getElementById("spinner-loader-graphic").style.display = "none";
                            document.getElementById("success-icon-checkmark").style.display = "block";
                            document.getElementById("processing-headline-text").textContent = "Integration Operational!";
                            statusLabel.textContent = "Fathom engine is fully integrated into your workflows structure.";
                            document.getElementById("processing-action-block").style.display = "flex";
                        }, 1000);
                    } else {
                        handleSetupFailureFallback(finalResultMap.message);
                    }
                } catch(e) {
                    handleSetupFailureFallback("Structural validation mapping parsing crash.");
                }
            }).catch(function(err) {
                handleSetupFailureFallback("Network pipeline registration timed out.");
            });
        }, 1000);
    }, 1000);
}

function handleSetupFailureFallback(errorString) {
    document.getElementById("wz-stepper-header").style.display = "flex";
    moveStep(3);
    showInlineErrorAlertBanner("Setup Aborted: " + errorString);
}

// Dashboard View Initializer Module
async function loadDashboardLayoutView() {
    document.getElementById("wz-stepper-header").style.display = "none";
    renderUIStatePanelRoute("panel-dashboard");
    
    document.getElementById("dash-profile-name").textContent = configState.account_name || "Connected Profile";
    document.getElementById("dash-last-sync-time").textContent = configState.last_sync_timestamp || "Awaiting incoming syncs...";
    
    document.getElementById("dash-toggle-desk").checked = !!configState.desk_enabled;
    document.getElementById("dash-toggle-match").checked = !!configState.capture_matches;
    document.getElementById("dash-toggle-internal").checked = !!configState.sync_all;

    await renderLiveDashboardMetrics();
    await renderRecentMeetingsActivityFeed();
}

async function renderLiveDashboardMetrics() {
    try {
        const result = await ZOHO.CRM.API.getAllRecords({
            Entity: "fathomaimeetingnotesintegration0__Meeting_Notes",
            sort_order: "desc",
            per_page: 100,
            page: 1
        });
        
        let totalMeetingsCount = 0;
        let deskTicketsCount = 0;
        let matchedContactsCount = 0;
        
        if (result && result.data) {
            totalMeetingsCount = result.data.length;
            
            result.data.forEach(record => {
                if (record.fathomaimeetingnotesintegration0__Ticket_ID || record.fathomaimeetingnotesintegration0__Desk_Status) {
                    deskTicketsCount++;
                }
                if (record.fathomaimeetingnotesintegration0__Contact_Lookup) {
                    matchedContactsCount++;
                }
            });
        }
        
        const matchedPercentage = totalMeetingsCount > 0 
            ? Math.round((matchedContactsCount / totalMeetingsCount) * 100) 
            : 0;
            
        document.getElementById("dash-stat-meetings").textContent = totalMeetingsCount;
        document.getElementById("dash-stat-tickets").textContent = deskTicketsCount;
        document.getElementById("dash-stat-matched-pct").textContent = matchedPercentage + "%";
        
    } catch (error) {
        console.error("Dashboard metrics engine exception error:", error);
        document.getElementById("dash-stat-meetings").textContent = "0";
        document.getElementById("dash-stat-tickets").textContent = "0";
        document.getElementById("dash-stat-matched-pct").textContent = "0%";
    }
}

async function renderRecentMeetingsActivityFeed() {
    const feedContainer = document.getElementById("recent-meetings-feed-target");
    feedContainer.innerHTML = `<div style="padding:16px; font-size:13px; color:var(--color-text-secondary);">Querying timeline feed entries...</div>`;
    
    try {
        const result = await ZOHO.CRM.API.getAllRecords({
            Entity: "fathomaimeetingnotesintegration0__Meeting_Notes",
            sort_order: "desc",
            per_page: 5,
            page: 1
        });
        
        if (!result || !result.data || result.data.length === 0) {
            feedContainer.innerHTML = `<div style="padding:24px; text-align:center; font-size:13px; color:var(--color-text-secondary);">No meeting logs found. Complete a call or trigger a manual sync backfill loop.</div>`;
            return;
        }
        
        let htmlBuffer = "";
        result.data.forEach(meeting => {
            const dateStr = meeting.Created_Time ? new Date(meeting.Created_Time).toLocaleDateString() : "Recent Call";
            const fathomUrl = meeting.fathomaimeetingnotesintegration0__Fathom_URL || "#";
            
            htmlBuffer += `
                <div class="feed-item" style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid var(--color-border);">
                    <div>
                        <div style="font-size:14px; font-weight:600; color:var(--color-text-primary);">${meeting.Name}</div>
                        <div style="font-size:12px; color:var(--color-text-secondary);">Processed: ${dateStr}</div>
                    </div>
                    <div>
                        <a href="${fathomUrl}" target="_blank" class="btn btn-secondary" style="padding:4px 10px; font-size:11px; text-decoration:none; display:inline-block;">Open Fathom</a>
                    </div>
                </div>
            `;
        });
        
        feedContainer.innerHTML = htmlBuffer;
        
    } catch (error) {
        feedContainer.innerHTML = `<div style="padding:16px; font-size:13px; color:var(--color-text-secondary);">No active history logs indexed in your workspace.</div>`;
    }
}

// REST Token Handshake Trigger Engine
async function saveCodeToZohoCRM(authCode) {
    try {
        const response = await fetch(`${delugeRestUrl}&oauthCode=${authCode}`, {
            method: 'POST'
        });
        const result = await response.json();
        console.log("Deluge Response:", result);
        
        // Dynamic success styling feedback updates
        document.getElementById("desk-oauth-auth-block").style.background = "#E8F5E9";
        document.getElementById("desk-oauth-auth-block").style.borderColor = "var(--color-success)";
        document.getElementById("desk-auth-status-label").innerText = "Authentication Status: Connected ✓";
        document.getElementById("desk-auth-status-label").style.color = "var(--color-success)";
        
        const connectBtn = document.getElementById("connectDeskBtn");
        if (connectBtn) connectBtn.style.display = "none";

        alert("Desk Connection Successfully Secured!");
    } catch (error) {
        console.error("Failed to send code to Deluge:", error);
        alert("Failed to save authentication details.");
        const connectBtn = document.getElementById("connectDeskBtn");
        if (connectBtn) {
            connectBtn.innerText = "Connect to Desk";
            connectBtn.disabled = false;
        }
    }
}

async function saveQuickSettingsUpdates() {
    configState.desk_enabled = document.getElementById("dash-toggle-desk").checked;
    configState.capture_matches = document.getElementById("dash-toggle-match").checked;
    configState.sync_all = document.getElementById("dash-toggle-internal").checked;
    
    const savePayload = {
        apiname: "fathomaimeetingnotesintegration0__Fathom_Config_Data",
        value: JSON.stringify(configState)
    };
    
    try {
        const response = await ZOHO.CRM.CONNECTOR.invokeConnector("crm.set", savePayload);
        console.log("State persistence response payload:", response);
    } catch (error) {
        console.error("Failure during configuration persistence routing:", error);
        alert("Failed to save updated adjustments context.");
    }
}

// Global UI View Router Engine Switcher
function renderUIStatePanelRoute(panelIdTarget) {
    const panels = document.querySelectorAll(".view-panel");
    panels.forEach(p => p.classList.remove("active"));
    const activePanel = document.getElementById(panelIdTarget);
    if(activePanel) activePanel.classList.add("active");
}

function showInlineErrorAlertBanner(messageText) {
    const banner = document.getElementById("error-alert-banner");
    if(banner) {
        banner.textContent = messageText;
        banner.style.display = "block";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function clearInlineErrorAlertBanner() {
    const banner = document.getElementById("error-alert-banner");
    if(banner) banner.style.display = "none";
}

function triggerDisconnectModal() {
    document.getElementById("modal-container").style.display = "flex";
    document.getElementById("modal-confirm-btn").onclick = confirmDestructiveDisconnect;
}

function closeActiveModalWindow() {
    document.getElementById("modal-container").style.display = "none";
}

function confirmDestructiveDisconnect() {
    closeActiveModalWindow();
    showInlineErrorAlertBanner("Disconnecting channel integrations tracking layouts...");
    
    const payloadData = { "action_type": "teardown_disconnect" };

    ZOHO.CRM.FUNCTIONS.execute("fathomaimeetingnotesintegration0__register_fathom_webhook", { 
        "arguments": JSON.stringify({
            "custom_parameters": payloadData
        })
    })
    .then(function() {
        location.reload();
    }).catch(function() {
        location.reload();
    });
}

function triggerManualSyncAction(buttonElement) {
    const originalText = buttonElement.textContent;
    buttonElement.disabled = true;
    buttonElement.textContent = "Syncing...";
    
    ZOHO.CRM.FUNCTIONS.execute("fathomaimeetingnotesintegration0__sync_meetings", {})
    .then(function(data) {
        buttonElement.disabled = false;
        buttonElement.textContent = originalText;
        loadDashboardLayoutView();
    })
    .catch(function(error) {
        console.error("Manual execution trigger failure:", error);
        buttonElement.disabled = false;
        buttonElement.textContent = originalText;
        alert("Manual sync request encountered exceptions.");
    });
}

// Initialize Zoho Embedded Core Handshake
console.log("App.js loaded. Initializing Zoho SDK Handshake...");

ZOHO.embeddedApp.init().then(function() {
    console.log("Zoho SDK connection established successfully.");
    
    // Safety UI reset states
    clearInlineErrorAlertBanner();
    renderUIStatePanelRoute("panel-step-1");
    
    const testBtn = document.getElementById("btn-test-connection");
    if (testBtn) testBtn.disabled = false;

    // WIRE UP DESK OAUTH TRIGGER SAFELY INSIDE RUNTIME INITIALIZATION
    const connectDeskBtn = document.getElementById("connectDeskBtn");
    if (connectDeskBtn) {
        connectDeskBtn.addEventListener("click", () => {
            const authUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=${scopes}&client_id=${clientId}&response_type=code&access_type=offline&redirect_uri=${encodeURIComponent(redirectUri)}&prompt=consent&state=zd_connect`;
            const popup = window.open(authUrl, "ZohoDeskAuth", "width=600,height=700");

            connectDeskBtn.innerText = "Authorizing...";
            connectDeskBtn.disabled = true;

            window.addEventListener("message", async function oauthListener(event) {
                if (event.origin !== "https://woggleconsulting.github.io") return;

                const data = event.data;
                if (data && data.type === 'zd_oauth') {
                    window.removeEventListener("message", oauthListener);
                    popup.close();

                    if (data.error) {
                        console.error("User denied authentication:", data.error);
                        alert("Connection failed: " + data.error);
                        connectDeskBtn.innerText = "Connect to Desk";
                        connectDeskBtn.disabled = false;
                        return;
                    }

                    if (data.code) {
                        console.log("Captured Authorization Code for Desk:", data.code);
                        await saveCodeToZohoCRM(data.code);
                    }
                }
            });
        });
    }

    // Auto-detect environment location parameters
    ZOHO.CRM.CONFIG.getOrgInfo().then(function(orgDetails) {
        if (orgDetails && orgDetails.org && orgDetails.org.api_domain) {
            const detectedDomain = orgDetails.org.api_domain;
            ZOHO.CRM.FUNCTIONS.execute("fathomaimeetingnotesintegration0__register_fathom_webhook", {
                "arguments": JSON.stringify({
                    "action_type": "save_api_domain",
                    "api_domain_value": detectedDomain
                })
            });
        }
    });
});