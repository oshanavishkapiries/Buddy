/**
 * Selectors for LinkedIn invite-accept functionality
 */
const selectors = {
    // Navigation selectors
    myNetworkLink: 'a.global-nav__primary-link[href*="mynetwork"]',
    showAllLink: 'a[href*="invitation-manager"]',

    // Invitation selectors
    acceptButton: 'button[data-view-name="invitation-action"][aria-label^="Accept"]',
    loadMoreButton: 'button:has-text("Load more")'
};

module.exports = selectors; 