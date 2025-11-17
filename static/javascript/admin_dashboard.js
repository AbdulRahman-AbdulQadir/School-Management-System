// Mock data to simulate fetching from a server
let pendingRequests = [
    { id: 1, full_name: "John Doe", email: "john.d@example.com", phone: "+1 555 102 8899", requested_at: "2023-09-20T10:00:00Z" },
    { id: 2, full_name: "Jane Smith", email: "jane.s@example.com", phone: "+1 555 221 4433", requested_at: "2023-09-19T14:30:00Z" },
    { id: 3, full_name: "Michael Jones", email: "m.jones@example.com", phone: "+1 555 772 1122", requested_at: "2023-09-18T09:15:00Z" },
    { id: 4, full_name: "Emily Davis", email: "e.davis@example.com", phone: "+1 555 991 7711", requested_at: "2023-09-17T11:45:00Z" },
    { id: 5, full_name: "Chris Brown", email: "c.brown@example.com", phone: "+1 555 333 2244", requested_at: "2023-09-16T08:20:00Z" },
    { id: 6, full_name: "Sarah Miller", email: "s.m@example.com", phone: "+1 555 665 8899", requested_at: "2023-09-15T16:50:00Z" },
    { id: 7, full_name: "David Wilson", email: "d.wilson@example.com", phone: "+1 555 112 3399", requested_at: "2023-09-14T10:10:00Z" },
];

// Helper function to format the date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Function to render the table with the given data
function renderTable(data) {
    const tableBody = document.getElementById('registrationTableBody');
    const noRequestsMessage = document.getElementById('no-requests-message');
    tableBody.innerHTML = '';
    if (data.length === 0) {
    noRequestsMessage.classList.remove('hidden');
    } else {
    noRequestsMessage.classList.add('hidden');
    data.forEach(r => {
        const row = document.createElement('tr');
        row.classList.add('border-t');
        row.innerHTML = `
        <td class="py-3">
            <input type="checkbox" class="registration-checkbox rounded-md text-brand-600" data-id="${r.id}">
        </td>

        <td class="py-3 font-medium">${r.full_name}</td>

        <td class="py-3 text-gray-700 dark:text-gray-300">${r.email}</td>

        <td class="py-3 text-gray-700 dark:text-gray-300">${r.phone}</td>

        <td class="py-3 text-xs text-gray-500">${formatDate(r.requested_at)}</td>

        <td class="py-3 flex gap-2">
            <button class="px-3 py-1 rounded-lg bg-green-600 text-white text-xs approve-btn" data-id="${r.id}">
                Approve
            </button>
            <button class="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-800 text-xs reject-btn" data-id="${r.id}">
                Reject
            </button>
        </td>
    `;
        tableBody.appendChild(row);
    });
    }
}

// Initial table render
renderTable(pendingRequests);

// Live clock and date
function updateClock() {
    const now = new Date();
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('current-time').textContent = time;
    document.getElementById('current-date').textContent = date;
}
setInterval(updateClock, 1000);
updateClock();

// Search functionality
document.getElementById('searchInput').addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredRequests = pendingRequests.filter(r => 
    r.full_name.toLowerCase().includes(searchTerm) || 
    r.email.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredRequests);
});
document.getElementById('searchInput').addEventListener('keyup', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredRequests = pendingRequests.filter(r =>
        r.full_name.toLowerCase().includes(searchTerm) ||
        r.email.toLowerCase().includes(searchTerm) ||
        r.phone.toLowerCase().includes(searchTerm)
    );
    renderTable(filteredRequests);
});

// Toast notification function
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    toastMessage.textContent = message;
    toast.classList.remove('translate-y-full', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
    setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-full', 'opacity-0');
    }, 3000);
}

// Confirmation Modal logic
const confirmModal = document.getElementById('confirmModal');
const modalMessage = document.getElementById('modalMessage');
const confirmModalBtn = document.getElementById('confirmModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');
let currentAction = '';
let currentId = null;

document.getElementById('registrationTableBody').addEventListener('click', (e) => {
    if (e.target.classList.contains('approve-btn') || e.target.classList.contains('reject-btn')) {
    currentAction = e.target.classList.contains('approve-btn') ? 'approve' : 'reject';
    currentId = parseInt(e.target.dataset.id);
    modalMessage.textContent = `Are you sure you want to ${currentAction} this registration?`;
    confirmModalBtn.textContent = currentAction.charAt(0).toUpperCase() + currentAction.slice(1);
    confirmModalBtn.classList.remove('bg-brand-600', 'bg-red-600');
    confirmModalBtn.classList.add(currentAction === 'approve' ? 'bg-green-600' : 'bg-red-600');
    confirmModal.classList.remove('hidden');
    }
});

cancelModalBtn.addEventListener('click', () => {
    confirmModal.classList.add('hidden');
});

confirmModalBtn.addEventListener('click', () => {
    // Simulate action
    pendingRequests = pendingRequests.filter(r => r.id !== currentId);
    renderTable(pendingRequests);
    showToast(`Registration successfully ${currentAction}d.`);
    confirmModal.classList.add('hidden');
});
//  Auto-Time Script 
function updateDateTime() {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const date = now.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    document.getElementById('current-time').innerText = time;
    document.getElementById('current-date').innerText = date;
  }
updateDateTime();
setInterval(updateDateTime, 60000);
// Bulk actions logic
const bulkActionsBtn = document.getElementById('bulkActionsBtn');
const bulkActionsMenu = document.getElementById('bulkActionsMenu');
const selectAllCheckbox = document.getElementById('selectAllCheckbox');
const bulkApproveBtn = document.getElementById('bulkApprove');
const bulkRejectBtn = document.getElementById('bulkReject');

bulkActionsBtn.addEventListener('click', () => {
    bulkActionsMenu.classList.toggle('hidden');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!bulkActionsBtn.contains(e.target) && !bulkActionsMenu.contains(e.target)) {
        bulkActionsMenu.classList.add('hidden');
    }
});

selectAllCheckbox.addEventListener('change', (e) => {
    document.querySelectorAll('.registration-checkbox').forEach(checkbox => {
    checkbox.checked = e.target.checked;
    });
});

bulkApproveBtn.addEventListener('click', () => {
    const selectedIds = Array.from(document.querySelectorAll('.registration-checkbox:checked')).map(cb => parseInt(cb.dataset.id));
    if (selectedIds.length > 0) {
    pendingRequests = pendingRequests.filter(r => !selectedIds.includes(r.id));
    renderTable(pendingRequests);
    showToast(`${selectedIds.length} registration(s) approved.`);
    selectAllCheckbox.checked = false;
    }
    bulkActionsMenu.classList.add('hidden');
});

bulkRejectBtn.addEventListener('click', () => {
    const selectedIds = Array.from(document.querySelectorAll('.registration-checkbox:checked')).map(cb => parseInt(cb.dataset.id));
    if (selectedIds.length > 0) {
    pendingRequests = pendingRequests.filter(r => !selectedIds.includes(r.id));
    renderTable(pendingRequests);
    showToast(`${selectedIds.length} registration(s) rejected.`);
    selectAllCheckbox.checked = false;
    }
    bulkActionsMenu.classList.add('hidden');
});

// Advanced Chart.js implementation for Teachers & Students Attendance (Last 7 Days)
// Smooth, gradient-colored, responsive charts

function createGradient(ctx, color) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 120);
    gradient.addColorStop(0, color + '33');
    gradient.addColorStop(1, color + '00');
    return gradient;
}

function initAttendanceChart(canvasId, dataPoints, lineColor) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    const gradient = createGradient(ctx, lineColor);

    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Attendance %',
                data: dataPoints,
                borderColor: lineColor,
                backgroundColor: gradient,
                fill: true,
                tension: 0.45,
                borderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: lineColor,
                pointBorderColor: '#fff',
                pointBorderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'nearest',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return context.raw + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: '#aaa' },
                    grid: { display: false }
                },
                y: {
                    min: 70,
                    max: 100,
                    ticks: { color: '#aaa' },
                    grid: { color: 'rgba(200,200,200,0.15)' }
                }
            }
        }
    });
}

// Example values for real-time chart data
const studentsData = [87, 85, 90, 92, 89, 91, 88];
const teachersData = [93, 91, 92, 96, 94, 95, 92];

// Initialize both charts
initAttendanceChart('studentsAttendanceChart', studentsData, '#0284c7');  // Blue theme
initAttendanceChart('teachersAttendanceChart', teachersData, '#6d28d9');  // Purple theme
