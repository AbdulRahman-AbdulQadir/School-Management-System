// Mock data to simulate fetching from a server
let pendingRequests = [
    { id: 1, full_name: "John Doe", email: "john.d@example.com", requested_at: "2023-09-20T10:00:00Z" },
    { id: 2, full_name: "Jane Smith", email: "jane.s@example.com", requested_at: "2023-09-19T14:30:00Z" },
    { id: 3, full_name: "Michael Jones", email: "m.jones@example.com", requested_at: "2023-09-18T09:15:00Z" },
    { id: 4, full_name: "Emily Davis", email: "e.davis@example.com", requested_at: "2023-09-17T11:45:00Z" },
    { id: 5, full_name: "Chris Brown", email: "c.brown@example.com", requested_at: "2023-09-16T08:20:00Z" },
    { id: 6, full_name: "Sarah Miller", email: "s.m@example.com", requested_at: "2023-09-15T16:50:00Z" },
    { id: 7, full_name: "David Wilson", email: "d.wilson@example.com", requested_at: "2023-09-14T10:10:00Z" },
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
        <td class="py-3" data-label="Select"><input type="checkbox" class="registration-checkbox rounded-md text-brand-600" data-id="${r.id}"></td>
        <td class="py-3" data-label="Name">${r.full_name}</td>
        <td class="py-3" data-label="Email">${r.email}</td>
        <td class="py-3 text-xs text-gray-500" data-label="Requested">${formatDate(r.requested_at)}</td>
        <td class="py-3" data-label="Action">
            <button class="px-3 py-1 rounded-lg bg-green-600 text-white text-xs approve-btn" data-id="${r.id}">Approve</button>
            <button class="px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-800 text-xs reject-btn" data-id="${r.id}">Reject</button>
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

// Chart.js implementation for attendance sparkline
const ctx = document.getElementById('attendanceChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
        label: 'Attendance %',
        data: [90, 92, 88, 95, 91, 93, 94],
        borderColor: '#6d28d9',
        backgroundColor: '#6d28d9',
        tension: 0.4,
        fill: false,
        pointRadius: 0
    }]
    },
    options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
        mode: 'index',
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
        display: false,
        grid: { display: false }
        },
        y: {
        display: false,
        grid: { display: false },
        min: 80,
        max: 100
        }
    }
    }
});