document.addEventListener('DOMContentLoaded', function() {
    // Toggle sidebar on mobile
    const toggleSidebarBtn = document.querySelector('.toggle-sidebar');
    const sidebar = document.querySelector('.sidebar');
    
    if (toggleSidebarBtn && sidebar) {
        toggleSidebarBtn.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (sidebar && sidebar.classList.contains('active')) {
            if (!sidebar.contains(e.target) && e.target !== toggleSidebarBtn) {
                sidebar.classList.remove('active');
            }
        }
    });
    
    // User dropdown toggle
    const userDropdownToggle = document.querySelector('.user-dropdown-toggle');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userDropdownToggle && userDropdown) {
        userDropdownToggle.addEventListener('click', function(e) {
            e.preventDefault();
            userDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
            }
        });
    }
    
    // Task checkboxes
    const taskCheckboxes = document.querySelectorAll('.task-checkbox input');
    
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskItem = this.closest('.task-item');
            
            if (this.checked) {
                taskItem.style.opacity = '0.6';
                taskItem.style.textDecoration = 'line-through';
                
                // Simulate task completion
                setTimeout(() => {
                    taskItem.style.height = taskItem.offsetHeight + 'px';
                    taskItem.style.padding = '15px';
                    taskItem.style.marginBottom = '15px';
                    
                    setTimeout(() => {
                        taskItem.style.height = '0';
                        taskItem.style.padding = '0 15px';
                        taskItem.style.marginBottom = '0';
                        taskItem.style.overflow = 'hidden';
                        
                        setTimeout(() => {
                            taskItem.remove();
                            updateTaskCount();
                        }, 300);
                    }, 1000);
                }, 500);
            }
        });
    });
    
    // Update task count in dashboard card
    function updateTaskCount() {
        const taskCountElement = document.querySelector('.dashboard-card:nth-child(4) .card-value');
        const remainingTasks = document.querySelectorAll('.task-item').length;
        
        if (taskCountElement) {
            taskCountElement.textContent = remainingTasks;
            
            // Update the due today count
            const dueTodayElement = document.querySelector('.dashboard-card:nth-child(4) .card-change span');
            const dueTodayTasks = document.querySelectorAll('.task-item .task-date:contains("Today")').length;
            
            if (dueTodayElement) {
                dueTodayElement.textContent = dueTodayTasks + ' due today';
            }
        }
    }
    
    // Notification button
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show notifications dropdown (would be implemented in a real app)
            showNotification('You have 3 new notifications', 'info');
        });
    }
    
    // Export report button
    const exportReportBtn = document.querySelector('.dashboard-actions .btn-secondary');
    
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', function() {
            showNotification('Generating report...', 'info');
            
            // Simulate report generation
            setTimeout(() => {
                showNotification('Report generated successfully!', 'success');
            }, 1500);
        });
    }
    
    // Add activity button
    const addActivityBtn = document.querySelector('.dashboard-actions .btn-primary');
    
    if (addActivityBtn) {
        addActivityBtn.addEventListener('click', function() {
            // Show add activity modal (would be implemented in a real app)
            showAddActivityModal();
        });
    }
    
    // Simulate add activity modal
    function showAddActivityModal() {
        // Create modal container
        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';
        modalContainer.style.position = 'fixed';
        modalContainer.style.top = '0';
        modalContainer.style.left = '0';
        modalContainer.style.width = '100%';
        modalContainer.style.height = '100%';
        modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        modalContainer.style.display = 'flex';
        modalContainer.style.alignItems = 'center';
        modalContainer.style.justifyContent = 'center';
        modalContainer.style.zIndex = '1000';
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.borderRadius = '8px';
        modalContent.style.width = '90%';
        modalContent.style.maxWidth = '500px';
        modalContent.style.maxHeight = '90vh';
        modalContent.style.overflowY = 'auto';
        modalContent.style.padding = '20px';
        modalContent.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        
        // Modal header
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        modalHeader.style.display = 'flex';
        modalHeader.style.justifyContent = 'space-between';
        modalHeader.style.alignItems = 'center';
        modalHeader.style.marginBottom = '20px';
        
        const modalTitle = document.createElement('h3');
        modalTitle.textContent = 'Add New Activity';
        modalTitle.style.margin = '0';
        
        const closeButton = document.createElement('button');
        closeButton.innerHTML = '&times;';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.fontSize = '1.5rem';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '0';
        closeButton.style.lineHeight = '1';
        
        modalHeader.appendChild(modalTitle);
        modalHeader.appendChild(closeButton);
        
        // Modal body
        const modalBody = document.createElement('div');
        modalBody.className = 'modal-body';
        
        modalBody.innerHTML = `
            <form id="activity-form">
                <div class="form-group" style="margin-bottom: 15px;">
                    <label for="activity-type" style="display: block; margin-bottom: 8px; font-weight: 500;">Activity Type</label>
                    <select id="activity-type" name="activity-type" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                        <option value="">Select activity type</option>
                        <option value="planting">Planting</option>
                        <option value="harvesting">Harvesting</option>
                        <option value="fertilizing">Fertilizing</option>
                        <option value="watering">Watering</option>
                        <option value="pesticide">Pesticide Application</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="form-group" style="margin-bottom: 15px;">
                    <label for="activity-title" style="display: block; margin-bottom: 8px; font-weight: 500;">Title</label>
                    <input type="text" id="activity-title" name="activity-title" placeholder="Enter activity title" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                
                <div class="form-group" style="margin-bottom: 15px;">
                    <label for="activity-description" style="display: block; margin-bottom: 8px; font-weight: 500;">Description</label>
                    <textarea id="activity-description" name="activity-description" rows="3" placeholder="Enter activity details" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; resize: vertical;"></textarea>
                </div>
                
                <div class="form-row" style="display: flex; gap: 15px; margin-bottom: 15px;">
                    <div class="form-group" style="flex: 1;">
                        <label for="activity-date" style="display: block; margin-bottom: 8px; font-weight: 500;">Date</label>
                        <input type="date" id="activity-date" name="activity-date" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div class="form-group" style="flex: 1;">
                        <label for="activity-time" style="display: block; margin-bottom: 8px; font-weight: 500;">Time</label>
                        <input type="time" id="activity-time" name="activity-time" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                </div>
                
                <div class="form-group" style="margin-bottom: 15px;">
                    <label for="activity-location" style="display: block; margin-bottom: 8px; font-weight: 500;">Location</label>
                    <select id="activity-location" name="activity-location" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                        <option value="">Select location</option>
                        <option value="field-a">Field A - North</option>
                        <option value="field-b">Field B - South</option>
                        <option value="field-c">Field C - East</option>
                        <option value="livestock">Livestock Area</option>
                        <option value="storage">Storage Facility</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; font-weight: 500;">Add Photos</label>
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <button type="button" style="display: flex; align-items: center; justify-content: center; padding: 8px 12px; background-color: #f9f9f9; border: 1px dashed #ddd; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-camera" style="margin-right: 8px;"></i>
                            <span>Take Photo</span>
                        </button>
                        <button type="button" style="display: flex; align-items: center; justify-content: center; padding: 8px 12px; background-color: #f9f9f9; border: 1px dashed #ddd; border-radius: 4px; cursor: pointer;">
                            <i class="fas fa-upload" style="margin-right: 8px;"></i>
                            <span>Upload</span>
                        </button>
                    </div>
                </div>
            </form>
        `;
        
        // Modal footer
        const modalFooter = document.createElement('div');
        modalFooter.className = 'modal-footer';
        modalFooter.style.display = 'flex';
        modalFooter.style.justifyContent = 'flex-end';
        modalFooter.style.gap = '10px';
        modalFooter.style.marginTop = '20px';
        
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.className = 'btn-secondary';
        cancelButton.style.padding = '10px 20px';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';
        
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Activity';
        saveButton.className = 'btn-primary';
        saveButton.style.padding = '10px 20px';
        saveButton.style.borderRadius = '4px';
        saveButton.style.cursor = 'pointer';
        
        modalFooter.appendChild(cancelButton);
        modalFooter.appendChild(saveButton);
        
        // Assemble modal
        modalContent.appendChild(modalHeader);
        modalContent.appendChild(modalBody);
        modalContent.appendChild(modalFooter);
        modalContainer.appendChild(modalContent);
        
        // Add modal to body
        document.body.appendChild(modalContainer);
        
        // Close modal events
        closeButton.addEventListener('click', function() {
            document.body.removeChild(modalContainer);
        });
        
        cancelButton.addEventListener('click', function() {
            document.body.removeChild(modalContainer);
        });
        
        modalContainer.addEventListener('click', function(e) {
            if (e.target === modalContainer) {
                document.body.removeChild(modalContainer);
            }
        });
        
        // Save activity
        saveButton.addEventListener('click', function() {
            const activityType = document.getElementById('activity-type').value;
            const activityTitle = document.getElementById('activity-title').value;
            
            if (!activityType || !activityTitle) {
                showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            showNotification('Activity saved successfully!', 'success');
            document.body.removeChild(modalContainer);
            
            // Add the new activity to the timeline
            addNewActivity(activityTitle);
        });
    }
    
    // Add new activity to timeline
    function addNewActivity(title) {
        const timeline = document.querySelector('.activity-timeline');
        
        if (timeline) {
            const newItem = document.createElement('div');
            newItem.className = 'timeline-item';
            
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            newItem.innerHTML = `
                <div class="timeline-icon">
                    <i class="fas fa-check"></i>
                </div>
                <div class="timeline-content">
                    <h4>${title}</h4>
                    <p>Activity added</p>
                    <div class="timeline-meta">
                        <span><i class="fas fa-calendar"></i> Today, ${timeString}</span>
                        <span><i class="fas fa-user"></i> John Doe</span>
                    </div>
                </div>
            `;
            
            // Add new item at the top
            timeline.insertBefore(newItem, timeline.firstChild);
            
            // Highlight the new item
            newItem.style.animation = 'fadeIn 0.5s ease-out';
            
            // Add animation keyframes
            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Notification function
    function showNotification(message, type = 'info') {
        // Check if notification container exists, if not create it
        let notificationContainer = document.querySelector('.notification-container');
        
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
            
            // Add styles for notification container
            notificationContainer.style.position = 'fixed';
            notificationContainer.style.top = '20px';
            notificationContainer.style.right = '20px';
            notificationContainer.style.zIndex = '1000';
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getIconForType(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        // Add styles for notification
        notification.style.backgroundColor = getColorForType(type);
        notification.style.color = 'white';
        notification.style.padding = '15px';
        notification.style.borderRadius = '5px';
        notification.style.marginBottom = '10px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.display = 'flex';
        notification.style.justifyContent = 'space-between';
        notification.style.alignItems = 'center';
        notification.style.minWidth = '300px';
        notification.style.maxWidth = '400px';
        notification.style.animation = 'slideIn 0.3s ease-out';
        
        // Add styles for notification content
        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.display = 'flex';
        notificationContent.style.alignItems = 'center';
        
        // Add styles for notification icon
        const icon = notification.querySelector('.notification-content i');
        icon.style.marginRight = '10px';
        
        // Add styles for close button
        const closeButton = notification.querySelector('.notification-close');
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.color = 'white';
        closeButton.style.cursor = 'pointer';
        
        // Add notification to container
        notificationContainer.appendChild(notification);
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // Close notification on click
        closeButton.addEventListener('click', function() {
            closeNotification(notification);
        });
        
        // Auto close after 5 seconds
        setTimeout(() => {
            closeNotification(notification);
        }, 5000);
    }
    
    function closeNotification(notification) {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }
    
    function getIconForType(type) {
        switch (type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }
    
    function getColorForType(type) {
        switch (type) {
            case 'success': return '#2ecc71';
            case 'error': return '#e74c3c';
            case 'warning': return '#f39c12';
            default: return '#3498db';
        }
    }
});