// Test function to verify JavaScript is working
function testJavaScript() {
    alert('JavaScript is working!');
    console.log('JavaScript test function called');
    
    // Test if other functions exist
    console.log('openCreateKeyModal exists:', typeof openCreateKeyModal);
    console.log('copyApiKey exists:', typeof copyApiKey);
    console.log('refreshApiKey exists:', typeof refreshApiKey);
    console.log('deleteApiKey exists:', typeof deleteApiKey);
    
    // Test if elements exist
    console.log('createKeyModal exists:', document.getElementById('createKeyModal'));
    console.log('scopeSelect exists:', document.getElementById('scopeSelect'));
    console.log('permissionsGrid exists:', document.getElementById('permissionsGrid'));
}

// Modal functionality
function openCreateKeyModal() {
    console.log('openCreateKeyModal called');
    const modal = document.getElementById('createKeyModal');
    console.log('Modal element:', modal);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        
        // Load default permissions when modal opens
        updatePermissionsByScope();
        console.log('Modal opened successfully');
    } else {
        console.error('Modal not found!');
    }
}

function closeCreateKeyModal() {
    const modal = document.getElementById('createKeyModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    resetForm();
}

function resetForm() {
    const form = document.getElementById('createKeyForm');
    if (form) {
        form.reset();
        // Reset scope selection to default
        const checkboxes = document.querySelectorAll('#scopeDropdown input[type="checkbox"]');
        checkboxes.forEach(cb => cb.checked = false);
        
        // Reset display text
        const display = document.getElementById('scopeDisplay');
        if (display) {
            display.textContent = 'Select scopes...';
        }
        
        // Clear permissions
        const permissionsGrid = document.getElementById('permissionsGrid');
        if (permissionsGrid) {
            permissionsGrid.innerHTML = '<p>Please select at least one scope</p>';
        }
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const keyName = formData.get('keyName');
    const vendor = formData.get('vendor');
    const userEmail = formData.get('userEmail');
    
    // Get selected scopes from checkboxes
    const selectedScopes = [];
    const scopeCheckboxes = document.querySelectorAll('#scopeDropdown input[type="checkbox"]:checked');
    scopeCheckboxes.forEach(checkbox => {
        selectedScopes.push(checkbox.value);
    });
    
    // Validate required fields
    if (!keyName || !vendor || !userEmail || selectedScopes.length === 0) {
        alert('Please fill in all required fields including at least one scope');
        return;
    }
    
    // Get selected permissions
    const selectedPermissions = [];
    const permissionCheckboxes = document.querySelectorAll('input[name="permissions"]:checked');
    permissionCheckboxes.forEach(checkbox => {
        selectedPermissions.push(checkbox.value);
    });
    
    if (selectedPermissions.length === 0) {
        alert('Please select at least one permission');
        return;
    }
    
    // Here you would typically send the data to your backend
    console.log('API Key Data:', {
        keyName,
        vendor,
        userEmail,
        scopes: selectedScopes,
        permissions: selectedPermissions
    });
    
    // Show success message
    alert('API Key created successfully!');
    
    // Close modal and reset form
    closeCreateKeyModal();
}

// Delete API Key functionality
function closeDeleteKeyModal() {
    const modal = document.getElementById('deleteKeyModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function confirmDeleteApiKey() {
    // Here you would typically call your backend API to delete the key
    console.log('Deleting API key...');
    alert('API Key deleted successfully!');
    closeDeleteKeyModal();
}

// Refresh API Key functionality
function closeRefreshKeyModal() {
    const modal = document.getElementById('refreshKeyModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function confirmRefreshApiKey() {
    // Here you would typically call your backend API to refresh the key
    console.log('Refreshing API key...');
    alert('API Key refreshed successfully!');
    closeRefreshKeyModal();
}

// API Key action functions
function refreshApiKey(apiKey) {
    console.log('Refreshing API key:', apiKey);
    const modal = document.getElementById('refreshKeyModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function deleteApiKey(apiKey) {
    console.log('Deleting API key:', apiKey);
    const modal = document.getElementById('deleteKeyModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// Permission management
function selectAllPermissions() {
    const checkboxes = document.querySelectorAll('input[name="permissions"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
}

function selectNoPermissions() {
    const checkboxes = document.querySelectorAll('input[name="permissions"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}

// Scope-based permissions data
const permissionsData = {
    platform: [
        { resource: 'users', verb: 'read', label: 'users:read' },
        { resource: 'users', verb: 'write', label: 'users:write' },
        { resource: 'users', verb: 'delete', label: 'users:delete' },
        { resource: 'organizations', verb: 'read', label: 'organizations:read' },
        { resource: 'organizations', verb: 'write', label: 'organizations:write' },
        { resource: 'workspaces', verb: 'read', label: 'workspaces:read' },
        { resource: 'workspaces', verb: 'write', label: 'workspaces:write' },
        { resource: 'settings', verb: 'read', label: 'settings:read' },
        { resource: 'settings', verb: 'write', label: 'settings:write' }
    ],
    crm: [
        { resource: 'contacts', verb: 'read', label: 'contacts:read' },
        { resource: 'contacts', verb: 'write', label: 'contacts:write' },
        { resource: 'contacts', verb: 'delete', label: 'contacts:delete' },
        { resource: 'leads', verb: 'read', label: 'leads:read' },
        { resource: 'leads', verb: 'write', label: 'leads:write' },
        { resource: 'deals', verb: 'read', label: 'deals:read' },
        { resource: 'deals', verb: 'write', label: 'deals:write' },
        { resource: 'tasks', verb: 'read', label: 'tasks:read' },
        { resource: 'tasks', verb: 'write', label: 'tasks:write' }
    ]
};

// Multiselect functionality
function toggleMultiselect() {
    const dropdown = document.getElementById('scopeDropdown');
    const display = document.querySelector('.multiselect-display');
    
    if (dropdown.classList.contains('show')) {
        dropdown.classList.remove('show');
        display.classList.remove('open');
    } else {
        dropdown.classList.add('show');
        display.classList.add('open');
    }
}

function updateScopeSelection() {
    const checkboxes = document.querySelectorAll('#scopeDropdown input[type="checkbox"]:checked');
    const display = document.getElementById('scopeDisplay');
    
    if (checkboxes.length === 0) {
        display.textContent = 'Select scopes...';
    } else if (checkboxes.length === 1) {
        display.textContent = checkboxes[0].value.charAt(0).toUpperCase() + checkboxes[0].value.slice(1);
    } else {
        display.textContent = `${checkboxes.length} scopes selected`;
    }
    
    // Update permissions based on selected scopes
    updatePermissionsByScope();
}

// Update permissions based on scope selection
function updatePermissionsByScope() {
    console.log('updatePermissionsByScope called');
    const checkboxes = document.querySelectorAll('#scopeDropdown input[type="checkbox"]:checked');
    const permissionsGrid = document.getElementById('permissionsGrid');
    
    if (!permissionsGrid) {
        console.error('Permissions grid not found');
        return;
    }
    
    // Get all selected scopes
    const selectedScopes = Array.from(checkboxes).map(cb => cb.value);
    console.log('Selected scopes:', selectedScopes);
    
    if (selectedScopes.length === 0) {
        permissionsGrid.innerHTML = '<p>Please select at least one scope</p>';
        return;
    }
    
    // Combine permissions from all selected scopes
    let allPermissions = [];
    selectedScopes.forEach(scope => {
        const scopePermissions = permissionsData[scope] || [];
        allPermissions = allPermissions.concat(scopePermissions);
    });
    
    console.log('Combined permissions:', allPermissions);
    
    if (allPermissions.length > 0) {
        permissionsGrid.innerHTML = allPermissions.map(permission => `
            <label class="permission-checkbox">
                <input type="checkbox" name="permissions" value="${permission.label}">
                ${permission.label}
            </label>
        `).join('');
        console.log('Permissions grid updated with combined permissions');
    } else {
        permissionsGrid.innerHTML = '<p>No permissions available for selected scopes</p>';
    }
}

// Search functionality
function searchKeys() {
    const searchTerm = document.querySelector('.search-box input').value.toLowerCase();
    const rows = document.querySelectorAll('.api-keys-table tbody tr');
    
    rows.forEach(row => {
        const keyName = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const vendor = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        
        if (keyName.includes(searchTerm) || vendor.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Update expired states
function updateExpiredStates() {
    const rows = document.querySelectorAll('.api-keys-table tbody tr');
    const now = new Date();
    
    rows.forEach(row => {
        const expiresCell = row.querySelector('td:nth-child(6)');
        if (expiresCell) {
            const expiresText = expiresCell.textContent;
            if (expiresText !== 'Never' && expiresText !== 'Expired') {
                const expiresDate = new Date(expiresText);
                if (expiresDate < now) {
                    expiresCell.textContent = 'Expired';
                    expiresCell.classList.add('expired');
                }
            }
        }
    });
}

// Table sorting functionality
function sortTable(column) {
    const table = document.querySelector('.api-keys-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Get current sort direction from the header
    const header = table.querySelector(`th:nth-child(${column === 'expires' ? 6 : 7})`);
    const sortIcon = header.querySelector('.sort-icon');
    const isAscending = sortIcon.textContent === '↑';
    
    // Toggle sort direction
    const newDirection = isAscending ? 'desc' : 'asc';
    sortIcon.textContent = newDirection === 'asc' ? '↑' : '↓';
    
    // Sort rows
    rows.sort((a, b) => {
        let aValue = a.cells[column === 'expires' ? 5 : 6].textContent;
        let bValue = b.cells[column === 'expires' ? 5 : 6].textContent;
        
        // Handle date sorting
        if (aValue === 'Never') aValue = new Date('9999-12-31');
        else if (aValue === 'Expired') aValue = new Date('1900-01-01');
        else aValue = new Date(aValue);
        
        if (bValue === 'Never') bValue = new Date('9999-12-31');
        else if (bValue === 'Expired') bValue = new Date('1900-01-01');
        else bValue = new Date(bValue);
        
        if (newDirection === 'asc') {
            return aValue - bValue;
        } else {
            return bValue - aValue;
        }
    });
    
    // Re-append sorted rows
    rows.forEach(row => tbody.appendChild(row));
}

// API Key Copy Functionality
function copyApiKey(apiKey, element) {
    // Check if already copied
    if (element.classList.contains('copied')) {
        return; // Don't allow copying again
    }
    
    // Copy to clipboard
    navigator.clipboard.writeText(apiKey).then(() => {
        // Update the display
        const apiKeyText = element.querySelector('.api-key-text');
        const copyInstruction = element.querySelector('.copy-instruction');
        
        // Show the full key briefly
        apiKeyText.textContent = apiKey;
        
        // Replace instruction with success message
        copyInstruction.innerHTML = '<span class="copy-success">Copied! Key hidden for security.</span>';
        
        // Add copied class for styling
        element.classList.add('copied');
        
        // Hide the key and remove success message after 2 seconds
        setTimeout(() => {
            apiKeyText.textContent = apiKey.substring(0, 8) + '••••••••••••••••';
            copyInstruction.innerHTML = '';
            element.classList.remove('copied');
        }, 2000);
        
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy API key to clipboard');
    });
}

// Utility functions
function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function formatRelativeTime(date) {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else {
        return `${days} days ago`;
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const createKeyModal = document.getElementById('createKeyModal');
    if (createKeyModal) {
        createKeyModal.addEventListener('click', function(e) {
            if (e.target === createKeyModal) {
                closeCreateKeyModal();
            }
        });
    }

    // Handle form submission
    const createKeyForm = document.getElementById('createKeyForm');
    if (createKeyForm) {
        createKeyForm.addEventListener('submit', handleFormSubmission);
        
        // Also handle submit button click as backup
        const submitBtn = createKeyForm.querySelector('button[type="submit"]');
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleFormSubmission(e);
        });
    }
    
    // Close multiselect dropdown when clicking outside
    document.addEventListener('click', function(e) {
        const multiselectContainer = document.querySelector('.multiselect-container');
        if (multiselectContainer && !multiselectContainer.contains(e.target)) {
            const dropdown = document.getElementById('scopeDropdown');
            const display = document.querySelector('.multiselect-display');
            if (dropdown && dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
                display.classList.remove('open');
            }
        }
    });
});

// Add event listeners for search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-box input');
    
    if (searchInput) {
        searchInput.addEventListener('input', searchKeys);
    }
    
    // Update expired states on page load
    updateExpiredStates();
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('createKeyModal');
        if (modal.classList.contains('show')) {
            closeCreateKeyModal();
        }
    }
    
    // Ctrl/Cmd + K to open create key modal
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openCreateKeyModal();
    }
});
