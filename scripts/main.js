console.log('connected');

// Filter button functionality
const btnAll = document.getElementById('btnAll');
const btnOpen = document.getElementById('btnOpen');
const btnClosed = document.getElementById('btnClosed');

const filterButtons = [btnAll, btnOpen, btnClosed];
let allIssues = [];

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
    setActiveButton(btnAll);
    renderIssues(allIssues);
});

btnOpen.addEventListener('click', () => {
    setActiveButton(btnOpen);
    const openIssues = allIssues.filter(issue => issue.status === 'open');
    renderIssues(openIssues);
});

btnClosed.addEventListener('click', () => {
    setActiveButton(btnClosed);
    const closedIssues = allIssues.filter(issue => issue.status === 'closed');
    renderIssues(closedIssues);
});

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
    
    return `
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <!-- Top colored border -->
            <div class="h-1" style="background-color: ${priorityColors.border};"></div>
            
            <!-- Card content -->
            <div class="p-4">
                <!-- Header with icon and priority -->
                <div class="flex items-start justify-between mb-3">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center" style="background-color: ${priorityColors.bg};">
                        <i class="fa-solid fa-gear" style="color: ${priorityColors.border};"></i>
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
                    ${issue.tags?.map(tag => {
                        const tagColor = getTagColor(tag);
                        return `<span class="px-2 py-1 text-xs font-medium rounded border" style="background-color: ${tagColor.bg}; color: ${tagColor.text}; border-color: ${tagColor.border};">
                            <i class="fa-solid ${tag.toLowerCase() === 'bug' ? 'fa-bug' : tag.toLowerCase() === 'enhancement' ? 'fa-sparkles' : 'fa-hand'}"></i>
                            ${tag.toUpperCase()}
                        </span>`;
                    }).join('') || ''}
                </div>
                
                <!-- Footer -->
                <div class="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
                    <span>#${issue.id} by ${issue.createdBy || 'Unknown'}</span>
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

// Fetch issues from API
async function fetchIssues() {
    try {
        const response = await fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues');
        const data = await response.json();
        allIssues = data.data || data;
        renderIssues(allIssues);
        console.log('Issues loaded:', allIssues.length);
    } catch (error) {
        console.error('Error fetching issues:', error);
        document.getElementById('issuesGrid').innerHTML = '<p class="col-span-full text-center text-red-500 py-8">Error loading issues</p>';
    }
}

// Load issues on page load
fetchIssues();