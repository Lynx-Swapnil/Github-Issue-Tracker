console.log('connected');

// Filter button functionality
const btnAll = document.getElementById('btnAll');
const btnOpen = document.getElementById('btnOpen');
const btnClosed = document.getElementById('btnClosed');
const searchInput = document.getElementById('searchIssues');

const filterButtons = [btnAll, btnOpen, btnClosed];
let allIssues = [];
let currentFilter = 'all';

// Loading spinner functions
function showLoading() {
    document.getElementById('loadingSpinner').classList.remove('hidden');
    document.getElementById('issuesGrid').classList.add('hidden');
}

function hideLoading() {
    document.getElementById('loadingSpinner').classList.add('hidden');
    document.getElementById('issuesGrid').classList.remove('hidden');
}

// Function to set active button
function setActiveButton(activeBtn) {
    filterButtons.forEach(btn => {
        if (btn === activeBtn) {
            // Active state
            btn.style.backgroundColor = '#7c3aed';
            btn.style.color = 'white';
            btn.style.border = 'none';
        } else {
            // Inactive state
            btn.style.backgroundColor = '';
            btn.style.color = '#4b5563';
            btn.style.border = '1px solid #d1d5db';
        }
    });
}

// Add click event listeners
btnAll.addEventListener('click', () => {
    currentFilter = 'all';
    setActiveButton(btnAll);
    renderIssues(allIssues);
});

btnOpen.addEventListener('click', () => {
    currentFilter = 'open';
    setActiveButton(btnOpen);
    const openIssues = allIssues.filter(issue => issue.status === 'open');
    renderIssues(openIssues);
});

btnClosed.addEventListener('click', () => {
    currentFilter = 'closed';
    setActiveButton(btnClosed);
    const closedIssues = allIssues.filter(issue => issue.status === 'closed');
    renderIssues(closedIssues);
});

// Search functionality
let searchTimeout;
searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length === 0) {
        // If search is empty, show filtered results based on current filter
        if (currentFilter === 'all') renderIssues(allIssues);
        else if (currentFilter === 'open') renderIssues(allIssues.filter(i => i.status === 'open'));
        else if (currentFilter === 'closed') renderIssues(allIssues.filter(i => i.status === 'closed'));
        return;
    }
    
    searchTimeout = setTimeout(async () => {
        await searchIssues(query);
    }, 500);
});

// Search issues from API
async function searchIssues(query) {
    try {
        showLoading();
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        const searchResults = data.data || data;
        
        // Apply current filter to search results
        let filteredResults = searchResults;
        if (currentFilter === 'open') {
            filteredResults = searchResults.filter(issue => issue.status === 'open');
        } else if (currentFilter === 'closed') {
            filteredResults = searchResults.filter(issue => issue.status === 'closed');
        }
        
        renderIssues(filteredResults);
        hideLoading();
    } catch (error) {
        console.error('Error searching issues:', error);
        hideLoading();
        document.getElementById('issuesGrid').innerHTML = '<p class="col-span-full text-center text-red-500 py-8">Error searching issues</p>';
    }
}

// Get priority color
function getPriorityColor(priority) {
    const colors = {
        'high': { border: '#10b981', bg: '#f0fdf4', text: '#dc2626' },
        'medium': { border: '#f59e0b', bg: '#fffbeb', text: '#f59e0b' },
        'low': { border: '#a855f7', bg: '#faf5ff', text: '#9ca3af' }
    };
    return colors[priority?.toLowerCase()] || colors['low'];
}

// Get tag color
function getTagColor(tag) {
    const colors = {
        'bug': { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
        'enhancement': { bg: '#f0fdf4', text: '#10b981', border: '#bbf7d0' },
        'help wanted': { bg: '#fffbeb', text: '#f59e0b', border: '#fde68a' }
    };
    return colors[tag?.toLowerCase()] || { bg: '#f3f4f6', text: '#6b7280', border: '#e5e7eb' };
}

// Create issue card
function createIssueCard(issue) {
    const priorityColors = getPriorityColor(issue.priority);
    const isOpen = issue.status === 'open';
    const isClosed = issue.status === 'closed';
    
    // Determine border color and icon
    let borderColor, iconBgColor, iconHtml;
    
    if (isOpen) {
        borderColor = '#10b981'; // Green
        iconBgColor = '#f0fdf4'; // Light green
        iconHtml = `<img src="assets/Open-Status.png" alt="Open" class="w-5 h-5" />`;
    } else if (isClosed) {
        borderColor = '#a855f7'; // Purple
        iconBgColor = '#faf5ff'; // Light purple
        iconHtml = `<img src="assets/Closed-Status.png" alt="Closed" class="w-5 h-5" />`;
    } else {
        borderColor = priorityColors.border;
        iconBgColor = priorityColors.bg;
        iconHtml = `<i class="fa-solid fa-gear" style="color: ${priorityColors.border};"></i>`;
    }
    
    return `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onclick="openIssueModal(${issue.id})">
            <!-- Top colored border -->
            <div class="h-1" style="background-color: ${borderColor};"></div>
            
            <!-- Card content -->
            <div class="p-4">
                <!-- Header with icon and priority -->
                <div class="flex items-start justify-between mb-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: ${iconBgColor};">
                        ${iconHtml}
                    </div>
                    <span class="px-2 py-1 text-xs font-semibold rounded" style="background-color: ${priorityColors.bg}; color: ${priorityColors.text};">
                        ${issue.priority?.toUpperCase() || 'LOW'}
                    </span>
                </div>
                
                <!-- Title -->
                <h3 class="font-semibold text-gray-800 mb-2 line-clamp-2">${issue.title}</h3>
                
                <!-- Description -->
                <p class="text-sm text-gray-500 mb-3 line-clamp-2">${issue.description}</p>
                
                <!-- Tags -->
                <div class="flex flex-wrap gap-2 mb-3">
                    ${issue.labels?.map(tag => {
                        const tagColor = getTagColor(tag);
                        return `<span class="px-2 py-1 text-xs font-medium rounded border" style="background-color: ${tagColor.bg}; color: ${tagColor.text}; border-color: ${tagColor.border};">
                            <i class="fa-solid ${tag.toLowerCase() === 'bug' ? 'fa-bug' : tag.toLowerCase() === 'enhancement' ? 'fa-lightbulb' : 'fa-hand'}"></i>
                            ${tag.toUpperCase()}
                        </span>`;
                    }).join('') || ''}
                    ${issue.level ? `<span class="px-2 py-1 text-xs font-medium rounded-full border" style="background-color: #ede9fe; color: #7c3aed; border-color: #c4b5fd;">
                        <i class="fa-solid fa-layer-group"></i>
                        ${issue.level.toUpperCase()}
                    </span>` : ''}
                </div>
                
                <!-- Footer -->
                <div class="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <span>#${issue.id} by ${issue.author || 'Unknown'}</span>
                    <span>${new Date(issue.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    `;
}

// Update issue count
function updateIssueCount(count) {
    const issueCount = document.getElementById('issueCount');
    issueCount.textContent = `${count} ${count === 1 ? 'Issue' : 'Issues'}`;
}

// Render issues
function renderIssues(issues) {
    const issuesGrid = document.getElementById('issuesGrid');
    updateIssueCount(issues.length);
    
    if (issues.length === 0) {
        issuesGrid.innerHTML = '<p class="col-span-full text-center text-gray-500 py-8">No issues found</p>';
        return;
    }
    issuesGrid.innerHTML = issues.map(issue => createIssueCard(issue)).join('');
}

// Modal functions
function openIssueModal(issueId) {
    fetchIssueDetails(issueId);
    document.getElementById('issueModal').showModal();
}

function closeModal() {
    document.getElementById('issueModal').close();
}

// Fetch single issue details
async function fetchIssueDetails(issueId) {
    try {
        const modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = '<div class="flex justify-center py-8"><div class="animate-spin rounded-full h-12 w-12 border-b-2" style="border-color: #7c3aed;"></div></div>';
        
        const response = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`);
        const data = await response.json();
        const issue = data.data || data;
        
        const priorityColors = getPriorityColor(issue.priority);
        const statusBadge = issue.status === 'open' 
            ? '<span class="px-3 py-1 text-xs font-semibold rounded" style="background-color: #10b981; color: white;">OPEN</span>'
            : '<span class="px-3 py-1 text-xs font-semibold rounded" style="background-color: #a855f7; color: white;">CLOSED</span>';
        
        const formattedDate = new Date(issue.createdAt).toLocaleDateString('en-GB').replace(/\//g, '/');
        
        modalContent.innerHTML = `
            <div class="space-y-5">
                <!-- Title -->
                <h3 class="text-2xl font-bold text-gray-800">${issue.title}</h3>
                
                <!-- Status and Author Info -->
                <div class="flex items-center gap-2 text-sm text-gray-600">
                    ${statusBadge}
                    <span>• Opened by ${issue.author || 'Unknown'} • ${formattedDate}</span>
                </div>
                
                <!-- Labels -->
                ${issue.labels && issue.labels.length > 0 ? `
                <div class="flex flex-wrap gap-2">
                    ${issue.labels.map(label => {
                        const tagColor = getTagColor(label);
                        return `<span class="px-3 py-1.5 text-xs font-semibold rounded" style="background-color: ${tagColor.bg}; color: ${tagColor.text}; border: 1px solid ${tagColor.border};">
                            <i class="fa-solid ${label.toLowerCase() === 'bug' ? 'fa-bug' : label.toLowerCase() === 'enhancement' ? 'fa-lightbulb' : 'fa-hand'}"></i>
                            ${label.toUpperCase()}
                        </span>`;
                    }).join('')}
                </div>
                ` : ''}
                
                <!-- Description -->
                <p class="text-gray-700 leading-relaxed">${issue.description}</p>
                
                <!-- Assignee and Priority -->
                <div class="grid grid-cols-2 gap-6 pt-2">
                    <div>
                        <h4 class="text-sm font-semibold text-gray-600 mb-1">Assignee:</h4>
                        <p class="text-gray-800 font-medium">${issue.assignee || 'Unassigned'}</p>
                    </div>
                    <div>
                        <h4 class="text-sm font-semibold text-gray-600 mb-1">Priority:</h4>
                        <span class="inline-block px-3 py-1 text-sm font-semibold rounded" style="background-color: ${priorityColors.bg}; color: ${priorityColors.text};">
                            ${issue.priority?.charAt(0).toUpperCase() + issue.priority?.slice(1) || 'Low'}
                        </span>
                    </div>
                </div>
                
                <!-- Close Button -->
                <div class="modal-action">
                    <form method="dialog">
                        <button class="px-6 py-2 text-white font-medium rounded-lg hover:opacity-90 transition-opacity" style="background-color: #7c3aed;">
                            Close
                        </button>
                    </form>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error fetching issue details:', error);
        document.getElementById('modalContent').innerHTML = '<p class="text-center text-red-500 py-8">Error loading issue details</p>';
    }
}

// Fetch issues from API
async function fetchIssues() {
    try {
        showLoading();
        const response = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await response.json();
        allIssues = data.data || data;
        renderIssues(allIssues);
        hideLoading();
        console.log('Issues loaded:', allIssues.length);
    } catch (error) {
        console.error('Error fetching issues:', error);
        hideLoading();
        document.getElementById('issuesGrid').innerHTML = '<p class="col-span-full text-center text-red-500 py-8">Error loading issues</p>';
    }
}

// Load issues on page load
fetchIssues();