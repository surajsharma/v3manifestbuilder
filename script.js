        // All valid Manifest V3 permissions (verified from Chrome Extension docs)
        const PERMISSIONS = [
            'activeTab', 'alarms', 'background', 'bookmarks', 'browsingData',
            'certificateProvider', 'clipboardRead', 'clipboardWrite', 'contentSettings',
            'contextMenus', 'cookies', 'debugger', 'declarativeContent',
            'declarativeNetRequest', 'declarativeNetRequestWithHostAccess',
            'declarativeNetRequestFeedback', 'desktopCapture', 'documentScan',
            'downloads', 'downloads.open', 'downloads.ui', 'enterprise.deviceAttributes',
            'enterprise.hardwarePlatform', 'enterprise.networkingAttributes',
            'enterprise.platformKeys', 'favicon', 'fileBrowserHandler',
            'fileSystemProvider', 'fontSettings', 'gcm', 'geolocation',
            'history', 'identity', 'identity.email', 'idle', 'loginState',
            'management', 'nativeMessaging', 'notifications', 'offscreen',
            'pageCapture', 'platformKeys', 'power', 'printerProvider',
            'printing', 'printingMetrics', 'privacy', 'processes', 'proxy',
            'readingList', 'runtime', 'scripting', 'search', 'sessions',
            'sidePanel', 'storage', 'system.cpu', 'system.display',
            'system.memory', 'system.storage', 'tabCapture', 'tabGroups',
            'tabs', 'topSites', 'tts', 'ttsEngine', 'unlimitedStorage',
            'vpnProvider', 'wallpaper', 'webAuthenticationProxy', 'webNavigation',
            'webRequest'
        ];

        // Permissions that can be optional
        const OPTIONAL_PERMISSIONS = [
            'activeTab', 'background', 'bookmarks', 'clipboardRead', 'clipboardWrite',
            'contentSettings', 'contextMenus', 'cookies', 'declarativeContent',
            'declarativeNetRequestFeedback', 'desktopCapture', 'downloads',
            'favicon', 'fontSettings', 'geolocation', 'history', 'identity',
            'idle', 'management', 'notifications', 'pageCapture', 'power',
            'privacy', 'readingList', 'scripting', 'search', 'sessions',
            'sidePanel', 'storage', 'system.display', 'tabGroups', 'tabs',
            'topSites', 'tts', 'unlimitedStorage', 'webNavigation', 'webRequest'
        ];

        let contentScriptCounter = 0;
        let webResourceCounter = 0;
        let commandCounter = 0;
        let dnrCounter = 0;
        let ttsCounter = 0;

        // Initialize permission checkboxes
        function initPermissions() {
            const container = document.getElementById('permissions-list');
            PERMISSIONS.forEach(perm => {
                const div = document.createElement('div');
                div.className = 'checkbox-item';
                div.innerHTML = `
                    <input type="checkbox" id="perm-${perm}" value="${perm}">
                    <label for="perm-${perm}">${perm}</label>
                `;
                container.appendChild(div);
            });

            const optContainer = document.getElementById('optional-permissions-list');
            OPTIONAL_PERMISSIONS.forEach(perm => {
                const div = document.createElement('div');
                div.className = 'checkbox-item';
                div.innerHTML = `
                    <input type="checkbox" id="opt-perm-${perm}" value="${perm}">
                    <label for="opt-perm-${perm}">${perm}</label>
                `;
                optContainer.appendChild(div);
            });
        }

        // Toggle collapsible sections
        function toggleSection(id) {
            const content = document.getElementById(id + '-content');
            const title = event.currentTarget;
            content.classList.toggle('collapsed');
            title.classList.toggle('collapsed');
        }

        // Add content script
        function addContentScript() {
            const container = document.getElementById('content-scripts-container');
            const id = contentScriptCounter++;
            const div = document.createElement('div');
            div.className = 'array-input';
            div.innerHTML = `
                <div class="form-group">
                    <label>Matches (comma-separated)</label>
                    <input type="text" id="cs-matches-${id}" placeholder="https://*/*, http://*/*">
                </div>
                <div class="form-group">
                    <label>JavaScript Files (comma-separated)</label>
                    <input type="text" id="cs-js-${id}" placeholder="content.js, script.js">
                </div>
                <div class="form-group">
                    <label>CSS Files (comma-separated)</label>
                    <input type="text" id="cs-css-${id}" placeholder="content.css">
                </div>
                <div class="grid-2">
                    <div class="form-group">
                        <label>Run At</label>
                        <select id="cs-run-at-${id}">
                            <option value="">document_idle (default)</option>
                            <option value="document_start">document_start</option>
                            <option value="document_end">document_end</option>
                            <option value="document_idle">document_idle</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>World</label>
                        <select id="cs-world-${id}">
                            <option value="">ISOLATED (default)</option>
                            <option value="ISOLATED">ISOLATED</option>
                            <option value="MAIN">MAIN</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label><input type="checkbox" id="cs-all-frames-${id}"> All Frames</label>
                    <label><input type="checkbox" id="cs-match-about-${id}"> Match About Blank</label>
                    <label><input type="checkbox" id="cs-match-origin-${id}"> Match Origin as Fallback</label>
                </div>
                <button class="btn-remove" onclick="this.parentElement.remove(); updateOutput();">Remove</button>
            `;
            container.appendChild(div);
            attachEventListeners(div);
        }

        // Add web accessible resource
        function addWebResource() {
            const container = document.getElementById('web-resources-container');
            const id = webResourceCounter++;
            const div = document.createElement('div');
            div.className = 'array-input';
            div.innerHTML = `
                <div class="form-group">
                    <label>Resources (comma-separated)</label>
                    <input type="text" id="war-resources-${id}" placeholder="images/*.png, styles/*.css">
                </div>
                <div class="form-group">
                    <label>Matches (comma-separated)</label>
                    <input type="text" id="war-matches-${id}" placeholder="https://*/*">
                </div>
                <div class="form-group">
                    <label>Extension IDs (comma-separated, optional)</label>
                    <input type="text" id="war-ids-${id}" placeholder="aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa">
                </div>
                <div class="form-group">
                    <label><input type="checkbox" id="war-dynamic-${id}"> Use Dynamic URL</label>
                </div>
                <button class="btn-remove" onclick="this.parentElement.remove(); updateOutput();">Remove</button>
            `;
            container.appendChild(div);
            attachEventListeners(div);
        }

        // Add command
        function addCommand() {
            const container = document.getElementById('commands-container');
            const id = commandCounter++;
            const div = document.createElement('div');
            div.className = 'array-input';
            div.innerHTML = `
                <div class="form-group">
                    <label>Command Name</label>
                    <input type="text" id="cmd-name-${id}" placeholder="_execute_action or custom_command">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <input type="text" id="cmd-desc-${id}" placeholder="Command description">
                </div>
                <div class="form-group">
                    <label>Suggested Key (optional)</label>
                    <input type="text" id="cmd-key-${id}" placeholder="Ctrl+Shift+Y">
                    <div class="hint">Format: Ctrl+Shift+[A-Z] or Alt+Shift+[A-Z]</div>
                </div>
                <button class="btn-remove" onclick="this.parentElement.remove(); updateOutput();">Remove</button>
            `;
            container.appendChild(div);
            attachEventListeners(div);
        }

        // Add DNR rule resource
        function addDNRRule() {
            const container = document.getElementById('dnr-container');
            const id = dnrCounter++;
            const div = document.createElement('div');
            div.className = 'array-input';
            div.innerHTML = `
                <div class="form-group">
                    <label>ID</label>
                    <input type="text" id="dnr-id-${id}" placeholder="ruleset_1">
                </div>
                <div class="form-group">
                    <label>Path</label>
                    <input type="text" id="dnr-path-${id}" placeholder="rules.json">
                </div>
                <div class="form-group">
                    <label><input type="checkbox" id="dnr-enabled-${id}"> Enabled by Default</label>
                </div>
                <button class="btn-remove" onclick="this.parentElement.remove(); updateOutput();">Remove</button>
            `;
            container.appendChild(div);
            attachEventListeners(div);
        }

        // Add TTS voice
        function addTTSVoice() {
            const container = document.getElementById('tts-container');
            const id = ttsCounter++;
            const div = document.createElement('div');
            div.className = 'array-input';
            div.innerHTML = `
                <div class="form-group">
                    <label>Voice Name</label>
                    <input type="text" id="tts-name-${id}" placeholder="Alice">
                </div>
                <div class="form-group">
                    <label>Language</label>
                    <input type="text" id="tts-lang-${id}" placeholder="en-US">
                </div>
                <div class="form-group">
                    <label>Gender</label>
                    <select id="tts-gender-${id}">
                        <option value="">None</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Event Types (comma-separated)</label>
                    <input type="text" id="tts-events-${id}" placeholder="start, end, word">
                </div>
                <button class="btn-remove" onclick="this.parentElement.remove(); updateOutput();">Remove</button>
            `;
            container.appendChild(div);
            attachEventListeners(div);
        }

        // Attach event listeners to dynamic elements
        function attachEventListeners(element) {
            element.querySelectorAll('input, select, textarea').forEach(el => {
                el.addEventListener('input', updateOutput);
                el.addEventListener('change', updateOutput);
            });
        }

        // Get value helper
        function getValue(id) {
            const el = document.getElementById(id);
            return el ? el.value.trim() : '';
        }

        // Get checkbox value helper
        function getChecked(id) {
            const el = document.getElementById(id);
            return el ? el.checked : false;
        }

        // Split text by lines or commas
        function splitValues(text, delimiter = '\n') {
            return text.split(delimiter).map(s => s.trim()).filter(s => s);
        }

        // Generate manifest
        function generateManifest() {
            const manifest = {
                manifest_version: 3,
                name: getValue('name') || 'My Extension',
                version: getValue('version') || '1.0.0',
                description: getValue('description') || 'Extension description'
            };

            // Short name
            const shortName = getValue('short_name');
            if (shortName) manifest.short_name = shortName;

            // Version name
            const versionName = getValue('version_name');
            if (versionName) manifest.version_name = versionName;

            // Author
            const author = getValue('author');
            if (author) manifest.author = author;

            // Homepage
            const homepage = getValue('homepage_url');
            if (homepage) manifest.homepage_url = homepage;

            // Icons
            const icons = {};
            if (getValue('icon16')) icons['16'] = getValue('icon16');
            if (getValue('icon32')) icons['32'] = getValue('icon32');
            if (getValue('icon48')) icons['48'] = getValue('icon48');
            if (getValue('icon128')) icons['128'] = getValue('icon128');
            if (Object.keys(icons).length > 0) manifest.icons = icons;

            // Action
            const actionPopup = getValue('action_popup');
            const actionTitle = getValue('action_title');
            const actionIcon = {};
            if (getValue('action_icon16')) actionIcon['16'] = getValue('action_icon16');
            if (getValue('action_icon32')) actionIcon['32'] = getValue('action_icon32');
            if (getValue('action_icon48')) actionIcon['48'] = getValue('action_icon48');
            if (getValue('action_icon128')) actionIcon['128'] = getValue('action_icon128');

            if (actionPopup || actionTitle || Object.keys(actionIcon).length > 0) {
                manifest.action = {};
                if (actionPopup) manifest.action.default_popup = actionPopup;
                if (actionTitle) manifest.action.default_title = actionTitle;
                if (Object.keys(actionIcon).length > 0) manifest.action.default_icon = actionIcon;
            }

            // Background
            const serviceWorker = getValue('service_worker');
            if (serviceWorker) {
                manifest.background = { service_worker: serviceWorker };
                const bgType = getValue('background_type');
                if (bgType) manifest.background.type = bgType;
            }

            // Content Scripts
            const contentScripts = [];
            for (let i = 0; i < contentScriptCounter; i++) {
                const matches = getValue(`cs-matches-${i}`);
                if (!matches) continue;

                const cs = {
                    matches: matches.split(',').map(s => s.trim()).filter(s => s)
                };

                const js = getValue(`cs-js-${i}`);
                if (js) cs.js = js.split(',').map(s => s.trim()).filter(s => s);

                const css = getValue(`cs-css-${i}`);
                if (css) cs.css = css.split(',').map(s => s.trim()).filter(s => s);

                const runAt = getValue(`cs-run-at-${i}`);
                if (runAt) cs.run_at = runAt;

                const world = getValue(`cs-world-${i}`);
                if (world) cs.world = world;

                if (getChecked(`cs-all-frames-${i}`)) cs.all_frames = true;
                if (getChecked(`cs-match-about-${i}`)) cs.match_about_blank = true;
                if (getChecked(`cs-match-origin-${i}`)) cs.match_origin_as_fallback = true;

                contentScripts.push(cs);
            }
            if (contentScripts.length > 0) manifest.content_scripts = contentScripts;

            // Permissions
            const permissions = [];
            document.querySelectorAll('#permissions-list input[type="checkbox"]:checked').forEach(cb => {
                permissions.push(cb.value);
            });
            if (permissions.length > 0) manifest.permissions = permissions;

            // Optional Permissions
            const optPermissions = [];
            document.querySelectorAll('#optional-permissions-list input[type="checkbox"]:checked').forEach(cb => {
                optPermissions.push(cb.value);
            });
            if (optPermissions.length > 0) manifest.optional_permissions = optPermissions;

            // Host Permissions
            const hostPerms = splitValues(getValue('host_permissions'));
            if (hostPerms.length > 0) manifest.host_permissions = hostPerms;

            // Optional Host Permissions
            const optHostPerms = splitValues(getValue('optional_host_permissions'));
            if (optHostPerms.length > 0) manifest.optional_host_permissions = optHostPerms;

            // Options Page (legacy)
            const optionsPage = getValue('options_page');
            if (optionsPage) manifest.options_page = optionsPage;

            // Options UI
            const optionsUIPage = getValue('options_ui_page');
            if (optionsUIPage) {
                manifest.options_ui = { page: optionsUIPage };
                if (getChecked('options_ui_open_in_tab')) {
                    manifest.options_ui.open_in_tab = true;
                }
            }

            // Side Panel
            const sidePanelPath = getValue('side_panel_path');
            if (sidePanelPath) {
                manifest.side_panel = { default_path: sidePanelPath };
            }

            // DevTools
            const devtoolsPage = getValue('devtools_page');
            if (devtoolsPage) manifest.devtools_page = devtoolsPage;

            // Web Accessible Resources
            const webResources = [];
            for (let i = 0; i < webResourceCounter; i++) {
                const resources = getValue(`war-resources-${i}`);
                const matches = getValue(`war-matches-${i}`);
                if (!resources || !matches) continue;

                const war = {
                    resources: resources.split(',').map(s => s.trim()).filter(s => s),
                    matches: matches.split(',').map(s => s.trim()).filter(s => s)
                };

                const ids = getValue(`war-ids-${i}`);
                if (ids) war.extension_ids = ids.split(',').map(s => s.trim()).filter(s => s);

                if (getChecked(`war-dynamic-${i}`)) war.use_dynamic_url = true;

                webResources.push(war);
            }
            if (webResources.length > 0) manifest.web_accessible_resources = webResources;

            // Omnibox
            const omniboxKeyword = getValue('omnibox_keyword');
            if (omniboxKeyword) {
                manifest.omnibox = { keyword: omniboxKeyword };
            }

            // Commands
            const commands = {};
            for (let i = 0; i < commandCounter; i++) {
                const name = getValue(`cmd-name-${i}`);
                const desc = getValue(`cmd-desc-${i}`);
                if (!name || !desc) continue;

                commands[name] = { description: desc };
                const key = getValue(`cmd-key-${i}`);
                if (key) commands[name].suggested_key = { default: key };
            }
            if (Object.keys(commands).length > 0) manifest.commands = commands;

            // Declarative Net Request
            const dnrRules = [];
            for (let i = 0; i < dnrCounter; i++) {
                const id = getValue(`dnr-id-${i}`);
                const path = getValue(`dnr-path-${i}`);
                if (!id || !path) continue;

                const rule = { id, path };
                if (getChecked(`dnr-enabled-${i}`)) rule.enabled = true;
                dnrRules.push(rule);
            }
            if (dnrRules.length > 0) {
                manifest.declarative_net_request = { rule_resources: dnrRules };
            }

            // Externally Connectable
            const extMatches = splitValues(getValue('externally_matches'));
            const extIds = splitValues(getValue('externally_ids'));
            if (extMatches.length > 0 || extIds.length > 0 || getChecked('externally_tls')) {
                manifest.externally_connectable = {};
                if (extMatches.length > 0) manifest.externally_connectable.matches = extMatches;
                if (extIds.length > 0) manifest.externally_connectable.ids = extIds;
                if (getChecked('externally_tls')) manifest.externally_connectable.accepts_tls_channel_id = true;
            }

            // Chrome URL Overrides
            const overrides = {};
            if (getValue('override_newtab')) overrides.newtab = getValue('override_newtab');
            if (getValue('override_bookmarks')) overrides.bookmarks = getValue('override_bookmarks');
            if (getValue('override_history')) overrides.history = getValue('override_history');
            if (Object.keys(overrides).length > 0) manifest.chrome_url_overrides = overrides;

            // Content Security Policy
            const cspExt = getValue('csp_extension');
            const cspSandbox = getValue('csp_sandbox');
            if (cspExt || cspSandbox) {
                manifest.content_security_policy = {};
                if (cspExt) manifest.content_security_policy.extension_pages = cspExt;
                if (cspSandbox) manifest.content_security_policy.sandbox = cspSandbox;
            }

            // Sandbox
            const sandboxPages = splitValues(getValue('sandbox_pages'));
            if (sandboxPages.length > 0) {
                manifest.sandbox = { pages: sandboxPages };
            }

            // Storage
            const managedSchema = getValue('managed_schema');
            if (managedSchema) {
                manifest.storage = { managed_schema: managedSchema };
            }

            // OAuth2
            const oauthClientId = getValue('oauth_client_id');
            const oauthScopes = splitValues(getValue('oauth_scopes'));
            if (oauthClientId || oauthScopes.length > 0) {
                manifest.oauth2 = {};
                if (oauthClientId) manifest.oauth2.client_id = oauthClientId;
                if (oauthScopes.length > 0) manifest.oauth2.scopes = oauthScopes;
            }

            // Cross-Origin Policies
            const coep = getValue('coep');
            if (coep) {
                manifest.cross_origin_embedder_policy = { value: coep };
            }

            const coop = getValue('coop');
            if (coop) {
                manifest.cross_origin_opener_policy = { value: coop };
            }

            // Advanced
            const minVersion = getValue('minimum_chrome_version');
            if (minVersion) manifest.minimum_chrome_version = minVersion;

            const incognito = getValue('incognito');
            if (incognito) manifest.incognito = incognito;

            const defaultLocale = getValue('default_locale');
            if (defaultLocale) manifest.default_locale = defaultLocale;

            const updateUrl = getValue('update_url');
            if (updateUrl) manifest.update_url = updateUrl;

            const key = getValue('key');
            if (key) manifest.key = key;

            if (getChecked('offline_enabled')) manifest.offline_enabled = true;

            // TTS Engine
            const ttsVoices = [];
            for (let i = 0; i < ttsCounter; i++) {
                const name = getValue(`tts-name-${i}`);
                const lang = getValue(`tts-lang-${i}`);
                if (!name) continue;

                const voice = { voice_name: name };
                if (lang) voice.lang = lang;

                const gender = getValue(`tts-gender-${i}`);
                if (gender) voice.gender = gender;

                const events = getValue(`tts-events-${i}`);
                if (events) voice.event_types = events.split(',').map(s => s.trim()).filter(s => s);

                ttsVoices.push(voice);
            }
            if (ttsVoices.length > 0) {
                manifest.tts_engine = { voices: ttsVoices };
            }

            // Requirements
            if (getChecked('require_3d')) {
                manifest.requirements = {
                    '3D': { features: ['webgl'] }
                };
            }

            return manifest;
        }

        // Update output
        function updateOutput() {
            const manifest = generateManifest();
            const output = document.getElementById('output');
            const jsonStr = JSON.stringify(manifest, null, 2);
            const html = Prism.highlight(jsonStr, Prism.languages.json, 'json');
            output.innerHTML = html;
        }

        // Download manifest
        function downloadManifest() {
            const manifest = generateManifest();
            const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'manifest.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast('Downloaded manifest.json');
        }

        // Copy to clipboard
        function copyToClipboard() {
            const output = document.getElementById('output');
            navigator.clipboard.writeText(output.textContent).then(() => {
                showToast('Copied to clipboard!');
            });
        }

        // Show toast notification
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2000);
        }

        // Initialize
        initPermissions();

        // Add event listeners to all inputs
        document.querySelectorAll('input, textarea, select').forEach(element => {
            element.addEventListener('input', updateOutput);
            element.addEventListener('change', updateOutput);
        });

        // Initial update
        updateOutput();