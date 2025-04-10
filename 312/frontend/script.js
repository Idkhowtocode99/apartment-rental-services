// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth UI
    updateAuthUI();
    
    // Initialize featured listings
    initFeaturedListings();
    
    // Set up event listeners
    setupEventListeners();
  });
  
  function updateAuthUI() {
    const authButtonsContainer = document.getElementById('auth-buttons');
    
    if (Auth.isLoggedIn()) {
        const user = Auth.getCurrentUser();
        const initials = user.name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
        
        authButtonsContainer.innerHTML = `
            <div class="profile-container">
                <div class="profile-logo ${user.role === 'admin' ? 'admin' : ''}" id="profile-logo">
                    ${initials}
                </div>
                <span class="profile-name">${user.name}</span>
                <div class="profile-dropdown" id="profile-dropdown">
                    <div class="profile-dropdown-item" onclick="window.location.href='${user.role === 'admin' ? 'admin.html' : 'user-dashboard.html'}'">
                        <i class="fas fa-user"></i>
                        <div>
                            <div>${user.name}</div>
                            <div class="profile-role">${user.role}</div>
                        </div>
                    </div>
                    <div class="profile-dropdown-item" onclick="showEditProfileModal()">
                        <i class="fas fa-user-edit"></i>
                        <span>Edit Profile</span>
                    </div>
                    <div class="profile-dropdown-item" id="logout-btn">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </div>
                </div>
            </div>
        `;

        // Add edit profile modal to the page
        if (!document.getElementById('edit-profile-modal')) {
            const editProfileModal = `
                <div class="modal" id="edit-profile-modal">
                    <div class="modal-content">
                        <span class="close-modal">&times;</span>
                        <h2>Edit Profile</h2>
                        <form id="edit-profile-form">
                            <div class="form-group">
                                <label for="edit-name">Full Name</label>
                                <input type="text" id="edit-name" value="${user.name}" required>
                            </div>
                            <div class="form-group">
                                <label for="edit-email">Email</label>
                                <input type="email" id="edit-email" value="${user.email}" required>
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', editProfileModal);

            // Add event listener for edit profile form
            const editProfileForm = document.getElementById('edit-profile-form');
            editProfileForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const updatedUser = {
                    name: document.getElementById('edit-name').value,
                    email: document.getElementById('edit-email').value
                };
                const result = Auth.updateUser(updatedUser);
                if (result.success) {
                    showNotification('Profile updated successfully!');
                    document.getElementById('edit-profile-modal').style.display = 'none';
                    updateAuthUI(); // Refresh the UI
                }
            });
        }
        
        // Add event listeners for profile dropdown
        const profileLogo = document.getElementById('profile-logo');
        const profileDropdown = document.getElementById('profile-dropdown');
        
        profileLogo.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function() {
            profileDropdown.classList.remove('show');
        });
        
        // Logout functionality
        document.getElementById('logout-btn').addEventListener('click', function() {
            Auth.logout();
            showNotification('Successfully logged out!');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        });
        
    } else {
        authButtonsContainer.innerHTML = `
            <a href="login.html" class="btn btn-primary">Login</a>
            <a href="signup.html" class="btn btn-secondary">Sign Up</a>
        `;
    }
}

// Add this function to show the edit profile modal
function showEditProfileModal() {
    const modal = document.getElementById('edit-profile-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}
  
  function setupEventListeners() {
    // Property listing button
    const listPropertyBtn = document.getElementById('list-property-btn');
    if (listPropertyBtn) {
      listPropertyBtn.addEventListener('click', function() {
        if (Auth.isLoggedIn()) {
          // Redirect to property listing form or show modal
          alert('Property listing form will be implemented in the next phase.');
        } else {
          // Show login prompt
          showAuthModal();
        }
      });
    }
    
    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const modal = this.closest('.modal');
        modal.style.display = 'none';
      });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
      const modals = document.querySelectorAll('.modal');
      modals.forEach(modal => {
        if (event.target === modal) {
          modal.style.display = 'none';
        }
      });
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        contactForm.reset();
      });
    }
  }
  
  function showAuthModal() {
    const authModal = document.getElementById('auth-modal');
    authModal.style.display = 'block';
  }
  
  function initFeaturedListings() {
    const featuredListingsGrid = document.getElementById('featured-listings-grid');
    if (!featuredListingsGrid) return;
    
    // Sample listings data
    const listings = [
      {
        id: 1,
        title: 'Modern Downtown Apartment',
        location: 'Downtown, City',
        price: 1500,
        bedrooms: 2,
        bathrooms: 1,
        area: 850,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
      },
      {
        id: 2,
        title: 'Luxury Condo with View',
        location: 'Riverside, City',
        price: 2200,
        bedrooms: 3,
        bathrooms: 2,
        area: 1200,
        image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80'
      },
      {
        id: 3,
        title: 'Cozy Studio Apartment',
        location: 'University District, City',
        price: 950,
        bedrooms: 0,
        bathrooms: 1,
        area: 450,
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'
      },
      {
        id: 4,
        title: 'Family Home with Garden',
        location: 'Suburbs, City',
        price: 2800,
        bedrooms: 4,
        bathrooms: 2.5,
        area: 1800,
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&q=80'
      },
      {
        id: 5,
        title: 'Renovated Historic Apartment',
        location: 'Old Town, City',
        price: 1700,
        bedrooms: 2,
        bathrooms: 1,
        area: 900,
        image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80'
      },
      {
        id: 6,
        title: 'Modern Loft Apartment',
        location: 'Arts District, City',
        price: 1900,
        bedrooms: 1,
        bathrooms: 1.5,
        area: 950,
        image: 'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80'
      }
    ];
    
    // Generate HTML for listings
    let listingsHTML = '';
    
    listings.forEach(listing => {
      listingsHTML += `
        <div class="listing-card" data-id="${listing.id}">
          <div class="listing-image">
            <img src="${listing.image}" alt="${listing.title}">
            <div class="listing-price">$${listing.price}/month</div>
          </div>
          <div class="listing-details">
            <h3 class="listing-title">${listing.title}</h3>
            <div class="listing-location">
              <i class="fas fa-map-marker-alt"></i> ${listing.location}
            </div>
            <div class="listing-features">
              <div class="listing-feature">
                <i class="fas fa-bed"></i> ${listing.bedrooms} ${listing.bedrooms === 0 ? 'Studio' : listing.bedrooms === 1 ? 'Bed' : 'Beds'}
              </div>
              <div class="listing-feature">
                <i class="fas fa-bath"></i> ${listing.bathrooms} ${listing.bathrooms === 1 ? 'Bath' : 'Baths'}
              </div>
              <div class="listing-feature">
                <i class="fas fa-vector-square"></i> ${listing.area} sq ft
              </div>
            </div>
            <div class="listing-actions">
              <button class="btn btn-primary view-details-btn" data-id="${listing.id}">View Details</button>
              <button class="btn btn-secondary save-listing-btn" data-id="${listing.id}">
                <i class="far fa-heart"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });
    
    featuredListingsGrid.innerHTML = listingsHTML;
    
    // Add event listeners to view details buttons
    const viewDetailsButtons = document.querySelectorAll('.view-details-btn');
    viewDetailsButtons.forEach(button => {
      button.addEventListener('click', function() {
        const listingId = this.getAttribute('data-id');
        showPropertyDetails(listingId);
      });
    });
    
    // Add event listeners to save listing buttons
    const saveListingButtons = document.querySelectorAll('.save-listing-btn');
    saveListingButtons.forEach(button => {
      button.addEventListener('click', function() {
        if (Auth.isLoggedIn()) {
          const listingId = this.getAttribute('data-id');
          // Toggle saved state
          if (this.classList.contains('saved')) {
            this.classList.remove('saved');
            this.innerHTML = '<i class="far fa-heart"></i>';
            showNotification('Listing removed from saved properties');
          } else {
            this.classList.add('saved');
            this.innerHTML = '<i class="fas fa-heart"></i>';
            showNotification('Listing saved to your account');
          }
        } else {
          showAuthModal();
        }
      });
    });
  }
  
  function showPropertyDetails(listingId) {
    // Find the listing data
    const listings = [
      {
        id: 1,
        title: 'Modern Downtown Apartment',
        location: 'Downtown, City',
        price: 1500,
        bedrooms: 2,
        bathrooms: 1,
        area: 850,
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        description: 'This beautiful modern apartment is located in the heart of downtown. It features hardwood floors, stainless steel appliances, and large windows with city views. The building includes a fitness center and rooftop terrace.',
        amenities: ['Air Conditioning', 'In-unit Laundry', 'Dishwasher', 'Fitness Center', 'Rooftop Terrace', 'Elevator', 'Pet Friendly'],
        gallery: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
          'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=800&q=80',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
          'https://images.unsplash.com/photo-1560185007-c5ca9d2c0862?w=800&q=80'
        ],
        agent: {
          name: 'Jane Smith',
          phone: '(123) 456-7890',
          email: 'jane@apartmentfinder.com'
        }
      },
      // Other listings would be defined here
    ];
    
    const listing = listings.find(l => l.id == listingId) || listings[0];
    
    // Populate the modal with property details
    const propertyDetailsContainer = document.getElementById('property-details');
    
    let galleryHTML = '';
    listing.gallery.forEach(img => {
      galleryHTML += `<img src="${img}" alt="Property Image">`;
    });
    
    let amenitiesHTML = '';
    listing.amenities.forEach(amenity => {
      amenitiesHTML += `<div class="property-feature"><i class="fas fa-check"></i> ${amenity}</div>`;
    });
    
    propertyDetailsContainer.innerHTML = `
      <img src="${listing.image}" alt="${listing.title}" class="property-main-image">
      
      <div class="property-gallery">
        ${galleryHTML}
      </div>
      
      <div class="property-info">
        <div class="property-primary-info">
          <h2>${listing.title}</h2>
          <div class="listing-location">
            <i class="fas fa-map-marker-alt"></i> ${listing.location}
          </div>
          <div class="listing-features">
            <div class="listing-feature">
              <i class="fas fa-bed"></i> ${listing.bedrooms} ${listing.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
            </div>
            <div class="listing-feature">
              <i class="fas fa-bath"></i> ${listing.bathrooms} ${listing.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
            </div>
            <div class="listing-feature">
              <i class="fas fa-vector-square"></i> ${listing.area} sq ft
            </div>
          </div>
          
          <h3>Description</h3>
          <p>${listing.description}</p>
          
          <h3>Amenities</h3>
          <div class="property-features">
            ${amenitiesHTML}
          </div>
        </div>
        
        <div class="property-secondary-info">
          <h3>$${listing.price}/month</h3>
          <p>Available Now</p>
          
          <h4>Contact Agent</h4>
          <p><strong>${listing.agent.name}</strong></p>
          <p><i class="fas fa-phone"></i> ${listing.agent.phone}</p>
          <p><i class="fas fa-envelope"></i> ${listing.agent.email}</p>
          
          <div class="property-actions">
            <button class="btn btn-primary" id="schedule-viewing-btn">Schedule Viewing</button>
            <button class="btn btn-secondary" id="contact-agent-btn">Contact Agent</button>
          </div>
        </div>
      </div>
    `;
    
    // Show the modal
    const propertyModal = document.getElementById('property-modal');
    propertyModal.style.display = 'block';
    
    // Add event listeners for the gallery images
    const galleryImages = propertyModal.querySelectorAll('.property-gallery img');
    const mainImage = propertyModal.querySelector('.property-main-image');
    
    galleryImages.forEach(img => {
      img.addEventListener('click', function() {
        mainImage.src = this.src;
      });
    });
    
    // Add event listeners for the action buttons
    const scheduleViewingBtn = document.getElementById('schedule-viewing-btn');
    const contactAgentBtn = document.getElementById('contact-agent-btn');
    
    if (scheduleViewingBtn) {
      scheduleViewingBtn.addEventListener('click', function() {
        if (Auth.isLoggedIn()) {
          alert('Scheduling feature will be implemented in the next phase.');
        } else {
          propertyModal.style.display = 'none';
          showAuthModal();
        }
      });
    }
    
    if (contactAgentBtn) {
      contactAgentBtn.addEventListener('click', function() {
        if (Auth.isLoggedIn()) {
          alert(`Contact ${listing.agent.name} at ${listing.agent.email} or ${listing.agent.phone}`);
        } else {
          propertyModal.style.display = 'none';
          showAuthModal();
        }
      });
    }
  }
  
  // Admin Dashboard Functions
  function initTransactionData() {
    const transactionsTableBody = document.getElementById('transactions-table-body');
    if (!transactionsTableBody) return;
    
    // Sample transaction data
    const transactions = [
      {
        id: 'TRX-001',
        date: '2023-06-15',
        user: 'John Doe',
        property: 'Modern Downtown Apartment',
        amount: 1500,
        status: 'completed'
      },
      {
        id: 'TRX-002',
        date: '2023-06-14',
        user: 'Jane Smith',
        property: 'Luxury Condo with View',
        amount: 2200,
        status: 'pending'
      },
      {
        id: 'TRX-003',
        date: '2023-06-12',
        user: 'Robert Johnson',
        property: 'Cozy Studio Apartment',
        amount: 950,
        status: 'completed'
      },
      {
        id: 'TRX-004',
        date: '2023-06-10',
        user: 'Emily Davis',
        property: 'Family Home with Garden',
        amount: 2800,
        status: 'cancelled'
      },
      {
        id: 'TRX-005',
        date: '2023-06-08',
        user: 'Michael Wilson',
        property: 'Renovated Historic Apartment',
        amount: 1700,
        status: 'completed'
      }
    ];
    
    // Generate HTML for transactions table
    let transactionsHTML = '';
    
    transactions.forEach(transaction => {
      const statusClass = `status-${transaction.status}`;
      const statusText = transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);
      
      transactionsHTML += `
        <tr>
          <td>${transaction.id}</td>
          <td>${transaction.date}</td>
          <td>${transaction.user}</td>
          <td>${transaction.property}</td>
          <td>$${transaction.amount}</td>
          <td><span class="status-badge ${statusClass}">${statusText}</span></td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-primary view-transaction-btn" data-id="${transaction.id}">View</button>
              ${transaction.status === 'pending' ? `
                <button class="btn btn-success approve-transaction-btn" data-id="${transaction.id}">Approve</button>
                <button class="btn btn-danger cancel-transaction-btn" data-id="${transaction.id}">Cancel</button>
              ` : ''}
            </div>
          </td>
        </tr>
      `;
    });
    
    transactionsTableBody.innerHTML = transactionsHTML;
    
    // Add event listeners for transaction actions
    const viewButtons = document.querySelectorAll('.view-transaction-btn');
    const approveButtons = document.querySelectorAll('.approve-transaction-btn');
    const cancelButtons = document.querySelectorAll('.cancel-transaction-btn');
    
    viewButtons.forEach(button => {
      button.addEventListener('click', function() {
        const transactionId = this.getAttribute('data-id');
        alert(`Viewing details for transaction ${transactionId}`);
      });
    });
    
    approveButtons.forEach(button => {
      button.addEventListener('click', function() {
        const transactionId = this.getAttribute('data-id');
        alert(`Transaction ${transactionId} has been approved`);
        // In a real app, you would update the status in the database
        // and refresh the table
      });
    });
    
    cancelButtons.forEach(button => {
      button.addEventListener('click', function() {
        const transactionId = this.getAttribute('data-id');
        alert(`Transaction ${transactionId} has been cancelled`);
        // In a real app, you would update the status in the database
        // and refresh the table
      });
    });
    
    // Update transaction count in dashboard
    const transactionCountElement = document.getElementById('transaction-count');
    if (transactionCountElement) {
      transactionCountElement.textContent = transactions.length;
    }
    
    // Update recent activity
    updateRecentActivity(transactions);
    
    // Set up transaction filter
    const applyTransactionFilterBtn = document.getElementById('apply-transaction-filter');
    if (applyTransactionFilterBtn) {
      applyTransactionFilterBtn.addEventListener('click', function() {
        const filterValue = document.getElementById('transaction-filter').value;
        const searchValue = document.getElementById('transaction-search').value.toLowerCase();
        
        // Filter transactions based on status and search term
        const filteredTransactions = transactions.filter(transaction => {
          const matchesStatus = filterValue === 'all' || transaction.status === filterValue;
          const matchesSearch = transaction.id.toLowerCase().includes(searchValue) ||
                               transaction.user.toLowerCase().includes(searchValue) ||
                               transaction.property.toLowerCase().includes(searchValue);
          
          return matchesStatus && matchesSearch;
        });
        
        // Update table with filtered transactions
        let filteredHTML = '';
        
        if (filteredTransactions.length === 0) {
          filteredHTML = `<tr><td colspan="7" class="no-data">No transactions found</td></tr>`;
        } else {
          filteredTransactions.forEach(transaction => {
            const statusClass = `status-${transaction.status}`;
            const statusText = transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1);
            
            filteredHTML += `
              <tr>
                <td>${transaction.id}</td>
                <td>${transaction.date}</td>
                <td>${transaction.user}</td>
                <td>${transaction.property}</td>
                <td>$${transaction.amount}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                  <div class="action-buttons">
                    <button class="btn btn-primary view-transaction-btn" data-id="${transaction.id}">View</button>
                    ${transaction.status === 'pending' ? `
                      <button class="btn btn-success approve-transaction-btn" data-id="${transaction.id}">Approve</button>
                      <button class="btn btn-danger cancel-transaction-btn" data-id="${transaction.id}">Cancel</button>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `;
          });
        }
        
        transactionsTableBody.innerHTML = filteredHTML;
      });
    }
  }
  
  function initUserData() {
    const usersTableBody = document.getElementById('users-table-body');
    if (!usersTableBody) return;
    
    // Sample user data
    const users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'tenant',
        joined: '2023-01-15'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'landlord',
        joined: '2023-02-20'
      },
      {
        id: 3,
        name: 'Admin User',
        email: 'admin@apartmentfinder.com',
        role: 'admin',
        joined: '2023-01-01'
      },
      {
        id: 4,
        name: 'Robert Johnson',
        email: 'robert@example.com',
        role: 'tenant',
        joined: '2023-03-10'
      },
      {
        id: 5,
        name: 'Emily Davis',
        email: 'emily@example.com',
        role: 'landlord',
        joined: '2023-04-05'
      }
    ];
    
    // Generate HTML for users table
    let usersHTML = '';
    
    users.forEach(user => {
      const roleClass = `role-${user.role}`;
      const roleText = user.role.charAt(0).toUpperCase() + user.role.slice(1);
      
      usersHTML += `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td><span class="status-badge ${roleClass}">${roleText}</span></td>
          <td>${user.joined}</td>
          <td>
            <div class="action-buttons">
              <button class="btn btn-primary view-user-btn" data-id="${user.id}">View</button>
              <button class="btn btn-secondary edit-user-btn" data-id="${user.id}">Edit</button>
              ${user.role !== 'admin' ? `<button class="btn btn-danger delete-user-btn" data-id="${user.id}">Delete</button>` : ''}
            </div>
          </td>
        </tr>
      `;
    });
    
    usersTableBody.innerHTML = usersHTML;
    
    // Add event listeners for user actions
    const viewButtons = document.querySelectorAll('.view-user-btn');
    const editButtons = document.querySelectorAll('.edit-user-btn');
    const deleteButtons = document.querySelectorAll('.delete-user-btn');
    
    viewButtons.forEach(button => {
      button.addEventListener('click', function() {
        const userId = this.getAttribute('data-id');
        alert(`Viewing details for user ${userId}`);
      });
    });
    
    editButtons.forEach(button => {
      button.addEventListener('click', function() {
        const userId = this.getAttribute('data-id');
        alert(`Editing user ${userId}`);
      });
    });
    
    deleteButtons.forEach(button => {
      button.addEventListener('click', function() {
        const userId = this.getAttribute('data-id');
        if (confirm(`Are you sure you want to delete user ${userId}?`)) {
          alert(`User ${userId} has been deleted`);
          // In a real app, you would delete the user from the database
          // and refresh the table
        }
      });
    });
    
    // Update user count in dashboard
    const userCountElement = document.getElementById('user-count');
    if (userCountElement) {
      userCountElement.textContent = users.length;
    }
    
    // Set up user search
    const applyUserFilterBtn = document.getElementById('apply-user-filter');
    if (applyUserFilterBtn) {
      applyUserFilterBtn.addEventListener('click', function() {
        const searchValue = document.getElementById('user-search').value.toLowerCase();
        
        // Filter users based on search term
        const filteredUsers = users.filter(user => {
          return user.name.toLowerCase().includes(searchValue) ||
                 user.email.toLowerCase().includes(searchValue) ||
                 user.role.toLowerCase().includes(searchValue);
        });
        
        // Update table with filtered users
        let filteredHTML = '';
        
        if (filteredUsers.length === 0) {
          filteredHTML = `<tr><td colspan="5" class="no-data">No users found</td></tr>`;
        } else {
          filteredUsers.forEach(user => {
            const roleClass = `role-${user.role}`;
            const roleText = user.role.charAt(0).toUpperCase() + user.role.slice(1);
            
            filteredHTML += `
              <tr>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td><span class="status-badge ${roleClass}">${roleText}</span></td>
                <td>${user.joined}</td>
                <td>
                  <div class="action-buttons">
                    <button class="btn btn-primary view-user-btn" data-id="${user.id}">View</button>
                    <button class="btn btn-secondary edit-user-btn" data-id="${user.id}">Edit</button>
                    ${user.role !== 'admin' ? `<button class="btn btn-danger delete-user-btn" data-id="${user.id}">Delete</button>` : ''}
                  </div>
                </td>
              </tr>
            `;
          });
        }
        
        usersTableBody.innerHTML = filteredHTML;
      });
    }
  }
  
  function updateRecentActivity(transactions) {
    const activityList = document.getElementById('recent-activity-list');
    if (!activityList) return;
    
    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Take the 5 most recent transactions
    const recentTransactions = sortedTransactions.slice(0, 5);
    
    if (recentTransactions.length === 0) {
      activityList.innerHTML = `<p class="no-data">No recent activity</p>`;
      return;
    }
    
    let activityHTML = '';
    
    recentTransactions.forEach(transaction => {
      const iconClass = transaction.status === 'completed' ? 'fa-check-circle' :
                       transaction.status === 'pending' ? 'fa-clock' : 'fa-times-circle';
      
      activityHTML += `
        <div class="activity-item">
          <div class="activity-icon">
            <i class="fas ${iconClass}"></i>
          </div>
          <div class="activity-details">
            <div class="activity-title">${transaction.user} - ${transaction.property}</div>
            <div class="activity-time">${transaction.date} - $${transaction.amount}</div>
          </div>
        </div>
      `;
    });
    
    activityList.innerHTML = activityHTML;
  }
  
  function updateDashboardStats() {
    // Update listing count
    const listingCountElement = document.getElementById('listing-count');
    if (listingCountElement) {
      // In a real app, this would come from the database
      listingCountElement.textContent = '6';
    }
    
    // Update revenue amount
    const revenueAmountElement = document.getElementById('revenue-amount');
    if (revenueAmountElement) {
      // In a real app, this would be calculated from transactions
      revenueAmountElement.textContent = '$9,150';
    }
  }

function showNotification(message) {
    // Create notification element if it doesn't exist
    let notification = document.querySelector('.notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.className = 'notification success';
        document.body.appendChild(notification);
    }

    // Set message and show notification
    notification.textContent = message;
    notification.classList.add('show');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}