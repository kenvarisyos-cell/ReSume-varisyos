/**
 * Dashboard JavaScript functions
 */

/**
 * Fetch recent security events from the server
 */
function fetchRecentEvents() {
    fetch('/api/recent-events')
        .then(response => response.json())
        .then(data => {
            updateEventsTable(data.events);
        })
        .catch(error => {
            console.error('Error fetching recent events:', error);
        });
}

/**
 * Update the events table with new data
 */
function updateEventsTable(events) {
    const tableBody = document.querySelector('#recentEventsTable tbody');
    if (!tableBody) return;
    
    if (events && events.length > 0) {
        let html = '';
        events.forEach(event => {
            html += `
                <tr>
                    <td>${event.event_type}</td>
                    <td>${event.source_ip}</td>
                    <td>
                        <span class="badge ${getSeverityClass(event.severity)}">
                            ${event.severity}
                        </span>
                    </td>
                    <td>${event.timestamp}</td>
                    <td>
                        ${event.is_blocked ? 
                          '<span class="badge bg-secondary">Blocked</span>' : 
                          `<button class="btn btn-sm btn-danger block-ip-btn" data-ip="${event.source_ip}">Block</button>`
                        }
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = html;
        
        // Reattach event listeners
        document.querySelectorAll('.block-ip-btn').forEach(button => {
            button.addEventListener('click', function() {
                const ip = this.getAttribute('data-ip');
                blockIP(ip);
            });
        });
    } else {
        tableBody.innerHTML = '<tr><td colspan="5" class="text-center">No recent events</td></tr>';
    }
}

/**
 * Get appropriate badge class based on severity
 */
function getSeverityClass(severity) {
    switch (severity) {
        case 'Critical':
            return 'bg-danger';
        case 'High':
            return 'bg-warning';
        case 'Medium':
            return 'bg-info';
        default:
            return 'bg-secondary';
    }
}

/**
 * Block an IP address
 */
function blockIP(ip) {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการบล็อก IP ${ip}?`)) {
        fetch('/api/block-ip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ip: ip,
                reason: 'Manually blocked from dashboard',
                blocked_by: 'admin'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('บล็อก IP สำเร็จ');
                location.reload();
            } else {
                alert('ข้อผิดพลาด: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดขณะบล็อก IP');
        });
    }
}

/**
 * Unblock an IP address
 */
function unblockIP(ip) {
    if (confirm(`คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการบล็อก IP ${ip}?`)) {
        fetch(`/api/unblock-ip/${ip}`, {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('ยกเลิกการบล็อก IP สำเร็จ');
                location.reload();
            } else {
                alert('ข้อผิดพลาด: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดขณะยกเลิกการบล็อก IP');
        });
    }
}