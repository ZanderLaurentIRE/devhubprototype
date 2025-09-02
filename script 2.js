// Global variables
let currentApiKeyToDelete = null;
let currentApiKeyToRefresh = null;
let copiedKeys = new Set();

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    setupFormValidation();
});

// Initialize event listeners
function initializeEventListeners() {
    // Search functionality
    const searchInput = document.querySelector('.search-box input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Filter functionality
    const filterSelect = document.querySelector('.filter-dropdown select');
    if (filterSelect) {
        filterSelect.addEventListener('change', handleFilter);
    }

    // Form submission
    const createKeyForm = document.getElementById('createKeyForm');
    if (createKeyForm) {
        createKeyForm.addEventListener('submit', handleCreateKey);
    }

    // Modal close on outside click
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeAllModals();
        }
    });

    // Escape key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const tableRows = document.querySelectorAll('.api-keys-table tbody tr');
    
    tableRows.forEach(row => {
        const keyName = row.querySelector('.key-suffix')?.textContent.toLowerCase() || '';
        const vendor = row.querySelector('td:nth-child(3)')?.textContent.toLowerCase() || '';
        const userName = row.querySelector('.user-name')?.textContent.toLowerCase() || '';
        
        const matches = keyName.includes(searchTerm) || 
                       vendor.includes(searchTerm) || 
                       userName.includes(searchTerm);
        
        row.style.display = matches ? '' : 'none';
    });
}

// Filter functionality
function handleFilter(e) {
    const selectedVendor = e.target.value.toLowerCase();
    const tableRows = document.querySelectorAll('.api-keys-table tbody tr');
    
    tableRows.forEach(row => {
        const vendor = row.querySelector('td:nth-child(3)')?.textContent.toLowerCase() || '';
        const matches = selectedVendor === '' || vendor === selectedVendor;
        row.style.display = matches ? '' : 'none';
    });
}

// Table sorting
function sortTable(column) {
    const table = document.querySelector('.api-keys-table');
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    // Get current sort direction
    const header = table.querySelector(`th:nth-child(${getColumnIndex(column)})`);
    const sortIcon = header.querySelector('.sort-icon');
    const currentDirection = sortIcon.textContent === '↑' ? 'asc' : 'desc';
    
    // Sort rows
    rows.sort((a, b) => {
        const aValue = getCellValue(a, column);
        const bValue = getCellValue(b, column);
        
        if (column === 'expires' || column === 'created') {
            return sortDates(aValue, bValue, currentDirection);
        } else {
            return sortStrings(aValue, bValue, currentDirection);
        }
    });
    
    // Update table
    rows.forEach(row => tbody.appendChild(row));
    
    // Update sort icon
    sortIcon.textContent = currentDirection === 'asc' ? '↓' : '↑';
}

function getColumnIndex(column) {
    const columnMap = {
        'expires': 6,
        'created': 7
    };
    return columnMap[column] || 1;
}

function getCellValue(row, column) {
    const columnIndex = getColumnIndex(column);
    const cell = row.querySelector(`td:nth-child(${columnIndex})`);
    return cell ? cell.textContent.trim() : '';
}

function sortDates(a, b, direction) {
    const aDate = new Date(a === 'Never' ? '9999-12-31' : a);
    const bDate = new Date(b === 'Never' ? '9999-12-31' : b);
    
    if (direction === 'asc') {
        return aDate - bDate;
    } else {
        return bDate - aDate;
    }
}

function sortStrings(a, b, direction) {
    if (direction === 'asc') {
        return a.localeCompare(b);
    } else {
        return b.localeCompare(a);
    }
}

// API Key copying functionality
function copyApiKey(apiKey, element) {
    if (copiedKeys.has(apiKey)) {
        showNotification('API key already copied. For security, keys can only be copied once.', 'warning');
        return;
    }
    
    navigator.clipboard.writeText(apiKey).then(() => {
        copiedKeys.add(apiKey);
        
        // Update the display
        const keyText = element.querySelector('.api-key-text');
        const instruction = element.querySelector('.copy-instruction');
        
        keyText.textContent = 'bt_live_••••••••••••••••';
        instruction.textContent = '(Copied!)';
        instruction.style.color = '#10b981';
        
        showNotification('API key copied to clipboard!', 'success');
        
        // Reset after 3 seconds
        setTimeout(() => {
            instruction.textContent = '(Click to copy - one time only)';
            instruction.style.color = '#6b7280';
        }, 3000);
    }).catch(() => {
        showNotification('Failed to copy API key. Please try again.', 'error');
    });
}

// Modal functions
function openCreateKeyModal() {
    const modal = document.getElementById('createKeyModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Reset form
    document.getElementById('createKeyForm').reset();
    clearFormErrors();
}

function closeCreateKeyModal() {
    const modal = document.getElementById('createKeyModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    clearFormErrors();
}

function openDeleteKeyModal(apiKey) {
    currentApiKeyToDelete = apiKey;
    const modal = document.getElementById('deleteKeyModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeDeleteKeyModal() {
    const modal = document.getElementById('deleteKeyModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    currentApiKeyToDelete = null;
}

function openRefreshKeyModal(apiKey) {
    currentApiKeyToRefresh = apiKey;
    const modal = document.getElementById('refreshKeyModal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeRefreshKeyModal() {
    const modal = document.getElementById('refreshKeyModal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
    currentApiKeyToRefresh = null;
}

function closeAllModals() {
    closeCreateKeyModal();
    closeDeleteKeyModal();
    closeRefreshKeyModal();
}

// Delete API Key functions
function deleteApiKey(apiKey) {
    openDeleteKeyModal(apiKey);
}

function confirmDeleteApiKey() {
    if (!currentApiKeyToDelete) return;
    
    // Simulate API call
    showNotification('Deleting API key...', 'info');
    
    setTimeout(() => {
        // Remove from table
        const row = document.querySelector(`[onclick*="${currentApiKeyToDelete}"]`).closest('tr');
        if (row) {
            row.remove();
        }
        
        closeDeleteKeyModal();
        showNotification('API key deleted successfully!', 'success');
    }, 1000);
}

// Refresh API Key functions
function refreshApiKey(apiKey) {
    openRefreshKeyModal(apiKey);
}

function confirmRefreshApiKey() {
    if (!currentApiKeyToRefresh) return;
    
    // Simulate API call
    showNotification('Refreshing API key...', 'info');
    
    setTimeout(() => {
        // Generate new key
        const newKey = 'bt_live_' + Math.random().toString(36).substr(2, 15);
        
        // Update the display
        const row = document.querySelector(`[onclick*="${currentApiKeyToRefresh}"]`).closest('tr');
        if (row) {
            const keyDisplay = row.querySelector('.api-key-display');
            keyDisplay.setAttribute('onclick', `copyApiKey('${newKey}', this)`);
            
            // Reset copy state
            copiedKeys.delete(currentApiKeyToRefresh);
            copiedKeys.add(newKey);
            
            const keyText = keyDisplay.querySelector('.api-key-text');
            const instruction = keyDisplay.querySelector('.copy-instruction');
            
            keyText.textContent = 'bt_live_••••••••••••••••';
            instruction.textContent = '(Copied!)';
            instruction.style.color = '#10b981';
            
            setTimeout(() => {
                instruction.textContent = '(Click to copy - one time only)';
                instruction.style.color = '#6b7280';
            }, 3000);
        }
        
        closeRefreshKeyModal();
        showNotification('API key refreshed successfully!', 'success');
    }, 1000);
}

// Form validation and submission
function setupFormValidation() {
    const form = document.getElementById('createKeyForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Permission checkboxes
    const permissionCheckboxes = form.querySelectorAll('input[name="permissions"]');
    permissionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', validatePermissions);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    
    switch (field.id) {
        case 'keyName':
            if (!value) {
                showFieldError('keyNameError', 'Key name is required');
                isValid = false;
            } else if (value.length < 3) {
                showFieldError('keyNameError', 'Key name must be at least 3 characters');
                isValid = false;
            }
            break;
            
        case 'vendorSelect':
            if (!value) {
                showFieldError('vendorError', 'Vendor is required');
                isValid = false;
            }
            break;
            
        case 'userEmail':
            if (!value) {
                showFieldError('userEmailError', 'User email is required');
                isValid = false;
            } else if (!isValidEmail(value)) {
                showFieldError('userEmailError', 'Please enter a valid email address');
                isValid = false;
            } else {
                // Simulate user lookup
                simulateUserLookup(value);
            }
            break;
    }
    
    return isValid;
}

function validatePermissions() {
    const checkboxes = document.querySelectorAll('input[name="permissions"]:checked');
    const errorElement = document.getElementById('permissionsError');
    
    if (checkboxes.length === 0) {
        showFieldError('permissionsError', 'At least one permission is required');
        return false;
    } else {
        hideFieldError('permissionsError');
        return true;
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function simulateUserLookup(email) {
    // Simulate API call to check if user exists
    setTimeout(() => {
        const errorElement = document.getElementById('userEmailNotFoundError');
        if (email.includes('nonexistent')) {
            showFieldError('userEmailNotFoundError', 'No matching user found');
        } else {
            hideFieldError('userEmailNotFoundError');
        }
    }, 500);
}

function showFieldError(errorId, message) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function hideFieldError(errorId) {
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

function clearFieldError(e) {
    const field = e.target;
    const errorId = field.id + 'Error';
    hideFieldError(errorId);
}

function clearFormErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.classList.remove('show');
    });
}

// Permission selection helpers
function selectAllPermissions() {
    const checkboxes = document.querySelectorAll('input[name="permissions"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = true;
    });
    validatePermissions();
}

function selectNoPermissions() {
    const checkboxes = document.querySelectorAll('input[name="permissions"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    validatePermissions();
}

// Form submission
function handleCreateKey(e) {
    e.preventDefault();
    
    // Validate all fields
    const keyName = document.getElementById('keyName').value.trim();
    const vendor = document.getElementById('vendorSelect').value;
    const userEmail = document.getElementById('userEmail').value.trim();
    const permissions = Array.from(document.querySelectorAll('input[name="permissions"]:checked')).map(cb => cb.value);
    const expires = document.getElementById('expires').value;
    
    // Validate required fields
    let isValid = true;
    
    if (!keyName) {
        showFieldError('keyNameError', 'Key name is required');
        isValid = false;
    }
    
    if (!vendor) {
        showFieldError('vendorError', 'Vendor is required');
        isValid = false;
    }
    
    if (!userEmail) {
        showFieldError('userEmailError', 'User email is required');
        isValid = false;
    }
    
    if (permissions.length === 0) {
        showFieldError('permissionsError', 'At least one permission is required');
        isValid = false;
    }
    
    if (!isValid) {
        return;
    }
    
    // Simulate API call
    showNotification('Creating API key...', 'info');
    
    setTimeout(() => {
        // Generate new API key
        const newApiKey = 'bt_live_' + Math.random().toString(36).substr(2, 15);
        
        // Add to table (simplified - in real app would add proper row)
        addNewApiKeyToTable(newApiKey, keyName, vendor, userEmail, permissions, expires);
        
        closeCreateKeyModal();
        showNotification('API key created successfully!', 'success');
    }, 1500);
}

function addNewApiKeyToTable(apiKey, keyName, vendor, userEmail, permissions, expires) {
    const tbody = document.querySelector('.api-keys-table tbody');
    const newRow = document.createElement('tr');
    
    const expiresText = expires === 'never' ? 'Never' : 
                       expires === '30d' ? '1 month' :
                       expires === '90d' ? '90 days' :
                       expires === '1y' ? '1 year' : 'Custom';
    
    const permissionsHtml = permissions.map(perm => 
        `<span class="permission-tag">${perm}</span>`
    ).join('');
    
    newRow.innerHTML = `
        <td>
            <div class="api-key-display" onclick="copyApiKey('${apiKey}', this)">
                <div class="api-key-text">bt_live_••••••••••••••••</div>
                <div class="copy-instruction">(Click to copy - one time only)</div>
            </div>
        </td>
        <td>
            <div class="key-name">
                <span class="key-prefix">bt_</span>
                <span class="key-suffix">${keyName}</span>
            </div>
        </td>
        <td>${vendor.charAt(0).toUpperCase() + vendor.slice(1)}</td>
        <td>
            <div class="user-account">
                <div class="user-name">${userEmail.split('@')[0]}</div>
                <div class="account-id">Account: ${userEmail.split('@')[0]}-account</div>
            </div>
        </td>
        <td>
            <div class="permissions">
                ${permissionsHtml}
            </div>
        </td>
        <td>${expiresText}</td>
        <td>${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
        <td>Zander Laurent</td>
        <td>Just now</td>
        <td>
            <div class="actions">
                <button class="btn-secondary btn-sm" onclick="refreshApiKey('${apiKey}')">Refresh</button>
                <button class="btn-danger btn-sm" onclick="deleteApiKey('${apiKey}')">Delete</button>
            </div>
        </td>
    `;
    
    tbody.insertBefore(newRow, tbody.firstChild);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}
