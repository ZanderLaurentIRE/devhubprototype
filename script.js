// Modal functionality
function openCreateKeyModal() {
    const modal = document.getElementById('createKeyModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Load default permissions when modal opens
    updatePermissionsByScope();
}

function closeCreateKeyModal() {
    const modal = document.getElementById('createKeyModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    resetForm();
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('createKeyModal');
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeCreateKeyModal();
        }
    });



    // Handle form submission
    const form = document.getElementById('createKeyForm');
    form.addEventListener('submit', handleFormSubmission);
    
    // Also handle submit button click as backup
    const submitBtn = document.querySelector('#createKeyForm button[type="submit"]');
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        handleFormSubmission(e);
    });


});

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

// Update permissions based on scope selection
function updatePermissionsByScope() {
    const scopeSelect = document.getElementById('scopeSelect');
    const permissionsGrid = document.getElementById('permissionsGrid');
    const scope = scopeSelect.value;
    
    if (!scope) {
        // Show default permissions when no scope is selected
        const defaultPermissions = [
            { resource: 'contacts', verb: 'read', label: 'contacts:read' },
            { resource: 'contacts', verb: 'write', label: 'contacts:write' },
            { resource: 'contacts', verb: 'delete', label: 'contacts:delete' },
            { resource: 'contacts', verb: 'create', label: 'contacts:create' },
            { resource: 'users', verb: 'read', label: 'users:read' },
            { resource: 'private_contacts', verb: 'read', label: 'private_contacts:read' }
        ];
        
        permissionsGrid.innerHTML = defaultPermissions.map(permission => `
            <label class="permission-checkbox">
                <input type="checkbox" name="permissions" value="${permission.label}">
                ${permission.label}
            </label>
        `).join('');
        return;
    }
    
    const permissions = permissionsData[scope] || [];
    
    permissionsGrid.innerHTML = permissions.map(permission => `
        <label class="permission-checkbox">
            <input type="checkbox" name="permissions" value="${permission.label}">
            ${permission.label}
        </label>
    `).join('');
}

function filterPermissions() {
    const searchTerm = document.getElementById('permissionSearch').value.toLowerCase();
    const checkboxes = document.querySelectorAll('.permission-checkbox');

    checkboxes.forEach(checkbox => {
        const text = checkbox.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            checkbox.style.display = 'flex';
        } else {
            checkbox.style.display = 'none';
        }
    });
}

// Form handling
function handleFormSubmission(e) {
    console.log('Form submission triggered');
    e.preventDefault();
    e.stopPropagation();

    // Clear previous errors
    clearErrors();

    const keyData = {
        name: document.getElementById('keyName').value.trim(),
        partner: document.getElementById('vendorSelect').value,
        userId: document.getElementById('userEmail').value.trim(),
        scope: document.getElementById('scopeSelect').value,
        permissions: Array.from(document.querySelectorAll('input[name="permissions"]:checked')).map(cb => cb.value),
        expires: document.getElementById('expires').value
    };

    let hasErrors = false;

    // Validate form
    console.log('Validating form...', keyData);
    if (!keyData.name) {
        console.log('Key name is empty');
        showError('keyNameError', 'keyName');
        hasErrors = true;
    }

    if (!keyData.partner) {
        showError('vendorError', 'vendorSelect');
        hasErrors = true;
    }

    if (!keyData.scope) {
        showError('scopeError', 'scopeSelect');
        hasErrors = true;
    }

    if (!keyData.userId) {
        showError('userEmailError', 'userEmail');
        hasErrors = true;
    } else if (!isValidEmail(keyData.userEmail)) {
        showError('userEmailError', 'userEmail');
        hasErrors = true;
    } else if (!isValidUser(keyData.userEmail)) {
        showError('userEmailNotFoundError', 'userEmail');
        hasErrors = true;
    }

    if (keyData.permissions.length === 0) {
        showError('permissionsError');
        hasErrors = true;
    }

    if (hasErrors) {
        console.log('Form has errors, not submitting');
        return false;
    }

    // Simulate API call
    createApiKey(keyData);
    return false;
}

function showError(errorId, fieldId = null) {
    console.log('Showing error for:', errorId, fieldId);
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.add('show');
        errorElement.style.display = 'block';
        errorElement.style.color = '#dc3545';
        errorElement.style.fontSize = '12px';
        errorElement.style.marginTop = '4px';
        console.log('Error element found and shown');
    } else {
        console.log('Error element not found:', errorId);
    }
    
    if (fieldId) {
        const fieldElement = document.getElementById(fieldId);
        if (fieldElement) {
            fieldElement.classList.add('error');
            fieldElement.style.borderColor = '#dc3545';
            console.log('Field error styling added');
        } else {
            console.log('Field element not found:', fieldId);
        }
    }
}

function clearErrors() {
    // Clear all error messages
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => {
        error.classList.remove('show');
        error.style.display = 'none';
    });
    
    // Clear error styling from fields
    const errorFields = document.querySelectorAll('.form-group input.error, .form-group select.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
        field.style.borderColor = '';
    });
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// User validation helper - checks if user exists
function isValidUser(email) {
    // Mock user database - in real app this would be an API call
    const validUsers = [
        'john.smith@example.com',
        'sarah.johnson@example.com',
        'mike.chen@example.com',
        'emily.davis@example.com',
        'alex.rodriguez@example.com',
        'test@example.com',
        'user@company.com'
    ];
    
    return validUsers.includes(email.toLowerCase());
}

// Toaster Functionality
function showToaster(message) {
    const toaster = document.getElementById('successToaster');
    const toasterMessage = document.getElementById('toasterMessage');
    
    toasterMessage.textContent = message;
    toaster.classList.add('show');
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
        toaster.classList.remove('show');
    }, 3000);
}

// Delete API Key Functionality
let currentDeleteKey = null;

function deleteApiKey(apiKey) {
    currentDeleteKey = apiKey;
    document.getElementById('deleteKeyModal').classList.add('show');
}

function closeDeleteKeyModal() {
    document.getElementById('deleteKeyModal').classList.remove('show');
    currentDeleteKey = null;
}

function confirmDeleteApiKey() {
    if (currentDeleteKey) {
        // Find and remove the row containing this API key
        const rows = document.querySelectorAll('.api-keys-table tbody tr');
        rows.forEach(row => {
            const apiKeyDisplay = row.querySelector('.api-key-display');
            if (apiKeyDisplay && apiKeyDisplay.getAttribute('onclick').includes(currentDeleteKey)) {
                row.remove();
            }
        });
        
        closeDeleteKeyModal();
        showToaster('API key deleted successfully');
    }
}

// Refresh API Key Functionality
let currentRefreshKey = null;

function refreshApiKey(apiKey) {
    currentRefreshKey = apiKey;
    document.getElementById('refreshKeyModal').classList.add('show');
}

function closeRefreshKeyModal() {
    document.getElementById('refreshKeyModal').classList.remove('show');
    currentRefreshKey = null;
}

function confirmRefreshApiKey() {
    if (currentRefreshKey) {
        // Generate a new API key
        const newApiKey = generateApiKey();
        
        // Find the row containing this API key and update it
        const rows = document.querySelectorAll('.api-keys-table tbody tr');
        rows.forEach(row => {
            const apiKeyDisplay = row.querySelector('.api-key-display');
            if (apiKeyDisplay && apiKeyDisplay.getAttribute('onclick').includes(currentRefreshKey)) {
                // Update the API key display
                apiKeyDisplay.setAttribute('onclick', `copyApiKey('${newApiKey}', this)`);
                const apiKeyText = apiKeyDisplay.querySelector('.api-key-text');
                apiKeyText.textContent = newApiKey.substring(0, 8) + '••••••••••••••••••••••••';
                
                // Reset copy state
                apiKeyDisplay.classList.remove('copied');
                const copyInstruction = apiKeyDisplay.querySelector('.copy-instruction');
                copyInstruction.innerHTML = 'Click to copy';
                
                // Update created date to current date
                const createdCell = row.querySelector('td:nth-child(7)'); // CREATED column
                if (createdCell) {
                    const today = new Date();
                    createdCell.textContent = today.toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                    });
                }
            }
        });
        
        closeRefreshKeyModal();
        showToaster('API key refreshed successfully');
    }
}

// Table Sorting Functionality
let currentSortColumn = null;
let currentSortDirection = 'asc';

function sortTable(column) {
    const table = document.querySelector('.api-keys-table tbody');
    const rows = Array.from(table.querySelectorAll('tr'));
    
    // Toggle sort direction if same column
    if (currentSortColumn === column) {
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        currentSortColumn = column;
        currentSortDirection = 'asc';
    }
    
    // Update sort icons
    updateSortIcons(column);
    
    // Sort rows
    rows.sort((a, b) => {
        let aValue, bValue;
        
        if (column === 'created') {
            aValue = a.querySelector('td:nth-child(7)').textContent; // CREATED column
            bValue = b.querySelector('td:nth-child(7)').textContent;
        } else if (column === 'expires') {
            aValue = a.querySelector('td:nth-child(6)').textContent; // EXPIRES column
            bValue = b.querySelector('td:nth-child(6)').textContent;
        }
        
        // Convert dates for comparison
        if (column === 'created' || column === 'expires') {
            aValue = parseDate(aValue);
            bValue = parseDate(bValue);
        }
        
        if (currentSortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });
    
    // Reorder rows in table
    rows.forEach(row => table.appendChild(row));
}

function updateSortIcons(column) {
    const sortIcons = document.querySelectorAll('.sort-icon');
    sortIcons.forEach(icon => {
        const columnName = icon.parentElement.textContent.toLowerCase().includes('created') ? 'created' : 'expires';
        if (columnName === column) {
            icon.textContent = currentSortDirection === 'asc' ? '↑' : '↓';
        } else {
            icon.textContent = '↑';
        }
    });
}

function parseDate(dateStr) {
    if (dateStr === 'Never') return new Date(9999, 11, 31); // Far future date
    if (dateStr.includes('days') || dateStr.includes('months') || dateStr.includes('years')) {
        return new Date(); // Current date for relative dates
    }
    
    // Parse "Aug 15, 2024" format
    const months = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    
    const parts = dateStr.split(' ');
    if (parts.length === 3) {
        const month = months[parts[0]];
        const day = parseInt(parts[1].replace(',', ''));
        const year = parseInt(parts[2]);
        return new Date(year, month, day);
    }
    
    return new Date(); // Fallback
}

// Function to check if a date is expired
function isExpired(dateStr) {
    if (dateStr === 'Never') return false;
    
    const date = parseDate(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for comparison
    
    return date < today;
}

// Function to update expired states
function updateExpiredStates() {
            const rows = document.querySelectorAll('.api-keys-table tbody tr');
        rows.forEach(row => {
            const expiresCell = row.querySelector('td:nth-child(6)'); // EXPIRES column
        if (expiresCell && !expiresCell.classList.contains('expired')) {
            const dateStr = expiresCell.textContent.trim();
            if (isExpired(dateStr)) {
                expiresCell.classList.add('expired');
            }
        }
    });
}

function createApiKey(keyData) {
    // Show loading state
    const submitBtn = document.querySelector('#createKeyForm button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating...';
    submitBtn.disabled = true;

    // Simulate API delay
    setTimeout(() => {
        // Generate mock API key
        const apiKey = generateApiKey();
        
        // Show success message
        showSuccessMessage(keyData, apiKey);
        
        // Reset form and close modal
        closeCreateKeyModal();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Refresh table (in real app, this would update the table)
        console.log('API Key created:', { ...keyData, key: apiKey });
        
    }, 1500);
}

function generateApiKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'bt_';
    for (let i = 0; i < 32; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function showSuccessMessage(keyData, apiKey) {
    const message = `
        API Key created successfully!
        
        Key: ${apiKey}
        Vendor: ${keyData.vendor}
        User Email: ${keyData.userEmail}
        Permissions: ${keyData.permissions.join(', ')}
        
        Please copy this key now as it won't be shown again.
    `;
    
    alert(message);
}

function resetForm() {
    const form = document.getElementById('createKeyForm');
    form.reset();
}

// Table actions
function viewKey(keyId) {
    console.log('Viewing key:', keyId);
    // In real app, this would open a modal with key details
    alert('View key details for: ' + keyId);
}

function revokeKey(keyId) {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
        console.log('Revoking key:', keyId);
        // In real app, this would make an API call to revoke the key
        alert('API key revoked: ' + keyId);
    }
}

// Search and filter functionality
function searchKeys() {
    const searchTerm = document.querySelector('.search-box input').value.toLowerCase();
    const rows = document.querySelectorAll('.api-keys-table tbody tr');
    
    rows.forEach(row => {
        const keyName = row.querySelector('.key-name').textContent.toLowerCase();
        const vendor = row.querySelector('td:nth-child(3)').textContent.toLowerCase();
        const userAccount = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
        
        if (keyName.includes(searchTerm) || vendor.includes(searchTerm) || userAccount.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function filterByVendor() {
    const filterValue = document.querySelector('.filter-dropdown select').value;
    const rows = document.querySelectorAll('.api-keys-table tbody tr');
    
    rows.forEach(row => {
        const vendor = row.querySelector('td:nth-child(2)').textContent;
        
        if (filterValue === 'All Vendors' || vendor === filterValue) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Add event listeners for search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-box input');
    
    searchInput.addEventListener('input', searchKeys);
    
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
